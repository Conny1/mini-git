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
  if (!checkIgnoredFiles(filepath)) {
    return;
  }

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
  const brachName = parentCommit.split("/")[parentCommit.split("/").length - 1];
  updateBranch(brachName, hash);

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

function updateBranch(name, commitHash) {
  const repoPath = path.join(process.cwd(), ".minigit");
  const branchPath = path.join(repoPath, "refs", "branch");
  let serialized;
  if (fs.existsSync(branchPath)) {
    // check if there is existing data in the braches file
    const brachData = fs.readFileSync(branchPath, "utf-8").trim();
    if (brachData) {
      const formatedDta = JSON.parse(brachData);
      (formatedDta[name] = commitHash),
        (serialized = JSON.stringify(formatedDta, null, 2));
    } else {
      serialized = JSON.stringify(
        {
          [name]: commitHash,
        },
        null,
        2
      );
    }
  } else {
    serialized = JSON.stringify(
      {
        [name]: commitHash,
      },
      null,
      2
    );
  }
  fs.writeFileSync(branchPath, serialized);
}

function createBranch(name) {
  const repoPath = path.join(process.cwd(), ".minigit");
  const branchPath = path.join(repoPath, "refs", "branch");
  let serialized;
  if (fs.existsSync(branchPath)) {
    // check if there is existing data in the braches file
    const brachData = fs.readFileSync(branchPath, "utf-8").trim();
    if (brachData) {
      const formatedDta = JSON.parse(brachData);

      if (formatedDta[name] || formatedDta[name] === "") {
        console.log("Branch with that name exists");
        return;
      }
      (formatedDta[name] = ""),
        (serialized = JSON.stringify(formatedDta, null, 2));
    } else {
      serialized = JSON.stringify(
        {
          [name]: "",
        },
        null,
        2
      );
    }
  } else {
    serialized = JSON.stringify(
      {
        [name]: "",
      },
      null,
      2
    );
  }
  fs.writeFileSync(branchPath, serialized);
  console.log(`Branch ${name} has been created.`);
}

const brachCheckOut = (name) => {
  const repoPath = path.join(process.cwd(), ".minigit");
  const branchPath = path.join(repoPath, "refs", "branch");
  const headPath = path.join(repoPath, "HEAD");
  if (fs.existsSync(branchPath)) {
    // check if there is existing data in the braches file
    const brachData = fs.readFileSync(branchPath, "utf-8").trim();
    if (brachData) {
      const formatedDta = JSON.parse(brachData);

      if (formatedDta[name] === undefined || formatedDta[name] === null) {
        console.log("Branch not found");
        return;
      } else if (
        name == fs.readFileSync(headPath, "utf-8").trim().split("/").pop()
      ) {
        console.log("Your already in provided branch: ", name);
        return;
      } else {
        fs.writeFileSync(headPath, `refs/head/${name}`);
        console.log("current branch switched to: " + name);
      }
    }
  } else {
    console.log("initialize your repo");
  }
};

function mergeBranches(targetBranch) {
  const repoPath = path.join(process.cwd(), ".minigit");
  const branchPath = path.join(repoPath, "refs", "branch");
  const headPath = path.join(repoPath, "HEAD");

  if (!fs.existsSync(branchPath)) {
    console.log("No branches found. Initialize your repository.");
    return;
  }
  const branches = JSON.parse(fs.readFileSync(branchPath, "utf-8").trim());
  const currentBranch = fs.readFileSync(headPath, "utf-8").split("/").pop();
  if (
    branches[currentBranch] === undefined ||
    branches[currentBranch] === null ||
    branches[currentBranch] === ""
  ) {
    console.log(`Current branch '${currentBranch}' has no commits.`);
    return;
  }

  if (branches[targetBranch] === undefined || branches[targetBranch] === null) {
    console.log(`Target branch '${targetBranch}' does not exist.`);
    return;
  }

  const currentCommitHash = branches[currentBranch];
  const targetCommitHash = branches[targetBranch];

  const commitPath = path.join(repoPath, "commits");

  const currentCommit = JSON.parse(
    fs.readFileSync(path.join(commitPath, currentCommitHash), "utf-8")
  );
  const targetCommit = JSON.parse(
    fs.readFileSync(path.join(commitPath, targetCommitHash), "utf-8")
  );

  let mergedFiles = {};
  let conflictExists = false;
  // merge the commits
  currentCommit.files.forEach((line) => {
    if (line) {
      const [hash, filePath] = line.split(" ");
      if (filePath !== "undefined") {
        mergedFiles[filePath] = { hash, branch: currentBranch };
      }
    }
  });

  targetCommit.files.forEach((line) => {
    if (line) {
      const [hash, filePath] = line.split(" ");
      if (mergedFiles[filePath] && mergedFiles[filePath].hash !== hash) {
        conflictExists = true;
        console.log(`Conflict detected in file: ${filePath}`);
      } else {
        if (filePath !== "undefined") {
          mergedFiles[filePath] = { hash, branch: targetBranch };
        }
      }
    }
  });

  if (conflictExists) {
    console.log("Merge conflicts detected. Resolve conflicts manually.");
    return;
  }

  // Create a new commit for the merge
  const mergedFilesList = Object.entries(mergedFiles).map(
    ([filePath, { hash }]) => `${hash} ${filePath}`
  );
  const mergeCommit = {
    message: `Merge branch '${targetBranch}' into '${currentBranch}'`,
    parent: [currentCommitHash, targetCommitHash],
    timeStamp: new Date().toISOString(),
    files: mergedFilesList,
  };

  const mergeCommitHash = hashFile(JSON.stringify(mergeCommit, null, 2));
  fs.writeFileSync(
    path.join(commitPath, mergeCommitHash),
    JSON.stringify(mergeCommit, null, 2)
  );

  // Update current branch
  branches[currentBranch] = mergeCommitHash;
  fs.writeFileSync(branchPath, JSON.stringify(branches, null, 2));

  console.log(`Merged branch '${targetBranch}' into '${currentBranch}'.`);
  console.log(`New commit: ${mergeCommitHash}`);
}

function checkIgnoredFiles(filepath) {
  const repoPath = path.join(process.cwd(), ".minigit");
  if (!fs.existsSync(repoPath)) {
    console.log("Repo not Initialized");
    return false;
  }
  const ignorePath = path.join(process.cwd(), ".gitignore");

  const contents = fs.readFileSync(ignorePath, "utf-8").split("\n");
  for (let str of contents) {
    if (str.includes(filepath)) {
      console.log("file ignored");
      return false;
    }
  }
  return true;
}

export {
  initRepo,
  stageFile,
  commitChanges,
  commitHistory,
  createBranch,
  brachCheckOut,
  mergeBranches,
};
