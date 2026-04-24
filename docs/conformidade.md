---
sidebar_position: 16
---

# Conformidade SUSEP

O módulo de conformidade da Tegra automatiza o controle das obrigações regulatórias junto à Superintendência de Seguros Privados (SUSEP). Por não existir legislação específica para cooperativas de seguros no Brasil, a plataforma interpreta e aplica a legislação vigente para seguradoras — orientação confirmada por consultoria jurídica especializada.

O painel centraliza o acompanhamento de todos os envios periódicos obrigatórios com alertas automáticos de prazo, identificação inteligente de meses sem movimento e rastreamento de status por competência.

## Relatórios Regulatórios Obrigatórios

### FIP — Formulário de Informações Periódicas

O FIP é a principal obrigação de reporte periódico à SUSEP. Deve ser enviado mensalmente contendo cinco quadros:

| Quadro | Conteúdo |
|---|---|
| Quadro 1 — Prêmios | Apólices emitidas, canceladas e prêmio retido por singular × produto |
| Quadro 2 — Sinistros | Sinistros avisados, em análise, aprovados (PSL), pagos e negados com valores |
| Quadro 3 — Provisões | Reservas técnicas: valor exigido, PSL constituído e saldo atual |
| Quadro 4 — Financeiro | Receita de prêmios, despesas com sinistros, comissões e repasses |
| Quadro 5 — Cadastral | Cooperados, apólices ativas e produtos por singular |

O prazo para envio é o dia 20 do mês seguinte ao período de referência. Atrasos podem resultar em multas e comprometer o registro junto à SUSEP.

:::tip FIP tecnicamente correto
O Quadro 2 contabiliza sinistros com status **APROVADO** separadamente como PSL (Provisão de Sinistros a Liquidar) — valor já comprometido mas ainda não pago. O cálculo de sinistros pendentes usa `valorAprovado` para APROVADO e `valorReclamado` como estimativa para ABERTO/EM_ANALISE, evitando distorção regulatória.
:::

O FIP é gerado em `/relatorios/fip` com export em XML e CSV. O download registra automaticamente o status como **GERADO** no controle de envios.

### SRO — Sinistros Reportados Ocorridos

O SRO lista todos os sinistros **avisados** (registrados) na competência, com granularidade individual por sinistro. É a base para análise regulatória de adequação das reservas constituídas.

Cada linha do SRO contém:

| Campo | Descrição |
|---|---|
| Nº Sinistro | Número único do sinistro |
| Produto | Ramo do seguro |
| Status | ABERTO, EM_ANALISE, APROVADO, PAGO ou NEGADO |
| Data de ocorrência | Quando o evento segurado aconteceu |
| Data de aviso | Quando foi registrado no sistema |
| Valor reclamado | Valor informado pelo segurado |
| Valor aprovado | Valor aprovado pela cooperativa (quando disponível) |
| Reserva constituída (PSL) | `valorAprovado` para APROVADO; `valorReclamado` para pendentes; zero para encerrados |
| Valor pago | Para sinistros com status PAGO |

O SRO é gerado em `/relatorios/sro` com export CSV (BOM UTF-8 para Excel). O download registra automaticamente o status como **GERADO** no controle de envios.

### Quadro Estatístico

O Quadro Estatístico apresenta os índices regulatórios consolidados por singular × produto — a base para avaliação da saúde financeira de cada linha de negócio:

| Índice | Fórmula | Alerta |
|---|---|---|
| Sinistralidade | Sinistros pagos ÷ prêmio arrecadado × 100 | > 80%: atenção regulatória |
| Índice de comissões | Comissões ÷ prêmio × 100 | Monitoramento de custo |
| Índice de repasses | Repasses ÷ prêmio × 100 | Monitoramento de custo |
| **Índice combinado** | Soma dos três | **> 100%: operação deficitária** |

O Quadro Estatístico é gerado em `/relatorios/quadro-estatistico` com export CSV. Valores acima dos limiares são destacados em amarelo (> 80%) ou vermelho (> 100%) na interface.

## Painel de Conformidade

O painel em `/admin/conformidade` exibe o calendário de obrigações do ano, organizado por mês:

| Coluna | Descrição |
|---|---|
| Competência | Mês de referência (ex: Janeiro 2026) |
| Prazo | Dia 20 do mês seguinte |
| Dias restantes | Contador regressivo |
| Status FIP | PENDENTE / GERADO / ENVIADO / ACEITO / REJEITADO |
| Status SRO | PENDENTE / GERADO / ENVIADO / ACEITO / REJEITADO |

### Identificação de Meses sem Movimento

O sistema identifica automaticamente **meses sem movimento operacional** — competências sem apólice emitida, sinistro registrado **ou** prêmio arrecadado. Esses meses são marcados como "Não aplicável", evitando alertas de atraso indevidos.

A detecção usa três fontes simultâneas:
1. Pagamentos recebidos na competência
2. Sinistros registrados no mês
3. Apólices emitidas no mês

:::tip Precisão nos alertas
Sistemas legados geram alertas para todos os meses, incluindo períodos sem operação. A Tegra distingue "mês sem envio" de "mês sem operação" — focando os alertas no que realmente importa para o compliance.
:::

### Alertas Automáticos

- **Envios atrasados**: competências vencidas sem status ENVIADO ou ACEITO (só para meses com movimento)
- **Envios urgentes**: prazo em menos de 7 dias
- **Provisões insuficientes**: reservas abaixo do mínimo regulatório
- **Singulares sem UF**: impossível gerar FIP sem estado configurado

:::note Alertas precisos
A flag "atrasado" respeita o status do envio: se a FIP foi enviada e aceita antes do prazo, o mês **não** aparece como atrasado — mesmo que a data já tenha passado.
:::

## Provisões Técnicas

As provisões técnicas são gerenciadas em `/financeiro/provisoes`. O cálculo segue a Circular SUSEP 521 (interpretada para cooperativas):

| Campo | Descrição |
|---|---|
| Prêmio arrecadado | Pagamentos recebidos na competência |
| % de reserva | **Mínimo obrigatório: 40%** — API rejeita valores abaixo |
| Valor de reserva | Prêmio × percentual |
| PSL (saldo comprometido) | Sinistros com status APROVADO aguardando pagamento (`valorAprovado`) |
| Saldo disponível | Prêmio − PSL |
| Situação | **ADEQUADA** se saldo ≥ reserva; **INSUFICIENTE** caso contrário |

:::warning Mínimo regulatório
O sistema **bloqueia** qualquer cálculo com percentual abaixo de 40%. A interface exibe aviso em vermelho e desabilita o botão de cálculo se o campo estiver configurado com valor inferior.
:::

## Audit Trail de Conformidade

Cada atualização de status (FIP, SRO, Quadro Estatístico) é registrada no audit log imutável com:
- Usuário responsável e IP de origem
- Timestamp preciso
- Status anterior e novo status

Esse histórico é o documento-base para auditorias externas e fiscalizações da SUSEP.

## Funcionalidades

| Funcionalidade | Papel |
|---|---|
| Visualizar painel de conformidade anual | ADMIN_CENTRAL |
| Atualizar status de FIP/SRO por competência | ADMIN_CENTRAL |
| Gerar e baixar FIP (XML + CSV) | ADMIN_CENTRAL |
| Gerar e baixar SRO (CSV) | ADMIN_CENTRAL |
| Gerar e baixar Quadro Estatístico (CSV) | ADMIN_CENTRAL |
| Calcular provisões técnicas | ADMIN_CENTRAL |
| Ver alertas de prazo e provisões | ADMIN_CENTRAL |
| Visualizar provisões por singular | ADMIN_CENTRAL, GESTOR_COOPERATIVA |

## Fluxo de Uso — Rotina Mensal

1. **ADMIN_CENTRAL** acessa `/admin/conformidade` no início do mês
2. Visualiza o calendário com status de todos os meses do ano
3. Identifica competências atrasadas ou urgentes nos alertas do topo
4. Acessa `/relatorios/fip` → seleciona a competência → baixa XML ou CSV
5. Acessa `/relatorios/sro` → seleciona a competência → baixa CSV
6. Submete os arquivos ao portal da SUSEP
7. Volta ao painel e atualiza o status para ENVIADO
8. Quando a SUSEP confirmar o aceite, atualiza para ACEITO

## Fluxo de Uso — Resposta a Auditoria

1. Auditor externo solicita comprovante de envios do ano anterior
2. **ADMIN_CENTRAL** acessa `/admin/conformidade` e seleciona o ano
3. Visualiza o status de todos os envios com datas e responsáveis
4. Extrai o relatório como evidência documental

![Painel de conformidade SUSEP](../static/img/screenshots/conformidade-painel.png)

:::info Captura sugerida
Calendário de conformidade anual com uma linha por mês: competência, prazo, dias restantes (contador colorido), badge FIP e badge SRO. Alertas no topo: "3 envios atrasados", "2 provisões insuficientes". Meses sem movimento com badge cinza "Não aplicável".
:::
