'use strict';

let titleValid = false;
let descriptionValid = false;
let dueDateValid = false;

const api = new Api('http://localhost:5000/tasks');
const toDoListElement = document.getElementById('todoList');
const sortButton = document.getElementById('sortButton');

const validateField = (field) => {
  // console.log(field);
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
  api.getAll().then((tasks) => {
    toDoListElement.innerHTML = '';
    if (tasks && tasks.length > 0) {
      tasks.forEach((task) =>
        toDoListElement.insertAdjacentHTML('beforeend', renderTask(task))
      );
    }
  });
};
// det går att trycka i att en uppgift är gjort men det går inte att ångra sig
const renderTask = ({ id, title, description, dueDate, completed }) => {
  let tasks = { id, title, description, dueDate, completed };

  let html1 = `<button onclick="updateTask(${id})" id="checkMarker" class="border-double align-bottom p-2.5 border-4 border-slate-900"></button>`;
  let html2 = `&#9989; `;
  let text1 = `<h3 class="mb-3 flex-1 text-xl font-bold text-slate-800 uppercase">`;
  let text2 = `<h3 class="mb-3 flex-1 text-xl font-bold text-slate-400 uppercase">`;
  let html = `
    <li class="select-none mt-2 py-2 border-b border-slate-400">
        <div class="flex items-center">
            `;
  html += tasks.completed ? text2 : text1;
  html += tasks.completed ? html2 : html1;
  html += `${title}</h3>
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
  // console.log(e);
  e.preventDefault();
  if (titleValid && descriptionValid && dueDateValid) {
    // console.log('submit');
    saveTask();
    todoForm.reset();
  }
};

const onReset = () => todoForm.reset();

const deleteTask = (id) => {
  api.remove(id).then((result) => {
    renderList();
  });
};
const updateTask = (id) => {
  api.update(id).then((result) => {
    renderList();
  });
};

//sorterar efter datum, kollar först de datum som inte är completed och sen de som är completed
// slår sen i ihop dem
const sorting = () => {
  api.getAll().then((tasks) => {
    const list1 = [];
    const list2 = [];

    for (let i = 0; i < tasks.length; i++) {
      let obj = tasks[i];
      if (!obj.completed) {
        list1.push(obj);
      } else {
        list2.push(obj);
      }
    }

    let sorted1 = list1.sort((t1, t2) => {
      const date1 = t1.dueDate;
      const date2 = t2.dueDate;
      if (date1 < date2) return -1;
      if (date1 > date2) return 1;
      return 0;
    });
    let sorted2 = list2.sort((t1, t2) => {
      const date1 = t1.dueDate;
      const date2 = t2.dueDate;
      if (date1 < date2) return -1;
      if (date1 > date2) return 1;
      return 0;
    });
    const sorted = [...sorted1, ...sorted2];

    toDoListElement.innerHTML = '';
    sorted.forEach((sort) =>
      toDoListElement.insertAdjacentHTML('beforeend', renderTask(sort))
    );
  });
};
sortButton.addEventListener('click', sorting);
renderList();

todoForm.title.addEventListener('input', (e) => validateField(e.target));
todoForm.title.addEventListener('blur', (e) => validateField(e.target));

todoForm.description.addEventListener('input', (e) => validateField(e.target));
todoForm.description.addEventListener('blur', (e) => validateField(e.target));

todoForm.dueDate.addEventListener('input', (e) => validateField(e.target));
todoForm.dueDate.addEventListener('blur', (e) => validateField(e.target));

todoForm.addEventListener('submit', onSubmit);
todoForm.addEventListener('reset', onReset);
