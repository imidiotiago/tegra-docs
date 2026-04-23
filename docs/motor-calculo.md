---
sidebar_position: 9
---

# Motor de Cálculo

O motor de cálculo da Tegra é o núcleo da precificação atuarial da plataforma. Ele combina tabelas de taxa por produto e UF, fatores de risco configuráveis e regras de plano para gerar prêmios precisos e auditáveis. Cada cálculo é armazenado com detalhamento completo para fins de transparência regulatória e auditoria.

## Arquitetura do Cálculo

O prêmio final de uma apólice é determinado pela combinação de quatro componentes:

```
Prêmio = Capital Segurado
       × Taxa Base (por produto × UF)
       × Fator Regional (multiplicador geográfico)
       × Fatores de Risco (faixa etária, categoria veículo, etc.)
       × Fator do Plano (Bronze=0,70 / Prata=1,00 / Ouro=1,50)
       + Coberturas Adicionais (preço fixo ou % do prêmio base)
       + IOF e demais tributos configuráveis
```

Cada componente é independente e configurável pela federação sem necessidade de alteração de código.

## Tabelas de Taxa por UF

A taxa base é definida por combinação de **produto × UF (estado)**, com vigência temporal:

| Campo | Descrição |
|---|---|
| Produto | AUTO, VIDA, RESIDENCIAL, etc. |
| UF | Todos os 27 estados brasileiros |
| Taxa Base | Percentual aplicado sobre o capital segurado (ex: 0,35%) |
| Fator Regional | Multiplicador geográfico (ex: 1,15 = risco 15% acima da média) |
| Vigência Início / Fim | Período de validade da taxa |

Isso permite que a federação atualize as taxas periodicamente (revisão atuarial anual, por exemplo) sem impactar apólices já emitidas — cada apólice armazena o detalhamento do cálculo com os valores vigentes no momento da emissão.

:::tip Precificação regional precisa
O fator regional permite que a federação reflita diferenças reais de risco entre estados. Auto no Rio de Janeiro pode ter fator 1,30 (maior risco de roubo) enquanto no interior de Santa Catarina pode ser 0,90. Essa granularidade por UF é essencial para a sustentabilidade atuarial da cooperativa.
:::

## Fatores de Cálculo

Além da taxa por UF, o motor aplica fatores de risco adicionais configuráveis:

| Tipo de Fator | Exemplos de Chaves |
|---|---|
| FAIXA_ETARIA | 18-25, 26-35, 36-45, 46-55, 56-65, 66+ |
| CATEGORIA_VEICULO | PASSEIO, PICKUP, SUV, MOTO, CAMINHAO |
| TIPO_CONSTRUCAO | ALVENARIA, MADEIRA, MISTA |
| OCUPACAO | PROPRIETARIO_RESIDENTE, LOCATARIO, DESOCUPADO |
| BONUS_MALUS | 0, 1, 2, 3, 4, 5 (anos sem sinistro) |

Cada fator tem um valor decimal multiplicador (ex: faixa 18-25 anos = 1,45; bônus 5 = 0,85). Os fatores podem ser definidos por produto específico ou aplicados globalmente a todos os produtos.

## Cotação Detalhe — Auditabilidade Completa

Toda apólice emitida pela Tegra possui um registro de `CotacaoDetalhe` com o breakdown completo do cálculo:

```json
{
  "dadosRisco": {
    "veiculo": { "placa": "ABC-1234", "ano": 2021, "categoria": "PASSEIO" },
    "segurado": { "dataNascimento": "1988-03-15", "uf": "SC" }
  },
  "detalhamento": {
    "capitalSegurado": 85000.00,
    "taxaBase": 0.003500,
    "fatorRegional": 0.9200,
    "fatores": [
      { "tipo": "FAIXA_ETARIA", "chave": "36-45", "valor": 0.9500 },
      { "tipo": "CATEGORIA_VEICULO", "chave": "PASSEIO", "valor": 1.0000 },
      { "tipo": "BONUS_MALUS", "chave": "3", "valor": 0.9200 }
    ],
    "fatorPlano": 1.0000,
    "premioBaseBruto": 245.70,
    "coberturas": [
      { "codigo": "VIDROS", "valorMensal": 28.00 },
      { "codigo": "TERCEIROS_100K", "valorMensal": 36.86 }
    ],
    "iof": 18.54,
    "premioFinal": 329.10
  }
}
```

Esse registro é imutável e vinculado à apólice. Em caso de questionamento do cooperado, de auditoria regulatória ou de revisão atuarial interna, o cálculo pode ser reproduzido e auditado com precisão.

## Regras de Subscrição

O motor de cálculo integra-se com as regras de subscrição da plataforma. Dependendo do produto, plano ou soma de coberturas selecionadas, o sistema pode exigir:

| Regra | Descrição |
|---|---|
| RASTREADOR | Auto com determinados planos requer instalação de rastreador |
| VISTORIA | Auto acima de certo valor exige vistoria prévia aprovada |
| DECLARACAO_SAUDE | Vida acima de determinado capital exige declaração de saúde |

Essas exigências são verificadas antes da emissão. Se não atendidas, o sistema bloqueia a emissão e orienta o operador sobre o que é necessário.

## Fast-Track e Estimativa Pré-Cadastro

O motor de cálculo também alimenta o fast-track da landing page de captação. Com apenas CEP (para determinar UF e fator regional) e data de nascimento (para faixa etária), o motor gera uma estimativa de prêmio em milissegundos — sem necessidade de login, sem formulário extenso.

A estimativa usa o plano Prata como referência e o capital segurado médio configurado para o produto, gerando um número realista que serve como gancho de conversão.

## Configuração de Tributos

As alíquotas de IOF, PIS/COFINS e outros tributos são configuráveis por produto sem alteração de código:

| Tributo | Produto | Alíquota padrão |
|---|---|---|
| IOF | Auto | 7,38% |
| IOF | Vida | 0,38% |
| PIS/COFINS | Todos | Configurável |

As alíquotas são armazenadas em tabela editável pelo **ADMIN_FEDERACAO** via painel `/admin/tributos`, e aplicadas automaticamente no cálculo final.

## Funcionalidades

| Funcionalidade | Papel |
|---|---|
| Configurar tabelas de taxa por UF | ADMIN_FEDERACAO |
| Definir fatores de cálculo | ADMIN_FEDERACAO |
| Configurar alíquotas de tributos | ADMIN_FEDERACAO |
| Visualizar breakdown de cotação de uma apólice | ADMIN_FEDERACAO, GESTOR_COOPERATIVA |
| Estimativa fast-track (CEP + nascimento) | Público |

## Fluxo de Uso — Revisão Atuarial Anual

1. **ADMIN_FEDERACAO** acessa `/admin/taxas`
2. Visualiza todas as taxas vigentes por produto e UF
3. Cria novos registros com taxa atualizada e vigência a partir da data escolhida
4. O sistema começa a usar as novas taxas para cotações a partir daquela data
5. Apólices existentes não são afetadas — elas mantêm os parâmetros da emissão original

![Tabela de taxas por UF](../static/img/screenshots/motor-calculo-taxas.png)

:::info Captura sugerida
Tabela de gestão de taxas mostrando produto, UF (com bandeira do estado), taxa base, fator regional, vigência início/fim e status ativo. Botão "Nova Taxa" e filtros por produto e UF.
:::

![Detalhamento de cálculo de uma apólice](../static/img/screenshots/motor-calculo-detalhe.png)

:::info Captura sugerida
Card de detalhamento da cotação de uma apólice mostrando cada componente do cálculo: capital segurado, taxa base, fatores aplicados com seus valores, coberturas adicionais, tributos e prêmio final — como uma nota fiscal do cálculo atuarial.
:::
