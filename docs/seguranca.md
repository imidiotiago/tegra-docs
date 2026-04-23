---
sidebar_position: 5
---

# Segurança

A Tegra foi projetada com segurança em múltiplas camadas, atendendo às exigências regulatórias da SUSEP, aos requisitos da Lei Geral de Proteção de Dados (LGPD) e às melhores práticas de segurança para aplicações financeiras. A proteção de dados de segurados e operações de seguros não é um complemento — é parte central da arquitetura.

## Camadas de Segurança

### 1. Autenticação Forte

**Para operadores**: combinação de senha + TOTP (Time-based One-Time Password), o mesmo padrão utilizado por bancos e grandes plataformas financeiras. O segredo TOTP é gerado individualmente para cada usuário, armazenado de forma criptografada, e nunca transmitido após a configuração inicial.

**Para segurados**: token de convite de uso único com prazo de validade de 48 horas para primeiro acesso, combinado com hash bcrypt de senha para logins subsequentes. O auto-cadastro via Google OAuth requer aprovação manual de operador humano antes do primeiro acesso.

**Para integrações B2B**: OAuth2 com client credentials — o secret do cliente é exibido apenas uma vez no momento da criação e armazenado como hash bcrypt. Não há como recuperar o secret original — apenas revogar e criar um novo.

### 2. Autorização por Role e Tenant

Cada requisição à API verifica simultaneamente:

- **Autenticidade**: o token JWT é válido e não expirou?
- **Role**: o usuário tem permissão para executar esta ação?
- **Tenant**: o recurso solicitado pertence à singular do usuário?

Nenhuma dessas verificações pode ser contornada independentemente. Um operador com JWT válido de uma singular não consegue acessar dados de outra singular — a query ao banco sempre inclui o filtro `cooperativaId` derivado do token do usuário.

### 3. Proteção contra Força Bruta

O sistema registra todas as tentativas de login com e-mail, IP e resultado. Padrões de ataque — múltiplas falhas em sequência do mesmo IP ou para o mesmo e-mail — acionam bloqueio automático. Os registros são mantidos por período configurável e podem ser analisados pela equipe de segurança.

### 4. Isolamento de Dados (LGPD)

O isolamento de dados entre tenants é implementado em nível de banco de dados, não apenas de interface. As seguintes tabelas possuem isolamento explícito por `cooperativaId`:

| Tabela | Dados protegidos |
|---|---|
| `audit_logs` | Histórico de todas as operações |
| `login_attempts` | Tentativas de acesso ao sistema |
| `mensagens_whatsapp` | Comunicações com segurados |
| `cotacoes_detalhe` | Detalhamento de cálculos de prêmio |
| `atividades_lead` | Histórico de interações com leads |
| Todas as tabelas operacionais | Apólices, sinistros, pagamentos, etc. |

### 5. Criptografia e Armazenamento Seguro

- **Senhas de usuários e segurados**: bcrypt com salt individual por registro
- **Secrets OAuth2**: bcrypt — armazenados apenas como hash, exibidos uma única vez
- **Segredos TOTP**: armazenados criptografados no banco
- **Tokens de convite**: UUID gerado com entropia criptograficamente segura, com prazo de expiração

### 6. Audit Log Imutável

O log de auditoria é append-only por design — não existe operação de DELETE ou UPDATE nos registros de auditoria. Cada entrada registra:

- Entidade e ID do registro afetado
- Ação realizada (CREATE, UPDATE, STATUS_CHANGE)
- JSON completo dos dados antes e depois da alteração
- Identidade do usuário e IP de origem
- Timestamp preciso

Esse design atende às exigências de rastreabilidade da SUSEP e fornece evidência forense em caso de disputas ou investigações.

### 7. Validação de Identidade (CPF)

Todos os formulários que coletam CPF — cadastro de segurados, captação de leads, emissão de apólices — realizam validação inline em tempo real com algoritmo de dígitos verificadores. Dados de CPF inválidos são rejeitados antes de chegarem ao banco, evitando cadastros inconsistentes que podem causar problemas em auditorias regulatórias.

### 8. Registro de Localização em Vistorias

As vistorias veiculares registram coordenadas GPS e endereço IP do dispositivo que realizou o envio das fotos. Isso cria uma cadeia de custódia verificável para as imagens, dificultando fraudes como reaproveitamento de fotos de outros veículos.

## Conformidade LGPD

A Tegra foi projetada considerando os princípios da LGPD:

- **Finalidade e necessidade**: dados coletados são apenas os necessários para a operação do seguro
- **Acesso controlado**: cada usuário acessa apenas os dados de sua singular
- **Rastreabilidade**: todas as operações com dados pessoais são auditadas
- **Portabilidade**: relatórios self-service permitem exportar dados de cooperados em CSV
- **Segurança**: múltiplas camadas de proteção conforme descrito acima

:::tip Para o DPO
O audit log e os registros de login_attempts fornecem a base documental para responder a eventuais solicitações de titulares de dados (direito de acesso, portabilidade) e a investigações da ANPD.
:::

## Funcionalidades de Segurança

| Funcionalidade | Descrição |
|---|---|
| TOTP 2FA para operadores | Google Authenticator / Authy compatível |
| Hash bcrypt para senhas | Salt individual, fator de custo configurável |
| JWT de curta duração | Tokens expiram por padrão |
| Proteção brute-force | Bloqueio por IP e por e-mail após falhas |
| Audit log imutável | Append-only, com JSON diff completo |
| Isolamento por tenant | Row-level isolation em todas as tabelas |
| Validação CPF inline | Algoritmo de dígitos verificadores em tempo real |
| GPS + IP em vistorias | Rastreabilidade geográfica para antifraude |
| OAuth2 secret hash | Secret exibido apenas uma vez, armazenado como hash |
| Aprovação manual de OAuth social | Auto-cadastro via Google requer aprovação humana |

## Fluxo de Uso — Ativação do 2FA

1. **Operador** acessa `/configuracoes/conta`
2. Clica em "Ativar autenticação em dois fatores"
3. Escaneia o QR code com Google Authenticator ou Authy
4. Digita o código de 6 dígitos exibido no app para confirmar
5. A partir do próximo login, o código TOTP será obrigatório

## Fluxo de Uso — Investigação de Acesso Suspeito

1. **ADMIN_FEDERACAO** acessa `/admin/configuracoes` → Tentativas de Login
2. Filtra por IP ou por e-mail no período de interesse
3. Identifica padrão de falhas
4. Bloqueia o usuário ou IP conforme necessário
5. O histórico de tentativas permanece registrado para fins de auditoria

![Painel de segurança — tentativas de login](../static/img/screenshots/seguranca-login-attempts.png)

:::info Captura sugerida
Tabela de tentativas de login com colunas: e-mail, IP, resultado (ícone verde/vermelho), data/hora. Filtros de período e e-mail no topo. Indicador de IPs com múltiplas falhas destacados em laranja.
:::
