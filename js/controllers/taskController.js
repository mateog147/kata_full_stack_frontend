export const markTask = async (taskId) =>{
    const url = `http://127.0.0.1:8080/api/task/complete/${taskId}`; 
    const json = {}
    
    await updateData(url,json)
}

export const updateTask = async (taskId, taskName) =>{
    const url = `http://127.0.0.1:8080/api/task/${taskId}`; 
    const json = {description:taskName}
    
    await updateData(url,json)
}

export const taskById = async (id) =>{
        const url = `http://localhost:8080/api/task/${id}`
        try {
            let res = await fetch(url)
            //asi lanzamos un objeto que atrapa el cath y lo lleva a consola
            if(!res.ok){
                throw {status:res.status, statusText:res.statusText} 
            }
            return  await res.json();
        } catch (error) {
            console.log(error)
            return null
        }
}

const updateData = async (url,json)=>{
    try {
        let options ={
            method:"PUT",
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
        alert("Error al actualizar la tarea")
        console.log(error)
        location.reload();
    }
}
