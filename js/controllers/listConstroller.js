export const loadList = async () =>{
    const url = "http://localhost:8080/api/todolist"; 
    let json = await loadData(url);
    return json;
}

export const saveList = async (listName) =>{
    const url = "http://localhost:8080/api/todolist"; 
    const json = {name:listName}
    await saveData(url,json)
}

export const deleteList = async (id) =>{
    const url = `http://localhost:8080/api/todolist/${id}`;  
    await deleteData(url);
}

export const loadTask = async (id) =>{
    const url = `http://localhost:8080/api/todolist/${id}/task`; 
    let json = await loadData(url);
    return json;
}

export const saveTask = async (listId,taskName) =>{
    const url = `http://localhost:8080/api/todolist/${listId}/task`; 
    const json = {description:taskName}
    await saveData(url,json)
}

export const deleteTask = async (id) =>{
    const url = `http://localhost:8080/api/task/${id}`;  
    await deleteData(url);
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

const saveData = async (url, json) =>{
    //post
    try {
        let options ={
            method:"POST",
            headers:{
                "Content-Type":"application/json;charset=utf-8"
            },
            body:JSON.stringify(json)
        }
        let res = await fetch(url,options);
        if(!res.ok){
            throw {status:res.status, statusText:res.statusText} 
        }
    } catch (error) {
        console.log(error)
        return null
    }

}

const deleteData = async (url) =>{
    //delete
    try {
        let options ={
            method:"DELETE"
        }
        let res = await fetch(url, options);
        
        if(!res.ok){
            throw {status:res.status, statusText:res.statusText} 
        }
    } catch (error) {
        console.log(error)
    }

}