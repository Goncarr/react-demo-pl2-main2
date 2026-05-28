import { useState, useEffect } from 'react';
import Formacao from '../formacoes/Index';
import './investigacao.css';
import DADOS_INVESTIGACAO from '../../utils/investigacao_dados/dados';
/**
 * Esta função é responsavel por adicionar a secção da investigação
 * @param {*} param0 
 * @returns Fragment da secção investigacao
 */
export default function Investigacao({ listaFormacoes }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleCount, setVisibleCount] = useState(3);

    //Gere quantas formaçoes devem ser visiveis
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 980) setVisibleCount(1);
            else if (window.innerWidth <= 1350) setVisibleCount(2);
            else setVisibleCount(3);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    //gere para onde os slides devem-se mover (esquerda/dereita)
    const moveSlide = (direction) => {
        const maxIndex = DADOS_INVESTIGACAO.length - visibleCount; 
        setCurrentIndex((prevIndex) => {
            let newIndex = prevIndex + direction;
            if (newIndex < 0) return maxIndex;
            if (newIndex > maxIndex) return 0;
            return newIndex;
        });
    };

    return (
        <div id="Investigacao">
            <h1>Formação e Ensino</h1>
        <div className="investigacao-main">
            <button className="prev" onClick={() => moveSlide(-1)}>&#10094;</button>
            
            <div className="investigacao-viewport">
                <div 
                    className="investigacao-track" 
                    style={{
                        transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`
                    }}
                >
                    {DADOS_INVESTIGACAO.map((item) => (
                        <div 
                            key={item.id}  
                            style={{ flex: `0 0 ${100 / visibleCount}%` }} 
                        >
                            <Formacao 
                                id={item.id}
                                imagem={item.imagem}
                                data={item.data}
                                titulo={item.titulo}
                                desc={item.desc}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <button className="next" onClick={() => moveSlide(1)}>&#10095;</button>
        </div>
        </div>
    );
}