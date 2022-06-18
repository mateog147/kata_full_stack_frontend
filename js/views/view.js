import { loadList, loadTask, saveList, deleteList, saveTask, deleteTask } from "../controllers/mainConstroller.js";
import { markTask, updateTask, taskById } from "../controllers/taskController.js";

/**
 * Metodo para cargar la vista inical y agregar los event listener.
 * Se usa la metodologia de listener sobre el objeto Document.
 * Esto nos permite optimizar recurzor minimizando la cantidad de listener. 
 */
export const loadView = async () =>{

    await fillLists();

    /*
    Evento submit del formulario para crear listas
    Se deja abierta la posibilidad de agregar nuevos formularios.
    */
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

    /*
    Evento click.
    Identifica el nodo del que se origina el evento.
    Segun el origen ejecuta el metodo corrrespondiente.
    */
    document.addEventListener("click",async event =>{
        
        //Boton borrar de cada elemento lista.
        if(event.target.matches(".delete-list-btn")){
            event.preventDefault();
            let isDelete = confirm(`Estas seguro de eliminar a la lista?`)
            if(isDelete){
                await deleteList(event.target.dataset.id);
                await fillLists();
            }
        }
        //Boton crear de cada lista
        else if(event.target.matches(".create-task-btn")){
            event.preventDefault();
            if(event.target.textContent != "Actualizar"){
                newTask(event.target.dataset.id)
            }else{
                updateTaskInfo(event.target.dataset.id);
            }
            
        }

        //Checkbox de cada tarea.
        else if(event.target.matches(".cbox")){
            await markTask(event.target.value)
            const $btn = document.querySelector(`.edit-btn-${event.target.value}`);
            const $id = document.querySelector(`.id-td-${event.target.value}`);
            const $descrip = document.querySelector(`.des-td-${event.target.value}`);
            $id.classList.toggle("checked");
            $descrip.classList.toggle("checked");
            $btn.disabled = !$btn.disabled;
        }

        //Boton editar de cada tarea
        else if(event.target.matches(".edit-task-btn")){
            await updateTaskForm(event.target.dataset.listId, event.target.dataset.taskId)
        }
        
        //Boton eliminar de cada tarea.
        else if(event.target.matches(".delete-task-btn")){
            const $listContanier = document.querySelector(`.list${event.target.dataset.listId}`);
            await deleteTask(event.target.dataset.taskId);
            cleanListNode($listContanier);
            await fillTasks($listContanier, event.target.dataset.listId);
        }
    })
}


/**
 * Metodo para cargar las listas desde la API
 */
const fillLists = async () => {
    //Contenedor del HTML
    const $container = document.getElementById("contanier");
    const $fragment = document.createDocumentFragment();

    
    const lists = await loadList();

    lists.forEach(list => {
        const $listContanier = document.createElement("div");
        $listContanier.classList.add(`list${list.id}`, "list-container")
        const $title = document.createElement("h3");
        const $btn = document.createElement("button");
        $btn.classList.add("delete-list-btn", "btn" , "btn-danger");
        $btn.textContent = "Eliminar";
        $btn.dataset.id  = list.id;
        $title.innerHTML = list.name; 
        $title.append($btn);


        const $formContanier = document.createElement("div");
        $formContanier.classList.add("input-group", "mb-3")
        const $input = document.createElement("input");
        $input.placeholder = "¿Qué piensas hacer?"
        $input.classList.add(`task-input-${list.id}`, "form-control") 

        const $btnNew = document.createElement("button");
        $btnNew.dataset.id  = list.id;
        $btnNew.classList.add("btn", "btn-outline-secondary","create-task-btn");
        $btnNew.textContent = "Crear";
        $formContanier.append($input, $btnNew);
        $listContanier.append($title, $formContanier);

        fillTasks($listContanier, list.id);
        $fragment.appendChild($listContanier)
    });
    cleanNode($container)
    $container.appendChild($fragment);
}

/**
 * Alimenta la tabla de tareas de una lista.
 * @param {htmlNode} $div contenedor de la lista
 * @param {number} id  id de la lista
 */
const fillTasks = async ($div, id) =>{
    const $table = document.createElement("table");
    $table.classList.add("table", "table-striped")
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
        let $clone = document.importNode($template,true);
        $clone.querySelector(".id").textContent = task.id;
        $clone.querySelector(".id").classList.add(`id-td-${task.id}`);
        $clone.querySelector(".description").textContent = task.description;
        $clone.querySelector(".description").classList.add(`des-td-${task.id}`);
        $clone.querySelector(".cbox").checked = task.complete;
        $clone.querySelector(".cbox").value = task.id;

        $clone.querySelector(".edit-task-btn").dataset.listId = id;
        $clone.querySelector(".edit-task-btn").dataset.taskId = task.id;
        $clone.querySelector(".edit-task-btn").classList.add(`edit-btn-${task.id}`);
        $clone.querySelector(".edit-task-btn").disabled = task.complete

        $clone.querySelector(".delete-task-btn").dataset.listId = id;
        $clone.querySelector(".delete-task-btn").dataset.taskId = task.id;
        $clone.querySelector(".delete-task-btn").classList.add(`edit-btn-id`);

        //Si la tarea esta completada se asigno la clase checked a id y description
        if( task.complete){
            $clone.querySelector(".id").classList.toggle('checked');
            $clone.querySelector(".description").classList.toggle('checked');
        }
        
        $table.appendChild($clone);
    });
    $div.appendChild($table);
}

/**
 * Pasa los datos para crear una nueva lista
 */
const newList = async () =>{
    const $name = document.querySelector("#list-input");
    if(!$name.value){
        alert("Ingresa un nombre para la lista")
    }else{
        await saveList($name.value);
        await fillLists();
        $name.value = ""
    }
}

/**
 * Pasa la informacion para crear una tarea
 * @param {number} listId id de la lista a ser agregada
 */
const newTask = async (listId) =>{
    const $des = document.querySelector(`.task-input-${listId}`);
    const $listContanier = document.querySelector(`.list${listId}`);
    if(!$des.value){
        alert("Ingresa un texto para la tarea")
    }else{
        await saveTask(listId,$des.value);
        cleanListNode($listContanier);
        await fillTasks($listContanier, listId);
        $des.value =""
    }
}

/**
 * pasa la información para actualizar la información de una tarea.
 * @param {number} listId id de la lista a la que pertenece la tarea.
 */
const updateTaskInfo = async (listId)=>{
    const $des = document.querySelector(`.task-input-${listId}`);
    const $listContanier = document.querySelector(`.list${listId}`);
    const $btn = $listContanier.querySelector(".create-task-btn");
    
    if(!$des.value){
        alert("Ingresa un texto para la tarea")
    }else{
        //En el dataset de la entrada de texto se guarda el id de la tarea
        await updateTask($des.dataset.id,$des.value);
        cleanListNode($listContanier);
        await fillTasks($listContanier, listId);
        $btn.textContent ="Crear";
        $des.value=("");
        
    }


}

/**
 * Trae la información de la tarea y la pone en el formulario del elemento lista.
 * @param {number} listId 
 * @param {number} taskId 
 */
const updateTaskForm = async (listId, taskId) =>{
    const $des = document.querySelector(`.task-input-${listId}`);
    const $listContanier = document.querySelector(`.list${listId}`);
    const $btn = $listContanier.querySelector(".create-task-btn");
    $btn.textContent ="Actualizar";
    $des.dataset.id =taskId;

    const task = await taskById(taskId);
    $des.value = await task.description;

}

//Limpia el nodo pasado por parametro
const cleanNode =  (parent) =>{
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/**quita la tabla de elemento lista */
const cleanListNode =  (parent) =>{
    parent.childNodes.forEach(c=>{
    
        if(c.tagName  == 'TABLE'){
            parent.removeChild(c);
        }
    
    });
}








