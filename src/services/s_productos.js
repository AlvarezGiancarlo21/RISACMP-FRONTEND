const url1 = 'http://localhost:3000/api/producto/';

async function obtenerProductos(){
    const request_url = url1 + 'get/all';
    const response = await fetch(request_url);
    // Por si algo sale mal
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error desconocido');
    }
    
    return await response.json();
}

async function registrarProducto(datos) {
    const request_url = url1 + 'post';
    const response = await fetch(request_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error desconocido');
    }
    return await response.json();
}

export { obtenerProductos, registrarProducto };