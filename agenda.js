const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const CHAVE_STORAGE = 'agenda_eventos';
 
class Evento {
  constructor(nome, data, hora) {
    this.id = Date.now() + Math.random();
    this.nome = nome;
    this.data = data;
    this.hora = hora;
  }
}
 

function salvarNoLocalStorage() {
  localStorage.setItem(CHAVE_STORAGE, JSON.stringify(eventos));
}
 

function carregarDoLocalStorage() {
  const dados = localStorage.getItem(CHAVE_STORAGE);
  if (!dados) return [];
 
  try {
    return JSON.parse(dados);
  } catch (erro) {
    console.error('Erro ao ler eventos do localStorage:', erro);
    return [];
  }
}
 
const cores = ['#3a1515', '#3f3120', '#3d3f10', '#38b8c9', '#353f99', '#2e5c45', '#4e1e4e'];
const corAleatoria = cores[Math.floor(Math.random() * cores.length)];
const botaoProximo = document.querySelector('.proximo');
const botaoAnterior = document.querySelector('.anterior');
const el = document.querySelector('.dias');
const inputTitulo = document.getElementById('inputTitulo');
const inputData = document.getElementById('inputData');
const inputHora = document.getElementById('inputHora');
const inputTipo = document.getElementById('inputTipo');
const btnSalvar = document.getElementById('btnSalvar');
const btnCancelar = document.getElementById('btnCancelar');
const btnExcluir = document.getElementById('btnExcluir');
const eventoTitulo = document.getElementById('eventoTitulo');
let eventos = [];
 
let eventoEmEdicaoId = null;
 
let dataAtual = new Date();
let mesAtual = dataAtual.getMonth();
let anoAtual = dataAtual.getFullYear();
 
function buscarEventosDoDia(dia, mes, ano) {
  const dataFormatada = `${ano}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
  return eventos.filter(evento => evento.data === dataFormatada);
}
 
function atualizarCalendario(mes, ano) {
  const Mes = document.getElementById('mes');
  const Ano = document.getElementById('ano');
 
  const primeiroDia = new Date(ano, mes, 1).getDay();
  const ultimoDia = new Date(ano, mes + 1, 0).getDate();
 
  Mes.textContent = meses[mes];
  Ano.textContent = ano;
 
  el.innerHTML = '';
 
  for (let i = 0; i < primeiroDia; i++) {
    el.innerHTML += '<span class="vazio"></span>';
  }
 
  for (let dia = 1; dia <= ultimoDia; dia++) {
    const eventosDoDia = buscarEventosDoDia(dia, mes, ano);
 
    let eventosHTML = '';
    eventosDoDia.forEach(evento => {
      eventosHTML += `<div class="evento" data-id="${evento.id}" style="background-color: ${corAleatoria}">${evento.hora} - ${evento.nome}</div>`;
    });
 
    el.innerHTML += `<div class="dia-quadrado"><span class="numero-dia">${dia}</span>${eventosHTML}</div>`;
  }
}
 

el.addEventListener('click', (e) => {
  const eventoEl = e.target.closest('.evento');
  if (!eventoEl) return;
 
  const id = eventoEl.dataset.id;
  const evento = eventos.find(ev => String(ev.id) === id);
  if (!evento) return;
 
  abrirEdicao(evento);
});
 
function abrirEdicao(evento) {
  eventoEmEdicaoId = evento.id;
  inputTitulo.value = evento.nome;
  inputData.value = evento.data;
  inputHora.value = evento.hora;
  eventoTitulo.textContent = 'Editar Evento';
  btnExcluir.style.display = 'inline-block';
}
 
function abrirCriacao() {
  eventoEmEdicaoId = null;
  eventoTitulo.textContent = 'Novo Evento';
  btnExcluir.style.display = 'none';
}
 
function limparFormulario() {
  inputTitulo.value = '';
  inputData.value = '';
  inputHora.value = '';
  abrirCriacao();
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
  const nomeEvento = inputTitulo.value.trim();
  const dataEvento = inputData.value;
  const horaEvento = inputHora.value;
 
  if (!nomeEvento || !dataEvento) {
    alert('Preencha pelo menos o título e a data do evento.');
    return;
  }
 
  if (eventoEmEdicaoId !== null) {
    const evento = eventos.find(ev => ev.id === eventoEmEdicaoId);
    if (evento) {
      evento.nome = nomeEvento;
      evento.data = dataEvento;
      evento.hora = horaEvento;
    }
  } else {
    eventos.push(new Evento(nomeEvento, dataEvento, horaEvento));
  }
 
  salvarNoLocalStorage();
  atualizarCalendario(mesAtual, anoAtual);
  limparFormulario();
});
 

btnExcluir.addEventListener('click', () => {
  if (eventoEmEdicaoId === null) return;
 
  const index = eventos.findIndex(ev => ev.id === eventoEmEdicaoId);
  if (index !== -1) {
    eventos.splice(index, 1);
  }
 
  salvarNoLocalStorage();
  atualizarCalendario(mesAtual, anoAtual);
  limparFormulario();
});
 

btnCancelar.addEventListener('click', () => {
  limparFormulario();
});
eventos = carregarDoLocalStorage();
abrirCriacao();
atualizarCalendario(mesAtual, anoAtual);