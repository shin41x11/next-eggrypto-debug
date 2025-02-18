import { getAssetTransfers } from '../../../lib/alchemyService';

export async function GET() {
  try {
    const data = await getAssetTransfers();
    return new Response(JSON.stringify(data), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
