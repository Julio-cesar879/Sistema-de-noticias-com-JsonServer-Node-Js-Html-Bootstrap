const API = "http://localhost:3000/noticias";
const USUARIO_LOGADO_URL = 'http://localhost:3000/usuarioLogado';

document.addEventListener("DOMContentLoaded", () => {
    carregarDetalhes();
    carregarUsuarioLogado()
});

function carregarDetalhes() {
    const params = new URLSearchParams(location.search);
    const id = params.get("id");
    if (!id) {
        document.getElementById("detalhes-container").textContent = "Notícia não encontrada.";
        return;
    }

    fetch(`${API}/${id}`)
        .then((res) => {
            return res.json();
        })
        .then((n) => renderizarDetalhes(n))
}

function renderizarDetalhes(n) {
    const container = document.getElementById("detalhes-container");
    container.innerHTML = `
    <div class="col-md-6">
      <img src="${n.imagem}" class="img-fluid rounded" alt="${n.titulo}" />
    </div>
    <div class="col-md-6">
      <h3>${n.titulo}</h3>
      <p><strong>Autor:</strong> ${n.autor}</p>
      <p><strong>Data de Publicação:</strong> ${n.dataPublicacao}</p>
      <p><strong>Categoria:</strong> ${n.categoria}</p>
      <hr />
      <p>${n.conteudo}</p>
    </div>
  `;
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
