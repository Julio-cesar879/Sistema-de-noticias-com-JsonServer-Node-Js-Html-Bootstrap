## Informações do trabalho

- Nome: Julio Cesar
- Matricula: 891945
- Proposta de projeto escolhida: Notícias com crud completo, 5 telas e variadas funcinoalidades pedidas.

## Como inicializar o projeto

1. Acesse o diretório onde está localizado o arquivo `db.json`.
2. No terminal, execute o seguinte comando para iniciar o servidor JSON: 'json-server --watch db.json --port 3000'
3. Com o servidor rodando, inicie a aplicação no navegador utilizando a extensão **Go Live** do VS Code.
4. Navegue até a pasta `public/assets/pages` e pronto.

## Breve descrição do projeto

Na página inicial (`index.html`), são exibidas:
- As **notícias em destaque**, por meio de um carrossel;
- As **notícias favoritas**;
- Um **gráfico** com a distribuição por tipo de notícia;
- Informações sobre o autor do projeto.

O sistema  conta com:
- Página de **cadastro de usuários**, com opção de marcar o usuário como **administrador**;
- **Apenas administradores** podem cadastrar novas notícias;
- Página de **notícias favoritas**, exibindo as que foram marcadas como favoritas;
- Tela de **login**;
- Página de **cadastro de notícias** (restrita a admins);
- Página de **detalhes da notícia**, acessada ao clicar em uma notícia no carrossel.
- Trabalho Concluido