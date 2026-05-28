import React, { useState, useEffect } from 'react';
import './Noticias.css';

// RSS Feeds da área da saúde (públicos)
const RSS_FEEDS = {
    SAUDE_PT: 'https://www.sns.gov.pt/feed/',
    OMS: 'https://www.who.int/rss-feeds/news-pt.xml',
    NIH: 'https://www.nih.gov/rss/health/health-news.xml',
    CACA_SUGERIDAS: 'https://www.news-medical.net/newsrss.ashx'
};


const PROXY_URL = 'https://api.rss2json.com/v1/api.json?rss_url=';

/**
 * Esta função é repsonsavel pela secção de noticias 
 * @returns Fragmento da secção de noticias
 */
export default function NoticiasSection() {
    const [noticias, setNoticias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState(null);
    const [isDemo, setIsDemo] = useState(false);

    /**
     * Retorna notícias mock em caso de falha na API
     */
    const getNoticiasMock = () => [
        {
            id: 'mock-1',
            titulo: 'CACA lança novo programa de investigação em saúde pública',
            descricao: 'O Centro Académico Clínico dos Açores anuncia um novo programa focado na investigação em saúde pública regional.',
            link: '#',
            data: new Date().toLocaleDateString('pt-PT'),
            fonte: 'CACA Notícias'
        },
        {
            id: 'mock-2',
            titulo: 'Parceria estratégica com hospitais dos Açores',
            descricao: 'Novas parcerias vão permitir maior integração entre a academia e os serviços clínicos da região.',
            link: '#',
            data: new Date(Date.now() - 86400000).toLocaleDateString('pt-PT'),
            fonte: 'CACA Notícias'
        },
        {
            id: 'mock-3',
            titulo: 'Workshop de Inteligência Artificial em Saúde',
            descricao: 'Inscrições abertas para o workshop que aborda as aplicações de IA na área da saúde.',
            link: '#',
            data: new Date(Date.now() - 172800000).toLocaleDateString('pt-PT'),
            fonte: 'Formação CACA'
        },
        {
            id: 'mock-4',
            titulo: 'Estudo revela avanços na reabilitação pós-cirúrgica',
            descricao: 'Investigadores do CACA publicam estudo inovador sobre técnicas de reabilitação.',
            link: '#',
            data: new Date(Date.now() - 259200000).toLocaleDateString('pt-PT'),
            fonte: 'Investigação CACA'
        },
        {
            id: 'mock-5',
            titulo: 'Webinar: Saúde Mental em Contexto Académico',
            descricao: 'Evento online gratuito sobre saúde mental para estudantes universitários.',
            link: '#',
            data: new Date(Date.now() - 345600000).toLocaleDateString('pt-PT'),
            fonte: 'Eventos CACA'
        },
        {
            id: 'mock-6',
            titulo: 'Bolsa de investigação para jovens cientistas',
            descricao: 'O CACA abre candidaturas para bolsas de investigação na área das ciências médicas.',
            link: '#',
            data: new Date(Date.now() - 432000000).toLocaleDateString('pt-PT'),
            fonte: 'Oportunidades CACA'
        }
    ];

    /**
     * Carrega notícias de um RSS feed individual
     */
    const carregarNoticiasDeRSS = async (feedUrl) => {
        try {
            const url = PROXY_URL + encodeURIComponent(feedUrl);
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const dados = await response.json();

            if (dados && dados.items && dados.items.length > 0) {
                return dados.items.map((item, index) => ({
                    id: item.guid || `${feedUrl}-${index}`,
                    titulo: item.title || 'Sem título',
                    descricao: (item.description || '').replace(/<[^>]*>/g, '').substring(0, 200) + '...',
                    link: item.link || '#',
                    data: item.pubDate ? new Date(item.pubDate).toLocaleDateString('pt-PT') : 'Data desconhecida',
                    fonte: dados.feed?.title || 'Fonte de saúde'
                }));
            }
            return [];
        } catch (error) {
            console.error('Erro ao carregar RSS feed:', error);
            return [];
        }
    };

    /**
     * Carrega e combina notícias de múltiplas fontes
     */
    const carregarNoticias = async () => {
        setLoading(true);
        setErro(null);
        setIsDemo(false);

        const fontes = [
            RSS_FEEDS.SAUDE_PT,
            'https://www.medscape.com/rss/all',
            'https://www.news-medical.net/newsrss.ashx'
        ];

        let todasNoticias = [];

        try {
            for (const fonte of fontes) {
                const noticiasDaFonte = await carregarNoticiasDeRSS(fonte);
                todasNoticias = [...todasNoticias, ...noticiasDaFonte];

                if (todasNoticias.length >= 12) break;
            }

            if (todasNoticias.length === 0) {
                todasNoticias = getNoticiasMock();
                setIsDemo(true);
            } else {
                todasNoticias.sort((a, b) => {
                    if (a.data === 'Data desconhecida') return 1;
                    if (b.data === 'Data desconhecida') return -1;
                    return new Date(b.data.split('/').reverse().join('-')) - new Date(a.data.split('/').reverse().join('-'));
                });
            }

            setNoticias(todasNoticias.slice(0, 12));
        } catch (error) {
            console.error('Erro ao processar notícias:', error);
            setNoticias(getNoticiasMock());
            setIsDemo(true);
            setErro('Erro ao carregar notícias em tempo real. A exibir dados de demonstração.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarNoticias();
    }, []);

    return (
        <div className="noticias-section">
            <div id="Noticias"></div>
            <div className="noticias-header">
                <h3>Notícias de Saúde & CACA</h3>
                <button id="atualizar-noticias" onClick={carregarNoticias} disabled={loading}>
                    {loading ? 'A atualizar...' : 'Atualizar Notícias'}
                </button>
            </div>

            {loading && (
                <div id="noticias-loading">
                    <p>📡 A carregar as últimas notícias...</p>
                </div>
            )}

            {erro && <div id="noticias-erro">{erro}</div>}

            {!loading && (
                <div className="noticias-container">
                    {noticias.map((noticia) => (
                        <div className="noticia-card" key={noticia.id}>
                            <div className="noticia-card-content">
                                <div className="noticia-fonte">
                                    {isDemo ? `📰 ${noticia.fonte}` : noticia.fonte}
                                </div>
                                <h3 className="noticia-titulo">{noticia.titulo}</h3>
                                <p className="noticia-descricao">{noticia.descricao}</p>
                                <div className="noticia-footer">
                                    <span className="noticia-data">📅 {noticia.data}</span>
                                    {isDemo ? (
                                        <span className="noticia-link demo">(Demo)</span>
                                    ) : (
                                        <a 
                                            href={noticia.link} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="noticia-link"
                                        >
                                            Ler mais →
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <small className="noticias-footer-nota">
                Fontes: RSS feeds públicos da área da saúde
            </small>
        </div>
    );
}