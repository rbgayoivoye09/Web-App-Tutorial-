import ToDoList from "./todolist.js";
import ToDoItem from "./todoitem.js";

const toDoList = new ToDoList();

// lauch the app
document.addEventListener("readystatechange", (event) => {
    if (event.target.readyState === "complete") {
        initApp();
    }
})

function initApp() {
    // add event listeners
    const itemEntryForm = document.getElementById("itemEntryForm");
    itemEntryForm.addEventListener("submit", (event) => {
        event.preventDefault();//不会刷新页面
        processSubmition();
    })
    const clearListButton = document.getElementById("clearItems");
    clearListButton.addEventListener("click", (event) => {
        const list = toDoList.getlist();

        if (list.length) {
            const conform = confirm("Are you sure you want to delete all items?"); //弹出确认框

            if (conform) {
                toDoList.clearList();
                updatePersistentData(toDoList.getlist());

                refreshThePage();
            }
        }
    })
    loadListObject();
    refreshThePage();

}

const loadListObject = () => {
    const storedList = localStorage.getItem("toDoList")
    if (typeof storedList !== "string") {
        return;
    }
    const parsedList = JSON.parse(storedList);
    console.log(parsedList);
    parsedList.forEach(item => {
        console.log(item);
        const newItem = createToDoItem(item._id, item._item);
        toDoList.addItemToList(newItem);
    })

}

const refreshThePage = () => {
    clearListDisplay();
    renderList();
    clearItemEntryField();
    setFocusOnItemField();

}

const clearListDisplay = () => {
    const parentElement = document.getElementById("listItems");
    // confirm("parentElement: " + parentElement);
    deleteContent(parentElement);
}

const deleteContent = (parentElement) => {
    let child = parentElement.lastElementChild;
    while (child) {
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    }
}

const renderList = () => {
    const list = toDoList.getlist();
    list.forEach((item) => {
        buildListIem(item);
    })
}

const buildListIem = (item) => {
    const div = document.createElement("div");
    div.className = "item";
    const check = document.createElement("input");
    check.type = "checkbox";
    check.id = item.getId();
    check.tabIndex = 0;


    addClickListenerToCheckbox(check);
    const label = document.createElement("label");
    label.htmlFor = item.getId();
    label.textContent = item.getItem();
    div.appendChild(check);
    div.appendChild(label);
    const container = document.getElementById("listItems");
    container.appendChild(div);
}

const addClickListenerToCheckbox = (checkbox) => {
    checkbox.addEventListener("click", (event) => {
        console.log(checkbox.id)
        toDoList.removeItemFromList(checkbox.id);
        updatePersistentData(toDoList.getlist());
        setTimeout(() => {
            refreshThePage();
        }, 1000);
    })
}

const updatePersistentData = (listArray) => {
    localStorage.setItem("toDoList", JSON.stringify(listArray));
}

const clearItemEntryField = () => {
    document.getElementById("newItem").value = "";
}

const setFocusOnItemField = () => {
    document.getElementById("newItem").focus();
}

const processSubmition = () => {
    const newEntryText = getNewEntry();
    if (!newEntryText.length) {
        return;
    }

    const nextItemId = calcNextItemId();
    const toDoItem = createToDoItem(nextItemId, newEntryText);

    toDoList.addItemToList(toDoItem);
    updatePersistentData(toDoList.getlist());
    refreshThePage();
}

const getNewEntry = () => {
    return document.getElementById("newItem").value.trim();
}

const calcNextItemId = () => {
    let nextItemId = 1;
    const list = toDoList.getlist();
    if (list.length > 0) {
        nextItemId = list[list.length - 1].getId() + 1;
    }

    return nextItemId;
}

const createToDoItem = (itemId, itemText) => {
    const toDo = new ToDoItem();
    toDo.setId(itemId);
    toDo.setItem(itemText);
    return toDo;
}