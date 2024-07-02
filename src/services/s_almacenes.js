const url1 = 'http://localhost:3000/api/almacen/';

async function obtenerAlmacenes(){
    const request_url = url1 + 'get/all';
    const response = await fetch(request_url);
    // Por si algo sale mal
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error desconocido');
    }
    
    return await response.json();
}

async function crearAlmacen(body) {
    const request_url = url1 + 'post';
    const response = await fetch(request_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    // Por si algo sale mal
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error desconocido');
    }
    
    return await response.json();
}

export {obtenerAlmacenes, crearAlmacen}