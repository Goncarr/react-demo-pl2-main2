import React, { useState, useEffect } from 'react';
import './newsletter.css'; 
import { adicionarSubscritor } from '../../indexedDB/db'; 

/**
 * Esta função é reponsavel pela secção de newsleets, no qual o utilizador
 * poderá se inscrever
 * @returns Fragment da secção newsletter
 */
export default function Newsletter() {
    const [form, setForm] = useState({ nome: '', email: '' });
    const [mensagem, setMensagem] = useState(null);
    const [loading, setLoading] = useState(false);

    //regex para verificar se o email segue um formato válido
    const validarEmail = (email) => {
        const regex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
        return regex.test(email);
    };

    //gere a validaçao do nome
    const validarNome = (nome) => {
        return nome.trim().length >= 2;
    };

    //
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    //indica o tipo de erro
    const mostrarMensagem = (texto, tipo) => {
        setMensagem({ texto, tipo });
        setTimeout(() => {
            setMensagem(null);
        }, 4000);
    };

    const subscreverNewsletter = async (e) => {
        e.preventDefault();
        
        const nome = form.nome.trim();
        const email = form.email.trim();

        if (!validarNome(nome)) {
            mostrarMensagem('Por favor, insira um nome válido (mínimo 2 caracteres)', 'erro');
            return;
        }

        if (!validarEmail(email)) {
            mostrarMensagem('Por favor, insira um email válido', 'erro');
            return;
        }

        setLoading(true);

        try {

            await adicionarSubscritor({ nome, email });

            mostrarMensagem(`Obrigado ${nome}! Subscrição confirmada com sucesso!`, 'sucesso');
            
            setForm({ nome: '', email: '' });
            
        } catch (error) {
            mostrarMensagem(typeof error === 'string' ? error : 'Ocorreu um erro ao processar a subscrição.', 'erro');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="newsletter-section" id="Newsletter">
            <div className="newsletter-container">
                <h3>Subscreva a nossa Newsletter</h3>
                <p>Receba as últimas novidades, eventos e investigações do CACA diretamente no seu email.</p>
                

                <form id="form-newsletter" className="form-newsletter" onSubmit={subscreverNewsletter} noValidate>
                    <input 
                        type="text" 
                        name="nome"
                        value={form.nome}
                        onChange={handleChange}
                        placeholder="Seu nome completo*" 
                        required 
                    />
                    <input 
                        type="email" 
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Seu email*" 
                        required 
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'A subscrever...' : 'Subscrever Newsletter'}
                    </button>
                </form>

                {mensagem && (
                    <div id="newsletter-mensagem" className={`newsletter-mensagem ${mensagem.tipo}`}>
                        {mensagem.texto}
                    </div>
                )}
            </div>
        </div>
    );
}