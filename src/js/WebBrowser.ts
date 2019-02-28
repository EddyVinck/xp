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
    addSite(viewName: string, viewDetails: Website) {
      // Add a site to Sites._sites
      console.log(viewName, viewDetails);

      // TODO: validate markup
      (this._sites as WebsiteKeyValueStore)[viewName] = viewDetails;
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

  private addBrowsingFunctionalityToWindow(): void {
    const form = this.windowElement.querySelector('.address-input-wrapper form') as HTMLFormElement;
    (form.querySelector('input.address-input') as HTMLInputElement).value = 'eddyvinck.com';
    form.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      const url = ((e.target as HTMLFormElement).elements.item(0) as HTMLInputElement).value;
      this.go(url);
    });
  }

  //
  public go = (viewName: string) => {
    console.log(`Trying to visit ${viewName}`);
    const iframe = this.iframe;
    const body = (iframe.contentDocument as Document).body;
    const website = WebBrowser.Sites.getSite(viewName);
    const tempDiv = document.createElement('div');
    let htmlString: string;
    if (website) {
      const { html } = website;

      if (html instanceof HTMLElement) {
        tempDiv.appendChild(html);
      } else {
        // string support
      }

      htmlString = tempDiv.innerHTML;
    } else {
      tempDiv.appendChild(WebBrowser.Sites._sites[404].html);
    }

    htmlString = tempDiv.innerHTML;
    body.innerHTML = htmlString;
    // look for viewName in sites
    // if found
    // fetch the viewDetails
    //
    // else
    // show 404
  };
}

export default WebBrowser;
