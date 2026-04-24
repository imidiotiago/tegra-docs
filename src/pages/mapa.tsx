import React from 'react';
import Layout from '@theme/Layout';

export default function MapaSistema(): JSX.Element {
  return (
    <Layout
      title="Mapa do Sistema"
      description="Visão interativa de todos os módulos da plataforma Tegra"
      noFooter
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - var(--ifm-navbar-height))',
        }}
      >
        <iframe
          src="/mapa-sistema.html"
          style={{ flex: 1, width: '100%', border: 'none' }}
          title="Mapa do Sistema — Tegra"
        />
      </div>
    </Layout>
  );
}
