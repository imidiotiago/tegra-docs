import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  mainSidebar: [
    {
      type: "doc",
      id: "intro",
      label: "🏠 Visão Geral",
    },
    {
      type: "doc",
      id: "arquitetura",
      label: "🏗️ Arquitetura",
    },
    {
      type: "category",
      label: "🔐 Acesso & Segurança",
      collapsed: false,
      items: ["autenticacao", "usuarios-permissoes", "seguranca"],
    },
    {
      type: "category",
      label: "🏢 Estrutura Multi-tenant",
      collapsed: false,
      items: ["federacao-singulares", "modulos-produtos"],
    },
    {
      type: "category",
      label: "💼 Operação Comercial",
      collapsed: false,
      items: ["leads", "motor-calculo", "apolices"],
    },
    {
      type: "category",
      label: "📋 Pós-Emissão",
      collapsed: false,
      items: ["sinistros", "vistorias", "pagamentos"],
    },
    {
      type: "category",
      label: "📱 Portal do Cooperado",
      collapsed: false,
      items: ["portal-cooperado"],
    },
    {
      type: "category",
      label: "📊 Análise & Conformidade",
      collapsed: false,
      items: ["relatorios", "conformidade"],
    },
    {
      type: "category",
      label: "⚙️ Integrações",
      collapsed: true,
      items: ["integracoes"],
    },
  ],
};

export default sidebars;
