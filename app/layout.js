import './globals.css';
export const metadata = { title: 'Keep-alive', description: 'Stops Render free apps from sleeping' };
export default function RootLayout({ children }) {
  return (<html lang="en"><body>{children}</body></html>);
}
