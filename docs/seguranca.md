---
sidebar_position: 5
---

# Segurança & LGPD

A Tegra foi projetada com segurança em múltiplas camadas, atendendo às exigências regulatórias da SUSEP, aos requisitos da Lei Geral de Proteção de Dados (LGPD — Lei 13.709/2018) e às melhores práticas de segurança para aplicações financeiras.

## Camadas de Segurança

### 1. Autenticação Forte

**Para operadores**: combinação de senha + TOTP (Time-based One-Time Password), o mesmo padrão utilizado por bancos. O segredo TOTP é gerado individualmente para cada usuário, armazenado de forma criptografada, e nunca retransmitido após a configuração.

**Para segurados**: token de convite de uso único com prazo de validade de 48 horas para o primeiro acesso, combinado com hash bcrypt de senha para logins subsequentes. O auto-cadastro via Google OAuth requer aprovação manual de operador humano.

**Para integrações B2B**: OAuth2 com client credentials — o secret é exibido apenas uma vez e armazenado como hash bcrypt. Não é possível recuperar o secret original — apenas revogar e criar um novo.

### 2. Autorização por Role e Tenant

Cada requisição verifica simultaneamente:

- **Autenticidade**: o token JWT é válido e não expirou?
- **Role**: o usuário tem permissão para esta ação?
- **Tenant**: o recurso pertence à singular do usuário?

Um operador com JWT válido de uma singular não acessa dados de outra — a query sempre inclui o filtro `cooperativaId` derivado do token.

### 3. Proteção contra Força Bruta

Registros de tentativas de login com e-mail, IP e resultado. Padrões de ataque acionam bloqueio automático. Registros mantidos por 90 dias (conforme política de retenção LGPD) e disponíveis para análise da equipe de segurança.

### 4. Isolamento de Dados por Tenant

Isolamento implementado em nível de banco de dados — não apenas de interface. Todas as tabelas operacionais têm isolamento explícito por `cooperativaId`:

| Tabela | Dados protegidos |
|---|---|
| `audit_logs` | Histórico de todas as operações |
| `login_attempts` | Tentativas de acesso (retidos 90 dias) |
| `mensagens_whatsapp` | Comunicações com segurados (retidas 1 ano) |
| `cotacoes_detalhe` | Detalhamento de cálculos de prêmio |
| `atividades_lead` | Histórico de interações com leads |
| Todas as tabelas operacionais | Apólices, sinistros, pagamentos, etc. |

### 5. Criptografia e Armazenamento Seguro

- **Senhas**: bcrypt com salt individual por registro
- **Secrets OAuth2**: bcrypt — hash apenas, exibidos uma única vez
- **Segredos TOTP**: armazenados criptografados no banco
- **Tokens de convite**: UUID com entropia criptográfica, com prazo de expiração e limpeza automática após vencimento

### 6. Audit Log Imutável

O log de auditoria é append-only por design. Cada entrada registra:

- Entidade e ID do registro afetado
- Ação realizada (CREATE, UPDATE, STATUS_CHANGE, EXPORTAR_DADOS, SOLICITAR_EXCLUSAO…)
- JSON completo dos dados antes e depois
- Identidade do usuário e IP de origem
- Timestamp preciso

Esse design atende às exigências de rastreabilidade da SUSEP e fornece evidência forense em disputas ou investigações.

### 7. Validação de CPF

Todos os formulários que coletam CPF realizam validação inline com algoritmo de dígitos verificadores. Dados inválidos são rejeitados antes de chegar ao banco, evitando cadastros inconsistentes em auditorias regulatórias.

### 8. GPS e IP em Vistorias

Vistorias veiculares registram coordenadas GPS e IP do dispositivo. Isso cria cadeia de custódia verificável para as imagens, dificultando fraudes como reaproveitamento de fotos de outros veículos.

---

## Conformidade LGPD

### Base Legal por Finalidade

Toda coleta de dado pessoal tem base legal explícita (LGPD Art. 7):

| Finalidade | Base legal |
|---|---|
| Emissão e gestão de apólices | Execução de contrato |
| Cobrança de prêmios | Execução de contrato |
| Processamento de sinistros | Execução de contrato |
| Análise por IA nas vistorias | **Consentimento explícito** |
| Comunicações sobre o seguro | Execução de contrato |
| Captação de leads (contato inicial) | Legítimo interesse |
| Conformidade regulatória (SUSEP) | Obrigação legal |
| Prevenção a fraudes | Legítimo interesse |
| Notificações push | **Consentimento** (opt-in) |

### Consentimento Explícito

Dois fluxos exigem consentimento ativo antes de prosseguir:

**Captação de leads**: o formulário público (`/captacao/[slug]`) exibe checkbox obrigatório — "Li e concordo com a Política de Privacidade e autorizo o contato" — com link para `/privacidade`. O botão de envio fica desabilitado até o aceite.

**Vistoria com IA**: antes de exibir o formulário de upload de fotos, o segurado vê uma tela explicando que as imagens serão analisadas por IA (Anthropic Claude Vision) e processadas em servidores fora do Brasil. Só após aceitar explicitamente o upload é liberado.

### Direitos do Titular (LGPD Art. 18)

O segurado pode exercer todos os direitos previstos na LGPD diretamente pelo portal, acessando `/s/[slug]/meus-dados`:

| Direito | Como exercer na plataforma |
|---|---|
| **Portabilidade** | Botão "Baixar meus dados" — gera JSON com perfil, apólices, sinistros, pagamentos e comunicações |
| **Exclusão** | Formulário com protocolo único — solicitação vai para análise da equipe (dados com obrigação legal são retidos 7 anos, conforme SUSEP) |
| **Revogação de consentimento** | Botão "Desativar notificações" cancela push notifications |
| **Acesso** | Portal exibe apólices, boletos, sinistros e comunicações do titular |
| **Informação** | Link para Política de Privacidade em todas as telas do portal |

### Política de Privacidade

Disponível publicamente em `[domínio]/privacidade`. Cobre:

- Quais dados são coletados e com qual finalidade
- Base legal de cada tratamento
- Compartilhamento com terceiros (Asaas, Evolution API, Anthropic)
- Transferências internacionais (Anthropic — EUA)
- Prazos de retenção por tipo de dado
- Como exercer os direitos de titular
- Contato do encarregado (DPO)

### Retenção e Limpeza Automática

A política de retenção é aplicada automaticamente por um processo de limpeza mensal (`/api/cron/limpeza`):

| Dado | Retenção | Ação automática |
|---|---|---|
| Apólices e sinistros | 7 anos (SUSEP) | Mantidos |
| Tentativas de login | 90 dias | **Excluídas automaticamente** |
| Tokens de convite expirados | Imediato | **Campos limpos automaticamente** |
| Mensagens WhatsApp | 1 ano | **Excluídas automaticamente** |
| Leads inativos > 2 anos | Revisão humana | Sinalizados para análise |

### Mascaramento de CPF

CPF nunca é exposto em APIs B2B ou respostas de lista:

```
Resposta interna (operador autenticado): CPF completo visível
Resposta B2B (OAuth2): CPF mascarado → ***.***.***-**
```

---

## Funcionalidades de Segurança

| Funcionalidade | Descrição |
|---|---|
| TOTP 2FA para operadores | Google Authenticator / Authy compatível |
| Hash bcrypt para senhas | Salt individual por registro |
| JWT de curta duração | Tokens expiram por padrão |
| Proteção brute-force | Bloqueio por IP e e-mail após falhas |
| Audit log imutável | Append-only com JSON diff completo |
| Isolamento por tenant | Row-level isolation em todas as tabelas |
| Validação CPF inline | Algoritmo de dígitos verificadores |
| GPS + IP em vistorias | Cadeia de custódia antifraude |
| OAuth2 secret hash | Secret exibido uma vez, armazenado como hash |
| Consentimento IA (vistoria) | Tela de aceite explícito antes do upload |
| Consentimento leads | Checkbox LGPD obrigatório no formulário público |
| Portal de direitos LGPD | Portabilidade, exclusão e revogação de consentimento |
| Cron de limpeza de dados | Expurgo automático de dados fora do prazo de retenção |
| Política de privacidade | Pública em `/privacidade` |

## Fluxo de Uso — Ativação do 2FA

1. **Operador** acessa `/configuracoes/conta`
2. Clica em "Ativar autenticação em dois fatores"
3. Escaneia o QR code com Google Authenticator ou Authy
4. Digita o código de 6 dígitos para confirmar
5. A partir do próximo login, o TOTP é obrigatório

## Fluxo de Uso — Exercício de Direito de Portabilidade

1. **Segurado** acessa `/s/[slug]/meus-dados`
2. Clica em "Baixar meus dados"
3. Recebe arquivo JSON com todos os dados pessoais
4. A exportação é registrada no audit log

## Fluxo de Uso — Investigação de Acesso Suspeito

1. **ADMIN_CENTRAL** acessa `/admin/configuracoes` → Tentativas de Login
2. Filtra por IP ou e-mail no período de interesse
3. Identifica padrão de falhas
4. Bloqueia o usuário ou IP conforme necessário
5. Histórico permanece registrado para auditoria (por 90 dias)

![Painel de segurança — tentativas de login](../static/img/screenshots/seguranca-login-attempts.png)

:::info Captura sugerida
Tabela de tentativas de login com colunas: e-mail, IP, resultado (ícone verde/vermelho), data/hora. Filtros de período e e-mail no topo. IPs com múltiplas falhas destacados em laranja.
:::
