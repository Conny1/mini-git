# mini-git

`mini-git` is a simple command-line version control system inspired by Git. This tool allows you to initialize a repository, stage files, commit changes, view commit logs, and manage branches, all via simple command-line commands.

---

## Features

- Initialize a new repository
- Stage files for commit
- Commit staged files with a custom message
- View commit history/logs
- Create and merge branches
- Identify merge conflicts

---

## Installation

To use `mini-git`, follow these steps:

1. Clone the repository or download the code:

   ```bash
   git clone <repository-url>
   ```

2. Install the required dependencies using npm or yarn:

   ```bash
   npm install
   ```

3. After installation, you can run the commands as described below.

---

## Commands

### `init`

Initialize a new Git-like repository.

```bash
node index.js init
```

This command sets up the basic structure of a repository.

---

### `add <file>`

Stage a file for commit.

```bash
node index.js add <file>
```

Replace `<file>` with the file path you want to stage. For example:

```bash
node index.js add myfile.js
```

---

### `commit <message>`

Commit the staged files with a message.

```bash
node index.js commit <message>
```

Replace `<message>` with your commit message. For example:

```bash
node index.js commit "Initial commit"
```

---

### `logs`

View the commit history/logs.

```bash
node index.js logs
```

This command displays the history of commits.

---

### `branch <name>`

Create a new branch.

```bash
node index.js branch <name>
```

Replace `<name>` with the name of the branch you want to create. For example:

```bash
node index.js branch dev
```

---

### `checkout <name>`

Switch to another branch.

```bash
node index.js checkout <name>
```

Replace `<name>` with the branch you want to switch to. For example:

```bash
node index.js checkout main
```

---

### `merge <name>`

Merge the target branch into the current branch.

```bash
node index.js merge <name>
```

Replace `<name>` with the branch you want to merge into the current branch. For example:

```bash
node index.js merge dev
```

---

## Usage Example

Here’s an example workflow:

1. Initialize the repository:

   ```bash
   node index.js init
   ```

2. Create a new branch:

   ```bash
   node index.js branch feature-xyz
   ```

3. Stage a file for commit:

   ```bash
   node index.js add myfile.js
   ```

4. Commit the changes:

   ```bash
   node index.js commit "Added new feature"
   ```

5. Switch back to the main branch:

   ```bash
   node index.js checkout main
   ```

6. Merge the feature branch into the main branch:
   ```bash
   node index.js merge feature-xyz
   ```

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request

---

## License

MIT License. See the LICENSE file for details.
