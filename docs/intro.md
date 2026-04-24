---
sidebar_position: 1
slug: /
---

# Tegra — Plataforma de Gestão para Cooperativas de Seguros

:::note Explore visualmente
Antes de mergulhar na documentação, veja o **[🗺️ Mapa Interativo do Sistema](/mapa)** — um painel clicável com todos os módulos, fluxos e perfis de usuário em uma só tela.
:::

A **Tegra** é uma plataforma completa de gestão para centrais e cooperativas de seguros, desenvolvida para substituir sistemas legados fragmentados por uma solução integrada, moderna e regulatoriamente conforme. Ela cobre todo o ciclo de vida do seguro cooperativo — da captação de leads à emissão de apólices, gestão de sinistros, controles financeiros e conformidade SUSEP — em um único ambiente multitenante.

:::tip Por que Tegra?
O mercado de seguros cooperativos opera com sistemas desenvolvidos há décadas, sem integração nativa entre módulos, sem portabilidade mobile e sem automação regulatória. A Tegra foi construída do zero para resolver exatamente esses gargalos.
:::

## O que é a Tegra

A Tegra atende centrais que gerenciam múltiplas cooperativas singulares (tenants), garantindo isolamento completo de dados entre elas ao mesmo tempo em que oferece visão consolidada para a central. Cada singular opera com identidade visual própria, produtos habilitados individualmente e equipes com permissões ajustadas ao seu contexto — tudo gerenciado a partir de um único painel administrativo.

A plataforma é projetada para três perfis de usuário:

- **ADMIN_FEDERACAO** — visão total sobre todas as singulares, configuração de produtos, taxas e conformidade regulatória
- **GESTOR_COOPERATIVA / OPERADOR_COOPERATIVA** — gestão operacional da singular: apólices, leads, sinistros, pagamentos
- **Segurado (cooperado)** — acesso via PWA mobile para boletos, sinistros, assistência e vistoria do veículo

---

## Módulos da Plataforma

| Módulo | Descrição |
|---|---|
| [Central e Singulares](./federacao-singulares) | Arquitetura multitenante com isolamento LGPD e identidade visual por tenant |
| [Produtos e Módulos](./modulos-produtos) | Catálogo de produtos com planos Bronze/Prata/Ouro e coberturas à la carte |
| [Motor de Cálculo](./motor-calculo) | Precificação regional automática com fatores de risco e tabelas por UF |
| [Leads e Captação](./leads) | CRM com fast-track, pipeline de vendas e landing pages tematizadas |
| [Apólices](./apolices) | Emissão, endosso, cancelamento e gestão completa do ciclo da apólice |
| [Sinistros](./sinistros) | Abertura, instrução e liquidação de sinistros com workflow de aprovação |
| [Vistorias com IA](./vistorias) | Vistoria veicular com análise de imagens por IA, GPS e log de IP |
| [Pagamentos](./pagamentos) | Cobrança recorrente via Pix/boleto, gateways plugáveis, controle de inadimplência |
| [Portal do Cooperado](./portal-cooperado) | PWA mobile-first para segurados: boletos, sinistros, assistência, vistoria |
| [Relatórios](./relatorios) | Report builder self-service com 5 entidades e exportação CSV |
| [Conformidade SUSEP](./conformidade) | Controle de FIP/SRO com alertas automáticos de prazo |
| [Integrações](./integracoes) | WhatsApp via Evolution API, gateways de pagamento, API REST B2B com OAuth2 |
| [Autenticação](./autenticacao) | Login com TOTP 2FA para operadores, convite e OAuth para segurados |
| [Usuários e Permissões](./usuarios-permissoes) | RBAC com três roles, isolamento por tenant e audit log imutável |
| [Segurança](./seguranca) | JWT, TOTP, brute-force protection, LGPD, row-level isolation |
| [Arquitetura](./arquitetura) | Stack tecnológico, deploy PM2/Docker, integrações e modelo de dados |

---

## Diferenciais Competitivos

- **Multitenância real com isolamento LGPD**: cada cooperativa singular é um tenant independente — dados nunca se cruzam, logs de auditoria são isolados por tenant, exigência explícita da SUSEP e da LGPD
- **Motor de cálculo regional**: tabelas de taxa por UF e produto, fatores de risco (faixa etária, categoria de veículo, tipo de construção, bônus/malus), cálculo auditável com detalhamento por apólice
- **Fast-track em 2 campos**: cotação estimada com apenas CEP e data de nascimento — sem cadastro, sem atrito — convertida automaticamente em lead rastreável no CRM
- **Coberturas à la carte**: o cooperado monta seu pacote de proteção combinando coberturas principais, adicionais e assistências, com regras de dependência e incompatibilidade gerenciadas pelo sistema
- **Vistoria veicular com IA**: o segurado realiza a vistoria pelo celular (PWA), o sistema analisa cada foto com inteligência artificial, gera score de aprovação e registra localização GPS e IP para auditoria
- **Conformidade SUSEP automatizada**: painel dedicado ao controle de FIP/SRO com alertas de prazo, identificação automática de meses sem movimento e status por competência
- **PWA mobile-first para segurados**: app instalável sem loja de aplicativos — segurado acessa boletos, abre sinistros, solicita assistência e faz vistoria direto do smartphone
- **API REST B2B com OAuth2**: integração com ERPs e sistemas externos via client credentials, com escopos granulares por singular e auditoria de uso

---

## Para Investidores e Compradores

A Tegra foi construída com foco em escalabilidade e conformidade regulatória desde a concepção. Sua arquitetura multitenante permite onboarding de novas singulares sem alterações de código. O modelo de licenciamento por central cria receita recorrente previsível. A plataforma está em operação ativa com dados reais, documentação técnica completa e processo de deploy automatizado via Docker e PM2 cluster.

O setor de seguros cooperativos no Brasil movimenta mais de R$ 8 bilhões em prêmios anuais, com mais de 200 cooperativas singulares vinculadas ao sistema OCB. A digitalização dessas operações ainda está no início — a Tegra posiciona seus clientes na vanguarda desse processo.

![Painel principal da Tegra](../static/img/screenshots/dashboard-principal.png)

:::info Captura sugerida
Painel principal mostrando cards de KPIs (apólices ativas, prêmio mensal, sinistros abertos, inadimplência), navegação lateral com todos os módulos e indicador de singular selecionada.
:::
