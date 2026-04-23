---
sidebar_position: 3
---

# Autenticação

A Tegra opera com dois universos de autenticação completamente separados: o portal operacional (acessado por funcionários das cooperativas e da federação) e o PWA do segurado (acessado pelos cooperados via smartphone). Essa separação garante que uma credencial de segurado nunca possa ser usada para acessar dados operacionais, e vice-versa.

## Autenticação de Operadores

Os usuários operacionais — ADMIN_FEDERACAO, GESTOR_COOPERATIVA e OPERADOR_COOPERATIVA — acessam a plataforma via navegador com e-mail e senha, com opção de segundo fator de autenticação via TOTP.

### Login com Senha

O fluxo padrão exige e-mail e senha. As senhas são armazenadas com hash bcrypt, nunca em texto claro. O sistema rejeita senhas fracas e exige troca no primeiro acesso para usuários criados pelo administrador.

### 2FA com TOTP

Operadores podem (e devem, por boas práticas) ativar o segundo fator de autenticação baseado em TOTP — o mesmo padrão usado pelo Google Authenticator, Authy e Microsoft Authenticator. O fluxo de ativação:

1. O usuário acessa as configurações de conta e solicita ativar o 2FA
2. A plataforma gera um segredo base32 exclusivo e exibe o QR code
3. O usuário escaneia com o app autenticador de sua preferência
4. O sistema valida um código de 6 dígitos antes de confirmar a ativação
5. A partir desse momento, cada login exige e-mail + senha + código TOTP atual

:::tip Recomendação de segurança
Para operações sensíveis como emissão de apólices com desconto acima do limite ou revogação de clientes OAuth, a habilitação do 2FA é altamente recomendada. Organizações com exigência de conformidade regulatória devem torná-la obrigatória para todos os operadores.
:::

### Proteção contra Força Bruta

Todas as tentativas de login são registradas com e-mail, IP e resultado (sucesso ou falha). O sistema detecta padrões de ataque e bloqueia automaticamente após exceder o limiar configurado de tentativas falhas. Os registros de tentativas são isolados por tenant para análise de segurança por singular.

### Sessões JWT

Após autenticação bem-sucedida, o sistema emite um token JWT de curta duração. O token carrega o ID do usuário, seu role e o ID da cooperativa à qual pertence — informações usadas pelo middleware de autorização em cada requisição.

## Autenticação de Segurados (PWA)

Os cooperados acessam a plataforma exclusivamente via PWA (app instalável no smartphone). O fluxo de autenticação é diferente do fluxo operacional e foi projetado para ser simples e acessível.

### Convite por Token

O fluxo padrão de primeiro acesso:

1. O operador cadastra o segurado no sistema com nome, CPF e data de nascimento
2. A plataforma gera um token de convite único e envia por e-mail (ou WhatsApp)
3. O segurado acessa o link, define sua senha e está imediatamente ativo
4. Tokens de convite expiram em 48 horas por segurança

### Auto-cadastro com Google

Segurados também podem se auto-cadastrar usando sua conta Google. O fluxo:

1. Na landing page da singular, o cooperado clica em "Acessar com Google"
2. Após autenticação OAuth, o sistema verifica se o CPF já está cadastrado
3. Se não estiver, o cadastro fica pendente de aprovação do operador
4. O operador recebe notificação e aprova ou rejeita o acesso
5. Aprovado, o segurado recebe notificação e pode acessar normalmente

:::info Controle de acesso ao portal
A aprovação manual de auto-cadastros evita que qualquer pessoa com e-mail Google acesse dados de cooperados sem verificação de vínculo cooperativo. Essa etapa é obrigatória e auditada.
:::

### Reset de Senha

Segurados que esquecem a senha podem solicitar reset pelo próprio PWA. O sistema gera novo token de convite com validade de 48 horas e envia por e-mail. O fluxo é idêntico ao primeiro acesso.

## Funcionalidades

| Funcionalidade | Operadores | Segurados |
|---|---|---|
| Login com e-mail e senha | Sim | Sim |
| 2FA TOTP (Google Authenticator) | Sim | Não |
| Auto-cadastro com Google OAuth | Não | Sim (com aprovação) |
| Convite por token com validade | Via admin | Sim |
| Reset de senha self-service | Sim | Sim |
| Proteção brute-force por IP | Sim | Sim |
| Log de todas as tentativas | Sim (por tenant) | Sim (por tenant) |
| Sessão JWT de curta duração | Sim | Sim |

## Fluxo de Uso — Primeiro Acesso de Operador

1. **ADMIN_FEDERACAO** acessa `/admin/usuarios/novo` e cria o operador com e-mail e role
2. O sistema gera senha temporária e envia por e-mail
3. Operador acessa `/login` com as credenciais temporárias
4. Sistema exige troca de senha no primeiro login
5. Operador opcionalmente ativa o 2FA nas configurações de conta
6. Login futuro: e-mail → senha → código TOTP (se ativado)

## Fluxo de Uso — Primeiro Acesso de Segurado

1. **OPERADOR_COOPERATIVA** cadastra o segurado via `/cooperativa/segurados/novo`
2. Sistema envia e-mail com link de convite (token único, expira em 48h)
3. Segurado acessa o link no smartphone e define senha
4. PWA fica disponível em `/{slug-da-cooperativa}/login`
5. Login futuro: CPF ou e-mail + senha

![Tela de login operacional](../static/img/screenshots/login-operadores.png)

:::info Captura sugerida
Tela de login com campos de e-mail e senha, logotipo da Tegra, e formulário de código TOTP no segundo passo.
:::

![Tela de login do segurado no PWA](../static/img/screenshots/login-pwa-segurado.png)

:::info Captura sugerida
Tela de login do PWA com identidade visual da cooperativa singular (logo, cor primária), campos de CPF e senha, e botão "Continuar com Google".
:::
