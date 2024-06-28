const todoInput = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");
const templateItem = document.querySelector(".listHere");
const apiUrl = "https://todolistapi-ch51.onrender.com";
let editToDoId = null;

const handleAdd = async () => {
  const todoText = todoInput.value.trim();

  const payload = {
    title: todoText,
    completed: false,
  };

  if (todoText === "") {
    alert("Bhaiya kuch to likeyeeeeee....");
    return;
  }
  
  //api call
  if (editToDoId) {
    await updateToDo(editToDoId, payload);
    editToDoId = null;
    addBtn.textContent = "Add";
  } else {
    await addTodoItem(payload);
  }

  todoInput.value = "";
  await getTodos();
};

async function addTodoItem(payload) {
  try {
    const response = await fetch(apiUrl + "/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Kuch to gadbad hai..............");
    }
    if (response.status === 201 || response.status === 200) {
      alert("Jankari aapne di hai wo sava kar li gae hai... dhanyawad...");
    }

    const data = await response.json();
    console.log(response, "<===data from response");
  } catch (error) {
    console.error("Error", error);
  }
}

async function updateToDo(editToDoId, payload) {
  try {
    const response = await fetch(apiUrl + `/todos/${editToDoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Kuch to gadbad hai..............");
    }
    if (response.status === 201 || response.status === 200) {
      alert("Jankari aapne di hai wo UPDATE kar li gae hai... dhanyawad...");
    }

    const data = await response.json();
    console.log(response, "<===data from response");
  } catch (error) {
    console.error("Error", error);
  }
}

async function deleteToDo(deleteToDoId, todoItem) {
  try {
    const response = await fetch(apiUrl + `/todos/${deleteToDoId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Kuch to gadbad hai..............");
    }
    if (response.status === 201 || response.status === 200) {
      alert("row delete kar di gae");
    }
    todoItem.remove();
    // const data = await response.json();
    // console.log(response, "<===data from response");
  } catch (error) {
    console.error("Error", error);
  }
}

async function getTodos() {
  try {
    const response = await fetch(apiUrl + "/todos", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Database se jankari nahi aa paye hai..........");
    }

    const data = await response.json();
    // console.log(data, "<===data fetched successfully");
    todoList.innerHTML = "";
    todoList.appendChild(templateItem);
    data.forEach((todo) => addTodoToDOM(todo));
  } catch (error) {
    console.error("Error", error);
  }
}

const addTodoToDOM = (todo) => {
  const todoItem = templateItem.cloneNode(true);
  todoItem.innerHTML = `
  <span class="span"> ${todo.title} </span>
  <button class="edit-btn" >Edit</button>
  <button class="delete-btn">Delete</button>`;
  todoList.appendChild(todoItem);

  const editBtn = todoItem.querySelector(".edit-btn");
  editBtn.addEventListener("click", () => handleEdit(todo._id, todo.title));

  const deleteBtn = todoItem.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", () => handleDelete(todo._id, todoItem));
};

const handleDelete = async (id, todoItem) => {
  await deleteToDo(id, todoItem);
  console.log(todoItem, "<===todoItem todoItem");
};

const handleEdit = (id, title) => {
  todoInput.value = title;
  editToDoId = id;
  addBtn.textContent = "Edit ToDO";
  console.log(id, "editBtn");
};

addBtn.addEventListener("click", handleAdd);
window.addEventListener("load", getTodos); 