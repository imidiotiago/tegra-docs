---
sidebar_position: 6
---

# Federação e Singulares

O modelo de federação é o coração organizacional da Tegra. A plataforma foi construída explicitamente para o sistema cooperativo brasileiro, onde uma **federação central** (ou central de cooperativas) supervisiona e oferece serviços a diversas **cooperativas singulares** — cada uma com sua identidade, equipe e base de cooperados próprias.

## Estrutura Federativa

```
FEDERAÇÃO CENTRAL
├── Singular A (ex: Cooperativa Joinville)
│   ├── Segurados de Joinville
│   ├── Apólices, Sinistros, Pagamentos (isolados)
│   └── Equipe operacional própria
├── Singular B (ex: Cooperativa Florianópolis)
│   ├── Segurados de Florianópolis
│   ├── Apólices, Sinistros, Pagamentos (isolados)
│   └── Equipe operacional própria
└── Singular N...
```

A federação define o que é possível (catálogo de produtos, tabelas de taxa, regras de cálculo). Cada singular decide o que ativa (módulos de produtos) e opera com autonomia dentro das regras definidas pela federação.

## Cadastro e Configuração de Singulares

Cada cooperativa singular é configurada com:

| Campo | Descrição |
|---|---|
| Nome e CNPJ | Identificação legal da cooperativa |
| Slug URL | Identificador único para URLs: `/captacao/joinville`, `/s/joinville/` |
| UF e Região | Estado e região geográfica (Norte, Sul, Sudeste, etc.) |
| Logo | Imagem exibida na landing page e no PWA do segurado |
| Cor primária e secundária | Paleta de cores para identidade visual tematizada |
| Tagline | Frase de posicionamento exibida na landing page |
| WhatsApp | Número para contato direto via wa.me |
| Módulos ativos | Quais produtos a singular oferece (habilitados individualmente) |

Essa configuração alimenta automaticamente:

- A **landing page de captação** em `/captacao/{slug}` — totalmente tematizada com as cores, logo e tagline da singular
- O **PWA do segurado** em `/{slug}/` — com identidade visual da singular
- As **notificações WhatsApp** enviadas com o número da singular

## Isolamento de Dados (Multitenância)

O isolamento entre singulares é absoluto e implementado em nível de banco de dados. Não existe nenhum cenário onde um usuário de uma singular possa acessar dados de outra singular — nem por acidente nem por exploração de falha de interface.

O mecanismo é direto: toda tabela que contém dados de uma singular possui a coluna `cooperativaId`. Toda query do sistema inclui obrigatoriamente o filtro por `cooperativaId` derivado do token de sessão do usuário. A camada ORM (Prisma) garante que esse filtro nunca seja omitido.

As seguintes entidades são completamente isoladas por singular:

- Segurados e seus dados pessoais
- Apólices, coberturas e cotações
- Sinistros e seu histórico
- Pagamentos, comissões e repasses
- Leads e atividades de CRM
- Vistorias e fotos de vistorias
- Mensagens WhatsApp enviadas
- Logs de auditoria e tentativas de login
- Clientes OAuth2 para integrações B2B

:::tip Visão consolidada para a federação
Enquanto as singulares enxergam apenas seus próprios dados, o **ADMIN_FEDERACAO** tem visão consolidada de todas as singulares — relatórios combinados, painel de conformidade SUSEP com situação de cada singular, e gestão centralizada de produtos e taxas.
:::

## Módulos por Singular

Cada singular ativa apenas os produtos que opera. A federação define o catálogo completo de produtos disponíveis; a singular liga ou desliga cada um conforme sua estratégia comercial. Por exemplo:

- **Singular A** opera Auto, Vida e Residencial
- **Singular B** opera apenas Auto e Vida
- **Singular C** opera todos os produtos disponíveis

Essa granularidade evita que a singular exiba produtos para os quais não tem capacidade operacional, e permite que a federação lance novos produtos de forma faseada — habilitando primeiro apenas para singulares piloto.

## Identidade Visual por Singular

A tematização não é apenas cosmética — ela é parte da estratégia de relacionamento cooperativo. O cooperado percebe que está interagindo com **sua** cooperativa, não com um sistema genérico. Isso aumenta taxas de conversão nas landing pages e engajamento no PWA.

A personalização inclui:
- Logotipo próprio na landing page e no PWA
- Gradiente de cores aplicado ao hero da landing page e aos elementos de destaque do PWA
- Tagline personalizada ("Proteção para a família catarinense", "Seguro de quem entende o sul")
- Número de WhatsApp próprio para contato direto

## Funcionalidades

| Funcionalidade | Papel |
|---|---|
| Criar e editar singular | ADMIN_FEDERACAO |
| Ativar/desativar singular | ADMIN_FEDERACAO |
| Configurar módulos (produtos) da singular | ADMIN_FEDERACAO |
| Editar identidade visual da singular | ADMIN_FEDERACAO |
| Visualizar dados consolidados de todas as singulares | ADMIN_FEDERACAO |
| Visualizar e operar apenas na própria singular | GESTOR_COOPERATIVA, OPERADOR_COOPERATIVA |
| Acessar landing page de captação | Público (sem login) |
| Acessar PWA com identidade da singular | Segurados autenticados |

## Fluxo de Uso — Onboarding de Nova Singular

1. **ADMIN_FEDERACAO** acessa `/admin/cooperativas/nova`
2. Preenche dados cadastrais (nome, CNPJ, UF, slug)
3. Faz upload do logo e configura as cores da identidade visual
4. Seleciona os módulos de produtos que a singular oferece
5. Cria o primeiro usuário GESTOR_COOPERATIVA para a singular
6. Singular já está operacional — landing page ativa em `/captacao/{slug}`
7. Gestor faz login, cadastra sua equipe de operadores
8. Operadores começam a capturar leads e emitir apólices

O processo completo de onboarding leva menos de 30 minutos.

![Painel de gerenciamento de singulares](../static/img/screenshots/federacao-singulares.png)

:::info Captura sugerida
Grade de cards das singulares com logo, nome, UF, número de apólices ativas e status (ativo/inativo). Botão "Nova Singular" no canto superior direito.
:::

![Configuração de identidade visual da singular](../static/img/screenshots/singular-configuracao.png)

:::info Captura sugerida
Formulário de edição da singular com campos de identidade visual (logo, cor primária, cor secundária, tagline, WhatsApp) e preview ao vivo da landing page renderizada com as configurações atuais.
:::
