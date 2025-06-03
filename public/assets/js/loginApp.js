const LOGIN_URL = "../pages/login.html";
const INDEX_URL = "../pages/index.html";

const API_URL = "http://localhost:3000/usuarios";
const USUARIO_LOGADO_URL = "http://localhost:3000/usuarioLogado";

let db_usuarios = [];

function initLoginApp() {
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            db_usuarios = data;
        })
        .catch(() => alert('Erro ao buscar usuários no servidor.'));
}

function generateUUID() {
    let d = new Date().getTime();
    let d2 = (performance && performance.now && (performance.now() * 1000)) || 0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16;
        if (d > 0) {
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

function loginUser(email, senha) {
    for (let i = 0; i < db_usuarios.length; i++) {
        const u = db_usuarios[i];
        if (email === u.email && senha === u.senha) {
            fetch(USUARIO_LOGADO_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(u)
            })
                .then(() => {
                    window.location.href = INDEX_URL;
                });
            return true;
        }
    }
    return false;
}

function addUser(nome, login, senha, email, isAdmin) {
    const novoUsuario = {
        id: generateUUID(),
        nome: nome,
        login: login,
        senha: senha,
        email: email,
        isAdmin: isAdmin
    };

    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoUsuario)
    })
        .then(res => res.json())
        .then(() => {
            alert("Usuário cadastrado com sucesso!");
            window.location.href = LOGIN_URL;
        })
        .catch(() => alert("Erro ao cadastrar usuário"));
}


function fazerLogin(event) {
    event.preventDefault();
    const email = document.getElementById("login").value.trim();
    const senha = document.getElementById("senha").value.trim();

    if (!loginUser(email, senha)) {
        alert("Usuário ou senha incorretos.");
    }
}

function registrarUsuario(event) {
    event.preventDefault();
    const nome = document.getElementById("nome").value.trim();
    const login = document.getElementById("login").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const isAdmin = document.getElementById("isAdmin").checked;

    addUser(nome, login, senha, email, isAdmin);
}

initLoginApp();
