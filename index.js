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
    stageFile("/mini_git.js"); // find a way to pich the name from the command line
  });

// commit changes
program
  .command("commit")
  .description("Commiting staged files")
  .action(() => {
    commitChanges("first commit minigitjs"); // find a way to pich the name from the command line
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
  .command("branch")
  .description("Create a new branch")
  .action(() => {
    createBranch("conrad_dev"); // find a way to pich the name from the command line
  });
brachCheckOut;

//  brachCheckOut
program
  .command("checkout")
  .description("change the branch")
  .action(() => {
    brachCheckOut("main"); // find a way to pich the name from the command line
  });

//  merge branches and identify conflicts
program
  .command("merge")
  .description("Merge the target branch the the current branch")
  .action(() => {
    mergeBranches("conrad_dev"); // find a way to pich the name from the command line
  });

program.parse(process.argv);
