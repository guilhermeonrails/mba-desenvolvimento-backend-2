# Projeto 2 — API da loja virtual

# Traz a classe FastAPI
from fastapi import FastAPI
# Traz o middleware que libera o acesso do navegador (CORS)
from fastapi.middleware.cors import CORSMiddleware

# Cria a aplicação
app = FastAPI()

# Lista em memória com os produtos que a loja vai vender
produtos = [
    # Produto 1: fone bluetooth (categoria audio)
    {"id": 1, "nome": "Fone Bluetooth", "preco": 199.9, "categoria": "audio", "emoji": "🎧"},
    # Produto 2: caixa de som (categoria audio)
    {"id": 2, "nome": "Caixa de Som", "preco": 149.9, "categoria": "audio", "emoji": "🔊"},
    # Produto 3: teclado mecânico (categoria perifericos)
    {"id": 3, "nome": "Teclado Mecânico", "preco": 349.0, "categoria": "perifericos", "emoji": "⌨️"},
    # Produto 4: mouse gamer (categoria perifericos)
    {"id": 4, "nome": "Mouse Gamer", "preco": 129.9, "categoria": "perifericos", "emoji": "🖱️"},
    # Produto 5: webcam full hd (categoria video)
    {"id": 5, "nome": "Webcam Full HD", "preco": 259.9, "categoria": "video", "emoji": "📷"},
    # Produto 6: monitor 24 polegadas (categoria video)
    {"id": 6, "nome": "Monitor 24 polegadas", "preco": 899.0, "categoria": "video", "emoji": "🖥️"},
]

# Rota GET que devolve todos os produtos
@app.get("/produtos")
# Função chamada quando o frontend pedir /produtos
def listar_produtos():
    # A lista vira um array JSON
    return produtos

# Rota GET que devolve as categorias existentes
@app.get("/categorias")
# Função chamada quando o frontend pedir /categorias
def listar_categorias():
    # Junta as categorias sem repetir e coloca em ordem alfabética
    return sorted({p["categoria"] for p in produtos})

# Adiciona o CORS à aplicação: o navegador passa a aceitar as respostas
app.add_middleware(
    # Classe que injeta os cabeçalhos de CORS
    CORSMiddleware,
    # Aceita pedidos vindos do Live Server (a porta padrão dele é a 5500)
    allow_origins=["http://127.0.0.1:5500", "http://localhost:5500"],
)
