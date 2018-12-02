import isChildElement from "./utils/isChildElement";

const rightClickMenu: HTMLElement = document.querySelector(".right-click-menu");

document.addEventListener(
  "contextmenu",
  e => {
    e.preventDefault();
    const { pageX: x, pageY: y } = e;
    handleRightClick(x, y);
  },
  false
);

document.addEventListener("click", (e: MouseEvent) => {
  if (isChildElement(e.target, rightClickMenu)) {
    // handle any of the right click options if those are clicked
  } else {
    rightClickMenu.style.display = "none";
  }
});

function handleRightClick(x, y) {
  const rightClickMenu: HTMLElement = document.querySelector(".right-click-menu");

  rightClickMenu.style.top = `${y}px`;
  rightClickMenu.style.left = `${x}px`;
  rightClickMenu.style.display = "block";
}
