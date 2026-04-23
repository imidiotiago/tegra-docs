---
sidebar_position: 11
---

# Sinistros

O módulo de sinistros da Tegra gerencia todo o processo de avisos, instrução e liquidação de ocorrências seguradas. O fluxo foi projetado para garantir rastreabilidade completa em cada etapa — desde a abertura pelo cooperado até o pagamento da indenização — com workflow de aprovação auditado e integrado ao módulo financeiro.

## Ciclo de Vida do Sinistro

```
ABERTO → EM_ANALISE → APROVADO → PAGO
                    → NEGADO
```

Toda transição de status é registrada no audit log com usuário, data e justificativa. O histórico de mudanças de status é visível tanto para o operador quanto para o segurado no PWA.

## Abertura de Sinistro

Um sinistro pode ser aberto de duas formas:

**Pelo operador** — no painel administrativo, em `/sinistros/novo`, vinculando o sinistro a uma apólice específica.

**Pelo segurado no PWA** — o cooperado acessa o portal mobile, seleciona a apólice afetada e preenche o formulário de aviso com data da ocorrência e descrição. O sinistro entra automaticamente com status ABERTO para análise da equipe.

:::tip Canal direto no PWA
A abertura de sinistro pelo PWA reduz o tempo médio de aviso e elimina barreiras de atendimento (horário comercial, filas telefônicas). O segurado registra a ocorrência imediatamente após o evento, com mais detalhes e precisão.
:::

## Dados do Sinistro

Cada sinistro registra:

| Campo | Descrição |
|---|---|
| Número único | Gerado automaticamente, sequencial e rastreável |
| Data da ocorrência | Data e hora do evento segurado |
| Descrição | Relato detalhado das circunstâncias |
| Valor reclamado | Montante solicitado pelo segurado |
| Valor aprovado | Montante aprovado após análise (pode diferir do reclamado) |
| Status | ABERTO → EM_ANALISE → APROVADO/NEGADO → PAGO |

## Workflow de Análise

O fluxo de análise segue um processo estruturado:

1. **ABERTO**: sinistro registrado, aguardando atribuição para análise
2. **EM_ANALISE**: operador assume a instrução — verifica coberturas da apólice, solicita documentação complementar, analisa vistoria (se aplicável)
3. **APROVADO**: instrução concluída com aprovação — define o valor aprovado (que pode ser diferente do reclamado)
4. **NEGADO**: instrução concluída com negativa — o sistema exige registro do motivo da negativa para fins de auditoria
5. **PAGO**: indenização liquidada, integrado ao módulo financeiro

### Verificação de Coberturas

No momento da análise, o operador pode consultar diretamente quais coberturas estavam ativas na apólice na data da ocorrência. O sistema verifica se a natureza do sinistro é coberta pelas coberturas contratadas — evitando pagamentos indevidos e reduzindo contestações.

### Vistorias Vinculadas

Se o produto exige vistoria (como Auto), o operador pode acessar diretamente da tela do sinistro o histórico de vistorias do veículo — fotos, score de IA, data e localização. Isso é especialmente útil para identificar danos pré-existentes não declarados.

## Integração com o PWA do Segurado

O segurado acompanha o andamento do sinistro diretamente no PWA:

- Visualiza o status atual do sinistro
- Recebe notificações push quando o status muda
- Acessa informações sobre documentação necessária
- Vê o valor aprovado quando a análise é concluída

Essa transparência reduz ligações de acompanhamento e melhora a experiência do cooperado — mesmo em um momento de estresse como um sinistro.

## Relatórios de Sinistralidade

O módulo gera indicadores essenciais para a gestão atuarial:

- **Índice de sinistralidade** por produto e período (sinistros pagos ÷ prêmios arrecadados)
- **Tempo médio de liquidação** por tipo de sinistro
- **Taxa de aprovação vs negação** por produto
- **Top causas de sinistros** por produto

Esses indicadores alimentam a revisão atuarial anual das tabelas de taxa e subsidiam decisões de subscrição.

## Funcionalidades

| Funcionalidade | Papel |
|---|---|
| Abrir sinistro | OPERADOR_COOPERATIVA, Segurado (PWA) |
| Instruir e mudar status | OPERADOR_COOPERATIVA |
| Aprovar com valor diferente do reclamado | OPERADOR_COOPERATIVA, GESTOR_COOPERATIVA |
| Negar com motivo registrado | OPERADOR_COOPERATIVA, GESTOR_COOPERATIVA |
| Registrar pagamento | OPERADOR_COOPERATIVA |
| Consultar histórico completo | GESTOR_COOPERATIVA, ADMIN_FEDERACAO |
| Acompanhar status do sinistro | Segurado (PWA) |
| Relatórios de sinistralidade | GESTOR_COOPERATIVA, ADMIN_FEDERACAO |

## Fluxo de Uso — Sinistro Auto Abertura pelo PWA

1. **Segurado** abre o PWA no smartphone após acidente
2. Acessa "Sinistros" → "Abrir Novo Sinistro"
3. Seleciona a apólice do veículo envolvido
4. Informa data da ocorrência e descreve o acidente
5. Sinistro é registrado com status ABERTO e número único
6. Segurado recebe confirmação e número do sinistro
7. **OPERADOR_COOPERATIVA** recebe a notificação e assume a instrução

## Fluxo de Uso — Instrução e Liquidação

1. Operador abre o sinistro e muda status para EM_ANALISE
2. Verifica coberturas da apólice na data da ocorrência
3. Solicita documentação ao segurado (B.O., notas fiscais, laudos)
4. Consulta vistoria do veículo para verificar danos pré-existentes
5. Define valor aprovado e muda status para APROVADO
6. Aciona módulo financeiro para liquidação da indenização
7. Após pagamento, status muda para PAGO
8. Segurado recebe notificação push com a informação de pagamento

![Lista de sinistros com filtros por status](../static/img/screenshots/sinistros-lista.png)

:::info Captura sugerida
Tabela de sinistros com colunas: número, segurado, produto, data da ocorrência, valor reclamado, valor aprovado, status (badge colorido por status: ABERTO=cinza, EM_ANALISE=azul, APROVADO=verde, NEGADO=vermelho, PAGO=verde escuro). Filtros de status, produto e período.
:::

![Detalhe do sinistro com histórico de análise](../static/img/screenshots/sinistro-detalhe.png)

:::info Captura sugerida
Página de detalhe do sinistro mostrando: dados da ocorrência, apólice vinculada (com coberturas ativas na data), linha do tempo de status, campo de valor aprovado, botões de ação (Instruir, Aprovar, Negar, Registrar Pagamento) e histórico de audit log.
:::
