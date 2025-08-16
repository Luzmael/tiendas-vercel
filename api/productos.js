export default async (request) => {
  try {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_KEY;

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      throw new Error("Missing Supabase environment variables");
    }

    const response = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*`, {
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

    const processedData = data.map(item => {
      const safeImage = typeof item.image === 'string' 
        ? (item.image.startsWith('http') ? item.image : `/assets/productos/${item.image}`)
        : '/assets/productos/default.jpg';

      const safeImages = Array.isArray(item.images) 
        ? item.images.map(img => 
            typeof img === 'string' 
              ? (img.startsWith('http') ? img : `/assets/productos/${img}`)
              : '/assets/productos/default.jpg'
          )
        : [];

      return {
        ...item,
        image: safeImage,
        images: safeImages
      };
    });

    return new Response(JSON.stringify(processedData), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=604800'
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
