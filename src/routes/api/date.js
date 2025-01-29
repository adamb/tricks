export async function GET() {
  const currentDate = new Date().toISOString();
  return new Response(JSON.stringify({ date: currentDate }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
