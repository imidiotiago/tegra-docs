---
sidebar_position: 8
---

# Leads e Captação

O módulo de leads da Tegra combina landing pages tematizadas por singular, um formulário de fast-track com estimativa instantânea de prêmio e um CRM completo com pipeline de vendas e histórico de atividades. O objetivo é transformar visitantes do site em cotações formais com o menor atrito possível, e cotações em apólices com o máximo de rastreabilidade.

## Landing Pages de Captação

Cada singular possui uma landing page pública em `/captacao/{slug}` — completamente tematizada com a identidade visual da cooperativa (logo, cores, tagline) e exibindo apenas os produtos que a singular comercializa.

A landing page é otimizada para conversão:

- Design em gradiente com as cores primária e secundária da singular
- Logo da cooperativa no topo
- Tagline personalizada de posicionamento
- Lista de benefícios do modelo cooperativo
- Formulário de cotação em destaque
- Botão de WhatsApp direto com o número da singular

:::tip URLs únicas por singular
Cada landing page tem URL própria (`/captacao/joinville`, `/captacao/florianopolis`) que pode ser usada em campanhas de mídia social, Google Ads e WhatsApp sem que o visitante perceba que está numa plataforma compartilhada. A experiência é 100% da cooperativa singular.
:::

## Fast-Track: Cotação em 2 Campos

O diferencial da captação da Tegra é o **fast-track**: o visitante obtém uma estimativa de prêmio informando apenas:

1. **CEP de residência** — determina a UF e o fator regional aplicável
2. **Data de nascimento** — determina a faixa etária e o fator correspondente

Com esses dois dados, o motor de cálculo gera uma estimativa mensal imediata para o produto selecionado. A estimativa usa a tabela de taxa vigente para a UF do CEP e o fator de faixa etária.

O resultado do fast-track:

- Exibe o **prêmio estimado** em destaque
- Salva automaticamente um **lead qualificado** no CRM com CEP, data de nascimento e produto de interesse
- Preenche o campo `origem = FAST_TRACK` para rastreamento de canal
- Oferece ao visitante avançar para uma cotação completa ou entrar em contato pelo WhatsApp

:::note Conversão sem atrito
Não é exigido e-mail nem telefone para obter a estimativa — isso aumenta significativamente a taxa de conversão do formulário. Os dados de contato são solicitados apenas quando o visitante demonstra interesse em avançar.
:::

## CRM de Leads

Todos os leads capturados — pelo fast-track, por formulário de cotação completa, por WhatsApp, telefone ou qualquer outra origem — são gerenciados no CRM da plataforma.

### Pipeline de Estágios

| Estágio | Descrição |
|---|---|
| NOVO | Lead recém-captado, ainda não contactado |
| CONTATO | Primeiro contato realizado |
| COTAÇÃO | Cotação formal em andamento |
| NEGOCIAÇÃO | Proposta enviada, aguardando decisão |
| FECHADO_GANHO | Convertido em apólice |
| FECHADO_PERDIDO | Oportunidade encerrada sem conversão |

### Dados do Lead

Cada lead registra:
- Dados de identificação: nome, CPF, e-mail, telefone, data de nascimento
- Dados de localização: CEP
- Produto de interesse e estimativa de prêmio (fast-track)
- Canal de origem: SITE, FAST_TRACK, WHATSAPP, INDICACAO, TELEFONE, EVENTO
- Responsável (operador atribuído)
- Data do próximo contato
- Observações livres
- Motivo de perda (se fechado como perdido): PRECO, CONCORRENCIA, DESISTENCIA, OUTRO

### Atividades e Histórico

Cada lead possui um histórico completo de atividades rastreadas:

| Tipo de Atividade | Descrição |
|---|---|
| LIGACAO | Registro de ligação telefônica |
| WHATSAPP | Mensagem enviada via WhatsApp |
| EMAIL | E-mail enviado ou recebido |
| REUNIAO | Reunião ou visita presencial |
| COTACAO | Cotação formal gerada |
| NOTA | Anotação interna |

Toda atividade registra o usuário responsável, data e hora e descrição completa.

### Conversão para Apólice

Quando o lead fecha como ganho, o operador vincula o lead à apólice emitida. O sistema mantém o rastreamento da jornada completa do cooperado — desde o primeiro contato no fast-track até a apólice ativa.

## Funcionalidades

| Funcionalidade | Papel |
|---|---|
| Landing page pública com fast-track | Público (sem login) |
| CRM com pipeline e filtros | OPERADOR_COOPERATIVA, GESTOR_COOPERATIVA |
| Atribuir responsável ao lead | GESTOR_COOPERATIVA, OPERADOR_COOPERATIVA |
| Registrar atividades no lead | OPERADOR_COOPERATIVA |
| Visualizar leads da equipe inteira | GESTOR_COOPERATIVA |
| Filtrar por estágio, produto, origem | OPERADOR_COOPERATIVA |
| Converter lead em apólice | OPERADOR_COOPERATIVA |
| Relatório de conversão de leads | GESTOR_COOPERATIVA |

## Fluxo de Uso — Fast-Track

1. Visitante acessa `/captacao/{slug}` no smartphone ou computador
2. Seleciona o produto de interesse (ex: Seguro Auto)
3. Informa apenas CEP e data de nascimento
4. O sistema calcula e exibe a estimativa de prêmio em menos de 1 segundo
5. Lead é criado automaticamente no CRM com origem `FAST_TRACK`
6. Visitante pode clicar em "Falar no WhatsApp" ou "Quero uma cotação completa"
7. Operador recebe o lead no CRM e inicia o processo de cotação

## Fluxo de Uso — Gestão de Pipeline

1. **OPERADOR_COOPERATIVA** acessa `/leads`
2. Visualiza kanban ou lista dos leads com seus estágios
3. Abre o lead, registra a atividade de contato realizada
4. Atualiza o estágio para COTAÇÃO e vincula a cotação gerada
5. Registra data do próximo follow-up
6. Quando aprovado pelo cooperado, emite a apólice e fecha o lead como GANHO

![Landing page de captação tematizada](../static/img/screenshots/captacao-landing.png)

:::info Captura sugerida
Landing page de uma singular com logo, gradiente nas cores da cooperativa, tagline, e formulário fast-track com campos CEP e data de nascimento, resultado de estimativa exibido em destaque e botão de WhatsApp.
:::

![CRM de leads com pipeline](../static/img/screenshots/leads-pipeline.png)

:::info Captura sugerida
Visão de lista do CRM de leads com colunas: nome, produto, origem (badge colorido), estágio (badge colorido), prêmio estimado, responsável, próximo contato. Filtros de estágio, produto e responsável no topo.
:::
