# Gran Pizza - Contexto Atual do Projeto

Este documento descreve o estado real do projeto analisado em 2026-09-13. Ele deve ser lido antes de qualquer alteração. O projeto usa armazenamento local no navegador e nao possui backend.

## 1. IDENTIDADE DO PROJETO

- Nome visual atual: **Gran Pizza**.
- Objetivo: apresentar o cardapio da pizzaria, permitir montar um pedido, finalizar pelo cliente, acompanhar o pedido e administrar produtos, pedidos, configuracoes, galeria, avaliacoes, relatorios e fidelidade.
- Tipo: aplicacao web client-side, composta por uma pagina publica e um painel administrativo separado.
- Persistencia: `localStorage` do navegador.
- Idioma da interface: portugues do Brasil.
- Identidade visual do cliente: preto, branco, vermelho italiano, verde italiano e superficies claras.
- Identidade visual do Admin: predominantemente preto, branco, cinza e vermelho; ha variaveis de verde, azul e perigo, alem de cores usadas nos botoes CRUD.
- Logo existente na raiz: `logo.jpeg.jpeg`.
- Logo usado pela pagina cliente: `logo.jpeg.jpeg`.
- Logo usado na tela de login Admin: `../logo.jpeg.jpeg`.
- Logo usado no cabecalho interno do Admin: `../logo.png`. Esse arquivo nao aparece na estrutura real listada; portanto essa referencia pode gerar falha de carregamento da imagem.
- Nome que deve aparecer visualmente para o usuario: Gran Pizza.
- Ocorrencias tecnicas de Buena Pizza ainda existentes:
  - As chaves do `localStorage` continuam com o nome `BuenaPizza` e nao devem ser renomeadas.
  - Ha valores/IDs e textos tecnicos legados, como `PRODUTOS_PADRAO`, `CUPONS_PADRAO`, descricoes de fallback e o nome de arquivo `backup-gran-pizza-...`.
  - A configuracao padrao em `script.js` ainda define `nome: "Buena Pizza"`, mas o HTML e a configuracao administrativa usam Gran Pizza em varios pontos. A chave de configuracao existente deve ser preservada.

## 2. ESTRUTURA DO PROJETO

A estrutura real encontrada na raiz e:

- `index.html`
  - Pagina publica do cliente.
  - Contem estrutura da loja, modais, carrinho, checkout, rastreamento, galeria, avaliacoes e referencia para `script.js`.
- `style.css`
  - Estilos da pagina publica.
  - Define variaveis de cor, tipografia, layout, responsividade, cardapio, carrinho, modais, galeria, avaliacoes e fidelidade do cliente.
- `script.js`
  - Logica da pagina publica.
  - Carrega dados do `localStorage`, renderiza produtos e categorias, controla carrinho/checkout, cria pedidos, envia WhatsApp, acompanha pedidos, renderiza galeria/avaliacoes e calcula fidelidade.
- `logo.jpeg.jpeg`
  - Arquivo de logo existente na raiz.
- `admin/`
  - Painel administrativo separado.
  - `admin/index.html`: login, navegacao, secoes administrativas e modais.
  - `admin/style.css`: estilos do painel administrativo.
  - `admin/script.js`: login local, CRUDs, pedidos, relatorios, configuracoes, backup, fidelidade e sincronizacao entre abas.

Nao foram encontrados outros arquivos ou subpastas na estrutura analisada.

## 3. PAGINA DO CLIENTE

### Header e navegacao

`index.html` possui:

- Marca com logo, link para `#inicio` e texto Gran Pizza.
- Links para Inicio, Cardapio, Sobre, Avaliacoes e Contato.
- Botao `Meus Pedidos`, que abre o modal de pedidos do cliente.
- Botao do carrinho com contador.
- Botao de menu mobile.

### Hero

A secao `#inicio` apresenta:

- Selo `Sabor que reúne`.
- Titulo promocional sobre pizza.
- Slogan dinamico em `#sloganLoja`.
- Link para o cardapio.
- Botao de WhatsApp.
- Status aberto/fechado, horario atual e endereco.
- Ilustracao textual de pizza (`🍕`).

### Categorias e catalogo

- `#listaCategorias` e preenchido por `renderizarCategorias()`.
- As categorias vem de `categoriasBuenaPizza`.
- Existe filtro por categoria em `#filtroCategoria`.
- Existe busca por texto em `#campoBusca`.
- `renderizarProdutos()` filtra produtos inativos e produtos com estoque menor ou igual a zero.
- Produtos sao exibidos em `#listaProdutos`.
- Cada card mostra categoria, nome, descricao, preco, imagem ou placeholder de pizza e botao de adicionar.
- O card inteiro abre o modal do produto; o botao de adicionar adiciona diretamente.

### Produto e modal

- `abrirModalProduto(id)` monta o modal a partir do produto encontrado.
- O modal mostra imagem, categoria, nome, descricao, tamanhos, adicionais e observacao.
- `adicionarProdutoDoModal()` coleta tamanho, adicionais e observacao.
- `adicionarProdutoAoCarrinho()` cria ou incrementa um item do carrinho.
- A assinatura do item considera produto, tamanho e adicionais.
- O item salvo no carrinho inclui `produtoId`, `nome`, `imagem`, `categoria`, `tamanho`, `adicionais`, `observacao`, `precoUnitario` e `quantidade`.

### Carrinho

- O carrinho e um drawer em `#carrinhoDrawer`.
- Os itens sao renderizados em `#itensCarrinho`.
- A quantidade total aparece em `#contadorCarrinho`.
- O resumo mostra subtotal, entrega e total.
- `alterarQuantidade()` respeita o estoque atual do produto.
- `removerDoCarrinho()` remove item.
- Dados do carrinho sao salvos em `carrinhoBuenaPizza`.
- O botao `Finalizar pedido` abre o checkout.

### Checkout

O formulario `#formCheckout` tem:

- Nome obrigatorio em `#clienteNome`.
- WhatsApp/telefone obrigatorio em `#clienteTelefone`.
- O JavaScript tambem exige telefone com 10 ou 11 digitos apos normalizacao.
- Entrega ou retirada por radio `tipoEntrega`.
- Endereco de entrega: rua, numero, bairro e complemento.
- Os campos rua, numero e bairro ficam obrigatorios apenas para entrega.
- Pagamento: PIX, dinheiro, cartao de credito ou cartao de debito.
- Campo de troco condicional para dinheiro.
- Cupom em `#codigoCupom`.
- Observacoes em `#observacoesPedido`.
- Resumo do pedido e total.

`criarPedido(evento)` valida carrinho, horario, nome, telefone, endereco, troco e estoque antes de salvar.

### Pedido criado

O pedido usa a estrutura existente em `pedidosBuenaPizza` e contem, entre outros:

- `id`
- `codigo` no formato `BP-######`
- `criadoEm`
- `status` inicial `novo`
- `clienteTelefone` normalizado
- `cliente.nome`
- `cliente.telefone`
- `tipoEntrega`
- `endereco`
- `itens`
- `subtotal`
- `desconto`
- `cupom`
- `taxaEntrega`
- `total`
- `pagamento`
- `trocoPara`
- `troco`
- `observacoes`

O estoque dos produtos e reduzido antes de salvar o pedido. O pedido e inserido no inicio do array e tambem salvo em `ultimoPedidoBuenaPizza`. O ID e salvo em `meusPedidosBuenaPizza`, limitado aos ultimos dez IDs.

### Sucesso, rastreamento e WhatsApp

- O modal `#modalPedidoSucesso` mostra o codigo criado.
- Ha botoes para enviar o pedido pelo WhatsApp, rastrear e fechar.
- `enviarPedidoWhatsApp()` monta mensagem com cliente, telefone, tipo, endereco, itens, resumo, pagamento, troco e observacoes.
- `rastrearPedido()` busca pelo codigo em memoria e mostra status, descricao, codigo e total.
- O cliente tem modal `Meus Pedidos`, baseado nos IDs de `meusPedidosBuenaPizza` e nos pedidos reais ainda presentes.
- O status e atualizado entre abas quando ocorre evento de storage para `pedidosBuenaPizza`.

### Horario e endereco

- `aplicarConfiguracao()` aplica nome, slogan, endereco, telefone do WhatsApp e horario.
- `atualizarHorarioLoja()` atualiza status e texto de horario.
- `lojaEstaAberta()` compara horario atual com a configuracao do dia.
- Horarios que fecham em horario menor ou igual a abertura sao tratados como atravessando meia-noite.
- O status e atualizado periodicamente a cada 10 segundos.

### Programa de fidelidade

A secao `#fidelidadeCliente` possui consulta por telefone, total de pizzas, progresso textual, recompensas e barra visual.

- `renderizarFidelidade()` consulta o telefone digitado.
- `obterDadosFidelidade()` usa pedidos reais.
- O cliente e identificado por telefone normalizado.
- So contam itens de pizza.
- Bebidas e combos nao contam.
- Pedidos com status `cancelado` nao contam.
- A quantidade do item e somada.
- A meta vem de `configFidelidadeBuenaPizza`, padrao 5.
- `Math.floor(totalPizzas / meta)` calcula recompensas.
- A consulta atual nao implementa resgate no cliente; o resgate existe no Admin.
- A renderizacao ocorre na inicializacao, ao digitar telefone, apos novo pedido e apos evento de alteracao de pedidos.

### Galeria

- A secao `#galeria` renderiza itens em `#listaGaleria`.
- `renderizarGaleria()` usa `item.imagem || item.url` como URL.
- Se nao houver imagem, mostra placeholder.
- Se o array estiver vazio, mostra `#galeriaVazia`.

### Avaliacoes

- A secao `#avaliacoes` renderiza cards em `#listaAvaliacoes`.
- `renderizarAvaliacoes()` filtra `ativa !== false` e limita a nove itens.
- Mostra estrelas, comentario, nome e avatar SVG generico.
- Se o array estiver vazio, mostra `#avaliacoesVazias`.
- O armazenamento e `avaliacoesBuenaPizza`.
- Nao existe chave separada de feedback no cliente.

### Outras secoes

- CTA para montar pedido.
- Rodape com atalhos, endereco, horario, telefone, pagamentos e link do Admin.
- Modal de produto.
- Modal de sucesso do pedido.
- Toast de mensagens.
- Modal de Meus Pedidos.

## 4. PAINEL ADMINISTRATIVO

O painel fica em `admin/index.html`, usa login local e so mostra o painel quando `adminLogado` e igual a `"true"`.

### Dashboard

Secao `#secaoDashboard`, renderizada por `renderizarDashboard()`:

- Total de pedidos.
- Faturamento de pedidos nao cancelados.
- Quantidade de produtos cadastrados.
- Pedidos pendentes, excluindo entregues e cancelados.
- Pedidos recentes.
- Resumo de estoque.

### Pedidos

Secao `#secaoPedidos`:

- Lista pedidos reais de `pedidosBuenaPizza`.
- Busca por nome, telefone ou codigo.
- Filtro por status.
- Filtro por periodo.
- Detalhes do pedido.
- Alteracao de status.
- Exportacao CSV.
- Status suportados: novo, recebido, confirmado, preparando, saiu_entrega, pronto, entregue e cancelado.
- `alterarStatusPedido()` altera somente o status e `atualizadoEm` do pedido e salva o array.
- O status atualizado e percebido pelo cliente via evento de storage.

### Produtos

Secao `#secaoProdutos`:

- Lista produtos de `produtosBuenaPizza`.
- Busca, filtro por categoria e filtro de estoque.
- Novo produto, editar e excluir.
- Formulario com nome, categoria, descricao, preco, estoque e imagem.
- Permite arquivo de imagem ou URL.
- Permite tamanhos e adicionais.
- `salvarProduto()` preserva campos existentes ao editar e salva em `produtosBuenaPizza`.
- A imagem de arquivo e convertida para Data URL via `FileReader`.
- A imagem tambem pode ser uma URL string.
- `renderizarProdutosAdmin()` exibe imagem do produto quando houver.
- `excluirProduto()` pede confirmacao e remove pelo ID.

### Categorias

Secao `#secaoCategorias`:

- Lista categorias de `categoriasBuenaPizza`.
- Cria, edita e exclui categorias.
- Campos: nome e ordem.
- Nao permite excluir categoria vinculada a produtos.
- A lista e ordenada pela ordem.

### Cupons

Secao `#secaoCupons`:

- Lista cupons de `cuponsBuenaPizza`.
- Cria, edita e exclui cupons.
- Campos: codigo, desconto percentual, pedido minimo, validade e ativo.
- O cliente valida codigo, validade, valor minimo e ativo ao aplicar cupom.

### Galeria

Secao `#secaoGaleria`:

- Lista itens de `galeriaBuenaPizza`.
- Adiciona, edita e exclui imagens.
- Campos: titulo, arquivo ou URL e descricao.
- Arquivos sao convertidos em Data URL.
- Ao salvar, o objeto inclui `id`, `titulo`, `url`, `imagem` e `descricao`.
- O Admin renderiza por `imagem.url || imagem.imagem`.
- O cliente renderiza por `item.imagem || item.url`.

### Avaliacoes e feedbacks

Secao `#secaoAvaliacoes`:

- Lista itens de `avaliacoesBuenaPizza`.
- Adiciona, edita e exclui avaliacoes.
- Campos: nome, estrelas e comentario.
- O objeto novo inclui `id`, `nome`, `cliente`, `nota`, `rating`, `comentario`, `texto`, `data` e `ativa`.
- A edicao preserva os campos existentes e atualiza os campos equivalentes.
- A exclusao remove por ID apos confirmacao.
- Nao existe sistema separado chamado feedback no codigo. O termo feedback aparece no texto de novo feedback, mas os registros administrativos sao avaliacoes.

### Fidelidade

Secao `#secaoFidelidade`:

- Configura programa ativo, meta de pizzas e descricao da recompensa.
- Lista clientes derivados dos pedidos com telefone.
- Mostra nome, telefone, pizzas, recompensas e ultimo pedido.
- `obterClientesFidelidade()` cruza `pedidosBuenaPizza`, `produtosBuenaPizza`, `fidelidadeBuenaPizza` e `configFidelidadeBuenaPizza`.
- Pizzas sao contadas por `produtoId` e categoria/nome; bebidas e combos sao excluidos.
- Pedidos cancelados sao excluidos.
- Ajustes manuais de pizzas e recompensas sao gravados em `fidelidadeBuenaPizza`.
- O Admin permite selecionar cliente, ver progresso, adicionar/remover pizzas, adicionar/remover recompensas e resgatar recompensa.
- Resgate incrementa `premiosResgatados`, registra entrada em `historico` e nao remove pedidos.
- A lista e atualizada ao receber evento de storage para `pedidosBuenaPizza`.

### Relatorios

Secao `#secaoRelatorios` possui filtros Hoje, Esta semana e Este mes.

`renderizarRelatorios()`:

- Exclui pedidos cancelados de faturamento e metricas gerais.
- Filtra por `criadoEm` ou `data`.
- Hoje compara a data local.
- Semana considera segunda-feira como inicio.
- Mes compara mes e ano.
- Calcula faturamento total.
- Calcula quantidade de pedidos validos.
- Calcula produtos vendidos somando `item.quantidade`.
- Calcula ticket medio como faturamento dividido por pedidos validos.
- Lista os cinco produtos mais vendidos por nome e quantidade.
- Lista pedidos por status incluindo cancelados no periodo.

### Configuracoes

Secao `#secaoConfiguracoes` edita `configBuenaPizza`:

- Nome da loja.
- Slogan.
- Endereco.
- WhatsApp.
- Taxa de entrega.
- Entrega ativa.
- Retirada ativa.
- Abertura e fechamento de domingo a sabado.

`salvarConfiguracoes()` faz merge com a configuracao atual antes de salvar.

### Horarios

- Sao parte de `configBuenaPizza.horarios`.
- Chaves dos dias: `domingo`, `segunda`, `terca`, `quarta`, `quinta`, `sexta`, `sabado`.
- Cada dia possui `abertura` e `fechamento`.
- O Admin mostra status aberto/fechado e tambem trata horarios que atravessam meia-noite.

### Backup

- `coletarBackup()` exporta produtos, pedidos, cupons, categorias, config, galeria e avaliacoes.
- O arquivo JSON contem `versao`, `aplicativo`, `exportadoEm` e `dados`.
- A importacao exige confirmacao e pode substituir os dados das chaves exportadas.
- O backup atual nao inclui explicitamente fidelidade nem `configFidelidade`.
- A restauracao e uma operacao destrutiva quando confirmada pelo usuario; futuras IAs devem preservar esta caracteristica e nao aciona-la automaticamente.

## 5. LOCALSTORAGE

As chaves abaixo sao definidas no `STORAGE_KEYS` de `script.js` e `admin/script.js`. Os nomes devem permanecer exatamente iguais.

| Chave | Finalidade | Estrutura | Arquivos |
|---|---|---|---|
| `produtosBuenaPizza` | Catalogo e estoque | Array de objetos de produto | Cliente e Admin |
| `carrinhoBuenaPizza` | Carrinho atual | Array de itens de carrinho | Cliente |
| `pedidosBuenaPizza` | Pedidos reais | Array de objetos de pedido | Cliente e Admin |
| `cuponsBuenaPizza` | Cupons de desconto | Array de cupons | Cliente e Admin |
| `categoriasBuenaPizza` | Categorias do catalogo | Array com id, nome, ativa e/ou ordem | Cliente e Admin |
| `configBuenaPizza` | Configuracao da loja | Objeto com nome, slogan, WhatsApp, taxa, endereco, flags e horarios | Cliente e Admin |
| `galeriaBuenaPizza` | Imagens da galeria | Array de objetos com id, titulo, url/imagem e descricao | Cliente e Admin |
| `avaliacoesBuenaPizza` | Avaliacoes exibidas | Array de objetos com nome, nota, comentario, data, ativa e aliases | Cliente e Admin |
| `fidelidadeBuenaPizza` | Ajustes manuais e resgates da fidelidade | Objeto indexado por telefone, com `pizzasCorrigidas`, `premiosCorrigidos`, `premiosResgatados`, `historico` e eventualmente nome | Cliente e Admin |
| `configFidelidadeBuenaPizza` | Configuracao da fidelidade | Objeto com `ativa`, `meta` e `premio` | Cliente e Admin |
| `ultimoPedidoBuenaPizza` | Ultimo pedido criado | Objeto de pedido ou nulo | Cliente |
| `meusPedidosBuenaPizza` | IDs dos pedidos do cliente atual | Array de IDs, limitado a dez no fluxo de criacao | Cliente |
| `adminLogado` | Sessao local do Admin | String `"true"` quando autenticado | Admin |

No codigo analisado nao existem chaves `GranPizza` para substituir as chaves `BuenaPizza`. As chaves `BuenaPizza` fazem parte do armazenamento atual e devem ser preservadas.

### Leitura e inicializacao

- `script.js` usa `obterStorage(chave, padrao)`.
- A funcao agora grava o padrao somente quando `localStorage.getItem(chave) === null`.
- Se a chave existir, inclusive com string vazia ou array vazio valido, o valor existente e lido e preservado.
- O Admin usa `lerStorage()`, que retorna o padrao quando nao encontra valor, sem gravar automaticamente durante a leitura.
- As variaveis de estado sao inicialmente declaradas como arrays/objetos vazios, mas sao preenchidas por `carregarDados()` ou pelos leitores do Admin; essas declaracoes nao substituem o localStorage.

## 6. PRODUTOS E IMAGENS

### Estrutura do produto

Produtos padrao demonstram estes campos:

- `id`
- `nome`
- `descricao`
- `categoria`
- `preco`
- `estoque`
- `ativo`
- `imagem`
- `destaque`
- `tamanhos`: array de `{ nome, preco }`
- `adicionais`: array de `{ nome, preco }`

O produto tambem pode conter `categoriaId` em registros administrados.

### Cadastro e edicao

- O Admin abre `formProdutoAdmin`.
- Pode selecionar arquivo de imagem ou informar URL.
- Arquivo e convertido em Data URL com `FileReader`.
- `salvarProduto()` valida nome e categoria, coleta os campos, preserva o objeto existente ao editar e salva em `produtosBuenaPizza`.
- Tamanhos e adicionais sao coletados das listas dinamicas.

### Exclusao

- `excluirProduto(id)` pede confirmacao.
- Remove o produto do array pelo ID e salva a nova lista.
- Nao ha exclusao automatica de produtos durante a leitura, exceto a rotina especifica de limpeza de itens relacionados a pastel.

### Exibicao

- Cliente: `criarCardProduto()` usa `produto.imagem`; se vazio, mostra placeholder.
- Modal cliente tambem usa `produto.imagem`.
- Admin: cards e preview usam `produto.imagem`.
- URLs devem permanecer no objeto de produto.

### Categorias padrao existentes no codigo

- Tradicionais
- Especiais
- Pizzas doces
- Combos
- Bebidas

A lista efetiva vem de `categoriasBuenaPizza`, portanto pode ser alterada pelo Admin.

## 7. GALERIA

- Cadastro pelo modal `formGaleriaAdmin`.
- Campos: titulo obrigatorio, arquivo ou URL, descricao.
- Arquivo e convertido em Data URL.
- `salvarGaleria()` salva `{ id, titulo, url, imagem, descricao }` em `galeriaBuenaPizza`.
- `renderizarGaleriaAdmin()` exibe `url || imagem`.
- `renderizarGaleria()` no cliente exibe `imagem || url`.
- Edicao reutiliza o ID e mescla o registro.
- Exclusao exige confirmacao e remove pelo ID.
- Array vazio mostra estado de galeria vazia; nao cria imagens ficticias.

## 8. AVALIACOES E FEEDBACKS

- Nao existe chave separada `feedbacksBuenaPizza`.
- O fluxo de feedback/avaliacao usa `avaliacoesBuenaPizza`.
- Cadastro pelo `formAvaliacaoAdmin`: nome, estrelas e comentario.
- Novo objeto inclui:
  - `id`
  - `nome`
  - `cliente`
  - `nota`
  - `rating`
  - `comentario`
  - `texto`
  - `data`
  - `ativa: true`
- Edicao aceita e preserva aliases antigos (`cliente`, `rating`, `texto`).
- Exclusao pede confirmacao e remove por ID.
- Cliente filtra `ativa !== false`, mostra de uma a cinco estrelas, comentario, nome e avatar SVG generico.
- Cliente limita a nove avaliacoes.
- Array vazio mostra `Ainda não temos avaliações`.

## 9. PEDIDOS

Fluxo real:

1. Cliente escolhe categoria/produto.
2. Produto entra no carrinho.
3. Cliente abre checkout.
4. Nome, telefone, entrega/retirada, endereco, pagamento, troco, cupom e observacoes sao validados.
5. Estoque e validado e reduzido.
6. Pedido e inserido em `pedidosBuenaPizza`.
7. Codigo `BP-######` e gerado.
8. Pedido e salvo em `ultimoPedidoBuenaPizza`; ID vai para `meusPedidosBuenaPizza`.
9. Cliente ve modal de sucesso, pode enviar WhatsApp ou rastrear.
10. Admin carrega pedidos, filtra, ve detalhes, exporta CSV e altera status.
11. Evento `storage` sincroniza alteracoes entre abas.

Status e descricoes sao definidos em `STATUS_PEDIDO` do cliente e em mapas equivalentes do Admin.

Campos salvos foram listados na secao de checkout. Itens preservam quantidade, produto, categoria, imagem, tamanho, adicionais, observacao e preco unitario.

## 10. FIDELIDADE

- Identificador: telefone normalizado, removendo caracteres nao numericos e, em certos formatos, o prefixo `55`.
- Telefone do pedido: `clienteTelefone`.
- Compatibilidade: leitura tambem considera `pedido.cliente.telefone` quando necessario.
- Contagem: itens cujo produto/categoria/nome representa pizza.
- Bebidas e combos sao excluidos.
- Quantidade do item e somada.
- Pedidos `cancelado` nao contam.
- Meta padrao: 5 pizzas.
- Recompensas calculadas: `Math.floor(pizzas / meta)`.
- Progresso: pizzas restantes no ciclo, `pizzas % meta`, e percentual.
- Cliente consulta pela secao publica usando telefone.
- Admin lista clientes derivados dos pedidos.
- Ajustes manuais ficam em `fidelidadeBuenaPizza`.
- Admin pode ajustar pizzas, ajustar recompensas e resgatar recompensa.
- Resgate incrementa `premiosResgatados`, adiciona evento em `historico` e nao apaga compras.
- Configuracoes ficam em `configFidelidadeBuenaPizza`.
- Alteracoes de pedidos via evento `storage` atualizam a lista do Admin e a exibicao da fidelidade no cliente.
- A secao publica nao possui botao de resgate; o resgate e administrativo.

## 11. RELATORIOS

O Admin possui filtros:

- Hoje.
- Esta semana.
- Este mes.

Indicadores:

- Faturamento total: soma `pedido.total` de pedidos nao cancelados.
- Pedidos: quantidade de pedidos nao cancelados no periodo.
- Produtos vendidos: soma das quantidades dos itens de pedidos validos.
- Ticket medio: faturamento dividido pela quantidade de pedidos validos.
- Produto mais vendido: ranking por nome, limitado aos cinco primeiros.
- Pedidos por status: contagem de todos os pedidos do periodo, incluindo cancelados.

O Dashboard separado exibe faturamento global nao cancelado, total de pedidos, total de produtos cadastrados, pendentes, pedidos recentes e estoque.

## 12. HORARIO DE FUNCIONAMENTO

- Configurado no Admin dentro de `formConfiguracoes`.
- Salvo em `configBuenaPizza.horarios`.
- Dias: domingo, segunda, terca, quarta, quinta, sexta e sabado.
- Cada dia tem `abertura` e `fechamento`.
- Cliente usa `lojaEstaAberta()` para bloquear pedidos fora do horario.
- Admin usa `atualizarStatusLojaAdmin()` para exibir o status.
- Cliente atualiza o status a cada dez segundos.
- Se fechamento for menor ou igual a abertura, o horario e tratado como atravessando meia-noite.

## 13. IDENTIDADE VISUAL

### Cliente: `style.css`

Variaveis principais:

- Vermelho italiano: `--red: #CE2B37`.
- Vermelho escuro: `--red-dark: #A5222C`.
- Vermelho claro: `--red-light: #FDE9EA`.
- Verde italiano: `--green: #009246`.
- Verde escuro: `--green-dark: #007A3A`.
- Verde claro: `--green-light: #E6F4ED`.
- Preto: `--black: #000000`.
- Preto claro: `--black-light: #1A1A1A`.
- Branco: `--white: #FFFFFF`.
- Texto: `--text: #1A1A1A`.
- Grafite: `--graphite: #000000`.
- Muted: `--muted: #666666`.
- Bordas: `--border: #EEEEEE`.
- Superficies claras: `#FFFFFF`, `#F5F5F5` e `#F9F9F9`.
- WhatsApp: `#25D366`, hover `#128C7E`.
- Status usam azuis, verdes, amarelo, laranja e vermelho claros em regras especificas.

A tipografia usa `Inter`, `system-ui`, `-apple-system`, `BlinkMacSystemFont` e `Segoe UI` como fallback.

### Admin: `admin/style.css`

Variaveis principais:

- `--red: #000000` e `--red-dark: #1A1A1A` na identidade atual do painel.
- `--green: #000000` e `--green-light: #F5F5F5`.
- `--white: #FFFFFF`.
- `--graphite: #000000`.
- `--gray: #666666`.
- `--gray-light: #F9F9F9`.
- `--gray-border: #EEEEEE`.
- `--danger: #DC2626`.
- Acoes CRUD adicionadas/estilizadas usam azul `#2563EB`, azul escuro `#1D4ED8`, verde `#16A34A`/`#15803D` e vermelho `#DC2626`/`#B91C1C`.
- O Admin usa bordas, sombras, transicoes e layout responsivo.

## REGRAS OBRIGATORIAS PARA ALTERACOES FUTURAS

1. Nunca apagar dados existentes do localStorage.
2. Nunca usar `localStorage.clear()`.
3. Nunca substituir dados existentes por arrays vazios durante a inicializacao.
4. So criar valores padrao quando a chave realmente nao existir (`valor === null`).
5. Nunca renomear as chaves existentes do localStorage sem autorizacao explicita.
6. Nunca criar um segundo sistema paralelo para uma funcionalidade que ja existe.
7. Antes de alterar uma funcionalidade, analisar sua implementacao atual.
8. Preservar funcionalidades existentes.
9. Fazer alteracoes pequenas e isoladas.
10. Nao alterar arquivos que nao sejam necessarios para a tarefa.
11. Nao criar dados ficticios.
12. Nao apagar produtos, imagens, avaliacoes, pedidos, galeria ou configuracoes existentes.
13. Antes de uma alteracao grande, informar quais arquivos serao modificados.
14. Apos a alteracao, informar exatamente o que foi alterado.
15. O nome visual do estabelecimento e GRAN PIZZA.
16. As chaves antigas `BuenaPizza` do localStorage devem permanecer funcionando enquanto forem utilizadas pelo sistema.

## 15. DEPENDENCIAS ENTRE ARQUIVOS

- `index.html` carrega `style.css` no `<head>` e `script.js` no final do `<body>`.
- `admin/index.html` carrega `admin/style.css` no `<head>` e `admin/script.js` no final do documento.
- Cliente e Admin nao importam modulos ES nem bibliotecas externas.
- Cliente e Admin compartilham o contrato de dados pelo `localStorage`, mas nao compartilham funcoes JavaScript diretamente.
- As duas paginas repetem suas proprias definicoes de `STORAGE_KEYS` e formatos de dados.
- A sincronizacao entre abas ocorre pelo evento global `storage`.
- A ordem do cliente e: carregar dados, aplicar configuracao, renderizar categorias/produtos/carrinho/galeria/avaliacoes/fidelidade, configurar eventos e timers.
- A ordem do Admin e: configurar login, verificar sessao, registrar navegacao/eventos, carregar configuracoes, renderizar secoes e registrar sincronizacao de pedidos.
- Nao ha backend, banco remoto, pacote ou framework identificado no projeto.

## 16. BUGS E CORRECOES IMPORTANTES

Itens confirmados pelo estado atual do codigo:

- A leitura do cliente foi protegida para usar `valor === null`; isso evita gravar o padrao quando a chave ja existe.
- A galeria do cliente aceita tanto `item.imagem` quanto `item.url`, mantendo compatibilidade com os formatos usados pelo Admin.
- A contagem de fidelidade ignora bebidas, combos, pedidos cancelados e pedidos antigos sem telefone.
- A pagina cliente e o Admin usam chaves `BuenaPizza`; nao criar chaves `GranPizza` paralelas.
- A rotina `limparDadosPastel()` remove somente produtos/categorias/carrinho identificados como pastel. Ela e executada na inicializacao e deve ser tratada como comportamento existente, nao como uma limpeza geral de dados.
- O backup importado pelo Admin pode substituir dados existentes somente depois de confirmacao explicita. Nao executar importacao automaticamente.
- O Admin referencia `../logo.png` no cabecalho, enquanto a estrutura listada possui `logo.jpeg.jpeg`; preservar essa observacao e nao corrigir sem tarefa especifica.
- Na analise do navegador, as chaves de produtos, galeria, avaliacoes, pedidos, categorias, cupons, configuracao e fidelidade estavam presentes; os conteudos concretos dependem do perfil/origem do navegador e nao devem ser recriados a partir deste documento.

## 17. ESTADO ATUAL DO PROJETO

### Funcionando

- Pagina publica com hero, catalogo, busca, categorias, carrinho e checkout.
- Telefone obrigatorio e associado ao pedido.
- Pedidos salvos em `pedidosBuenaPizza` com codigo e status.
- Acompanhamento por codigo.
- WhatsApp para pedido.
- Horario aberto/fechado com suporte a meia-noite.
- Galeria e avaliacoes quando existem registros validos nas chaves.
- Programa de fidelidade por telefone.
- Admin com login local, Dashboard, Pedidos, Produtos, Categorias, Cupons, Galeria, Avaliacoes, Fidelidade, Configuracoes, Backup e Relatorios.
- Sincronizacao entre abas para pedidos, produtos, categorias, galeria e avaliacoes no cliente; pedidos no Admin.
- Protecao contra inicializacao que grava padrao sobre chave existente.

### Implementado

- CRUD administrativo de produtos, categorias, cupons, galeria e avaliacoes.
- Upload de imagens como Data URL e uso de URLs.
- Ajustes e resgate da fidelidade no Admin.
- Configuracao de loja, entrega, retirada, WhatsApp e horarios.
- Exportacao CSV de pedidos.
- Exportacao e importacao JSON de parte dos dados.

### Pendente ou ausente

- Nao existe backend ou banco de dados remoto.
- Nao existe uma chave separada para feedbacks.
- O backup atual nao inclui fidelidade nem configuracao de fidelidade.
- O cliente nao possui fluxo proprio para resgatar recompensa.
- A referencia `../logo.png` do cabecalho Admin nao corresponde ao arquivo de logo listado na estrutura real.
- O valor padrao tecnico em `CONFIG_PADRAO.nome` ainda e `Buena Pizza`, embora o nome visual esperado seja Gran Pizza e a configuracao possa ser alterada pelo Admin.

### Pontos de atencao

- Preservar todas as chaves `BuenaPizza`.
- Nao chamar `setItem` com padrao durante inicializacao quando a chave existir.
- Nao interpretar array vazio existente como ausencia de dados.
- Nao apagar registros por causa de falha de URL, imagem quebrada ou campo legado.
- Antes de alterar formatos de produto, galeria, avaliacao ou pedido, suportar os campos antigos (`imagem`/`url`, `comentario`/`texto`, `nota`/`rating`).
- Validar sempre com dados reais do `localStorage` e conferir que os valores permanecem apos recarregar as duas paginas.

Histórico de Alterações — Projeto Gran Pizza

Documento organizado a partir do histórico de interações com o Copilot, cobrindo todas as fases de implementação, correção e ajustes visuais do projeto.

Fase 1 — Fidelidade (Parte 1: Base)

Pedido: Criar a base do programa de fidelidade ("5 pizzas = 1 pizza G grátis"), sem interface visual ainda.

Implementado em script.js:

Telefone tornado obrigatório no checkout (validação de 10/11 dígitos).
Pedido salvo com clienteTelefone normalizado.
Contagem de pizzas baseada nos pedidos reais (por produtoId e quantidade).
Bebidas, combos, pedidos cancelados e pedidos sem telefone não contam.
Cálculo de prêmios acumuláveis (5 = 1, 10 = 2, etc.).

Testes: 2 pizzas + 3 bebidas = 2 pizzas; cancelados não contam; marcos de 5/10 pizzas validados.

Fase 2 — Seção de Fidelidade no cliente

Pedido: A seção "🍕 Programa de Fidelidade" não aparecia na página do cliente.

Causa identificada: a lógica existia em script.js, mas não havia HTML/CSS para renderizar a seção.

Arquivos alterados: index.html, script.js, style.css.

Implementado:

Seção HTML com consulta por telefone.
Exibição de pizzas acumuladas, progresso (ex.: 3/5), prêmios disponíveis e barra visual.
Atualização automática após novos pedidos.
Fase 3 — Painel Admin de Fidelidade

Pedido: Criar aba "🍕 Fidelidade" no Admin com controle completo.

Arquivos alterados: admin/index.html, admin/script.js, admin/style.css.

Funções criadas: normalizarTelefoneFidelidade, produtoEhPizzaFidelidade, contarPizzasFidelidade, obterClientesFidelidade, obterClienteFidelidade, salvarAjusteFidelidade, renderizarFidelidadeAdmin, renderizarDetalheFidelidade, abrirDetalheFidelidade, ajustarFidelidade, resgatarFidelidade, salvarConfiguracaoFidelidade, carregarConfiguracaoFidelidade, configurarFidelidade.

Recursos:

Lista de clientes (nome, telefone, pizzas, recompensas, último pedido).
Ajuste manual de pizzas/recompensas.
Botão "Resgatar recompensa" (reduz contagem, registra histórico, não apaga pedidos).
Configuração: ativar/desativar, meta de pizzas, descrição do prêmio.
Atualização automática com novos pedidos.

Testes confirmados: bebidas não contam; cancelados não contam; 5 pizzas = 1 prêmio; resgate funcional; ajustes manuais persistem.

Fase 4 — Seção "Sobre" e botões do Admin

Pedido: Duas alterações isoladas.

Seção "Sobre": texto "Sobre a Buena Pizza" → "Sobre a Gran Pizza", com novo conteúdo institucional (sem alterar o restante da página).
Botões do Admin: estilo profissional para Adicionar (azul/➕), Editar (verde/✏️) e Excluir (vermelho/🗑️), com bordas arredondadas, hover, elevação, transições suaves e cursor: pointer.

Arquivos alterados: index.html, admin/style.css, admin/index.html (rótulos de botões).

Sem alteração: JavaScript, lógica, localStorage, formulários.

Fase 5 — Diagnóstico: dados desaparecidos (1ª rodada, com correção)

Pedido: Produtos, galeria, feedbacks e avaliações desapareceram após as últimas modificações.

Diagnóstico:

Chaves antigas (*BuenaPizza) continuavam em uso; nenhuma migração para GranPizza.
Sem localStorage.clear().
No ambiente analisado, galeriaBuenaPizza e avaliacoesBuenaPizza já estavam vazios ([]) e produtosBuenaPizza tinha apenas 2 registros de teste sem imagem — ou seja, não havia dados antigos recuperáveis naquele navegador.
Incompatibilidade encontrada: a galeria administrativa aceitava campo url, mas o cliente só lia imagem.

Correção aplicada (mínima): script.js passou a ler item.imagem || item.url na galeria.

Fase 6 — Diagnóstico repetido (somente leitura, sem correção)

Pedido: Diagnóstico puro, sem qualquer correção, classificando o problema em A–E.

Resultado: classificado como (A) dados apagados/ausentes no localStorage atual — não era caso de dados salvos e ignorados (B), nem de renderização quebrada (C), nem de URLs quebradas (D), nem de mudança de nomes de chave (E).

Conclusão: sem backup ou outra origem do navegador, os dados não podiam ser recuperados sem recriação.

Fase 7 — Segurança do armazenamento (localStorage)

Pedido: Garantir que chaves existentes nunca sejam sobrescritas por arrays vazios.

Risco encontrado: em script.js, obterStorage() usava if (!valor), tratando qualquer valor "falsy" como inexistente e podendo regravar o padrão.

Correção: alterado para if (valor === null) — só cria o padrão quando a chave realmente não existe.

Arquivo alterado: script.js (único arquivo).

Fase 8 — Criação do context.md

Pedido: Documentação completa e fiel do estado atual do projeto, para uso por outras IAs.

Ação: análise integral de index.html, style.css, script.js, admin/index.html, admin/style.css, admin/script.js, sem alterar nenhum arquivo existente.

Resultado: criado context.md na raiz, cobrindo estrutura, páginas, localStorage (todas as chaves reais), produtos/imagens, galeria, avaliações, pedidos, fidelidade, relatórios, horários, identidade visual, dependências entre arquivos, bugs conhecidos, regras obrigatórias para futuras IAs e estado atual.

Fase 9 — Auditoria completa (somente análise)

Pedido: Relatório de problemas/bugs, sem qualquer alteração.

Resumo dos achados (23 itens):

🔴 Crítico
admin/index.html carregava ../script.js (lógica da loja) dentro do Admin.
limparDadosPastel() apagava produtos/categorias/carrinho automaticamente por conterem "pastel".
Armazenamento 100% client-side (localStorage), sem backend.
Login do Admin facilmente contornável (usuário/senha fixos + flag no localStorage).
Backup não incluía fidelidade; restauração substituía dados sem validação robusta.
🟠 Importante
Estrutura de cupons incompatível entre Admin (desconto) e cliente (tipo/valor).
WhatsApp usava item.preco, mas o carrinho salvava precoUnitario.
Detalhes do pedido no Admin liam campos de preço inexistentes.
entregaAtiva/retiradaAtiva não eram respeitados no checkout.
Fidelidade desativada no Admin continuava ativa no cliente.
Ajustes/resgates do Admin não refletiam no cálculo do cliente.
Filtro de categoria por ID podia ocultar produtos salvos com nome de categoria.
Importação de backup validava pouco a estrutura.
Relatórios inseriam nomes sem escape (innerHTML).
"Meus Pedidos" inseria código/status sem escape.
🟡 Médio

16–20. Estado vazio de avaliações mal tratado; divergência de preço Admin vs. cliente; JSON corrompido tratado silenciosamente; pedidos carregados duas vezes; nome padrão ainda "Buena Pizza".

🔵 Visual
Logo do Admin quebrada (../logo.png inexistente; arquivo real é logo.jpeg.jpeg).
var(--muted) usada sem estar declarada no CSS do Admin.
Título/textos ainda exibindo "Buena Pizza" em certos cenários.
🟢 OK

Carregamento de ambas as páginas, navegação, produtos/categorias, telefone obrigatório, WhatsApp opcional, entrega/retirada básicas, pedidos com código, status não regressivo, fidelidade básica, chaves preservadas, sem clear().

Fase 10 — Correção dos problemas CRÍTICOS

Pedido: Corrigir somente os 5 itens críticos da auditoria.

Arquivos alterados: admin/index.html, script.js, admin/script.js.

Correções:

Removida a tag <script src="../script.js"> do Admin — Admin passa a rodar apenas admin/script.js.
limparDadosPastel() desativada (no-op) em ambos os arquivos — nenhuma exclusão automática.
Backup (coletarBackup) passou a incluir fidelidadeBuenaPizza e configFidelidadeBuenaPizza.
Nova função validarDadosBackup() — rejeita backups inválidos antes de gravar qualquer dado; compatível com backups antigos sem fidelidade.
Mantida a proteção if (valor === null) em obterStorage().
Login do Admin não foi alterado (fora de escopo) — limitação documentada.

Verificação: todas as chaves testadas permaneceram idênticas após recarregar; produtos, galeria, avaliações, pedidos e fidelidade preservados.

Fase 11 — Correção de funcionalidades (Prioridade 2)

Pedido: Corrigir cupons, valores de pedidos, WhatsApp, entrega/retirada, fidelidade, categorias, galeria, avaliações, relatórios, acompanhamento de pedido, horário e produtos/estoque.

Arquivos alterados: script.js, admin/script.js, index.html, admin/index.html.

Principais correções:

Cupons: função normalizarCupom() unifica os formatos salvos pelo Admin e lidos pelo cliente (percentual/fixo), com compatibilidade retroativa.
Preços: padronização em torno de precoUnitario no checkout, WhatsApp e detalhes do pedido no Admin — elimina valores R$ 0,00 por divergência de nome de campo.
WhatsApp: enviarPedidoWhatsApp() corrigida para montar a mensagem com dados reais do pedido salvo; pedido continua sendo salvo mesmo sem envio.
Entrega/Retirada: atualizarSecaoEndereco()/atualizarOpcoesEntrega() passam a respeitar entregaAtiva/retiradaAtiva, com seleção automática quando só uma modalidade está ativa.
Fidelidade: obterDadosFidelidade()/renderizarFidelidade() passam a considerar ajustes/resgates do Admin e a regra configFidelidade.ativa (oculta a seção sem apagar histórico).
Categorias: filtro do Admin passa a comparar tanto o ID quanto o nome da categoria.
Avaliações: mensagem amigável quando não há avaliações ativas.
Horário: tratamento de horários incompletos (evita undefined às undefined).

Testes (com snapshot/restauração do localStorage, sem perda de dados):

Cupom fixo aplicado corretamente (R$45 − R$10 = R$35), refletido em pedido e detalhes.
Retirada desativada ficou oculta; entrega única selecionada automaticamente.
Fidelidade: 5 pizzas = 1 prêmio; bebidas não contam; promoção desativada oculta a seção.
Filtro de categoria encontrou produto salvo por nome.
Relatórios "Hoje/Semana/Mês" responderam corretamente aos filtros.
Status alterado no Admin não regrediu e chegou ao cliente.

Pendências reconhecidas (fora de escopo): login ainda local; sem backend; logo do Admin ainda pendente nesta fase (corrigida na Fase 12).

Fase 12 — Correções visuais (Prioridade 4)

Pedido: Corrigir 3 problemas visuais: logo do Admin, --muted e padronização do nome "Gran Pizza".

Arquivos alterados: admin/index.html, admin/style.css, index.html, script.js, admin/script.js.

Correções:

Logo do Admin: caminho corrigido de ../logo.png para ../logo.jpeg.jpeg (arquivo real).
--muted: variável declarada em admin/style.css (--muted: #666666), coerente com a paleta existente.
Nome visual "Gran Pizza": rodapé, copyright, título, cabeçalho do Admin e fallback padrão de configuração corrigidos. O valor antigo "Buena Pizza" eventualmente salvo em configBuenaPizza é mantido intacto no armazenamento, mas exibido visualmente como "Gran Pizza" (chaves do localStorage não foram renomeadas).

Testes: logo carregando (613px), nenhuma imagem quebrada, --muted computado corretamente, título/marca/rodapé/Admin exibindo "Gran Pizza", chaves e conteúdo de configBuenaPizza preservados.

Fase 13 — Imagem do chef na seção "Sobre"

Pedido: Substituir o emoji 🍕 da seção "Sobre a Gran Pizza" pela imagem pngtree-cartoon-chef-with-pizza-plate-delicious-italian-dish-presentation-png-image_19773314.png.

Arquivos alterados: index.html, style.css.

Alteração: emoji substituído por <img> dentro de #sobre .about-icon, com alt="Chef da Gran Pizza" e object-fit: contain. Emojis 🚀 e ❤️ preservados; textos inalterados.

Fase 14 — Aumento da imagem do chef ("Sobre")

Pedido: Aumentar o destaque visual da imagem do chef na seção "Sobre".

Arquivo alterado: style.css.

Alteração: .about-icon ampliado (até 360px no desktop, 320px/80vw em tablet, 260px/78vw em celular), mantendo proporção via object-fit: contain.

Fase 15 — Imagem do chef no HERO

Pedido: Substituir o emoji 🍕 do HERO (próximo ao título "A pizza que deixa qualquer momento melhor.") pela imagem pngtree-cartoon-chef-holding-pizza-png-image_15105925.png.

Arquivos alterados: index.html, style.css.

Alteração: emoji substituído por <img> dentro de .hero-pizza, com alt="Chef segurando uma pizza" e object-fit: contain. Título, textos e botões preservados.

Fase 16 — Aumento da imagem do chef no HERO

Pedido: Aumentar bastante o tamanho da imagem do chef no HERO, sem distorcer e mantendo responsividade.

Arquivo alterado: style.css.

Alteração: .hero-pizza img ampliada para 140% no desktop e 125% nos breakpoints móveis, com object-fit: contain preservando a proporção e evitando overflow no celular.

Consolidado — Chaves do localStorage (preservadas em todas as fases)
Chave	Uso
produtosBuenaPizza	Produtos do cardápio
carrinhoBuenaPizza	Carrinho do cliente
pedidosBuenaPizza	Pedidos realizados
cuponsBuenaPizza	Cupons de desconto
categoriasBuenaPizza	Categorias de produtos
configBuenaPizza	Configurações gerais (nome, horários, WhatsApp, entrega/retirada)
galeriaBuenaPizza	Imagens da galeria
avaliacoesBuenaPizza	Avaliações de clientes
fidelidadeBuenaPizza	Ajustes manuais e resgates de fidelidade
configFidelidadeBuenaPizza	Configuração do programa de fidelidade
ultimoPedidoBuenaPizza	Último pedido do cliente
meusPedidosBuenaPizza	Histórico de pedidos do cliente

Nenhuma chave foi renomeada, apagada ou substituída em nenhuma fase. Todas as correções seguiram a regra: nunca sobrescrever dados existentes automaticamente.

Pendências conhecidas (não corrigidas, fora de escopo até o momento)
Autenticação do Admin ainda baseada em usuário/senha fixos + flag no localStorage (exigiria backend).
Armazenamento 100% client-side, sem validação server-side.
Uploads/CRUD de imagens de produtos dependem inteiramente dos dados salvos no navegador.

