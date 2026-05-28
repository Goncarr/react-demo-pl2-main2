// Ficheiro: src/utils/db.js

const DB_NAME = 'CACA_Database';
const DB_VERSION = 1;

const STORES = {
    EVENTOS: 'eventos',
    NEWSLETTER: 'newsletter'
};

let db = null;

function openDatabase() {
    return new Promise((resolve, reject) => {
        if (db && db.name === DB_NAME) {
            resolve(db);
            return;
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = function(event) {
            console.error('Erro ao abrir IndexedDB:', event.target.error);
            reject('Erro ao abrir base de dados');
        };

        request.onsuccess = function(event) {
            db = event.target.result;
            resolve(db);
        };

        request.onupgradeneeded = function(event) {
            const database = event.target.result;

            if (!database.objectStoreNames.contains(STORES.EVENTOS)) {
                const eventosStore = database.createObjectStore(STORES.EVENTOS, { keyPath: 'id', autoIncrement: true });
                eventosStore.createIndex('data', 'data', { unique: false });
                eventosStore.createIndex('titulo', 'titulo', { unique: false });
            }

            if (!database.objectStoreNames.contains(STORES.NEWSLETTER)) {
                const newsletterStore = database.createObjectStore(STORES.NEWSLETTER, { keyPath: 'id', autoIncrement: true });
                newsletterStore.createIndex('email', 'email', { unique: true });
                newsletterStore.createIndex('nome', 'nome', { unique: false });
            }
        };
    });
}

// === FUNÇÕES PARA EVENTOS ===

async function adicionarEvento(evento) {
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORES.EVENTOS], 'readwrite');
        const store = transaction.objectStore(STORES.EVENTOS);
        
        evento.dataCriacao = new Date().toISOString();
        const request = store.add(evento);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject('Erro ao adicionar evento');
    });
}

async function obterTodosEventos() {
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORES.EVENTOS], 'readonly');
        const store = transaction.objectStore(STORES.EVENTOS);
        const request = store.getAll();

        request.onsuccess = function() {
            const eventos = request.result || [];
            eventos.sort((a, b) => new Date(b.data) - new Date(a.data)); // Mais recentes primeiro
            resolve(eventos);
        };
        request.onerror = () => reject('Erro ao obter eventos');
    });
}

async function atualizarEvento(id, novosDados) {
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORES.EVENTOS], 'readwrite');
        const store = transaction.objectStore(STORES.EVENTOS);
        const request = store.get(id);

        request.onsuccess = function() {
            const evento = request.result;
            if (!evento) return reject('Evento não encontrado');

            evento.titulo = novosDados.titulo || evento.titulo;
            evento.descricao = novosDados.descricao || evento.descricao;
            evento.data = novosDados.data || evento.data;
            evento.hora = novosDados.hora || evento.hora;
            evento.local = novosDados.local || evento.local;
            evento.dataAtualizacao = new Date().toISOString();

            const updateRequest = store.put(evento);
            updateRequest.onsuccess = () => resolve(true);
            updateRequest.onerror = () => reject('Erro ao atualizar evento');
        };
    });
}

async function removerEvento(id) {
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORES.EVENTOS], 'readwrite');
        const store = transaction.objectStore(STORES.EVENTOS);
        const request = store.delete(id);

        request.onsuccess = () => resolve(true);
        request.onerror = () => reject('Erro ao remover evento');
    });
}

// ============================================================
// Funções para NEWSLETTER
// ============================================================

/**
 * Adiciona um novo subscritor da newsletter
 * @param {Object} subscritor - { nome, email }
 * @returns {Promise}
 */
function adicionarSubscritor(subscritor) {
    return new Promise(async (resolve, reject) => {
        try {
            const database = await openDatabase();

            // Verificar se email já existe
            const existe = await verificarEmailExiste(subscritor.email);
            if (existe) {
                reject('Este email já está subscrito na nossa newsletter!');
                return;
            }

            const transaction = database.transaction([STORES.NEWSLETTER], 'readwrite');
            const store = transaction.objectStore(STORES.NEWSLETTER);

            const request = store.add({
                nome: subscritor.nome,
                email: subscritor.email,
                dataSubscricao: new Date().toISOString()
            });

            request.onsuccess = function() {
                resolve(true);
            };

            request.onerror = function() {
                reject('Erro ao adicionar subscritor');
            };
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Verifica se um email já está subscrito
 * @param {string} email - Email a verificar
 * @returns {Promise<boolean>}
 */
function verificarEmailExiste(email) {
    return new Promise(async (resolve, reject) => {
        try {
            const database = await openDatabase();
            const transaction = database.transaction([STORES.NEWSLETTER], 'readonly');
            const store = transaction.objectStore(STORES.NEWSLETTER);
            const index = store.index('email');
            const request = index.get(email);

            request.onsuccess = function() {
                resolve(!!request.result);
            };

            request.onerror = function() {
                resolve(false);
            };
        } catch (error) {
            resolve(false);
        }
    });
}

/**
 * Obtém todos os subscritores
 * @returns {Promise}
 */
function obterTodosSubscritores() {
    return new Promise(async (resolve, reject) => {
        try {
            const database = await openDatabase();
            const transaction = database.transaction([STORES.NEWSLETTER], 'readonly');
            const store = transaction.objectStore(STORES.NEWSLETTER);
            const request = store.getAll();

            request.onsuccess = function() {
                resolve(request.result || []);
            };

            request.onerror = function() {
                reject('Erro ao obter subscritores');
            };
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Remove um subscritor pelo email
 * @param {string} email - Email do subscritor
 * @returns {Promise}
 */
function removerSubscritor(email) {
    return new Promise(async (resolve, reject) => {
        try {
            const database = await openDatabase();
            const transaction = database.transaction([STORES.NEWSLETTER], 'readwrite');
            const store = transaction.objectStore(STORES.NEWSLETTER);
            const index = store.index('email');
            const request = index.get(email);

            request.onsuccess = function() {
                const subscritor = request.result;
                if (subscritor) {
                    const deleteRequest = store.delete(subscritor.id);
                    deleteRequest.onsuccess = function() {
                        resolve(true);
                    };
                    deleteRequest.onerror = function() {
                        reject('Erro ao remover subscritor');
                    };
                } else {
                    reject('Subscritor não encontrado');
                }
            };

            request.onerror = function() {
                reject('Erro ao buscar subscritor');
            };
        } catch (error) {
            reject(error);
        }
    });
}


// === EXPORTAR PARA USAR NO REACT ===
export {
    openDatabase,
    adicionarEvento,
    obterTodosEventos,
    atualizarEvento,
    removerEvento,
    adicionarSubscritor
};