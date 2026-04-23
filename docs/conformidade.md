---
sidebar_position: 16
---

# Conformidade SUSEP

O módulo de conformidade da Tegra automatiza o controle das obrigações regulatórias junto à Superintendência de Seguros Privados (SUSEP). O painel centraliza o acompanhamento de todos os envios periódicos obrigatórios — FIP, SRO e demais relatórios — com alertas automáticos de prazo, identificação inteligente de meses sem movimento e rastreamento de status por competência.

## Obrigações Regulatórias Cobertas

### FIP — Formulário de Informações Periódicas

O FIP é a principal obrigação de reporte periódico à SUSEP. Deve ser enviado mensalmente, contendo:

- Estatísticas de apólices emitidas e prêmios por produto
- Sinistros registrados, aprovados e pagos
- Provisões técnicas constituídas
- Dados de comissões e repasses

O prazo para envio do FIP é o último dia útil do mês seguinte ao período de referência. Atrasos resultam em multas e podem comprometer o registro da cooperativa junto à SUSEP.

### SRO — Sistema de Registro de Operações

O SRO é o módulo de registro de operações junto à registradora habilitada pela SUSEP. Exige que apólices e endossos sejam registrados em tempo real ou em batches periódicos, criando rastreabilidade nacional das operações de seguros.

:::note Status de implementação
O módulo de controle FIP/SRO está em produção. A integração direta com a registradora está no roadmap — atualmente a plataforma gera os dados e controla o status manualmente ou via API futura.
:::

## Painel de Conformidade

O painel em `/admin/conformidade` exibe o calendário de obrigações do ano, organizado por mês e tipo de relatório:

| Coluna | Descrição |
|---|---|
| Competência | Mês de referência (ex: Janeiro 2026) |
| Prazo | Data limite para envio |
| Dias restantes | Contador regressivo |
| Status FIP | PENDENTE / GERADO / ENVIADO / ACEITO / REJEITADO |
| Status SRO | PENDENTE / GERADO / ENVIADO / ACEITO / REJEITADO |

### Identificação de Meses sem Movimento

Uma funcionalidade crítica do módulo: o sistema identifica automaticamente **meses sem movimento operacional** para uma dada singular — ou seja, competências sem nenhuma apólice emitida, sinistro registrado ou prêmio arrecadado. Nesses meses, o envio do FIP/SRO não é obrigatório, e o painel marca esses períodos como "Não aplicável" — evitando alertas de atraso indevidos para meses sem operação.

:::tip Precisão nos alertas
Sistemas legados costumam gerar alertas de atraso para todos os meses, incluindo períodos em que a cooperativa ainda não estava operacional. A Tegra distingue "mês sem envio" de "mês sem operação" — reduzindo ruído e focando os alertas no que realmente importa.
:::

### Alertas Automáticos

O painel exibe indicadores de atenção proeminentes:

- **Envios atrasados**: competências já vencidas sem status ENVIADO ou ACEITO (apenas para meses com movimento)
- **Envios urgentes**: competências com prazo em menos de 7 dias
- **Provisões insuficientes**: singulares com reservas técnicas abaixo do mínimo regulatório
- **Singulares sem UF configurada**: impossível gerar FIP sem o estado da cooperativa cadastrado

### Status por Competência

Para cada mês, o operador pode atualizar o status de FIP e SRO conforme o processo real de envio:

1. **PENDENTE** — dados ainda sendo preparados
2. **GERADO** — arquivo ou dados gerados, aguardando envio
3. **ENVIADO** — submetido ao portal SUSEP, aguardando confirmação
4. **ACEITO** — SUSEP aceitou o envio sem erros
5. **REJEITADO** — SUSEP rejeitou — requer correção e reenvio

Cada atualização de status é registrada com usuário responsável e timestamp no audit log.

## Provisões Técnicas

O módulo monitora as provisões técnicas de cada singular por competência:

- **Prêmio total arrecadado** no mês
- **Percentual de reserva** (padrão: 40%, configurável)
- **Valor de reserva calculado**
- **Saldo atual** da reserva
- **Situação**: ADEQUADA ou INSUFICIENTE

Provisões insuficientes são destacadas no painel com alerta vermelho e contadas no indicador de "Alertas" da tela principal.

## Relatório para Auditoria

O módulo exporta um relatório consolidado de conformidade por ano com:

- Status de cada envio por mês e por tipo
- Histórico de mudanças de status com responsável
- Indicadores de provisões por competência
- Singulares com pendências

Esse relatório é o documento-base para apresentação em auditorias externas, fiscalizações da SUSEP e reuniões de diretoria.

## Funcionalidades

| Funcionalidade | Papel |
|---|---|
| Visualizar painel de conformidade anual | ADMIN_FEDERACAO |
| Atualizar status de FIP/SRO por competência | ADMIN_FEDERACAO |
| Ver alertas de prazo e provisões | ADMIN_FEDERACAO |
| Exportar relatório de conformidade | ADMIN_FEDERACAO |
| Visualizar provisões técnicas por singular | ADMIN_FEDERACAO, GESTOR_COOPERATIVA |

## Fluxo de Uso — Controle Mensal

1. **ADMIN_FEDERACAO** acessa `/admin/conformidade` no início do mês
2. Visualiza o painel do ano atual com status de todos os meses
3. Identifica competências atrasadas ou urgentes nos alertas do topo
4. Para a competência do mês anterior, extrai os dados do sistema (relatório FIP)
5. Acessa o portal da SUSEP, faz o envio do FIP
6. Volta ao painel da Tegra e atualiza o status para ENVIADO
7. Quando a SUSEP confirmar o aceite, atualiza para ACEITO

## Fluxo de Uso — Resposta a Auditoria

1. Auditor externo solicita comprovante de envios SUSEP do ano anterior
2. **ADMIN_FEDERACAO** acessa `/admin/conformidade` e seleciona o ano solicitado
3. Visualiza o status de todos os envios com datas e responsáveis
4. Exporta o relatório em PDF ou CSV
5. Compartilha com o auditor como evidência documental

![Painel de conformidade SUSEP](../static/img/screenshots/conformidade-painel.png)

:::info Captura sugerida
Calendário de conformidade anual com uma linha por mês, mostrando: competência, prazo, dias restantes (contador colorido: verde/amarelo/vermelho), badge de status FIP e badge de status SRO. Alertas no topo: "3 envios atrasados", "2 provisões insuficientes". Meses sem movimento marcados com badge cinza "Não aplicável".
:::
