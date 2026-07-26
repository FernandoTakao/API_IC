export const metadata = {
  title: "API ICD",
  description: "API para gerenciamento de experimentos",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
