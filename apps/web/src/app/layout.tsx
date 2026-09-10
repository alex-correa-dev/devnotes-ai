import type { Metadata } from 'next';
import { ApolloWrapper } from '@/lib/apollo/ApolloWrapper';
import './globals.css';

export const metadata: Metadata = {
  title: 'DevNotes AI',
  description: 'Base de conhecimento pessoal com busca full-text nativa do MongoDB',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <ApolloWrapper>{children}</ApolloWrapper>
      </body>
    </html>
  );
}