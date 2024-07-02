const url1 = 'http://localhost:3000/api/pedidos/';

async function registrarPedido(datos) {
    const request_url = url1 + 'register';
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

export { registrarPedido };