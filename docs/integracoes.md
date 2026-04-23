---
sidebar_position: 17
---

# Integrações

A Tegra foi projetada para operar conectada ao ecossistema digital das cooperativas. O módulo de integrações cobre três frentes principais: comunicação com cooperados via WhatsApp, cobrança via gateways de pagamento, e acesso programático por sistemas externos via API REST B2B com OAuth2.

## WhatsApp — Evolution API

A integração com WhatsApp usa a **Evolution API** — uma solução de automação WhatsApp amplamente adotada no mercado brasileiro. A Tegra envia mensagens automáticas e manuais para cooperados e leads, com rastreabilidade completa e conformidade LGPD.

### Casos de Uso Ativos

| Template | Gatilho | Destinatário |
|---|---|---|
| COTACAO_ENVIADA | Cotação formal gerada | Lead |
| BOLETO_GERADO | Cobrança mensal criada | Segurado |
| INADIMPLENCIA_AVISO | Pagamento vencido X dias | Segurado |
| PERSONALIZADA | Ação manual do operador | Lead ou Segurado |

### Rastreabilidade de Mensagens

Toda mensagem enviada — automática ou manual — é registrada na tabela `MensagemWhatsapp` com:

- Número de destino, template usado e texto efetivamente enviado
- Status (ENVIADA, FALHA, RESPONDIDA)
- ID externo da mensagem no provider (para rastreamento no painel Evolution)
- Vínculo com lead ou pagamento (quando aplicável)
- Usuário responsável (para mensagens manuais)
- Timestamp

Esse registro atende à exigência da LGPD de rastreabilidade das comunicações com titulares de dados.

### Configuração

A integração é configurada por federação com a URL e chave de API da instância Evolution. Cada singular usa o número de WhatsApp cadastrado no seu perfil como remetente — mantendo a identidade da cooperativa local nas mensagens.

:::tip WhatsApp como canal de atendimento
Além das notificações automáticas, o PWA do segurado possui botão de acesso direto ao WhatsApp da singular para dúvidas e atendimento. Essa integração fecha o ciclo de comunicação — da notificação automática ao atendimento humano, tudo no mesmo canal.
:::

## Gateways de Pagamento

A arquitetura de pagamentos da Tegra é plugável — o sistema não está atrelado a um único gateway. A integração padrão é com o **Asaas**, que oferece:

- Geração de boleto bancário registrado
- Pix com QR code e código copia-e-cola
- Webhook para confirmação automática de pagamento
- API de consulta de status de cobranças

### Fluxo de Integração

1. Sistema cria cobrança no Asaas via API REST
2. Asaas retorna ID externo, link do boleto e código Pix
3. Tegra armazena esses dados no registro de `Pagamento`
4. Cooperado paga pelo canal de sua preferência
5. Asaas dispara webhook para a Tegra
6. Tegra confirma o pagamento automaticamente, sem ação humana

### Novos Gateways

A camada de abstração do gateway permite integrar novos provedores (PagBank, Mercado Pago, Efí Bank, etc.) implementando apenas um adaptador — sem alterar a lógica de negócio ou o modelo de dados.

## API REST B2B — OAuth2 Client Credentials

A Tegra oferece uma API REST completa para integração com sistemas externos — ERPs, sistemas de gestão próprios das singulares, portais de parceiros e ferramentas de analytics.

### Autenticação OAuth2

A API usa o fluxo **Client Credentials** do OAuth2 (RFC 6749) — o padrão de mercado para integrações máquina-a-máquina:

```
POST /api/auth/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials
&client_id={CLIENT_ID}
&client_secret={CLIENT_SECRET}

→ { "access_token": "...", "expires_in": 3600 }
```

O token obtido é usado como `Bearer` nas requisições subsequentes.

### Gestão de Clientes OAuth2

O **ADMIN_FEDERACAO** gerencia clientes OAuth2 em `/admin/oauth-clients`:

- Cria cliente com nome descritivo (ex: "ERP Uniseg Joinville")
- Define escopo do cliente: vinculado a uma singular específica ou acesso global
- Configura os **escopos de permissão** concedidos
- O `client_secret` é exibido **apenas uma vez** — armazenado como hash bcrypt
- Clientes podem ser revogados a qualquer momento

### Escopos Disponíveis

| Escopo | Acesso concedido |
|---|---|
| `apolices.read` | Listar e consultar apólices |
| `apolices.write` | Criar e atualizar apólices |
| `segurados.read` | Listar e consultar segurados |
| `segurados.write` | Criar e atualizar segurados |
| `sinistros.read` | Listar e consultar sinistros |
| `sinistros.write` | Registrar e atualizar sinistros |
| `pagamentos.read` | Consultar histórico de pagamentos |
| `coberturas.read` | Consultar catálogo de coberturas |

### Rastreabilidade de Uso da API

O sistema registra `ultimoUsoEm` para cada cliente OAuth2, permitindo identificar clientes inativos. Toda requisição autenticada via API gera registros no audit log com o clientId como responsável — a mesma rastreabilidade das ações humanas.

### Isolamento por Tenant

Um cliente OAuth2 vinculado a uma singular específica só consegue acessar dados dessa singular — mesmo que o endpoint permita escopo global. O isolamento é garantido pelo mesmo mecanismo das sessões de usuário.

## Notificações Push (Web Push)

O PWA do segurado suporta notificações push via Web Push API (padrão W3C). As assinaturas push são armazenadas por segurado e são usadas para enviar notificações mesmo com o app fechado:

- Cobrança gerada para o mês
- Pagamento confirmado
- Mudança de status do sinistro
- Resultado de vistoria disponível

As assinaturas são gerenciadas automaticamente — quando o segurado revoga permissões no navegador, o registro é removido na próxima tentativa de envio.

## Funcionalidades

| Funcionalidade | Papel |
|---|---|
| Configurar instância Evolution WhatsApp | ADMIN_FEDERACAO |
| Enviar mensagem manual pelo WhatsApp | OPERADOR_COOPERATIVA |
| Visualizar histórico de mensagens enviadas | GESTOR_COOPERATIVA |
| Criar e revogar clientes OAuth2 | ADMIN_FEDERACAO |
| Configurar escopos e singular do cliente | ADMIN_FEDERACAO |
| Consultar último uso do cliente API | ADMIN_FEDERACAO |
| Consumir a API REST B2B | Sistemas externos (via OAuth2) |
| Receber notificações push | Segurado (PWA) |

## Fluxo de Uso — Criação de Integração B2B

1. **ADMIN_FEDERACAO** acessa `/admin/oauth-clients/novo`
2. Define nome do cliente (ex: "CRM Externo Singular Norte")
3. Vincula a uma singular específica (ou deixa global)
4. Seleciona escopos: `apolices.read`, `segurados.read`
5. Sistema gera e exibe `client_id` e `client_secret` (uma única vez)
6. Equipe técnica do parceiro armazena as credenciais em segurança
7. Parceiro faz chamadas autenticadas à API da Tegra
8. Uso fica registrado com `ultimoUsoEm` atualizado a cada chamada

![Gestão de clientes OAuth2](../static/img/screenshots/integracoes-oauth-clients.png)

:::info Captura sugerida
Tabela de clientes OAuth2 com colunas: nome do cliente, singular vinculada, escopos (badges), status (ativo/revogado), último uso, data de criação. Botões Criar e Revogar. Modal de criação com campos nome, singular e checkboxes de escopos.
:::

![Histórico de mensagens WhatsApp](../static/img/screenshots/integracoes-whatsapp.png)

:::info Captura sugerida
Lista de mensagens WhatsApp com colunas: destinatário (número mascarado), template, status (ENVIADA=verde, FALHA=vermelho), data/hora, vínculo (Lead ou Pagamento com link). Filtros de template e período.
:::
