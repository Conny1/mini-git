import { Command } from "commander";
import {
  commitChanges,
  commitHistory,
  initRepo,
  stageFile,
} from "./mini_git.js";

const program = new Command();
// CL intro
program
  .name("mini-git")
  .description("A simple version control system like git")
  .version("1.0.0");

// commands
program
  .command("init")
  .description("intitialize a new repo")
  .action(() => {
    initRepo();
  });
//   eg command - node index.js init
// stage files
program
  .command("add")
  .description("Stage files")
  .action(() => {
    stageFile("/index.js"); // find a way to pich the name from the command line
  });

// commit changes
program
  .command("commit")
  .description("commiting staged files")
  .action(() => {
    commitChanges("second commit"); // find a way to pich the name from the command line
  });

// commit changes
program
  .command("logs")
  .description("Logs for commits")
  .action(() => {
    commitHistory(); // find a way to pich the name from the command line
  });

program.parse(process.argv);
