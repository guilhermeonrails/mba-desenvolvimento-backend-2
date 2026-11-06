# Projeto 1 — API simples com FastAPI (Hello API + tarefas)

# Traz a classe FastAPI, a peça principal da nossa API
from fastapi import FastAPI

# Cria a aplicação; todas as rotas vão ser penduradas nela
app = FastAPI()

# Rota GET na raiz do site: responde quando abrirem /
@app.get("/")
# Função executada sempre que essa rota for chamada
def raiz():
    # Devolve um dicionário, que o FastAPI transforma em JSON
    return {"mensagem": "Olá, API!"}

# Rota GET com uma variável no endereço: {nome}
@app.get("/saudacao/{nome}")
# O que vier no lugar de {nome} chega aqui como texto
def saudar(nome: str):
    # Monta a frase com f-string e devolve em JSON
    return {"mensagem": f"Olá, {nome}!"}

# Rota GET que recebe a e b pela consulta (?a=..&b=..)
@app.get("/soma")
# a e b chegam como inteiros; o FastAPI converte e valida
def somar(a: int, b: int):
    # Devolve o resultado da conta em JSON
    return {"resultado": a + b}

