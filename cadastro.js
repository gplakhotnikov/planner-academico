function carregarUsuarios() {
  const salvo = localStorage.getItem("plannerUnirio_usuarios");
  return salvo ? JSON.parse(salvo) : [];
}

function salvarUsuarios(usuarios) {
  localStorage.setItem("plannerUnirio_usuarios", JSON.stringify(usuarios));
}

function mostrarErro(id, msg) {
  document.getElementById(id).textContent = msg;
}

function limparErros() {
  ["erro-email", "erro-senha", "erro-confirmar"].forEach(id => {
    document.getElementById(id).textContent = "";
  });
}

document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();
  limparErros();

  const email = document.getElementById("campo-email").value.trim();
  const senha = document.getElementById("campo-senha").value;
  const confirmar = document.getElementById("campo-confirmar").value;

  let valido = true;

  if (senha.length < 6) {
    mostrarErro("erro-senha", "A senha deve ter pelo menos 6 caracteres.");
    valido = false;
  }

  if (senha !== confirmar) {
    mostrarErro("erro-confirmar", "As senhas não coincidem.");
    valido = false;
  }

  if (!valido) return;

  const usuarios = carregarUsuarios();

  if (usuarios.find(u => u.email === email)) {
    mostrarErro("erro-email", "Este e-mail já está cadastrado.");
    return;
  }

  usuarios.push({ email, senha });
  salvarUsuarios(usuarios);

  alert("Cadastro realizado com sucesso!");
  window.location.href = "login.html";
});

document.querySelector(".reset").addEventListener("click", () => {
  limparErros();
});
