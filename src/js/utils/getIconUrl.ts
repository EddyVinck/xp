// const imageUrls = require("../../img/*.*");

// function importAll(r) {
//   return r.keys().map(r);
// }

// const images = importAll(require.context("../../img/", false, /\.(png|jpe?g|svg)$/));
// import getIconUrl from "./getIconUrl";

// console.log("images", images);

// A more convenient way to fetch the url of an icon
// const getIconUrl = (iconName: string = "") => {
//   let iconUrl = "";
//   switch (iconName.toLowerCase()) {
//     case "computer":
//       iconUrl += Object.values(imageUrls["computer"])[0];
//       break;
//     case "control-panel":
//       iconUrl += Object.values(imageUrls["control-panel"])[0];
//       break;
//     case "documents":
//       iconUrl += Object.values(imageUrls["documents"])[0];
//       break;
//     case "favorite":
//       iconUrl += Object.values(imageUrls["favorite"])[0];
//       break;
//     case "folder":
//       iconUrl += Object.values(imageUrls["folder-empty"])[0];
//       break;
//     case "ie":
//       iconUrl += Object.values(imageUrls["ie"])[0];
//       break;
//     case "info-balloon":
//       iconUrl += Object.values(imageUrls["info-balloon"])[0];
//       break;
//     case "internet-explorer":
//       iconUrl += Object.values(imageUrls["ie"])[0];
//       break;
//     case "log-off":
//       iconUrl += Object.values(imageUrls["log-off"])[0];
//       break;
//     case "media-player":
//       iconUrl += Object.values(imageUrls["media-player"])[0];
//       break;
//     case "messenger":
//       iconUrl += Object.values(imageUrls["messenger"])[0];
//       break;
//     case "movies":
//       iconUrl += Object.values(imageUrls["movies"])[0];
//       break;
//     case "music":
//       iconUrl += Object.values(imageUrls["music"])[0];
//       break;
//     case "outlook":
//       iconUrl += Object.values(imageUrls["outlook-express"])[0];
//       break;
//     case "paint":
//       iconUrl += Object.values(imageUrls["paint"])[0];
//       break;
//     case "pictures":
//       iconUrl += Object.values(imageUrls["pictures"])[0];
//       break;
//     case "run":
//       iconUrl += Object.values(imageUrls["run"])[0];
//       break;
//     case "search":
//       iconUrl += Object.values(imageUrls["search"])[0];
//       break;
//     case "song":
//       iconUrl += Object.values(imageUrls["song"])[0];
//       break;
//     case "support":
//       iconUrl += Object.values(imageUrls["support-help"])[0];
//       break;
//     case "trash":
//       iconUrl += Object.values(imageUrls["trash-filled"])[0];
//       break;
//     case "trash-empty":
//       iconUrl += Object.values(imageUrls["trash"])[0];
//       break;
//     case "video":
//       iconUrl += Object.values(imageUrls["video"])[0];
//       break;
//     case "windows":
//       iconUrl += Object.values(imageUrls["windows"])[0];
//       break;
//     case "arrow-back":
//       iconUrl += Object.values(imageUrls["xp-arrow-icon-previous"])[0];
//       break;
//     case "arrow-next":
//       iconUrl += Object.values(imageUrls["xp-arrow-icon-next"])[0];
//       break;
//     default:
//       iconUrl += Object.values(imageUrls["folder-empty"])[0];
//       break;
//   }

//   return iconUrl;
// };

const getIconUrl = () => "";

export default getIconUrl;
