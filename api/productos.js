import { supabase } from '@/lib/supabase-edge'; 
 
export default async (req, context) =
  const url = new URL(req.url); 
  const host = req.headers.get('host'); 
  const tiendaId = host.split('.')[0]; 
 
  const cache = caches.default; 
  const cachedResponse = await cache.match(req); 
  if (cachedResponse) return cachedResponse; 
 
  const { data, error } = await supabase 
    .from('products') 
    .select('*'); 
 
  if (error) { 
    return new Response(JSON.stringify({ error }), { status: 500 }); 
  } 
 
  const processedData = data.map(item =
    ...item, 
    image: `https://${host}/assets/productos/${item.image}`, 
    images: item.images.map(img =
  })); 
 
  const response = new Response(JSON.stringify(processedData), { 
    headers: { 
      'Content-Type': 'application/json', 
      'Cache-Control': 'public, s-maxage=604800' 
    } 
  }); 
 
  context.waitUntil(cache.put(req, response.clone())); 
  return response; 
}; 
