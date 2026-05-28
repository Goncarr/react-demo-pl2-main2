import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { obterTodosEventos } from '../../indexedDB/db';
import 'leaflet/dist/leaflet.css';
import './mapa.css';


import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;



/**
 * Altera a view do mapa
 * @param {*} param0 
 * @returns 
 */
function MapController({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
}



export default function MapaEventos({ eventosDisponiveis: eventosProp = [] }) {
    // 1. Estados (States)
    const [center, setCenter] = useState([37.739, -25.668]); // Açores
    const [zoom, setZoom] = useState(10);
    const [markers, setMarkers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
    const [eventosDisponiveis, setEventosDisponiveis] = useState(eventosProp);
    const [eventosCarregadosNoMapa, setEventosCarregadosNoMapa] = useState(false);

    const eventosAtuais = eventosProp.length > 0 ? eventosProp : eventosDisponiveis;

    useEffect(() => {
        const carregarEventos = async () => {
            try {
                const dados = await obterTodosEventos();
                setEventosDisponiveis(dados);
            } catch (error) {
                console.error('Erro ao carregar eventos do mapa:', error);
            }
        };

        if (eventosProp.length === 0) {
            carregarEventos();
        }
    }, [eventosProp.length]);

    const mostrarMensagem = (texto, tipo) => {
        setMensagem({ texto, tipo });
        setTimeout(() => setMensagem({ texto: '', tipo: '' }), 3000);
    };

    const obterCoordenadasPorEndereco = async (endereco) => {
        try {
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}&accept-language=pt&limit=1`;
            const response = await fetch(url);
            const dados = await response.json();

            if (dados && dados.length > 0) {
                return {
                    lat: parseFloat(dados[0].lat),
                    lng: parseFloat(dados[0].lon),
                    display_name: dados[0].display_name
                };
            }
            return null;
        } catch (error) {
            console.error('Erro ao obter coordenadas:', error);
            return null;
        }
    };

    const mostrarTodosEventosNoMapa = async (mostrarAlerta = true) => {
        const eventos = eventosAtuais;
        if (!eventos || eventos.length === 0) {
            if (mostrarAlerta) alert('Não há eventos para mostrar no mapa');
            return;
        }

        setMarkers([]);
        setCenter([37.739, -25.668]);
        setZoom(9);
        mostrarMensagem('A carregar eventos...', 'info');

        const novosMarcadores = [];
        let eventosEncontrados = 0;

        for (const evento of eventos) {
            const coordenadas = await obterCoordenadasPorEndereco(evento.local + ', Açores, Portugal');

            if (coordenadas) {
                novosMarcadores.push({
                    id: evento.id || Date.now() + Math.random(),
                    lat: coordenadas.lat,
                    lng: coordenadas.lng,
                    titulo: evento.titulo,
                    descricao: `${evento.local}<br/>${evento.data} às ${evento.hora}`
                });
                eventosEncontrados++;
            }
        }

        setMarkers(novosMarcadores);
        if (eventosEncontrados > 0) {
            mostrarMensagem(`Foram mostrados ${eventosEncontrados} de ${eventos.length} eventos no mapa`, 'sucesso');
            setEventosCarregadosNoMapa(true);
        } else {
            mostrarMensagem('Não foi possível localizar os eventos no mapa.', 'erro');
        }
    };

    useEffect(() => {
        if (eventosAtuais.length > 0 && !eventosCarregadosNoMapa) {
            mostrarTodosEventosNoMapa(false);
        }
    }, [eventosAtuais, eventosCarregadosNoMapa]);

    // Pesquisa uma Localização Específica
    const pesquisarLocalizacao = async () => {
        if (!searchQuery.trim()) {
            alert('Por favor, insira uma localização para pesquisar');
            return;
        }

        setMensagem({ texto: `A procurar localização: ${searchQuery}...`, tipo: 'info' });

        const coordenadas = await obterCoordenadasPorEndereco(searchQuery + ', Açores, Portugal');

        if (coordenadas) {
            setMarkers([{
                id: Date.now(),
                lat: coordenadas.lat,
                lng: coordenadas.lng,
                titulo: 'Local pesquisado',
                descricao: searchQuery
            }]);
            
            setCenter([coordenadas.lat, coordenadas.lng]);
            setZoom(14);
            mostrarMensagem(`📍 Localização encontrada: ${coordenadas.display_name.substring(0, 100)}`, 'sucesso');
        } else {
            mostrarMensagem(`Não foi possível encontrar a localização: ${searchQuery}`, 'erro');
        }
    };

    return (
        <div className="mapa-section">
            <div className="mapa-container">
                <h3>Mapa de Eventos CACA</h3>
                
                <div className="mapa-pesquisa">
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && pesquisarLocalizacao()}
                        placeholder="Pesquisar localização (ex: Ponta Delgada...)"
                    />
                    <button onClick={pesquisarLocalizacao}>Pesquisar</button>
                </div>

                <div className="mapa-botoes">
                    <button onClick={mostrarTodosEventosNoMapa}>Mostrar todos os eventos</button>
                </div>

                <div style={{ height: '500px', width: '100%', position: 'relative', marginTop: '1rem' }}>
                    <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
                            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                            maxZoom={19}
                            minZoom={8}
                        />
                        
                        <MapController center={center} zoom={zoom} />

                        {markers.map((marker) => (
                            <Marker key={marker.id} position={[marker.lat, marker.lng]}>
                                <Popup>
                                    <b>{marker.titulo}</b>
                                    <br />
                                    <span dangerouslySetInnerHTML={{ __html: marker.descricao }}></span>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>

                {mensagem.texto && (
                    <div className={`mapa-mensagem ${mensagem.tipo}`}>
                        {mensagem.texto}
                    </div>
                )}

                <small style={{ color: '#666', display: 'block', marginTop: '0.5rem' }}>
                    Mapa fornecido por OpenStreetMap - Dados geográficos abertos e gratuitos
                </small>
            </div>
        </div>
    );
}