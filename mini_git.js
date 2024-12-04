import fs from "fs";
import path from "path";
import crypto from "crypto";

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

export { initRepo, stageFile };
