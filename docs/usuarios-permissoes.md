---
sidebar_position: 4
---

# Usuários e Permissões

A Tegra implementa um modelo de controle de acesso baseado em roles (RBAC — Role-Based Access Control) com três níveis hierárquicos para usuários operacionais. Cada role possui um conjunto fixo de permissões que reflete a posição do usuário na estrutura da cooperativa, garantindo que ninguém acesse mais do que precisa para exercer sua função.

## Roles de Usuário

### ADMIN_FEDERACAO

O administrador da federação tem visão total sobre toda a plataforma. É o único role com acesso aos módulos de configuração global:

- Gerenciamento de todas as cooperativas singulares
- Configuração do catálogo de produtos (criar/editar produtos, planos, coberturas)
- Definição de tabelas de taxa por UF e fatores de cálculo
- Configuração de alíquotas de tributos (IOF, PIS/COFINS)
- Painel de conformidade SUSEP (FIP/SRO) com visão consolidada
- Gestão de clientes OAuth2 para integrações B2B
- Relatórios consolidados de todas as singulares

Geralmente, apenas 1 a 3 pessoas na organização têm esse role — o diretor de operações e/ou TI da federação central.

### GESTOR_COOPERATIVA

O gestor da cooperativa singular tem visão operacional completa da sua singular, mas sem acesso a configurações globais:

- Gestão de usuários da sua singular (criar, ativar, desativar operadores)
- Aprovação de descontos acima do limite padrão em apólices
- Acesso a todos os relatórios e métricas da sua singular
- Aprovação de auto-cadastros de segurados via Google
- Visão do painel financeiro (repasses, comissões, provisões)
- Configuração de módulos de produtos habilitados para a singular
- Acesso ao CRM de leads com visão de toda a equipe

### OPERADOR_COOPERATIVA

O operador é o usuário do dia a dia — atendentes, corretores internos, assistentes administrativos:

- Captação e gestão de leads
- Emissão e renovação de apólices (com limite de desconto)
- Registro e instrução de sinistros
- Cadastro de segurados e envio de convites
- Consulta de pagamentos e geração de cobranças
- Registro de vistorias veiculares
- Relatórios filtrados pela sua singular

:::note Isolamento por tenant
Usuários com role GESTOR_COOPERATIVA e OPERADOR_COOPERATIVA só enxergam dados da sua própria singular. O isolamento é garantido em nível de banco de dados — não é apenas uma restrição de interface.
:::

## Funcionalidades de Gestão de Usuários

| Funcionalidade | Disponível para |
|---|---|
| Criar usuário com role | ADMIN_FEDERACAO (qualquer role), GESTOR_COOPERATIVA (apenas OPERADOR) |
| Ativar / desativar usuário | ADMIN_FEDERACAO, GESTOR_COOPERATIVA (na sua singular) |
| Trocar role de usuário | ADMIN_FEDERACAO apenas |
| Resetar senha de usuário | ADMIN_FEDERACAO, GESTOR_COOPERATIVA |
| Ativar/desativar 2FA (próprio) | Todos os usuários |
| Ver log de auditoria | ADMIN_FEDERACAO (todos), GESTOR_COOPERATIVA (sua singular) |
| Ver tentativas de login | ADMIN_FEDERACAO (todos), GESTOR_COOPERATIVA (sua singular) |

## Audit Log — Rastreabilidade Total

Toda ação relevante realizada por qualquer usuário é automaticamente registrada no audit log. O log é **imutável** — não existe operação de exclusão ou edição de registros. Cada entrada contém:

- **Entidade afetada** — ex: "Apolice", "Sinistro", "Pagamento"
- **ID da entidade** — identificador único do registro afetado
- **Ação** — CREATE, UPDATE, STATUS_CHANGE, etc.
- **Dados antes e depois** — JSON completo do estado anterior e posterior
- **Usuário responsável** — quem executou a ação
- **IP de origem** — endereço IP da sessão
- **Timestamp** — data e hora exata da operação
- **Tenant** — cooperativa à qual a operação pertence

Essa granularidade atende requisitos de auditoria da SUSEP e de conformidade LGPD, especialmente em investigações de sinistros e questionamentos regulatórios.

:::tip Valor para auditores externos
O audit log pode ser exportado por período e por entidade para apresentação a auditores externos, advogados ou à própria SUSEP em caso de fiscalização. Cada alteração em apólices, sinistros e pagamentos tem rastreabilidade completa.
:::

## Fluxo de Uso — Criação de Operador

1. **GESTOR_COOPERATIVA** acessa `/usuarios/novo`
2. Preenche nome, e-mail e seleciona role OPERADOR_COOPERATIVA
3. Sistema cria o usuário associado à sua singular automaticamente
4. E-mail com credenciais temporárias é enviado ao novo usuário
5. Novo usuário faz login e define sua senha permanente
6. Toda a operação é registrada no audit log

## Fluxo de Uso — Revisão de Atividade

1. **GESTOR_COOPERATIVA** ou **ADMIN_FEDERACAO** acessa o painel de auditoria
2. Filtra por entidade (ex: "Apolice"), período ou usuário
3. Visualiza o histórico completo de operações com diff de dados
4. Exporta registros para análise externa se necessário

![Painel de usuários e permissões](../static/img/screenshots/usuarios-permissoes.png)

:::info Captura sugerida
Lista de usuários da singular com nome, e-mail, role (exibido como badge colorido), status ativo/inativo e data de último acesso. Botões de ativar/desativar e editar role.
:::

![Audit log com diff de operações](../static/img/screenshots/audit-log.png)

:::info Captura sugerida
Tabela de audit log mostrando entidade, ação, usuário, IP e botão para expandir o diff JSON mostrando dados antes/depois.
:::
