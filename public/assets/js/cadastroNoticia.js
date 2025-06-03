const API_NOTICIAS = "http://localhost:3000/noticias";
const USUARIO_LOGADO_URL = "http://localhost:3000/usuarioLogado";
const LOGIN_URL = "../pages/login.html";
const INDEX_URL = "../pages/index.html";

let usuarioLogado = null;

document.addEventListener("DOMContentLoaded", () => {
    verificarAdmin();
    carregarUsuarioLogado();
    document.getElementById("form-cadastro-noticia").addEventListener("submit", cadastrarNoticia);
});

function verificarAdmin() {
    fetch(USUARIO_LOGADO_URL)
        .then((res) => res.json())
        .then((arr) => {
            if (arr.length === 0) {
                alert("Você precisa estar logado para cadastrar notícias.");
                window.location.href = LOGIN_URL;
                return;
            }
            usuarioLogado = arr[0];
            if (!usuarioLogado.isAdmin) {
                alert("Apenas administradores podem cadastrar notícias.");
                window.location.href = INDEX_URL;
                return;
            }
        })
        .catch(() => {
            alert("Erro ao verificar usuário logado.");
            window.location.href = LOGIN_URL;
        });
}

function carregarUsuarioLogado() {
    fetch(USUARIO_LOGADO_URL)
        .then(res => res.json())
        .then(data => {
            if (data.length > 0) {
                const usuario = data[0];
                const nomeSpan = document.getElementById('usuario-logado');
                if (usuario.isAdmin) {
                    nomeSpan.textContent = `Olá Admin, ${usuario.nome}`;
                }
                else {
                    nomeSpan.textContent = `Olá, ${usuario.nome}`;
                }
            }
        })
}

function generateUUID() {
    let d = new Date().getTime();
    let d2 = (performance && performance.now && performance.now() * 1000) || 0;
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        let r = Math.random() * 16;
        if (d > 0) {
            r = ((d + r) % 16) | 0;
            d = Math.floor(d / 16);
        } else {
            r = ((d2 + r) % 16) | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
}

function cadastrarNoticia(event) {
    event.preventDefault();
    const titulo = document.getElementById("titulo").value.trim();
    const conteudo = document.getElementById("conteudo").value.trim();
    const categoria = document.getElementById("categoria").value.trim();
    const dataPublicacao = document.getElementById("dataPublicacao").value.trim();
    const imagem = document.getElementById("imagem").value.trim();

    const novaNoticia = {
        id: generateUUID(),
        titulo: titulo,
        conteudo: conteudo,
        autor: usuarioLogado.nome,
        dataPublicacao: dataPublicacao,
        categoria: categoria,
        imagem: imagem,
        isFavorita: false,
    };

    fetch(API_NOTICIAS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaNoticia),
    })
        .then((res) => {
            if (!res.ok) alert("Falha ao cadastrar notícia");
            alert("Notícia cadastrada com sucesso!");
            window.location.href = INDEX_URL;
        })
        .catch((err) => {
            alert("Erro ao cadastrar notícia: " + err.message);
        });
}


