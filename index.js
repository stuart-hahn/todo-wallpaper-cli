// index.js
const fs = require("fs");

let tasks = [];

const addTask = (task) => {
  if (task.length === 0) {
    console.log("You cannot add an empty task.");
    return;
  }

  tasks.push(task);
  console.log(`Task added: ${task}`);
};

const listTasks = (tasks) => {
  if (tasks.length === 0) {
    console.log("No tasks to show. Add a task using the 'add' command.");
    return;
  }

  tasks.forEach((task, index) => {
    console.log(`${index + 1}. ${task}`);
  });
};

const inputCommand = process.argv[2];
const inputTask = process.argv.slice(3).join(" ");

if (inputCommand === "add") {
  addTask(inputTask);
} else if (inputCommand === "list") {
  listTasks(tasks);
} else {
  console.log("Unknown command. Please use 'add' to add a task.");
}
