'use strict';

// const { resourceUsage } = require('process');

let titleValid = true;
let descriptionValid = true;
let dueDateValid = true;
const api = new Api('http://localhost:5000/tasks');
const toDoListElement = document.getElementById('todoList');

const validateField = (field) => {
  const { name, value } = field;
  let validationMessage = '';
  switch (name) {
    case 'title': {
      if (value.length < 2) {
        titleValid = false;
        validationMessage = "Fältet 'Titel' måste innehålla minst 2 tecken.";
      } else if (value.length > 100) {
        titleValid = false;
        validationMessage =
          "Fältet 'Titel' får inte innehålla mer än 100 tecken.";
      } else {
        titleValid = true;
      }
      break;
    }
    case 'description': {
      if (value.length > 500) {
        // lite onödigt då inte går att skriva mer än 500 tecken då max är satt till 500
        descriptionValid = false;
        validationMessage =
          "Fältet 'Beskrivning' får inte innehålla mer än 500 tecken.";
        console.log(validationMessage);
      } else {
        descriptionValid = true;
      }
      break;
    }
    case 'dueDate': {
      if (value.length === 0) {
        descriptionValid = false;
        validationMessage = "Fältet 'Slutförd senast' är obligatorisk'.";
      } else {
        dueDateValid = true;
      }
      break;
    }
    default:
      break;
  }
  field.previousElementSibling.innerText = validationMessage;
  field.previousElementSibling.classList.remove('hidden');
};

const saveTask = () => {
  const task = {
    title: todoForm.title.value,
    description: todoForm.description.value,
    dueDate: todoForm.dueDate.value,
    completed: false,
  };
  api.create(task).then((task) => {
    if (task) {
      renderList();
    }
  });
};
const renderList = () => {
  //   console.log('rendering');
  api.getAll().then((tasks) => {
    toDoListElement.innerHTML = '';
    if (tasks && tasks.length > 0) {
      tasks.forEach((task) =>
        toDoListElement.insertAdjacentHTML('beforeend', renderTask(task))
      );
    }
  });
};

const renderTask = ({ id, title, description, dueDate }) => {
  let html = `
    <li class="select-none mt-2 py-2 border-b border-slate-400">
        <div class="flex items-center">
            <h3 class="mb-3 flex-1 text-xl font-bold text-slate-800 uppercase">${title}</h3>
            <div>
            <span>${dueDate} </span>
            </div>
            <button onclick="deleteTask(${id})" class="inline-block bg-slate-300 text-xs text-slate-900 border-2 border-black p-1 hover:bg-slate-400 rounded-md ml-2">Ta bort</buttonA>
        </div>`;
  description &&
    (html += `
            <p class="ml-8 mt-2 text-xs italic">${description}</p>
            `);
  html += `</li>`;

  return html;
};

const onSubmit = (e) => {
  e.preventDefault();
  if (titleValid && descriptionValid && dueDateValid) {
    // console.log('submit');
    saveTask();
    todoForm.reset();
  }
};

const deleteTask = (id) => {
  api.remove(id).then((result) => {
    renderList();
  });
};

renderList();
todoForm.title.addEventListener('input', (e) => validateField(e.target));
todoForm.title.addEventListener('blur', (e) => validateField(e.target));

todoForm.description.addEventListener('input', (e) => validateField(e.target));
todoForm.description.addEventListener('blur', (e) => validateField(e.target));

todoForm.dueDate.addEventListener('input', (e) => validateField(e.target));
todoForm.dueDate.addEventListener('blur', (e) => validateField(e.target));

todoForm.addEventListener('submit', onSubmit);
