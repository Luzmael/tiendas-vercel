export default async (request) => {
  try {
    const url = new URL(request.url);
    const uuid = url.searchParams.get('uuid');
    
    if (!uuid) {
      return new Response(JSON.stringify({ 
        error: 'UUID parameter is required' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_KEY;

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/whatsapp_numbers?select=phone_number,is_active&id=eq.${uuid}&is_active=eq.true`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      return new Response(JSON.stringify({ 
        error: `Supabase error: ${response.statusText}` 
      }), { 
        status: response.status 
      });
    }

    const data = await response.json();
    const result = data[0] || { phone_number: '584149834667' }; // Valor por defecto

    return new Response(JSON.stringify(result), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
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
