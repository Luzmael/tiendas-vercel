export default async (request) => {
  try {
    // 1. Obtener variables de entorno de Vercel
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_KEY;

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      throw new Error("Missing Supabase environment variables");
    }

    // 2. Fetch a Supabase
    const response = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ 
        error: `Error en Supabase: ${response.statusText}` 
      }), { 
        status: response.status 
      });
    }

    const data = await response.json();

    // 3. Procesar URLs de imágenes
    const processedData = data.map(item => ({
      ...item,
      image: item.image?.startsWith('http') 
        ? item.image 
        : `/assets/productos/${item.image}`,
      images: item.images?.map(img => 
        img.startsWith('http') ? img : `/assets/productos/${img}`
      ) || []
    }));

    // 4. Devolver respuesta con caché
    return new Response(JSON.stringify(processedData), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=604800' // 1 semana
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      error: `Error interno: ${error.message}` 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
