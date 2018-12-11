import "./startup";
import "./login-screen";
import "./right-click";
import "./clock";
import File from "./File";

const allFiles: File[] = [];

// Add a few folders or files
if (Array.from(document.querySelectorAll(".wallpaper-grid > .cell")).length === 0) {
  allFiles.push(new File({ name: "My test file", type: "folder" }));
  for (let index = 0; index <= 3; index++) {
    const newFile = new File({ name: `My test file (${index})`, type: "folder" });
    allFiles.push(newFile);

    if (index === 3) {
      const innerFile = new File({ name: "inner file", type: "folder" });
      newFile.innerFiles.push(innerFile);
      allFiles.push(innerFile);
    }
  }
}

console.log(allFiles);

// Listener that sets all windows inactive
document.addEventListener("change-active-window", function(event) {
  allFiles.forEach(file => {
    file.setActive(false);
  });
});
