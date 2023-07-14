#!/usr/bin/env node

const chalk = require("chalk");
const { execSync } = require("child_process");
const clear = require("clear");
const figlet = require("figlet");
const fs = require("fs");
const gradient = require("gradient-string");
const inquirer = require("inquirer");
const { join } = require("path");

/* Welcome Page */
clear();
console.log(
  gradient.mind(figlet.textSync("Sam Gerrick", { horizontalLayout: "full" }))
);

console.log(chalk.cyanBright("Project: Docker Resources"));
console.log(
  chalk.cyanBright("Facebook: https://www.facebook.com/alisha.samantha01/")
);
console.log(chalk.cyanBright("GitHub: https://github.com/samgerrick01/"));
console.log("\n");

const resourceFolderPath = join(__dirname, "../resources");

const resourceChoices = fs
  .readdirSync(resourceFolderPath, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

/* Questions */
function askAdditionalCommand() {
  return inquirer.prompt([
    {
      name: "additionalCommand",
      type: "input",
      message: "Additional docker command?:",
    },
  ]);
}

function askResource() {
  return inquirer.prompt([
    {
      name: "resourceName",
      type: "list",
      message: "Choose a resource:",
      choices: resourceChoices,
    },
  ]);
}

function askAction() {
  return inquirer.prompt([
    {
      name: "action",
      type: "list",
      message: "What action do you want to perform?",
      choices: ["up", "down"],
    },
  ]);
}

/* Utils */
function runCommand(command) {
  try {
    execSync(`${command}`, { stdio: "inherit" });
  } catch (error) {
    return { error };
  }
  return { error: null };
}

/* Handler */
async function run() {
  const { resourceName } = await askResource();
  const { action } = await askAction();
  const { additionalCommand } = await askAdditionalCommand();

  const command = `docker compose -f ./resources/${resourceName}/docker-compose.yaml ${action} ${additionalCommand}`;

  const { error } = runCommand(command);

  if (error) {
    console.log(chalk.red("- Error running the command."));
    process.exit();
  }
}

run();
