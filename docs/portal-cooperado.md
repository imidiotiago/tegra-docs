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

Cada singular tem seu próprio PWA, acessível em `/s/{slug-da-cooperativa}/`. O app exibe:

- Logo da cooperativa no topo
- Cores primária e secundária nos elementos de destaque
- Nome da singular no manifesto (aparece na tela inicial do celular)
- Ícone personalizado da singular

O segurado de Joinville tem o app da "Cooperativa Uniseg Joinville". O segurado de Florianópolis tem o app da "Cooperativa Florianópolis". A experiência é da cooperativa, não da plataforma.

---

## Fluxo Completo — Do Cadastro à Apólice

O onboarding do segurado no PWA segue etapas obrigatórias sequenciais:

```
1. CADASTRO
   Segurado preenche dados básicos no portal da singular
   (ou é cadastrado diretamente pelo operador)
        ↓
2. APROVAÇÃO
   Operador aprova o cadastro no backoffice
        ↓
3. ACESSO
   Segurado recebe link de convite, define senha e instala o PWA
        ↓
4. VISTORIA DE CADASTRO  ← etapa obrigatória nova
   Sistema redireciona automaticamente para a tela de vistoria
   7 fotos obrigatórias + análise por IA
        ↓
5. ANÁLISE
   Operador revisa as fotos e aprova/reprova
        ↓
6. EMISSÃO
   Operador emite a apólice para o segurado
        ↓
7. PORTAL COMPLETO
   Segurado acessa boletos, sinistros, assistência, etc.
```

### Por que a vistoria é obrigatória antes da apólice?

A vistoria de cadastro substitui a vistoria presencial tradicional — que levava dias e gerava custos logísticos. O cooperado realiza em minutos pelo celular. Sem vistoria **APROVADA**, a emissão da apólice é bloqueada no sistema.

---

## Funcionalidades do PWA

### Vistoria de Cadastro (onboarding)

Etapa obrigatória antes da primeira apólice. O sistema redireciona automaticamente para esta tela assim que o segurado faz login sem ter apólice ativa.

- Barra de progresso: **Cadastro → Vistoria → Análise → Apólice**
- Consentimento explícito de análise por IA antes do upload (LGPD)
- 7 posições fotográficas obrigatórias (câmera traseira abre automaticamente no celular)
- Slots vermelhos indicam fotos faltantes — botão de envio bloqueado até completar
- Status em tempo real: EM_ANALISE → APROVADA

Enquanto aguarda o resultado:
- **Em análise**: banner azul no home — "Suas fotos estão sendo analisadas"
- **Aprovada**: banner verde — "Vistoria aprovada! Um consultor entrará em contato"
- **Reprovada**: tela de reenvio com indicação de quais fotos precisam ser refeitas

### Boletos e Pagamentos

O segurado acessa o histórico completo de cobranças mensais:

- Lista de competências com status de cada cobrança (paga, pendente, atrasada)
- Segunda via de boleto com código de barras para leitura
- Pix copia-e-cola para pagamento instantâneo
- Confirmação visual do pagamento em tempo real

### Sinistros

O segurado gerencia sinistros sem sair do app:

- **Abre novo sinistro** com formulário guiado (data, descrição, severidade)
- Acompanha o status (ABERTO → EM_ANALISE → APROVADO/NEGADO → PAGO) em tempo real
- Recebe notificação push a cada mudança de status

### Vistoria de Apólice

Além da vistoria de cadastro, o segurado pode realizar vistorias vinculadas a apólices existentes (renovação, endosso) quando solicitado pelo operador. O fluxo de câmera é idêntico ao de cadastro.

### Assistência 24h

O PWA centraliza os canais de assistência:

- Botão de contato direto com a cooperativa por WhatsApp
- Números de emergência da assistência 24h (reboque, chaveiro, etc.)
- Acesso rápido ao número do sinistro em andamento

### Minhas Apólices

O segurado visualiza suas apólices ativas:

- Produto, plano contratado e coberturas incluídas
- Período de vigência e prêmio mensal
- Documentos da apólice

### Meus Dados e Privacidade (LGPD)

Acesso direto em `/s/{slug}/meus-dados`:

- **Portabilidade**: baixar todos os dados pessoais em JSON (perfil, apólices, sinistros, pagamentos)
- **Exclusão**: solicitar exclusão de dados com protocolo e prazo de 15 dias úteis
- **Notificações**: desativar notificações push a qualquer momento
- **Política de privacidade**: link direto para leitura completa

### Notificações Push

Com consentimento do usuário (opt-in), o PWA envia notificações para:

- Boleto gerado para o mês vigente
- Vencimento de pagamento se aproximando
- Mudança de status do sinistro
- Resultado da vistoria
- Renovação de apólice próxima

As notificações chegam mesmo com o app fechado, no padrão das notificações nativas do smartphone.

---

## Autenticação

O segurado faz login com CPF (ou e-mail) e senha. A sessão é mantida por tempo configurável, evitando autenticação a cada abertura do app.

Para novos cooperados, o cadastro via conta Google também está disponível — sujeito à aprovação manual do operador da singular.

---

## Funcionalidades Resumidas

| Funcionalidade | Disponível no PWA |
|---|---|
| Vistoria de cadastro obrigatória (onboarding) | Sim — etapa 1 |
| Visualizar apólices ativas | Sim |
| Segunda via de boleto / Pix | Sim |
| Abrir sinistro | Sim |
| Acompanhar status do sinistro | Sim |
| Vistoria de renovação / endosso | Sim |
| Assistência 24h e emergência | Sim |
| Notificações push | Sim (com consentimento) |
| Histórico de pagamentos | Sim |
| Exportar meus dados (LGPD) | Sim |
| Solicitar exclusão de dados (LGPD) | Sim |
| Login com CPF/e-mail ou Google | Sim |
| Funcionar offline (parcial) | Sim |
| Instalar na tela inicial | Sim |

![Home do PWA do segurado](../static/img/screenshots/pwa-home.png)

:::info Captura sugerida
Tela inicial do PWA mostrando logo da cooperativa, saudação com nome do segurado, cards de acesso rápido (Boletos, Sinistros, Vistoria, Assistência) e — quando aplicável — banner de status de vistoria em análise ou aprovada.
:::

![Tela de boletos no PWA](../static/img/screenshots/pwa-boletos.png)

:::info Captura sugerida
Lista de competências mensais com status visual (verde pago, vermelho atrasado, cinza pendente), valor do prêmio e botão "Ver Boleto / Pix" para as competências não pagas.
:::
