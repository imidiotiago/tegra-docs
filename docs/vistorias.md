---
sidebar_position: 12
---

# Vistorias com IA

O módulo de vistorias da Tegra digitaliza completamente o processo de vistoria veicular — eliminando a necessidade de visita presencial do vistoriador e reduzindo o ciclo de subscrição de dias para horas. O cooperado realiza a vistoria pelo próprio smartphone, o sistema analisa cada foto com inteligência artificial e gera um score de aprovação auditável.

## Como Funciona

O processo de vistoria é guiado e padronizado. O sistema solicita fotografias de ângulos específicos do veículo, garantindo cobertura completa para a análise:

| Posição | Descrição |
|---|---|
| FRENTE | Vista frontal do veículo |
| TRASEIRA | Vista traseira |
| LATERAL_ESQ | Lateral esquerda completa |
| LATERAL_DIR | Lateral direita completa |
| CHASSI | Foto do número do chassi |
| ODOMETRO | Painel com quilometragem |
| DOC | Documento do veículo (CRLV) |
| OUTRO | Ângulos adicionais conforme solicitado |

Para cada foto enviada, a IA realiza uma análise automática que inclui:

- **Score de qualidade** — a foto está nítida e no ângulo correto?
- **Labels detectados** — "veículo", "dano aparente", "placa legível", etc.
- **Flags de atenção** — anomalias que requerem revisão humana
- **Sugestão de ação** — aprovar, reprovar ou solicitar nova foto

O sistema consolida a análise de todas as fotos em um **score médio** da vistoria, que orienta a decisão do operador.

:::tip Redução de fraude por IA
A análise de IA identifica padrões suspeitos — como fotos reutilizadas de outros veículos, imagens editadas, danos pré-existentes ou inconsistências entre o chassi fotografado e o declarado. Isso reduz fraudes sem aumentar a fricção para cooperados honestos.
:::

## Rastreabilidade GPS e IP

Para cada vistoria, a plataforma captura e armazena:

- **Coordenadas GPS** (latitude e longitude) do dispositivo no momento do envio
- **Endereço textual** obtido por geocodificação reversa (ex: "Rua XV de Novembro, 300 - Joinville, SC")
- **Endereço IP** de origem da requisição
- **User-agent** do dispositivo (modelo e sistema operacional)

Essa cadeia de rastreabilidade cria evidência forense de onde e quando a vistoria foi realizada, dificultando fraudes como o envio de fotos de outro local ou em outro momento.

## Vistoria pelo PWA (Segurado)

O cooperado realiza a vistoria diretamente pelo PWA, sem instalar nenhum aplicativo adicional:

1. Acessa o PWA da sua singular no smartphone
2. Entra na seção "Vistoria"
3. O sistema solicita permissão de localização (GPS)
4. O cooperado fotografa o veículo nas posições indicadas
5. Envia as fotos
6. A IA processa automaticamente e gera o relatório
7. O cooperado recebe confirmação e pode acompanhar o status

## Vistoria pelo Operador

Operadores também podem criar vistorias manualmente no painel administrativo — especialmente útil para veículos que não possuem apólice ainda (pré-vistoria de leads) ou para casos que exigem documentação adicional.

Uma vistoria pode ser vinculada a:
- Uma **apólice existente** — renovação ou vistoria de endosso
- Um **lead** — vistoria prévia à emissão
- **Nenhum vínculo** — vistoria avulsa

## Análise e Decisão Humana

A IA é uma ferramenta de apoio — a decisão final é sempre humana. O operador revisa:

- As fotos enviadas
- O resultado da análise IA de cada foto (score, labels, flags)
- O score médio consolidado
- A localização GPS no mapa

Com base nessa análise, muda o status da vistoria para APROVADA ou REPROVADA, com registro de observações.

## Status da Vistoria

| Status | Descrição |
|---|---|
| PENDENTE | Enviada, aguardando análise da IA |
| EM_ANALISE | IA processou, aguardando revisão humana |
| APROVADA | Vistoria aprovada, subscrição liberada |
| REPROVADA | Vistoria reprovada — emissão bloqueada |

## Integração com Subscrição

Quando um produto/plano exige vistoria prévia, o módulo de emissão de apólices verifica automaticamente se existe uma vistoria APROVADA vinculada ao veículo ou lead. Sem vistoria aprovada, a emissão é bloqueada — garantindo que a subscrição seja precedida pela validação adequada.

## Funcionalidades

| Funcionalidade | Papel |
|---|---|
| Criar vistoria (avulsa, lead ou apólice) | OPERADOR_COOPERATIVA |
| Realizar vistoria com fotos | Segurado (PWA), OPERADOR_COOPERATIVA |
| Analisar fotos e mudar status | OPERADOR_COOPERATIVA |
| Visualizar resultado de IA por foto | OPERADOR_COOPERATIVA, GESTOR_COOPERATIVA |
| Consultar localização GPS no mapa | OPERADOR_COOPERATIVA |
| Acompanhar status da vistoria | Segurado (PWA) |
| Relatório de vistorias por período | GESTOR_COOPERATIVA |

## Fluxo de Uso — Vistoria de Subscrição

1. **OPERADOR_COOPERATIVA** inicia emissão de apólice Auto de alto valor
2. Sistema detecta que o plano requer vistoria prévia
3. Operador cria vistoria em `/vistorias/nova?leadId={id}` ou via link direto ao segurado
4. **Segurado** recebe link no WhatsApp para realizar a vistoria pelo PWA
5. Segurado abre o link no smartphone, concede acesso de GPS e câmera
6. Fotografa o veículo nas 7 posições solicitadas
7. IA processa automaticamente — score médio: 8,4/10
8. **Operador** revisa as fotos e o relatório de IA, aprova a vistoria
9. Sistema libera a emissão da apólice
10. Operador emite a apólice normalmente

![Painel de vistorias com análise IA](../static/img/screenshots/vistorias-lista.png)

:::info Captura sugerida
Lista de vistorias com miniatura da primeira foto, status (badge colorido), score médio da IA, segurado associado, data de envio e localização (endereço textual). Filtros de status e período.
:::

![Detalhe da vistoria com análise por foto](../static/img/screenshots/vistoria-detalhe.png)

:::info Captura sugerida
Página de detalhe mostrando: grade de fotos enviadas, cada foto com seu score IA e labels detectados, mapa com localização GPS do envio, score médio consolidado em destaque, e botões Aprovar/Reprovar com campo de observações.
:::
