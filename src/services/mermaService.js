const url = 'http://localhost:3000/api/merma/'

async function obtenerMermas(){
    const request_url = url + 'get/all';
    const response = await fetch(request_url);
    const data = await response.json();
    return data;
}

async function registrarMerma(datosMerma) {
    const request_url = url + 'post';
    const response = await fetch(request_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosMerma)
    });
    const data = await response.json();
    return data
}

export {obtenerMermas, registrarMerma};