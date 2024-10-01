// index.js
const fs = require("fs");
const { createCanvas } = require("canvas");

// file imports
const tasksFilePath = "./tasks.json";
let tasks = [];

// Function to load tasks from a file
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

// Function to save tasks to a file
const saveTasks = () => {
  const tasksJson = JSON.stringify(tasks, null, 2);
  fs.writeFileSync(tasksFilePath, tasksJson, "utf-8");
  console.log("Tasks saved successfully");
};

// Function to generate wallpaper with the task list
const generateWallpaper = async () => {
  const width = 1920;
  const height = 1080;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Set background color
  ctx.fillStyle = "#282c34";
  ctx.fillRect(0, 0, width, height);

  // Set text color and font
  ctx.fillStyle = "#ffffff";
  ctx.font = "40px sans-serif";

  // Draw tasks on the canvas
  const paddingLeft = 100;
  let currentHeight = 100;
  tasks.forEach((task, index) => {
    const status = task.completed ? "[✅]" : "[ ]";
    ctx.fillText(
      `${index + 1}. ${status} ${task.description}`,
      paddingLeft,
      currentHeight
    );
    currentHeight += 60;
  });

  // Save the image as a PNG
  const out = fs.createWriteStream("./wallpaper.png");
  const stream = canvas.createPNGStream();
  stream.pipe(out);

  out.on("finish", async () => {
    console.log("Wallpaper image generated successfully.");
    await setWallpaper("./wallpaper.png"); // Call the function to set the wallpaper
  });
};

// Function to set the wallpaper using the dynamically imported wallpaper module
const setWallpaper = async (imagePath) => {
  try {
    // Dynamically import the named export setWallpaper from the wallpaper module
    const { setWallpaper } = await import("wallpaper");

    await setWallpaper(imagePath); // Set the wallpaper
    console.log("Wallpaper set successfully.");
  } catch (error) {
    console.error("Error setting the wallpaper:", error);
  }
};

// Function to add a task and update the wallpaper
const addTask = (task) => {
  if (task.length === 0) {
    console.log("You cannot add an empty task.");
    return;
  }

  const newTask = {
    description: task,
    completed: false,
  };

  tasks.push(newTask);
  saveTasks();
  generateWallpaper();
  console.log(`Task added: ${task}`);
};

// Function to list tasks
const listTasks = () => {
  if (tasks.length === 0) {
    console.log("No tasks to show. Add a task using the 'add' command.");
    return;
  }

  tasks.forEach((task, index) => {
    const status = task.completed ? "[✅]" : "[ ]";
    console.log(`${index + 1}. ${status} ${task.description}`);
  });
};

// Function to remove a task by its number
const removeTask = (taskNumber) => {
  const index = taskNumber - 1;

  if (index < 0 || index >= tasks.length) {
    console.log("Invalid task number. Try again.");
    return;
  }

  const removedTask = tasks.splice(index, 1);
  saveTasks();
  generateWallpaper();
  console.log(`Task removed: ${removedTask[0].description}`);
};

// Function to mark a task as completed
const completeTask = (taskNumber) => {
  const index = taskNumber - 1;

  if (index < 0 || index >= tasks.length) {
    console.log("Invalid task number. Please try again.");
    return;
  }

  tasks[index].completed = true;
  saveTasks();
  generateWallpaper();
  console.log(`Task marked as completed: ${tasks[index].description}`);
};

// Parse command line input
const inputCommand = process.argv[2];
const inputTask = process.argv.slice(3).join(" ");
const taskNumber = parseInt(process.argv[3], 10);

// Load tasks from the file before executing commands
loadTasks();

// Handle commands
if (inputCommand === "add") {
  addTask(inputTask);
} else if (inputCommand === "list") {
  listTasks();
} else if (inputCommand === "remove") {
  removeTask(taskNumber);
} else if (inputCommand === "complete") {
  completeTask(taskNumber);
} else if (inputCommand === "wallpaper") {
  generateWallpaper();
} else {
  console.log(
    "Unknown command. Please use 'add', 'list', 'remove', 'complete', or 'wallpaper'."
  );
}
