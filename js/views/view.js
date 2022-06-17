import { loadList, loadTask, saveList, deleteList, saveTask, deleteTask } from "../controllers/listConstroller.js";
import { markTask, updateTask, taskById } from "../controllers/taskController.js";

export const loadView = async () =>{

    await fillLists();

    document.addEventListener("submit",async event =>{
        event.preventDefault();
        const $listForm =  document.getElementById("list-form");
        switch (event.target) {
            case $listForm:
                await newList();
                break;
        
            default:
                break;
        }
    })

    document.addEventListener("click",async event =>{
        
        if(event.target.matches(".delete-list-btn")){
            event.preventDefault();
            let isDelete = confirm(`Estas seguro de eliminar a la lista?`)
            if(isDelete){
                await deleteList(event.target.dataset.id);
                await fillLists();
            }
        }

        else if(event.target.matches(".create-task-btn")){
            event.preventDefault();
            if(event.target.textContent != "Actualizar"){
                newTask(event.target.dataset.id)
            }else{
                updateTaskInfo(event.target.dataset.id);
            }
            
        }

        else if(event.target.matches(".cbox")){
            await markTask(event.target.value)
        }

        else if(event.target.matches(".edit-task-btn")){
            await updateTaskForm(event.target.dataset.listId, event.target.dataset.taskId)
        }

        else if(event.target.matches(".delete-task-btn")){
            const $listContanier = document.querySelector(`.list${event.target.dataset.listId}`);
            await deleteTask(event.target.dataset.taskId);
            cleanListNode($listContanier);
            await fillTasks($listContanier, event.target.dataset.listId);
        }

        
    })
}



const fillLists = async () => {
    const lists = await loadList();
    const $container = document.getElementById("contanier");
    const $fragment = document.createDocumentFragment();

    lists.forEach(list => {
        const $listContanier = document.createElement("div");
        $listContanier.classList.add(`list${list.id}`, "list-contanier")
        const $title = document.createElement("h3");
        const $btn = document.createElement("button");
        $btn.className=("delete-list-btn")
        $btn.textContent = "Eliminar";
        $btn.dataset.id  = list.id;
        $title.innerHTML = list.name; 


        const $formContanier = document.createElement("div");
        const $input = document.createElement("input");
        $input.className = `task-input-${list.id}`

        const $btnNew = document.createElement("button");
        $btnNew.dataset.id  = list.id;
        $btnNew.className=("create-task-btn");
        $btnNew.textContent = "Crear";
        $formContanier.append($input, $btnNew);
        $listContanier.append($title, $btn, $formContanier);

        fillTasks($listContanier, list.id);
        $fragment.appendChild($listContanier)
    });
    cleanNode($container)
    $container.appendChild($fragment);
}

const fillTasks = async ($div, id) =>{
    const $table = document.createElement("table");
    const $template = document.getElementById("row-template").content;

    //creamos la cabecera 
    const headers = document.createElement("tr");
    const colId = document.createElement("th");
    colId.textContent = "Id"
    const colTask = document.createElement("th");
    colTask.textContent = "Tarea"
    const colDone = document.createElement("th");
    colDone.textContent = "¿Completado?"
    const colActions = document.createElement("th");
    //colActions.textContent = "Acciones"

    headers.append(colId,colTask,colDone,colActions);
    $table.append(headers);

    const tasks = await loadTask(id)
    tasks.forEach(task => {
        $template.querySelector(".id").textContent = task.id;
        $template.querySelector(".description").textContent = task.description;
        $template.querySelector(".cbox").checked = task.complete;
        $template.querySelector(".cbox").value = task.id;

        $template.querySelector(".edit-task-btn").dataset.listId = id;
        $template.querySelector(".edit-task-btn").dataset.taskId = task.id;
        $template.querySelector(".edit-task-btn").classList.add(`edit-btn-id`);

        $template.querySelector(".delete-task-btn").dataset.listId = id;
        $template.querySelector(".delete-task-btn").dataset.taskId = task.id;
        $template.querySelector(".delete-task-btn").classList.add(`edit-btn-id`);

        let $clone = document.importNode($template,true);
        $table.appendChild($clone);
    });
    $div.appendChild($table);
}

const newList = async () =>{
    const $name = document.querySelector("#list-input");
    if(!$name.value){
        alert("Ingresa un nombre para la lista")
    }else{
        saveList($name.value);
        await fillLists();
    }
}

const newTask = async (listId) =>{
    const $des = document.querySelector(`.task-input-${listId}`);
    const $listContanier = document.querySelector(`.list${listId}`);
    if(!$des.value){
        alert("Ingresa un texto para la tarea")
    }else{
        await saveTask(listId,$des.value);
        cleanListNode($listContanier);
        await fillTasks($listContanier, listId);
    }
}

const updateTaskInfo = async (listId)=>{
    const $des = document.querySelector(`.task-input-${listId}`);
    const $listContanier = document.querySelector(`.list${listId}`);
    const $btn = $listContanier.querySelector(".create-task-btn");
    
    if(!$des.value){
        alert("Ingresa un texto para la tarea")
    }else{
        await updateTask($des.dataset.id,$des.value);
        cleanListNode($listContanier);
        await fillTasks($listContanier, listId);
        $btn.textContent ="Crear";
        $des.value=("");
        
    }


}

const updateTaskForm = async (listId, taskId) =>{
    const $des = document.querySelector(`.task-input-${listId}`);
    const $listContanier = document.querySelector(`.list${listId}`);
    const $btn = $listContanier.querySelector(".create-task-btn");
    $btn.textContent ="Actualizar";
    $des.dataset.id =taskId;

    const task = await taskById(taskId);
    $des.value = await task.description;

}

const cleanNode =  (parent) =>{
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

const cleanListNode =  (parent) =>{
    parent.childNodes.forEach(c=>{
    
        if(c.tagName  == 'TABLE'){
            parent.removeChild(c);
        }
    
    });
}








