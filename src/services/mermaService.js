const url = 'http://localhost:3000/api/merma/'

async function obtenerMermas(){
    const request_url = url + 'get/all';
    const response = await fetch(request_url);
    const data = await response.json();
    return data;
}

export {obtenerMermas};