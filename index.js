// index.js
const fs = require("fs");
const tasksFilePath = "./tasks.json";

let tasks = [];

const loadTasks = () => {
  if (fs.existsSync(tasksFilePath)) {
    const fileContent = fs.readFileSync(tasksFilePath, "utf-8");

    try {
      tasks = JSON.parse(fileContent);
    } catch (error) {
      console.error(
        "Error reading tasks from file. Starting with an empty array."
      );
      tasks = [];
    }
  } else {
    tasks = [];
  }
};

const saveTasks = () => {
  const tasksJson = JSON.stringify(tasks, null, 2);

  fs.writeFileSync(tasksFilePath, tasksJson, "utf-8");

  console.log("Tasks saved successfully");
};

const addTask = (task) => {
  if (task.length === 0) {
    console.log("You cannot add an empty task.");
    return;
  }

  tasks.push(task);
  saveTasks();
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

loadTasks();

if (inputCommand === "add") {
  addTask(inputTask);
} else if (inputCommand === "list") {
  listTasks(tasks);
} else {
  console.log("Unknown command. Please use 'add' to add a task.");
}
