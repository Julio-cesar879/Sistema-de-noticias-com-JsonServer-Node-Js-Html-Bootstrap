const API = "http://localhost:3000/noticias";
const USUARIO_LOGADO_URL = "http://localhost:3000/usuarioLogado";

const LOGIN_URL = "../pages/login.html";

document.addEventListener("DOMContentLoaded", () => {
    carregarFavoritos();
    carregarUsuarioLogado()
});

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

function carregarFavoritos() {
    fetch(API)
        .then((res) => res.json())
        .then((noticias) => {
            const container = document.getElementById("favoritos-container");
            container.innerHTML = "";

            const favoritas = noticias.filter((n) => n.isFavorita);

            if (favoritas.length === 0) {
                container.innerHTML = '<p class="text-center text-danger">Você ainda não marcou nenhuma notícia como favorita.</p>';
                return;
            }

            favoritas.forEach((n) => {
                const col = document.createElement("div");
                col.className = "col-md-4 mb-4";
                col.innerHTML = `
          <div class="card h-100">
            <img src="${n.imagem}" class="card-img-top" style="height:200px; object-fit:cover;" alt="${n.titulo}">
            <div class="card-body">
              <h5 class="card-title">${n.titulo}</h5>
              <p class="card-text">${n.conteudo}...</p>
            </div>
            <div class="card-footer d-flex justify-content-between">
              <a href="detalhes.html?id=${n.id}" class="btn btn-primary btn-sm">Ver Detalhes</a>
              <button class="btn btn-danger btn-sm" data-id="${n.id}">Remover</button>
            </div>
          </div>
        `;

                container.appendChild(col);
            });


            document.querySelectorAll("#favoritos-container button")
                .forEach((btn) => {
                    btn.addEventListener("click", () => {
                        const idNoticia = btn.getAttribute("data-id");
                        desfavoritar(idNoticia);
                    });
                });
        });
}

function desfavoritar(id) {
    fetch(`${API}/${id}`)
        .then((res) => res.json())
        .then((n) => {
            const atualizada = {
                id: n.id,
                titulo: n.titulo,
                conteudo: n.conteudo,
                autor: n.autor,
                dataPublicacao: n.dataPublicacao,
                categoria: n.categoria,
                imagem: n.imagem,
                isFavorita: false,
            };
            fetch(`${API}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(atualizada),
            }).then(() => {
                carregarFavoritos();
            });
        })
        .catch(() => {
            alert("Erro ao remover dos favoritos.");
        });
}
