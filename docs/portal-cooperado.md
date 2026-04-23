---
sidebar_position: 14
---

# Portal do Cooperado (PWA)

O Portal do Cooperado é um Progressive Web App (PWA) que permite ao segurado gerenciar sua proteção cooperativa diretamente do smartphone — sem precisar baixar nada de loja de aplicativos. Com a mesma identidade visual da cooperativa singular, o app oferece acesso a boletos, sinistros, assistência, vistoria do veículo e notificações push em tempo real.

## O que é um PWA

Um PWA é um site que se comporta como aplicativo nativo. O segurado acessa pelo navegador do smartphone e pode "instalar" adicionando à tela inicial. A partir daí:

- Aparece com ícone próprio na tela do celular
- Abre em tela cheia, sem barra de endereço do navegador
- Funciona parcialmente offline (telas em cache)
- Recebe notificações push mesmo com o app fechado

Não há submissão para App Store ou Google Play, não há revisão de loja, não há custo por download. A cooperativa distribui o PWA simplesmente compartilhando o link — no WhatsApp, por e-mail, num QR code no escritório.

:::tip Vantagem competitiva clara
Apps nativos custam R$ 50.000+ para desenvolver e R$ 10.000+/ano para manter. O PWA da Tegra está incluído na plataforma, com atualização automática e identidade visual por singular.
:::

## Identidade Visual por Singular

Cada singular tem seu próprio PWA, acessível em `/{slug-da-cooperativa}/`. O app exibe:

- Logo da cooperativa no topo
- Cores primária e secundária nos elementos de destaque
- Nome da singular no manifesto (aparece na tela inicial do celular)
- Ícone personalizado da singular

O segurado de Joinville tem o app da "Cooperativa Uniseg Joinville". O segurado de Florianópolis tem o app da "Cooperativa Florianópolis". A experiência é da cooperativa, não da plataforma.

## Funcionalidades do PWA

### Boletos e Pagamentos

O segurado acessa o histórico completo de cobranças mensais:

- Lista de competências com status de cada cobrança (paga, pendente, atrasada)
- Segunda via de boleto com código de barras para leitura
- Pix copia-e-cola para pagamento instantâneo
- Confirmação visual do pagamento em tempo real

### Sinistros

O segurado gerencia sinistros sem sair do app:

- **Abre novo sinistro** diretamente pelo PWA, com formulário guiado
- Informa data da ocorrência e descrição detalhada
- Acompanha o status (ABERTO → EM_ANALISE → APROVADO/NEGADO → PAGO) em tempo real
- Recebe notificação push a cada mudança de status

### Vistoria do Veículo

O cooperado realiza a vistoria integralmente pelo smartphone:

1. Acessa "Vistoria" no menu
2. O app solicita permissão de localização (GPS capturado automaticamente)
3. Guia o segurado pelas 7 posições de fotografia
4. Fotos são enviadas para análise da IA
5. Status da vistoria é acompanhado no app

### Assistência 24h

O PWA centraliza os canais de assistência:

- Botão de contato direto com a cooperativa por WhatsApp
- Números de emergência da assistência 24h (reboque, chaveiro, etc.)
- Acesso rápido ao número do sinistro em andamento

### Seção de Furto/Roubo

Rota dedicada para casos de furto ou roubo do veículo segurado:

- Orientações passo a passo sobre o que fazer imediatamente
- Checklist de documentos necessários
- Formulário de abertura de sinistro pré-configurado para esse tipo de ocorrência
- Links para boletim de ocorrência online

### Minhas Apólices

O segurado visualiza suas apólices ativas:

- Produto, plano contratado e coberturas incluídas
- Período de vigência
- Prêmio mensal
- Documentos da apólice

### Notificações Push

Com consentimento do usuário, o PWA envia notificações push para eventos importantes:

- Boleto gerado para o mês vigente
- Vencimento de pagamento se aproximando
- Mudança de status do sinistro
- Resultado da vistoria
- Renovação de apólice próxima

As notificações chegam mesmo com o app fechado, no padrão das notificações nativas do smartphone.

## Fluxo de Primeiro Acesso

1. Cooperado recebe link de convite por e-mail ou WhatsApp
2. Abre o link no navegador do smartphone
3. Define sua senha no formulário de ativação
4. Visualiza o prompt "Adicionar à tela inicial" — clica para instalar o PWA
5. Ativa as notificações push quando solicitado
6. App está instalado e pronto para uso

## Autenticação

O segurado faz login com CPF (ou e-mail) e senha. A sessão é mantida por tempo configurável, evitando que o cooperado precise se autenticar toda vez que abre o app. Em caso de dúvida ou perda de senha, o reset pode ser feito diretamente no app.

Para novos cooperados, a opção de cadastro via conta Google também está disponível — sujeita à aprovação do operador da singular.

## Funcionalidades Resumidas

| Funcionalidade | Disponível no PWA |
|---|---|
| Visualizar apólices ativas | Sim |
| Segunda via de boleto / Pix | Sim |
| Abrir sinistro | Sim |
| Acompanhar status do sinistro | Sim |
| Realizar vistoria do veículo | Sim |
| Assistência 24h e emergência | Sim |
| Notificações push | Sim (com consentimento) |
| Histórico de pagamentos | Sim |
| Login com CPF/e-mail ou Google | Sim |
| Funcionar offline (parcial) | Sim |
| Instalar na tela inicial | Sim |

![Home do PWA do segurado](../static/img/screenshots/pwa-home.png)

:::info Captura sugerida
Tela inicial do PWA mostrando logo da cooperativa no topo, saudação com nome do segurado, cards de acesso rápido (Boletos, Sinistros, Vistoria, Assistência), e badge de notificação se houver pagamento pendente.
:::

![Tela de boletos no PWA](../static/img/screenshots/pwa-boletos.png)

:::info Captura sugerida
Lista de competências mensais com status visual (ícone verde para pago, vermelho para atrasado, cinza para pendente), valor do prêmio e botão "Ver Boleto / Pix" para as competências não pagas.
:::
