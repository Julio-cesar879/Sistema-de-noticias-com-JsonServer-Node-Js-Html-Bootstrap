const API = 'http://localhost:3000/noticias';
const API_ALUNO = 'http://localhost:3000/alunoTrabalho';
const USUARIO_LOGADO_URL = 'http://localhost:3000/usuarioLogado';

document.addEventListener('DOMContentLoaded', () => {
    carregarCarrossel();
    carregarCards();
    carregarAutor();
    carregarUsuarioLogado();
    const campoBusca = document.getElementById('busca');
    if (campoBusca) {
        campoBusca.addEventListener('input', carregarCards);
    }
});

function carregarUsuarioLogado() {
    fetch(USUARIO_LOGADO_URL)
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                const usuario = data[0];
                const nomeSpan = document.getElementById('usuario-logado');
                if (usuario.isAdmin) {
                    nomeSpan.textContent = `Olá Admin, ${usuario.nome}`;
                }
                else {
                    nomeSpan.textContent = `Olá, ${usuario.nome}`;
                }

                const btnLogin = document.getElementById('btn-login');
                if (btnLogin) {
                    btnLogin.textContent = 'Logout';
                    btnLogin.onclick = function (e) {
                        e.preventDefault();
                        logoutUser();
                    };
                }
            } else {
                const nomeSpan = document.getElementById('usuario-logado');
                if (nomeSpan) nomeSpan.textContent = '';
                const btnLogin = document.getElementById('btn-login');
                if (btnLogin) {
                    btnLogin.textContent = 'Login';
                    btnLogin.href = 'login.html';
                }
            }
        })
        .catch(() => {
            const btnLogin = document.getElementById('btn-login');
            if (btnLogin) {
                btnLogin.textContent = 'Login';
                btnLogin.href = 'login.html';
            }
        });
}

function carregarCarrossel() {
    fetch(API)
        .then(resposta => resposta.json())
        .then(noticias => {
            const container = document.getElementById('carousel-itens');
            container.innerHTML = '';

            for (let i = 0; i < noticias.length; i++) {
                const noticia = noticias[i];
                const item = document.createElement('div');
                item.className = 'carousel-item';
                if (i === 0) item.classList.add('active');

                item.innerHTML = `
          <a href="detalhes.html?id=${noticia.id}" style="text-decoration: none; color: inherit;">
            <img src="${noticia.imagem}" class="d-block w-100" alt="${noticia.titulo}"
                 style="max-height:300px; object-fit:cover;">
            <div class="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded">
              <h5>${noticia.titulo}</h5>
              <p>${noticia.conteudo}</p>
            </div>
          </a>
        `;

                container.appendChild(item);
            }
        });
}


function carregarCards() {
    fetch(API)
        .then(resposta => resposta.json())
        .then(noticias => {
            const container = document.getElementById('cards-noticias');
            container.innerHTML = '';
            const termoBusca = document.getElementById('busca').value.toLowerCase();

            for (let i = 0; i < noticias.length; i++) {
                const noticia = noticias[i];
                const tituloMinusculo = noticia.titulo.toLowerCase();

                if (tituloMinusculo.includes(termoBusca)) {
                    const card = document.createElement('div');
                    card.className = 'col-md-4 mb-4';

                    const coracao = noticia.isFavorita ? '❤️' : '🤍';
                    const classeFavorito = noticia.isFavorita ? 'ativo' : '';

                    card.innerHTML = `
            <div class="card h-100">
              <img src="${noticia.imagem}" class="card-img-top" style="height:200px;object-fit:cover;">
              <div class="card-body">
                <h5 class="card-title">${noticia.titulo}</h5>
                <p class="card-text">${noticia.conteudo}...</p>
                <button class="btn btn-favorito ${classeFavorito}" data-id="${noticia.id}">
                  ${coracao}
                </button>
              </div>
            </div>
          `;
                    container.appendChild(card);
                }
            }
            ativarFavorito();
        });
}

function ativarFavorito() {
    const botoes = document.querySelectorAll('.btn-favorito');
    for (let i = 0; i < botoes.length; i++) {
        const botao = botoes[i];
        botao.addEventListener('click', () => {
            const id = botao.getAttribute('data-id');
            fetch(`${API}/${id}`)
                .then(res => res.json())
                .then(noticia => {
                    const novaNoticia = {
                        id: noticia.id,
                        titulo: noticia.titulo,
                        conteudo: noticia.conteudo,
                        autor: noticia.autor,
                        dataPublicacao: noticia.dataPublicacao,
                        categoria: noticia.categoria,
                        imagem: noticia.imagem,
                        isFavorita: !noticia.isFavorita
                    };
                    fetch(`${API}/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(novaNoticia)
                    }).then(() => carregarCards());
                });
        });
    }
}

function carregarAutor() {
    fetch(API_ALUNO)
        .then(res => res.json())
        .then(aluno => {
            const a = aluno[0];
            const div = document.getElementById('autor-info');
            div.innerHTML = `
        <p><strong>Nome:</strong> ${a.nome}</p>
        <p><strong>Curso:</strong> ${a.Curso}</p>
        <p><strong>Turma:</strong> ${a.Turma}</p>
        <p><strong>Matrícula:</strong> ${a.Matricula}</p>
      `;
        });
}

fetch('http://localhost:3000/noticias')
    .then(res => res.json())
    .then(noticias => {
        const contagem = {};
        noticias.forEach(n => {
            contagem[n.categoria] = (contagem[n.categoria] || 0) + 1;
        });
        const labels = Object.keys(contagem);
        const dados = Object.values(contagem);

        new Chart(document.getElementById('graficoCategorias'), {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Categorias',
                    data: dados,
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8BC34A', '#FF9800']
                }]
            }
        });
    });

function logoutUser() {
    fetch("http://localhost:3000/usuarioLogado")
        .then(res => res.json())
        .then(obj => {
            obj.map(user =>
                fetch(`http://localhost:3000/usuarioLogado/${user.id}`, { method: "DELETE" })
            );
        })
        .catch(() => {
            alert("Erro no logout")
            window.location.href = "login.html";
        }
        );
}
