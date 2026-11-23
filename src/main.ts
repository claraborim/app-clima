import './style.css'

async function obterPrevisao() {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=-23.5015&longitude=-47.4526&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=America/Sao_Paulo";

    const resposta = await fetch(url);
    const dados = await resposta.json();

    console.log(dados);
}

obterPrevisao();