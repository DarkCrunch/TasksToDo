const todoValue = document.getElementById("todoText"),
  listItems = document.getElementById("list-items"),
  addUpdateClick = document.getElementById("AddUpdateClick"),
  Toast = Swal.mixin({
    toast: true,
    position: "top-start",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });
let updateText = "";
let todoData = JSON.parse(localStorage.getItem("todoData")) | [];

if (!todoData) {
  todoData = [];
}

ReadToDoItems();

function ReadToDoItems() {
  todoData.forEach(element => {
    let li = document.createElement("li");
    let style = "";
    if (element.status) {
      style = `style="text-decoration: line-through"`;
    }

    const todoItems = `
    <div ${style} ondblclick="CompleteTodoItem(this)">${element.item}</div>
    ${style === "" ? `<div class ="li-actions">
                        <div><i class="fa fa-pencil todo-controls" id="edit" onclick="UpdateToDoItems(this)"></i></div>
                        <div><i class="fa fa-trash-o todo-controls" id="delete" onclick="DeleteToDoItems(this)"></i></div>
                      </div>`: ""}`;
    li.innerHTML = todoItems;
    listItems.appendChild(li);
  });
}

todoValue.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addUpdateClick.click();
  }
});

function CreateToDoData() {
  Toast.fire({
    title: "Task Saved!",
    icon: "success"
  });

  if (todoValue.value === "") {
    Toast.fire({
      title: "Please insert a new task to continue...",
      icon: "info"
    });
    todoValue.focus();
  }
  else {
    let li = document.createElement("li");
    const todoItems = `
    <div ondblclick="CompleteTodoItem(this)">${todoValue.value}</div>
    <div class="li-actions">
      <div><i class="fa fa-pencil todo-controls" id="edit" onclick="UpdateToDoItems(this)"></i></div>
      <div><i class="fa fa-trash-o todo-controls" id="delete" onclick="DeleteToDoItems(this)"></i></div>
    </div>
    `;

    li.innerHTML = todoItems;
    listItems.appendChild(li);
    todoValue.value = "";

    if (!todoData) {
      todoData = [];
    }
    let dataItem = { item: todoData.value, status: false };
    todoData.push(dataItem);
  }
}

function CompleteTodoItem(e) {
  if (e.parentElement.querySelector("div").style.textDecoration === "") {
    e.parentElement.querySelector("div").style.textDecoration = "line-through";
    Toast.fire({
      title: "Task Done!",
      icon: "success"
    });
    todoData.forEach((element) => {
      if (e.parentElement.querySelector("div") == element.item) {
        element.status = true;
      }
    });
  }
}

function UpdateToDoItems(e) {
  if (e.parentElement.parentElement.parentElement.querySelector("div").style.textDecoration === "") {
    updateText = e.parentElement.parentElement.parentElement.querySelector("div");
    Swal.fire({
      title: "Editing task",
      input: "text",
      inputValue: updateText.innerText,
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "Yo need to write your task!"
        }
      },
      preConfirm: (value) => {
        if (value) {
          updateText.innerText = value;
          updateText = "";
          Toast.fire({
            icon: "success",
            title: "Task edited!"
          });
          todoData.forEach(element => {
            if (element.item == updateText.innerText.trim()) {
              element.item = value;
            }
            setLocalStorage();
          });
        }
      }
    });
  }
}

function DeleteToDoItems(e) {
  let deleteValue = e.parentElement.parentElement.parentElement.querySelector("div");
  Toast.fire({
    icon: "question",
    title: `Do you want to delete "${deleteValue.innerText}" task?`,
    showConfirmButton: true,
    preConfirm: (value) => {
      e.parentElement.parentElement.parentElement.parentElement.querySelector("li").remove();
      Toast.fire({
        icon: "success",
        title: "Task deleted!"
      });

      todoData.forEach((element) => {
        if (element.item == deleteValue.trim()) {
          todoData.splice(element, 1);
        }
      });

      setLocalStorage();
    }
  });
}

function setLocalStorage() {
  localStorage.setItem("todoData", JSON.stringify(todoData));
}