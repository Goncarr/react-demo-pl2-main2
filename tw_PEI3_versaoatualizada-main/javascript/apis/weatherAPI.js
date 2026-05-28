/**
 * Busca previsão meteorológica para um local e data
 * @param {string} local - Nome da cidade/local
 * @param {string} data - Data no formato YYYY-MM-DD
 * @returns {Promise<Object>} - Objeto com a previsão
 */
async function buscarPrevisaoMeteorologica(local, data) {
    try {
        // Limpar e formatar o local para a URL
        const localFormatado = encodeURIComponent(local.trim());

        // Usar wttr.in - API gratuita que retorna JSON
        // Formato: https://wttr.in/Local?format=j1
        const url = `https://wttr.in/${localFormatado}?format=j1&lang=pt`;

        console.log(`Buscando previsão para: ${local}`);

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }

        const dados = await response.json();

        // Processar dados da previsão atual (wttr.in não suporta data específica facilmente)
        // Para demonstração, vamos usar a previsão atual ou dos próximos dias
        const previsaoAtual = dados.current_condition[0];
        const previsaoDias = dados.weather || [];

        // Tentar encontrar previsão para a data específica
        let previsaoParaData = null;
        const dataObj = new Date(data);
        const dataStr = dataObj.toISOString().split('T')[0];

        for (const dia of previsaoDias) {
            if (dia.date === dataStr) {
                previsaoParaData = dia;
                break;
            }
        }

        // Se não encontrar para a data específica, usar a previsão mais próxima
        if (!previsaoParaData && previsaoDias.length > 0) {
            previsaoParaData = previsaoDias[0];
        }

        // Mapear códigos de condição para descrições em português
        const condicoes = {
            '113': '☀️ Limpo',
            '116': '⛅ Parcialmente nublado',
            '119': '☁️ Nublado',
            '122': '☁️ Muito nublado',
            '176': '🌧️ Chuva fraca',
            '179': '🌨️ Neve fraca',
            '182': '🌧️ Chuva/granizo',
            '185': '🌧️ Chuva/granizo',
            '200': '⛈️ Trovoada',
            '227': '❄️ Neve',
            '230': '❄️ Neve intensa',
            '248': '🌫️ Nevoeiro',
            '260': '🌫️ Nevoeiro denso',
            '263': '🌧️ Chuva fraca',
            '266': '🌧️ Chuva fraca',
            '281': '🌧️ Chuvisco',
            '284': '🌧️ Chuva intensa',
            '293': '🌧️ Chuva ligeira',
            '296': '🌧️ Chuva ligeira',
            '299': '🌧️ Chuva moderada',
            '302': '🌧️ Chuva intensa',
            '305': '🌧️ Chuva intensa',
            '308': '🌧️ Chuva muito intensa',
            '311': '🌧️ Chuva de granizo',
            '314': '🌧️ Chuva de granizo',
            '317': '🌨️ Neve/granizo',
            '320': '❄️ Neve fraca',
            '323': '❄️ Neve',
            '326': '❄️ Neve',
            '329': '❄️ Neve intensa',
            '332': '❄️ Neve intensa',
            '335': '❄️ Neve intensa',
            '338': '❄️ Neve muito intensa',
            '350': '🌨️ Granizo',
            '353': '🌧️ Chuva fraca',
            '356': '🌧️ Chuva moderada',
            '359': '🌧️ Chuva intensa',
            '362': '🌧️ Chuva/granizo',
            '365': '🌧️ Chuva/granizo',
            '368': '🌨️ Neve/granizo',
            '371': '❄️ Neve intensa',
            '374': '🌨️ Granizo',
            '377': '🌨️ Granizo',
            '386': '⛈️ Trovoada',
            '389': '⛈️ Trovoada forte',
            '392': '⛈️ Trovoada/neve',
            '395': '❄️ Trovoada/neve intensa'
        };

        const weatherCode = previsaoParaData?.hourly?.[0]?.weatherCode || previsaoAtual?.weatherCode || '113';
        const condicao = condicoes[weatherCode] || 'Informação não disponível';

        // Temperatura (usar da previsão para o dia ou atual)
        let temperatura = '';
        let humidade = '';
        let vento = '';

        if (previsaoParaData && previsaoParaData.avgtempC) {
            temperatura = `${previsaoParaData.avgtempC}°C (média do dia)`;
            humidade = previsaoParaData.humidity ? `${previsaoParaData.humidity}%` : 'N/A';
            vento = previsaoParaData.winddir16Point ? `${previsaoParaData.winddir16Point}` : 'N/A';
        } else {
            temperatura = `${previsaoAtual.temp_C || 'N/A'}°C`;
            humidade = `${previsaoAtual.humidity || 'N/A'}%`;
            vento = `${previsaoAtual.winddir16Point || 'N/A'} a ${previsaoAtual.windspeedKmph || 'N/A'} km/h`;
        }

        return {
            condicao: condicao,
            temperatura: temperatura,
            humidade: humidade,
            vento: vento,
            local: local,
            data: data
        };

    } catch (error) {
        console.error('Erro ao buscar previsão do tempo:', error);

        // Retornar dados simulados em caso de erro (fallback)
        return {
            condicao: ' Informação temporariamente indisponível',
            temperatura: 'N/A',
            humidade: 'N/A',
            vento: 'N/A',
            local: local,
            data: data
        };
    }
}

/**
 * Busca previsão atual para uma localização
 * @param {string} local - Nome da cidade/local
 * @returns {Promise<Object>}
 */
async function buscarPrevisaoAtual(local) {
    const dataAtual = new Date().toISOString().split('T')[0];
    return buscarPrevisaoMeteorologica(local, dataAtual);
}