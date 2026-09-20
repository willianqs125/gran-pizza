/* =========================================================
   GRAN PIZZA — PAINEL ADMINISTRATIVO
   admin/script.js
========================================================= */

(() => {
    "use strict";

    /* =====================================================
       CONFIGURAÇÕES
    ===================================================== */

    const STORAGE_KEYS = {
        produtos: "produtosBuenaPizza",
        carrinho: "carrinhoBuenaPizza",
        pedidos: "pedidosBuenaPizza",
        cupons: "cuponsBuenaPizza",
        categorias: "categoriasBuenaPizza",
        config: "configBuenaPizza",
        galeria: "galeriaBuenaPizza",
        avaliacoes: "avaliacoesBuenaPizza",
        adminLogado: "adminLogado",
        fidelidade: "fidelidadeBuenaPizza",
        configFidelidade: "configFidelidadeBuenaPizza"
    };

    const CONFIG_FIDELIDADE_PADRAO = {
        ativa: true,
        meta: 5,
        premio: "1 Pizza G grátis"
    };

    const STATUS_PEDIDO = {
        novo: "Recebido",
        recebido: "Recebido",
        confirmado: "Confirmado",
        preparando: "Preparando",
        saiu_entrega: "Saiu para entrega",
        pronto: "Pronto para retirada",
        entregue: "Entregue",
        cancelado: "Cancelado"
    };


    /* =====================================================
       ELEMENTOS
    ===================================================== */

    const $ = (selector) => document.querySelector(selector);

    const $$ = (selector) => [
        ...document.querySelectorAll(selector)
    ];


    /* =====================================================
       UTILITÁRIOS
    ===================================================== */

    function lerStorage(chave, padrao = []) {
        try {
            const valor = localStorage.getItem(chave);

            if (!valor) {
                return padrao;
            }

            const dados = JSON.parse(valor);

            return dados ?? padrao;
        } catch (erro) {
            console.error(
                `Erro ao ler ${chave}:`,
                erro
            );

            return padrao;
        }
    }


    function salvarStorage(chave, dados) {
        localStorage.setItem(
            chave,
            JSON.stringify(dados)
        );
    }


    function dinheiro(valor) {
        return Number(valor || 0).toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );
    }


    function escapeHTML(valor) {
        return String(valor ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function gerarId(prefixo = "id") {
        return `${prefixo}_${Date.now()}_${Math.random()
            .toString(36)
            .substring(2, 8)}`;
    }


    function dataFormatada(data) {
        if (!data) {
            return "-";
        }

        const dataObj = new Date(data);

        if (Number.isNaN(dataObj.getTime())) {
            return "-";
        }

        return dataObj.toLocaleString(
            "pt-BR",
            {
                dateStyle: "short",
                timeStyle: "short"
            }
        );
    }


    function somenteData(data) {
        if (!data) {
            return "";
        }

        const dataObj = new Date(data);

        if (Number.isNaN(dataObj.getTime())) {
            return "";
        }

        return dataObj.toISOString().split("T")[0];
    }


    function obterProdutos() {
        return lerStorage(
            STORAGE_KEYS.produtos,
            []
        );
    }


    function obterPedidos() {
        return lerStorage(
            STORAGE_KEYS.pedidos,
            []
        );
    }


    function obterCategorias() {
        return lerStorage(
            STORAGE_KEYS.categorias,
            []
        );
    }


    function obterCupons() {
        return lerStorage(
            STORAGE_KEYS.cupons,
            []
        );
    }


    function obterGaleria() {
        return lerStorage(
            STORAGE_KEYS.galeria,
            []
        );
    }


    function obterAvaliacoes() {
        return lerStorage(
            STORAGE_KEYS.avaliacoes,
            []
        );
    }


    function obterFidelidade() {
        return lerStorage(
            STORAGE_KEYS.fidelidade,
            {}
        );
    }


    function obterConfigFidelidade() {
        return lerStorage(
            STORAGE_KEYS.configFidelidade,
            CONFIG_FIDELIDADE_PADRAO
        );
    }


    function obterConfig() {
        return lerStorage(
            STORAGE_KEYS.config,
            {}
        );
    }


    function normalizarTelefoneFidelidade(telefone) {
        let telefoneLimpo = String(telefone || "").replace(/\D/g, "");

        if (
            telefoneLimpo.startsWith("55") &&
            (telefoneLimpo.length === 12 || telefoneLimpo.length === 13)
        ) {
            telefoneLimpo = telefoneLimpo.slice(2);
        }

        return telefoneLimpo;
    }


    function produtoEhPizzaFidelidade(produto, item) {
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


    function contarPizzasFidelidade(pedido, produtos) {
        if (!Array.isArray(pedido?.itens)) {
            return 0;
        }

        return pedido.itens.reduce((total, item) => {
            const produto = produtos.find(
                produtoAtual =>
                    String(produtoAtual.id) === String(item.produtoId)
            );

            if (!produtoEhPizzaFidelidade(produto, item)) {
                return total;
            }

            return total + Number(item.quantidade || 0);
        }, 0);
    }


    function obterClientesFidelidade() {
        const pedidos = obterPedidos();
        const produtos = obterProdutos();
        const ajustes = obterFidelidade();
        const config = obterConfigFidelidade();
        const meta = Math.max(1, Number(config.meta || 5));
        const fidelidadeAtiva = config.ativa !== false;
        const clientes = {};

        pedidos.forEach(pedido => {
            const telefone = normalizarTelefoneFidelidade(
                pedido.clienteTelefone || pedido.cliente?.telefone
            );

            if (!telefone) {
                return;
            }

            const cliente = clientes[telefone] || {
                telefone,
                nome: pedido.cliente?.nome || pedido.nomeCliente || "Cliente",
                pizzasPedidos: 0,
                ultimoPedido: null
            };

            if (pedido.cliente?.nome || pedido.nomeCliente) {
                cliente.nome = pedido.cliente?.nome || pedido.nomeCliente;
            }

            if (pedido.status !== "cancelado") {
                cliente.pizzasPedidos += contarPizzasFidelidade(
                    pedido,
                    produtos
                );
            }

            const dataPedido = new Date(pedido.criadoEm || pedido.data || 0);
            const dataAtual = cliente.ultimoPedido
                ? new Date(cliente.ultimoPedido)
                : new Date(0);

            if (dataPedido > dataAtual) {
                cliente.ultimoPedido = pedido.criadoEm || pedido.data;
            }

            clientes[telefone] = cliente;
        });

        Object.keys(ajustes).forEach(telefone => {
            const telefoneNormalizado = normalizarTelefoneFidelidade(telefone);
            const ajuste = ajustes[telefone] || {};

            if (!clientes[telefoneNormalizado]) {
                clientes[telefoneNormalizado] = {
                    telefone: telefoneNormalizado,
                    nome: ajuste.nome || "Cliente",
                    pizzasPedidos: 0,
                    ultimoPedido: null
                };
            }
        });

        return Object.values(clientes).map(cliente => {
            const ajuste = ajustes[cliente.telefone] || {};
            const pizzas = Math.max(
                0,
                cliente.pizzasPedidos + Number(ajuste.pizzasCorrigidas || 0)
            );
            const premiosGanhos = fidelidadeAtiva
                ? Math.floor(pizzas / meta)
                : 0;
            const premios = Math.max(
                0,
                premiosGanhos + Number(ajuste.premiosCorrigidos || 0) -
                    Number(ajuste.premiosResgatados || 0)
            );

            return {
                ...cliente,
                pizzas,
                progresso: fidelidadeAtiva ? pizzas % meta : 0,
                meta,
                premios: fidelidadeAtiva ? premios : 0,
                ativa: fidelidadeAtiva,
                historico: Array.isArray(ajuste.historico)
                    ? ajuste.historico
                    : []
            };
        });
    }


    function obterClienteFidelidade(telefone) {
        return obterClientesFidelidade().find(
            cliente => cliente.telefone === normalizarTelefoneFidelidade(telefone)
        );
    }


    function salvarAjusteFidelidade(telefone, alteracao) {
        const dados = obterFidelidade();
        const telefoneNormalizado = normalizarTelefoneFidelidade(telefone);
        const atual = dados[telefoneNormalizado] || {};

        dados[telefoneNormalizado] = {
            ...atual,
            ...alteracao
        };

        salvarStorage(STORAGE_KEYS.fidelidade, dados);
    }


    function renderizarFidelidadeAdmin() {
        const container = $("#listaFidelidade");

        if (!container) {
            return;
        }

        const busca = (
            $("#buscaFidelidade")?.value || ""
        ).trim().toLowerCase();
        const clientes = obterClientesFidelidade().filter(cliente =>
            !busca ||
            cliente.nome.toLowerCase().includes(busca) ||
            cliente.telefone.includes(busca.replace(/\D/g, ""))
        );

        container.innerHTML = clientes.length
            ? clientes.map(cliente => `
                <tr>
                    <td>${escapeHTML(cliente.nome)}</td>
                    <td>${escapeHTML(cliente.telefone)}</td>
                    <td>${cliente.pizzas}</td>
                    <td>${cliente.premios}</td>
                    <td>${cliente.ultimoPedido ? dataFormatada(cliente.ultimoPedido) : "-"}</td>
                    <td>
                        <button type="button" class="btn btn-small btn-secondary" data-fidelidade-cliente="${escapeHTML(cliente.telefone)}">
                            Gerenciar
                        </button>
                    </td>
                </tr>
            `).join("")
            : `<tr><td colspan="6">Nenhum cliente com telefone encontrado.</td></tr>`;
    }


    function renderizarDetalheFidelidade() {
        const detalhe = $("#detalheFidelidade");
        const cliente = obterClienteFidelidade(clienteFidelidadeSelecionado);

        if (!detalhe || !cliente) {
            detalhe?.classList.add("hidden");
            return;
        }

        detalhe.classList.remove("hidden");
        $("#fidelidadeClienteNome").textContent = cliente.nome;
        $("#fidelidadeClienteTelefone").textContent = cliente.telefone;
        $("#fidelidadeTotalPizzas").textContent = `${cliente.pizzas} pizzas compradas`;
        $("#fidelidadeProgresso").textContent = `${cliente.progresso}/${cliente.meta} até a próxima recompensa`;
        $("#fidelidadeTotalPremios").textContent = `${cliente.premios} recompensas disponíveis`;
        $("#fidelidadeBarraProgresso").style.width = `${cliente.progresso / cliente.meta * 100}%`;
        $("#historicoFidelidade").textContent = cliente.historico.length
            ? `Último resgate: ${dataFormatada(cliente.historico[cliente.historico.length - 1].em)}`
            : "Nenhum resgate registrado.";
    }


    function abrirDetalheFidelidade(telefone) {
        clienteFidelidadeSelecionado = normalizarTelefoneFidelidade(telefone);
        renderizarDetalheFidelidade();
    }


    function ajustarFidelidade(tipo, valor) {
        const cliente = obterClienteFidelidade(clienteFidelidadeSelecionado);

        if (!cliente) {
            return;
        }

        const campo = tipo === "pizza"
            ? "pizzasCorrigidas"
            : "premiosCorrigidos";
        const ajustes = obterFidelidade();
        const atual = ajustes[cliente.telefone] || {};

        salvarAjusteFidelidade(cliente.telefone, {
            [campo]: Number(atual[campo] || 0) + Number(valor)
        });
        renderizarFidelidadeAdmin();
        renderizarDetalheFidelidade();
    }


    function resgatarFidelidade() {
        const cliente = obterClienteFidelidade(clienteFidelidadeSelecionado);

        if (!cliente || cliente.premios < 1) {
            mostrarToast("Este cliente não possui recompensa disponível.", "error");
            return;
        }

        const ajustes = obterFidelidade();
        const atual = ajustes[cliente.telefone] || {};
        const historico = Array.isArray(atual.historico)
            ? atual.historico
            : [];

        historico.push({
            tipo: "resgate",
            em: new Date().toISOString(),
            premio: obterConfigFidelidade().premio
        });

        salvarAjusteFidelidade(cliente.telefone, {
            premiosResgatados: Number(atual.premiosResgatados || 0) + 1,
            historico
        });
        renderizarFidelidadeAdmin();
        renderizarDetalheFidelidade();
        mostrarToast("Recompensa resgatada.", "success");
    }


    function salvarConfiguracaoFidelidade(evento) {
        evento.preventDefault();

        const config = {
            ativa: $("#fidelidadeAtiva").checked,
            meta: Math.max(1, Number($("#fidelidadeMeta").value || 5)),
            premio: $("#fidelidadePremio").value.trim() || "1 Pizza G grátis"
        };

        salvarStorage(STORAGE_KEYS.configFidelidade, config);
        renderizarFidelidadeAdmin();
        renderizarDetalheFidelidade();
        mostrarToast("Configuração de fidelidade salva.", "success");
    }


    function carregarConfiguracaoFidelidade() {
        const config = obterConfigFidelidade();

        if ($("#fidelidadeAtiva")) {
            $("#fidelidadeAtiva").checked = config.ativa !== false;
        }
        if ($("#fidelidadeMeta")) {
            $("#fidelidadeMeta").value = Number(config.meta || 5);
        }
        if ($("#fidelidadePremio")) {
            $("#fidelidadePremio").value = config.premio || "1 Pizza G grátis";
        }
    }


    function configurarFidelidade() {
        $("#formConfigFidelidade")?.addEventListener(
            "submit",
            salvarConfiguracaoFidelidade
        );
        $("#buscaFidelidade")?.addEventListener(
            "input",
            renderizarFidelidadeAdmin
        );
        $("#listaFidelidade")?.addEventListener("click", evento => {
            const botao = evento.target.closest("[data-fidelidade-cliente]");
            if (botao) {
                abrirDetalheFidelidade(botao.dataset.fidelidadeCliente);
            }
        });
        $("#detalheFidelidade")?.addEventListener("click", evento => {
            const ajuste = evento.target.closest("[data-ajuste-fidelidade]");
            if (ajuste) {
                ajustarFidelidade(
                    ajuste.dataset.ajusteFidelidade,
                    Number(ajuste.dataset.valor)
                );
            }
        });
        $("#btnResgatarFidelidade")?.addEventListener(
            "click",
            resgatarFidelidade
        );
        $("#btnFecharDetalheFidelidade")?.addEventListener(
            "click",
            () => $("#detalheFidelidade")?.classList.add("hidden")
        );
    }


    /* =====================================================
       TOAST
    ===================================================== */

    let toastTimer = null;
    let clienteFidelidadeSelecionado = "";

    function mostrarToast(
        mensagem,
        tipo = "normal"
    ) {
        const toast = $("#toastAdmin");
        const texto = $("#toastAdminMensagem");

        if (!toast || !texto) {
            return;
        }

        texto.textContent = mensagem;

        toast.classList.remove(
            "show",
            "success",
            "error"
        );

        if (tipo === "success") {
            toast.classList.add("success");
        }

        if (tipo === "error") {
            toast.classList.add("error");
        }

        requestAnimationFrame(() => {
            toast.classList.add("show");
        });

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
    }


    /* =====================================================
       LIMPEZA DE DADOS LEGADOS (PASTEL)
    ===================================================== */

    function limparDadosPastel() {
        return;
    }


    /* =====================================================
       LOGIN
    ===================================================== */

    function verificarLogin() {
        // Limpeza de dados de pastel legados no localStorage
        limparDadosPastel();

        const logado = localStorage.getItem(
            STORAGE_KEYS.adminLogado
        );

        const telaLogin = $("#telaLogin");
        const painelAdmin = $("#painelAdmin");

        if (!telaLogin || !painelAdmin) {
            return;
        }

        if (logado === "true") {
            telaLogin.classList.add("hidden");
            painelAdmin.classList.remove("hidden");

            inicializarPainel();
        } else {
            telaLogin.classList.remove("hidden");
            painelAdmin.classList.add("hidden");
        }
    }


    function configurarLogin() {
        const form = $("#formLogin");

        if (!form) {
            return;
        }

        form.addEventListener(
            "submit",
            (evento) => {
                evento.preventDefault();

                const usuario = (
                    $("#loginUsuario")?.value || ""
                ).trim();

                const senha = (
                    $("#loginSenha")?.value || ""
                ).trim();

                const mensagem = $("#mensagemLogin");

                /*
                 * Login local do protótipo.
                 * Em produção, deve ser substituído
                 * por autenticação real no backend.
                 */

                if (
                    usuario === "admin" &&
                    senha === "1234"
                ) {
                    localStorage.setItem(
                        STORAGE_KEYS.adminLogado,
                        "true"
                    );

                    if (mensagem) {
                        mensagem.textContent = "";
                    }

                    verificarLogin();

                    mostrarToast(
                        "Login realizado com sucesso.",
                        "success"
                    );
                } else {
                    if (mensagem) {
                        mensagem.textContent =
                            "Usuário ou senha incorretos.";
                    }
                }
            }
        );
    }


    function fazerLogout() {
        localStorage.removeItem(
            STORAGE_KEYS.adminLogado
        );

        window.location.reload();
    }


    /* =====================================================
       NAVEGAÇÃO
    ===================================================== */

    const nomesSecoes = {
        dashboard: {
            titulo: "Dashboard",
            subtitulo:
                "Visão geral da sua pizzaria"
        },

        relatorios: {
            titulo: "Relatórios",
            subtitulo:
                "Analise o desempenho da Gran Pizza"
        },

        pedidos: {
            titulo: "Pedidos",
            subtitulo:
                "Gerencie os pedidos realizados"
        },

        produtos: {
            titulo: "Produtos",
            subtitulo:
                "Gerencie o cardápio"
        },

        categorias: {
            titulo: "Categorias",
            subtitulo:
                "Organize seu cardápio"
        },

        cupons: {
            titulo: "Cupons",
            subtitulo:
                "Gerencie promoções e descontos"
        },

        galeria: {
            titulo: "Galeria",
            subtitulo:
                "Gerencie as imagens da loja"
        },

        avaliacoes: {
            titulo: "Avaliações",
            subtitulo:
                "Gerencie avaliações dos clientes"
        },
        
        fidelidade: {
            titulo: "Fidelidade",
            subtitulo:
                "Gerencie o programa de fidelidade e prêmios"
        },

        configuracoes: {
            titulo: "Configurações",
            subtitulo:
                "Configure sua pizzaria"
        },

        backup: {
            titulo: "Backup",
            subtitulo:
                "Exporte ou restaure os dados"
        }
    };


    function abrirSecao(nome) {
        const secoes = {
            dashboard: "#secaoDashboard",
            relatorios: "#secaoRelatorios",
            pedidos: "#secaoPedidos",
            produtos: "#secaoProdutos",
            categorias: "#secaoCategorias",
            cupons: "#secaoCupons",
            galeria: "#secaoGaleria",
            avaliacoes: "#secaoAvaliacoes",
            fidelidade: "#secaoFidelidade",
            configuracoes: "#secaoConfiguracoes",
            backup: "#secaoBackup"
        };

        const alvo = secoes[nome];

        if (!alvo) {
            return;
        }

        $$(".admin-section").forEach(
            (secao) => {
                secao.classList.remove("active");
            }
        );

        $(alvo)?.classList.add("active");

        $$(".nav-item").forEach(
            (item) => {
                item.classList.toggle(
                    "active",
                    item.dataset.secao === nome
                );
            }
        );

        const info =
            nomesSecoes[nome] ||
            nomesSecoes.dashboard;

        if ($("#tituloSecao")) {
            $("#tituloSecao").textContent =
                info.titulo;
        }

        if ($("#subtituloSecao")) {
            $("#subtituloSecao").textContent =
                info.subtitulo;
        }

        fecharSidebarMobile();

        if (nome === "dashboard") {
            renderizarDashboard();
        }

        if (nome === "pedidos") {
            renderizarPedidos();
        }

        if (nome === "relatorios") {
            renderizarRelatorios();
        }

        if (nome === "produtos") {
            renderizarProdutosAdmin();
            preencherFiltroCategorias();
        }

        if (nome === "categorias") {
            renderizarCategoriasAdmin();
        }

        if (nome === "cupons") {
            renderizarCuponsAdmin();
        }

        if (nome === "galeria") {
            renderizarGaleriaAdmin();
        }

        if (nome === "avaliacoes") {
            renderizarAvaliacoesAdmin();
        }

        if (nome === "fidelidade") {
            carregarConfiguracaoFidelidade();
            renderizarFidelidadeAdmin();
            renderizarDetalheFidelidade();
        }

        if (nome === "configuracoes") {
            carregarConfiguracoes();
        }
    }


    function configurarNavegacao() {
        $$(".nav-item").forEach(
            (botao) => {
                botao.addEventListener(
                    "click",
                    () => {
                        abrirSecao(
                            botao.dataset.secao
                        );
                    }
                );
            }
        );

        $$("[data-secao]").forEach(
            (botao) => {
                if (
                    botao.classList.contains(
                        "nav-item"
                    )
                ) {
                    return;
                }

                botao.addEventListener(
                    "click",
                    () => {
                        abrirSecao(
                            botao.dataset.secao
                        );
                    }
                );
            }
        );
    }


    /* =====================================================
       SIDEBAR MOBILE
    ===================================================== */

    function abrirSidebarMobile() {
        $("#sidebarAdmin")
            ?.classList.add("open");
    }


    function fecharSidebarMobile() {
        $("#sidebarAdmin")
            ?.classList.remove("open");
    }


    function configurarSidebar() {
        $("#btnAbrirSidebar")
            ?.addEventListener(
                "click",
                abrirSidebarMobile
            );

        $("#btnFecharSidebar")
            ?.addEventListener(
                "click",
                fecharSidebarMobile
            );
    }


    /* =====================================================
       DASHBOARD
    ===================================================== */

    let filtroRelatorioAtual = "hoje";

    function renderizarDashboard() {
        const produtos = obterProdutos();
        const pedidos = obterPedidos();

        const faturamento = pedidos
            .filter(
                (pedido) =>
                    pedido.status !== "cancelado"
            )
            .reduce(
                (
                    total,
                    pedido
                ) =>
                    total +
                    Number(
                        pedido.total || 0
                    ),
                0
            );

        const pendentes = pedidos.filter(
            (pedido) =>
                ![
                    "entregue",
                    "cancelado"
                ].includes(
                    pedido.status
                )
        ).length;


        if ($("#dashboardTotalPedidos")) {
            $("#dashboardTotalPedidos")
                .textContent =
                pedidos.length;
        }


        if ($("#dashboardFaturamento")) {
            $("#dashboardFaturamento")
                .textContent =
                dinheiro(faturamento);
        }


        if ($("#dashboardTotalProdutos")) {
            $("#dashboardTotalProdutos")
                .textContent =
                produtos.length;
        }


        if ($("#dashboardPedidosPendentes")) {
            $("#dashboardPedidosPendentes")
                .textContent =
                pendentes;
        }


        renderizarPedidosRecentes(
            pedidos
        );

        renderizarEstoqueDashboard(
            produtos
        );

        atualizarStatusLojaAdmin();

        // Atualiza relatórios se a seção estiver ativa
        if ($("#secaoRelatorios")?.classList.contains("active")) {
            renderizarRelatorios(filtroRelatorioAtual);
        }
    }


    function renderizarRelatorios(periodo = "hoje") {
        filtroRelatorioAtual = periodo;
        const pedidos = obterPedidos();
        const agora = new Date();

        // Filtra pedidos válidos (não cancelados) para faturamento e métricas gerais
        const pedidosValidos = pedidos.filter(
            (pedido) => pedido.status !== "cancelado"
        );

        // Função robusta para verificar se uma data pertence ao período
        const filtrarPorPeriodo = (lista, p) => {
            return lista.filter((item) => {
                const dataRaw = item.criadoEm || item.data;
                if (!dataRaw) return false;

                const dataItem = new Date(dataRaw);
                if (isNaN(dataItem.getTime())) return false;

                if (p === "hoje") {
                    return dataItem.toDateString() === agora.toDateString();
                }

                if (p === "semana") {
                    // Início da semana (Segunda-feira)
                    const dia = agora.getDay();
                    const diff = dia === 0 ? -6 : 1 - dia;
                    const inicioSemana = new Date(agora);
                    inicioSemana.setDate(agora.getDate() + diff);
                    inicioSemana.setHours(0, 0, 0, 0);

                    const fimSemana = new Date(inicioSemana);
                    fimSemana.setDate(inicioSemana.getDate() + 7);

                    return dataItem >= inicioSemana && dataItem < fimSemana;
                }

                if (p === "mes") {
                    return (
                        dataItem.getMonth() === agora.getMonth() &&
                        dataItem.getFullYear() === agora.getFullYear()
                    );
                }

                return false;
            });
        };

        const pedidosFiltrados = filtrarPorPeriodo(pedidosValidos, periodo);
        const todosPedidosPeriodo = filtrarPorPeriodo(pedidos, periodo);

        // UI: Mostrar/Ocultar conteúdo vazio
        const relatorioConteudo = $("#relatorioConteudo");
        const relatorioVazio = $("#relatorioVazio");

        if (!todosPedidosPeriodo.length) {
            relatorioConteudo?.classList.add("hidden");
            relatorioVazio?.classList.remove("hidden");
        } else {
            relatorioConteudo?.classList.remove("hidden");
            relatorioVazio?.classList.add("hidden");
        }

        // Cálculos Gerais (mesmo se vazio, para zerar a UI se necessário)
        const faturamento = pedidosFiltrados.reduce(
            (total, pedido) => total + Number(pedido.total || 0),
            0
        );

        const totalPedidos = pedidosFiltrados.length;

        const totalProdutos = pedidosFiltrados.reduce((total, pedido) => {
            const itens = Array.isArray(pedido.itens) ? pedido.itens : [];
            return (
                total +
                itens.reduce(
                    (subtotal, item) =>
                        subtotal + Number(item.quantidade || 1),
                    0
                )
            );
        }, 0);

        const ticketMedio = totalPedidos > 0 ? faturamento / totalPedidos : 0;

        // Produto mais vendido
        const contagemProdutos = {};
        pedidosFiltrados.forEach((pedido) => {
            const itens = Array.isArray(pedido.itens) ? pedido.itens : [];
            itens.forEach((item) => {
                const nome = item.nome || "Produto";
                contagemProdutos[nome] = (contagemProdutos[nome] || 0) + Number(item.quantidade || 1);
            });
        });

        const rankingProdutos = Object.entries(contagemProdutos)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        // Pedidos por Status (considera todos os pedidos do período, inclusive cancelados)
        const contagemStatus = {};
        todosPedidosPeriodo.forEach((pedido) => {
            const status = pedido.status || "recebido";
            contagemStatus[status] = (contagemStatus[status] || 0) + 1;
        });

        // Atualiza UI de métricas
        if ($("#relatorioFaturamento")) $("#relatorioFaturamento").textContent = dinheiro(faturamento);
        if ($("#relatorioTotalPedidos")) $("#relatorioTotalPedidos").textContent = totalPedidos;
        if ($("#relatorioTotalProdutos")) $("#relatorioTotalProdutos").textContent = totalProdutos;
        if ($("#relatorioTicketMedio")) $("#relatorioTicketMedio").textContent = dinheiro(ticketMedio);

        // Renderiza Produto Mais Vendido
        const containerProduto = $("#relatorioProdutoMaisVendido");
        if (containerProduto) {
            if (rankingProdutos.length) {
                containerProduto.innerHTML = rankingProdutos.map(([nome, qtd]) => `
                    <div class="stat-item">
                        <span>${nome}</span>
                        <strong>${qtd} un</strong>
                    </div>
                `).join("");
            } else {
                containerProduto.innerHTML = '<p class="empty-list">Nenhum produto vendido</p>';
            }
        }

        // Renderiza Pedidos por Status
        const containerStatus = $("#relatorioPedidosPorStatus");
        if (containerStatus) {
            const statuses = Object.entries(contagemStatus).sort((a, b) => b[1] - a[1]);
            if (statuses.length) {
                containerStatus.innerHTML = statuses.map(([status, qtd]) => `
                    <div class="stat-item">
                        <span>${STATUS_PEDIDO[status] || status}</span>
                        <strong>${qtd}</strong>
                    </div>
                `).join("");
            } else {
                containerStatus.innerHTML = '<p class="empty-list">Nenhum pedido registrado</p>';
            }
        }

        // Atualiza botões de filtro
        $$("[data-filtro-relatorio]").forEach((btn) => {
            if (btn.dataset.filtroRelatorio === periodo) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });
    }


    function renderizarPedidosRecentes(
        pedidos
    ) {
        const container =
            $("#dashboardPedidosRecentes");

        if (!container) {
            return;
        }

        const recentes = [...pedidos]
            .sort(
                (a, b) =>
                    new Date(
                        b.criadoEm ||
                        b.data ||
                        0
                    ) -
                    new Date(
                        a.criadoEm ||
                        a.data ||
                        0
                    )
            )
            .slice(0, 5);

        if (!recentes.length) {
            container.innerHTML = `
                <div class="empty-state">
                    <span>🧾</span>
                    <h3>Nenhum pedido</h3>
                    <p>
                        Ainda não existem pedidos.
                    </p>
                </div>
            `;

            return;
        }

        container.innerHTML =
            recentes.map(
                (pedido) => `
                    <div class="crud-item">

                        <div class="crud-info">

                            <strong>
                                ${escapeHTML(
                                    pedido.codigo ||
                                    "Pedido"
                                )}
                            </strong>

                            <small>
                                ${escapeHTML(
                                    pedido.cliente
                                        ?.nome ||
                                    pedido.nomeCliente ||
                                    "Cliente"
                                )}
                                ·
                                ${dinheiro(
                                    pedido.total
                                )}
                            </small>

                        </div>

                        <span class="badge ${classeStatus(
                            pedido.status
                        )}">
                            ${escapeHTML(
                                STATUS_PEDIDO[
                                    pedido.status
                                ] ||
                                pedido.status ||
                                "Recebido"
                            )}
                        </span>

                    </div>
                `
            ).join("");
    }


    function renderizarEstoqueDashboard(
        produtos
    ) {
        const container =
            $("#dashboardEstoque");

        if (!container) {
            return;
        }

        if (!produtos.length) {
            container.innerHTML = `
                <div class="empty-state">
                    <span>🍕</span>
                    <h3>Nenhum produto</h3>
                </div>
            `;

            return;
        }

        const produtosEstoque = produtos
            .map((produto) => ({
                ...produto,
                estoqueNumero:
                    Number(
                        produto.estoque ??
                        produto.quantidadeEstoque ??
                        0
                    )
            }))
            .sort(
                (a, b) =>
                    a.estoqueNumero -
                    b.estoqueNumero
            )
            .slice(0, 6);

        container.innerHTML =
            produtosEstoque.map(
                (produto) => {

                    const estoque =
                        produto.estoqueNumero;

                    let classe =
                        "badge-green";

                    let texto =
                        "Disponível";

                    if (estoque <= 0) {
                        classe =
                            "badge-danger";

                        texto =
                            "Esgotado";
                    } else if (estoque <= 5) {
                        classe =
                            "badge-yellow";

                        texto =
                            "Pouco estoque";
                    }

                    return `
                        <div class="crud-item">

                            <div class="crud-info">

                                <strong>
                                    ${escapeHTML(
                                        produto.nome
                                    )}
                                </strong>

                                <small>
                                    ${estoque}
                                    unidade(s)
                                </small>

                            </div>

                            <span class="badge ${classe}">
                                ${texto}
                            </span>

                        </div>
                    `;
                }
            ).join("");
    }


    function atualizarStatusLojaAdmin() {
        const config = obterConfig();

        const agora = new Date();
        const diaSemana = agora.getDay();

        const dias = [
            "domingo",
            "segunda",
            "terca",
            "quarta",
            "quinta",
            "sexta",
            "sabado"
        ];

        const nomeDia = dias[diaSemana];

        const horarios =
            config.horarios ||
            {};

        const horario =
            horarios[nomeDia];

        let aberta = false;

        if (
            horario &&
            horario.abertura &&
            horario.fechamento
        ) {
            const minutosAtuais = agora.getHours() * 60 + agora.getMinutes();

            const horaParaMinutos = (h) => {
                if (!h) return 0;
                const [hrs, mins] = h.split(":").map(Number);
                return hrs * 60 + mins;
            };

            const aberturaMin = horaParaMinutos(horario.abertura);
            const fechamentoMin = horaParaMinutos(horario.fechamento);

            if (fechamentoMin <= aberturaMin) {
                // Atravessa a meia-noite
                aberta = minutosAtuais >= aberturaMin || minutosAtuais < fechamentoMin;
            } else {
                // Horário normal
                aberta = minutosAtuais >= aberturaMin && minutosAtuais < fechamentoMin;
            }
        }

        const elemento =
            $("#statusLojaAdmin");

        if (!elemento) {
            return;
        }

        elemento.textContent = aberta
            ? "● Loja aberta"
            : "● Loja fechada";

        elemento.style.background =
            aberta
                ? "var(--green-light)"
                : "var(--red-light)";

        elemento.style.color =
            aberta
                ? "var(--green)"
                : "var(--red)";
    }


    /* =====================================================
       STATUS DOS PEDIDOS
    ===================================================== */

    function classeStatus(status) {
        switch (status) {
            case "novo":
            case "recebido":
                return "badge-blue";

            case "confirmado":
                return "badge-blue";

            case "preparando":
                return "badge-yellow";

            case "saiu_entrega":
                return "badge-blue";

            case "pronto":
                return "badge-yellow";

            case "entregue":
                return "badge-green";

            case "cancelado":
                return "badge-danger";

            default:
                return "badge-gray";
        }
    }


    /* =====================================================
       PEDIDOS
    ===================================================== */

    function renderizarPedidos() {
        const container =
            $("#listaPedidos");

        if (!container) {
            return;
        }

        let pedidos =
            obterPedidos();

        const busca =
            (
                $("#buscaPedidos")
                    ?.value ||
                ""
            )
                .trim()
                .toLowerCase();

        const status =
            $("#filtroStatusPedido")
                ?.value ||
            "";

        const periodo =
            $("#filtroPeriodoPedidos")
                ?.value ||
            "todos";


        if (busca) {
            pedidos =
                pedidos.filter(
                    (pedido) => {

                        const texto = [
                            pedido.codigo,
                            pedido.nomeCliente,
                            pedido.cliente?.nome,
                            pedido.telefoneCliente,
                            pedido.cliente?.telefone,
                            pedido.telefone
                        ]
                            .filter(Boolean)
                            .join(" ")
                            .toLowerCase();

                        return texto.includes(
                            busca
                        );
                    }
                );
        }


        if (status) {
            pedidos =
                pedidos.filter(
                    (pedido) =>
                        pedido.status ===
                        status
                );
        }


        pedidos =
            filtrarPeriodo(
                pedidos,
                periodo
            );


        pedidos.sort(
            (a, b) =>
                new Date(
                    b.criadoEm ||
                    b.data ||
                    0
                ) -
                new Date(
                    a.criadoEm ||
                    a.data ||
                    0
                )
        );


        const vazio =
            $("#pedidosVazios");

        if (!pedidos.length) {
            container.innerHTML = "";

            vazio?.classList.remove(
                "hidden"
            );

            return;
        }

        vazio?.classList.add(
            "hidden"
        );


        container.innerHTML =
            pedidos.map(
                (pedido) =>
                    criarPedidoHTML(
                        pedido
                    )
            ).join("");
    }


    function filtrarPeriodo(
        pedidos,
        periodo
    ) {
        if (
            !periodo ||
            periodo === "todos"
        ) {
            return pedidos;
        }

        const agora =
            new Date();

        const inicio =
            new Date();

        if (periodo === "hoje") {
            inicio.setHours(
                0,
                0,
                0,
                0
            );
        }

        if (periodo === "7dias") {
            inicio.setDate(
                inicio.getDate() - 7
            );
        }

        if (periodo === "mes") {
            inicio.setDate(1);
            inicio.setHours(
                0,
                0,
                0,
                0
            );
        }

        return pedidos.filter(
            (pedido) => {

                const data = new Date(
                    pedido.criadoEm ||
                    pedido.data ||
                    0
                );

                return (
                    data >= inicio &&
                    data <= agora
                );
            }
        );
    }


    function criarPedidoHTML(
        pedido
    ) {
        const nome =
            pedido.cliente?.nome ||
            pedido.nomeCliente ||
            "Cliente";

        const telefone =
            pedido.cliente?.telefone ||
            pedido.telefoneCliente ||
            pedido.telefone ||
            "";

        const itens =
            pedido.itens ||
            pedido.produtos ||
            [];

        const quantidade =
            itens.reduce(
                (total, item) =>
                    total +
                    Number(
                        item.quantidade ||
                        item.qtd ||
                        1
                    ),
                0
            );


        return `
            <article
                class="pedido-admin"
                data-pedido-id="${escapeHTML(
                    pedido.id ||
                    pedido.codigo ||
                    ""
                )}"
            >

                <div class="pedido-principal">

                    <h4>
                        ${escapeHTML(
                            pedido.codigo ||
                            "Pedido"
                        )}
                    </h4>

                    <p>
                        <strong>
                            ${escapeHTML(
                                nome
                            )}
                        </strong>
                        ${telefone
                            ? ` · ${escapeHTML(
                                telefone
                            )}`
                            : ""}
                    </p>

                    <p>
                        ${quantidade}
                        item(ns)
                        ·
                        ${dataFormatada(
                            pedido.criadoEm ||
                            pedido.data
                        )}
                    </p>

                    <p>
                        <strong>
                            ${dinheiro(
                                pedido.total
                            )}
                        </strong>
                    </p>

                </div>


                <div class="pedido-acoes">

                    <span class="badge ${classeStatus(
                        pedido.status
                    )}">
                        ${escapeHTML(
                            STATUS_PEDIDO[
                                pedido.status
                            ] ||
                            pedido.status ||
                            "Recebido"
                        )}
                    </span>

                    <button
                        type="button"
                        class="btn btn-small btn-secondary"
                        data-ver-pedido="${escapeHTML(
                            pedido.id ||
                            pedido.codigo ||
                            ""
                        )}"
                    >
                        Detalhes
                    </button>

                    <select
                        class="select-status-pedido"
                        data-status-pedido="${escapeHTML(
                            pedido.id ||
                            pedido.codigo ||
                            ""
                        )}"
                    >

                        ${Object.entries(
                            STATUS_PEDIDO
                        )
                            .map(
                                ([valor, texto]) => `
                                    <option
                                        value="${valor}"
                                        ${
                                            pedido.status ===
                                            valor
                                                ? "selected"
                                                : ""
                                        }
                                    >
                                        ${texto}
                                    </option>
                                `
                            )
                            .join("")}

                    </select>

                </div>

            </article>
        `;
    }


    function localizarPedido(
        identificador
    ) {
        return obterPedidos().find(
            (pedido) =>
                String(
                    pedido.id
                ) ===
                    String(
                        identificador
                    ) ||
                String(
                    pedido.codigo
                ) ===
                    String(
                        identificador
                    )
        );
    }


    function alterarStatusPedido(
        identificador,
        novoStatus
    ) {
        const pedidos =
            obterPedidos();

        const index =
            pedidos.findIndex(
                (pedido) =>
                    String(
                        pedido.id
                    ) ===
                        String(
                            identificador
                        ) ||
                    String(
                        pedido.codigo
                    ) ===
                        String(
                            identificador
                        )
            );

        if (index === -1) {
            return;
        }

        pedidos[index].status =
            novoStatus;

        pedidos[index].atualizadoEm =
            new Date().toISOString();

        salvarStorage(
            STORAGE_KEYS.pedidos,
            pedidos
        );

        renderizarPedidos();
        renderizarDashboard();

        mostrarToast(
            "Status do pedido atualizado.",
            "success"
        );
    }


    function abrirDetalhesPedido(
        identificador
    ) {
        const pedido =
            localizarPedido(
                identificador
            );

        if (!pedido) {
            mostrarToast(
                "Pedido não encontrado.",
                "error"
            );

            return;
        }

        const modal =
            $("#modalPedidoAdmin");

        const conteudo =
            $("#pedidoModalConteudo");

        const codigo =
            $("#pedidoModalCodigo");

        if (!modal || !conteudo) {
            return;
        }

        const nome =
            pedido.cliente?.nome ||
            pedido.nomeCliente ||
            "Cliente";

        const telefone =
            pedido.cliente?.telefone ||
            pedido.telefoneCliente ||
            pedido.telefone ||
            "";

        const endereco =
            pedido.endereco ||
            pedido.dadosEntrega ||
            null;

        const itens =
            pedido.itens ||
            pedido.produtos ||
            [];


        if (codigo) {
            codigo.textContent =
                pedido.codigo ||
                "Pedido";
        }


        conteudo.innerHTML = `
            <div class="pedido-detalhes">

                <div class="pedido-detalhes-bloco">

                    <h3>Cliente</h3>

                    <p>
                        <strong>Nome:</strong>
                        ${escapeHTML(nome)}
                    </p>

                    ${
                        telefone
                            ? `
                                <p>
                                    <strong>Telefone:</strong>
                                    ${escapeHTML(
                                        telefone
                                    )}
                                </p>
                            `
                            : ""
                    }

                </div>


                <div class="pedido-detalhes-bloco">

                    <h3>Itens do pedido</h3>

                    ${
                        itens.length
                            ? itens
                                .map(
                                    (item) => `
                                        <div class="pedido-item-detalhe">

                                            <span>
                                                ${Number(
                                                    item.quantidade ||
                                                    item.qtd ||
                                                    1
                                                )}x

                                                ${escapeHTML(
                                                    item.nome ||
                                                    item.produtoNome ||
                                                    "Produto"
                                                )}
                                            </span>

                                            <strong>
                                                ${dinheiro(
                                                    Number(
                                                        item.subtotal ??
                                                        (
                                                            Number(
                                                                item.precoUnitario ??
                                                                item.preco ??
                                                                item.price ??
                                                                0
                                                            ) *
                                                            Number(
                                                                item.quantidade ||
                                                                item.qtd ||
                                                                1
                                                            )
                                                        )
                                                    )
                                                )}
                                            </strong>

                                        </div>
                                    `
                                )
                                .join("")
                            : `
                                <p>
                                    Nenhum item informado.
                                </p>
                            `
                    }

                </div>


                <div class="pedido-detalhes-bloco">

                    <h3>Entrega</h3>

                    <p>
                        <strong>Tipo:</strong>
                        ${escapeHTML(
                            pedido.tipoEntrega ||
                            pedido.entregaTipo ||
                            "Não informado"
                        )}
                    </p>

                    ${
                        endereco
                            ? `
                                <p>
                                    <strong>Endereço:</strong>
                                    ${escapeHTML(
                                        typeof endereco ===
                                            "string"
                                            ? endereco
                                            : [
                                                endereco.rua,
                                                endereco.numero,
                                                endereco.bairro,
                                                endereco.complemento
                                            ]
                                                .filter(Boolean)
                                                .join(", ")
                                    )}
                                </p>
                            `
                            : ""
                    }

                </div>


                <div class="pedido-detalhes-bloco">

                    <h3>Pagamento</h3>

                    <p>
                        <strong>Forma:</strong>
                        ${escapeHTML(
                            pedido.pagamento ||
                            pedido.formaPagamento ||
                            "Não informado"
                        )}
                    </p>

                    ${
                        pedido.trocoPara
                            ? `
                                <p>
                                    <strong>Troco para:</strong>
                                    ${dinheiro(
                                        pedido.trocoPara
                                    )}
                                </p>
                            `
                            : ""
                    }

                </div>


                <div class="pedido-detalhes-bloco">

                    <h3>Resumo</h3>

                    <p>
                        <strong>Subtotal:</strong>
                        ${dinheiro(
                            pedido.subtotal
                        )}
                    </p>

                    <p>
                        <strong>Entrega:</strong>
                        ${dinheiro(
                            pedido.taxaEntrega ||
                            pedido.entrega ||
                            0
                        )}
                    </p>

                    ${
                        pedido.desconto
                            ? `
                                <p>
                                    <strong>Desconto:</strong>
                                    - ${dinheiro(
                                        pedido.desconto
                                    )}
                                </p>
                            `
                            : ""
                    }

                    <p>
                        <strong>Total:</strong>
                        ${dinheiro(
                            pedido.total
                        )}
                    </p>

                </div>


                ${
                    pedido.observacoes
                        ? `
                            <div class="pedido-detalhes-bloco">

                                <h3>Observações</h3>

                                <p>
                                    ${escapeHTML(
                                        pedido.observacoes
                                    )}
                                </p>

                            </div>
                        `
                        : ""
                }

            </div>
        `;

        abrirModal(modal);
    }


    function configurarPedidos() {
        $("#buscaPedidos")
            ?.addEventListener(
                "input",
                renderizarPedidos
            );

        $("#filtroStatusPedido")
            ?.addEventListener(
                "change",
                renderizarPedidos
            );

        $("#filtroPeriodoPedidos")
            ?.addEventListener(
                "change",
                renderizarPedidos
            );

        $("#btnExportarPedidos")
            ?.addEventListener(
                "click",
                exportarPedidosCSV
            );

        $("#listaPedidos")
            ?.addEventListener(
                "click",
                (evento) => {

                    const botao =
                        evento.target.closest(
                            "[data-ver-pedido]"
                        );

                    if (!botao) {
                        return;
                    }

                    abrirDetalhesPedido(
                        botao.dataset
                            .verPedido
                    );
                }
            );

        $("#listaPedidos")
            ?.addEventListener(
                "change",
                (evento) => {

                    const select =
                        evento.target.closest(
                            "[data-status-pedido]"
                        );

                    if (!select) {
                        return;
                    }

                    alterarStatusPedido(
                        select.dataset
                            .statusPedido,
                        select.value
                    );
                }
            );
    }


    function exportarPedidosCSV() {
        const pedidos =
            obterPedidos();

        if (!pedidos.length) {
            mostrarToast(
                "Não existem pedidos para exportar.",
                "error"
            );

            return;
        }

        const linhas = [
            [
                "Código",
                "Cliente",
                "Telefone",
                "Status",
                "Total",
                "Data"
            ]
        ];

        pedidos.forEach(
            (pedido) => {

                linhas.push([
                    pedido.codigo || "",
                    pedido.cliente?.nome ||
                        pedido.nomeCliente ||
                        "",
                    pedido.cliente?.telefone ||
                        pedido.telefone ||
                        "",
                    STATUS_PEDIDO[
                        pedido.status
                    ] ||
                        pedido.status ||
                        "",
                    Number(
                        pedido.total || 0
                    )
                        .toFixed(2)
                        .replace(".", ","),
                    dataFormatada(
                        pedido.criadoEm ||
                        pedido.data
                    )
                ]);
            }
        );

        const csv =
            linhas
                .map(
                    (linha) =>
                        linha
                            .map(
                                (campo) =>
                                    `"${String(
                                        campo
                                    ).replace(
                                        /"/g,
                                        '""'
                                    )}"`
                            )
                            .join(";")
                )
                .join("\n");

        baixarArquivo(
            csv,
            "pedidos-buena-pizza.csv",
            "text/csv;charset=utf-8;"
        );

        mostrarToast(
            "Pedidos exportados.",
            "success"
        );
    }


    /* =====================================================
       PRODUTOS
    ===================================================== */

    function renderizarProdutosAdmin() {
        const container =
            $("#listaProdutosAdmin");

        if (!container) {
            return;
        }

        let produtos =
            obterProdutos();

        const busca =
            (
                $("#buscaProdutos")
                    ?.value ||
                ""
            )
                .trim()
                .toLowerCase();

        const categoria =
            $("#filtroCategoriaProdutos")
                ?.value ||
            "";

        const categoriaSelecionada = categoria
            ? obterCategorias().find(
                item =>
                    String(item.id || item.nome) ===
                        String(categoria) ||
                    String(item.nome) ===
                        String(categoria)
            )
            : null;

        const estoqueFiltro =
            $("#filtroEstoqueProdutos")
                ?.value ||
            "";


        if (busca) {
            produtos =
                produtos.filter(
                    (produto) =>
                        String(
                            produto.nome ||
                            ""
                        )
                            .toLowerCase()
                            .includes(
                                busca
                            )
                );
        }


        if (categoria) {
            produtos =
                produtos.filter(
                    produto => {
                        const categoriaProduto = String(
                            produto.categoriaId ||
                            produto.categoria ||
                            ""
                        );

                        return (
                            categoriaProduto === String(categoria) ||
                            categoriaProduto === String(categoriaSelecionada?.id) ||
                            categoriaProduto === String(categoriaSelecionada?.nome) ||
                            String(produto.categoria) ===
                                String(categoriaSelecionada?.nome)
                        );
                    }
                );
        }


        if (estoqueFiltro) {
            produtos =
                produtos.filter(
                    (produto) =>
                        obterStatusEstoque(
                            produto
                        ) ===
                        estoqueFiltro
                );
        }


        if (!produtos.length) {
            container.innerHTML = `
                <div class="admin-card empty-state">
                    <span>🍕</span>

                    <h3>
                        Nenhum produto encontrado
                    </h3>

                    <p>
                        Tente alterar os filtros
                        ou cadastre um novo produto.
                    </p>
                </div>
            `;

            return;
        }


        container.innerHTML =
            produtos.map(
                criarProdutoAdminHTML
            ).join("");
    }


    function obterStatusEstoque(
        produto
    ) {
        const estoque =
            Number(
                produto.estoque ??
                produto.quantidadeEstoque ??
                0
            );

        if (estoque <= 0) {
            return "esgotado";
        }

        if (estoque <= 5) {
            return "pouco";
        }

        return "disponivel";
    }


    function criarProdutoAdminHTML(
        produto
    ) {
        const estoque =
            Number(
                produto.estoque ??
                produto.quantidadeEstoque ??
                0
            );

        const status =
            obterStatusEstoque(
                produto
            );

        const statusTexto = {
            disponivel: "Disponível",
            pouco: "Pouco estoque",
            esgotado: "Esgotado"
        };


        const classe = {
            disponivel: "badge-green",
            pouco: "badge-yellow",
            esgotado: "badge-danger"
        };


        return `
            <article
                class="produto-admin-card"
            >

                ${
                    produto.imagem
                        ? `
                            <img
                                src="${escapeHTML(
                                    produto.imagem
                                )}"
                                alt="${escapeHTML(
                                    produto.nome
                                )}"
                                class="produto-admin-imagem"
                                onerror="
                                    this.style.display='none'
                                "
                            >
                        `
                        : `
                            <div
                                class="produto-admin-imagem"
                                style="
                                    display:flex;
                                    align-items:center;
                                    justify-content:center;
                                    font-size:45px;
                                "
                            >
                                🍕
                            </div>
                        `
                }


                <div class="produto-admin-conteudo">

                    <h3>
                        ${escapeHTML(
                            produto.nome
                        )}
                    </h3>

                    <p
                        class="produto-admin-descricao"
                    >
                        ${escapeHTML(
                            produto.descricao ||
                            "Sem descrição."
                        )}
                    </p>


                    <div class="produto-admin-info">

                        <strong
                            class="produto-admin-preco"
                        >
                            ${dinheiro(
                                (() => {
                                    const precoTamanho = Number(produto.tamanhos?.[0]?.preco);
                                    return Number.isFinite(precoTamanho) && precoTamanho > 0
                                        ? precoTamanho
                                        : Number(produto.preco || 0);
                                })()
                            )}
                        </strong>

                        <span
                            class="badge ${classe[status]}"
                        >
                            ${statusTexto[status]}
                            ·
                            ${estoque}
                        </span>

                    </div>


                    <div
                        class="produto-admin-acoes"
                    >

                        <button
                            type="button"
                            class="btn btn-small btn-secondary"
                            data-editar-produto="${escapeHTML(
                                produto.id
                            )}"
                        >
                            ✏️ Editar
                        </button>

                        <button
                            type="button"
                            class="btn btn-small btn-danger"
                            data-excluir-produto="${escapeHTML(
                                produto.id
                            )}"
                        >
                            🗑️ Excluir
                        </button>

                    </div>

                </div>

            </article>
        `;
    }


    function preencherFiltroCategorias() {
        const selects = [
            $("#filtroCategoriaProdutos"),
            $("#produtoCategoria")
        ];

        const categorias =
            obterCategorias();

        selects.forEach(
            (select) => {

                if (!select) {
                    return;
                }

                const valorAtual =
                    select.value;

                const primeiraOpcao =
                    select.id ===
                    "filtroCategoriaProdutos"
                        ? `<option value="">
                            Todas
                           </option>`
                        : `<option value="">
                            Selecione
                           </option>`;

                select.innerHTML =
                    primeiraOpcao +
                    categorias
                        .map(
                            (categoria) => `
                                <option
                                    value="${escapeHTML(
                                        categoria.id ||
                                        categoria.nome
                                    )}"
                                >
                                    ${escapeHTML(
                                        categoria.nome
                                    )}
                                </option>
                            `
                        )
                        .join("");

                if (
                    valorAtual &&
                    [
                        ...select.options
                    ].some(
                        (option) =>
                            option.value ===
                            valorAtual
                    )
                ) {
                    select.value =
                        valorAtual;
                }
            }
        );
    }


    function abrirModalProduto(
        produto = null
    ) {
        const modal =
            $("#modalProdutoAdmin");

        if (!modal) {
            return;
        }

        limparFormularioProduto();

        preencherFiltroCategorias();


        if (produto) {
            $("#tituloModalProduto")
                .textContent =
                "Editar produto";

            $("#produtoId").value =
                produto.id || "";

            $("#produtoNome").value =
                produto.nome || "";

            $("#produtoCategoria").value =
                produto.categoriaId ||
                produto.categoria ||
                "";

            $("#produtoDescricao").value =
                produto.descricao || "";

            $("#produtoPreco").value =
                Number(
                    produto.preco || 0
                );

            $("#produtoEstoque").value =
                Number(
                    produto.estoque ??
                    produto.quantidadeEstoque ??
                    0
                );

            $("#produtoImagem").value =
                produto.imagem || "";

            atualizarPreviewImagem(produto.imagem);

            renderizarTamanhosProduto(
                produto.tamanhos || []
            );

            renderizarAdicionaisProduto(
                produto.adicionais || []
            );

            renderizarSaboresProduto(produto.sabores || [], produto.temSabores || false);
        } else {
            $("#tituloModalProduto")
                .textContent =
                "Novo produto";

            renderizarTamanhosProduto(
                []
            );

            renderizarAdicionaisProduto(
                []
            );

            renderizarSaboresProduto([], false);
        }

        abrirModal(modal);
    }


    function limparFormularioProduto() {
        $("#formProdutoAdmin")
            ?.reset();

        if ($("#produtoId")) {
            $("#produtoId").value = "";
        }

        if ($("#produtoImagemArquivo")) {
            $("#produtoImagemArquivo").value = "";
        }

        $("#listaSaboresProduto") && ($("#listaSaboresProduto").innerHTML = "");
        if ($("#produtoTemSabores")) $("#produtoTemSabores").checked = false;
        $("#containerSaboresProduto")?.classList.add("hidden");

        atualizarPreviewImagem(null);

        const listaTamanhos =
            $("#listaTamanhosProduto");

        const listaAdicionais =
            $("#listaAdicionaisProduto");

        if (listaTamanhos) {
            listaTamanhos.innerHTML = "";
        }

        if (listaAdicionais) {
            listaAdicionais.innerHTML = "";
        }
    }


    function renderizarTamanhosProduto(
        tamanhos
    ) {
        const container =
            $("#listaTamanhosProduto");

        if (!container) {
            return;
        }

        container.innerHTML =
            tamanhos
                .map(
                    (tamanho) =>
                        criarOpcaoHTML(
                            tamanho,
                            "tamanho"
                        )
                )
                .join("");
    }


    function renderizarAdicionaisProduto(
        adicionais
    ) {
        const container =
            $("#listaAdicionaisProduto");

        if (!container) {
            return;
        }

        container.innerHTML =
            adicionais
                .map(
                    (adicional) =>
                        criarOpcaoHTML(
                            adicional,
                            "adicional"
                        )
                )
                .join("");
    }


    function criarOpcaoHTML(
        opcao,
        tipo
    ) {
        return `
            <div
                class="opcao-admin"
                data-opcao-item
            >

                <input
                    type="text"
                    data-opcao-nome
                    placeholder="${
                        tipo === "tamanho"
                            ? "Ex.: Grande"
                            : "Ex.: Catupiry"
                    }"
                    value="${escapeHTML(
                        opcao.nome ||
                        opcao.label ||
                        ""
                    )}"
                >

                <input
                    type="number"
                    data-opcao-preco
                    min="0"
                    step="0.01"
                    placeholder="Preço"
                    value="${Number(
                        opcao.preco ||
                        opcao.valor ||
                        0
                    )}"
                >

                <button
                    type="button"
                    class="btn btn-small btn-danger"
                    data-remover-opcao
                >
                    ×
                </button>

            </div>
        `;
    }


    function adicionarOpcaoProduto(
        tipo
    ) {
        const container =
            tipo === "tamanho"
                ? $("#listaTamanhosProduto")
                : $("#listaAdicionaisProduto");

        if (!container) {
            return;
        }

        container.insertAdjacentHTML(
            "beforeend",
            criarOpcaoHTML(
                {
                    nome: "",
                    preco: 0
                },
                tipo
            )
        );
    }


    function coletarOpcoesProduto(
        containerId
    ) {
        const container =
            $(containerId);

        if (!container) {
            return [];
        }

        return [
            ...container.querySelectorAll(
                "[data-opcao-item]"
            )
        ]
            .map(
                (item) => ({
                    id: gerarId("op"),
                    nome:
                        item.querySelector(
                            "[data-opcao-nome]"
                        )?.value.trim() ||
                        "",
                    preco:
                        Number(
                            item.querySelector(
                                "[data-opcao-preco]"
                            )?.value ||
                            0
                        )
                })
            )
            .filter(
                (item) =>
                    item.nome
            );
    }


    function atualizarPreviewImagem(url, containerId = "previewImagemProduto") {
        const preview = $(`#${containerId}`);
        if (!preview) return;

        if (url) {
            preview.innerHTML = `<img src="${url}" alt="Prévia da imagem">`;
        } else {
            preview.innerHTML = `<span>Nenhuma imagem selecionada</span>`;
        }
    }


    function tratarSelecaoImagem(evento, previewContainerId = "previewImagemProduto", urlInputId = "produtoImagem") {
        const arquivo = evento.target.files[0];

        if (!arquivo) {
            return;
        }

        if (!arquivo.type.startsWith("image/")) {
            mostrarToast(
                "Por favor, selecione um arquivo de imagem.",
                "error"
            );
            evento.target.value = "";
            return;
        }

        const leitor = new FileReader();

        leitor.onload = (e) => {
            const base64 = e.target.result;
            atualizarPreviewImagem(base64, previewContainerId);

            // Limpa o campo de URL se selecionou arquivo
            const inputUrl = $(`#${urlInputId}`);
            if (inputUrl) {
                inputUrl.value = "";
            }
        };

        leitor.readAsDataURL(arquivo);
    }


    function salvarProduto(
        evento
    ) {
        evento.preventDefault();

        const id =
            $("#produtoId")
                ?.value.trim();

        const nome =
            $("#produtoNome")
                ?.value.trim();

        const categoria =
            $("#produtoCategoria")
                ?.value;

        const descricao =
            $("#produtoDescricao")
                ?.value.trim();

        const preco =
            Number(
                $("#produtoPreco")
                    ?.value || 0
            );

        const estoque =
            Number(
                $("#produtoEstoque")
                    ?.value || 0
            );

        // Prioriza a imagem da prévia (que pode ser base64 ou a URL atual)
        // Se não houver nada na prévia, tenta pegar do campo de URL
        const previewImg = $("#previewImagemProduto img");
        let imagem = previewImg ? previewImg.src : "";

        if (!imagem) {
            imagem = $("#produtoImagem")?.value.trim() || "";
        }


        if (!nome) {
            mostrarToast(
                "Informe o nome do produto.",
                "error"
            );

            return;
        }


        if (!categoria) {
            mostrarToast(
                "Selecione uma categoria.",
                "error"
            );

            return;
        }


        if (preco < 0) {
            mostrarToast(
                "O preço não pode ser negativo.",
                "error"
            );

            return;
        }


        const produtos =
            obterProdutos();

        const categoriaObj =
            obterCategorias().find(
                (item) =>
                    String(
                        item.id ||
                        item.nome
                    ) ===
                    String(categoria)
            );


        const produto = {
            id:
                id ||
                gerarId("produto"),

            nome,

            categoriaId:
                categoriaObj?.id ||
                categoria,

            categoria:
                categoriaObj?.nome ||
                categoria,

            descricao,

            preco,

            estoque,

            imagem,

            temSabores: $("#produtoTemSabores")?.checked || false,

            sabores: coletarSaboresProduto(),

            tamanhos:
                coletarOpcoesProduto(
                    "#listaTamanhosProduto"
                ),

            adicionais:
                coletarOpcoesProduto(
                    "#listaAdicionaisProduto"
                ),

            ativo: true
        };

        if (produto.sabores === null) return;


        const index =
            produtos.findIndex(
                (item) =>
                    String(
                        item.id
                    ) ===
                    String(id)
            );


        if (index >= 0) {
            /*
             * Mantém campos existentes
             * que não fazem parte do formulário.
             */
            produtos[index] = {
                ...produtos[index],
                ...produto
            };
        } else {
            produtos.push(
                produto
            );
        }


        salvarStorage(
            STORAGE_KEYS.produtos,
            produtos
        );

        fecharModal(
            $("#modalProdutoAdmin")
        );

        renderizarProdutosAdmin();
        renderizarDashboard();

        mostrarToast(
            index >= 0
                ? "Produto atualizado."
                : "Produto cadastrado.",
            "success"
        );
    }


    function editarProduto(id) {
        const produto =
            obterProdutos().find(
                (item) =>
                    String(
                        item.id
                    ) ===
                    String(id)
            );

        if (!produto) {
            mostrarToast(
                "Produto não encontrado.",
                "error"
            );

            return;
        }

        abrirModalProduto(
            produto
        );
    }


    function excluirProduto(id) {
        const produto =
            obterProdutos().find(
                (item) =>
                    String(
                        item.id
                    ) ===
                    String(id)
            );

        if (!produto) {
            return;
        }

        const confirmar =
            window.confirm(
                `Excluir o produto "${produto.nome}"?`
            );

        if (!confirmar) {
            return;
        }

        const produtos =
            obterProdutos().filter(
                (item) =>
                    String(
                        item.id
                    ) !==
                    String(id)
            );

        salvarStorage(
            STORAGE_KEYS.produtos,
            produtos
        );

        renderizarProdutosAdmin();
        renderizarDashboard();

        mostrarToast(
            "Produto excluído.",
            "success"
        );
    }


    function configurarProdutos() {
        $("#btnAdicionarSabor")?.addEventListener("click", adicionarSaborProduto);
        $("#produtoTemSabores")?.addEventListener("change", (evento) => {
            const container = $("#containerSaboresProduto");
            if (!container) return;
            container.classList.toggle("hidden", !evento.target.checked);
            if (evento.target.checked && !$("#listaSaboresProduto")?.children.length) {
                adicionarSaborProduto();
            }
        });
        $("#listaSaboresProduto")?.addEventListener("click", (evento) => {
            evento.target.closest("[data-remover-sabor]")?.closest("[data-sabor-item]")?.remove();
        });

        $("#btnNovoProduto")
            ?.addEventListener(
                "click",
                () =>
                    abrirModalProduto()
            );

        $("#formProdutoAdmin")
            ?.addEventListener(
                "submit",
                salvarProduto
            );

        $("#produtoImagemArquivo")
            ?.addEventListener(
                "change",
                (e) => tratarSelecaoImagem(e, "previewImagemProduto", "produtoImagem")
            );

        $("#produtoImagem")
            ?.addEventListener(
                "input",
                (e) => {
                    atualizarPreviewImagem(e.target.value.trim(), "previewImagemProduto");
                    // Limpa o arquivo selecionado se digitou URL
                    const inputFile = $("#produtoImagemArquivo");
                    if (inputFile) inputFile.value = "";
                }
            );

        $("#btnAdicionarTamanho")
            ?.addEventListener(
                "click",
                () =>
                    adicionarOpcaoProduto(
                        "tamanho"
                    )
            );

        $("#btnAdicionarAdicional")
            ?.addEventListener(
                "click",
                () =>
                    adicionarOpcaoProduto(
                        "adicional"
                    )
            );


        $("#listaProdutosAdmin")
            ?.addEventListener(
                "click",
                (evento) => {

                    const editar =
                        evento.target.closest(
                            "[data-editar-produto]"
                        );

                    if (editar) {
                        editarProduto(
                            editar.dataset
                                .editarProduto
                        );

                        return;
                    }


                    const excluir =
                        evento.target.closest(
                            "[data-excluir-produto]"
                        );

                    if (excluir) {
                        excluirProduto(
                            excluir.dataset
                                .excluirProduto
                        );
                    }
                }
            );


        $("#listaTamanhosProduto")
            ?.addEventListener(
                "click",
                removerOpcao
            );

        $("#listaAdicionaisProduto")
            ?.addEventListener(
                "click",
                removerOpcao
            );


        $("#buscaProdutos")
            ?.addEventListener(
                "input",
                renderizarProdutosAdmin
            );

        $("#filtroCategoriaProdutos")
            ?.addEventListener(
                "change",
                renderizarProdutosAdmin
            );

        $("#filtroEstoqueProdutos")
            ?.addEventListener(
                "change",
                renderizarProdutosAdmin
            );
    }


    function removerOpcao(evento) {
        const botao =
            evento.target.closest(
                "[data-remover-opcao]"
            );

        if (!botao) {
            return;
        }

        botao
            .closest("[data-opcao-item]")
            ?.remove();
    }


    /* =====================================================
       CATEGORIAS
    ===================================================== */

    function renderizarCategoriasAdmin() {
        const container =
            $("#listaCategoriasAdmin");

        if (!container) {
            return;
        }

        const categorias =
            obterCategorias();

        if (!categorias.length) {
            container.innerHTML = `
                <div class="empty-state">
                    <span>📂</span>
                    <h3>Nenhuma categoria</h3>
                    <p>
                        Cadastre sua primeira categoria.
                    </p>
                </div>
            `;

            return;
        }

        container.innerHTML =
            categorias.map(
                (categoria) => `
                    <div
                        class="crud-item"
                    >

                        <div class="crud-info">

                            <strong>
                                ${escapeHTML(
                                    categoria.nome
                                )}
                            </strong>

                            <small>
                                Ordem:
                                ${Number(
                                    categoria.ordem ||
                                    0
                                )}
                            </small>

                        </div>


                        <div
                            class="crud-actions"
                        >

                            <button
                                type="button"
                                class="btn btn-small btn-secondary"
                                data-editar-categoria="${escapeHTML(
                                    categoria.id ||
                                    categoria.nome
                                )}"
                            >
                                ✏️ Editar
                            </button>

                            <button
                                type="button"
                                class="btn btn-small btn-danger"
                                data-excluir-categoria="${escapeHTML(
                                    categoria.id ||
                                    categoria.nome
                                )}"
                            >
                                🗑️ Excluir
                            </button>

                        </div>

                    </div>
                `
            ).join("");
    }


    function abrirModalCategoria(
        categoria = null
    ) {
        limparFormularioCategoria();

        if (categoria) {
            $("#tituloModalCategoria")
                .textContent =
                "Editar categoria";

            $("#categoriaId").value =
                categoria.id ||
                categoria.nome;

            $("#categoriaNome").value =
                categoria.nome || "";

            $("#categoriaOrdem").value =
                Number(
                    categoria.ordem || 0
                );
        } else {
            $("#tituloModalCategoria")
                .textContent =
                "Nova categoria";
        }

        abrirModal(
            $("#modalCategoriaAdmin")
        );
    }


    function limparFormularioCategoria() {
        $("#formCategoriaAdmin")
            ?.reset();

        if ($("#categoriaId")) {
            $("#categoriaId").value = "";
        }
    }


    function salvarCategoria(
        evento
    ) {
        evento.preventDefault();

        const id =
            $("#categoriaId")
                ?.value.trim();

        const nome =
            $("#categoriaNome")
                ?.value.trim();

        const ordem =
            Number(
                $("#categoriaOrdem")
                    ?.value || 0
            );

        if (!nome) {
            mostrarToast(
                "Informe o nome da categoria.",
                "error"
            );

            return;
        }

        const categorias =
            obterCategorias();

        const nomeDuplicado =
            categorias.some(
                (categoria) =>
                    categoria.nome
                        .toLowerCase() ===
                        nome.toLowerCase() &&
                    String(
                        categoria.id ||
                        categoria.nome
                    ) !==
                        String(id)
            );

        if (nomeDuplicado) {
            mostrarToast(
                "Essa categoria já existe.",
                "error"
            );

            return;
        }


        const categoria = {
            id:
                id ||
                gerarId("categoria"),

            nome,

            ordem
        };


        const index =
            categorias.findIndex(
                (item) =>
                    String(
                        item.id ||
                        item.nome
                    ) ===
                    String(id)
            );


        if (index >= 0) {
            categorias[index] = {
                ...categorias[index],
                ...categoria
            };
        } else {
            categorias.push(
                categoria
            );
        }


        categorias.sort(
            (a, b) =>
                Number(a.ordem || 0) -
                Number(b.ordem || 0)
        );


        salvarStorage(
            STORAGE_KEYS.categorias,
            categorias
        );

        fecharModal(
            $("#modalCategoriaAdmin")
        );

        renderizarCategoriasAdmin();
        preencherFiltroCategorias();
        renderizarProdutosAdmin();

        mostrarToast(
            index >= 0
                ? "Categoria atualizada."
                : "Categoria criada.",
            "success"
        );
    }


    function editarCategoria(id) {
        const categoria =
            obterCategorias().find(
                (item) =>
                    String(
                        item.id ||
                        item.nome
                    ) ===
                    String(id)
            );

        if (categoria) {
            abrirModalCategoria(
                categoria
            );
        }
    }


    function excluirCategoria(id) {
        const categorias =
            obterCategorias();

        const categoria =
            categorias.find(
                (item) =>
                    String(
                        item.id ||
                        item.nome
                    ) ===
                    String(id)
            );

        if (!categoria) {
            return;
        }

        const produtos =
            obterProdutos();

        const produtosVinculados =
            produtos.filter(
                (produto) =>
                    String(
                        produto.categoriaId ||
                        produto.categoria
                    ) ===
                    String(
                        categoria.id ||
                        categoria.nome
                    )
            );


        if (produtosVinculados.length) {
            mostrarToast(
                "Não é possível excluir uma categoria que possui produtos.",
                "error"
            );

            return;
        }


        if (
            !window.confirm(
                `Excluir a categoria "${categoria.nome}"?`
            )
        ) {
            return;
        }


        const novasCategorias =
            categorias.filter(
                (item) =>
                    String(
                        item.id ||
                        item.nome
                    ) !==
                    String(id)
            );

        salvarStorage(
            STORAGE_KEYS.categorias,
            novasCategorias
        );

        renderizarCategoriasAdmin();
        preencherFiltroCategorias();

        mostrarToast(
            "Categoria excluída.",
            "success"
        );
    }


    function configurarCategorias() {
        $("#btnNovaCategoria")
            ?.addEventListener(
                "click",
                () =>
                    abrirModalCategoria()
            );

        $("#formCategoriaAdmin")
            ?.addEventListener(
                "submit",
                salvarCategoria
            );

        $("#listaCategoriasAdmin")
            ?.addEventListener(
                "click",
                (evento) => {

                    const editar =
                        evento.target.closest(
                            "[data-editar-categoria]"
                        );

                    if (editar) {
                        editarCategoria(
                            editar.dataset
                                .editarCategoria
                        );

                        return;
                    }


                    const excluir =
                        evento.target.closest(
                            "[data-excluir-categoria]"
                        );

                    if (excluir) {
                        excluirCategoria(
                            excluir.dataset
                                .excluirCategoria
                        );
                    }
                }
            );
    }


    /* =====================================================
       CUPONS
    ===================================================== */

    function renderizarCuponsAdmin() {
        const container =
            $("#listaCuponsAdmin");

        if (!container) {
            return;
        }

        const cupons =
            obterCupons();

        if (!cupons.length) {
            container.innerHTML = `
                <div class="empty-state">
                    <span>🎟️</span>
                    <h3>Nenhum cupom</h3>
                    <p>
                        Crie um cupom para seus clientes.
                    </p>
                </div>
            `;

            return;
        }


        container.innerHTML =
            cupons.map(
                (cupom) => {

                    const validade =
                        cupom.validade ||
                        cupom.validadeAte ||
                        "";

                    const expirado =
                        validade &&
                        somenteData(
                            new Date()
                        ) >
                        validade;

                    const ativo =
                        cupom.ativo !== false &&
                        !expirado;


                    return `
                        <div
                            class="crud-item"
                        >

                            <div class="crud-info">

                                <strong>
                                    ${escapeHTML(
                                        cupom.codigo ||
                                        cupom.nome ||
                                        "CUPOM"
                                    )}
                                </strong>

                                <small>
                                    ${Number(
                                        cupom.desconto ||
                                        cupom.valor ||
                                        0
                                    )}${cupom.tipo === "fixo" ? " R$" : "%"} de desconto

                                    ${
                                        Number(
                                            cupom.minimo ||
                                            cupom.valorMinimo ||
                                            0
                                        ) > 0
                                            ? `
                                                · mínimo
                                                ${dinheiro(
                                                    cupom.minimo ||
                                                    cupom.valorMinimo
                                                )}
                                            `
                                            : ""
                                    }

                                    ${
                                        validade
                                            ? `
                                                · até
                                                ${escapeHTML(
                                                    validade
                                                )}
                                            `
                                            : ""
                                    }
                                </small>

                            </div>


                            <span
                                class="badge ${
                                    ativo
                                        ? "badge-green"
                                        : "badge-danger"
                                }"
                            >
                                ${
                                    ativo
                                        ? "Ativo"
                                        : "Inativo"
                                }
                            </span>


                            <div
                                class="crud-actions"
                            >

                                <button
                                    type="button"
                                    class="btn btn-small btn-secondary"
                                    data-editar-cupom="${escapeHTML(
                                        cupom.id ||
                                        cupom.codigo
                                    )}"
                                >
                                    ✏️ Editar
                                </button>

                                <button
                                    type="button"
                                    class="btn btn-small btn-danger"
                                    data-excluir-cupom="${escapeHTML(
                                        cupom.id ||
                                        cupom.codigo
                                    )}"
                                >
                                    🗑️ Excluir
                                </button>

                            </div>

                        </div>
                    `;
                }
            ).join("");
    }


    function abrirModalCupom(
        cupom = null
    ) {
        $("#formCupomAdmin")
            ?.reset();

        if (cupom) {

            $("#tituloModalCupom")
                .textContent =
                "Editar cupom";

            $("#cupomId").value =
                cupom.id ||
                cupom.codigo ||
                "";

            $("#cupomCodigo").value =
                cupom.codigo || "";

            $("#cupomTipo").value =
                cupom.tipo || "percentual";

            $("#cupomDesconto").value =
                Number(
                    cupom.desconto || 0
                );

            $("#cupomMinimo").value =
                Number(
                    cupom.minimo ||
                    cupom.valorMinimo ||
                    0
                );

            $("#cupomValidade").value =
                cupom.validade ||
                cupom.validadeAte ||
                "";

            $("#cupomAtivo").checked =
                cupom.ativo !== false;

        } else {

            $("#tituloModalCupom")
                .textContent =
                "Novo cupom";

            $("#cupomAtivo").checked =
                true;
        }

        abrirModal(
            $("#modalCupomAdmin")
        );
    }


    function salvarCupom(
        evento
    ) {
        evento.preventDefault();

        const id =
            $("#cupomId")
                ?.value.trim();

        const codigo =
            (
                $("#cupomCodigo")
                    ?.value ||
                ""
            )
                .trim()
                .toUpperCase();

        const desconto =
            Number(
                $("#cupomDesconto")
                    ?.value || 0
            );

        const tipo =
            $("#cupomTipo")
                ?.value ||
            "percentual";

        const minimo =
            Number(
                $("#cupomMinimo")
                    ?.value || 0
            );

        const validade =
            $("#cupomValidade")
                ?.value || "";

        const ativo =
            $("#cupomAtivo")
                ?.checked;


        if (!codigo) {
            mostrarToast(
                "Informe o código do cupom.",
                "error"
            );

            return;
        }


        if (desconto <= 0 || (tipo === "percentual" && desconto > 100)) {
            mostrarToast(
                "O desconto deve estar entre 1% e 100%.",
                "error"
            );

            return;
        }


        const cupons =
            obterCupons();


        const duplicado =
            cupons.some(
                (cupom) =>
                    String(
                        cupom.codigo ||
                        ""
                    ).toUpperCase() ===
                        codigo &&
                    String(
                        cupom.id ||
                        cupom.codigo
                    ) !==
                        String(id)
            );


        if (duplicado) {
            mostrarToast(
                "Esse código já está cadastrado.",
                "error"
            );

            return;
        }


        const cupom = {
            id:
                id ||
                gerarId("cupom"),

            codigo,

            tipo,

            valor: desconto,

            desconto,

            minimo,

            valorMinimo:
                minimo,

            validade,

            validadeAte:
                validade,

            ativo
        };


        const index =
            cupons.findIndex(
                (item) =>
                    String(
                        item.id ||
                        item.codigo
                    ) ===
                    String(id)
            );


        if (index >= 0) {
            cupons[index] = {
                ...cupons[index],
                ...cupom
            };
        } else {
            cupons.push(
                cupom
            );
        }


        salvarStorage(
            STORAGE_KEYS.cupons,
            cupons
        );

        fecharModal(
            $("#modalCupomAdmin")
        );

        renderizarCuponsAdmin();

        mostrarToast(
            index >= 0
                ? "Cupom atualizado."
                : "Cupom criado.",
            "success"
        );
    }


    function editarCupom(id) {
        const cupom =
            obterCupons().find(
                (item) =>
                    String(
                        item.id ||
                        item.codigo
                    ) ===
                    String(id)
            );

        if (cupom) {
            abrirModalCupom(
                cupom
            );
        }
    }


    function excluirCupom(id) {
        const cupom =
            obterCupons().find(
                (item) =>
                    String(
                        item.id ||
                        item.codigo
                    ) ===
                    String(id)
            );

        if (!cupom) {
            return;
        }

        if (
            !window.confirm(
                `Excluir o cupom "${cupom.codigo}"?`
            )
        ) {
            return;
        }

        const cupons =
            obterCupons().filter(
                (item) =>
                    String(
                        item.id ||
                        item.codigo
                    ) !==
                    String(id)
            );

        salvarStorage(
            STORAGE_KEYS.cupons,
            cupons
        );

        renderizarCuponsAdmin();

        mostrarToast(
            "Cupom excluído.",
            "success"
        );
    }


    function configurarCupons() {
        $("#btnNovoCupom")
            ?.addEventListener(
                "click",
                () =>
                    abrirModalCupom()
            );

        $("#formCupomAdmin")
            ?.addEventListener(
                "submit",
                salvarCupom
            );

        $("#listaCuponsAdmin")
            ?.addEventListener(
                "click",
                (evento) => {

                    const editar =
                        evento.target.closest(
                            "[data-editar-cupom]"
                        );

                    if (editar) {
                        editarCupom(
                            editar.dataset
                                .editarCupom
                        );

                        return;
                    }


                    const excluir =
                        evento.target.closest(
                            "[data-excluir-cupom]"
                        );

                    if (excluir) {
                        excluirCupom(
                            excluir.dataset
                                .excluirCupom
                        );
                    }
                }
            );
    }


    /* =====================================================
       GALERIA
    ===================================================== */

    function renderizarGaleriaAdmin() {
        const container =
            $("#listaGaleriaAdmin");

        if (!container) {
            return;
        }

        const galeria =
            obterGaleria();

        if (!galeria.length) {
            container.innerHTML = `
                <div class="admin-card empty-state">
                    <span>🖼️</span>
                    <h3>Nenhuma imagem</h3>
                    <p>
                        Adicione imagens à galeria.
                    </p>
                </div>
            `;

            return;
        }


        container.innerHTML =
            galeria.map(
                (imagem) => `
                    <article
                        class="galeria-admin-card"
                    >

                        ${
                            imagem.url ||
                            imagem.imagem
                                ? `
                                    <img
                                        src="${escapeHTML(
                                            imagem.url ||
                                            imagem.imagem
                                        )}"
                                        alt="${escapeHTML(
                                            imagem.titulo ||
                                            "Imagem da galeria"
                                        )}"
                                        onerror="
                                            this.style.display='none'
                                        "
                                    >
                                `
                                : `
                                    <div
                                        style="
                                            height:180px;
                                            display:flex;
                                            align-items:center;
                                            justify-content:center;
                                            background:#fff3d8;
                                            font-size:40px;
                                        "
                                    >
                                        🖼️
                                    </div>
                                `
                        }


                        <div
                            class="galeria-admin-info"
                        >

                            <h3>
                                ${escapeHTML(
                                    imagem.titulo ||
                                    "Sem título"
                                )}
                            </h3>

                            <p>
                                ${escapeHTML(
                                    imagem.descricao ||
                                    ""
                                )}
                            </p>


                            <div
                                class="galeria-admin-acoes"
                            >

                                <button
                                    type="button"
                                    class="btn btn-small btn-secondary"
                                    data-editar-galeria="${escapeHTML(
                                        imagem.id
                                    )}"
                                >
                                    ✏️ Editar
                                </button>

                                <button
                                    type="button"
                                    class="btn btn-small btn-danger"
                                    data-excluir-galeria="${escapeHTML(
                                        imagem.id
                                    )}"
                                >
                                    🗑️ Excluir
                                </button>

                            </div>

                        </div>

                    </article>
                `
            ).join("");
    }


    function abrirModalGaleria(
        imagem = null
    ) {
        $("#formGaleriaAdmin")
            ?.reset();

        // Limpa preview e campos de arquivo
        atualizarPreviewImagem("", "previewImagemGaleria");
        if ($("#galeriaImagemArquivo")) {
            $("#galeriaImagemArquivo").value = "";
        }

        if (imagem) {

            $("#tituloModalGaleria")
                .textContent =
                "Editar imagem";

            $("#galeriaId").value =
                imagem.id || "";

            $("#galeriaTitulo").value =
                imagem.titulo || "";

            const imgUrl = imagem.url || imagem.imagem || "";
            $("#galeriaImagem").value = imgUrl;

            $("#galeriaDescricao").value =
                imagem.descricao || "";

            if (imgUrl) {
                atualizarPreviewImagem(imgUrl, "previewImagemGaleria");
            }

        } else {

            $("#tituloModalGaleria")
                .textContent =
                "Nova imagem";
            
            if ($("#galeriaId")) {
                $("#galeriaId").value = "";
            }
        }

        abrirModal(
            $("#modalGaleriaAdmin")
        );
    }


    function salvarGaleria(
        evento
    ) {
        evento.preventDefault();

        const id =
            $("#galeriaId")
                ?.value.trim();

        const titulo =
            $("#galeriaTitulo")
                ?.value.trim();

        const descricao =
            $("#galeriaDescricao")
                ?.value.trim();

        // Prioriza a imagem da prévia
        const previewImg = $("#previewImagemGaleria img");
        let imagem = previewImg ? previewImg.src : "";

        if (!imagem) {
            imagem = $("#galeriaImagem")?.value.trim() || "";
        }


        if (!titulo || !imagem) {
            mostrarToast(
                "Preencha o título e selecione uma imagem.",
                "error"
            );

            return;
        }


        const galeria =
            obterGaleria();


        const item = {
            id:
                id ||
                gerarId("galeria"),

            titulo,

            url:
                imagem,

            imagem,

            descricao
        };


        const index =
            galeria.findIndex(
                (imagemItem) =>
                    String(
                        imagemItem.id
                    ) ===
                    String(id)
            );


        if (index >= 0) {
            galeria[index] = {
                ...galeria[index],
                ...item
            };
        } else {
            galeria.push(
                item
            );
        }


        salvarStorage(
            STORAGE_KEYS.galeria,
            galeria
        );

        fecharModal(
            $("#modalGaleriaAdmin")
        );

        renderizarGaleriaAdmin();

        mostrarToast(
            index >= 0
                ? "Imagem atualizada."
                : "Imagem adicionada.",
            "success"
        );
    }


    function editarGaleria(id) {
        const imagem =
            obterGaleria().find(
                (item) =>
                    String(
                        item.id
                    ) ===
                    String(id)
            );

        if (imagem) {
            abrirModalGaleria(
                imagem
            );
        }
    }


    function excluirGaleria(id) {
        const imagem =
            obterGaleria().find(
                (item) =>
                    String(
                        item.id
                    ) ===
                    String(id)
            );

        if (!imagem) {
            return;
        }

        if (
            !window.confirm(
                "Excluir esta imagem da galeria?"
            )
        ) {
            return;
        }


        const galeria =
            obterGaleria().filter(
                (item) =>
                    String(
                        item.id
                    ) !==
                    String(id)
            );


        salvarStorage(
            STORAGE_KEYS.galeria,
            galeria
        );

        renderizarGaleriaAdmin();

        mostrarToast(
            "Imagem excluída.",
            "success"
        );
    }


    function configurarGaleria() {
        $("#btnNovaImagem")
            ?.addEventListener(
                "click",
                () =>
                    abrirModalGaleria()
            );

        $("#formGaleriaAdmin")
            ?.addEventListener(
                "submit",
                salvarGaleria
            );

        $("#galeriaImagemArquivo")
            ?.addEventListener(
                "change",
                (e) => tratarSelecaoImagem(e, "previewImagemGaleria", "galeriaImagem")
            );

        $("#galeriaImagem")
            ?.addEventListener(
                "input",
                (e) => {
                    atualizarPreviewImagem(e.target.value.trim(), "previewImagemGaleria");
                    // Limpa o arquivo selecionado se digitou URL
                    const inputFile = $("#galeriaImagemArquivo");
                    if (inputFile) inputFile.value = "";
                }
            );

        $("#listaGaleriaAdmin")
            ?.addEventListener(
                "click",
                (evento) => {

                    const editar =
                        evento.target.closest(
                            "[data-editar-galeria]"
                        );

                    if (editar) {
                        editarGaleria(
                            editar.dataset
                                .editarGaleria
                        );

                        return;
                    }


                    const excluir =
                        evento.target.closest(
                            "[data-excluir-galeria]"
                        );

                    if (excluir) {
                        excluirGaleria(
                            excluir.dataset
                                .excluirGaleria
                        );
                    }
                }
            );
    }


    /* =====================================================
       AVALIAÇÕES
    ===================================================== */

    function renderizarAvaliacoesAdmin() {
        const container =
            $("#listaAvaliacoesAdmin");

        const vazio =
            $("#avaliacoesVaziasAdmin");

        if (!container) {
            return;
        }

        const avaliacoes =
            obterAvaliacoes();


        if (!avaliacoes.length) {
            container.innerHTML = "";

            vazio?.classList.remove(
                "hidden"
            );

            return;
        }


        vazio?.classList.add(
            "hidden"
        );


        container.innerHTML =
            avaliacoes
                .slice()
                .reverse()
                .map(
                    (avaliacao) => {

                        const nota =
                            Number(
                                avaliacao.nota ||
                                avaliacao.rating ||
                                0
                            );

                        const estrelas =
                            "★".repeat(
                                Math.min(
                                    5,
                                    Math.max(
                                        0,
                                        nota
                                    )
                                )
                            );


                        return `
                            <div
                                class="crud-item"
                            >

                                <div
                                    class="crud-info"
                                >

                                    <strong>
                                        ${escapeHTML(
                                            avaliacao.nome ||
                                            avaliacao.cliente ||
                                            "Cliente"
                                        )}
                                    </strong>

                                    <small>
                                        <span
                                            style="
                                                color:#d71920;
                                                font-size:14px;
                                            "
                                        >
                                            ${estrelas}
                                        </span>

                                        ${
                                            avaliacao.data
                                                ? `
                                                    ·
                                                    ${dataFormatada(
                                                        avaliacao.data
                                                    )}
                                                `
                                                : ""
                                        }
                                    </small>

                                    <small>
                                        ${escapeHTML(
                                            avaliacao.comentario ||
                                            avaliacao.texto ||
                                            ""
                                        )}
                                    </small>

                                </div>


                                <div
                                    class="crud-actions"
                                >

                                    <button
                                        type="button"
                                        class="btn btn-small btn-secondary"
                                        data-editar-avaliacao="${escapeHTML(
                                            avaliacao.id
                                        )}"
                                    >
                                        ✏️ Editar
                                    </button>

                                    <button
                                        type="button"
                                        class="btn btn-small btn-danger"
                                        data-excluir-avaliacao="${escapeHTML(
                                            avaliacao.id
                                        )}"
                                    >
                                        🗑️ Excluir
                                    </button>

                                </div>

                            </div>
                        `;
                    }
                )
                .join("");
    }


    function excluirAvaliacao(id) {
        if (
            !window.confirm(
                "Excluir esta avaliação?"
            )
        ) {
            return;
        }

        const avaliacoes =
            obterAvaliacoes().filter(
                (item) =>
                    String(
                        item.id
                    ) !==
                    String(id)
            );

        salvarStorage(
            STORAGE_KEYS.avaliacoes,
            avaliacoes
        );

        renderizarAvaliacoesAdmin();

        mostrarToast(
            "Avaliação excluída.",
            "success"
        );
    }


    function configurarAvaliacoes() {
        $("#btnNovaAvaliacao")
            ?.addEventListener(
                "click",
                () =>
                    abrirModalAvaliacao()
            );

        $("#formAvaliacaoAdmin")
            ?.addEventListener(
                "submit",
                salvarAvaliacao
            );

        $("#listaAvaliacoesAdmin")
            ?.addEventListener(
                "click",
                (evento) => {

                    const btnExcluir =
                        evento.target.closest(
                            "[data-excluir-avaliacao]"
                        );

                    if (btnExcluir) {
                        excluirAvaliacao(
                            btnExcluir.dataset
                                .excluirAvaliacao
                        );
                        return;
                    }

                    const btnEditar =
                        evento.target.closest(
                            "[data-editar-avaliacao]"
                        );

                    if (btnEditar) {
                        abrirModalAvaliacao(
                            btnEditar.dataset
                                .editarAvaliacao
                        );
                    }
                }
            );
    }


    function abrirModalAvaliacao(id = null) {
        limparFormularioAvaliacao();

        if (id) {
            const avaliacoes = obterAvaliacoes();
            const avaliacao = avaliacoes.find(a => String(a.id) === String(id));

            if (avaliacao) {
                $("#avaliacaoId").value = avaliacao.id;
                $("#avaliacaoNome").value = avaliacao.nome || avaliacao.cliente || "";
                $("#avaliacaoEstrelas").value = avaliacao.nota || avaliacao.rating || 5;
                $("#avaliacaoTexto").value = avaliacao.comentario || avaliacao.texto || "";
                $("#tituloModalAvaliacao").textContent = "Editar avaliação";
            }
        } else {
            $("#tituloModalAvaliacao").textContent = "Nova avaliação";
        }

        abrirModal($("#modalAvaliacaoAdmin"));
    }


    function limparFormularioAvaliacao() {
        $("#formAvaliacaoAdmin")?.reset();
        if ($("#avaliacaoId")) {
            $("#avaliacaoId").value = "";
        }
    }


    function salvarAvaliacao(evento) {
        evento.preventDefault();

        const id = $("#avaliacaoId")?.value;
        const nome = $("#avaliacaoNome")?.value.trim();
        const nota = Number($("#avaliacaoEstrelas")?.value);
        const comentario = $("#avaliacaoTexto")?.value.trim();

        if (!nome || !comentario) {
            mostrarToast("Preencha todos os campos.", "error");
            return;
        }

        let avaliacoes = obterAvaliacoes();

        if (id) {
            // Editar
            avaliacoes = avaliacoes.map(a => {
                if (String(a.id) === String(id)) {
                    return {
                        ...a,
                        nome,
                        cliente: nome,
                        nota,
                        rating: nota,
                        comentario,
                        texto: comentario,
                        data: a.data || new Date().toISOString()
                    };
                }
                return a;
            });
        } else {
            // Novo
            const novaAvaliacao = {
                id: Date.now().toString(),
                nome,
                cliente: nome,
                nota,
                rating: nota,
                comentario,
                texto: comentario,
                data: new Date().toISOString(),
                ativa: true
            };
            avaliacoes.push(novaAvaliacao);
        }

        salvarStorage(STORAGE_KEYS.avaliacoes, avaliacoes);
        fecharModal($("#modalAvaliacaoAdmin"));
        renderizarAvaliacoesAdmin();
        mostrarToast(id ? "Avaliação atualizada." : "Avaliação adicionada.", "success");
    }


    /* =====================================================
       CONFIGURAÇÕES
    ===================================================== */

    function carregarConfiguracoes() {
        const config =
            obterConfig();

        $("#configNomeLoja").value =
            !config.nome ||
            config.nome === "Buena Pizza"
                ? "Gran Pizza"
                : config.nome;

        $("#configSlogan").value =
            config.slogan ||
            "Sabor que reúne.";

        $("#configEndereco").value =
            config.endereco ||
            "Bacabal - MA";

        $("#configWhatsApp").value =
            config.whatsapp ||
            "5598999999999";

        $("#configTaxaEntrega").value =
            Number(
                config.taxaEntrega ??
                5
            );

        $("#configEntregaAtiva").checked =
            config.entregaAtiva !== false;

        $("#configRetiradaAtiva").checked =
            config.retiradaAtiva !== false;


        const horarios =
            config.horarios ||
            {};


        const mapaDias = {
            domingo: "Domingo",
            segunda: "Segunda",
            terca: "Terca",
            quarta: "Quarta",
            quinta: "Quinta",
            sexta: "Sexta",
            sabado: "Sabado"
        };


        Object.entries(
            mapaDias
        ).forEach(
            ([chave, nome]) => {

                const horario =
                    horarios[chave] ||
                    {};

                const abertura =
                    $(
                        `#horario${nome}Abertura`
                    );

                const fechamento =
                    $(
                        `#horario${nome}Fechamento`
                    );

                if (abertura) {
                    abertura.value =
                        horario.abertura ||
                        "";
                }

                if (fechamento) {
                    fechamento.value =
                        horario.fechamento ||
                        "";
                }
            }
        );
    }


    function salvarConfiguracoes(
        evento
    ) {
        evento.preventDefault();

        const configAtual =
            obterConfig();


        const config = {
            ...configAtual,

            nome:
                $("#configNomeLoja")
                    ?.value.trim() ||
                "Gran Pizza",

            slogan:
                $("#configSlogan")
                    ?.value.trim() ||
                "",

            endereco:
                $("#configEndereco")
                    ?.value.trim() ||
                "",

            whatsapp:
                $("#configWhatsApp")
                    ?.value.trim() ||
                "",

            taxaEntrega:
                Number(
                    $("#configTaxaEntrega")
                        ?.value || 0
                ),

            entregaAtiva:
                Boolean(
                    $("#configEntregaAtiva")
                        ?.checked
                ),

            retiradaAtiva:
                Boolean(
                    $("#configRetiradaAtiva")
                        ?.checked
                ),

            horarios: {
                domingo:
                    obterHorario(
                        "Domingo"
                    ),

                segunda:
                    obterHorario(
                        "Segunda"
                    ),

                terca:
                    obterHorario(
                        "Terca"
                    ),

                quarta:
                    obterHorario(
                        "Quarta"
                    ),

                quinta:
                    obterHorario(
                        "Quinta"
                    ),

                sexta:
                    obterHorario(
                        "Sexta"
                    ),

                sabado:
                    obterHorario(
                        "Sabado"
                    )
            }
        };


        salvarStorage(
            STORAGE_KEYS.config,
            config
        );


        atualizarStatusLojaAdmin();

        mostrarToast(
            "Configurações salvas.",
            "success"
        );
    }


    function obterHorario(
        nome
    ) {
        return {
            abertura:
                $(
                    `#horario${nome}Abertura`
                )?.value ||
                "",

            fechamento:
                $(
                    `#horario${nome}Fechamento`
                )?.value ||
                ""
        };
    }


    function configurarConfiguracoes() {
        $("#formConfiguracoes")
            ?.addEventListener(
                "submit",
                salvarConfiguracoes
            );
    }


    /* =====================================================
       BACKUP
    ===================================================== */

    function coletarBackup() {
        return {
            versao: "1.0",

            aplicativo:
                "Gran Pizza",

            exportadoEm:
                new Date().toISOString(),

            dados: {
                produtos:
                    obterProdutos(),

                pedidos:
                    obterPedidos(),

                cupons:
                    obterCupons(),

                categorias:
                    obterCategorias(),

                config:
                    obterConfig(),

                galeria:
                    obterGaleria(),

                avaliacoes:
                    obterAvaliacoes(),

                fidelidade:
                    obterFidelidade(),

                configFidelidade:
                    obterConfigFidelidade()
            }
        };
    }


    function validarDadosBackup(dados) {
        if (
            !dados ||
            typeof dados !== "object" ||
            Array.isArray(dados)
        ) {
            return false;
        }

        const arrays = [
            "produtos",
            "pedidos",
            "cupons",
            "categorias",
            "galeria",
            "avaliacoes"
        ];

        if (
            arrays.some(
                chave =>
                    dados[chave] !== undefined &&
                    !Array.isArray(dados[chave])
            )
        ) {
            return false;
        }

        const objetos = [
            "config",
            "fidelidade",
            "configFidelidade"
        ];

        return !objetos.some(
            chave =>
                dados[chave] !== undefined &&
                (
                    !dados[chave] ||
                    typeof dados[chave] !== "object" ||
                    Array.isArray(dados[chave])
                )
        );
    }


    function exportarBackup() {
        const backup =
            coletarBackup();

        const conteudo =
            JSON.stringify(
                backup,
                null,
                2
            );

        baixarArquivo(
            conteudo,
            `backup-gran-pizza-${somenteData(
                new Date()
            )}.json`,
            "application/json;charset=utf-8;"
        );

        mostrarToast(
            "Backup exportado com sucesso.",
            "success"
        );
    }


    function importarBackup(
        arquivo
    ) {
        if (!arquivo) {
            return;
        }

        const leitor =
            new FileReader();

        leitor.onload = () => {

            try {

                const backup =
                    JSON.parse(
                        leitor.result
                    );

                const dados =
                    backup.dados ||
                    backup;


                if (!validarDadosBackup(dados)) {
                    throw new Error(
                        "Backup inválido."
                    );
                }


                const confirmar =
                    window.confirm(
                        "A restauração substituirá os dados atuais de produtos, pedidos, categorias, cupons, configurações, galeria, avaliações e fidelidade. Continuar?"
                    );


                if (!confirmar) {
                    return;
                }


                const chaves = [
                    "produtos",
                    "pedidos",
                    "cupons",
                    "categorias",
                    "config",
                    "galeria",
                    "avaliacoes",
                    "fidelidade",
                    "configFidelidade"
                ];


                chaves.forEach(
                    (chave) => {

                        if (
                            dados[chave] !==
                            undefined
                        ) {
                            salvarStorage(
                                STORAGE_KEYS[
                                    chave
                                ],
                                dados[chave]
                            );
                        }
                    }
                );


                carregarConfiguracoes();
                renderizarDashboard();
                renderizarPedidos();
                renderizarProdutosAdmin();
                renderizarCategoriasAdmin();
                renderizarCuponsAdmin();
                renderizarGaleriaAdmin();
                renderizarAvaliacoesAdmin();
                preencherFiltroCategorias();


                mostrarToast(
                    "Backup restaurado com sucesso.",
                    "success"
                );

            } catch (erro) {

                console.error(
                    erro
                );

                mostrarToast(
                    "Não foi possível restaurar o backup.",
                    "error"
                );
            }
        };


        leitor.onerror = () => {
            mostrarToast(
                "Erro ao ler o arquivo.",
                "error"
            );
        };


        leitor.readAsText(
            arquivo,
            "UTF-8"
        );
    }


    function baixarArquivo(
        conteudo,
        nome,
        tipo
    ) {
        const blob =
            new Blob(
                [conteudo],
                {
                    type: tipo
                }
            );

        const url =
            URL.createObjectURL(
                blob
            );

        const link =
            document.createElement(
                "a"
            );

        link.href = url;
        link.download = nome;

        document.body.appendChild(
            link
        );

        link.click();

        link.remove();

        URL.revokeObjectURL(
            url
        );
    }


    function configurarBackup() {
        $("#btnExportarBackup")
            ?.addEventListener(
                "click",
                exportarBackup
            );


        $("#btnImportarBackup")
            ?.addEventListener(
                "click",
                () => {
                    $("#inputImportarBackup")
                        ?.click();
                }
            );


        $("#inputImportarBackup")
            ?.addEventListener(
                "change",
                (evento) => {

                    const arquivo =
                        evento.target
                            .files?.[0];

                    importarBackup(
                        arquivo
                    );

                    evento.target.value =
                        "";
                }
            );
    }


    function configurarRelatorios() {
        $$("[data-filtro-relatorio]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const periodo = btn.dataset.filtroRelatorio;
                renderizarRelatorios(periodo);
            });
        });
    }


    /* =====================================================
       MODAIS
    ===================================================== */

    function abrirModal(
        modal
    ) {
        if (!modal) {
            return;
        }

        modal.classList.remove(
            "hidden"
        );

        document.body.style.overflow =
            "hidden";
    }


    function fecharModal(
        modal
    ) {
        if (!modal) {
            return;
        }

        modal.classList.add(
            "hidden"
        );

        const algumModalAberto =
            $$(".modal:not(.hidden)")
                .length > 0;

        if (!algumModalAberto) {
            document.body.style.overflow =
                "";
        }
    }


    function configurarModais() {
        $$("[data-fechar-modal]")
            .forEach(
                (elemento) => {

                    elemento.addEventListener(
                        "click",
                        () => {

                            const modal =
                                elemento.closest(
                                    ".modal"
                                );

                            fecharModal(
                                modal
                            );
                        }
                    );
                }
            );


        $$(".modal-overlay")
            .forEach(
                (overlay) => {

                    overlay.addEventListener(
                        "click",
                        () => {

                            const modal =
                                overlay.closest(
                                    ".modal"
                                );

                            fecharModal(
                                modal
                            );
                        }
                    );
                }
            );


        document.addEventListener(
            "keydown",
            (evento) => {

                if (
                    evento.key !==
                    "Escape"
                ) {
                    return;
                }

                $$(".modal:not(.hidden)")
                    .forEach(
                        fecharModal
                    );
            }
        );
    }


    /* =====================================================
       EVENTOS GERAIS
    ===================================================== */

    function configurarEventosGerais() {

        $("#btnLogout")
            ?.addEventListener(
                "click",
                fazerLogout
            );


        $("#btnFecharSidebar")
            ?.addEventListener(
                "click",
                fecharSidebarMobile
            );
    }


    /* =====================================================
       INICIALIZAÇÃO
    ===================================================== */

    function inicializarPainel() {

        configurarNavegacao();

        configurarSidebar();

        configurarEventosGerais();

        configurarPedidos();

        configurarProdutos();

        configurarCategorias();

        configurarCupons();

        configurarGaleria();

        configurarAvaliacoes();

        configurarFidelidade();

        configurarConfiguracoes();

        configurarBackup();

        configurarRelatorios();

        configurarModais();


        preencherFiltroCategorias();

        carregarConfiguracoes();

        renderizarDashboard();

        renderizarRelatorios();

        renderizarPedidos();

        renderizarProdutosAdmin();

        renderizarCategoriasAdmin();

        renderizarCuponsAdmin();

        renderizarGaleriaAdmin();

        renderizarAvaliacoesAdmin();

        carregarConfiguracaoFidelidade();

        renderizarFidelidadeAdmin();


        abrirSecao(
            "dashboard"
        );

        setInterval(
            atualizarStatusLojaAdmin,
            10000
        );

        // Atualização automática quando o localStorage mudar (novos pedidos)
        window.addEventListener("storage", (e) => {
            if (e.key === STORAGE_KEYS.pedidos) {
                renderizarDashboard();
                renderizarPedidos();
                renderizarFidelidadeAdmin();
                renderizarDetalheFidelidade();
                if ($("#secaoRelatorios")?.classList.contains("active")) {
                    renderizarRelatorios(filtroRelatorioAtual);
                }
            }
        });
    }


    /* =====================================================
       INICIALIZAÇÃO DO LOGIN
    ===================================================== */

    /* Sabores cadastrados como { nome, valor }; strings legadas permanecem utilizáveis. */
    function formatarValorSabor(valor) {
        const numero = Number(valor);
        return Number.isFinite(numero) ? numero.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "";
    }

    function converterValorSabor(valor) {
        const texto = String(valor ?? "").trim().replace(/^R\$\s*/i, "").replace(/\s/g, "");
        if (!texto) return null;
        const normalizado = /^\d+(?:\.\d{1,2})?$/.test(texto) ? texto : /^(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d{1,2})?$/.test(texto) ? texto.replace(/\./g, "").replace(",", ".") : null;
        const numero = Number(normalizado);
        return normalizado !== null && Number.isFinite(numero) && numero >= 0 ? numero : NaN;
    }

    function criarOpcaoSaborHTML(sabor = "") {
        const objeto = sabor && typeof sabor === "object" ? sabor : null;
        const nome = objeto ? objeto.nome || "" : sabor;
        const valor = objeto?.valor ?? objeto?.preco;
        const legado = !objeto || valor === undefined || valor === null || valor === "" || !Number.isFinite(Number(valor));
        return `<div class="opcao-sabor-admin" data-sabor-item data-sabor-original="${escapeHTML(objeto ? JSON.stringify(objeto) : "")}" data-sabor-legado-sem-valor="${legado}"><label class="campo-sabor-admin"><span>Nome do sabor</span><input type="text" data-sabor-nome placeholder="Ex.: Maracujá" value="${escapeHTML(nome)}"></label><label class="campo-sabor-admin"><span>Valor</span><span class="valor-sabor-admin"><span>R$</span><input type="text" inputmode="decimal" data-sabor-valor placeholder="0,00" value="${escapeHTML(formatarValorSabor(valor))}"></span></label><button type="button" class="btn btn-small btn-danger" data-remover-sabor>×</button></div>`;
    }

    function renderizarSaboresProduto(sabores = [], temSabores = false) {
        const checkbox = $("#produtoTemSabores");
        const container = $("#containerSaboresProduto");
        const lista = $("#listaSaboresProduto");
        if (!checkbox || !container || !lista) return;
        checkbox.checked = Boolean(temSabores || (Array.isArray(sabores) && sabores.length));
        container.classList.toggle("hidden", !checkbox.checked);
        lista.innerHTML = (Array.isArray(sabores) ? sabores : []).map(criarOpcaoSaborHTML).join("");
    }

    function adicionarSaborProduto() {
        $("#listaSaboresProduto")?.insertAdjacentHTML("beforeend", criarOpcaoSaborHTML(""));
    }

    function coletarSaboresProduto() {
        const sabores = [];
        for (const item of $("#listaSaboresProduto")?.querySelectorAll("[data-sabor-item]") || []) {
            const nome = item.querySelector("[data-sabor-nome]")?.value.trim() || "";
            const textoValor = item.querySelector("[data-sabor-valor]")?.value.trim() || "";
            if (!nome) continue;
            const valor = converterValorSabor(textoValor);
            const legado = item.dataset.saborLegadoSemValor === "true" && !textoValor;
            if (!legado && (valor === null || Number.isNaN(valor))) {
                mostrarToast(`Informe um valor válido para o sabor ${nome}.`, "error");
                item.querySelector("[data-sabor-valor]")?.focus();
                return null;
            }
            let original = null;
            try { original = item.dataset.saborOriginal ? JSON.parse(item.dataset.saborOriginal) : null; } catch (_) {}
            sabores.push(legado ? (original ? { ...original, nome } : nome) : { ...(original || {}), nome, valor });
        }
        return sabores;
    }

    document.addEventListener(
        "DOMContentLoaded",
        () => {

            configurarLogin();

            verificarLogin();

        }
    );

})();
