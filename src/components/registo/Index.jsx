import React, { useState } from 'react';
import './register.css';

/**
 * Esta função é responsavel pela criação da secçao de registo no qual um
 * utilizador pode criar uma conta
 * @returns Fragment da secção registo
 */
export default function Register() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMensagem({ texto: '', tipo: '' });

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                setMensagem({ texto: 'Conta criada com sucesso! A redirecionar para o Login...', tipo: 'sucesso' });
                
                setNome('');
                setEmail('');
                setPassword('');
                setTimeout(() => {
                    window.location.href = '/login'; 
                }, 2000);

            } else {
                setMensagem({ texto: data.message || 'Erro ao criar conta.', tipo: 'erro' });
            }
        } catch (error) {
            setMensagem({ texto: 'Erro de ligação ao servidor. Verifica se o back-end está a correr.', tipo: 'erro' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-section">
            <div className="register-container">
                <h2>Criar Conta</h2>
                <p>Junte-se à comunidade do Centro Académico Clínico dos Açores.</p>
                
                <form className="form-register" onSubmit={handleRegister} noValidate>
                    <input 
                        type="text" 
                        placeholder="O seu nome completo" 
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required 
                    />
                    <input 
                        type="email" 
                        placeholder="O seu email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder="Crie uma palavra-passe" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                        minLength="6"
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'A registar...' : 'Registar Conta'}
                    </button>
                </form>

                {mensagem.texto && (
                    <div className={`mensagem-alerta ${mensagem.tipo}`}>
                        {mensagem.texto}
                    </div>
                )}
                
                <div className="register-footer">
                    Já tem uma conta? <a href="/login">Inicie Sessão aqui</a>.
                </div>
            </div>
        </div>
    );
}