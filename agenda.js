var meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
             'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
var CHAVE_STORAGE = 'agenda_eventos';

function Evento(nome, data, hora) {
  this.id = Date.now() + Math.random();
  this.nome = nome;
  this.data = data;
  this.hora = hora;
}

function salvarNoLocalStorage() {
  localStorage.setItem(CHAVE_STORAGE, JSON.stringify(eventos));
}

function carregarDoLocalStorage() {
  var dados = localStorage.getItem(CHAVE_STORAGE);
  if (!dados) {
    return [];
  }
  try {
    return JSON.parse(dados);
  } catch (erro) {
    console.error('Erro ao ler eventos do localStorage:', erro);
    return [];
  }
}

var coresCategorias = ['#007bff', '#e53935', '#ff8c1a', '#2e7d32', '#6a1b9a', '#00838f'];
var corPorId = {};

function obterCorEvento(id) {
  if (!corPorId[id]) {
    corPorId[id] = coresCategorias[Object.keys(corPorId).length % coresCategorias.length];
  }
  return corPorId[id];
}

var botaoProximo = document.querySelector('.proximo');
var botaoAnterior = document.querySelector('.anterior');
var el = document.querySelector('.dias');
var inputTitulo = document.getElementById('inputTitulo');
var inputData = document.getElementById('inputData');
var inputHora = document.getElementById('inputHora');
var inputTipo = document.getElementById('inputTipo');
var btnSalvar = document.getElementById('btnSalvar');
var btnCancelar = document.getElementById('btnCancelar');
var btnExcluir = document.getElementById('btnExcluir');
var eventoTitulo = document.getElementById('eventoTitulo');
var eventosHoje = document.getElementById('eventos-hoje');
var listaEventosHoje = document.getElementById('lista-eventos-hoje');

var eventos = [];
var eventoEmEdicaoId = null;

var dataAtual = new Date();
var mesAtual = dataAtual.getMonth();
var anoAtual = dataAtual.getFullYear();

var btnConfig = document.getElementById('btn-config');
var dropdownConfig = document.getElementById('dropdown-config');
var btnLogout = document.getElementById('btn-logout');

btnConfig.addEventListener('click', function(e) {
  e.stopPropagation();
  dropdownConfig.classList.toggle('aberto');
});

document.addEventListener('click', function() {
  dropdownConfig.classList.remove('aberto');
});

btnLogout.addEventListener('click', function() {
  sessionStorage.removeItem('plannerUnirio_usuarioLogado');
  window.location.href = 'login.html';
});

function buscarEventosDoDia(dia, mes, ano) {
  var mesFormatado = String(mes + 1);
  if (mesFormatado.length < 2) { mesFormatado = '0' + mesFormatado; }
  var diaFormatado = String(dia);
  if (diaFormatado.length < 2) { diaFormatado = '0' + diaFormatado; }
  
  var dataFormatada = ano + '-' + mesFormatado + '-' + diaFormatado;
  
  var filtrados = [];
  for (var i = 0; i < eventos.length; i++) {
    if (eventos[i].data === dataFormatada) {
      filtrados.push(eventos[i]);
    }
  }
  return filtrados;
}

function atualizarCalendario(mes, ano) {
  var elMes = document.getElementById('mes');
  var elAno = document.getElementById('ano');

  var primeiroDia = new Date(ano, mes, 1).getDay();
  var ultimoDia = new Date(ano, mes + 1, 0).getDate();

  elMes.textContent = meses[mes];
  elAno.textContent = ano;

  el.innerHTML = '';

  for (var i = 0; i < primeiroDia; i++) {
    el.innerHTML += '<span class="vazio"></span>';
  }

  var hoje = new Date();
  var ehMesAtual = hoje.getMonth() === mes && hoje.getFullYear() === ano;

  for (var dia = 1; dia <= ultimoDia; dia++) {
    var eventosDoDia = buscarEventosDoDia(dia, mes, ano);
    var isHoje = ehMesAtual && hoje.getDate() === dia;

    var eventosHTML = '';
    for (var j = 0; j < eventosDoDia.length; j++) {
      var evento = eventosDoDia[j];
      var cor = obterCorEvento(evento.id);
      var horaTexto = evento.hora ? evento.hora + ' · ' : '';
      eventosHTML += '<div class="evento-pill" data-id="' + evento.id + '" style="background-color:' + cor + '">' +
                       horaTexto + evento.nome +
                     '</div>';
    }

    var classeQuadrado = 'dia-quadrado';
    if (isHoje) { classeQuadrado += ' hoje'; }
    
    var classeNumero = 'numero-dia';
    if (isHoje) { classeNumero += ' numero-hoje'; }

    el.innerHTML += '<div class="' + classeQuadrado + '" data-dia="' + dia + '">' +
                      '<span class="' + classeNumero + '">' + dia + '</span>' +
                      '<div class="eventos-lista">' + eventosHTML + '</div>' +
                    '</div>';
  }

  var pills = el.querySelectorAll('.evento-pill');
  for (var k = 0; k < pills.length; k++) {
    (function(pill) {
      pill.addEventListener('click', function(e) {
        e.stopPropagation();
        var id = pill.dataset.id;
        
        var eventoEncontrado = null;
        for (var m = 0; m < eventos.length; m++) {
          if (String(eventos[m].id) === id) {
            eventoEncontrado = eventos[m];
            break;
          }
        }
        if (eventoEncontrado) {
          abrirEdicao(eventoEncontrado);
        }
      });
    })(pills[k]);
  }

  var quadrados = el.querySelectorAll('.dia-quadrado');
  for (var k = 0; k < quadrados.length; k++) {
    (function(quadrado) {
      quadrado.addEventListener('click', function() {
        var dia = quadrado.dataset.dia;
        var mesFormatado = String(mesAtual + 1);
        if (mesFormatado.length < 2) { mesFormatado = '0' + mesFormatado; }
        var diaFormatado = String(dia);
        if (diaFormatado.length < 2) { diaFormatado = '0' + diaFormatado; }
        
        var dataFormatada = anoAtual + '-' + mesFormatado + '-' + diaFormatado;
        inputData.value = dataFormatada;
        mostrarEventosDia(parseInt(dia), mesAtual, anoAtual);
      });
    })(quadrados[k]);
  }
}

function mostrarEventosDia(dia, mes, ano) {
  var eventosDoDia = buscarEventosDoDia(dia, mes, ano);
  if (eventosDoDia.length === 0) {
    eventosHoje.style.display = 'none';
    return;
  }
  eventosHoje.style.display = 'block';
  listaEventosHoje.innerHTML = '';
  
  for (var i = 0; i < eventosDoDia.length; i++) {
    var evento = eventosDoDia[i];
    var cor = obterCorEvento(evento.id);
    var card = document.createElement('div');
    card.className = 'evento-card-mini';
    
    var horaHTML = evento.hora ? '<span class="evento-mini-hora">' + evento.hora + '</span>' : '';
    card.innerHTML = '<span class="evento-cor-dot" style="background:' + cor + '"></span>' +
                     '<span class="evento-mini-info">' +
                       '<strong>' + evento.nome + '</strong>' + horaHTML +
                     '</span>' +
                     '<button class="btn-editar-mini" data-id="' + evento.id + '" title="Editar">✏</button>';
    
    listaEventosHoje.appendChild(card);
  }

  var botoesEditar = listaEventosHoje.querySelectorAll('.btn-editar-mini');
  for (var i = 0; i < botoesEditar.length; i++) {
    (function(btn) {
      btn.addEventListener('click', function() {
        var eventoEncontrado = null;
        for (var j = 0; j < eventos.length; j++) {
          if (String(eventos[j].id) === btn.dataset.id) {
            eventoEncontrado = eventos[j];
            break;
          }
        }
        if (eventoEncontrado) {
          abrirEdicao(eventoEncontrado);
        }
      });
    })(botoesEditar[i]);
  }
}

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
  eventosHoje.style.display = 'none';
}

function limparFormulario() {
  inputTitulo.value = '';
  inputData.value = '';
  inputHora.value = '';
  abrirCriacao();
}

botaoProximo.addEventListener('click', function() {
  mesAtual++;
  if (mesAtual > 11) { mesAtual = 0; anoAtual++; }
  atualizarCalendario(mesAtual, anoAtual);
});

botaoAnterior.addEventListener('click', function() {
  mesAtual--;
  if (mesAtual < 0) { mesAtual = 11; anoAtual--; }
  atualizarCalendario(mesAtual, anoAtual);
});

btnSalvar.addEventListener('click', function() {
  var nomeEvento = inputTitulo.value.trim();
  var dataEvento = inputData.value;
  var horaEvento = inputHora.value;

  if (!nomeEvento || !dataEvento) {
    alert('Preencha pelo menos o título e a data do evento.');
    return;
  }

  if (eventoEmEdicaoId !== null) {
    var eventoEncontrado = null;
    for (var i = 0; i < eventos.length; i++) {
      if (eventos[i].id === eventoEmEdicaoId) {
        eventoEncontrado = eventos[i];
        break;
      }
    }
    if (eventoEncontrado) {
      eventoEncontrado.nome = nomeEvento;
      eventoEncontrado.data = dataEvento;
      eventoEncontrado.hora = horaEvento;
    }
  } else {
    eventos.push(new Evento(nomeEvento, dataEvento, horaEvento));
  }

  salvarNoLocalStorage();
  atualizarCalendario(mesAtual, anoAtual);
  limparFormulario();
});

btnExcluir.addEventListener('click', function() {
  if (eventoEmEdicaoId === null) return;
  
  var index = -1;
  for (var i = 0; i < eventos.length; i++) {
    if (eventos[i].id === eventoEmEdicaoId) {
      index = i;
      break;
    }
  }
  if (index !== -1) {
    eventos.splice(index, 1);
  }
  salvarNoLocalStorage();
  atualizarCalendario(mesAtual, anoAtual);
  limparFormulario();
});

btnCancelar.addEventListener('click', function() {
  limparFormulario();
});

eventos = carregarDoLocalStorage();
abrirCriacao();
atualizarCalendario(mesAtual, anoAtual);