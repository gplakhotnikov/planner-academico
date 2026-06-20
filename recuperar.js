function carregarUsuarios() {
  var salvo = localStorage.getItem("plannerUnirio_usuarios");
  if (salvo) {
    return JSON.parse(salvo);
  } else {
    return [];
  }
}

function salvarUsuarios(usuarios) {
  localStorage.setItem("plannerUnirio_usuarios", JSON.stringify(usuarios));
}

function mostrarErro(id, msg) {
  document.getElementById(id).textContent = msg;
}

var etapa1 = document.getElementById("etapa-1");
var etapa2 = document.getElementById("etapa-2");
var emailAlvo = "";

// Verificar email
document.getElementById("btn-verificar").addEventListener("click", function() {
  var erroEl = document.getElementById("erro-email");
  erroEl.textContent = "";

  var email = document.getElementById("campo-email").value.trim();
  var usuarios = carregarUsuarios();
  var usuario = null;
  for (var i = 0; i < usuarios.length; i++) {
    if (usuarios[i].email === email) {
      usuario = usuarios[i];
      break;
    }
  }

  if (!usuario) {
    erroEl.textContent = "E-mail não encontrado.";
    return;
  }

  emailAlvo = email;
  etapa1.style.display = "none";
  etapa2.style.display = "block";
});

// Redefinir senha
document.getElementById("btn-redefinir").addEventListener("click", function() {
  var errSenha = document.getElementById("erro-nova-senha");
  var errConfirmar = document.getElementById("erro-confirmar");
  errSenha.textContent = "";
  errConfirmar.textContent = "";

  var novaSenha = document.getElementById("campo-nova-senha").value;
  var confirmar = document.getElementById("campo-confirmar").value;

  var valido = true;

  if (novaSenha.length < 6) {
    errSenha.textContent = "A senha deve ter pelo menos 6 caracteres.";
    valido = false;
  }

  if (novaSenha !== confirmar) {
    errConfirmar.textContent = "As senhas não coincidem.";
    valido = false;
  }

  if (!valido) return;

  var usuarios = carregarUsuarios();
  var usuario = null;
  for (var i = 0; i < usuarios.length; i++) {
    if (usuarios[i].email === emailAlvo) {
      usuario = usuarios[i];
      break;
    }
  }

  if (usuario) {
    usuario.senha = novaSenha;
    salvarUsuarios(usuarios);
  }

  alert("Senha redefinida com sucesso!");
  window.location.href = "login.html";
});