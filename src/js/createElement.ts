import { IFileElement } from './types/app';
import getIconUrl from './utils/getIconUrl';
import { el } from 'redom';

function createTaskbarElement(desktopElement: IFileElement): IFileElement {
  const li: IFileElement = document.createElement('li');
  li.appendChild(desktopElement);
  return li;
}

/** Returns a desktop cell element
  <div class="cell">

    <img src="img/folder_empty-3.png" alt="">

    <span class="cell-name">
      Projects
    </span>
    
  </div>
*/
function createDesktopElement(fileName: string, fileType: string): IFileElement {
  const desktopElement: IFileElement = document.createElement('div');
  desktopElement.classList.add('cell');

  const img = document.createElement('img');
  img.src = getIconUrl(fileType);
  img.alt = fileType;

  const cellName = document.createElement('span');
  cellName.classList.add('cell-name');
  cellName.innerText = fileName;

  desktopElement.appendChild(img);
  desktopElement.appendChild(cellName);

  return desktopElement;
}

// Creates and returns the window HTML element
function createWindowElement(fileName: string, fileType: string): HTMLElement {
  const windowElement: HTMLElement = el(
    '.window.folder-window',
    el(
      '.folder-header',
      el(
        '.top-bar',
        el(
          '.folder-label',
          el('img', { src: getIconUrl(fileType), alt: fileName }),
          el('span', fileName)
        ),
        el(
          '.top-bar-controls',
          el('.top-bar-button.minimize'),
          el('.top-bar-button.maximize'),
          el('.top-bar-button.close')
        )
      ),
      el(
        '.menu-bar',
        el('.menu-top'),
        el(
          '.menu-bottom',
          el(
            'ul',
            el(
              'li',
              el('img', { src: getIconUrl('arrow-back'), alt: 'back icon' }),
              el('span', 'Back')
            ),
            el('li', el('img', { src: getIconUrl('arrow-next'), alt: 'next icon' }))
          ),
          el(
            'ul',
            el(
              'li',
              el('img', { src: getIconUrl('search'), alt: 'Search icon' }),
              el('span', 'Search')
            )
          )
        ),
        el(
          '.address-bar',
          el('span', 'Address'),
          el(
            '.address-input-wrapper',
            el(
              '.address-input-icon',
              el('img', { src: getIconUrl(fileType), alt: fileType }),
              el('input.address-input', {
                type: 'text',
                value: 'C:\\Desktop\\Folder Name',
                placeholder: 'C:\\Desktop\\Folder Name',
              })
            )
          )
        )
      )
    ),
    el('.folder-content', el('.file-grid'))
  );

  return windowElement;
}

export { createTaskbarElement, createDesktopElement, createWindowElement };
