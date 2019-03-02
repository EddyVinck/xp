import File from './File';
import { createBrowserWindowElement } from './createElement';
import { el } from 'redom';

interface Website {
  css: string;
  html: HTMLElement; // TODO: Add string support
}
interface WebsiteKeyValueStore {
  [key: string]: Website;
}

class WebBrowser extends File {
  private iframe: HTMLIFrameElement;
  static fourOhFour: Website = { css: '', html: el('h1', '404') };

  // Access WebBrowser.Sites['www.google.com']
  static Sites = {
    _sites: {
      '404': WebBrowser.fourOhFour,
    },
    /**
     * @todo validate markup
     * @todo add link functionaility for real URLs and WebBrowser links
     */
    addSite(viewName: string, viewDetails: Website) {
      // Add a site to Sites._sites
      console.log(viewName, viewDetails);

      (this._sites as WebsiteKeyValueStore)[viewName.replace('www.', '')] = viewDetails;
    },
    getSite(viewName: string) {
      return (this._sites as WebsiteKeyValueStore)[viewName];
    },
  };

  constructor({ name = 'Unnamed', type = 'webbrowser' } = {}) {
    super({ type, name });
    this.windowElement = this.createInteractableWindowElement(createBrowserWindowElement); // make this configurable with a setter on the prototype
    this.addBrowsingFunctionalityToWindow();
    this.iframe = this.windowElement.querySelector('iframe') as HTMLIFrameElement;
  }

  public showWindow() {
    super.showWindow(() => {
      this.go(this.name);
    });
  }

  private addBrowsingFunctionalityToWindow(): void {
    const form = this.windowElement.querySelector('.address-input-wrapper form') as HTMLFormElement;
    (form.querySelector('input.address-input') as HTMLInputElement).value = this.name;
    form.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      const url = ((e.target as HTMLFormElement).elements.item(
        0
      ) as HTMLInputElement).value.replace('www.', '');
      this.go(url);
    });
  }

  /** @todo: change the URL in the window object when browsing */
  public go = (viewName: string) => {
    console.log(`Trying to visit ${viewName}`);
    const iframe = this.iframe;
    const body = (iframe.contentDocument as Document).body;
    const head = (iframe.contentDocument as Document).head;
    const styleTag = document.createElement('style');
    const website = WebBrowser.Sites.getSite(viewName.replace('www.', ''));
    const tempDiv = document.createElement('div');
    let htmlString: string;

    // clean the iframe first
    body.innerHTML = '';
    head.innerHTML = '';

    if (website) {
      const { html, css } = website;
      styleTag.innerText = css;

      if (html instanceof HTMLElement) {
        tempDiv.appendChild(html);
      } else {
        // string support
      }

      htmlString = tempDiv.innerHTML;
    } else {
      tempDiv.appendChild(WebBrowser.Sites._sites[404].html);
    }

    head.appendChild(styleTag);
    htmlString = tempDiv.innerHTML;
    body.innerHTML = htmlString;
  };
}

export default WebBrowser;
