---
sidebar_position: 15
---

# Relatórios

O módulo de relatórios da Tegra oferece um construtor self-service que permite a gestores e administradores criar, filtrar e exportar relatórios customizados sem depender de TI. A abordagem declarativa do catálogo de entidades facilita a expansão futura com novas entidades e campos sem mudanças de interface.

## Report Builder Self-Service

O construtor de relatórios está disponível em `/relatorios/builder` e funciona em três passos:

1. **Selecionar a entidade** — escolha qual conjunto de dados analisar
2. **Escolher os campos** — marque os campos que devem aparecer no relatório
3. **Configurar filtros** — filtre por singular, período, status, etc.
4. **Gerar e exportar** — visualize os dados na tela ou baixe em CSV

Não há limite de colunas ou linhas — o sistema gera o relatório completo e permite download em CSV para análise em Excel ou ferramentas de BI.

:::tip Independência de TI
O construtor permite que o gestor da cooperativa crie seus próprios relatórios sob demanda, sem precisar abrir chamado para a equipe técnica. Relatórios ad hoc em minutos, não dias.
:::

## Entidades Disponíveis

O catálogo de entidades cobre os cinco objetos centrais da operação:

### Apólices

Campos disponíveis:
- Número da apólice, produto, status, plano
- Prêmio mensal, prêmio bruto, desconto aplicado (% e valor)
- Início e fim de vigência, data de emissão
- Cooperativa singular (nome)
- Segurado: nome, CPF, e-mail, telefone

Filtros: singular, período de emissão, status (ATIVA, SUSPENSA, CANCELADA, VENCIDA)

### Cooperados

Campos disponíveis:
- Nome, CPF, e-mail, telefone
- Data de nascimento, data de cadastro
- Cooperativa singular

Filtros: singular, período de cadastro

### Sinistros

Campos disponíveis:
- Número do sinistro, produto, status
- Data da ocorrência, valor reclamado, valor aprovado
- Segurado: nome, CPF
- Cooperativa singular

Filtros: singular, período de ocorrência, status

### Leads

Campos disponíveis:
- Nome, CPF, e-mail, telefone
- CEP, produto de interesse, origem do lead
- Estágio no funil, prêmio estimado
- Responsável, data de criação
- Cooperativa singular

Filtros: singular, período, estágio, produto, origem

### Pagamentos

Campos disponíveis:
- Competência, valor, status
- Data de vencimento, data de pagamento
- Apólice: número e produto
- Segurado: nome, CPF
- Cooperativa singular

Filtros: singular, competência, status (PENDENTE, PAGO, ATRASADO, CANCELADO)

## Relatórios Específicos do Módulo Financeiro

Além do builder genérico, o módulo financeiro disponibiliza relatórios pré-construídos:

### Fluxo de Caixa

Visão consolidada de entradas e saídas por período:
- Prêmios arrecadados por mês
- Sinistros pagos por mês
- Repasses realizados para a federação
- Saldo líquido por período

### Provisões Técnicas

Relatório regulatório de provisões por competência:
- Prêmio total do mês
- Percentual de reserva aplicado
- Valor de reserva calculado
- Situação (ADEQUADA ou INSUFICIENTE)

### Comissões por Competência

Detalhamento de comissões por apólice em cada período:
- Apólice, produto, prêmio, percentual de comissão, valor
- Status do pagamento da comissão

### Repasses por Singular

Para o ADMIN_FEDERACAO: visão consolidada de repasses de todas as singulares:
- Valor devido, valor pago, saldo
- Status por competência
- Singulares em atraso destacadas

## Relatório FIP para SUSEP

O módulo de conformidade gera automaticamente os dados necessários para o preenchimento do FIP (Formulário de Informações Periódicas) exigido pela SUSEP. O relatório consolida por competência:

- Total de apólices emitidas por produto
- Prêmios arrecadados por produto
- Sinistros registrados e valores
- Provisões técnicas constituídas

## Exportação

Todos os relatórios suportam exportação em **CSV** — formato compatível com Microsoft Excel, Google Sheets e qualquer ferramenta de BI (Power BI, Metabase, etc.).

O arquivo CSV inclui:
- Cabeçalho com os labels dos campos selecionados em português
- Uma linha por registro
- Formatação de valores monetários como decimais
- Formatação de datas no padrão brasileiro (DD/MM/AAAA)

## Controle de Acesso aos Relatórios

| Relatório | Acesso |
|---|---|
| Builder — dados da própria singular | GESTOR_COOPERATIVA, OPERADOR_COOPERATIVA |
| Builder — dados de todas as singulares | ADMIN_FEDERACAO |
| Financeiro (fluxo de caixa, repasses) | GESTOR_COOPERATIVA, ADMIN_FEDERACAO |
| Provisões técnicas | GESTOR_COOPERATIVA, ADMIN_FEDERACAO |
| FIP/SRO (conformidade SUSEP) | ADMIN_FEDERACAO |

## Fluxo de Uso — Relatório de Apólices Ativas

1. **GESTOR_COOPERATIVA** acessa `/relatorios/builder`
2. Seleciona entidade "Apólices"
3. Marca os campos: número, segurado (nome, CPF), produto, plano, prêmio, vigência, status
4. Configura filtros: singular = sua cooperativa, status = ATIVA, período = mês atual
5. Clica em "Gerar Relatório"
6. Visualiza na tela a tabela com os dados
7. Clica em "Exportar CSV" para baixar e abrir no Excel

## Fluxo de Uso — Relatório de Inadimplência

1. **GESTOR_COOPERATIVA** acessa `/relatorios/builder`
2. Seleciona entidade "Pagamentos"
3. Campos: segurado, apólice, competência, valor, data vencimento, status
4. Filtros: status = ATRASADO, período = últimos 3 meses
5. Gera e exporta CSV
6. Usa o arquivo para acionamento de cobrança ou envio de WhatsApp em lote

![Report builder com seleção de campos](../static/img/screenshots/relatorios-builder.png)

:::info Captura sugerida
Interface do report builder dividida em três colunas: (1) seletor de entidade com cards clicáveis, (2) lista de campos com checkboxes e tipo de dado, (3) filtros configuráveis. Preview do resultado abaixo com paginação e botão "Exportar CSV".
:::

![Painel financeiro com gráficos](../static/img/screenshots/relatorios-financeiro.png)

:::info Captura sugerida
Painel financeiro com gráfico de barras de arrecadação mensal, cards de KPI (prêmios do mês, inadimplência, comissões pendentes), e tabela de repasses por singular com status.
:::
