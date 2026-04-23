import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "Tegra — Documentação",
  tagline: "Plataforma completa de gestão para centrais de cooperativas de seguros",
  favicon: "img/favicon.svg",

  future: { v4: true },

  url: "https://docs.tegra.soufluir.com",
  baseUrl: "/",

  organizationName: "tegra",
  projectName: "tegra-docs",

  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",

  markdown: {
    hooks: {
      onBrokenMarkdownImages: "warn",
    },
  },

  i18n: {
    defaultLocale: "pt-BR",
    locales: ["pt-BR"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          routeBasePath: "/",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: "img/og-card.png",
    colorMode: {
      defaultMode: "light",
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "Tegra",
      logo: {
        alt: "Tegra",
        src: "img/tegra-icon.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "mainSidebar",
          position: "left",
          label: "Documentação",
        },
        {
          href: "https://tegra.soufluir.com",
          label: "↗ Acessar Sistema",
          position: "right",
          className: "navbar-cta-btn",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Operacional",
          items: [
            { label: "Emissão de Apólices", to: "/apolices" },
            { label: "Sinistros", to: "/sinistros" },
            { label: "Pagamentos", to: "/pagamentos" },
          ],
        },
        {
          title: "Comercial",
          items: [
            { label: "Captação de Leads", to: "/leads" },
            { label: "Motor de Cálculo", to: "/motor-calculo" },
            { label: "Portal do Cooperado", to: "/portal-cooperado" },
          ],
        },
        {
          title: "Gestão",
          items: [
            { label: "Conformidade SUSEP", to: "/conformidade" },
            { label: "Relatórios", to: "/relatorios" },
            { label: "Segurança & Acesso", to: "/seguranca" },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Tegra — Plataforma de Cooperativas de Seguros`,
    },
    prism: {
      theme: prismThemes.oneLight,
      darkTheme: prismThemes.oneDark,
    },
  } satisfies Preset.ThemeConfig,

  plugins: [
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        hashed: true,
        language: ["pt"],
        docsRouteBasePath: "/",
        indexBlog: false,
        searchResultLimits: 10,
        searchBarShortcutHint: true,
      },
    ],
  ],
};

export default config;
