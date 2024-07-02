const url1 = 'http://localhost:3000/api/orden_trabajo/';
const url3 = 'http://localhost:3000/api/pedidos/';
const url4 = 'http://localhost:3000/api/orden_trabajo/put';
const url5 = 'http://localhost:3000/api/orden_trabajo/post';

async function obtenerOrdenesTrabajo(){
    const request_url = url1 + 'get/all';
    const response = await fetch(request_url);
    // Por si algo sale mal
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error desconocido');
    }
    
    return await response.json();
}

async function registrarOrdenesTrabajoAPartirDePedido(pedido_id) {
    const request_url = `${url5}/${pedido_id}`;
    const response = await fetch(request_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pedido_id })
    });
    // Por si algo sale mal
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error desconocido');
    }
    
    return await response.json();
}

async function obtenerPedidos(){
    const request_url = url3 /*+ 'get/all'*/;
    const response = await fetch(request_url);
    // Por si algo sale mal
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error desconocido');
    }
    
    return await response.json();
}

async function actualizarOrdenTrabajoCantidadRealizada(id, body) {
    const request_url = `${url4}/${id}/cantidad_realizada`;
    const response = await fetch(request_url, {
        method: 'PUT',
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

export {obtenerOrdenesTrabajo, obtenerPedidos, registrarOrdenesTrabajoAPartirDePedido, actualizarOrdenTrabajoCantidadRealizada};