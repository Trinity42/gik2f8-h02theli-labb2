// npm run dev, dev för att det är det som är valt i package.json
// node app.js används för att inte köra nodemon vilket behövs ibland

const express = require('express');
const app = express();
const fs = require('fs/promises');
// const { Duplex } = require('stream');

const PORT = 5000;

app
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', '*');

    next();
  });

app.get('/tasks', async (req, res) => {
  // res.status(418).send('GET-anrop');
  try {
    const tasks = await fs.readFile('./tasks.json');
    res.send(JSON.parse(tasks));
  } catch (error) {
    res.status(500).send({ error });
  }
});
app.post('/tasks', async (req, res) => {
  try {
    const task = req.body;
    const listBuffer = await fs.readFile('./tasks.json');
    const currentTask = JSON.parse(listBuffer);
    let taskId = 1;
    if (currentTask && currentTask.length > 0) {
      taskId = currentTask.reduce(
        (maxId, currentElement) =>
          currentElement.id > maxId ? currentElement.id : maxId,
        taskId
      );
    }
    const newTask = { id: taskId + 1, ...task };
    const newList = currentTask ? [...currentTask, newTask] : [newTask];
    // console.log(newList, newTask);
    await fs.writeFile('./tasks.json', JSON.stringify(newList));
    res.send(newTask);
  } catch (error) {
    res.status(500).send({ error: error.stack });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const listBuffer = await fs.readFile('./tasks.json');
    const currentTask = JSON.parse(listBuffer);
    // console.log(listBuffer, 'Här');
    if (currentTask.length > 0) {
      // console.log(currentTask.filter((task) => task.id != id));
      await fs.writeFile(
        './tasks.json',
        JSON.stringify(currentTask.filter((task) => task.id != id))
      );
      res.send({ message: `Uppgift med id ${id} togs bort` });
    } else {
      res.status(404).send({ error: 'Ingen uppgift att ta bort' });
    }
  } catch (error) {
    res.status(500).send({ error: error.stack });
  }
});

app.patch('/tasks/:id', async (req, res) => {
  res.send('PATCH succesful');
  try {
    const id = Number(req.params.id);
    // console.log(id);
    const listBuffer = await fs.readFile('./tasks.json');
    const currentTask = JSON.parse(listBuffer);
    // console.log(currentTask);
    const foundTask = currentTask.find((task) => task.id === id);
    foundTask.completed = true;
    await fs.writeFile('./tasks.json', JSON.stringify(currentTask));
  } catch (error) {
    res.status(500).send({ error: error.stack });
  }
  // console.log(req);
});
app.listen(PORT, () => console.log(`Server running on http://localhost:5000`));
