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

const etapa1 = document.getElementById("etapa-1");
const etapa2 = document.getElementById("etapa-2");
let emailAlvo = "";

// Verificar email
document.getElementById("btn-verificar").addEventListener("click", () => {
  const erroEl = document.getElementById("erro-email");
  erroEl.textContent = "";

  const email = document.getElementById("campo-email").value.trim();
  const usuarios = carregarUsuarios();
  const usuario = usuarios.find(u => u.email === email);

  if (!usuario) {
    erroEl.textContent = "E-mail não encontrado.";
    return;
  }

  emailAlvo = email;
  etapa1.style.display = "none";
  etapa2.style.display = "block";
});

// Redefinir senha
document.getElementById("btn-redefinir").addEventListener("click", () => {
  const errSenha = document.getElementById("erro-nova-senha");
  const errConfirmar = document.getElementById("erro-confirmar");
  errSenha.textContent = "";
  errConfirmar.textContent = "";

  const novaSenha = document.getElementById("campo-nova-senha").value;
  const confirmar = document.getElementById("campo-confirmar").value;

  let valido = true;

  if (novaSenha.length < 6) {
    errSenha.textContent = "A senha deve ter pelo menos 6 caracteres.";
    valido = false;
  }

  if (novaSenha !== confirmar) {
    errConfirmar.textContent = "As senhas não coincidem.";
    valido = false;
  }

  if (!valido) return;

  const usuarios = carregarUsuarios();
  const usuario  = usuarios.find(u => u.email === emailAlvo);
  usuario.senha  = novaSenha;
  salvarUsuarios(usuarios);

  alert("Senha redefinida com sucesso!");
  window.location.href = "login.html";
});
