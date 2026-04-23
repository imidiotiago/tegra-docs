---
sidebar_position: 13
---

# Pagamentos e Financeiro

O módulo financeiro da Tegra gerencia toda a cadeia de fluxo de caixa das cooperativas singulares — da cobrança mensal de prêmios dos cooperados ao controle de comissões e repasses para a federação central. A arquitetura de pagamentos é plugável, permitindo integração com diferentes gateways sem alteração de código.

## Estrutura Financeira

O módulo financeiro opera em três camadas:

```
Segurado → paga prêmio mensal (Pagamento)
Cooperativa → ganha comissão sobre cada apólice (Comissao)
Cooperativa → repassa percentual para a federação (Repasse)
```

Cada camada tem controle independente de status, vencimento e liquidação.

## Pagamentos de Prêmio

Cada apólice ativa gera uma cobrança mensal (`Pagamento`) com:

| Campo | Descrição |
|---|---|
| Competência | Mês de referência (YYYY-MM) |
| Valor | Prêmio mensal da apólice |
| Data de vencimento | Dia de vencimento configurável |
| Link boleto | URL do boleto gerado pelo gateway |
| Pix copia-e-cola | Código Pix para pagamento instantâneo |
| Status | PENDENTE → PAGO / ATRASADO / CANCELADO |
| ID externo | Identificador no gateway de pagamento |

### Gateways de Pagamento

A plataforma usa uma arquitetura de gateway plugável. O gateway padrão suportado é **Asaas**, com suporte nativo a:

- Boleto bancário registrado
- Pix com geração de QR code e copia-e-cola
- Webhook para confirmação automática de pagamento

A integração é configurada por federação — novas singulares herdam automaticamente a configuração. Outros gateways (PagBank, Mercado Pago, etc.) podem ser integrados sem mudanças na lógica de negócio.

:::tip Confirmação automática via Webhook
Quando o cooperado paga o boleto ou o Pix no banco, o gateway notifica a Tegra via webhook. O pagamento é confirmado automaticamente, sem intervenção manual do operador. Isso elimina conciliação manual e reduz erros humanos.
:::

### Controle de Inadimplência

O sistema monitora pagamentos com status ATRASADO e pode:

- Enviar notificações automáticas por WhatsApp (aviso de vencimento, cobrança pós-vencimento)
- Suspender automaticamente a apólice após prazo de carência configurável
- Exibir indicador de inadimplência no painel do gestor

O cooperado também visualiza seus pagamentos atrasados no PWA, com o botão de segunda via do boleto ou Pix disponível para regularização imediata.

## Comissões

As comissões representam a remuneração da cooperativa singular sobre cada apólice ativa. Cada competência gera um registro de comissão por apólice:

| Campo | Descrição |
|---|---|
| Competência | Mês de referência |
| Percentual | % sobre o prêmio da apólice |
| Valor | Valor calculado da comissão |
| Status | PENDENTE → PAGO → ESTORNADO |

O painel de comissões consolida o total a receber no mês, apólices com comissão pendente e histórico de pagamentos por competência.

## Repasses para a Federação

As singulares repassam um percentual fixo de sua arrecadação para a federação central. O modelo de repasse:

| Campo | Descrição |
|---|---|
| Competência | Mês de referência |
| Percentual configurável | % dos prêmios arrecadados |
| Valor devido | Calculado sobre prêmios do mês |
| Valor pago | Registrado quando liquidado |
| Status | PENDENTE → PAGO → ATRASADO |

O **ADMIN_FEDERACAO** tem visão consolidada de repasses de todas as singulares — identificando singulares em atraso e gerindo o fluxo de caixa da federação.

## Provisões Técnicas (SUSEP)

A plataforma calcula e monitora a provisão técnica regulatória — reserva obrigatória sobre os prêmios arrecadados, conforme exigência da SUSEP:

| Campo | Descrição |
|---|---|
| Competência | Mês de referência |
| Prêmio total | Total arrecadado no mês |
| Percentual de reserva | Configurável (padrão: 40%) |
| Valor da reserva | Calculado automaticamente |
| Situação | ADEQUADA ou INSUFICIENTE |

Provisões insuficientes geram alertas automáticos no painel de conformidade SUSEP.

## Painel Financeiro

O painel financeiro oferece visão completa da saúde financeira da singular:

- **Fluxo de caixa** — entradas (prêmios) e saídas (sinistros pagos, repasses) por período
- **Inadimplência** — percentual e valor absoluto de prêmios atrasados
- **Comissões** — a receber no mês e histórico
- **Repasses** — situação do repasse para a federação
- **Provisões** — situação das reservas técnicas

## Funcionalidades

| Funcionalidade | Papel |
|---|---|
| Gerar cobrança mensal (boleto/Pix) | Automático / OPERADOR_COOPERATIVA |
| Confirmar pagamento manual | OPERADOR_COOPERATIVA |
| Suspender apólice por inadimplência | Automático / OPERADOR_COOPERATIVA |
| Enviar notificação WhatsApp de cobrança | Automático / OPERADOR_COOPERATIVA |
| Registrar repasse para federação | GESTOR_COOPERATIVA |
| Visualizar painel financeiro consolidado | GESTOR_COOPERATIVA |
| Acessar boleto/Pix no PWA | Segurado |
| Acompanhar status de pagamento | Segurado (PWA) |

## Fluxo de Uso — Cobrança Mensal

1. No início de cada mês, o sistema gera automaticamente as cobranças para todas as apólices ativas
2. Para cada apólice, cria um registro de `Pagamento` com boleto/Pix gerado via gateway
3. Notificação WhatsApp é enviada ao cooperado com o link do boleto
4. Cooperado paga via Pix ou boleto no banco
5. Gateway confirma via webhook — status muda automaticamente para PAGO
6. Apólices com pagamento não confirmado após a data de vencimento mudam para ATRASADO
7. Segunda notificação WhatsApp de cobrança é enviada após X dias configuráveis
8. Apólice é suspensa automaticamente após prazo de carência

## Fluxo de Uso — Segunda Via no PWA

1. Cooperado acessa o PWA, seção "Boletos"
2. Visualiza histórico de pagamentos e competências em aberto
3. Clica em "Segunda Via" na competência desejada
4. Boleto ou Pix copia-e-cola é exibido para copiar ou salvar
5. Pagamento é confirmado pelo webhook sem ação do operador

![Painel financeiro da singular](../static/img/screenshots/pagamentos-painel-financeiro.png)

:::info Captura sugerida
Painel financeiro com cards de KPI (prêmios do mês, inadimplência %, comissões a receber, status do repasse), gráfico de linha de arrecadação mensal e tabela de últimas cobranças.
:::

![Lista de pagamentos com status](../static/img/screenshots/pagamentos-lista.png)

:::info Captura sugerida
Tabela de pagamentos com colunas: competência, segurado, apólice, valor, data vencimento, data pagamento, status (badge colorido). Filtros de status, período e singular. Botão de exportar para CSV.
:::
