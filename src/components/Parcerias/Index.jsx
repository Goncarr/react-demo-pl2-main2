import { useState } from 'react';
import './parcerias.css';
import DADOS_PARCERIAS from '../../utils/parceria_dados/dados';

/**
 * Esta função é responsavel por criar a secção de parcerias, no qual
 * indicamos as parcerais do CACA
 * @returns Fragment para a secção parcerias
 */
export default function Parcerias() {

    const [currentIndex, setCurrentIndex] = useState(0);

    // Função para avançar/recuar
    const changeSlide = (direction) => {
        setCurrentIndex((prevIndex) => {
            let newIndex = prevIndex + direction;
            // Lógica para dar a volta (loop)
            if (newIndex >= DADOS_PARCERIAS.length) return 0; 
            if (newIndex < 0) return DADOS_PARCERIAS.length - 1;
            return newIndex;
        });
    };

    // Função para saltar para um dot específico
    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    return (
        <div id="Parcerias">
            <h1>Parcerias</h1>

            <div className="slideshow-container">

                {DADOS_PARCERIAS.map((parceria, index) => (
                    <div 
                        key={parceria.id} 
                        className={`mySlides fade ${index === currentIndex ? "active" : ""}`} 
                        style={{ backgroundImage: `url(${parceria.bgImage})` }}
                    >
                        <div className="partner-logo-container">
                            <img src={parceria.logo} alt={parceria.altText} />
                        </div>
                        <div className="partner-text-container">
                            <div className="text">{parceria.descricao}</div>
                        </div>
                    </div>
                ))}


                <a className="prev" onClick={() => changeSlide(-1)}>&#10094;</a>
                <a className="next" onClick={() => changeSlide(1)}>&#10095;</a>
            </div>

            <div className="dots-container">

                {DADOS_PARCERIAS.map((_, index) => (
                    <span 
                        key={index}
                        className={`dot ${index === currentIndex ? "active" : ""}`} 
                        onClick={() => goToSlide(index)}
                    ></span>
                ))}
            </div>
        </div>
    );
}