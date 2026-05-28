import React, { useState } from 'react';
import './login.css';

/**
 * Esta função é repoinsavel pela criaçao do comonente de login do utilizador, no qual
 * verifica que ele existe na base de dados e que tipo de utilizador é
 * @returns Fragmento para a secção de login
 */
export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMensagem({ texto: '', tipo: '' });

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                setMensagem({ texto: 'Login efetuado com sucesso! A redirecionar...', tipo: 'sucesso' });
                
                setTimeout(() => {
                    window.location.href = '/'; 
                }, 1500);

            } else {
                setMensagem({ texto: data.message || 'Erro ao iniciar sessão.', tipo: 'erro' });
            }
        } catch (error) {
            setMensagem({ texto: 'Erro de ligação ao servidor. Verifica se o back-end está a correr na porta 5000.', tipo: 'erro' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-section">
            <div className="login-container">
                <h2>Iniciar Sessão</h2>
                <p>Acesso reservado a investigadores e parceiros do CACA.</p>
                
                <form className="form-login" onSubmit={handleLogin} noValidate>
                    <input 
                        type="email" 
                        placeholder="O seu email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder="A sua palavra-passe" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'A entrar...' : 'Entrar no Portal'}
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