import { loadList, loadTask } from "../controllers/listConstroller.js";

export const loadView = async () =>{
    const $container = document.getElementById("contanier");
    

    const lists = await loadList();
    
    lists.forEach(list => {
        const $listContanier = document.createElement("div");
        const $title = document.createElement("h3");
        const $btn = document.createElement("button");
        $btn.textContent = "Eliminar";
        $title.innerHTML = list.name; 


        const $formContanier = document.createElement("div");
        const $input = document.createElement("input");
        const $btnNew = document.createElement("button");
        $btnNew.textContent = "Crear";
        $formContanier.append($input, $btnNew);
        $listContanier.append($title, $btn, $formContanier);

        fillTasks($listContanier, list.id);
        $container.appendChild($listContanier)
    });
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