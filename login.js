function carregarUsuarios() {
  const salvo = localStorage.getItem("plannerUnirio_usuarios");
  return salvo ? JSON.parse(salvo) : [];
}

function mostrarErro(id, msg) {
  document.getElementById(id).textContent = msg;
}

function limparErros() {
  ["erro-email", "erro-senha"].forEach(id => {
    document.getElementById(id).textContent = "";
  });
}

document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();
  limparErros();

  const email = document.getElementById("campo-email").value.trim();
  const senha = document.getElementById("campo-senha").value;

  const usuarios = carregarUsuarios();
  const usuario = usuarios.find(u => u.email === email);

  if (!usuario) {
    mostrarErro("erro-email", "E-mail não encontrado.");
    return;
  }

  if (usuario.senha !== senha) {
    mostrarErro("erro-senha", "Senha incorreta.");
    return;
  }

  // Salvar sessão
  sessionStorage.setItem("plannerUnirio_usuarioLogado", email);
  window.location.href = "agenda.html";
});

document.querySelector(".reset").addEventListener("click", () => {
  limparErros();
});
