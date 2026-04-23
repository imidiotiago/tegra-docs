---
sidebar_position: 10
---

# Apólices

O módulo de apólices é o núcleo operacional da Tegra. Ele gerencia todo o ciclo de vida do contrato de seguro — da emissão ao cancelamento — com suporte a descontos auditados, endossos de cobertura e integração direta com os módulos de pagamento, sinistros e vistoria.

## Ciclo de Vida da Apólice

```
EMISSÃO → ATIVA → SUSPENSA (inadimplência) → ATIVA (regularização)
                                           → CANCELADA (definitivo)
               → VENCIDA (fim da vigência sem renovação)
               → CANCELADA (solicitação do cooperado)
```

Toda mudança de status é registrada no audit log com usuário, data e motivo.

## Emissão de Apólice

A emissão de uma nova apólice passa pelas seguintes etapas:

1. **Seleção do segurado** — busca pelo CPF (com validação inline do dígito verificador) ou criação de novo cadastro
2. **Seleção do produto** — apenas produtos habilitados para a singular aparecem
3. **Dados de risco** — formulário dinâmico conforme o produto (placa/ano para Auto, metragem/tipo de construção para Residencial, etc.)
4. **Seleção de plano** — Bronze, Prata ou Ouro com visualização do que está incluído em cada um
5. **Coberturas à la carte** — adição de coberturas opcionais com atualização do prêmio em tempo real
6. **Verificação de regras de subscrição** — o sistema verifica se é necessário rastreador, vistoria prévia ou declaração de saúde
7. **Aplicação de desconto** (se aplicável) — com motivo obrigatório e registro do usuário que concedeu
8. **Confirmação** — emissão com número único gerado automaticamente e início de vigência

### Numeração Automática

Cada apólice recebe um número único sequencial no momento da emissão. O formato é configurável pela federação e garante unicidade em toda a plataforma — não há risco de colisão de números entre singulares.

### Desconto Controlado

Operadores podem conceder descontos dentro de um limite configurado. Descontos acima do limite requerem aprovação do GESTOR_COOPERATIVA. O sistema registra:

- Percentual de desconto concedido
- Prêmio bruto (antes do desconto) e prêmio final (após desconto)
- Motivo do desconto (obrigatório)
- ID do usuário que concedeu o desconto

Esse controle impede que descontos sejam concedidos sem justificativa e cria rastreabilidade para auditoria comercial.

:::tip Transparência no desconto
A apólice exibe sempre os dois valores: prêmio bruto e prêmio com desconto. Isso permite ao gestor identificar rapidamente o impacto financeiro de políticas de desconto da equipe comercial.
:::

## Status da Apólice

| Status | Descrição |
|---|---|
| ATIVA | Cobertura vigente, prêmio em dia |
| SUSPENSA | Pagamento atrasado, cobertura temporariamente suspensa |
| CANCELADA | Contrato encerrado definitivamente |
| VENCIDA | Vigência expirada, aguardando renovação |

A transição para SUSPENSA pode ser automática (por integração com o módulo de pagamentos) ou manual pelo operador. A transição para CANCELADA é sempre manual e auditada.

## Coberturas da Apólice

A Tegra mantém o registro exato das coberturas vigentes em cada apólice na tabela `ApoliceCobertura`. Isso permite:

- Saber exatamente o que está coberto em cada sinistro
- Registrar endossos (adição ou remoção de coberturas durante a vigência)
- Calcular o prêmio exato composto pela soma das coberturas contratadas
- Gerar o "espelho" da apólice com todas as coberturas e limites

Coberturas podem ser adicionadas ou removidas durante a vigência (endosso mid-cycle). A remoção é registrada com `removidaEm` para controle histórico.

## Renovação

A plataforma controla as datas de vencimento e alerta para apólices próximas do fim da vigência. O fluxo de renovação cria uma nova apólice mantendo os mesmos dados de risco e coberturas, recalculando o prêmio com as taxas vigentes.

## Funcionalidades

| Funcionalidade | Papel |
|---|---|
| Emitir nova apólice | OPERADOR_COOPERATIVA |
| Cancelar apólice | OPERADOR_COOPERATIVA, GESTOR_COOPERATIVA |
| Aprovar desconto acima do limite | GESTOR_COOPERATIVA |
| Suspender/reativar por inadimplência | Automático / OPERADOR_COOPERATIVA |
| Adicionar/remover cobertura (endosso) | OPERADOR_COOPERATIVA |
| Visualizar detalhamento da cotação | GESTOR_COOPERATIVA, ADMIN_FEDERACAO |
| Consultar apólice (CPF, número) | OPERADOR_COOPERATIVA |
| Ver apólices no PWA | Segurado |

## Fluxo de Uso — Emissão com Fast-Track

1. Lead do fast-track já tem CEP, data de nascimento e produto de interesse
2. **OPERADOR_COOPERATIVA** abre o lead e clica em "Emitir apólice"
3. Dados do fast-track são pré-preenchidos no formulário
4. Operador completa os dados de risco (placa, ano do veículo para Auto)
5. Escolhe plano, adiciona coberturas desejadas
6. Prêmio estimado do fast-track é validado pelo cálculo formal
7. Emite a apólice — lead é automaticamente fechado como FECHADO_GANHO

## Fluxo de Uso — Endosso de Cobertura

1. Segurado contacta a cooperativa solicitando adicionar "Carro Reserva"
2. **OPERADOR_COOPERATIVA** abre a apólice em `/apolices/{id}`
3. Acessa a aba de coberturas e adiciona a cobertura desejada
4. O sistema verifica dependências (requer Colisão — já contratada? Sim)
5. Novo prêmio mensal é calculado e apresentado ao operador
6. Operador confirma o endosso
7. A cobertura é adicionada com data de início e novo prêmio calculado
8. Próxima cobrança já reflete o novo prêmio

![Lista de apólices com filtros](../static/img/screenshots/apolices-lista.png)

:::info Captura sugerida
Tabela de apólices com colunas: número, segurado, produto, plano, prêmio mensal, status (badge colorido), vigência. Filtros por status, produto e período. Barra de busca por CPF ou número.
:::

![Tela de detalhes da apólice](../static/img/screenshots/apolice-detalhe.png)

:::info Captura sugerida
Página de detalhe da apólice com abas: Resumo (dados gerais, prêmio bruto vs final, desconto), Coberturas (lista de coberturas ativas com limites e valores), Pagamentos (histórico), Sinistros (histórico), Vistoria (se aplicável), Audit Log.
:::
