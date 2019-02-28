import File from './File';

class WebBrowser extends File {
  // Access WebBrowser.Sites['www.google.com']
  static Sites = {
    _sites: {
      viewName: { viewDetails: true },
    },
    add() {
      // Add a site to Sites._sites
    },
  };

  constructor({ name = 'Unnamed', type = 'webbrowser', parentFile = undefined } = {}) {
    super();
  }

  //
  public go = (viewName: string) => {
    console.log(viewName);

    // look for viewName in sites
    // if found
    // fetch the viewDetails
    //
    // else
    // throw error
  };
}

export default WebBrowser;
