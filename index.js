import { Command } from "commander";
import { initRepo, stageFile } from "./mini_git.js";

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
    stageFile("/package.json"); // find a way to pich the name from the command line
  });

program.parse(process.argv);
