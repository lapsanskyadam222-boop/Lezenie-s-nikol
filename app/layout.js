export const metadata = {
  title: "Lezenie s Nikol",
  description: "PDF + jednoduchá rezervácia",
};

export default function RootLayout({ children }) {
  return (
    <html lang="sk">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
