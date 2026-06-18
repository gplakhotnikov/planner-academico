const dadosSalvos = localStorage.getItem("plannerUnirio_notas");
const faltasSalvas = localStorage.getItem("plannerUnirio_faltas");
let disciplinas = [];
let faltas = {};

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

const btnConfig = document.getElementById("btn-config");
const dropdownConfig = document.getElementById("dropdown-config");
const btnLogout = document.getElementById("btn-logout");

btnConfig.addEventListener("click", (e) => {
  e.stopPropagation();
  dropdownConfig.classList.toggle("aberto");
});

document.addEventListener("click", () => {
  dropdownConfig.classList.remove("aberto");
});

btnLogout.addEventListener("click", () => {
  sessionStorage.removeItem("plannerUnirio_usuarioLogado");
  window.location.href = "login.html";
});


const tbody = document.querySelector("table tbody");
const selectDisciplina = document.getElementById("select-disciplina");
const inputNovaDisciplina = document.getElementById("nova-disciplina");
const btnAddDisciplina = document.getElementById("ad18");
const btnAddNota = document.querySelectorAll(".btn-add")[1];
const selectTipo = document.getElementById("select-tipo");
const inputNota = document.getElementById("valor-nota");

// Remover disciplina
const selectRemoverDisciplina = document.getElementById("select-remover-disciplina");
const btnRemoverDisciplina = document.getElementById("btn-remover-disciplina");

const selectDisciplinaFalta = document.getElementById("select-disciplina-falta");
const inputLimiteFalta = document.getElementById("limite-falta");
const btnDefinirLimite = document.getElementById("btn-definir-limite");
const faltasLista = document.getElementById("faltas-lista");

function salvarDados() {
  localStorage.setItem("plannerUnirio_notas", JSON.stringify(disciplinas));
}

function salvarFaltas() {
  localStorage.setItem("plannerUnirio_faltas", JSON.stringify(faltas));
}

function calcularMedia(notas) {
  let soma = 0;
  let qtd = 0;
  for (let chave in notas) {
    if (notas[chave] !== null) {
      soma += parseFloat(notas[chave]);
      qtd++;
    }
  }
  return qtd === 0 ? "-" : (soma / qtd).toFixed(1);
}

function atualizarTela() {
  tbody.innerHTML = "";
  selectDisciplina.innerHTML = '<option value="">Selecione a Disciplina</option>';
  selectRemoverDisciplina.innerHTML = '<option value="">Selecione a Disciplina para Remover</option>'; // Limpa o select de remoção

  disciplinas.forEach((disc, index) => {
    const tr = document.createElement("tr");

    const tdNome = document.createElement("td");
    tdNome.textContent = disc.nome;
    tr.appendChild(tdNome);

    const tipos = ["Prova 1", "Prova 2", "Projeto", "Prova Final"];
    tipos.forEach(tipo => {
      const td = document.createElement("td");
      td.textContent = disc.notas[tipo] !== null ? disc.notas[tipo] : "-";
      tr.appendChild(td);
    });

    const tdMedia = document.createElement("td");
    tdMedia.textContent = calcularMedia(disc.notas);
    tr.appendChild(tdMedia);

    tbody.appendChild(tr);

    // Popular SELECT adicionar nota
    const option = document.createElement("option");
    option.value = index;
    option.textContent = disc.nome;
    selectDisciplina.appendChild(option);

    // Popular o SELECT remover disciplina
    const optionRemover = document.createElement("option");
    optionRemover.value = index;
    optionRemover.textContent = disc.nome;
    selectRemoverDisciplina.appendChild(optionRemover);
  });
}

function atualizarFaltasUI() {
  selectDisciplinaFalta.innerHTML = '<option value="">Selecione a Disciplina</option>';
  disciplinas.forEach(disc => {
    const opt = document.createElement("option");
    opt.value = disc.nome;
    opt.textContent = disc.nome;
    selectDisciplinaFalta.appendChild(opt);
  });

  faltasLista.innerHTML = "";
  if (disciplinas.length === 0) {
    faltasLista.innerHTML = '<p style="color:#999;font-size:14px;">Nenhuma disciplina cadastrada.</p>';
    return;
  }

  disciplinas.forEach(disc => {
    const nome = disc.nome;
    if (!faltas[nome]) faltas[nome] = { count: 0, limite: null };
    const { count, limite } = faltas[nome];
    const emRisco = limite !== null && count >= Math.ceil(limite * 0.75);
    const excedido = limite !== null && count >= limite;

    const card = document.createElement("div");
    card.className = "falta-card" + (excedido ? " falta-excedida" : emRisco ? " falta-risco" : "");

    const pct = limite ? Math.min(count / limite, 1) : 0;
    const barColor = excedido ? "#e53935" : emRisco ? "#ff8c1a" : "#007bff";

    const limiteTexto = limite !== null
      ? `${count} de ${limite} faltas permitidas`
      : `${count} falta${count !== 1 ? "s" : ""} registrada${count !== 1 ? "s" : ""} <span style="color:#aaa">(limite não definido)</span>`;

    card.innerHTML = `
      <div class="falta-card-header">
        <span class="falta-nome">${nome}</span>
        <span class="falta-badge ${excedido ? "badge-danger" : emRisco ? "badge-warn" : "badge-ok"}">
          ${excedido ? "⚠ Limite excedido" : emRisco ? "⚠ Atenção" : "✓ OK"}
        </span>
      </div>
      ${limite !== null ? `
      <div class="falta-progress-wrap">
        <div class="falta-progress-bar" style="width:${pct * 100}%; background:${barColor};"></div>
      </div>` : ""}
      <div class="falta-card-footer">
        <span class="falta-count">${limiteTexto}</span>
        <div class="falta-controls">
          <button class="btn-falta btn-minus" data-nome="${nome}" title="Remover uma falta">−</button>
          <button class="btn-falta btn-plus" data-nome="${nome}" title="Registrar uma falta">+</button>
        </div>
      </div>
    `;
    faltasLista.appendChild(card);
  });

  faltasLista.querySelectorAll(".btn-plus").forEach(btn => {
    btn.addEventListener("click", () => {
      const nome = btn.dataset.nome;
      faltas[nome].count++;
      salvarFaltas();
      atualizarFaltasUI();
    });
  });
  faltasLista.querySelectorAll(".btn-minus").forEach(btn => {
    btn.addEventListener("click", () => {
      const nome = btn.dataset.nome;
      if (faltas[nome].count > 0) faltas[nome].count--;
      salvarFaltas();
      atualizarFaltasUI();
    });
  });
}

btnDefinirLimite.addEventListener("click", () => {
  const nome = selectDisciplinaFalta.value;
  const limite = parseInt(inputLimiteFalta.value);
  if (nome && !isNaN(limite) && limite > 0) {
    if (!faltas[nome]) faltas[nome] = { count: 0, limite: null };
    faltas[nome].limite = limite;
    inputLimiteFalta.value = "";
    selectDisciplinaFalta.value = "";
    salvarFaltas();
    atualizarFaltasUI();
  }
});

btnAddDisciplina.addEventListener("click", () => {
  const nome = inputNovaDisciplina.value.trim();
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

btnAddNota.addEventListener("click", () => {
  const indexDisc = selectDisciplina.value;
  const tipo = selectTipo.value;
  const valor = inputNota.value;

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

// Remover disciplina
btnRemoverDisciplina.addEventListener("click", () => {
  const indexDisc = selectRemoverDisciplina.value;
  
  if (indexDisc !== "") {
    const nomeDisc = disciplinas[indexDisc].nome;
    
    // Remove do array de disciplinas
    disciplinas.splice(indexDisc, 1);
    
    // Limpar faltas
    if (faltas[nomeDisc]) {
      delete faltas[nomeDisc];
    }
    
    // Atualizar localStorage e tela
    salvarDados();
    salvarFaltas();
    atualizarTela();
    atualizarFaltasUI();
  }
});

window.addEventListener("DOMContentLoaded", () => {
  atualizarTela();
  atualizarFaltasUI();
});
