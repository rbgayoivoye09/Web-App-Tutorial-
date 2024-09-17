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
    parsedList.forEach(item => {
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
        toDoList.removeItemFromList(checkbox.id);
        updatePersistentData(toDoList.getlist());
        const removedText = getLabelText(checkbox.id);
        updateScreenReaderConfirmationMessage(removedText, "removed from list")
        setTimeout(() => {
            refreshThePage();
        }, 1000);
    })
}

const getLabelText = (id) => {
    return document.getElementById(id).nextElementSibling.textContent;
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
    updateScreenReaderConfirmationMessage(newEntryText, "added");
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

const updateScreenReaderConfirmationMessage = (newEntryText, actionVerb) => {
    document.getElementById("conmfirmation").textContent = `${newEntryText} ${actionVerb}.`
}