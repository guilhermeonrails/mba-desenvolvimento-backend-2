# Aula 2 — Python: APIs com FastAPI e um CRUD com Django

## Sobre o tema

Quase tudo o que você usa na internet funciona assim: um **cliente** (o navegador ou o app do celular) faz um pedido e um **servidor** responde com dados. A peça que recebe esses pedidos e devolve as respostas se chama **API**. Quem programa em Python costuma escrever APIs com o **FastAPI** (rápido de aprender e documenta tudo sozinho) e sistemas completos, com banco de dados e painel de administração, com o **Django**.

## O que vamos fazer

Em 3 blocos de 1 hora, você vai construir três projetos, um por bloco. Você escreve o código do zero em `src/`, seguindo o professor.

| Bloco | Projeto | O que você aprende |
|-------|---------|--------------------|
| 1 | Projeto 1 — API simples com FastAPI | rotas, parâmetros no caminho e na consulta, JSON, documentação em `/docs` |
| 2 | Projeto 2 — API de um e-commerce | integrar uma loja (frontend) pronta com a sua API, CORS |
| 3 | Projeto 3 — CRUD com Django | app, modelo, migração, painel admin, superusuário |

Você não precisa instalar Python, FastAPI nem Django. Tudo roda dentro de um container Docker, igual para todo mundo.

## Como subir o projeto

### O que você precisa

- **Docker Desktop** instalado e **aberto** ([docs.docker.com/get-started](https://docs.docker.com/get-started/)).
- **VS Code** (ou outro editor de código) com a extensão **Live Server** (de Ritwick Dey), usada no projeto 2 para abrir a loja.
- Um navegador (Chrome, Firefox, Edge...).
- Esta pasta (`aula-2-python`) no seu computador.

### Passo a passo

Cada projeto tem o seu **terminal integrado**: um comando abre um terminal Linux (bash) dentro do Docker, já na pasta do projeto e com FastAPI, uvicorn e Django **instalados**. Você não instala nada e não precisa digitar comandos gigantes: dentro do terminal, os comandos são curtos.

Rode o comando do projeto em um terminal **dentro da pasta `aula-2-python`** (no VS Code: menu *Terminal > New Terminal*).

1. **Abra o terminal do projeto que você vai fazer** (veja a seção "Os 3 terminais" logo abaixo). Na primeira vez, o Docker monta a imagem (pode levar alguns minutos). Depois, abre na hora.

2. **Crie seus arquivos em `src/`.** Cada projeto tem uma pasta (`src/projeto-1`, `src/projeto-2`, `src/projeto-3`), e o terminal já abre dentro dela. As pastas do projeto 1 e do projeto 3 começam vazias. A do projeto 2 tem duas subpastas: `front-end` (a loja pronta, com `index.html`, `style.css` e `script.js`) e `backend` (vazia: é nela que você cria a API, e o terminal do projeto 2 abre nela).

3. **Rode o servidor dentro do terminal** e deixe-o aberto: ele mostra os pedidos que chegam.

4. **Teste no navegador**: `http://localhost:8000/docs` (projetos 1 e 2) ou `http://localhost:8000/admin` (projeto 3).

5. **Para parar o servidor**, aperte `Ctrl+C`. **Para sair do terminal** do container, digite `exit`. Ao sair, o container é apagado, mas os arquivos que você criou em `src/` continuam no seu computador.

6. **Para trocar de projeto**, saia do terminal atual (`exit`) e abra o do próximo. Só um terminal pode usar a porta 8000 por vez.

### Os 3 terminais

Escolha **um** por vez. Todos abrem na pasta do projeto e liberam a porta 8000 para o seu navegador.

| Projeto | Comando para abrir o terminal | O terminal abre em | O que você digita lá dentro |
|---------|-------------------------------|--------------------|-----------------------------|
| 1 — API simples | `docker compose run --rm --service-ports projeto-1` | `/app/src/projeto-1` | `uvicorn main:app` |
| 2 — API da loja | `docker compose run --rm --service-ports projeto-2` | `/app/src/projeto-2/backend` | `uvicorn main:app` |
| 3 — CRUD com Django | `docker compose run --rm --service-ports projeto-3` | `/app/src/projeto-3` | os comandos do Django, na ordem do roteiro |

Ao abrir, o terminal mostra uma dica do projeto e o prompt com a pasta atual (por exemplo, `aula-2:/app/src/projeto-1$`). Se o prompt não for assim, você ainda está no terminal do seu computador.

**Projetos 1 e 2.** Crie o `main.py` na pasta do terminal e rode a API. O `uvicorn` já abre para o navegador e reinicia sozinho quando você salva o arquivo:

```bash
uvicorn main:app
```

**Projeto 3.** O terminal abre numa pasta vazia, com o Django já instalado. Você vai construindo o projeto passo a passo, na ordem do roteiro:

```bash
django-admin startproject config .      # cria o projeto
python manage.py runserver 0.0.0.0:8000 # liga o servidor (Ctrl+C para parar)
python manage.py startapp produtos      # cria o app
python manage.py makemigrations         # prepara a tabela
python manage.py migrate                # cria a tabela no banco
python manage.py createsuperuser        # cria o usuário do /admin
```

### Comandos úteis

| O que fazer | Comando |
|-------------|---------|
| Abrir o terminal do projeto 1, 2 ou 3 | `docker compose run --rm --service-ports projeto-1` (troque o número) |
| Ligar a API (projetos 1 e 2, dentro do terminal) | `uvicorn main:app` |
| Ligar o Django (projeto 3, dentro do terminal) | `python manage.py runserver 0.0.0.0:8000` |
| Parar o servidor | `Ctrl+C` |
| Sair do terminal do container | `exit` |
| Refazer a imagem (se o Dockerfile mudar) | `docker compose build` |

### Como testar o seu resultado

Aqui não há um `testar.py`: você confere o resultado na tela.

- **Projetos 1 e 2:** abra `http://localhost:8000/docs`. A página lista as rotas que você criou. Clique em uma rota, depois em *Try it out* e *Execute* para ver a resposta. Código **200** (ou **201**) significa que deu certo; **404** é "não encontrei"; **422** é "os dados enviados estão errados".
- **Projeto 2:** abra `src/projeto-2/front-end/index.html` com o **Live Server** (extensão do VS Code: botão direito no arquivo, *Open with Live Server*). Ele abre a loja em `http://127.0.0.1:5500`. Se os produtos aparecem, a sua API está certa.
- **Projeto 3:** abra `http://localhost:8000/admin` e entre com o superusuário que você criou.
- Compare o seu código com a pasta `referencial/` **depois** de tentar. Errar e corrigir é a parte que mais ensina.

### Problemas comuns

| Problema | Como resolver |
|----------|---------------|
| `Cannot connect to the Docker daemon` | O Docker Desktop está fechado. Abra o aplicativo e espere ele iniciar. |
| `port is already allocated` ou `address already in use` (porta 8000) | Outro terminal ou servidor está usando a porta. Pare o servidor (`Ctrl+C`) e saia do outro terminal (`exit`). Para ver o que está rodando: `docker ps`. |
| `Could not import module "main"` | Ou o `main.py` não existe, ou você está na pasta errada. Veja o prompt: ele deve mostrar `/app/src/projeto-1` (ou `/app/src/projeto-2/backend`), e o arquivo precisa se chamar `main.py`. |
| A API abre, mas o navegador não abre `localhost:8000` | Você abriu o terminal sem `--service-ports`. Saia (`exit`) e use o comando completo da tabela. No Django, o `runserver` precisa do `0.0.0.0:8000`. |
| A loja do projeto 2 continua vazia e o console (F12) mostra `CORS policy` | Falta o `CORSMiddleware` no seu `main.py`, ou você abriu o `index.html` com duplo clique. Abra pelo **Live Server**: a API só aceita pedidos vindos de `http://127.0.0.1:5500` e `http://localhost:5500`. Se o seu Live Server usa outra porta, ajuste o `allow_origins`. |
| A loja mostra "Não consegui carregar os produtos" | A API não está ligada, ou alguma rota (`/produtos` ou `/categorias`) está com o nome diferente. |
| `django-admin: command not found` | Você ainda está no terminal do seu computador. Abra o terminal do projeto 3: `docker compose run --rm --service-ports projeto-3`. |
| `no such table: produtos_produto` | Faltou rodar `python manage.py makemigrations` e `python manage.py migrate`. |
| O app Produtos não aparece no `/admin` | Confira o `'produtos'` em `INSTALLED_APPS` (no `config/settings.py`) e o `admin.site.register(Produto)`. |
| Os produtos do projeto 2 voltaram ao original | É esperado: eles ficam em uma lista no código. Ao reiniciar, a lista volta como está no arquivo. |

## Projetos

### Projeto 1 — API simples com FastAPI

Você cria uma API do zero em um único arquivo, `src/projeto-1/main.py`. Começa com a rota `GET /` e segue com duas rotas que recebem informação pelo endereço: `/saudacao/{nome}` (parâmetro no caminho) e `/soma?a=2&b=3` (parâmetros de consulta). Você também conhece a documentação automática em `/docs`.

**Resultado esperado:** em `http://localhost:8000/docs` você vê 3 rotas e consegue testar cada uma.

### Projeto 2 — API de um e-commerce

A loja virtual (HTML, CSS e JavaScript, em um visual de loja online com busca, filtros e carrinho) já está pronta em `src/projeto-2/front-end`. Falta a API que entrega os produtos. Na pasta `src/projeto-2/backend`, você cria o `main.py` com a lista de produtos, as rotas `GET /produtos` e `GET /categorias`, e libera o acesso do navegador com **CORS**.

**Resultado esperado:** ao abrir o `front-end/index.html` com o Live Server, a listagem mostra os 6 produtos, os departamentos e as faixas de preço filtram, a busca e a ordenação funcionam, e o carrinho soma o total.

### Projeto 3 — CRUD com Django

Você cria um projeto Django, o app `produtos`, o modelo `Produto` (nome, descrição, preço e estoque), faz a migração, registra o modelo no painel de administração e cria um superusuário. Não escreve nenhuma tela: o painel `/admin` entrega o CRUD completo (criar, ler, editar e apagar).

**Resultado esperado:** em `http://localhost:8000/admin` você cadastra, edita e exclui produtos.

> O `referencial/projeto-3` já tem um banco de exemplo, com o superusuário `admin` (senha `admin12345`) e 3 produtos, para você explorar. Para ligá-lo, na pasta `aula-2-python`: `docker compose run --rm --service-ports -w /app/referencial/projeto-3 projeto-3 python manage.py runserver 0.0.0.0:8000`.

## Objetivos de aprendizagem

Ao final da aula, você deve ser capaz de:

- Explicar o que é uma API, um cliente, um servidor e o formato JSON.
- Rodar uma aplicação Python em um container Docker e acessá-la pelo navegador.
- Criar rotas com o FastAPI e devolver JSON a partir de dicionários e listas.
- Receber dados pelo endereço (`/{nome}`) e pela consulta (`?a=1`), com validação pelas dicas de tipo.
- Testar uma API pela página `/docs`.
- Fazer um frontend consumir uma API e resolver o erro de CORS.
- Criar um projeto e um app no Django, e definir um modelo com seus campos.
- Gerar e aplicar migrações (`makemigrations` e `migrate`).
- Registrar um modelo no admin, criar um superusuário e fazer um CRUD completo pelo painel.

---

MBA - USP ESALQ
