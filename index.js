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

const inputCommand = process.argv[2];
const inputTask = process.argv.slice(3).join(" ");

if (inputCommand === "add") {
  addTask(inputTask);
} else {
  console.log("Unknown command. Please use 'add' to add a task.");
}
