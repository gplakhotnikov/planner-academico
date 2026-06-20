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

function limparErros() {
  var ids = ["erro-email", "erro-senha", "erro-confirmar"];
  for (var i = 0; i < ids.length; i++) {
    document.getElementById(ids[i]).textContent = "";
  }
}

document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();
  limparErros();

  var email = document.getElementById("campo-email").value.trim();
  var senha = document.getElementById("campo-senha").value;
  var confirmar = document.getElementById("campo-confirmar").value;

  var valido = true;

  if (senha.length < 6) {
    mostrarErro("erro-senha", "A senha deve ter pelo menos 6 caracteres.");
    valido = false;
  }

  if (senha !== confirmar) {
    mostrarErro("erro-confirmar", "As senhas não coincidem.");
    valido = false;
  }

  if (!valido) return;

  var usuarios = carregarUsuarios();

  var emailJaExiste = false;
  for (var i = 0; i < usuarios.length; i++) {
    if (usuarios[i].email === email) {
      emailJaExiste = true;
      break;
    }
  }

  if (emailJaExiste) {
    mostrarErro("erro-email", "Este e-mail já está cadastrado.");
    return;
  }

  usuarios.push({ email: email, senha: senha });
  salvarUsuarios(usuarios);

  alert("Cadastro realizado com sucesso!");
  window.location.href = "login.html";
});

document.querySelector(".reset").addEventListener("click", function() {
  limparErros();
});