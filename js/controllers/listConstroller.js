export const loadList = async () =>{
    const url = "http://localhost:8080/api/todolist"; 
    let json = await loadData(url);
    return json;
}

export const loadTask = async (id) =>{
    const url = `http://localhost:8080/api/todolist/${id}/task`; 
    let json = await loadData(url);
    return json;
}


const loadData = async (url) =>{
    try {
        let res = await fetch(url)
        //asi lanzamos un objeto que atrapa el cath y lo lleva a consola
        if(!res.ok){
            throw {status:res.status, statusText:res.statusText} 
        }
        return  await res.json();;
    } catch (error) {
        console.log(error)
        return null
    }
}