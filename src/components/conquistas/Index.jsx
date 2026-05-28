import { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './conquistas.css';

/**
 * Esta função é responsável por gerir a secção de "conquistas", no qual é constituido por
 * um gráfico com diferetnes opções.
 * @returns Fragmento da secção das conquistas
 */
export default function Conquistas() {

    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    const [chartData, setChartData] = useState([]);
    const [datasetLabel, setDatasetLabel] = useState('Numero de investigadores');
    const [chartType, setChartType] = useState('bar');

    /**
     * Define o tamanho que a fonte do grafico deve ser
     * @returns tamanho da fonte do grafico
     */
    const getChartFontSize = () => {
        if (window.innerWidth <= 600) return 9;
        if (window.innerWidth <= 1350) return 12;
        return 15.5;
    };

    /**
     * Esta função procura por dados para inserir no grafico, dependente de quais o
     * utilizador seleciounou
     * @param {*} jsonUrl 
     * @param {*} label 
     */
    const loadData = async (jsonUrl, label) => {
        try {
            const response = await fetch(jsonUrl);
            if (!response.ok) {
                throw new Error(`Falha ao carregar os dados de: ${jsonUrl}`);
            }
            const data = await response.json();
            
            setChartData(data);
            setDatasetLabel(label);
        } catch (error) {
            console.error(error);
        }
    };

    //Carregar os dados iniciais quando o componente nasce (Mount)
    useEffect(() => {
        loadData('/utils/datainvestigacao.json', 'Número de investigadores mensal');
    }, []);

    //Cria um novo gráfico
    useEffect(() => {
        if (chartData.length === 0 || !chartRef.current) return;

        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext('2d');
        Chart.defaults.font.size = getChartFontSize();

        chartInstance.current = new Chart(ctx, {
            type: chartType,
            data: {
                labels: chartData.map((row) => row.month),
                datasets: [
                    {
                        label: datasetLabel,
                        data: chartData.map((row) => row.income),
                        borderWidth: 1,
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });

        // Gere o tamanho caso haja uma alteração nas dimensões da janela
        const handleResize = () => {
            if (chartInstance.current) {
                Chart.defaults.font.size = getChartFontSize();
                chartInstance.current.update();
            }
        };

        window.addEventListener('resize', handleResize);

        
        return () => {
            window.removeEventListener('resize', handleResize);
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [chartData, chartType, datasetLabel]);

    return (
        <div id="Conquistas">
            <h1>Conquistas</h1>
            <div className="conquistas">
                <p>Em 2026 houve um aumento geral de 30%</p>
                <div className="conquistas-container">
                    <div className="myChart">
                        <div className="chart_types">
                            <button onClick={() => loadData('/utils/datainvestigacao.json', 'Número de investigadores mensal')}>
                                Investigadores
                            </button>
                            <button onClick={() => loadData('/utils/dataparceiros.json', 'Número de parceiros mensais')}>
                                Parceiros
                            </button>
                            <button onClick={() => loadData('/utils/dataprojetos.json', 'Número de projetos mensais')}>
                                Projetos
                            </button>
                        </div>
                        
                        <div className='grafico-container'>
                            <canvas ref={chartRef}></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


