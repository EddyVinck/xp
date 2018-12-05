import "./startup";
import "./login-screen";
import "./right-click";
import "./clock";
import File from "./File";

const allFiles = [];

// Add a few folders or files
if (Array.from(document.querySelectorAll(".wallpaper-grid > .cell")).length === 0) {
  allFiles.push(new File({ name: "My test file", type: "folder" }));
  for (let index = 0; index <= 3; index++) {
    allFiles.push(new File({ name: `My test file (${index})`, type: "folder" }));
  }
}

// Listener that sets all windows inactive
document.addEventListener("change-active-window", function(event) {
  allFiles.forEach(file => {
    file.setActive(false);
  });
});
