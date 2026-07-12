import { RootLayout } from '@payloadcms/next/layouts';
import React from 'react';
import { importMap } from './importMap';

type Args = {
  children: React.ReactNode;
};

const Layout = ({ children }: Args) => (
  <RootLayout importMap={importMap}>{children}</RootLayout>
);

export default Layout;
