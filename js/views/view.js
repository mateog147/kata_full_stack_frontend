import { loadList, loadTask, saveList, deleteList } from "../controllers/listConstroller.js";

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
        event.preventDefault();

        if(event.target.matches(".delete-list-btn")){
            let isDelete = confirm(`Estas seguro de eliminar a la lista?`)
            if(isDelete){
                await deleteList(event.target.dataset.id);
                await fillLists();
            }
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
        const $btnNew = document.createElement("button");
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

const cleanNode =  (parent) =>{
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}









