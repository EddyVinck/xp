interface IImageObject {
  [key: string]: string;
}

function importAll(req: __WebpackModuleApi.RequireContext) {
  let images: IImageObject = {};
  req.keys().map(item => {
    images[item.replace("./", "")] = req(item);
  });
  return images;
}

const images = importAll(require.context("../../img", false, /\.(png|jpe?g|svg)$/));

const getIconUrl = (iconName: string = "") => {
  let iconUrl = "";

  switch (iconName.toLowerCase()) {
    case "computer":
      iconUrl = images["computer.png"];
      break;
    case "control-panel":
      iconUrl = images["control-panel.png"];
      break;
    case "documents":
      iconUrl = images["documents.png"];
      break;
    case "favorite":
      iconUrl = images["favorite.png"];
      break;
    case "folder":
      iconUrl = images["folder-empty.png"];
      break;
    case "ie":
      iconUrl = images["ie.png"];
      break;
    case "info-balloon":
      iconUrl = images["info-balloon.png"];
      break;
    case "internet-explorer":
      iconUrl = images["ie.png"];
      break;
    case "log-off":
      iconUrl = images["log-off.png"];
      break;
    case "media-player":
      iconUrl = images["media-player.png"];
      break;
    case "messenger":
      iconUrl = images["messenger.png"];
      break;
    case "movies":
      iconUrl = images["movies.png"];
      break;
    case "music":
      iconUrl = images["music.png"];
      break;
    case "outlook":
      iconUrl = images["outlook-express.jpg"];
      break;
    case "paint":
      iconUrl = images["paint.png"];
      break;
    case "pictures":
      iconUrl = images["pictures.png"];
      break;
    case "run":
      iconUrl = images["run.png"];
      break;
    case "search":
      iconUrl = images["search"];
      break;
    case "song":
      iconUrl = images["song"];
      break;
    case "support":
      iconUrl = images["support-help"];
      break;
    case "trash":
      iconUrl = images["trash-filled.png"];
      break;
    case "trash-empty":
      iconUrl = images["trash.png"];
      break;
    case "video":
      iconUrl = images["video.png"];
      break;
    case "windows":
      iconUrl = images["windows.png"];
      break;
    case "arrow-back":
      iconUrl = images["xp-arrow-icon-previous.png"];
      break;
    case "arrow-next":
      iconUrl = images["xp-arrow-icon-next.png"];
      break;
    default:
      iconUrl = images["folder-empty.png"];
      break;
  }

  return iconUrl;
};

export default getIconUrl;
