var dadosSalvos = localStorage.getItem("plannerUnirio_notas");
var faltasSalvas = localStorage.getItem("plannerUnirio_faltas");
var disciplinas = [];
var faltas = {};

if (faltasSalvas) {
  faltas = JSON.parse(faltasSalvas);
}

if (dadosSalvos) {
  disciplinas = JSON.parse(dadosSalvos);
} else {
  disciplinas = [
    { nome: "Algebra Linear", notas: { "Prova 1": 8.5, "Prova 2": 7.0, "Projeto": null, "Prova Final": null } },
    { nome: "Projeto Integrador 1", notas: { "Prova 1": 10, "Prova 2": 10, "Projeto": 10, "Prova Final": null } },
    { nome: "Técnicas de Programação", notas: { "Prova 1": 6.0, "Prova 2": 8.0, "Projeto": 7.5, "Prova Final": null } },
    { nome: "Gestão de Processos de Negócios", notas: { "Prova 1": 9.0, "Prova 2": 8.5, "Projeto": null, "Prova Final": null } }
  ];
}

var btnConfig = document.getElementById("btn-config");
var dropdownConfig = document.getElementById("dropdown-config");
var btnLogout = document.getElementById("btn-logout");

btnConfig.addEventListener("click", function(e) {
  e.stopPropagation();
  dropdownConfig.classList.toggle("aberto");
});

document.addEventListener("click", function() {
  dropdownConfig.classList.remove("aberto");
});

btnLogout.addEventListener("click", function() {
  sessionStorage.removeItem("plannerUnirio_usuarioLogado");
  window.location.href = "login.html";
});

var tbody = document.querySelector("table tbody");
var selectDisciplina = document.getElementById("select-disciplina");
var inputNovaDisciplina = document.getElementById("nova-disciplina");
var btnAddDisciplina = document.getElementById("ad18");
var btnAddNota = document.querySelectorAll(".btn-add")[1];
var selectTipo = document.getElementById("select-tipo");
var inputNota = document.getElementById("valor-nota");

var selectRemoverDisciplina = document.getElementById("select-remover-disciplina");
var btnRemoverDisciplina = document.getElementById("btn-remover-disciplina");

var selectDisciplinaFalta = document.getElementById("select-disciplina-falta");
var inputLimiteFalta = document.getElementById("limite-falta");
var btnDefinirLimite = document.getElementById("btn-definir-limite");
var faltasLista = document.getElementById("faltas-lista");

function salvarDados() {
  localStorage.setItem("plannerUnirio_notas", JSON.stringify(disciplinas));
}

function salvarFaltas() {
  localStorage.setItem("plannerUnirio_faltas", JSON.stringify(faltas));
}

function calcularMedia(notas) {
  var soma = 0;
  var qtd = 0;
  for (var chave in notas) {
    if (notas[chave] !== null) {
      soma += parseFloat(notas[chave]);
      qtd++;
    }
  }
  if (qtd === 0) {
    return "-";
  } else {
    return (soma / qtd).toFixed(1);
  }
}

function atualizarTela() {
  tbody.innerHTML = "";
  selectDisciplina.innerHTML = '<option value="">Selecione a Disciplina</option>';
  selectRemoverDisciplina.innerHTML = '<option value="">Selecione a Disciplina para Remover</option>';

  for (var i = 0; i < disciplinas.length; i++) {
    var disc = disciplinas[i];
    var tr = document.createElement("tr");

    var tdNome = document.createElement("td");
    tdNome.textContent = disc.nome;
    tr.appendChild(tdNome);

    var tipos = ["Prova 1", "Prova 2", "Projeto", "Prova Final"];
    for (var j = 0; j < tipos.length; j++) {
      var tipo = tipos[j];
      var td = document.createElement("td");
      if (disc.notas[tipo] !== null) {
        td.textContent = disc.notas[tipo];
      } else {
        td.textContent = "-";
      }
      tr.appendChild(td);
    }

    var tdMedia = document.createElement("td");
    tdMedia.textContent = calcularMedia(disc.notas);
    tr.appendChild(tdMedia);

    tbody.appendChild(tr);

    var option = document.createElement("option");
    option.value = i;
    option.textContent = disc.nome;
    selectDisciplina.appendChild(option);

    var optionRemover = document.createElement("option");
    optionRemover.value = i;
    optionRemover.textContent = disc.nome;
    selectRemoverDisciplina.appendChild(optionRemover);
  }
}

function atualizarFaltasUI() {
  selectDisciplinaFalta.innerHTML = '<option value="">Selecione a Disciplina</option>';
  
  for (var i = 0; i < disciplinas.length; i++) {
    var opt = document.createElement("option");
    opt.value = disciplinas[i].nome;
    opt.textContent = disciplinas[i].nome;
    selectDisciplinaFalta.appendChild(opt);
  }

  faltasLista.innerHTML = "";
  if (disciplinas.length === 0) {
    faltasLista.innerHTML = '<p style="color:#999;font-size:14px;">Nenhuma disciplina cadastrada.</p>';
    return;
  }

  for (var i = 0; i < disciplinas.length; i++) {
    var nome = disciplinas[i].nome;
    if (!faltas[nome]) {
      faltas[nome] = { count: 0, limite: null };
    }
    
    var count = faltas[nome].count;
    var limite = faltas[nome].limite;
    
    var emRisco = limite !== null && count >= Math.ceil(limite * 0.75);
    var excedido = limite !== null && count >= limite;

    var classeCard = "falta-card";
    if (excedido) { 
      classeCard += " falta-excedida"; 
    } else if (emRisco) { 
      classeCard += " falta-risco"; 
    }

    var pct = 0;
    if (limite) { pct = Math.min(count / limite, 1); }
    
    var barColor = "#007bff";
    if (excedido) { 
      barColor = "#e53935"; 
    } else if (emRisco) { 
      barColor = "#ff8c1a"; 
    }

    var classeBadge = "badge-ok";
    var textoBadge = "✓ OK";
    if (excedido) {
      classeBadge = "badge-danger";
      textoBadge = "⚠ Limite excedido";
    } else if (emRisco) {
      classeBadge = "badge-warn";
      textoBadge = "⚠ Atenção";
    }

    var limiteTexto = "";
    if (limite !== null) {
      limiteTexto = count + " de " + limite + " faltas permitidas";
    } else {
      var sCount = count !== 1 ? "s" : "";
      var sReg = count !== 1 ? "s" : "";
      limiteTexto = count + " falta" + sCount + " registrada" + sReg + " <span style=\"color:#aaa\">(limite não definido)</span>";
    }

    var progressoHTML = "";
    if (limite !== null) {
      progressoHTML = '<div class="falta-progress-wrap">' +
                        '<div class="falta-progress-bar" style="width:' + (pct * 100) + '%; background:' + barColor + ';"></div>' +
                      '</div>';
    }

    var card = document.createElement("div");
    card.className = classeCard;
    card.innerHTML = '<div class="falta-card-header">' +
                        '<span class="falta-nome">' + nome + '</span>' +
                        '<span class="falta-badge ' + classeBadge + '">' + textoBadge + '</span>' +
                      '</div>' +
                      progressoHTML +
                      '<div class="falta-card-footer">' +
                        '<span class="falta-count">' + limiteTexto + '</span>' +
                        '<div class="falta-controls">' +
                          '<button class="btn-falta btn-minus" data-nome="' + nome + '" title="Remover uma falta">−</button>' +
                          '<button class="btn-falta btn-plus" data-nome="' + nome + '" title="Registrar uma falta">+</button>' +
                        '</div>' +
                      '</div>';
                      
    faltasLista.appendChild(card);
  }

  var botoesPlus = faltasLista.querySelectorAll(".btn-plus");
  for (var i = 0; i < botoesPlus.length; i++) {
    (function(btn) {
      btn.addEventListener("click", function() {
        var nomeMateria = btn.dataset.nome;
        faltas[nomeMateria].count++;
        salvarFaltas();
        atualizarFaltasUI();
      });
    })(botoesPlus[i]);
  }

  var botoesMinus = faltasLista.querySelectorAll(".btn-minus");
  for (var i = 0; i < botoesMinus.length; i++) {
    (function(btn) {
      btn.addEventListener("click", function() {
        var nomeMateria = btn.dataset.nome;
        if (faltas[nomeMateria].count > 0) {
          faltas[nomeMateria].count--;
        }
        salvarFaltas();
        atualizarFaltasUI();
      });
    })(botoesMinus[i]);
  }
}

btnDefinirLimite.addEventListener("click", function() {
  var nome = selectDisciplinaFalta.value;
  var limite = parseInt(inputLimiteFalta.value);
  if (nome && !isNaN(limite) && limite > 0) {
    if (!faltas[nome]) {
      faltas[nome] = { count: 0, limite: null };
    }
    faltas[nome].limite = limite;
    inputLimiteFalta.value = "";
    selectDisciplinaFalta.value = "";
    salvarFaltas();
    atualizarFaltasUI();
  }
});

btnAddDisciplina.addEventListener("click", function() {
  var nome = inputNovaDisciplina.value.trim();
  if (nome !== "") {
    disciplinas.push({
      nome: nome,
      notas: { "Prova 1": null, "Prova 2": null, "Projeto": null, "Prova Final": null }
    });
    inputNovaDisciplina.value = "";
    salvarDados();
    atualizarTela();
    atualizarFaltasUI();
  }
});

btnAddNota.addEventListener("click", function() {
  var indexDisc = selectDisciplina.value;
  var tipo = selectTipo.value;
  var valor = inputNota.value;

  if (indexDisc !== "" && tipo !== "" && valor !== "") {
    disciplinas[indexDisc].notas[tipo] = parseFloat(valor);
    inputNota.value = "";
    selectTipo.value = "";
    selectDisciplina.value = "";
    salvarDados();
    atualizarTela();
    atualizarFaltasUI();
  }
});

btnRemoverDisciplina.addEventListener("click", function() {
  var indexDisc = selectRemoverDisciplina.value;
  
  if (indexDisc !== "") {
    var nomeDisc = disciplinas[indexDisc].nome;
    disciplinas.splice(indexDisc, 1);
    
    if (faltas[nomeDisc]) {
      delete faltas[nomeDisc];
    }
    
    salvarDados();
    salvarFaltas();
    atualizarTela();
    atualizarFaltasUI();
  }
});

window.addEventListener("DOMContentLoaded", function() {
  atualizarTela();
  atualizarFaltasUI();
});