import fs from "fs";
import path from "path";
import crypto from "crypto";
import { timeStamp } from "console";

// repo intitialization
function initRepo() {
  const repoPath = path.join(process.cwd(), ".minigit");
  if (fs.existsSync(repoPath)) {
    console.log("repo already exists.");
    return;
  }
  // create the mini git directory

  fs.mkdirSync(repoPath);
  fs.mkdirSync(path.join(repoPath, "commits"));
  fs.mkdirSync(path.join(repoPath, "refs"));
  fs.writeFileSync(path.join(repoPath, "HEAD"), "refs/head/main"); //default branch
  fs.writeFileSync(path.join(repoPath, "index"), ""); // staging already

  console.log("Initialized an empty repository in .minigit/");
}

function hashFile(content) {
  return crypto.createHash("sha1").update(content).digest("hex");
}

function stageFile(filepath) {
  const fullpath = path.join(process.cwd(), filepath);
  if (!fs.existsSync(fullpath)) {
    console.log(`File not found:Path: ${filepath}`);
    return;
  }

  const content = fs.readFileSync(fullpath, "utf-8");
  const hash = hashFile(content);

  //   write to index filepath
  const indexPath = path.join(process.cwd(), ".minigit", "index");
  const indexData = fs.readFileSync(indexPath, "utf-8");
  const newData = `${hash} ${filepath}\n`;
  fs.writeFileSync(indexPath, indexData + newData);

  console.log(`staged file:${filepath}`);
}

function commitChanges(message) {
  let repoPath = path.join(process.cwd(), ".minigit");
  let stagedPath = path.join(repoPath, "index");
  let commitsPath = path.join(repoPath, "commits");
  let headPath = path.join(repoPath, "HEAD");

  // read staged files fron index
  if (
    !fs.existsSync(stagedPath) ||
    fs.readFileSync(stagedPath, "utf-8").trim() === ""
  ) {
    console.log("Nothing to commit.Staging area is empty");
    return;
  }
  let stagedContent = fs.readFileSync(stagedPath, "utf-8").split("\n");
  let parentCommit = fs.existsSync
    ? fs.readFileSync(headPath, "utf-8").trim()
    : null;
  const commitData = {
    message,
    parent: parentCommit,
    timeStamp: new Date().toISOString(),
    files: stagedContent,
  };

  let strDta = JSON.stringify(commitData, null, 2); // serialize data
  let hash = hashFile(strDta);

  // save the commit as a file
  fs.writeFileSync(path.join(commitsPath, hash), strDta);

  // update head to point to the new commit
  fs.writeFileSync(headPath, hash);

  fs.writeFileSync(stagedPath, "");

  console.log("Your changes have been commited: " + hash);
}

function commitHistory() {
  let repoPath = path.join(process.cwd(), ".minigit");
  const commitsPath = path.join(repoPath, "commits");

  // read content in the commits folder
  const commitsDta = fs.readdirSync(commitsPath).forEach((file) => {
    const filedata = fs
      .readFileSync(path.join(commitsPath, file), "utf-8")
      .trim();
    const formatedDta = JSON.parse(filedata);
    if (formatedDta) {
      console.log(`Commit: ${file}`);
      console.log(`Date: ${formatedDta.timeStamp}`);
      console.log(`Message: ${formatedDta.message}`);
      console.log(`Files:\n $`);
      formatedDta?.files.forEach((item) => {
        console.log(`- - ${item}`);
      });
      console.log(
        "__________________________________________________________________________"
      );
    }
    // console.log(formatedDta);
  });
}

export { initRepo, stageFile, commitChanges, commitHistory };
