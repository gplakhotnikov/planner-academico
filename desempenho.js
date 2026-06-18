const CORES_FALTAS = ["#ff4d4d", "#ff8c1a", "#ffcc00", "#e60073", "#9b59b6", "#1abc9c"];

function carregarDados() {
  const dadosSalvos  = localStorage.getItem("plannerUnirio_notas");
  const faltasSalvas = localStorage.getItem("plannerUnirio_faltas");
  return {
    disciplinas: dadosSalvos  ? JSON.parse(dadosSalvos)  : [],
    faltas:      faltasSalvas ? JSON.parse(faltasSalvas) : {}
  };
}

  const btnConfig      = document.getElementById("btn-config");
  const dropdownConfig = document.getElementById("dropdown-config");
  const btnLogout      = document.getElementById("btn-logout");

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


function calcularMedia(notas) {
  let soma = 0, qtd = 0;
  for (const chave in notas) {
    if (notas[chave] !== null && notas[chave] !== undefined) {
      soma += parseFloat(notas[chave]);
      qtd++;
    }
  }
  return qtd === 0 ? null : parseFloat((soma / qtd).toFixed(1));
}

// Abreviações (REMOVE "DE", "E", "COM")
function abreviar(nome) {
  return nome
    .split(" ")
    .filter(p => p.length > 0 && p.toLowerCase() !== "de" && p.toLowerCase() !== "e" && p.toLowerCase() !== "com")
    .map(p => p[0].toUpperCase())
    .join("")
    .slice(0, 4);
}

function mensagemVazia(section, texto) {
  const p = document.createElement("p");
  p.style.cssText = "color:#999;font-size:14px;margin-top:8px;";
  p.textContent = texto;
  section.appendChild(p);
}

// Média por disciplina
function renderMedias(disciplinas) {
  const section = document.querySelectorAll("section")[0];
  section.querySelectorAll(".linha").forEach(el => el.remove());

  if (disciplinas.length === 0) {
    mensagemVazia(section, "Nenhuma disciplina cadastrada ainda.");
    return;
  }

  let algumDado = false;
  disciplinas.forEach(disc => {
    const media = calcularMedia(disc.notas);
    if (media === null) return;
    algumDado = true;

    const pct   = (media / 10) * 100;
    const abrev = abreviar(disc.nome);

    const linha = document.createElement("div");
    linha.className = "linha";
    linha.innerHTML = `
      <span title="${disc.nome}">${abrev}</span>
      <div class="barra">
        <div class="aluno" style="width:${pct}%">${media}</div>
      </div>`;
    section.appendChild(linha);
  });

  if (!algumDado) {
    mensagemVazia(section, "Nenhuma nota lançada ainda.");
  }
}

// Gráfico pizza
function renderPizza(disciplinas, faltas) {
  const pizza      = document.querySelector(".pizza-semestre");
  const legendaGrid = document.querySelector(".legenda-grid");
  legendaGrid.innerHTML = "";

  if (disciplinas.length === 0) {
    pizza.style.background = "#e0e0e0";
    legendaGrid.innerHTML = '<p style="color:#999;font-size:14px;">Nenhuma disciplina cadastrada.</p>';
    return;
  }

  // Calcular total de aulas estimado
  let totalAulas = 0;
  disciplinas.forEach(disc => {
    const limite = faltas[disc.nome]?.limite ?? null;
    totalAulas += limite !== null ? limite * 4 : 32;
  });

  let totalFaltas = 0;
  const faltasPorDisc = {};
  disciplinas.forEach(disc => {
    const count = faltas[disc.nome]?.count ?? 0;
    faltasPorDisc[disc.nome] = count;
    totalFaltas += count;
  });

  const totalPresencas = Math.max(totalAulas - totalFaltas, 0);
  const pctPresenca    = (totalPresencas / totalAulas) * 100;

  const partes = [`#007bff 0% ${pctPresenca.toFixed(2)}%`];
  let acum = pctPresenca;
  disciplinas.forEach((disc, i) => {
    const count = faltasPorDisc[disc.nome] ?? 0;
    const pct   = (count / totalAulas) * 100;
    const cor   = CORES_FALTAS[i % CORES_FALTAS.length];
    if (pct > 0) {
      partes.push(`${cor} ${acum.toFixed(2)}% ${(acum + pct).toFixed(2)}%`);
    }
    acum += pct;
  });

  pizza.style.background = `conic-gradient(${partes.join(", ")})`;

  // Legendas
  legendaGrid.innerHTML = `
    <div class="legenda-item">
      <span class="caixa-cor presenca"></span>
      Presenças: ${totalPresencas}
    </div>`;

  disciplinas.forEach((disc, i) => {
    const abrev = abreviar(disc.nome);
    const count = faltasPorDisc[disc.nome] ?? 0;
    const cor   = CORES_FALTAS[i % CORES_FALTAS.length];
    legendaGrid.innerHTML += `
      <div class="legenda-item">
        <span class="caixa-cor" style="background:${cor}"></span>
        Faltas ${abrev}: ${count}
      </div>`;
  });
}

// Coisinha pro limite de faltas ficar bonitinho
function renderLimiteFaltas(disciplinas, faltas) {
  const container = document.querySelector(".limite-container");
  container.innerHTML = "";

  if (disciplinas.length === 0) {
    container.innerHTML = '<p style="color:#999;font-size:14px;">Nenhuma disciplina cadastrada.</p>';
    return;
  }

  disciplinas.forEach((disc, i) => {
    const nome   = disc.nome;
    const abrev  = abreviar(nome);
    const count  = faltas[nome]?.count  ?? 0;
    const limite = faltas[nome]?.limite ?? null;

    const pct         = limite ? Math.min((count / limite) * 100, 100) : 0;
    const cor         = CORES_FALTAS[i % CORES_FALTAS.length];
    const contagem    = limite !== null ? `${count}/${limite}` : `${count}/?`;
    const semLimite   = limite === null;

    const coluna = document.createElement("div");
    coluna.className = "coluna-falta";
    coluna.innerHTML = `
      <div class="barra-vertical">
        <div class="preenchimento-falta"
             style="height:${pct}%; background:${semLimite ? "#ccc" : cor};"></div>
      </div>
      <span class="label-materia" title="${nome}">${abrev}</span>
      <span class="contagem">${contagem}</span>`;
    container.appendChild(coluna);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  const { disciplinas, faltas } = carregarDados();
  renderMedias(disciplinas);
  renderPizza(disciplinas, faltas);
  renderLimiteFaltas(disciplinas, faltas);
});