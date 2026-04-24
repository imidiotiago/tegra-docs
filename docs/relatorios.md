---
sidebar_position: 15
---

# Relatórios

O módulo de relatórios da Tegra cobre dois tipos distintos de necessidade: relatórios **regulatórios obrigatórios** (FIP, SRO e Quadro Estatístico para a SUSEP) e um **construtor self-service** para análise interna sob demanda.

## Relatórios Regulatórios SUSEP

Acessíveis em `/relatorios`, esses relatórios atendem às obrigações periódicas junto à SUSEP. Cada download registra automaticamente o status **GERADO** no painel de conformidade.

### FIP — Formulário de Informações Periódicas

Disponível em `/relatorios/fip`. Gera os cinco quadros obrigatórios para a competência selecionada:

- **Quadro 1 — Prêmios**: emitidos, cancelados e retidos por singular × produto
- **Quadro 2 — Sinistros**: avisados, em análise, **aprovados (PSL)**, pagos e negados — com valorAprovado para sinistros já comprometidos e valorReclamado como estimativa para pendentes
- **Quadro 3 — Provisões**: reserva exigida (mín. 40%), PSL atual e saldo disponível
- **Quadro 4 — Financeiro**: receitas, sinistros pagos, comissões e repasses
- **Quadro 5 — Cadastral**: cooperados, apólices ativas e produtos por singular

**Formatos de export**: XML (estruturado) e CSV (compatível Excel). Ambos incluem BOM UTF-8 para acentuação correta.

### SRO — Sinistros Reportados Ocorridos

Disponível em `/relatorios/sro`. Gera a listagem individual de todos os sinistros **avisados** na competência selecionada (data de registro no sistema).

Cada linha inclui: número do sinistro, produto, status, data de ocorrência, data de aviso, valor reclamado, valor aprovado e **reserva constituída (PSL)** calculada pelo critério regulatório:

- Status APROVADO → reserva = `valorAprovado` (já comprometido)
- Status ABERTO ou EM_ANALISE → reserva = `valorReclamado` (estimativa)
- Status PAGO ou NEGADO → reserva = zero (encerrado)

A aba "Totais" consolida por singular × produto: avisados, pendentes, pagos, negados, reserva total e total pago.

**Formato de export**: CSV com BOM UTF-8.

### Quadro Estatístico

Disponível em `/relatorios/quadro-estatistico`. Apresenta os índices regulatórios consolidados por singular × produto para a competência:

| Índice | Fórmula | Limiar de alerta |
|---|---|---|
| Sinistralidade | Sinistros pagos ÷ prêmio × 100 | Amarelo > 80%, Vermelho > 100% |
| Comissões % | Comissões pagas ÷ prêmio × 100 | Monitoramento |
| Repasses % | Repasses devidos ÷ prêmio × 100 | Monitoramento |
| **Índice combinado** | Soma dos três | **Vermelho > 100% (operação deficitária)** |

Além dos índices, o quadro consolida: apólices emitidas/ativas/canceladas, prêmio arrecadado, sinistros por status, valor pago e reserva PSL.

**Formato de export**: CSV com BOM UTF-8.

### IOF — Imposto sobre Operações Financeiras

Disponível em `/relatorios/iof`. Apuração mensal do IOF retido por apólice e competência, baseada nas alíquotas do Decreto 6.306/2007:

| Produto | Alíquota |
|---|---|
| AUTO, RESIDENCIAL, EMPRESARIAL | 7,38% |
| VIDA, SAÚDE | 0,38% |
| PREVIDÊNCIA | 0% |

### Prestação de Contas — Consolidado

Disponível em `/relatorios/susep`. Demonstrativo por período com visão consolidada de todas as singulares: apólices ativas, prêmio total, sinistros, sinistralidade e comissões.

## Report Builder Self-Service

Disponível em `/relatorios/builder`. Permite criar relatórios customizados sem depender de TI:

1. **Selecionar a entidade** — Apólices, Cooperados, Sinistros, Leads ou Pagamentos
2. **Escolher os campos** — checkboxes com todos os campos disponíveis
3. **Configurar filtros** — singular, período, status e outros filtros por entidade
4. **Gerar e exportar** — visualize na tela ou baixe em CSV

:::tip Independência de TI
O gestor cria seus próprios relatórios sob demanda — sem abrir chamado para a equipe técnica. Relatórios ad hoc em minutos.
:::

### Entidades e Campos Disponíveis

**Apólices**: número, produto, status, plano, prêmio mensal, desconto, vigência, segurado (nome, CPF, e-mail, telefone), singular.

**Cooperados**: nome, CPF, e-mail, telefone, data de nascimento, data de cadastro, singular.

**Sinistros**: número, produto, status, data de ocorrência, valor reclamado, valor aprovado, segurado (nome, CPF), singular.

**Leads**: nome, CPF, e-mail, telefone, CEP, produto de interesse, origem, estágio, prêmio estimado, responsável, singular.

**Pagamentos**: competência, valor, status, data de vencimento, data de pagamento, apólice (número, produto), segurado (nome, CPF), singular.

## Exportação

Todos os relatórios exportam em **CSV com BOM UTF-8** — compatível com Microsoft Excel, Google Sheets e qualquer ferramenta de BI (Power BI, Metabase, etc.).

## Controle de Acesso

| Relatório | Acesso |
|---|---|
| Builder — dados da própria singular | GESTOR_COOPERATIVA, OPERADOR_COOPERATIVA |
| Builder — dados de todas as singulares | ADMIN_CENTRAL |
| FIP / SRO / Quadro Estatístico | ADMIN_CENTRAL |
| IOF | ADMIN_CENTRAL |
| Prestação de Contas | ADMIN_CENTRAL |
| Provisões técnicas | GESTOR_COOPERATIVA, ADMIN_CENTRAL |

## Fluxo de Uso — Relatório de Apólices Ativas

1. **GESTOR_COOPERATIVA** acessa `/relatorios/builder`
2. Seleciona entidade "Apólices"
3. Campos: número, segurado (nome, CPF), produto, plano, prêmio, vigência, status
4. Filtros: singular = minha cooperativa, status = ATIVA
5. Gera e exporta CSV para análise no Excel

## Fluxo de Uso — Pacote Mensal SUSEP

1. **ADMIN_CENTRAL** aguarda o encerramento do mês
2. Acessa `/relatorios/fip` → competência do mês → baixa XML
3. Acessa `/relatorios/sro` → mesma competência → baixa CSV
4. Acessa `/relatorios/quadro-estatistico` → mesma competência → baixa CSV (verificação interna)
5. Envia FIP e SRO ao portal da SUSEP
6. Atualiza o status no painel de conformidade (`/admin/conformidade`)

![Report builder com seleção de campos](../static/img/screenshots/relatorios-builder.png)

:::info Captura sugerida
Interface do report builder dividida em três colunas: (1) seletor de entidade com cards clicáveis, (2) lista de campos com checkboxes, (3) filtros configuráveis. Preview do resultado abaixo com botão "Exportar CSV".
:::

![Painel financeiro com gráficos](../static/img/screenshots/relatorios-financeiro.png)

:::info Captura sugerida
Painel financeiro com gráfico de barras de arrecadação mensal, cards de KPI (prêmios do mês, inadimplência, comissões pendentes) e tabela de repasses por singular com status.
:::
