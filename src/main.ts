import './style.css'

async function obterPrevisao() {
    const container = document.getElementById('previsao')!

    try {
        const url = "https://api.open-meteo.com/v1/forecast?latitude=-23.50167&longitude=-47.45806&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=America/Sao_Paulo";

        // realiza requisição à API
        const resposta = await fetch(url);

        if (!resposta.ok) {
            throw new Error(`Erro HTTP:${resposta.status}`);
        }

        // converte a resposta para JSON
        const dados = await resposta.json();

        // limpa conteúdo anterior do container
        container.innerHTML = '';

        // percorre próximos três dias
        for (let i = 0; i < 3; i++) {
            const data = dados.daily.time[i];
            const tempMax = dados.daily.temperature_2m_max[i];
            const tempMin = dados.daily.temperature_2m_min[i];
            const chuva = dados.daily.precipitation_probability_max[i];

            // cria um card para o dia
            const card = document.createElement('div');
            card.className = 'card-dia';
            card.textContent = `${data}: Max ${tempMax}°C / Min ${tempMin}°C | Chuva: ${chuva}%`;

            // adiciona card ao container
            container.appendChild(card);
        }

    } catch (erro) {
        console.error(erro);
        container.innerHTML = '<div class="erro">Erro ao carregar clima</div>';
    }
}

obterPrevisao();