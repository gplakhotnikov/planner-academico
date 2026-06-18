const dadosSalvos = localStorage.getItem("plannerUnirio_notas");
let disciplinas = [];

if (dadosSalvos) {
  disciplinas = JSON.parse(dadosSalvos);
} else {
  disciplinas = [
    { nome: "Algebra Linear", notas: { "Prova 1": 8.5, "Prova 2": 7.0, "Projeto": null, "Prova Final": null } },
    { nome: "Projeto Integrador I", notas: { "Prova 1": 10, "Prova 2": 10, "Projeto": 10, "Prova Final": null } },
    { nome: "Técnicas de Programação", notas: { "Prova 1": 6.0, "Prova 2": 8.0, "Projeto": 7.5, "Prova Final": null } },
    { nome: "Gestão de Processos de Negócios", notas: { "Prova 1": 9.0, "Prova 2": 8.5, "Projeto": null, "Prova Final": null } }
  ];
}

const tbody = document.querySelector("table tbody");
const selectDisciplina = document.getElementById("select-disciplina");
const inputNovaDisciplina = document.getElementById("nova-disciplina");
const btnAddDisciplina = document.getElementById("ad18");
const btnAddNota = document.querySelectorAll(".btn-add")[1];
const selectTipo = document.getElementById("select-tipo");
const inputNota = document.getElementById("valor-nota");

function salvarDados() {
  localStorage.setItem("plannerUnirio_notas", JSON.stringify(disciplinas));
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

    const option = document.createElement("option");
    option.value = index;
    option.textContent = disc.nome;
    selectDisciplina.appendChild(option);
  });
}

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
  }
});

window.addEventListener("DOMContentLoaded", atualizarTela);