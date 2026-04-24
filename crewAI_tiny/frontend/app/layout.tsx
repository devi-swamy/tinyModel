export const metadata = {
  title: 'CrewAI Research Engine',
  description: 'AI-powered research and writing with autonomous agents',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
