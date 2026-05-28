import React, { useState, useEffect } from 'react';
import './perfil.css';

/**
 * Esta função está responsavel para criação da secção de Perfil, no qual  utilizador
 * pode ver o seu perfil bem como alterar o seu nome e palavra passe
 * @returns Fragmento para a secção de perfil
 */
export default function Perfil() {
    const [user, setUser] = useState(null);
    const [nome, setNome] = useState('');
    const [password, setPassword] = useState('');
    const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
    const [loading, setLoading] = useState(false);

    // Carregar os dados ao abrir a página
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser) {
            window.location.href = '/login';
        } else {
            setUser(storedUser);
            setNome(storedUser.nome);
        }
    }, []);

    const handleAtualizar = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMensagem({ texto: '', tipo: '' });
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:5000/api/users/perfil', {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ nome, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('user', JSON.stringify(data.user));
                setUser(data.user);
                setPassword('');
                setMensagem({ texto: 'Perfil atualizado com sucesso!', tipo: 'sucesso' });
            } else {
                setMensagem({ texto: data.message || 'Erro ao atualizar.', tipo: 'erro' });
            }
        } catch (error) {
            setMensagem({ texto: 'Erro de ligação ao servidor.', tipo: 'erro' });
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <p>A carregar...</p>;

    return (
        <div className="perfil-section">
            <div className="perfil-container">
                <h2>O Meu Perfil</h2>
                <div className="perfil-info-estatica">
                    <p><strong>Email:</strong> {user.email} <span className="nota">(Não editável)</span></p>
                    <p><strong>Permissão:</strong> {user.role === 'admin' ? 'Administrador' : 'Utilizador Regular'}</p>
                </div>

                <form className="form-perfil" onSubmit={handleAtualizar}>
                    <label>Nome Completo</label>
                    <input 
                        type="text" 
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required 
                    />
                    
                    <label>Nova Palavra-passe <span className="opcional">(Deixe em branco para manter)</span></label>
                    <input 
                        type="password" 
                        placeholder="Escreva a nova palavra-passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength="6"
                    />
                    
                    <button type="submit" disabled={loading}>
                        {loading ? 'A guardar...' : 'Guardar Alterações'}
                    </button>
                </form>

                {mensagem.texto && (
                    <div className={`mensagem-alerta ${mensagem.tipo}`}>
                        {mensagem.texto}
                    </div>
                )}
            </div>
        </div>
    );
}