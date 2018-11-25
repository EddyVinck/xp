import "./right-click";
import File from "./File";

// Add a few folders or files
if (Array.from(document.querySelectorAll(".wallpaper-grid > .cell")).length === 0) {
  const testFile = new File({ name: "My test file", type: "folder" });
  for (let index = 0; index <= 3; index++) {
    new File({ name: `My test file (${index})`, type: "folder" });
  }
}
