import './style.css'

function formatarData(isoString:string): string {
    // ISO string sem timezone vira UTC no new Date()
    // para corrigir, forçamos horário local separando ano/mês/dia
    const [ano, mes, dia] = isoString.split('-')
    const data = new Date(Number(ano), Number(mes) - 1, Number(dia))
    const hoje = new Date()

    // zera horas para comparar só data (evita erro de fuso horário)
    data.setHours(0, 0, 0, 0)
    hoje.setHours(0, 0, 0, 0)

    const diffDias = Math.round((data.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDias === 0)
        return 'Hoje'
    else if (diffDias === 1)
        return 'Amanhã'
    else
        return data.toLocaleDateString('pt-BR', {
            weekday: 'short',
            day: '2-digit',
            month: '2-digit'
    })
}

function obterEmojiClima(weatherCode: number): string {
    const emojiClima: Record<number, string> = {
        0: '☀️',
        1: '🌤️',
        2: '⛅',
        3: '☁️',
        45: '🌫️',
        48: '🌫️',
        51: '🌦️',
        53: '🌦️',
        55: '🌧️',
        56: '🌧️',
        57: '🌧️',
        61: '🌧️',
        63: '🌧️',
        65: '🌧️',
        66: '🌧️',
        67: '🌧️',
        71: '🌨️',
        73: '🌨️',
        75: '🌨️',
        77: '🌨️',
        80: '🌦️',
        81: '🌧️',
        82: '🌧️',
        85: '🌨️',
        86: '🌨️',
        95: '⛈️',
        96: '⛈️',
        99: '⛈️',
    }

    return emojiClima[weatherCode] ?? '?'
}

async function obterPrevisao() {
    const container = document.getElementById('previsao')!

    try {
        const url = "https://api.open-meteo.com/v1/forecast?latitude=-23.50167&longitude=-47.45806&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=America/Sao_Paulo"

        // realiza requisição à API
        const resposta = await fetch(url)

        // API não lança erro em 4xx, precisa checar ok
        if (!resposta.ok) {
            throw new Error(`Erro HTTP:${resposta.status}`)
        }

        // converte a resposta para JSON
        const dados = await resposta.json()

        // limpa conteúdo anterior do container
        container.innerHTML = ''

        for (let i = 0; i < 3; i++) {
            const data = dados.daily.time[i]
            const dataFormatada = formatarData(data)
            const tempMax = dados.daily.temperature_2m_max[i]
            const tempMin = dados.daily.temperature_2m_min[i]
            const chuva = dados.daily.precipitation_probability_max[i]
            const emoji = obterEmojiClima(dados.daily.weather_code[i])

            const card = document.createElement('div')
            card.className = 'card-dia'
            card.textContent = `${emoji} ${dataFormatada}: Max ${tempMax}°C / Min ${tempMin}°C | Chuva: ${chuva}%`

            // adiciona card ao container
            container.appendChild(card)
        }

    } catch (erro) {
        console.error(erro)
        container.innerHTML = '<div class="erro">Erro ao carregar clima</div>'
    }
}

obterPrevisao()