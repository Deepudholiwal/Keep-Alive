export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  const { startPinger } = await import('./lib/store');
  startPinger();
}
