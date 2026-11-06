// PythonShop — frontend pronto: busca os dados na API e monta a listagem de produtos

// Endereço da API: o FastAPI que você vai criar na pasta backend
const API = "http://localhost:8000";
// Guarda os produtos que chegam da API
let produtos = [];
// Guarda o carrinho no formato { id do produto: quantidade }
let carrinho = {};
// Departamento escolhido no filtro ("todos" mostra tudo)
let categoria = "todos";
// Posição da faixa de preço escolhida (0 = qualquer preço)
let faixa = 0;
// Texto digitado na barra de busca
let textoBusca = "";

// Faixas de preço do filtro lateral
const FAIXAS = [
    // Faixa 0: sem limite
    { nome: "Qualquer preço", min: 0, max: Infinity },
    // Faixa 1: até 150 reais
    { nome: "Até R$ 150", min: 0, max: 150 },
    // Faixa 2: de 150 a 300 reais
    { nome: "R$ 150 a R$ 300", min: 150, max: 300 },
    // Faixa 3: acima de 300 reais
    { nome: "Acima de R$ 300", min: 300, max: Infinity },
];

// Transforma um número em dinheiro brasileiro (R$ 1.234,50)
function dinheiro(valor) {
    // Usa o formato de moeda do Brasil
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Monta o preço no estilo de loja: R$ pequeno, valor grande e centavos pequenos
function precoHTML(valor) {
    // Separa os reais dos centavos (199.90 vira 199 e 90)
    const partes = valor.toFixed(2).split(".");
    // Formata a parte inteira com ponto de milhar
    const inteiro = Number(partes[0]).toLocaleString("pt-BR");
    // Devolve o HTML do preço
    return '<div class="preco"><span class="moeda">R$</span><span class="inteiro">' + inteiro + '</span><span class="centavos">' + partes[1] + "</span></div>";
}

// Nota do produto (de enfeite): a API ainda não manda avaliações, então ela é calculada pelo id
function avaliacaoDe(id) {
    // Gera notas entre 3,8 e 4,9
    return 3.8 + ((id * 7) % 12) / 10;
}

// Quantidade de avaliações (também de enfeite)
function opinioesDe(id) {
    // Um número diferente para cada produto
    return 80 + id * 413;
}

// Desconto de enfeite: só os produtos de id par têm 15% de desconto
function descontoDe(id) {
    // Devolve 15 para os pares e 0 para os ímpares
    return id % 2 === 0 ? 15 : 0;
}

// Transforma a nota em estrelas (★★★★☆)
function estrelas(nota) {
    // Arredonda a nota para saber quantas estrelas ficam cheias
    const cheias = Math.round(nota);
    // Repete a estrela cheia e completa com estrelas vazias até 5
    return "★".repeat(cheias) + "☆".repeat(5 - cheias);
}

// Mostra uma mensagem de erro no topo da listagem
function mostrarErro(texto) {
    // Pega a caixa de aviso da página
    const aviso = document.getElementById("aviso");
    // Escreve o texto do erro nela
    aviso.textContent = texto;
    // Deixa a caixa visível
    aviso.hidden = false;
    // Troca o resumo da barra de resultados
    document.getElementById("resumo").textContent = "Nenhum produto para mostrar";
}

// Busca os dados na API (async permite esperar a resposta)
async function carregar() {
    // Tenta falar com a API; se falhar, cai no catch
    try {
        // Faz o pedido GET /produtos e espera a resposta
        const respostaProdutos = await fetch(API + "/produtos");
        // Converte o JSON recebido em lista de produtos
        produtos = await respostaProdutos.json();
        // Faz o pedido GET /categorias para montar o filtro de departamentos
        const respostaCategorias = await fetch(API + "/categorias");
        // Desenha a lista de departamentos com as categorias recebidas
        desenharDeptos(await respostaCategorias.json());
        // Desenha as faixas de preço
        desenharPrecos();
        // Desenha os cartões dos produtos
        desenharVitrine();
    // Se algo deu errado (API desligada, CORS, rota inexistente)
    } catch (erro) {
        // Avisa o usuário em vez de deixar a página quebrada
        mostrarErro("Não consegui carregar os produtos. A API está ligada em " + API + "?");
    }
}

// Cria a lista de departamentos do filtro lateral
function desenharDeptos(categorias) {
    // Pega a lista da página
    const lista = document.getElementById("deptos");
    // Limpa os itens antigos
    lista.innerHTML = "";
    // Percorre "todos" mais as categorias da API
    ["todos", ...categorias].forEach(function (nome) {
        // Cria o item da lista
        const item = document.createElement("li");
        // Cria o botão do departamento
        const botao = document.createElement("button");
        // Escreve o nome do departamento no botão
        botao.textContent = nome === "todos" ? "Todos os departamentos" : nome;
        // Destaca o departamento escolhido
        botao.className = nome === categoria ? "ativo" : "";
        // Ao clicar, troca o departamento e redesenha a tela
        botao.onclick = function () {
            // Guarda o departamento escolhido
            categoria = nome;
            // Redesenha a lista para destacar o escolhido
            desenharDeptos(categorias);
            // Redesenha os produtos já filtrados
            desenharVitrine();
        };
        // Coloca o botão dentro do item
        item.appendChild(botao);
        // Coloca o item na lista
        lista.appendChild(item);
    });
}

// Cria a lista de faixas de preço do filtro lateral
function desenharPrecos() {
    // Pega a lista da página
    const lista = document.getElementById("precos");
    // Limpa os itens antigos
    lista.innerHTML = "";
    // Percorre as faixas de preço, com a posição de cada uma
    FAIXAS.forEach(function (f, posicao) {
        // Cria o item da lista
        const item = document.createElement("li");
        // Cria o botão da faixa
        const botao = document.createElement("button");
        // Escreve o nome da faixa no botão
        botao.textContent = f.nome;
        // Destaca a faixa escolhida
        botao.className = posicao === faixa ? "ativo" : "";
        // Ao clicar, troca a faixa e redesenha a tela
        botao.onclick = function () {
            // Guarda a faixa escolhida
            faixa = posicao;
            // Redesenha as faixas para destacar a escolhida
            desenharPrecos();
            // Redesenha os produtos já filtrados
            desenharVitrine();
        };
        // Coloca o botão dentro do item
        item.appendChild(botao);
        // Coloca o item na lista
        lista.appendChild(item);
    });
}

// Separa só os produtos que passam nos filtros (busca, departamento e preço)
function filtrar() {
    // Pega a faixa de preço escolhida
    const f = FAIXAS[faixa];
    // Deixa o texto da busca em minúsculas para comparar
    const termo = textoBusca.toLowerCase();
    // Fica só com os produtos que passam em todos os testes
    return produtos.filter(function (p) {
        // O nome do produto contém o texto buscado?
        const nomeOk = p.nome.toLowerCase().includes(termo);
        // O produto é do departamento escolhido?
        const catOk = categoria === "todos" || p.categoria === categoria;
        // O preço está dentro da faixa escolhida?
        const precoOk = p.preco >= f.min && p.preco <= f.max;
        // O produto só aparece se passou nos três testes
        return nomeOk && catOk && precoOk;
    });
}

// Coloca a lista na ordem escolhida no seletor
function ordenar(lista) {
    // Lê a opção de ordenação escolhida
    const modo = document.getElementById("ordem").value;
    // Menor preço primeiro
    if (modo === "menor") lista.sort(function (a, b) { return a.preco - b.preco; });
    // Maior preço primeiro
    if (modo === "maior") lista.sort(function (a, b) { return b.preco - a.preco; });
    // Melhor avaliação primeiro
    if (modo === "avaliacao") lista.sort(function (a, b) { return avaliacaoDe(b.id) - avaliacaoDe(a.id); });
    // Devolve a lista ordenada
    return lista;
}

// Desenha um cartão para cada produto visível
function desenharVitrine() {
    // Pega a grade onde os cartões ficam
    const grade = document.getElementById("produtos");
    // Limpa os cartões antigos
    grade.innerHTML = "";
    // Aplica os filtros e depois a ordenação
    const lista = ordenar(filtrar());
    // Escreve quantos resultados apareceram
    document.getElementById("resumo").textContent = lista.length + " resultados" + (textoBusca ? ' para "' + textoBusca + '"' : "");
    // Repete os passos abaixo para cada produto
    lista.forEach(function (p) {
        // Calcula o desconto de enfeite do produto
        const desconto = descontoDe(p.id);
        // Calcula a nota de enfeite do produto
        const nota = avaliacaoDe(p.id);
        // Cria o cartão
        const card = document.createElement("article");
        // Dá ao cartão a classe do CSS
        card.className = "card";
        // Monta o selo de desconto (vazio se não houver)
        const selo = desconto ? '<span class="selo">-' + desconto + "%</span>" : "";
        // Monta o preço antigo riscado (vazio se não houver desconto)
        const antigo = desconto ? '<div class="antigo">De: <s>' + dinheiro(p.preco / (1 - desconto / 100)) + "</s></div>" : "";
        // Monta a linha de estrelas e quantidade de avaliações
        const notaHTML = '<div class="nota"><span class="estrelas">' + estrelas(nota) + "</span> " + opinioesDe(p.id).toLocaleString("pt-BR") + "</div>";
        // Monta o texto do parcelamento
        const parcela = '<div class="parcela">em até 3x de ' + dinheiro(p.preco / 3) + " sem juros</div>";
        // Monta o texto do frete
        const frete = '<div class="frete"><b>Frete GRÁTIS</b> · receba amanhã</div>';
        // Preenche o cartão com os dados vindos da API (emoji, nome e preço)
        card.innerHTML = selo + '<div class="foto">' + p.emoji + '</div><div class="info"><h3>' + p.nome + "</h3>" + notaHTML + precoHTML(p.preco) + antigo + parcela + frete + "</div>";
        // Cria o botão de comprar
        const botao = document.createElement("button");
        // Dá ao botão a classe do CSS
        botao.className = "comprar";
        // Escreve o texto do botão
        botao.textContent = "Adicionar ao carrinho";
        // Ao clicar, coloca esse produto no carrinho
        botao.onclick = function () { adicionar(p.id); };
        // Coloca o botão dentro do cartão
        card.querySelector(".info").appendChild(botao);
        // Coloca o cartão na grade
        grade.appendChild(card);
    });
}

// Desenha a lista do carrinho e calcula o total
function desenharCarrinho() {
    // Pega a lista do carrinho
    const lista = document.getElementById("itens");
    // Limpa a lista antiga
    lista.innerHTML = "";
    // Começa o total em zero
    let total = 0;
    // Começa a contagem de itens em zero
    let quantidade = 0;
    // Olha cada produto para ver se está no carrinho
    produtos.forEach(function (p) {
        // Quantidade desse produto no carrinho (0 se não estiver)
        const qtd = carrinho[p.id] || 0;
        // Se não está no carrinho, pula para o próximo
        if (qtd === 0) return;
        // Soma o subtotal no total
        total += p.preco * qtd;
        // Soma a quantidade ao contador de itens
        quantidade += qtd;
        // Cria uma linha da lista
        const li = document.createElement("li");
        // Escreve emoji, nome, quantidade e subtotal
        li.innerHTML = '<span class="mini">' + p.emoji + '</span><span class="nome">' + p.nome + "<small>Qtd: " + qtd + '</small></span><span class="valor">' + dinheiro(p.preco * qtd) + "</span>";
        // Coloca a linha na lista
        lista.appendChild(li);
    });
    // Se não há nenhum item, mostra que o carrinho está vazio
    if (quantidade === 0) lista.innerHTML = '<li class="vazio">Seu carrinho está vazio.</li>';
    // Mostra o total formatado
    document.getElementById("total").textContent = dinheiro(total);
    // Mostra a quantidade de itens no ícone do carrinho
    document.getElementById("qtd").textContent = quantidade;
}

// Coloca um produto no carrinho
function adicionar(id) {
    // Soma 1 à quantidade desse produto
    carrinho[id] = (carrinho[id] || 0) + 1;
    // Atualiza o carrinho na tela
    desenharCarrinho();
}

// Abre ou fecha a gaveta do carrinho
function mostrarCarrinho(visivel) {
    // Mostra ou esconde a gaveta
    document.getElementById("gaveta").hidden = !visivel;
    // Mostra ou esconde o fundo escuro
    document.getElementById("fundo").hidden = !visivel;
}

// Clique no ícone do carrinho: abre a gaveta
document.getElementById("abrir-carrinho").onclick = function () { mostrarCarrinho(true); };
// Clique no X: fecha a gaveta
document.getElementById("fechar-carrinho").onclick = function () { mostrarCarrinho(false); };
// Clique no fundo escuro: fecha a gaveta
document.getElementById("fundo").onclick = function () { mostrarCarrinho(false); };
// Botão de esvaziar: zera o carrinho e redesenha
document.getElementById("limpar").onclick = function () { carrinho = {}; desenharCarrinho(); };
// Botão de fechar pedido: só uma mensagem, porque não existe pagamento de verdade
document.getElementById("finalizar").onclick = function () { alert("Pedido simulado! Obrigado pela compra."); };
// Ao trocar a ordenação, redesenha os produtos
document.getElementById("ordem").onchange = desenharVitrine;
// Ao enviar a busca, guarda o texto e redesenha os produtos
document.getElementById("busca").onsubmit = function (evento) {
    // Impede que a página recarregue ao enviar o formulário
    evento.preventDefault();
    // Guarda o texto digitado, sem espaços nas pontas
    textoBusca = document.getElementById("texto-busca").value.trim();
    // Redesenha os produtos com a busca
    desenharVitrine();
};
// Desenha o carrinho vazio assim que a página abre
desenharCarrinho();
// Ao abrir a página, já busca os dados na API
carregar();
