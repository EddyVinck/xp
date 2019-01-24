import computer from '../../img/computer.png';
import folderEmpty from '../../img/folder-empty.png';
import searchIcon from '../../img/search.png';
import arrowNext from '../../img/xp-arrow-icon-next.png';
import arrowPrevious from '../../img/xp-arrow-icon-previous.png';

const getIconUrl = (iconName: string = '') => {
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
    default:
      iconUrl = folderEmpty;
      break;
  }

  return iconUrl;
};

export default getIconUrl;
