---
sidebar_position: 7
---

# Produtos e Módulos

A Tegra oferece um catálogo estruturado de produtos de seguros com sistema de planos e coberturas completamente configurável. A federação define o catálogo; cada singular ativa os módulos que comercializa. Os cooperados constroem sua proteção selecionando coberturas à la carte dentro dos planos disponíveis.

## Catálogo de Produtos

A plataforma suporta os seguintes produtos de seguros cooperativos:

| Produto | Código | Descrição |
|---|---|---|
| Auto | AUTO | Seguro para veículos automotores |
| Vida | VIDA | Seguro de vida individual e coletivo |
| Residencial | RESIDENCIAL | Proteção para imóveis e conteúdo |
| Empresarial | EMPRESARIAL | Cobertura para estabelecimentos comerciais |
| Saúde | SAUDE | Planos de saúde cooperativos |
| Previdência | PREVIDENCIA | Previdência complementar cooperativa |

Cada produto possui um **esquema de campos específico** (JSON Schema) que define quais informações são coletadas durante a cotação — placa e ano do veículo para Auto, metragem e tipo de construção para Residencial, capital segurado e ocupação para Vida, etc.

## Sistema de Planos (Bronze, Prata, Ouro)

Cada produto possui três planos pré-configurados que servem como ponto de partida para o cooperado:

| Plano | Perfil | Fator de Prêmio |
|---|---|---|
| Bronze | Cobertura essencial, menor custo | ex: 0,70 (30% abaixo do base) |
| Prata | Cobertura equilibrada | ex: 1,00 (valor base) |
| Ouro | Cobertura ampla e premium | ex: 1,50 (50% acima do base) |

O fator de prêmio de cada plano é configurável pela federação. Planos são compostos por conjuntos pré-definidos de coberturas — o cooperado que escolhe "Prata" já recebe automaticamente todas as coberturas que compõem esse plano.

:::tip Planos como ponto de partida
Os planos não são pacotes fechados. Após selecionar Bronze, Prata ou Ouro, o cooperado ainda pode adicionar coberturas avulsas (à la carte) ao seu pacote, customizando a proteção conforme sua necessidade e orçamento.
:::

## Coberturas à La Carte

O sistema de coberturas é o diferencial mais importante do motor de produtos. As coberturas são classificadas em três tipos:

**Principal** — cobertura central do produto. Para Auto: casco (colisão, incêndio, furto). Para Vida: morte natural e acidental. Geralmente obrigatória.

**Adicional** — add-ons opcionais que expandem a proteção. Exemplos para Auto:
- Vidros (para-brisas, laterais, traseiro)
- Terceiros (danos materiais e corporais a terceiros)
- Carro reserva (dias de utilização configurável)
- Rastreador
- Fenômenos naturais

**Assistência** — serviços de assistência 24 horas. Exemplos:
- Reboque
- Chaveiro
- Troca de pneu
- Socorro mecânico
- Táxi ou transporte emergencial

### Precificação de Coberturas

Cada cobertura tem dois modelos de precificação:

- **Fixo**: valor mensal fixo independente do prêmio base (ex: Vidros = R$ 28,00/mês)
- **Percentual do prêmio**: calculado como percentagem do prêmio base do produto (ex: Terceiros 100K = 15% do prêmio base)

### Regras de Dependência e Incompatibilidade

O sistema gerencia regras complexas entre coberturas:

- **Dependência**: uma cobertura pode exigir que outra esteja contratada. Ex: "Carro Reserva" requer "Colisão".
- **Incompatibilidade**: duas coberturas podem ser mutuamente exclusivas. Ex: "Valor de Mercado" e "Valor Fixado" não podem coexistir na mesma apólice.

Essas regras são verificadas automaticamente durante a composição da apólice — o operador não consegue emitir uma apólice com combinações inválidas de coberturas.

### Override de Preço por Plano

Ao associar uma cobertura a um plano, é possível definir um **preço override** específico para aquele plano — diferente do preço base da cobertura. Isso permite que o plano Ouro ofereça a cobertura de Vidros com limite mais alto sem criar uma nova cobertura no catálogo.

## Gestão de Módulos por Singular

A federação controla quais produtos cada singular pode comercializar através do painel de módulos:

1. **ADMIN_FEDERACAO** acessa `/admin/modulos`
2. Seleciona a singular e os produtos que ela pode oferecer
3. A singular passa a ver apenas esses produtos no sistema
4. A landing page de captação da singular exibe apenas os produtos habilitados

## Funcionalidades

| Funcionalidade | Papel |
|---|---|
| Criar e editar produtos | ADMIN_FEDERACAO |
| Criar planos (Bronze/Prata/Ouro) | ADMIN_FEDERACAO |
| Criar coberturas e definir regras | ADMIN_FEDERACAO |
| Associar coberturas a planos | ADMIN_FEDERACAO |
| Habilitar módulos por singular | ADMIN_FEDERACAO |
| Selecionar plano e coberturas na emissão | OPERADOR_COOPERATIVA |
| Visualizar coberturas contratadas | Segurado (no PWA) |

## Fluxo de Uso — Configuração de Novo Produto

1. **ADMIN_FEDERACAO** acessa `/admin/coberturas` e cria as coberturas do produto com tipo, preço e regras
2. Acessa `/admin/taxas` e define a tabela de taxa por UF para o produto
3. Cria os três planos (Bronze/Prata/Ouro) com seus fatores e associa as coberturas pertinentes
4. Acessa `/admin/modulos` e habilita o produto para as singulares desejadas
5. Singulares habilitadas já exibem o novo produto na landing page e no fluxo de emissão

## Fluxo de Uso — Composição de Apólice com Coberturas à La Carte

1. **OPERADOR_COOPERATIVA** inicia nova apólice para um segurado
2. Seleciona o produto (ex: Auto)
3. Escolhe o plano base (Bronze/Prata/Ouro) — coberturas do plano são pré-incluídas
4. Visualiza as coberturas adicionais disponíveis com preços individuais
5. Adiciona coberturas opcionais conforme necessidade do cooperado
6. O sistema valida as regras de dependência e incompatibilidade em tempo real
7. O prêmio total é recalculado automaticamente a cada seleção
8. Operador confirma e emite a apólice com a composição final

![Catálogo de coberturas](../static/img/screenshots/coberturas-catalogo.png)

:::info Captura sugerida
Tabela de coberturas com colunas: nome, produto, tipo (badge colorido: PRINCIPAL/ADICIONAL/ASSISTENCIA), preço base, tipo de preço (fixo/percentual), obrigatória (sim/não), status ativo.
:::

![Composição de apólice com seleção de coberturas](../static/img/screenshots/apolice-coberturas-selecao.png)

:::info Captura sugerida
Tela de emissão de apólice mostrando o plano Prata selecionado, coberturas do plano já incluídas (marcadas em azul) e coberturas adicionais disponíveis como checkboxes com preço individual. Total do prêmio atualizado em tempo real na parte inferior.
:::
