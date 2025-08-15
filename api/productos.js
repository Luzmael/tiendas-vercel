export default async (request) => {
    const supabaseUrl = 'https://bekzfacymgaytpgfqrzg.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJla3pmYWN5bWdheXRwZ2ZxcnpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMjAzNjcsImV4cCI6MjA2OTY5NjM2N30.R1hbWLGSvp6LcqqsDd-ibTGMS_mrGNl0oP-Ah-0iSt8';

    try {
        const response = await fetch(`${supabaseUrl}/rest/v1/products?select=*`, {
            headers: {
                'apikey': supabaseKey,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            return new Response(JSON.stringify({ 
                error: `Supabase error: ${response.status}` 
            }), { 
                status: response.status 
            });
        }

        const data = await response.json();
        
        // Procesar imágenes para usar rutas correctas
        const processedData = data.map(item => ({
            ...item,
            image: item.image?.startsWith('http') ? item.image : `/assets/productos/${item.image}`,
            images: item.images?.map(img => 
                img.startsWith('http') ? img : `/assets/productos/${img}`
            ) || []
        }));

        return new Response(JSON.stringify(processedData), {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, s-maxage=604800'
            }
        });

    } catch (error) {
        return new Response(JSON.stringify({ 
            error: error.message 
        }), { 
            status: 500 
        });
    }
};
