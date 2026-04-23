---
sidebar_position: 2
---

# Arquitetura do Sistema

A Tegra foi projetada com uma arquitetura moderna que equilibra performance, segurança e escalabilidade. Cada decisão técnica foi tomada tendo em vista as exigências regulatórias do mercado segurador brasileiro (SUSEP, LGPD) e as necessidades operacionais de federações com dezenas de cooperativas singulares.

## Modelo Hierárquico Multitenante

A plataforma opera em três camadas hierárquicas:

```
Federação (1)
  └── Singulares / Cooperativas (N)
        └── Segurados / Cooperados (N)
```

**Federação** é a entidade central — ela configura produtos, taxas, módulos disponíveis e tem visão consolidada de todas as singulares. Existe uma única federação por instância da plataforma.

**Singulares** são os tenants reais. Cada cooperativa singular tem seu próprio conjunto de usuários, apólices, sinistros, leads, pagamentos, logs de auditoria e segurados. A separação é garantida em nível de banco de dados: todas as tabelas críticas possuem a coluna `cooperativaId`, e todas as queries são filtradas por ela — nunca há acesso cruzado entre singulares, mesmo em caso de bug de aplicação.

**Segurados** são os cooperados pessoa física. Eles acessam a plataforma exclusivamente via PWA (Progressive Web App) mobile, com autenticação própria separada dos operadores.

:::info Isolamento LGPD
O modelo de isolamento vai além do filtro por `cooperativaId`. Logs de auditoria, tentativas de login, mensagens WhatsApp e cotações são todos segregados por tenant. Isso atende explicitamente as exigências da Lei Geral de Proteção de Dados e as normas SUSEP de sigilo de informações.
:::

## Stack Tecnológico

| Camada | Tecnologia |
|---|---|
| Frontend + Backend | Next.js 16 (App Router, Server Components) |
| ORM e Migrações | Prisma ORM com migrations versionadas |
| Banco de Dados | PostgreSQL 16 |
| PWA | Service Workers + Web Push API |
| Autenticação Operadores | JWT + TOTP (RFC 6238) |
| Autenticação Segurados | JWT com convite por token + OAuth Google |
| Integrações | Evolution API (WhatsApp), Asaas/Pix (pagamentos) |
| API B2B | OAuth2 Client Credentials (RFC 6749) |
| Deploy | PM2 cluster mode + Docker Compose |
| Infraestrutura | VPS Ubuntu 24.04 / AWS-ready |

## Arquitetura de Segurança

A segurança é implementada em múltiplas camadas independentes:

**Autenticação em camadas**: operadores usam JWT de curta duração combinado com TOTP 2FA (Google Authenticator, Authy). Segurados usam JWT próprio sem acesso à área operacional. Integrações B2B usam client credentials OAuth2 com escopos granulares.

**Autorização por role e tenant**: o middleware de rota verifica simultaneamente o role do usuário (ADMIN_FEDERACAO, GESTOR_COOPERATIVA, OPERADOR_COOPERATIVA) e o tenant ao qual pertence. Um operador de uma singular não consegue visualizar dados de outra singular, mesmo conhecendo o ID.

**Proteção contra força bruta**: todas as tentativas de login são registradas por e-mail e IP. Após limiar configurável de falhas, o acesso é bloqueado automaticamente. Os registros são isolados por tenant para análise posterior.

**Audit log imutável**: toda operação de criação, atualização ou mudança de status é registrada no `AuditLog` com dados antes/depois (JSON diff), ID do usuário, IP e timestamp. O log não possui operação de DELETE — é append-only por design.

## Diagrama de Integração

```
┌─────────────────────────────────────────────────────────┐
│                    TEGRA (Next.js 16)                   │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Admin/Ops   │  │  PWA Mobile  │  │  API REST    │  │
│  │  (Browser)   │  │  (Segurado)  │  │  B2B OAuth2  │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                 │                 │           │
│  ┌──────▼─────────────────▼─────────────────▼───────┐  │
│  │              App Router + Middleware              │  │
│  │         (authn/authz + tenant isolation)          │  │
│  └──────────────────────┬────────────────────────────┘  │
│                         │                               │
│  ┌──────────────────────▼────────────────────────────┐  │
│  │               Prisma ORM + PostgreSQL             │  │
│  │         (row-level tenant isolation)              │  │
│  └───────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────┘
                            │
         ┌──────────────────┼──────────────────┐
         ▼                  ▼                  ▼
   Evolution API      Gateway Pix/       IA de Análise
   (WhatsApp)         Boleto (Asaas)     de Fotos
```

## Modelo de Dados Principal

O esquema de dados foi modelado para refletir fielmente o domínio do seguro cooperativo:

- **Federacao → Cooperativa → Segurado**: hierarquia de tenancy
- **Produto → Plano → Cobertura**: catálogo de produtos com planos empacotados (Bronze/Prata/Ouro) e coberturas individuais à la carte
- **TabelaTaxa × FatorCalculo**: motor de precificação regional por UF e fatores de risco
- **Apolice → ApoliceCobertura**: apólice emitida com coberturas efetivamente contratadas (fonte de verdade do prêmio)
- **Pagamento → Comissao → Repasse**: cadeia financeira completa da cobrança ao repasse para a federação
- **Vistoria → FotoVistoria**: vistoria veicular com análise IA por foto
- **AuditLog + LoginAttempt + MensagemWhatsapp**: rastreabilidade total para LGPD/SUSEP

## Modelo de Deploy

A Tegra opera em modo cluster via PM2, distribuindo a carga entre múltiplos workers no mesmo servidor. Para clientes com requisitos de alta disponibilidade, o mesmo Dockerfile pode ser implantado em AWS ECS, Google Cloud Run ou Kubernetes sem alterações de código.

```
PM2 Cluster (porta 3001)
  ├── worker 0
  ├── worker 1
  ├── worker 2
  └── worker N

Nginx (porta 443)
  └── proxy_pass → localhost:3001

PostgreSQL 16
  └── conexão via Prisma connection pool
```

As migrações de banco são versionadas via Prisma Migrate e aplicadas automaticamente no deploy com `prisma migrate deploy` — sem scripts manuais, sem risco de regressão.

:::tip Pronto para nuvem
A plataforma inclui Dockerfile e docker-compose.yml prontos para uso. A migração de VPS para AWS, GCP ou Azure pode ser feita em horas, não semanas.
:::

## Escalabilidade

O design multitenante permite que novas singulares sejam onboardadas em minutos: basta criar o registro de `Cooperativa` no banco, configurar os módulos de produtos desejados, e a singular já está operacional — sem provisionamento de infraestrutura adicional, sem nova instância, sem deploy.

![Diagrama de arquitetura da Tegra](../static/img/screenshots/arquitetura-diagrama.png)

:::info Captura sugerida
Diagrama visual mostrando a hierarquia Federação → Singulares → Segurados com os módulos conectados a cada nível.
:::
