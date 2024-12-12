import { Command } from "commander";
import {
  brachCheckOut,
  commitChanges,
  commitHistory,
  createBranch,
  initRepo,
  mergeBranches,
  stageFile,
} from "./mini_git.js";

const program = new Command();
// CL intro
program
  .name("mini-git")
  .description("A simple version control system like git")
  .version("1.0.0");

// commands  //   eg command - node index.js init
program
  .command("init")
  .description("intitialize a new repo")
  .action(() => {
    initRepo();
  });

// stage files
program
  .command("add <file>")
  .description("Stage files")
  .action((file) => {
    console.log(file);
    stageFile(file); // find a way to pich the name from the command line
  });

// commit changes
program
  .command("commit <message>")
  .description("Commiting staged files")
  .action((message) => {
    commitChanges(message); // find a way to pich the name from the command line
  });

//  logs
program
  .command("logs")
  .description("Logs for commits")
  .action(() => {
    commitHistory(); // find a way to pich the name from the command line
  });

// create new branch
program
  .command("branch <name>")
  .description("Create a new branch")
  .action((name) => {
    createBranch(name); // find a way to pich the name from the command line
  });
brachCheckOut;

//  brachCheckOut
program
  .command("checkout <name>")
  .description("change the branch")
  .action((name) => {
    brachCheckOut(name); // find a way to pich the name from the command line
  });

//  merge branches and identify conflicts
program
  .command("merge <name> ")
  .description("Merge the target branch the the current branch")
  .action((name) => {
    mergeBranches(name); // find a way to pich the name from the command line
  });

program.parse(process.argv);
