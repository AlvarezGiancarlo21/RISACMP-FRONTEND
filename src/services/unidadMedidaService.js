const url4 = 'http://localhost:3000/api/unidad_medida/';

async function obtenerUnidadesDeMedida(){
    const request_url = url4 + 'get/all';
    const response = await fetch(request_url);
    const data = await response.json();
    return data;
}

export { obtenerUnidadesDeMedida };