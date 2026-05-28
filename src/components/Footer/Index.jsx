import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import './footer.css'; 

/**
 * Esta função é repsonsável pela criação do footer
 * @returns fragmento do footer
 */
export default function Footer() {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        tel: '',
        mensagem: ''
    });

    const [statusMensagem, setStatusMensagem] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Função específica para o input de telefone capturar o valor
    const handlePhoneChange = (value) => {
        setFormData({
            ...formData,
            tel: value
        });
    };

    // Função que gere a função de quickMessage
    const handleQuickMessage = (e) => {
        setFormData({
            ...formData,
            mensagem: e.target.value
        });
    };

    //gere o envio de um email
    const handleSubmit = async (e) => {
        e.preventDefault(); 

        if (!formData.nome || !formData.email || !formData.mensagem || !formData.tel) {
            mostrarAviso('erro');
            return;
        }

        try {
            // O formData.tel já inclui o prefixo do país automaticamente (ex: "351912345678")
            console.log("A enviar email com os dados:", formData);
            mostrarAviso('sucesso');
            
            setFormData({ nome: '', email: '', tel: '', mensagem: '' });
        } catch (error) {
            mostrarAviso('erro');
        }
    };

    //Envia um aviso em caso de erro
    const mostrarAviso = (tipo) => {
        setStatusMensagem(tipo);
        setTimeout(() => setStatusMensagem(null), 4000); 
    };

    return (
        <>
            <footer>
                <div id="Contactos"></div>
                <div className="footer-container">
                    
                    <div className="contactos">
                        <h1>Contactos<br/></h1>
                        <p>Email: 2acaca@uac.pt</p>
                        <p>Telefone: 250 620 910</p>
                        <p>Morada: Rua das Hortênsias Azuis 3, 9520-509 Lagoa</p>
                    </div>

                    <div className="email">
                        <h1>Envie Um Email<br/> (*) obrigatório</h1>
                        
                        <form className="email-conteudo" onSubmit={handleSubmit} noValidate>
                            <div className="email-campos">
                                <input name="nome" value={formData.nome} onChange={handleChange} type="text" placeholder="Nome*" required />
                                <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="Email*" required />
                                
                                <div className="tel-component-container">
                                    <PhoneInput
                                        country={'pt'}
                                        value={formData.tel}
                                        onChange={handlePhoneChange}
                                        enableSearch={true}
                                        searchPlaceholder="Pesquisar país..."
                                        inputProps={{
                                            name: 'tel',
                                            required: true,
                                        }}
                                        placeholder="Phone Number*"
                                    />
                                </div>
                                
                                <button id="enviar" type="submit">Enviar Mensagem</button>
                            </div>

                            <div className="mensagem-container">
                                <select className="quick-message" id="quickMessage" onChange={handleQuickMessage}>
                                    <option value="">Quick replies</option>
                                    <option value="Gostaria de Saber se o projeto [projeto] está disponível">Projetos de Investigação</option>
                                    <option value="Gostaria de saber quais formações são oferecidas pelo centro">Formação e Ensino</option>
                                    <option value="Estou interessado em realizar uma colobaroção com o CACA">Parcerias e Protocolos</option>
                                    <option value="Gostaria de informar-me em como posso realizar os meus estudos no CACA">Apoio ao Estudante</option>
                                </select>
                                <textarea 
                                    name="mensagem" 
                                    value={formData.mensagem} 
                                    onChange={handleChange} 
                                    maxLength="450" 
                                    placeholder="Escreva a sua mensagem aqui... *" 
                                    required
                                ></textarea>
                            </div>
                        </form>
                    </div>
                </div>
            </footer>

            <div className="direitos">
                <p>© 2026 Centro Académico Clinico dos Açores. Todos os direitos reservados.<br/>
                    Financiado pela Universidade dos Açores<br/>
                    https://fct.uac.pt/</p>
            </div>

            {statusMensagem === 'erro' && <div className="envio-erro">Erro ao enviar mensagem</div>}
            {statusMensagem === 'sucesso' && <div className="envio-sucesso">Mensagem enviada com sucesso</div>}
        </>
    );
}