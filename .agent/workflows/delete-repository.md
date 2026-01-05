---
description: How to delete a GitHub repository or local project
---

# How to Delete a Repository

## 1. Deleting a GitHub Repository (Remote)
**Warning: This action is permanent and cannot be undone.**

1. Navigate to the repository page on GitHub (e.g., `https://github.com/Whitedevil2015/SEARCHED_REPO_NAME`).
2. Click on the **Settings** tab (usually the last tab on the right).
3. Scroll all the way down to the **Danger Zone** section.
4. Click the **Delete this repository** button.
5. A confirmation modal will appear.
6. Type the full name of the repository (e.g., `Whitedevil2015/repo-name`) to confirm.
7. Click **I understand the consequences, delete this repository**.

## 2. Deleting a Local Repository (Filesystem)
If you just want to remove the project from your computer:

1. Open your terminal.
2. Navigate to the parent directory of the project.
3. Run the following command (replace `repo-folder` with your folder name):
   ```bash
   rm -rf repo-folder
   ```
   *Or manually delete the folder using Finder.*

## 3. Removing Git History Only (Keep Files)
If you want to keep the files but remove the "Git" tracking (make it a normal folder):

1. Open a terminal in your project folder.
2. Run:
   ```bash
   rm -rf .git
   ```
