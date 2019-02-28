/* eslint-disable @typescript-eslint/no-var-requires */
const computer = require('../../img/computer.png');
const folderEmpty = require('../../img/folder-empty.png');
const searchIcon = require('../../img/search.png');
const arrowNext = require('../../img/xp-arrow-icon-next.png');
const arrowPrevious = require('../../img/xp-arrow-icon-previous.png');
const webBrowser = require('../../img/ie.png');
/* eslint-enable */

const getIconUrl = (iconName: string = ''): string => {
  let iconUrl = '';

  switch (iconName.toLowerCase()) {
    case 'computer':
      iconUrl = computer;
      break;
    case 'search':
      iconUrl = searchIcon;
      break;
    case 'arrow-back':
      iconUrl = arrowPrevious;
      break;
    case 'arrow-next':
      iconUrl = arrowNext;
      break;
    case 'webbrowser':
      iconUrl = webBrowser;
      break;
    default:
      iconUrl = folderEmpty;
      break;
  }

  return iconUrl;
};

export default getIconUrl;
