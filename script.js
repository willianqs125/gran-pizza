/* =========================================================
   BUENA PIZZA
   SCRIPT.JS — CLIENTE
========================================================= */


/* =========================================================
   CONFIGURAÇÕES
========================================================= */

const STORAGE_KEYS = {
    produtos: "produtosBuenaPizza",
    carrinho: "carrinhoBuenaPizza",
    pedidos: "pedidosBuenaPizza",
    cupons: "cuponsBuenaPizza",
    categorias: "categoriasBuenaPizza",
    config: "configBuenaPizza",
    galeria: "galeriaBuenaPizza",
    avaliacoes: "avaliacoesBuenaPizza",
    ultimoPedido: "ultimoPedidoBuenaPizza",
    meusPedidos: "meusPedidosBuenaPizza",
    fidelidade: "fidelidadeBuenaPizza",
    configFidelidade: "configFidelidadeBuenaPizza"
};

const CONFIG_FIDELIDADE_PADRAO = {
    ativa: true,
    meta: 5,
    premio: "1 Pizza G grátis"
};

const STATUS_PEDIDO = {
    novo: {
        label: "Pedido recebido",
        descricao: "Seu pedido foi recebido e está aguardando confirmação.",
        icone: "📋"
    },

    recebido: {
        label: "Pedido recebido",
        descricao: "Seu pedido foi recebido e está aguardando confirmação.",
        icone: "📋"
    },

    confirmado: {
        label: "Pedido confirmado",
        descricao: "Seu pedido foi confirmado pela Gran Pizza.",
        icone: "✅"
    },

    preparando: {
        label: "Preparando",
        descricao: "Sua pizza está sendo preparada.",
        icone: "🍕"
    },

    pronto: {
        label: "Pronto para retirada",
        descricao: "Seu pedido já está pronto para ser retirado na loja.",
        icone: "🛍️"
    },

    saiu_entrega: {
        label: "Saiu para entrega",
        descricao: "Seu pedido saiu para entrega.",
        icone: "🛵"
    },

    entregue: {
        label: "Entregue",
        descricao: "Seu pedido foi entregue. Bom apetite!",
        icone: "🎉"
    },

    cancelado: {
        label: "Cancelado",
        descricao: "Este pedido foi cancelado.",
        icone: "❌"
    }
};


/* =========================================================
   DADOS PADRÃO
========================================================= */

const PRODUTOS_PADRAO = [
    {
        id: "pizza-calabresa",
        nome: "Pizza de Calabresa",
        descricao: "Molho de tomate, queijo, calabresa, cebola e orégano.",
        categoria: "Tradicionais",
        preco: 39.90,
        estoque: 20,
        ativo: true,
        imagem: "",
        destaque: true,
        tamanhos: [
            {
                nome: "Média",
                preco: 39.90
            },
            {
                nome: "Grande",
                preco: 49.90
            }
        ],
        adicionais: [
            {
                nome: "Borda de Catupiry",
                preco: 6
            },
            {
                nome: "Extra queijo",
                preco: 5
            }
        ]
    },

    {
        id: "pizza-frango-catupiry",
        nome: "Frango com Catupiry",
        descricao: "Frango temperado, queijo, catupiry e orégano.",
        categoria: "Tradicionais",
        preco: 42.90,
        estoque: 20,
        ativo: true,
        imagem: "",
        destaque: true,
        tamanhos: [
            {
                nome: "Média",
                preco: 42.90
            },
            {
                nome: "Grande",
                preco: 52.90
            }
        ],
        adicionais: [
            {
                nome: "Borda de Catupiry",
                preco: 6
            },
            {
                nome: "Extra frango",
                preco: 7
            }
        ]
    },

    {
        id: "pizza-especial-buena",
        nome: "Especial Buena",
        descricao: "Uma combinação especial de ingredientes selecionados.",
        categoria: "Especiais",
        preco: 49.90,
        estoque: 15,
        ativo: true,
        imagem: "",
        destaque: true,
        tamanhos: [
            {
                nome: "Média",
                preco: 49.90
            },
            {
                nome: "Grande",
                preco: 59.90
            }
        ],
        adicionais: [
            {
                nome: "Borda recheada",
                preco: 7
            },
            {
                nome: "Extra queijo",
                preco: 5
            }
        ]
    },

    {
        id: "pizza-quatro-queijos",
        nome: "Quatro Queijos",
        descricao: "Mussarela, provolone, parmesão e catupiry.",
        categoria: "Especiais",
        preco: 46.90,
        estoque: 15,
        ativo: true,
        imagem: "",
        destaque: false,
        tamanhos: [
            {
                nome: "Média",
                preco: 46.90
            },
            {
                nome: "Grande",
                preco: 56.90
            }
        ],
        adicionais: [
            {
                nome: "Borda de Catupiry",
                preco: 6
            },
            {
                nome: "Extra queijo",
                preco: 5
            }
        ]
    },

    {
        id: "pizza-portuguesa",
        nome: "Pizza Portuguesa",
        descricao: "Presunto, queijo, ovo, cebola, tomate, milho e ervilha.",
        categoria: "Tradicionais",
        preco: 44.90,
        estoque: 18,
        ativo: true,
        imagem: "",
        destaque: false,
        tamanhos: [
            {
                nome: "Média",
                preco: 44.90
            },
            {
                nome: "Grande",
                preco: 54.90
            }
        ],
        adicionais: [
            {
                nome: "Borda de Catupiry",
                preco: 6
            }
        ]
    },

    {
        id: "pizza-chocolate",
        nome: "Pizza de Chocolate",
        descricao: "Chocolate cremoso com uma cobertura deliciosa.",
        categoria: "Pizzas doces",
        preco: 39.90,
        estoque: 15,
        ativo: true,
        imagem: "",
        destaque: true,
        tamanhos: [
            {
                nome: "Média",
                preco: 39.90
            },
            {
                nome: "Grande",
                preco: 49.90
            }
        ],
        adicionais: [
            {
                nome: "Morango",
                preco: 5
            },
            {
                nome: "Confetes",
                preco: 3
            }
        ]
    },

    {
        id: "coca-cola-2l",
        nome: "Coca-Cola 2L",
        descricao: "Refrigerante Coca-Cola 2 litros.",
        categoria: "Bebidas",
        preco: 12.00,
        estoque: 30,
        ativo: true,
        imagem: "",
        destaque: false,
        tamanhos: [],
        adicionais: []
    },

    {
        id: "combo-familia",
        nome: "Combo Família",
        descricao: "Pizza grande + Coca-Cola 2L.",
        categoria: "Combos",
        preco: 64.90,
        estoque: 10,
        ativo: true,
        imagem: "",
        destaque: true,
        tamanhos: [],
        adicionais: []
    }
];


const CATEGORIAS_PADRAO = [
    {
        id: "tradicionais",
        nome: "Tradicionais",
        ativa: true
    },

    {
        id: "especiais",
        nome: "Especiais",
        ativa: true
    },

    {
        id: "doces",
        nome: "Pizzas doces",
        ativa: true
    },

    {
        id: "combos",
        nome: "Combos",
        ativa: true
    },

    {
        id: "bebidas",
        nome: "Bebidas",
        ativa: true
    }
];


const CUPONS_PADRAO = [
    {
        id: "cupom-buena10",
        codigo: "BUENA10",
        tipo: "percentual",
        valor: 10,
        minimo: 30,
        validade: "2027-12-31",
        ativo: true,
        descricao: "10% de desconto"
    }
];


const CONFIG_PADRAO = {
    nome: "Gran Pizza",
    slogan: "Sabor que reúne.",
    whatsapp: "5598999999999",
    taxaEntrega: 5,
    endereco: "Bacabal - MA",

    entregaAtiva: true,
    retiradaAtiva: true,

    horarios: {
        domingo: {
            abertura: "18:00",
            fechamento: "23:00"
        },

        segunda: {
            abertura: "18:00",
            fechamento: "23:00"
        },

        terca: {
            abertura: "18:00",
            fechamento: "23:00"
        },

        quarta: {
            abertura: "18:00",
            fechamento: "23:00"
        },

        quinta: {
            abertura: "18:00",
            fechamento: "23:00"
        },

        sexta: {
            abertura: "18:00",
            fechamento: "00:00"
        },

        sabado: {
            abertura: "18:00",
            fechamento: "00:00"
        }
    }
};


/* =========================================================
   ESTADO DA APLICAÇÃO
========================================================= */

let produtos = [];
let categorias = [];
let cupons = [];
let pedidos = [];
let galeria = [];
let avaliacoes = [];
let config = {};
let ultimoPedido = null;
let meusPedidos = [];
let carrinho = [];
let fidelidade = {};
let configFidelidade = {};

let categoriaAtual = "todos";
let buscaAtual = "";
let cupomAplicado = null;
let produtoSelecionado = null;
let produtoSaborEmSelecao = null;
let configuracaoPendenteSabor = {};


/* =========================================================
   LIMPEZA DE DADOS LEGADOS (PASTEL)
========================================================= */

function limparDadosPastel() {
    return;
}


/* =========================================================
   FIDELIDADE
========================================================= */

function obterDadosFidelidade(telefone) {
    const telLimpo = normalizarTelefone(telefone);
    if (!telefone || !telLimpo) return null;

    const configFid = configFidelidade || CONFIG_FIDELIDADE_PADRAO;
    const meta = configFid.meta || 5;
    const dadosExtras = fidelidade[telLimpo] || {};

    // Contar pizzas dos pedidos reais
    let pizzasReais = 0;

    pedidos.forEach(pedido => {
        // Pedidos antigos sem telefone ficam fora da fidelidade.
        const telPedido = normalizarTelefone(
            pedido.clienteTelefone || pedido.cliente?.telefone
        );

        if (telPedido !== telLimpo || pedido.status === "cancelado") return;

        pizzasReais += contarPizzasDoPedido(pedido);
    });

    const totalPizzas = Math.max(
        0,
        pizzasReais + Number(dadosExtras.pizzasCorrigidas || 0)
    );
    const totalPremiosGanhos = configFid.ativa === false
        ? 0
        : Math.floor(totalPizzas / meta);
    const totalPremiosDisponiveis = Math.max(
        0,
        totalPremiosGanhos + Number(dadosExtras.premiosCorrigidos || 0) -
            Number(dadosExtras.premiosResgatados || 0)
    );

    return {
        telefone: telLimpo,
        pizzas: totalPizzas,
        pizzasAteProximo: totalPizzas % meta,
        meta: meta,
        premios: totalPremiosDisponiveis,
        progresso: (totalPizzas % meta) / meta * 100,
        ativa: configFid.ativa !== false,
        premioNome: configFid.premio || "1 Pizza G grátis"
    };
}


function normalizarTelefone(telefone) {
    let telefoneLimpo = String(telefone || "").replace(/\D/g, "");

    if (
        telefoneLimpo.startsWith("55") &&
        (telefoneLimpo.length === 12 || telefoneLimpo.length === 13)
    ) {
        telefoneLimpo = telefoneLimpo.slice(2);
    }

    return telefoneLimpo;
}


function telefoneValido(telefone) {
    const telefoneLimpo = normalizarTelefone(telefone);

    return telefoneLimpo.length === 10 || telefoneLimpo.length === 11;
}


function produtoEhPizza(produto, item) {
    const categoria = String(
        produto?.categoria || item?.categoria || ""
    ).toLowerCase();
    const nome = String(
        produto?.nome || item?.nome || ""
    ).toLowerCase();

    if (
        categoria.includes("bebida") ||
        categoria.includes("combo")
    ) {
        return false;
    }

    return (
        categoria.includes("pizza") ||
        categoria.includes("tradicional") ||
        categoria.includes("especial") ||
        categoria.includes("doce") ||
        nome.includes("pizza")
    );
}


function contarPizzasDoPedido(pedido) {
    if (!Array.isArray(pedido?.itens)) {
        return 0;
    }

    return pedido.itens.reduce((total, item) => {
        const produto = produtos.find(
            produtoAtual =>
                String(produtoAtual.id) === String(item.produtoId)
        );

        if (!produtoEhPizza(produto, item)) {
            return total;
        }

        return total + Number(item.quantidade || 0);
    }, 0);
}


function renderizarFidelidade(telefone = "") {
    const secao = document.getElementById("fidelidadeCliente");
    const campoTelefone = document.getElementById("telefoneFidelidade");
    const pizzasElemento = document.getElementById("fidelidadePizzas");
    const progressoTexto = document.getElementById("fidelidadeProgressoTexto");
    const premiosElemento = document.getElementById("fidelidadePremios");
    const progressoBarra = document.getElementById("fidelidadeProgressoBarra");

    if (!campoTelefone || !pizzasElemento || !progressoTexto || !premiosElemento || !progressoBarra) {
        return;
    }

    if (configFidelidade.ativa === false) {
        secao?.classList.add("hidden");
        return;
    }

    const telefoneAtual = normalizarTelefone(telefone || campoTelefone.value);
    const dados = obterDadosFidelidade(telefoneAtual);

    if (secao) {
        secao.classList.toggle("hidden", dados?.ativa === false);
    }

    if (dados?.ativa === false) {
        return;
    }

    const meta = Number(configFidelidade.meta || 5);
    const pizzas = dados?.pizzas || 0;
    const pizzasNoCiclo = dados?.pizzasAteProximo || 0;

    if (telefoneAtual && campoTelefone.value !== telefoneAtual) {
        campoTelefone.value = telefoneAtual;
    }

    pizzasElemento.textContent =
        `${pizzas} ${pizzas === 1 ? "pizza acumulada" : "pizzas acumuladas"}`;
    progressoTexto.textContent =
        `${pizzasNoCiclo}/${meta} até a próxima recompensa`;
    premiosElemento.textContent =
        `${dados?.premios || 0} ${dados?.premios === 1 ? "pizza grátis disponível" : "pizzas grátis disponíveis"}`;
    progressoBarra.style.width = `${dados?.progresso || 0}%`;
}


/* =========================================================
   HELPERS DE LOCALSTORAGE
========================================================= */

function normalizarProduto(produto) {
    if (!produto || typeof produto !== "object") return null;

    return {
        ...produto,
        ativo: produto.ativo !== false,
        estoque: Number.isFinite(Number(produto.estoque)) ? Number(produto.estoque) : 1,
        categoria: produto.categoria || "",
        tamanhos: Array.isArray(produto.tamanhos) ? produto.tamanhos : [],
        adicionais: Array.isArray(produto.adicionais) ? produto.adicionais : [],
        sabores: Array.isArray(produto.sabores) || typeof produto.sabores === "string"
            ? produto.sabores
            : [],
        temSabores: Boolean(produto.temSabores)
    };
}

function normalizarListaProdutos(lista) {
    return Array.isArray(lista) ? lista.map(normalizarProduto).filter(Boolean) : [];
}

function carregarDados() {
    // Limpeza de dados de pastel legados no localStorage
    limparDadosPastel();

    produtos = normalizarListaProdutos(obterStorage(
        STORAGE_KEYS.produtos,
        PRODUTOS_PADRAO
    ));

    categorias = obterStorage(
        STORAGE_KEYS.categorias,
        CATEGORIAS_PADRAO
    );

    cupons = obterStorage(
        STORAGE_KEYS.cupons,
        CUPONS_PADRAO
    );

    pedidos = obterStorage(
        STORAGE_KEYS.pedidos,
        []
    );

    config = obterStorage(
        STORAGE_KEYS.config,
        CONFIG_PADRAO
    );

    ultimoPedido = obterStorage(
        STORAGE_KEYS.ultimoPedido,
        null
    );

    meusPedidos = obterStorage(
        STORAGE_KEYS.meusPedidos,
        []
    );

    galeria = obterStorage(
        STORAGE_KEYS.galeria,
        []
    );

    avaliacoes = obterStorage(
        STORAGE_KEYS.avaliacoes,
        []
    );

    fidelidade = obterStorage(
        STORAGE_KEYS.fidelidade,
        {}
    );

    configFidelidade = obterStorage(
        STORAGE_KEYS.configFidelidade,
        CONFIG_FIDELIDADE_PADRAO
    );

    pedidos = obterStorage(
        STORAGE_KEYS.pedidos,
        []
    );

    carrinho = obterStorage(
        STORAGE_KEYS.carrinho,
        []
    );
}


function obterStorage(chave, padrao) {

    try {

        const valor = localStorage.getItem(chave);

        if (valor === null) {

            localStorage.setItem(
                chave,
                JSON.stringify(padrao)
            );

            return JSON.parse(
                JSON.stringify(padrao)
            );
        }

        return JSON.parse(valor);

    } catch (erro) {

        console.error(
            `Erro ao carregar ${chave}:`,
            erro
        );

        return JSON.parse(
            JSON.stringify(padrao)
        );
    }
}


function salvarStorage(chave, valor) {

    try {

        localStorage.setItem(
            chave,
            JSON.stringify(valor)
        );

    } catch (erro) {

        console.error(
            `Erro ao salvar ${chave}:`,
            erro
        );
    }
}


/* =========================================================
   FORMATAÇÃO
========================================================= */

function formatarMoeda(valor) {

    return Number(valor || 0).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );
}


function escaparHTML(valor) {

    return String(valor ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function gerarId(prefixo = "id") {

    return `${prefixo}-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;
}


/* =========================================================
   CONFIGURAÇÃO DA LOJA
========================================================= */

function aplicarConfiguracao() {

    const nome =
        !config.nome ||
        config.nome === "Buena Pizza"
            ? "Gran Pizza"
            : config.nome;

    const slogan =
        config.slogan ||
        "Sabor que reúne.";

    document.title = nome;

    const elementosNome = [
        "nomeLojaFooter",
        "nomeLojaCopyright"
    ];

    elementosNome.forEach(id => {

        const elemento = document.getElementById(id);

        if (elemento) {
            elemento.textContent = nome;
        }
    });


    const sloganElementos = [
        "sloganLoja",
        "sloganFooter"
    ];

    sloganElementos.forEach(id => {

        const elemento = document.getElementById(id);

        if (elemento) {
            elemento.textContent = slogan;
        }
    });


    const endereco = document.getElementById(
        "enderecoLoja"
    );

    if (endereco) {
        endereco.textContent =
            config.endereco || "Bacabal - MA";
    }


    const footerEndereco =
        document.getElementById(
            "footerEndereco"
        );

    if (footerEndereco) {

        footerEndereco.textContent =
            `📍 ${config.endereco || "Bacabal - MA"}`;
    }


    const telefone =
        document.getElementById(
            "footerTelefone"
        );

    if (telefone) {

        telefone.textContent =
            config.whatsapp
                ? `📱 ${formatarTelefone(config.whatsapp)}`
                : "📱 WhatsApp";
    }


    atualizarWhatsApp();

    atualizarHorarioLoja();
}


function formatarTelefone(numero) {

    const limpo = String(numero || "")
        .replace(/\D/g, "");

    if (limpo.length === 13) {

        return `(${limpo.slice(2, 4)}) ${limpo.slice(4, 9)}-${limpo.slice(9)}`;
    }

    if (limpo.length === 11) {

        return `(${limpo.slice(0, 2)}) ${limpo.slice(2, 7)}-${limpo.slice(7)}`;
    }

    return numero;
}


/* =========================================================
   HORÁRIO
========================================================= */

function obterDiaSemana() {

    const dias = [
        "domingo",
        "segunda",
        "terca",
        "quarta",
        "quinta",
        "sexta",
        "sabado"
    ];

    return dias[
        new Date().getDay()
    ];
}


function horaParaMinutos(hora) {

    if (!hora) {
        return 0;
    }

    const partes = hora.split(":");

    return (
        Number(partes[0]) * 60 +
        Number(partes[1])
    );
}


function lojaEstaAberta() {

    const dia = obterDiaSemana();

    const horario =
        config.horarios?.[dia];

    if (!horario || !horario.abertura || !horario.fechamento) {
        return false;
    }

    const agora = new Date();

    const minutosAtuais =
        agora.getHours() * 60 +
        agora.getMinutes();

    const abertura =
        horaParaMinutos(horario.abertura);

    let fechamento =
        horaParaMinutos(horario.fechamento);

    // Lógica para horário que atravessa a meia-noite (ex: 18:00 às 02:00)
    if (fechamento <= abertura) {
        // Se a hora atual for após a abertura OU antes do fechamento (que é no dia seguinte)
        return minutosAtuais >= abertura || minutosAtuais < fechamento;
    }

    // Horário normal no mesmo dia (ex: 09:00 às 18:00)
    return (
        minutosAtuais >= abertura &&
        minutosAtuais < fechamento
    );
}


function obterHorarioAtual() {

    const dia = obterDiaSemana();
    const horarioSalvo = config.horarios?.[dia] || {};

    return {
        abertura: horarioSalvo.abertura || "",
        fechamento: horarioSalvo.fechamento || ""
    };
}


function atualizarHorarioLoja() {

    const status =
        document.getElementById(
            "statusLoja"
        );

    const horario =
        document.getElementById(
            "horarioLoja"
        );

    const footerHorario =
        document.getElementById(
            "footerHorario"
        );

    const atual =
        obterHorarioAtual();

    const aberta =
        lojaEstaAberta();

    if (status) {

        status.textContent =
            aberta
                ? "● Loja aberta"
                : "● Loja fechada";

        status.style.color =
            aberta
                ? "var(--green)"
                : "var(--red)";
    }


    const textoExibicao = (atual.abertura && atual.fechamento)
        ? `Hoje: ${atual.abertura} às ${atual.fechamento}`
        : "Hoje: Fechado";

    if (horario) {
        horario.textContent = textoExibicao;
    }


    if (footerHorario) {
        footerHorario.textContent = (atual.abertura && atual.fechamento)
            ? `🕐 ${atual.abertura} às ${atual.fechamento}`
            : "🕐 Fechado";
    }
}


/* =========================================================
   WHATSAPP
========================================================= */

function gerarLinkWhatsApp(mensagem = "") {

    const numero = String(
        config.whatsapp || ""
    ).replace(/\D/g, "");

    if (!numero) {
        return "#";
    }

    return `https://wa.me/${numero}?text=${encodeURIComponent(
        mensagem
    )}`;
}


function atualizarWhatsApp() {

    const link =
        gerarLinkWhatsApp(
            "Olá! Gostaria de fazer um pedido na Gran Pizza."
        );

    const footer =
        document.getElementById(
            "linkWhatsAppFooter"
        );

    if (footer) {
        footer.href = link;
    }
}


function abrirWhatsApp(mensagem = "") {

    const link =
        gerarLinkWhatsApp(
            mensagem ||
            "Olá! Gostaria de fazer um pedido na Gran Pizza."
        );

    if (link === "#") {

        mostrarToast(
            "WhatsApp da loja ainda não configurado.",
            "error"
        );

        return;
    }

    window.open(
        link,
        "_blank",
        "noopener,noreferrer"
    );
}


/* =========================================================
   CATEGORIAS
========================================================= */

function renderizarCategorias() {

    const container =
        document.getElementById(
            "listaCategorias"
        );

    const select =
        document.getElementById(
            "filtroCategoria"
        );

    if (!container) {
        return;
    }

    const categoriasAtivas =
        categorias.filter(
            categoria => categoria.ativa !== false
        );


    container.innerHTML = `
        <button
            type="button"
            class="category-btn ${
                categoriaAtual === "todos"
                    ? "active"
                    : ""
            }"
            data-categoria="todos"
        >
            🍕 Todos
        </button>

        ${categoriasAtivas.map(
            categoria => `
                <button
                    type="button"
                    class="category-btn ${
                        categoriaAtual === categoria.nome
                            ? "active"
                            : ""
                    }"
                    data-categoria="${escaparHTML(categoria.nome)}"
                >
                    ${obterIconeCategoria(categoria.nome)}
                    ${escaparHTML(categoria.nome)}
                </button>
            `
        ).join("")}
    `;


    if (select) {

        select.innerHTML = `
            <option value="todos">
                Todas
            </option>

            ${categoriasAtivas.map(
                categoria => `
                    <option
                        value="${escaparHTML(categoria.nome)}"
                        ${
                            categoriaAtual === categoria.nome
                                ? "selected"
                                : ""
                        }
                    >
                        ${escaparHTML(categoria.nome)}
                    </option>
                `
            ).join("")}
        `;
    }
}


function obterIconeCategoria(nome) {

    const categoria =
        String(nome || "").toLowerCase();

    if (categoria.includes("bebida")) {
        return "🥤";
    }

    if (categoria.includes("doce")) {
        return "🍫";
    }

    if (categoria.includes("combo")) {
        return "🍕";
    }

    if (categoria.includes("especial")) {
        return "⭐";
    }

    return "🍕";
}


function selecionarCategoria(categoria) {

    categoriaAtual = categoria;

    renderizarCategorias();
    renderizarProdutos();

    const cardapio =
        document.getElementById(
            "cardapio"
        );

    if (
        cardapio &&
        window.scrollY > cardapio.offsetTop + 300
    ) {
        cardapio.scrollIntoView({
            behavior: "smooth"
        });
    }
}


/* =========================================================
   PRODUTOS E SABORES
========================================================= */

function temOpcaoSabores(produto) {
    return Boolean(produto && (
        (Array.isArray(produto.sabores) && produto.sabores.length > 0) ||
        (typeof produto.sabores === "string" && produto.sabores.trim())
    ));
}

function obterNomeSabor(sabor) {
    if (sabor && typeof sabor === "object") {
        return typeof sabor.nome === "string" ? sabor.nome.trim() : "";
    }
    return typeof sabor === "string" || typeof sabor === "number" ? String(sabor).trim() : "";
}

function obterListaSabores(produto) {
    if (!produto?.sabores) return [];
    if (Array.isArray(produto.sabores)) {
        return produto.sabores.map(sabor => {
            const nome = obterNomeSabor(sabor);
            return nome ? (sabor && typeof sabor === "object" ? { ...sabor, nome } : sabor) : null;
        }).filter(Boolean);
    }
    return typeof produto.sabores === "string"
        ? produto.sabores.split(",").map(sabor => sabor.trim()).filter(Boolean)
        : [];
}

function obterValorSabor(sabor) {
    if (!sabor || typeof sabor !== "object") return null;
    const valor = sabor.valor ?? sabor.preco;
    if (valor === undefined || valor === null || valor === "") return null;
    const numero = Number(valor);
    return Number.isFinite(numero) && numero >= 0 ? numero : null;
}

function obterProdutosFiltrados() {

    const termo =
        buscaAtual.trim().toLowerCase();

    return produtos.filter(produto => {

        if (produto.ativo === false) {
            return false;
        }

        if (
            Number(produto.estoque) <= 0
        ) {
            return false;
        }

        const correspondeCategoria =
            categoriaAtual === "todos" ||
            produto.categoria === categoriaAtual;

        if (!correspondeCategoria) {
            return false;
        }

        if (!termo) {
            return true;
        }

        const textoBusca = [
            produto.nome,
            produto.descricao,
            produto.categoria
        ]
            .join(" ")
            .toLowerCase();

        return textoBusca.includes(termo);
    });
}


function renderizarProdutos() {

    const container =
        document.getElementById(
            "listaProdutos"
        );

    const vazio =
        document.getElementById(
            "produtosVazios"
        );

    if (!container) {
        return;
    }

    const lista =
        obterProdutosFiltrados();


    container.innerHTML =
        lista.map(
            produto => criarCardProduto(produto)
        ).join("");


    if (vazio) {

        vazio.classList.toggle(
            "hidden",
            lista.length > 0
        );
    }
}


function criarCardProduto(produto) {

    const preco =
        obterPrecoProduto(produto);

    const imagem =
        produto.imagem
            ? `
                <img
                    src="${escaparHTML(produto.imagem)}"
                    alt="${escaparHTML(produto.nome)}"
                    loading="lazy"
                >
            `
            : `
                <div class="product-placeholder">
                    🍕
                </div>
            `;

    return `
        <article
            class="product-card"
            data-produto-id="${escaparHTML(produto.id)}"
        >

            <div class="product-image">

                ${imagem}

                ${
                    produto.destaque
                        ? `
                            <span class="product-badge">
                                Destaque
                            </span>
                        `
                        : ""
                }

                ${
                    Number(produto.estoque) <= 5
                        ? `
                            <span class="product-stock">
                                Últimas unidades
                            </span>
                        `
                        : ""
                }

            </div>


            <div class="product-content">

                <div class="product-category">
                    ${escaparHTML(produto.categoria)}
                </div>

                <h3>
                    ${escaparHTML(produto.nome)}
                </h3>

                <p class="product-description">
                    ${escaparHTML(produto.descricao)}
                </p>

                <div class="product-bottom">

                    <strong class="product-price">
                        ${formatarMoeda(preco)}
                    </strong>

                    <button
                        type="button"
                        class="product-add"
                        data-adicionar-produto="${escaparHTML(produto.id)}"
                        aria-label="Adicionar ${escaparHTML(produto.nome)}"
                    >
                        +
                    </button>

                </div>

            </div>

        </article>
    `;
}


function obterPrecoProduto(produto) {

    if (
        produto.tamanhos &&
        produto.tamanhos.length
    ) {

        return Number(
            produto.tamanhos[0].preco ||
            produto.preco ||
            0
        );
    }

    return Number(
        produto.preco || 0
    );
}


/* =========================================================
   MODAL DE SABORES
========================================================= */

function abrirModalSabores(produto, configuracaoExtra = {}) {
    produtoSaborEmSelecao = produto;
    configuracaoPendenteSabor = configuracaoExtra || {};

    const modal = document.getElementById("modalSabores");
    const nomeEl = document.getElementById("nomeProdutoSabor");
    const listaEl = document.getElementById("listaSaboresContainer");
    const erroEl = document.getElementById("erroSaborModal");
    if (!modal || !nomeEl || !listaEl) return;

    nomeEl.textContent = produto.nome;
    erroEl?.classList.add("hidden");
    listaEl.innerHTML = obterListaSabores(produto).map((sabor, indice) => {
        const nome = obterNomeSabor(sabor);
        const valor = obterValorSabor(sabor);
        const texto = valor === null ? nome : `${nome} — ${formatarMoeda(valor)}`;
        return `<label class="flavor-option"><input type="radio" name="saborSelecionado" value="${escaparHTML(nome)}" data-sabor-indice="${indice}"><span>${escaparHTML(texto)}</span></label>`;
    }).join("") || "<p>Nenhum sabor cadastrado para este produto.</p>";

    modal.classList.remove("hidden");
    document.body.classList.add("no-scroll");
}

function fecharModalSabores() {
    document.getElementById("modalSabores")?.classList.add("hidden");
    produtoSaborEmSelecao = null;
    configuracaoPendenteSabor = {};
    verificarScrollBody();
}

function confirmarSaborProduto() {
    const selecionado = document.querySelector('input[name="saborSelecionado"]:checked');
    const erroEl = document.getElementById("erroSaborModal");
    if (!produtoSaborEmSelecao || !selecionado) {
        erroEl?.classList.remove("hidden");
        return;
    }

    const sabor = obterListaSabores(produtoSaborEmSelecao)[Number(selecionado.dataset.saborIndice)] || selecionado.value;
    const produto = produtoSaborEmSelecao;
    const configuracao = { ...configuracaoPendenteSabor, sabor };
    fecharModalSabores();
    adicionarProdutoAoCarrinho(produto, configuracao);
}


/* =========================================================
   MODAL DO PRODUTO
========================================================= */

function abrirModalProduto(id) {

    const produto =
        produtos.find(
            item => item.id === id
        );

    if (!produto) {
        return;
    }

    produtoSelecionado = produto;

    const modal =
        document.getElementById(
            "modalProduto"
        );

    const conteudo =
        document.getElementById(
            "produtoModalConteudo"
        );

    if (!modal || !conteudo) {
        return;
    }


    const imagem =
        produto.imagem
            ? `
                <img
                    src="${escaparHTML(produto.imagem)}"
                    alt="${escaparHTML(produto.nome)}"
                >
            `
            : `
                <div class="product-placeholder">
                    🍕
                </div>
            `;


    const tamanhos =
        produto.tamanhos || [];

    const adicionais =
        produto.adicionais || [];


    conteudo.innerHTML = `

        <div class="product-modal-content">

            <div class="product-modal-image">
                ${imagem}
            </div>


            <div class="product-modal-info">

                <div class="product-category">
                    ${escaparHTML(produto.categoria)}
                </div>

                <h2>
                    ${escaparHTML(produto.nome)}
                </h2>

                <p>
                    ${escaparHTML(produto.descricao)}
                </p>


                ${
                    tamanhos.length
                        ? `
                            <div class="option-group">

                                <h4>
                                    Escolha o tamanho
                                </h4>

                                <div class="option-list">

                                    ${tamanhos.map(
                                        (tamanho, index) => `
                                            <label class="option-item">

                                                <span>
                                                    <input
                                                        type="radio"
                                                        name="tamanhoProduto"
                                                        value="${index}"
                                                        ${
                                                            index === 0
                                                                ? "checked"
                                                                : ""
                                                        }
                                                    >

                                                    ${escaparHTML(tamanho.nome)}
                                                </span>

                                                <strong>
                                                    ${formatarMoeda(
                                                        tamanho.preco
                                                    )}
                                                </strong>

                                            </label>
                                        `
                                    ).join("")}

                                </div>

                            </div>
                        `
                        : ""
                }


                ${
                    adicionais.length
                        ? `
                            <div class="option-group">

                                <h4>
                                    Adicionais
                                </h4>

                                <div class="option-list">

                                    ${adicionais.map(
                                        (adicional, index) => `
                                            <label class="option-item">

                                                <span>
                                                    <input
                                                        type="checkbox"
                                                        name="adicionalProduto"
                                                        value="${index}"
                                                    >

                                                    ${escaparHTML(adicional.nome)}
                                                </span>

                                                <strong>
                                                    + ${formatarMoeda(
                                                        adicional.preco
                                                    )}
                                                </strong>

                                            </label>
                                        `
                                    ).join("")}

                                </div>

                            </div>
                        `
                        : ""
                }


                <div class="option-group">

                    <h4>
                        Observação
                    </h4>

                    <div class="form-group">

                        <textarea
                            id="observacaoProduto"
                            rows="3"
                            placeholder="Alguma observação?"
                        ></textarea>

                    </div>

                </div>


                <div class="product-modal-actions">

                    <button
                        type="button"
                        class="btn btn-primary btn-full"
                        id="btnAdicionarModal"
                    >
                        Adicionar ao carrinho
                    </button>

                </div>

            </div>

        </div>
    `;


    modal.classList.remove("hidden");

    document.body.classList.add(
        "no-scroll"
    );
}


function fecharModalProduto() {

    const modal =
        document.getElementById(
            "modalProduto"
        );

    if (modal) {
        modal.classList.add("hidden");
    }

    produtoSelecionado = null;

    verificarScrollBody();
}


/* =========================================================
   CARRINHO
========================================================= */

function adicionarProdutoAoCarrinho(
    produto,
    configuracao = {}
) {

    if (!produto) {
        return;
    }

    if (
        Number(produto.estoque) <= 0
    ) {

        mostrarToast(
            "Este produto está esgotado.",
            "error"
        );

        return;
    }


    const tamanho =
        configuracao.tamanho || null;

    const adicionais =
        configuracao.adicionais || [];

    const sabor = configuracao.sabor && typeof configuracao.sabor === "object"
        ? { ...configuracao.sabor, nome: obterNomeSabor(configuracao.sabor) }
        : obterNomeSabor(configuracao.sabor) || null;
    const valorSabor = obterValorSabor(sabor);

    let preco =
        valorSabor !== null
            ? valorSabor
            : tamanho
            ? Number(tamanho.preco)
            : obterPrecoProduto(produto);


    adicionais.forEach(
        adicional => {
            preco += Number(
                adicional.preco || 0
            );
        }
    );


    const assinatura =
        [
            produto.id,
            tamanho?.nome || "",
            adicionais
                .map(item => item.nome)
                .sort()
                .join(","),
            obterNomeSabor(sabor) || "",
            valorSabor ?? ""
        ].join("|");


    const existente =
        carrinho.find(
            item => item.assinatura === assinatura
        );


    if (existente) {

        existente.quantidade += 1;

    } else {

        carrinho.push({
            id: gerarId("item"),
            assinatura,
            produtoId: produto.id,

            nome: produto.nome,
            imagem: produto.imagem || "",

            categoria: produto.categoria,

            sabor,

            tamanho: tamanho
                ? {
                    nome: tamanho.nome,
                    preco: Number(tamanho.preco)
                }
                : null,

            adicionais:
                adicionais.map(item => ({
                    nome: item.nome,
                    preco: Number(item.preco || 0)
                })),

            observacao:
                configuracao.observacao || "",

            precoUnitario: preco,

            quantidade: 1
        });
    }


    salvarStorage(
        STORAGE_KEYS.carrinho,
        carrinho
    );


    renderizarCarrinho();

    fecharModalProduto();

    abrirCarrinho();

    mostrarToast(
        "Produto adicionado ao carrinho.",
        "success"
    );
}


function removerDoCarrinho(id) {

    carrinho =
        carrinho.filter(
            item => item.id !== id
        );

    salvarStorage(
        STORAGE_KEYS.carrinho,
        carrinho
    );

    renderizarCarrinho();
}


function alterarQuantidade(id, quantidade) {

    const item =
        carrinho.find(
            produto => produto.id === id
        );

    if (!item) {
        return;
    }

    if (quantidade <= 0) {

        removerDoCarrinho(id);

        return;
    }

    const produto =
        produtos.find(
            itemProduto =>
                itemProduto.id === item.produtoId
        );

    if (
        produto &&
        quantidade > Number(produto.estoque)
    ) {

        mostrarToast(
            "Quantidade maior que o estoque disponível.",
            "error"
        );

        return;
    }

    item.quantidade = quantidade;

    salvarStorage(
        STORAGE_KEYS.carrinho,
        carrinho
    );

    renderizarCarrinho();
}


function calcularSubtotal() {

    return carrinho.reduce(
        (total, item) =>
            total +
            Number(item.precoUnitario || 0) *
            Number(item.quantidade || 0),
        0
    );
}


function calcularDesconto(subtotal = calcularSubtotal()) {

    if (!cupomAplicado) {
        return 0;
    }

    const cupom = normalizarCupom(cupomAplicado);

    if (subtotal < Number(cupom.minimo || 0)) {
        return 0;
    }

    if (cupom.tipo === "fixo") {

        return Math.min(
            Number(cupom.valor || 0),
            subtotal
        );
    }

    return (
        subtotal *
        Number(cupom.valor || 0) /
        100
    );
}


function normalizarCupom(cupom) {
    if (!cupom) {
        return null;
    }

    return {
        ...cupom,
        tipo: cupom.tipo || "percentual",
        valor: Number(cupom.valor ?? cupom.desconto ?? 0),
        minimo: Number(cupom.minimo ?? cupom.valorMinimo ?? 0),
        validade: cupom.validade || cupom.validadeAte || ""
    };
}


function obterTipoEntregaCheckout() {

    const selecionado =
        document.querySelector(
            'input[name="tipoEntrega"]:checked'
        );

    return selecionado
        ? selecionado.value
        : "entrega";
}


function calcularTaxaEntrega() {

    if (
        obterTipoEntregaCheckout() ===
        "retirada"
    ) {
        return 0;
    }

    return Number(
        config.taxaEntrega || 0
    );
}


function calcularTotal() {

    const subtotal =
        calcularSubtotal();

    const desconto =
        calcularDesconto(subtotal);

    const entrega =
        calcularTaxaEntrega();

    return Math.max(
        0,
        subtotal - desconto + entrega
    );
}


/* =========================================================
   RENDERIZAR CARRINHO
========================================================= */

function renderizarCarrinho() {

    const container =
        document.getElementById(
            "itensCarrinho"
        );

    const vazio =
        document.getElementById(
            "carrinhoVazio"
        );

    const rodape =
        document.getElementById(
            "rodapeCarrinho"
        );

    const contador =
        document.getElementById(
            "contadorCarrinho"
        );

    if (!container) {
        return;
    }


    const quantidadeTotal =
        carrinho.reduce(
            (total, item) =>
                total +
                Number(item.quantidade || 0),
            0
        );


    if (contador) {
        contador.textContent =
            quantidadeTotal;
    }


    if (!carrinho.length) {

        container.innerHTML = "";

        if (vazio) {
            vazio.style.display = "block";
        }

        if (rodape) {
            rodape.style.display = "none";
        }

        atualizarResumoCarrinho();

        return;
    }


    if (vazio) {
        vazio.style.display = "none";
    }

    if (rodape) {
        rodape.style.display = "block";
    }


    container.innerHTML =
        carrinho.map(
            item => {

                const imagem =
                    item.imagem
                        ? `
                            <img
                                src="${escaparHTML(item.imagem)}"
                                alt="${escaparHTML(item.nome)}"
                            >
                        `
                        : "🍕";


                const adicionais =
                    item.adicionais?.length
                        ? `
                            <small>
                                ${item.adicionais
                                    .map(
                                        adicional =>
                                            escaparHTML(
                                                adicional.nome
                                            )
                                    )
                                    .join(", ")}
                            </small>
                        `
                        : "";


                const tamanho =
                    item.tamanho
                        ? `
                            <small>
                                ${escaparHTML(
                                    item.tamanho.nome
                                )}
                            </small>
                        `
                        : "";

                const nomeSabor = obterNomeSabor(item.sabor);
                const valorSabor = obterValorSabor(item.sabor);
                const saborExibicao = nomeSabor
                    ? `<small class="cart-item-flavor">Sabor: ${escaparHTML(nomeSabor)}${valorSabor === null ? "" : ` — ${formatarMoeda(valorSabor)}`}</small>`
                    : "";


                return `
                    <div
                        class="cart-item"
                        data-cart-id="${escaparHTML(item.id)}"
                    >

                        <div class="cart-item-image">
                            ${imagem}
                        </div>


                        <div>

                            <h4>
                                ${escaparHTML(item.nome)}
                            </h4>

                            ${saborExibicao}

                            ${tamanho}

                            ${adicionais}

                            <div class="cart-item-price">
                                ${formatarMoeda(
                                    item.precoUnitario *
                                    item.quantidade
                                )}
                            </div>

                            <button
                                type="button"
                                class="cart-remove"
                                data-remover-carrinho="${escaparHTML(item.id)}"
                            >
                                Remover
                            </button>

                        </div>


                        <div class="cart-quantity">

                            <button
                                type="button"
                                data-diminuir-carrinho="${escaparHTML(item.id)}"
                                aria-label="Diminuir quantidade"
                            >
                                −
                            </button>

                            <span>
                                ${item.quantidade}
                            </span>

                            <button
                                type="button"
                                data-aumentar-carrinho="${escaparHTML(item.id)}"
                                aria-label="Aumentar quantidade"
                            >
                                +
                            </button>

                        </div>

                    </div>
                `;
            }
        ).join("");


    atualizarResumoCarrinho();
}


function atualizarResumoCarrinho() {

    const subtotal =
        calcularSubtotal();

    const entrega =
        calcularTaxaEntrega();

    const desconto =
        calcularDesconto(subtotal);

    const total =
        Math.max(
            0,
            subtotal - desconto + entrega
        );


    const subtotalElemento =
        document.getElementById(
            "subtotalCarrinho"
        );

    const entregaElemento =
        document.getElementById(
            "entregaCarrinho"
        );

    const totalElemento =
        document.getElementById(
            "totalCarrinho"
        );


    if (subtotalElemento) {
        subtotalElemento.textContent =
            formatarMoeda(subtotal);
    }

    if (entregaElemento) {

        entregaElemento.textContent =
            entrega > 0
                ? formatarMoeda(entrega)
                : "Grátis";
    }

    if (totalElemento) {
        totalElemento.textContent =
            formatarMoeda(total);
    }
}


/* =========================================================
   ABRIR / FECHAR CARRINHO
========================================================= */

function abrirCarrinho() {

    const drawer =
        document.getElementById(
            "carrinhoDrawer"
        );

    const overlay =
        document.getElementById(
            "cartOverlay"
        );

    if (!drawer) {
        return;
    }

    drawer.classList.add("open");

    if (overlay) {
        overlay.classList.remove("hidden");
    }

    document.body.classList.add(
        "no-scroll"
    );
}


function fecharCarrinho() {

    const drawer =
        document.getElementById(
            "carrinhoDrawer"
        );

    const overlay =
        document.getElementById(
            "cartOverlay"
        );

    if (drawer) {
        drawer.classList.remove("open");
    }

    if (overlay) {
        overlay.classList.add("hidden");
    }

    verificarScrollBody();
}


function verificarScrollBody() {

    const carrinhoAberto =
        document
            .getElementById("carrinhoDrawer")
            ?.classList.contains("open");

    const modalAberto =
        document.querySelector(
            ".modal:not(.hidden)"
        );

    if (
        !carrinhoAberto &&
        !modalAberto
    ) {
        document.body.classList.remove(
            "no-scroll"
        );
    }
}


/* =========================================================
   CHECKOUT
========================================================= */

function abrirCheckout() {

    if (!carrinho.length) {

        mostrarToast(
            "Adicione pelo menos um produto.",
            "error"
        );

        return;
    }


    if (!lojaEstaAberta()) {

        mostrarToast(
            "A loja está fechada no momento.",
            "error"
        );

        return;
    }

    const tipoEntrega = obterTipoEntregaCheckout();
    const entregaAtiva = config.entregaAtiva !== false;
    const retiradaAtiva = config.retiradaAtiva !== false;

    if (
        !((tipoEntrega === "entrega" && entregaAtiva) ||
            (tipoEntrega === "retirada" && retiradaAtiva))
    ) {
        mostrarToast(
            "Nenhuma opção de recebimento está disponível.",
            "error"
        );

        return;
    }


    fecharCarrinho();

    const modal =
        document.getElementById(
            "modalCheckout"
        );

    if (!modal) {
        return;
    }

    cupomAplicado = null;

    const codigo =
        document.getElementById(
            "codigoCupom"
        );

    const mensagem =
        document.getElementById(
            "mensagemCupom"
        );

    if (codigo) {
        codigo.value = "";
    }

    if (mensagem) {
        mensagem.textContent = "";
        mensagem.className = "coupon-message";
    }

    atualizarOpcoesEntrega();
    atualizarSecaoEndereco();
    atualizarCampoTroco();
    renderizarResumoCheckout();

    modal.classList.remove("hidden");

    document.body.classList.add(
        "no-scroll"
    );
}


function fecharCheckout() {

    const modal =
        document.getElementById(
            "modalCheckout"
        );

    if (modal) {
        modal.classList.add("hidden");
    }

    verificarScrollBody();
}


function atualizarSecaoEndereco() {
    const tipo = obterTipoEntregaCheckout();
    const secao = document.getElementById("secaoEndereco");

    if (!secao) {
        return;
    }

    secao.classList.toggle("hidden", tipo === "retirada");

    ["enderecoRua", "enderecoNumero", "enderecoBairro"].forEach(id => {
        const campo = document.getElementById(id);

        if (campo) {
            campo.required = tipo === "entrega";
        }
    });
}


function atualizarOpcoesEntrega() {
    const opcoes = [
        {
            valor: "entrega",
            ativa: config.entregaAtiva !== false
        },
        {
            valor: "retirada",
            ativa: config.retiradaAtiva !== false
        }
    ];

    opcoes.forEach(opcao => {
        const input = document.querySelector(
            `input[name="tipoEntrega"][value="${opcao.valor}"]`
        );
        const label = input?.closest(".delivery-option");

        if (!input) {
            return;
        }
        if (!opcao.ativa) {
            input.checked = false;
        }

        label?.classList.toggle("hidden", !opcao.ativa);
    });

    const selecionada = document.querySelector(
        'input[name="tipoEntrega"]:checked:not(:disabled)'
    );
    const primeiraAtiva = opcoes.find(opcao => opcao.ativa);

    if (!selecionada && primeiraAtiva) {
        const input = document.querySelector(
            `input[name="tipoEntrega"][value="${primeiraAtiva.valor}"]`
        );

        if (input) {
            input.checked = true;
        }
    }
}


function atualizarCampoTroco() {

    const pagamento =
        document.querySelector(
            'input[name="pagamento"]:checked'
        )?.value;


    const campo =
        document.getElementById(
            "campoTroco"
        );

    const input =
        document.getElementById(
            "trocoPara"
        );


    if (!campo) {
        return;
    }


    const dinheiro =
        pagamento === "dinheiro";

    campo.classList.toggle(
        "hidden",
        !dinheiro
    );

    if (input) {
        input.required = dinheiro;
    }
}


function renderizarResumoCheckout() {

    const container =
        document.getElementById(
            "resumoCheckout"
        );

    const totalElemento =
        document.getElementById(
            "totalCheckout"
        );

    if (!container) {
        return;
    }


    const subtotal =
        calcularSubtotal();

    const desconto =
        calcularDesconto(subtotal);

    const entrega =
        calcularTaxaEntrega();

    const total =
        calcularTotal();


    container.innerHTML =
        carrinho.map(
            item => `
                <div class="checkout-summary-item">

                    <span>
                        ${item.quantidade}x
                        ${escaparHTML(item.nome)}
                        ${obterNomeSabor(item.sabor) ? `(${escaparHTML(obterNomeSabor(item.sabor))})` : ""}
                    </span>

                    <strong>
                        ${formatarMoeda(
                            item.precoUnitario *
                            item.quantidade
                        )}
                    </strong>

                </div>
            `
        ).join("") +
        `
            <div class="checkout-summary-item">

                <span>
                    Subtotal
                </span>

                <strong>
                    ${formatarMoeda(subtotal)}
                </strong>

            </div>

            ${
                desconto > 0
                    ? `
                        <div class="checkout-summary-item">

                            <span>
                                Desconto
                            </span>

                            <strong style="color: var(--green);">
                                - ${formatarMoeda(desconto)}
                            </strong>

                        </div>
                    `
                    : ""
            }

            <div class="checkout-summary-item">

                <span>
                    Entrega
                </span>

                <strong>
                    ${
                        entrega > 0
                            ? formatarMoeda(entrega)
                            : "Grátis"
                    }
                </strong>

            </div>
        `;


    if (totalElemento) {

        totalElemento.textContent =
            formatarMoeda(total);
    }
}


/* =========================================================
   CUPONS
========================================================= */

function aplicarCupom() {

    const input =
        document.getElementById(
            "codigoCupom"
        );

    const mensagem =
        document.getElementById(
            "mensagemCupom"
        );

    if (!input || !mensagem) {
        return;
    }


    const codigo =
        input.value
            .trim()
            .toUpperCase();


    if (!codigo) {

        mensagem.textContent =
            "Digite um código de cupom.";

        mensagem.className =
            "coupon-message error";

        return;
    }


    const cupom =
        cupons.find(
            item =>
                String(item.codigo)
                    .toUpperCase() === codigo &&
                item.ativo !== false
        );


    if (!cupom) {

        cupomAplicado = null;

        mensagem.textContent =
            "Cupom inválido ou inativo.";

        mensagem.className =
            "coupon-message error";

        renderizarResumoCheckout();

        return;
    }


    const cupomNormalizado = normalizarCupom(cupom);

    if (
        cupomNormalizado.validade &&
        cupomNormalizado.validade <
        new Date().toISOString().slice(0, 10)
    ) {

        cupomAplicado = null;

        mensagem.textContent =
            "Este cupom está expirado.";

        mensagem.className =
            "coupon-message error";

        renderizarResumoCheckout();

        return;
    }


    const subtotal =
        calcularSubtotal();


    if (
        subtotal <
        Number(cupomNormalizado.minimo || 0)
    ) {

        cupomAplicado = null;

        mensagem.textContent =
            `Pedido mínimo de ${formatarMoeda(
                cupomNormalizado.minimo
            )} para utilizar este cupom.`;

        mensagem.className =
            "coupon-message error";

        renderizarResumoCheckout();

        return;
    }


    cupomAplicado = cupomNormalizado;

    mensagem.textContent =
        cupomNormalizado.descricao ||
        "Cupom aplicado com sucesso!";

    mensagem.className =
        "coupon-message success";

    renderizarResumoCheckout();

    mostrarToast(
        "Cupom aplicado.",
        "success"
    );
}


/* =========================================================
   CRIAÇÃO DO PEDIDO
========================================================= */

function gerarCodigoPedido() {

    return `BP-${Math.floor(
        100000 +
        Math.random() * 900000
    )}`;
}


function criarPedido(evento) {

    evento.preventDefault();


    if (!carrinho.length) {

        mostrarToast(
            "Seu carrinho está vazio.",
            "error"
        );

        return;
    }


    if (!lojaEstaAberta()) {

        mostrarToast(
            "A loja está fechada no momento.",
            "error"
        );

        return;
    }


    const nome =
        document.getElementById(
            "clienteNome"
        )?.value.trim();


    const telefone =
        document.getElementById(
            "clienteTelefone"
        )?.value.trim();


    const tipoEntrega =
        obterTipoEntregaCheckout();


    const pagamento =
        document.querySelector(
            'input[name="pagamento"]:checked'
        )?.value;


    const observacoes =
        document.getElementById(
            "observacoesPedido"
        )?.value.trim() || "";


    if (!nome || !telefoneValido(telefone)) {

        mostrarToast(
            "Informe um telefone válido e preencha seu nome.",
            "error"
        );

        return;
    }


    let endereco = null;


    if (tipoEntrega === "entrega") {

        const rua =
            document.getElementById(
                "enderecoRua"
            )?.value.trim();

        const numero =
            document.getElementById(
                "enderecoNumero"
            )?.value.trim();

        const bairro =
            document.getElementById(
                "enderecoBairro"
            )?.value.trim();

        const complemento =
            document.getElementById(
                "enderecoComplemento"
            )?.value.trim();


        if (
            !rua ||
            !numero ||
            !bairro
        ) {

            mostrarToast(
                "Preencha o endereço de entrega.",
                "error"
            );

            return;
        }


        endereco = {
            rua,
            numero,
            bairro,
            complemento
        };
    }


    const subtotal =
        calcularSubtotal();

    const desconto =
        calcularDesconto(subtotal);

    const entrega =
        calcularTaxaEntrega();

    const total =
        calcularTotal();


    let trocoPara = null;
    let troco = null;


    if (
        pagamento === "dinheiro"
    ) {

        trocoPara =
            Number(
                document.getElementById(
                    "trocoPara"
                )?.value || 0
            );


        if (
            !trocoPara ||
            trocoPara < total
        ) {

            mostrarToast(
                `O valor para troco precisa ser de pelo menos ${formatarMoeda(total)}.`,
                "error"
            );

            return;
        }


        troco =
            trocoPara - total;
    }


    /*
     * Verificação de estoque antes
     * de finalizar o pedido.
     */
    for (const item of carrinho) {

        const produto =
            produtos.find(
                produtoAtual =>
                    produtoAtual.id === item.produtoId
            );


        if (!produto) {

            mostrarToast(
                `O produto "${item.nome}" não está mais disponível.`,
                "error"
            );

            return;
        }


        if (
            Number(produto.estoque) <
            Number(item.quantidade)
        ) {

            mostrarToast(
                `Estoque insuficiente para "${item.nome}".`,
                "error"
            );

            return;
        }
    }


    /*
     * Baixa do estoque.
     */
    carrinho.forEach(item => {

        const produto =
            produtos.find(
                produtoAtual =>
                    produtoAtual.id === item.produtoId
            );

        if (produto) {

            produto.estoque =
                Number(produto.estoque) -
                Number(item.quantidade);
        }
    });


    salvarStorage(
        STORAGE_KEYS.produtos,
        produtos
    );


    const codigo =
        gerarCodigoPedido();


    const pedido = {

        id: gerarId("pedido"),

        codigo,

        criadoEm:
            new Date().toISOString(),

        status: "novo",

        clienteTelefone: normalizarTelefone(telefone),

        cliente: {
            nome,
            telefone
        },

        tipoEntrega,

        endereco,

        itens:
            JSON.parse(
                JSON.stringify(carrinho)
            ),

        subtotal,

        desconto,

        cupom:
            cupomAplicado
                ? {
                    codigo: cupomAplicado.codigo,
                    tipo: cupomAplicado.tipo,
                    valor: cupomAplicado.valor
                }
                : null,

        taxaEntrega: entrega,

        total,

        pagamento,

        trocoPara,

        troco,

        observacoes
    };


    pedidos.unshift(
        pedido
    );


    salvarStorage(
        STORAGE_KEYS.pedidos,
        pedidos
    );


    salvarStorage(
        STORAGE_KEYS.ultimoPedido,
        pedido
    );


    meusPedidos.unshift(pedido.id);
    // Limitar aos últimos 10 IDs de pedidos para não sobrecarregar
    if (meusPedidos.length > 10) meusPedidos.pop();

    salvarStorage(
        STORAGE_KEYS.meusPedidos,
        meusPedidos
    );


    carrinho = [];

    cupomAplicado = null;


    salvarStorage(
        STORAGE_KEYS.carrinho,
        carrinho
    );


    renderizarCarrinho();

    fecharCheckout();

    renderizarFidelidade(
        pedido.clienteTelefone
    );

    mostrarPedidoSucesso(
        pedido
    );
}


/* =========================================================
   PEDIDO REALIZADO
========================================================= */

function mostrarPedidoSucesso(pedido) {

    const modal =
        document.getElementById(
            "modalPedidoSucesso"
        );

    const codigo =
        document.getElementById(
            "codigoPedidoGerado"
        );

    const btnWhatsApp =
        document.getElementById(
            "btnWhatsAppSucesso"
        );


    if (codigo) {
        codigo.textContent =
            pedido.codigo;
    }


    if (btnWhatsApp) {
        btnWhatsApp.onclick = () =>
            enviarPedidoWhatsApp(pedido);
    }


    if (modal) {
        modal.classList.remove("hidden");
        document.body.classList.add("no-scroll");
    }
}


function enviarPedidoWhatsApp(pedido) {

    const numero =
        config.whatsapp || "";

    if (!numero) {
        mostrarToast(
            "Número do WhatsApp não configurado.",
            "error"
        );
        return;
    }

    let mensagem = `*NOVO PEDIDO - ${pedido.codigo}*\n\n`;
    mensagem += `*Cliente:* ${pedido.cliente.nome}\n`;
    mensagem += `*Telefone:* ${pedido.cliente.telefone}\n`;
    mensagem += `*Tipo:* ${pedido.tipoEntrega === "entrega" ? "🛵 Entrega" : "🛍️ Retirada"}\n\n`;

    if (pedido.tipoEntrega === "entrega" && pedido.endereco) {
        mensagem += `*Endereço:* ${pedido.endereco.rua}, ${pedido.endereco.numero}`;
        if (pedido.endereco.bairro) mensagem += ` - ${pedido.endereco.bairro}`;
        if (pedido.endereco.complemento) mensagem += ` (${pedido.endereco.complemento})`;
        mensagem += `\n\n`;
    }

    mensagem += `*Itens:*\n`;
    pedido.itens.forEach(item => {
        mensagem += `- ${item.quantidade}x ${item.nome}`;
        const nomeSabor = obterNomeSabor(item.sabor);
        if (nomeSabor) mensagem += ` [Sabor: ${nomeSabor}]`;
        if (item.tamanho) mensagem += ` (${item.tamanho.nome})`;
        mensagem += ` - ${formatarMoeda((item.precoUnitario ?? item.preco ?? 0) * item.quantidade)}\n`;
        
        if (item.adicionais && item.adicionais.length > 0) {
            item.adicionais.forEach(adc => {
                mensagem += `  + ${adc.nome} (${formatarMoeda(adc.preco)})\n`;
            });
        }
        
        if (item.observacao) {
            mensagem += `  _Obs: ${item.observacao}_\n`;
        }
    });

    mensagem += `\n*Resumo:*\n`;
    mensagem += `Subtotal: ${formatarMoeda(pedido.subtotal)}\n`;
    if (pedido.desconto > 0) mensagem += `Desconto: -${formatarMoeda(pedido.desconto)}\n`;
    if (pedido.taxaEntrega > 0) mensagem += `Taxa de Entrega: ${formatarMoeda(pedido.taxaEntrega)}\n`;
    mensagem += `*TOTAL: ${formatarMoeda(pedido.total)}*\n\n`;

    mensagem += `*Pagamento:* ${pedido.pagamento.charAt(0).toUpperCase() + pedido.pagamento.slice(1)}\n`;
    if (pedido.pagamento === "dinheiro" && pedido.trocoPara > 0) {
        mensagem += `Troco para: ${formatarMoeda(pedido.trocoPara)}\n`;
        mensagem += `Troco: ${formatarMoeda(pedido.troco)}\n`;
    }

    if (pedido.observacoes) {
        mensagem += `\n*Observações Gerais:*\n${pedido.observacoes}`;
    }

    const url = `https://api.whatsapp.com/send?phone=${numero.replace(/\D/g, "")}&text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
}


function fecharPedidoSucesso() {

    const modal =
        document.getElementById(
            "modalPedidoSucesso"
        );

    if (modal) {
        modal.classList.add("hidden");
    }

    verificarScrollBody();
}


/* =========================================================
   RASTREAMENTO
========================================================= */

function rastrearPedido(evento) {

    if (evento) {
        evento.preventDefault();
    }


    const input =
        document.getElementById(
            "codigoRastreio"
        );

    const resultado =
        document.getElementById(
            "resultadoRastreio"
        );


    if (!input || !resultado) {
        return;
    }


    const codigo =
        input.value
            .trim()
            .toUpperCase();


    if (!codigo) {

        mostrarToast(
            "Digite o código do pedido.",
            "error"
        );

        return;
    }


    const pedido =
        pedidos.find(
            item =>
                String(item.codigo)
                    .toUpperCase() === codigo
        );


    resultado.classList.remove(
        "hidden"
    );


    if (!pedido) {

        resultado.innerHTML = `
            <strong>
                Pedido não encontrado.
            </strong>

            <p>
                Confira o código informado e tente novamente.
            </p>
        `;

        return;
    }


    const status =
        STATUS_PEDIDO[
            pedido.status
        ] ||
        STATUS_PEDIDO.novo;


    resultado.innerHTML = `
        <strong>
            ${status.icone}
            ${escaparHTML(status.label)}
        </strong>

        <p>
            ${escaparHTML(status.descricao)}
        </p>

        <p>
            Pedido:
            <strong>
                ${escaparHTML(pedido.codigo)}
            </strong>
        </p>

        <div style="margin-top:10px; font-size:0.85rem; text-align:left;">
            ${(pedido.itens || []).map(item => {
                const nomeSabor = obterNomeSabor(item.sabor);
                return `<div>- ${item.quantidade}x ${escaparHTML(item.nome)}${nomeSabor ? ` [Sabor: ${escaparHTML(nomeSabor)}]` : ""}</div>`;
            }).join("")}
        </div>

        <p>
            Total:
            <strong>
                ${formatarMoeda(pedido.total)}
            </strong>
        </p>
    `;
}


/* =========================================================
   GALERIA
========================================================= */

function renderizarGaleria() {

    const container =
        document.getElementById(
            "listaGaleria"
        );

    const vazio =
        document.getElementById(
            "galeriaVazia"
        );

    if (!container) {
        return;
    }


    if (!galeria.length) {

        container.innerHTML = "";

        if (vazio) {
            vazio.classList.remove(
                "hidden"
            );
        }

        return;
    }


    if (vazio) {
        vazio.classList.add(
            "hidden"
        );
    }


    container.innerHTML =
        galeria.map(
            item => {
                const imagemUrl = item.imagem || item.url || "";

                if (!imagemUrl) {
                    return `
                        <div class="gallery-item">
                            <div
                                style="
                                    width:100%;
                                    height:100%;
                                    min-height:230px;
                                    display:flex;
                                    align-items:center;
                                    justify-content:center;
                                    font-size:4rem;
                                    background:var(--cream);
                                "
                            >
                                🍕
                            </div>

                            ${
                                item.titulo
                                    ? `
                                        <div class="gallery-caption">
                                            ${escaparHTML(item.titulo)}
                                        </div>
                                    `
                                    : ""
                            }
                        </div>
                    `;
                }


                return `
                    <div class="gallery-item">

                        <img
                            src="${escaparHTML(imagemUrl)}"
                            alt="${escaparHTML(
                                item.titulo ||
                                "Gran Pizza"
                            )}"
                            loading="lazy"
                        >

                        ${
                            item.titulo
                                ? `
                                    <div class="gallery-caption">
                                        ${escaparHTML(item.titulo)}
                                    </div>
                                `
                                : ""
                        }

                    </div>
                `;
            }
        ).join("");
}


/* =========================================================
   AVALIAÇÕES
========================================================= */

function renderizarAvaliacoes() {

    const container =
        document.getElementById(
            "listaAvaliacoes"
        );

    const vazio =
        document.getElementById(
            "avaliacoesVazias"
        );

    if (!container) {
        return;
    }


    const avaliacoesAtivas = avaliacoes.filter(
        avaliacao => avaliacao.ativa !== false
    );

    if (!avaliacoesAtivas.length) {

        container.innerHTML = "";

        if (vazio) {
            vazio.classList.remove(
                "hidden"
            );
        }

        return;
    }


    if (vazio) {
        vazio.classList.add(
            "hidden"
        );
    }


    container.innerHTML =
        avaliacoesAtivas
            .slice(0, 9)
            .map(
                avaliacao => {

                    const estrelas =
                        Math.min(
                            5,
                            Math.max(
                                1,
                                Number(
                                    avaliacao.nota || 5
                                )
                            )
                        );


                    return `
                        <article class="review-card">

                            <div class="review-stars">
                                ${"★".repeat(estrelas)}
                                ${"☆".repeat(5 - estrelas)}
                            </div>

                            <p>
                                “${escaparHTML(
                                    avaliacao.comentario ||
                                    "Excelente atendimento!"
                                )}”
                            </p>

                            <div class="review-author">

                                <div class="review-avatar">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                    </svg>
                                </div>

                                <div>

                                    <strong>
                                        ${escaparHTML(
                                            avaliacao.nome ||
                                            "Cliente"
                                        )}
                                    </strong>

                                    <small>
                                        Cliente Gran Pizza
                                    </small>

                                </div>

                            </div>

                        </article>
                    `;
                }
            )
            .join("");
}


/* =========================================================
   TOAST
========================================================= */

let toastTimeout = null;


function mostrarToast(
    mensagem,
    tipo = "normal"
) {

    const toast =
        document.getElementById(
            "toast"
        );

    const texto =
        document.getElementById(
            "toastMensagem"
        );


    if (!toast || !texto) {
        return;
    }


    clearTimeout(
        toastTimeout
    );


    texto.textContent =
        mensagem;


    toast.className =
        `toast show ${tipo}`;


    toastTimeout =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            3000
        );
}


/* =========================================================
   EVENTOS
========================================================= */

function configurarEventos() {

    /*
     * Menu mobile
     */
    document
        .getElementById("btnMenu")
        ?.addEventListener(
            "click",
            () => {

                document
                    .getElementById(
                        "menuNavegacao"
                    )
                    ?.classList.toggle(
                        "active"
                    );
            }
        );


    /*
     * Fechar menu ao clicar em link
     */
    document
        .querySelectorAll(
            ".nav a"
        )
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    document
                        .getElementById(
                            "menuNavegacao"
                        )
                        ?.classList.remove(
                            "active"
                        );
                }
            );
        });


    /*
     * Carrinho
     */
    document
        .getElementById(
            "btnAbrirCarrinho"
        )
        ?.addEventListener(
            "click",
            abrirCarrinho
        );


    document
        .getElementById(
            "btnFecharCarrinho"
        )
        ?.addEventListener(
            "click",
            fecharCarrinho
        );


    document
        .getElementById(
            "cartOverlay"
        )
        ?.addEventListener(
            "click",
            fecharCarrinho
        );


    /*
     * Ir para cardápio
     */
    document
        .getElementById(
            "btnIrCardapio"
        )
        ?.addEventListener(
            "click",
            () => {

                fecharCarrinho();

                document
                    .getElementById(
                        "cardapio"
                    )
                    ?.scrollIntoView({
                        behavior: "smooth"
                    });
            }
        );


    /*
     * Busca
     */
    document
        .getElementById(
            "campoBusca"
        )
        ?.addEventListener(
            "input",
            evento => {

                buscaAtual =
                    evento.target.value;

                renderizarProdutos();
            }
        );


    /*
     * Filtro de categoria
     */
    document
        .getElementById(
            "filtroCategoria"
        )
        ?.addEventListener(
            "change",
            evento => {

                selecionarCategoria(
                    evento.target.value
                );
            }
        );


    /*
     * Categorias
     */
    document.addEventListener(
        "click",
        evento => {

            const botao =
                evento.target.closest(
                    "[data-categoria]"
                );

            if (botao) {

                selecionarCategoria(
                    botao.dataset.categoria
                );

                return;
            }


            /*
             * Abrir produto
             */
            const card =
                evento.target.closest(
                    ".product-card"
                );


            if (
                card &&
                !evento.target.closest(
                    "[data-adicionar-produto]"
                )
            ) {

                abrirModalProduto(
                    card.dataset.produtoId
                );

                return;
            }


            /*
             * Adicionar direto
             */
            const adicionar =
                evento.target.closest(
                    "[data-adicionar-produto]"
                );


            if (adicionar) {

                const produto =
                    produtos.find(
                        item =>
                            item.id ===
                            adicionar.dataset
                                .adicionarProduto
                    );


                if (produto) {

                    adicionarProdutoAoCarrinho(
                        produto
                    );
                }

                return;
            }


            /*
             * Adicionar pelo modal
             */
            if (evento.target.closest("#btnConfirmarSabor")) {
                confirmarSaborProduto();
                return;
            }

            if (
                evento.target.closest(
                    "#btnAdicionarModal"
                )
            ) {

                adicionarProdutoDoModal();

                return;
            }


            /*
             * Fechar modal produto
             */
            if (evento.target.closest("#modalSabores [data-fechar-modal]")) {
                fecharModalSabores();
                return;
            }

            if (
                evento.target.closest(
                    "[data-fechar-modal]"
                )
            ) {

                fecharModalProduto();

                return;
            }


            /*
             * Fechar checkout
             */
            if (
                evento.target.closest(
                    "[data-fechar-checkout]"
                )
            ) {

                fecharCheckout();

                return;
            }


            /*
             * Remover item
             */
            const remover =
                evento.target.closest(
                    "[data-remover-carrinho]"
                );


            if (remover) {

                removerDoCarrinho(
                    remover.dataset
                        .removerCarrinho
                );

                return;
            }


            /*
             * Aumentar quantidade
             */
            const aumentar =
                evento.target.closest(
                    "[data-aumentar-carrinho]"
                );


            if (aumentar) {

                const item =
                    carrinho.find(
                        produto =>
                            produto.id ===
                            aumentar.dataset
                                .aumentarCarrinho
                    );


                if (item) {

                    alterarQuantidade(
                        item.id,
                        item.quantidade + 1
                    );
                }

                return;
            }


            /*
             * Diminuir quantidade
             */
            const diminuir =
                evento.target.closest(
                    "[data-diminuir-carrinho]"
                );


            if (diminuir) {

                const item =
                    carrinho.find(
                        produto =>
                            produto.id ===
                            diminuir.dataset
                                .diminuirCarrinho
                    );


                if (item) {

                    alterarQuantidade(
                        item.id,
                        item.quantidade - 1
                    );
                }

                return;
            }
        });


    /*
     * Finalizar pedido
     */
    document
        .getElementById(
            "btnFinalizarPedido"
        )
        ?.addEventListener(
            "click",
            abrirCheckout
        );


    /*
     * Tipo entrega
     */
    document
        .querySelectorAll(
            'input[name="tipoEntrega"]'
        )
        .forEach(input => {

            input.addEventListener(
                "change",
                () => {

                    atualizarSecaoEndereco();

                    atualizarResumoCarrinho();

                    renderizarResumoCheckout();
                }
            );
        });


    /*
     * Pagamento
     */
    document
        .querySelectorAll(
            'input[name="pagamento"]'
        )
        .forEach(input => {

            input.addEventListener(
                "change",
                () => {

                    atualizarCampoTroco();
                }
            );
        });


    /*
     * Cupom
     */
    document
        .getElementById(
            "btnAplicarCupom"
        )
        ?.addEventListener(
            "click",
            aplicarCupom
        );


    /*
     * Checkout
     */
    document
        .getElementById(
            "formCheckout"
        )
        ?.addEventListener(
            "submit",
            criarPedido
        );

    document
        .getElementById("telefoneFidelidade")
        ?.addEventListener(
            "input",
            () => renderizarFidelidade()
        );


    /*
     * Rastrear
     */
    document
        .getElementById(
            "formRastrearPedido"
        )
        ?.addEventListener(
            "submit",
            rastrearPedido
        );


    /*
     * WhatsApp
     */
    document
        .getElementById(
            "btnWhatsAppHero"
        )
        ?.addEventListener(
            "click",
            () => {

                abrirWhatsApp(
                    "Olá! Gostaria de fazer um pedido na Gran Pizza."
                );
            }
        );


    /*
     * Pedido realizado
     */
    document
        .getElementById(
            "btnFecharSucesso"
        )
        ?.addEventListener(
            "click",
            fecharPedidoSucesso
        );


    document
        .getElementById(
            "btnRastrearPedidoSucesso"
        )
        ?.addEventListener(
            "click",
            () => {

                const codigo =
                    document.getElementById(
                        "codigoPedidoGerado"
                    )?.textContent;


                fecharPedidoSucesso();

                const campo =
                    document.getElementById(
                        "codigoRastreio"
                    );


                if (campo) {

                    campo.value =
                        codigo || "";

                    document
                        .getElementById(
                            "rastrear"
                        )
                        ?.scrollIntoView({
                            behavior: "smooth"
                        });

                    setTimeout(
                        () => {
                            rastrearPedido();
                        },
                        500
                    );
                }
            }
        );


    /*
     * Meus Pedidos
     */
    document
        .getElementById("btnMeusPedidosNav")
        ?.addEventListener("click", abrirMeusPedidos);

    document
        .getElementById("btnFecharMeusPedidos")
        ?.addEventListener("click", fecharMeusPedidos);


    /*
     * Tecla ESC
     */
    document.addEventListener(
        "keydown",
        evento => {

            if (
                evento.key !== "Escape"
            ) {
                return;
            }


            fecharModalProduto();

            fecharCheckout();

            fecharPedidoSucesso();

            fecharCarrinho();

            fecharMeusPedidos();
        }
    );
}


/* =========================================================
   MEUS PEDIDOS
========================================================= */

function abrirMeusPedidos() {
    const modal = document.getElementById("modalMeusPedidos");
    if (modal) {
        modal.classList.remove("hidden");
        document.body.classList.add("no-scroll");
        renderizarMeusPedidos();
    }
}

function fecharMeusPedidos() {
    const modal = document.getElementById("modalMeusPedidos");
    if (modal) {
        modal.classList.add("hidden");
    }
    verificarScrollBody();
}

function renderizarMeusPedidos() {
    const container = document.getElementById("listaMeusPedidos");
    if (!container) return;

    if (!meusPedidos.length) {
        container.innerHTML = `
            <div class="empty-state">
                <p>Você ainda não realizou nenhum pedido.</p>
            </div>
        `;
        return;
    }

    // Filtrar pedidos reais que ainda existem no storage de pedidos global
    const pedidosReais = pedidos.filter(p => meusPedidos.includes(p.id));

    if (!pedidosReais.length) {
        container.innerHTML = `
            <div class="empty-state">
                <p>Seus pedidos anteriores não foram encontrados.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = pedidosReais.map(pedido => {
        const data = new Date(pedido.criadoEm).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });

        const statusInfo = STATUS_PEDIDO[pedido.status] || STATUS_PEDIDO.novo;

        return `
            <div class="order-item-card">
                <div class="order-item-header">
                    <span class="order-item-code">${pedido.codigo}</span>
                    <span class="order-item-status status-${pedido.status}">
                        ${statusInfo.icone} ${statusInfo.label}
                    </span>
                </div>
                
                <div class="order-item-body">
                    <small>${pedido.itens.length} ${pedido.itens.length === 1 ? 'item' : 'itens'} - ${formatarMoeda(pedido.total)}</small>
                </div>

                <div class="order-item-footer">
                    <span class="order-item-date">${data}</span>
                    <button type="button" class="btn-whatsapp-small" onclick="window.enviarWhatsAppPedido('${pedido.id}')">
                        Reenviar WhatsApp
                    </button>
                </div>
            </div>
        `;
    }).join("");
}

// Expor função global para o botão de reenviar
window.enviarWhatsAppPedido = (pedidoId) => {
    const pedido = pedidos.find(p => p.id === pedidoId);
    if (pedido) {
        enviarPedidoWhatsApp(pedido);
    }
};


/* =========================================================
   PRODUTO DO MODAL
========================================================= */

function adicionarProdutoDoModal() {

    if (!produtoSelecionado) {
        return;
    }


    const produto =
        produtoSelecionado;


    let tamanho = null;


    const tamanhoSelecionado =
        document.querySelector(
            'input[name="tamanhoProduto"]:checked'
        );


    if (
        tamanhoSelecionado &&
        produto.tamanhos?.length
    ) {

        tamanho =
            produto.tamanhos[
                Number(
                    tamanhoSelecionado.value
                )
            ];
    }


    const adicionais = [];


    document
        .querySelectorAll(
            'input[name="adicionalProduto"]:checked'
        )
        .forEach(input => {

            const adicional =
                produto.adicionais?.[
                    Number(input.value)
                ];

            if (adicional) {
                adicionais.push(
                    adicional
                );
            }
        });


    const observacao =
        document.getElementById(
            "observacaoProduto"
        )?.value.trim() || "";


    if (temOpcaoSabores(produto)) {
        fecharModalProduto();
        abrirModalSabores(produto, { tamanho, adicionais, observacao });
        return;
    }

    adicionarProdutoAoCarrinho(produto, { tamanho, adicionais, observacao });
}


/* =========================================================
   ANO DO RODAPÉ
========================================================= */

function atualizarAno() {

    const elemento =
        document.getElementById(
            "anoAtual"
        );

    if (elemento) {
        elemento.textContent =
            new Date().getFullYear();
    }
}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

function iniciarAplicacao() {

    carregarDados();

    aplicarConfiguracao();

    renderizarCategorias();

    renderizarProdutos();

    renderizarCarrinho();

    renderizarGaleria();

    renderizarAvaliacoes();

    renderizarFidelidade(
        ultimoPedido?.clienteTelefone
    );

    atualizarAno();

    configurarEventos();

    atualizarSecaoEndereco();

    atualizarOpcoesEntrega();
    atualizarCampoTroco();

    // Mostrar pedido de sucesso se foi realizado recentemente (últimos 10 min)
    if (ultimoPedido && ultimoPedido.criadoEm) {
        const agora = new Date();
        const criadoEm = new Date(ultimoPedido.criadoEm);
        const diff = (agora - criadoEm) / (1000 * 60); // min

        if (diff < 10) {
            // Buscar a versão mais recente do pedido no catálogo global para ter o status real
            const pedidoAtualizado = pedidos.find(p => p.id === ultimoPedido.id);
            mostrarPedidoSucesso(pedidoAtualizado || ultimoPedido);
        }
    }

    setInterval(
        atualizarHorarioLoja,
        10000
    );

    // Sincronização em tempo real entre abas
    window.addEventListener("storage", (e) => {
        if (e.key === STORAGE_KEYS.config) {
            config = JSON.parse(e.newValue || "{}");
            aplicarConfiguracao();
            atualizarOpcoesEntrega();
            atualizarSecaoEndereco();
            atualizarResumoCarrinho();
            renderizarResumoCheckout();
        }

        if (e.key === STORAGE_KEYS.configFidelidade) {
            configFidelidade = JSON.parse(
                e.newValue || JSON.stringify(CONFIG_FIDELIDADE_PADRAO)
            );
            renderizarFidelidade();
        }
        
        if (e.key === STORAGE_KEYS.produtos) {
            produtos = JSON.parse(e.newValue || "[]");
            renderizarProdutos();
        }

        if (e.key === STORAGE_KEYS.categorias) {
            categorias = JSON.parse(e.newValue || "[]");
            renderizarCategorias();
        }

        if (e.key === STORAGE_KEYS.avaliacoes) {
            avaliacoes = JSON.parse(e.newValue || "[]");
            renderizarAvaliacoes();
        }

        if (e.key === STORAGE_KEYS.galeria) {
            galeria = JSON.parse(e.newValue || "[]");
            renderizarGaleria();
        }

        if (e.key === STORAGE_KEYS.pedidos) {
            pedidos = JSON.parse(e.newValue || "[]");
            renderizarFidelidade();
            
            // Atualizar views de pedidos se estiverem abertas
            const modalSucesso = document.getElementById("modalPedidoSucesso");
            if (modalSucesso && !modalSucesso.classList.contains("hidden")) {
                if (ultimoPedido) {
                    const pedidoAtualizado = pedidos.find(p => p.id === ultimoPedido.id);
                    if (pedidoAtualizado) mostrarPedidoSucesso(pedidoAtualizado);
                }
            }

            const modalMeusPedidos = document.getElementById("modalMeusPedidos");
            if (modalMeusPedidos && !modalMeusPedidos.classList.contains("hidden")) {
                renderizarMeusPedidos();
            }

            // Atualizar rastreio se o código estiver preenchido
            const inputRastreio = document.getElementById("codigoRastreio");
            if (inputRastreio && inputRastreio.value) {
                rastrearPedido();
            }
        }
    });
}


if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        iniciarAplicacao
    );

} else {

    iniciarAplicacao();
}
