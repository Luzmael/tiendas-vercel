import { supabase } from '@/lib/supabase-edge'; 
 
export default async (req, context) =
  const cache = caches.default; 
  const cached = await cache.match(req); 
  if (cached) return cached; 
 
  const { data } = await supabase 
    .from('app_settings') 
    .select('*') 
    .limit(1); 
 
  const response = new Response(JSON.stringify(data[0]), { 
    headers: { 
      'Cache-Control': 'public, s-maxage=3600' 
    } 
  }); 
 
  context.waitUntil(cache.put(req, response.clone())); 
  return response; 
}; 
