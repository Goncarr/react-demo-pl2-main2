import React, { useState, useEffect, useRef } from 'react';
import { obterTodosEventos, adicionarEvento, atualizarEvento, removerEvento } from '../../indexedDB/db';
import './evento.css'; 

/**
 * Esta função 
 * @param {*} local 
 * @param {*} data 
 * @returns 
 */
async function buscarPrevisaoMeteorologica(local, data) {
    try {
        const localFormatado = encodeURIComponent(local.trim());
        const url = `https://wttr.in/${localFormatado}?format=j1&lang=pt`;

        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erro: ${response.status}`);

        const dados = await response.json();
        const previsaoAtual = dados.current_condition[0];
        const previsaoDias = dados.weather || [];

        let previsaoParaData = null;
        const dataObj = new Date(data);
        const dataStr = dataObj.toISOString().split('T')[0];

        for (const dia of previsaoDias) {
            if (dia.date === dataStr) {
                previsaoParaData = dia;
                break;
            }
        }

        if (!previsaoParaData && previsaoDias.length > 0) {
            previsaoParaData = previsaoDias[0];
        }

        const condicoes = {
            '113': '☀️ Limpo', '116': '⛅ Parcialmente nublado', '119': '☁️ Nublado',
            '122': '☁️ Muito nublado', '176': '🌧️ Chuva fraca', '200': '⛈️ Trovoada',
            '248': '🌫️ Nevoeiro', '296': '🌧️ Chuva ligeira', '302': '🌧️ Chuva intensa',
            '353': '🌧️ Chuva fraca', '386': '⛈️ Trovoada'
        };

        const weatherCode = previsaoParaData?.hourly?.[0]?.weatherCode || previsaoAtual?.weatherCode || '113';
        const condicao = condicoes[weatherCode] || `☁️ ${previsaoAtual?.lang_pt?.[0]?.value || 'Nublado'}`;

        // Formatação exata igual ao teu print screen
        let temperatura = 'N/A';
        let humidade = 'N/A';
        let vento = 'N/A';

        if (previsaoParaData && previsaoParaData.avgtempC) {
            temperatura = `${previsaoParaData.avgtempC}°C (média do dia)`;
            // Tenta extrair humidade e vento das métricas diárias ou do primeiro horário do dia
            humidade = previsaoParaData.hourly?.[0]?.humidity ? `${previsaoParaData.hourly[0].humidity}%` : 'N/A';
            vento = previsaoParaData.hourly?.[0]?.windspeedKmph ? `${previsaoParaData.hourly[0].windspeedKmph} km/h` : 'N/A';
        } else if (previsaoAtual) {
            temperatura = `${previsaoAtual.temp_C}°C`;
            humidade = `${previsaoAtual.humidity}%`;
            vento = `${previsaoAtual.windspeedKmph} km/h`;
        }

        return { condicao, temperatura, humidade, vento };

    } catch (error) {
        console.error('Erro ao buscar tempo:', error);
        return { condicao: '⚠️ Erro ao carregar', temperatura: 'N/A', humidade: 'N/A', vento: 'N/A' };
    }
}

export default function GestaoEventos() {
    const [eventos, setEventos] = useState([]);
    const [editandoId, setEditandoId] = useState(null);
    const [mensagem, setMensagem] = useState('');
    const formRef = useRef(null);
    
    const user = JSON.parse(localStorage.getItem('user')); 

    // Helper para sabermos facilmente se é admin
    const isAdmin = user && user.role === 'admin';

    // Estado para controlar o painel de exibição do clima do print
    const [climaSelecionado, setClimaSelecionado] = useState(null);
    const [carregandoClima, setCarregandoClima] = useState(false);
    
    const [formData, setFormData] = useState({
        titulo: '', descricao: '', data: '', hora: '', local: ''
    });

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            const dados = await obterTodosEventos();
            setEventos(dados);
        } catch (error) {
            console.error("Erro ao carregar eventos:", error);
        }
    };

    // Formata a data de YYYY-MM-DD para DD/MM/YYYY apenas para exibição visual
    const formatarDataVisual = (dataStr) => {
        if (!dataStr) return '';
        const [ano, mes, dia] = dataStr.split('-');
        return `${dia}/${mes}/${ano}`;
    };

    const handleVerClima = async (evento) => {
        setCarregandoClima(true);
        // Fecha temporariamente para dar o efeito de recarga se clicar noutro evento
        setClimaSelecionado(null); 

        const dadosClima = await buscarPrevisaoMeteorologica(evento.local, evento.data);
        
        setClimaSelecionado({
            local: evento.local,
            data: formatarDataVisual(evento.data),
            ...dadosClima
        });
        setCarregandoClima(false);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editandoId) {
                await atualizarEvento(editandoId, formData);
                mostrarMensagem("Evento atualizado com sucesso!");
            } else {
                await adicionarEvento(formData);
                mostrarMensagem("Evento adicionado com sucesso!");
            }
            limparFormulario();
            carregarDados();
        } catch (error) {
            mostrarMensagem("Ocorreu um erro.", true);
        }
    };

    const handleEditar = (evento) => {
        setEditandoId(evento.id);
        setFormData({
            titulo: evento.titulo, descricao: evento.descricao,
            data: evento.data, hora: evento.hora, local: evento.local
        });
        if (formRef.current) formRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    const handleApagar = async (id) => {
        if (window.confirm("Tem a certeza que quer apagar este evento?")) {
            try {
                await removerEvento(id);
                mostrarMensagem("Evento apagado com sucesso!");
                carregarDados();
                if (climaSelecionado) setClimaSelecionado(null);
            } catch (error) {
                mostrarMensagem("Erro ao apagar o evento.", true);
            }
        }
    };

    const limparFormulario = () => {
        setFormData({ titulo: '', descricao: '', data: '', hora: '', local: '' });
        setEditandoId(null);
    };

    const mostrarMensagem = (msg) => {
        setMensagem(msg);
        setTimeout(() => setMensagem(''), 3000);
    };

    return (
        <div ref={formRef} id="Eventos">
            <h1>Gestão de Eventos</h1>
        
            <div className="eventos-section">
                <div className="eventos-container" >
                    {/* FORMULÁRIO */}
                    {isAdmin && (
                        <div className="eventos-form-section">
                            <h3 id="form-evento-titulo">{editandoId ? 'Editar Evento' : 'Adicionar Novo Evento'}</h3>
                            <form id="form-evento" className="form-evento" onSubmit={handleSubmit}>
                                <input type="text" name="titulo" value={formData.titulo} onChange={handleChange} placeholder="Título do Evento*" required />
                                <textarea name="descricao" value={formData.descricao} onChange={handleChange} placeholder="Descrição do Evento*" required />
                                <div className="form-row">
                                    <input type="date" name="data" value={formData.data} onChange={handleChange} required />
                                    <input type="time" name="hora" value={formData.hora} onChange={handleChange} required />
                                </div>
                                <input type="text" name="local" value={formData.local} onChange={handleChange} placeholder="Local do Evento*" required />
                                <div>
                                    <button type="submit">{editandoId ? 'Atualizar Evento' : 'Salvar Evento'}</button>
                                    {editandoId && <button type="button" onClick={limparFormulario} style={{ marginLeft: '10px' }}>Cancelar</button>}
                                </div>
                            </form>
                            {mensagem && <div className="evento-mensagem">{mensagem}</div>}
                        </div>
                    )}
                    <div className="eventos-list-section">
                        <h3>Eventos Programados</h3>

                        {carregandoClima && <div className="clima-loading">⏳ A consultar meteorologia...</div>}
                        
                        {climaSelecionado && (
                            <div className="clima-card-container">
                                <h4>🌤️ Previsão para {climaSelecionado.local}</h4>
                                <div className="clima-card-detalhes">
                                    <p><strong>Data:</strong> {climaSelecionado.data}</p>
                                    <p><strong>Condição:</strong> {climaSelecionado.condicao}</p>
                                    <p><strong>Temperatura:</strong> {climaSelecionado.temperatura}</p>
                                    <p><strong>Humidade:</strong> {climaSelecionado.humidade}</p>
                                    <p><strong>Vento:</strong> {climaSelecionado.vento}</p>
                                    <span className="clima-fonte">Fonte: wttr.in (API gratuita)</span>
                                </div>
                            </div>
                        )}

                        <div className="eventos-tabela">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Título</th>
                                        <th>Descrição</th>
                                        <th>Data</th>
                                        <th>Hora</th>
                                        <th>Local</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {eventos.length === 0 ? (
                                        <tr><td colSpan="6" style={{ textAlign: 'center' }}>Não há eventos guardados.</td></tr>
                                    ) : (
                                        eventos.map(evento => (
                                            <tr key={evento.id}>
                                                <td>{evento.titulo}</td>
                                                <td>{evento.descricao}</td>
                                                <td>{formatarDataVisual(evento.data)}</td>
                                                <td>{evento.hora}</td>
                                                <td>{evento.local}</td>
                                                <td>
                                                    <div className="eventos-actions">
                                                        {isAdmin && (
                                                            <>
                                                            <button type="button" className="btn-editar" onClick={() => handleEditar(evento)} title="Editar Evento">
                                                                ✏️
                                                            </button>

                                                            <button type="button" className="btn-remover" onClick={() => handleApagar(evento.id)} title="Apagar Evento">
                                                                🚫
                                                            </button>
                                                            </>
                                                        )}  
                                                        <button type="button" className="btn-tempo" onClick={() => handleVerClima(evento)} title="Ver Meteorologia">
                                                            ☁️
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
