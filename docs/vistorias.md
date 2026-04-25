---
sidebar_position: 12
---

# Vistorias com IA

O módulo de vistorias da Tegra digitaliza completamente o processo de vistoria veicular — eliminando a necessidade de visita presencial do vistoriador e reduzindo o ciclo de subscrição de dias para horas. O cooperado realiza a vistoria pelo próprio smartphone, o sistema analisa cada foto com inteligência artificial e gera um score de aprovação auditável.

## Dois tipos de vistoria

| Tipo | Quando ocorre | Vinculação |
|---|---|---|
| **Vistoria de Cadastro** | Durante o onboarding — antes da primeira apólice | Segurado |
| **Vistoria de Apólice** | Na renovação ou por solicitação do operador | Apólice específica |

---

## Vistoria de Cadastro (Pré-Apólice)

Esta é a **etapa obrigatória do onboarding**: o segurado só recebe sua primeira apólice após ter a vistoria de cadastro aprovada por um operador.

### Fluxo do segurado

Após se cadastrar e ter o acesso aprovado pelo operador, o segurado faz login no PWA e é redirecionado automaticamente para a tela de vistoria:

```
Login no PWA
    ↓
Tela de vistoria de cadastro (automática)
    ↓  aceita consentimento IA (LGPD)
Upload das 7 fotos obrigatórias
    ↓
Status: EM_ANALISE
    ↓  operador revisa e aprova
Status: APROVADA
    ↓  operador emite a apólice
Portal liberado com apólice ativa
```

A barra de progresso na tela guia o segurado pelas etapas: **Cadastro → Vistoria → Análise → Apólice**.

### O que acontece enquanto aguarda

- **EM_ANALISE**: home do PWA exibe banner azul "Suas fotos estão sendo analisadas. Você receberá uma notificação quando concluído."
- **APROVADA (sem apólice ainda)**: banner verde "Vistoria aprovada! Um consultor entrará em contato em breve para emitir sua apólice."

:::tip Por que exigir vistoria antes da apólice?
Essa etapa substitui a vistoria presencial tradicional. O cooperado realiza em minutos pelo celular o que antes levava dias e custos logísticos. A IA filtra 90%+ dos casos aprovados automaticamente, liberando o operador para focar apenas nos casos que requerem revisão.
:::

---

## Fotos Obrigatórias (7 posições)

Todas as vistorias — de cadastro ou de apólice — exigem as mesmas 7 fotos. O sistema bloqueia o envio enquanto não estiverem todas preenchidas:

| Posição | Descrição |
|---|---|
| **FRENTE** | Para-choque dianteiro, faróis e capô visíveis |
| **TRASEIRA** | Para-choque traseiro, lanternas e placa visíveis |
| **LATERAL_ESQ** | Porta do motorista e roda traseira |
| **LATERAL_DIR** | Porta do passageiro e roda |
| **CHASSI** | Número do chassi gravado na estrutura do veículo |
| **ODOMETRO** | Painel com a quilometragem atual |
| **DOC** | CRLV ou DUT — documento do veículo aberto e legível |

No PWA do cooperado, cada slot obrigatório vazio aparece com **borda vermelha** e badge "obrigatória". O contador "0/7 → 7/7" mostra o progresso em tempo real. O botão de envio só é habilitado com todas as 7 fotos.

---

## Análise por Inteligência Artificial

Para cada foto enviada, a IA realiza uma análise automática:

- **Score de qualidade** — a foto está nítida e no ângulo correto?
- **Labels detectados** — "veículo", "dano aparente", "placa legível", etc.
- **Flags de atenção** — anomalias que requerem revisão humana
- **Sugestão de ação** — APROVADA, REPROVADA ou REVISÃO

O sistema consolida a análise de todas as fotos em um **score médio** da vistoria.

:::tip Redução de fraude por IA
A análise identifica padrões suspeitos — fotos reutilizadas de outros veículos, imagens editadas, danos pré-existentes ou inconsistências entre o chassi fotografado e o declarado. Isso reduz fraudes sem aumentar a fricção para cooperados honestos.
:::

### Consentimento LGPD

Antes de iniciar o upload, o segurado vê uma tela explicando que as fotos serão analisadas pela IA da Anthropic (Claude Vision) e que podem ser processadas em servidores nos EUA. O segurado aceita explicitamente antes de prosseguir — em conformidade com LGPD Art. 7, I.

---

## Rastreabilidade GPS e IP

Para cada vistoria, a plataforma captura:

- **Coordenadas GPS** (latitude e longitude) do dispositivo
- **Endereço IP** de origem
- **User-agent** do dispositivo (modelo e sistema operacional)

Essa cadeia de rastreabilidade cria evidência forense de onde e quando a vistoria foi realizada.

---

## Vistoria pelo Operador (Backoffice)

Operadores criam vistorias manualmente em `/vistorias/nova`. A interface usa o mesmo sistema de slots de câmera — sem campos de URL. O operador pode usar a câmera do celular ou selecionar imagens do computador.

Uma vistoria pode ser vinculada a:
- Um **segurado** — vistoria de cadastro pré-apólice
- Uma **apólice existente** — renovação ou endosso
- Um **lead** — vistoria prévia à conversão

---

## Status da Vistoria

| Status | Quem vê | Descrição |
|---|---|---|
| **PENDENTE** | Segurado, Operador | Criada, aguardando envio das fotos |
| **EM_ANALISE** | Segurado (banner), Operador | Fotos enviadas, IA processando / operador revisando |
| **APROVADA** | Segurado (banner), Operador | Aprovada — libera emissão da apólice |
| **REPROVADA** | Segurado (tela de reenvio), Operador | Reprovada — segurado deve reenviar as fotos |

---

## Análise e Decisão Humana

A IA é uma ferramenta de apoio — a decisão final é sempre do operador. Na tela de detalhe da vistoria, o operador revisa:

- Grade de fotos enviadas com score e labels de cada uma
- Flags de atenção da IA
- Score médio consolidado
- Localização GPS do envio
- IP e User-Agent do dispositivo

Com base nessa análise, aprova ou reprova — com registro de observações e timestamp no audit log.

---

## Funcionalidades

| Funcionalidade | Papel |
|---|---|
| Realizar vistoria de cadastro (onboarding) | Segurado (PWA) |
| Criar vistoria manual (avulsa, lead ou apólice) | OPERADOR_COOPERATIVA |
| Enviar 7 fotos obrigatórias | Segurado (PWA), OPERADOR_COOPERATIVA |
| Analisar fotos e mudar status | OPERADOR_COOPERATIVA |
| Ver resultado da IA por foto | OPERADOR_COOPERATIVA, GESTOR_COOPERATIVA |
| Reprocessar análise IA | OPERADOR_COOPERATIVA |
| Acompanhar status (banner no home) | Segurado (PWA) |

---

## Fluxo de Uso — Onboarding com Vistoria de Cadastro

1. **Segurado** conclui cadastro e recebe aprovação do operador
2. Faz login no PWA — sistema detecta ausência de apólice e redireciona para vistoria
3. Lê e aceita o consentimento de análise por IA
4. Fotografa o veículo nas 7 posições (câmera traseira abre automaticamente)
5. Envia — status muda para EM_ANALISE
6. **Operador** recebe a vistoria em `/vistorias`, revisa as fotos e o relatório IA
7. Aprova — status muda para APROVADA
8. Operador emite a apólice para o segurado
9. **Segurado** recebe notificação push e acessa o portal completo

## Fluxo de Uso — Vistoria de Renovação

1. **Operador** cria vistoria em `/vistorias/nova` vinculando à apólice
2. Envia link ao segurado via WhatsApp
3. Segurado abre o link no smartphone e realiza o upload das 7 fotos
4. Operador revisa e aprova
5. Renovação da apólice é liberada

![Painel de vistorias com análise IA](../static/img/screenshots/vistorias-lista.png)

:::info Captura sugerida
Lista de vistorias com miniatura da primeira foto, status (badge colorido), score médio da IA, tipo (CADASTRO / APÓLICE), segurado associado e data de envio.
:::

![Detalhe da vistoria com análise por foto](../static/img/screenshots/vistoria-detalhe.png)

:::info Captura sugerida
Página de detalhe mostrando grade de fotos com score e labels IA em cada uma, localização GPS, score médio em destaque, botões Aprovar/Reprovar e campo de observações.
:::
