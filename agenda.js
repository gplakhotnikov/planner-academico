const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
 
class Evento {
  constructor(nome, data, hora) {
    this.nome = nome;
    this.data = data;
    this.hora = hora;
  }
}

const botaoProximo = document.querySelector('.proximo');
const botaoAnterior = document.querySelector('.anterior');
const el = document.querySelector('.dias');
const modalFundo = document.getElementById('modalFundo');
const modalTitulo = document.getElementById('modalTitulo');
const inputTitulo = document.getElementById('inputTitulo');
const inputData = document.getElementById('inputData');
const inputHora = document.getElementById('inputHora');
const inputTipo = document.getElementById('inputTipo');
const btnSalvar = document.getElementById('btnSalvar');
const btnCancelar = document.getElementById('btnCancelar');
const eventos = [];

let dataAtual = new Date();
let mesAtual = dataAtual.getMonth();
let anoAtual = dataAtual.getFullYear();
 
function buscarEventosDoDia(dia, mes, ano) {
  const dataFormatada = `${ano}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
  return eventos.filter(evento => evento.data === dataFormatada);;;;
  }

function atualizarCalendario(mes, ano) {
    let Mes = document.getElementById('mes');
    let Ano = document.getElementById('ano');
 
    let primeiroDia = new Date(ano, mes, 1).getDay();
    let ultimoDia = new Date(ano, mes + 1, 0).getDate();
 
    Mes.textContent = meses[mes];
    Ano.textContent = ano;
 
    el.innerHTML = '';

    for (let i = 0; i < primeiroDia; i++) {
        el.innerHTML += '<span class="vazio"></span>';
    }
 
    for (let dia = 1; dia <= ultimoDia; dia++) {
        const eventosDoDia = buscarEventosDoDia(dia, mesAtual, anoAtual);
        let eventosHTML = '';
        eventosDoDia.forEach(evento => {
            eventosHTML += `<div class="evento">${evento.hora} - ${evento.nome}</div>`;
        });
        el.innerHTML += `<div class="dia-quadrado"><span class="numero-dia">${dia}</span>${eventosHTML}</div>`;
                
    }
}
 
botaoProximo.addEventListener('click', () => {
    mesAtual++;
    if (mesAtual > 11) {
        mesAtual = 0;
        anoAtual++;
    }
    atualizarCalendario(mesAtual, anoAtual);
});
 
botaoAnterior.addEventListener('click', () => {
    mesAtual--;
    if (mesAtual < 0) {
        mesAtual = 11;
        anoAtual--;
    }
    atualizarCalendario(mesAtual, anoAtual);
});
 
btnSalvar.addEventListener('click', () => {
    const nomeEvento = inputTitulo.value;
    const dataEvento = inputData.value;
    const horaEvento = inputHora.value;
    eventos.push(new Evento(nomeEvento, dataEvento, horaEvento));
    atualizarCalendario(mesAtual, anoAtual);
    inputTitulo.value = '';
    inputData.value = '';
    inputHora.value = '';
});

atualizarCalendario(mesAtual, anoAtual);