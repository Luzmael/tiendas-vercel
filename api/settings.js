export default async (request) => {
  try {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_KEY;

    const response = await fetch(`${SUPABASE_URL}/rest/v1/app_settings?select=*&limit=1`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ 
        error: `Supabase error: ${response.statusText}` 
      }), { 
        status: response.status 
      });
    }

    const data = await response.json();
    const result = data[0] || { rate: 115.33, shipping_cost: 0 };

    return new Response(JSON.stringify(result), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600'
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      error: `Internal error: ${error.message}` 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
