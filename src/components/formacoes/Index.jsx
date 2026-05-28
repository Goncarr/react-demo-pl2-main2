import './formacao.css'
import { useState } from 'react';

export default function Formacao({id,titulo,data,imagem,desc}){
    const [isExpanded, setIsExpanded] = useState(false);
    
    const toggleSaberMais = () => {
        setIsExpanded(!isExpanded);
    };

    return(
        <div className='investigacao-contentor'>
            <img src={imagem}></img>
            <p>{data}</p>
            <h2>{titulo}</h2>

            {isExpanded && (
                <div className="saberTexto">
                    <p>{desc}</p>
                </div>
            )}

            <button className='investigacaoBotao' onClick={toggleSaberMais}>
                {isExpanded ? "Fechar" : "Saber Mais"}
            </button>
        </div>
    )

}