// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"../../../../../usr/lib/node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../../../../../usr/lib/node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"../../../../../usr/lib/node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"css/normalize.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../../../../../usr/lib/node_modules/parcel-bundler/src/builtins/css-loader.js"}],"css/style.scss":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"./normalize.css":"css/normalize.css","_css_loader":"../../../../../usr/lib/node_modules/parcel-bundler/src/builtins/css-loader.js"}],"js/utils/isChildElement.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function isChildElement(child, parent) {
  var node = child.parentNode;

  while (node != null) {
    if (node == parent) {
      return true;
    }

    node = node.parentNode;
  }

  return false;
}

var _default = isChildElement;
exports.default = _default;
},{}],"js/right-click.js":[function(require,module,exports) {
"use strict";

var _isChildElement = _interopRequireDefault(require("./utils/isChildElement"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rightClickMenu = document.querySelector(".right-click-menu"); // maybe do a pub sub or observable thing where you keep track of opened or active elements
// instead of putting listeners on every individual element
// that might get hard to maintain

var currentlyOpenedElements = [];
var currentlyActiveElements = [];
document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
  var x = e.pageX,
      y = e.pageY;
  handleRightClick(x, y);
}, false);
document.addEventListener("click", function (e) {
  if ((0, _isChildElement.default)(e.target, rightClickMenu)) {// handle any of the right click options if those are clicked
  } else {
    rightClickMenu.style.display = "none";
  }
});

function handleRightClick(x, y) {
  var rightClickMenu = document.querySelector(".right-click-menu");
  rightClickMenu.style.top = "".concat(y, "px");
  rightClickMenu.style.left = "".concat(x, "px");
  rightClickMenu.style.display = "block";
}
},{"./utils/isChildElement":"js/utils/isChildElement.js"}],"img/computer.png":[function(require,module,exports) {
module.exports = "/computer.ebf1c983.png";
},{}],"img/control-panel.png":[function(require,module,exports) {
module.exports = "/control-panel.5c513348.png";
},{}],"img/documents.png":[function(require,module,exports) {
module.exports = "/documents.66f0ba29.png";
},{}],"img/favorite.png":[function(require,module,exports) {
module.exports = "/favorite.cc71aca9.png";
},{}],"img/folder-empty.png":[function(require,module,exports) {
module.exports = "/folder-empty.e2daa8fc.png";
},{}],"img/ie.png":[function(require,module,exports) {
module.exports = "/ie.2da5219c.png";
},{}],"img/info-balloon.png":[function(require,module,exports) {
module.exports = "/info-balloon.0da3fa03.png";
},{}],"img/internet-explorer.png":[function(require,module,exports) {
module.exports = "/internet-explorer.3d204db0.png";
},{}],"img/log-off.png":[function(require,module,exports) {
module.exports = "/log-off.bb64b56c.png";
},{}],"img/media-player.png":[function(require,module,exports) {
module.exports = "/media-player.75f6f113.png";
},{}],"img/messenger.png":[function(require,module,exports) {
module.exports = "/messenger.d0fdd4ff.png";
},{}],"img/movies.png":[function(require,module,exports) {
module.exports = "/movies.3ce2d8bc.png";
},{}],"img/music.png":[function(require,module,exports) {
module.exports = "/music.b8c1f2aa.png";
},{}],"img/outlook-express.jpg":[function(require,module,exports) {
module.exports = "/outlook-express.b49f763b.jpg";
},{}],"img/paint.png":[function(require,module,exports) {
module.exports = "/paint.64345e01.png";
},{}],"img/pictures.png":[function(require,module,exports) {
module.exports = "/pictures.b22d1037.png";
},{}],"img/run.png":[function(require,module,exports) {
module.exports = "/run.e5d41ff2.png";
},{}],"img/search.png":[function(require,module,exports) {
module.exports = "/search.42b7d05d.png";
},{}],"img/song.png":[function(require,module,exports) {
module.exports = "/song.431a2232.png";
},{}],"img/support-help.png":[function(require,module,exports) {
module.exports = "/support-help.6ebaac0d.png";
},{}],"img/trash-filled.png":[function(require,module,exports) {
module.exports = "/trash-filled.6ba3b823.png";
},{}],"img/trash.png":[function(require,module,exports) {
module.exports = "/trash.be1686b2.png";
},{}],"img/video.png":[function(require,module,exports) {
module.exports = "/video.187f678d.png";
},{}],"img/windows.png":[function(require,module,exports) {
module.exports = "/windows.5fab38d1.png";
},{}],"img/windows_xp_icons_by_gothago229-d3iz9h1.zip":[function(require,module,exports) {
module.exports = "/windows_xp_icons_by_gothago229-d3iz9h1.5d7b50d0.zip";
},{}],"img/xp-arrow-icon-next.png":[function(require,module,exports) {
module.exports = "/xp-arrow-icon-next.771dd4f2.png";
},{}],"img/xp-arrow-icon-previous.png":[function(require,module,exports) {
module.exports = "/xp-arrow-icon-previous.e49c7a71.png";
},{}],"img/*.*":[function(require,module,exports) {
module.exports = {
  "computer": {
    "png": require("./computer.png")
  },
  "control-panel": {
    "png": require("./control-panel.png")
  },
  "documents": {
    "png": require("./documents.png")
  },
  "favorite": {
    "png": require("./favorite.png")
  },
  "folder-empty": {
    "png": require("./folder-empty.png")
  },
  "ie": {
    "png": require("./ie.png")
  },
  "info-balloon": {
    "png": require("./info-balloon.png")
  },
  "internet-explorer": {
    "png": require("./internet-explorer.png")
  },
  "log-off": {
    "png": require("./log-off.png")
  },
  "media-player": {
    "png": require("./media-player.png")
  },
  "messenger": {
    "png": require("./messenger.png")
  },
  "movies": {
    "png": require("./movies.png")
  },
  "music": {
    "png": require("./music.png")
  },
  "outlook-express": {
    "jpg": require("./outlook-express.jpg")
  },
  "paint": {
    "png": require("./paint.png")
  },
  "pictures": {
    "png": require("./pictures.png")
  },
  "run": {
    "png": require("./run.png")
  },
  "search": {
    "png": require("./search.png")
  },
  "song": {
    "png": require("./song.png")
  },
  "support-help": {
    "png": require("./support-help.png")
  },
  "trash-filled": {
    "png": require("./trash-filled.png")
  },
  "trash": {
    "png": require("./trash.png")
  },
  "video": {
    "png": require("./video.png")
  },
  "windows": {
    "png": require("./windows.png")
  },
  "windows_xp_icons_by_gothago229-d3iz9h1": {
    "zip": require("./windows_xp_icons_by_gothago229-d3iz9h1.zip")
  },
  "xp-arrow-icon-next": {
    "png": require("./xp-arrow-icon-next.png")
  },
  "xp-arrow-icon-previous": {
    "png": require("./xp-arrow-icon-previous.png")
  }
};
},{"./computer.png":"img/computer.png","./control-panel.png":"img/control-panel.png","./documents.png":"img/documents.png","./favorite.png":"img/favorite.png","./folder-empty.png":"img/folder-empty.png","./ie.png":"img/ie.png","./info-balloon.png":"img/info-balloon.png","./internet-explorer.png":"img/internet-explorer.png","./log-off.png":"img/log-off.png","./media-player.png":"img/media-player.png","./messenger.png":"img/messenger.png","./movies.png":"img/movies.png","./music.png":"img/music.png","./outlook-express.jpg":"img/outlook-express.jpg","./paint.png":"img/paint.png","./pictures.png":"img/pictures.png","./run.png":"img/run.png","./search.png":"img/search.png","./song.png":"img/song.png","./support-help.png":"img/support-help.png","./trash-filled.png":"img/trash-filled.png","./trash.png":"img/trash.png","./video.png":"img/video.png","./windows.png":"img/windows.png","./windows_xp_icons_by_gothago229-d3iz9h1.zip":"img/windows_xp_icons_by_gothago229-d3iz9h1.zip","./xp-arrow-icon-next.png":"img/xp-arrow-icon-next.png","./xp-arrow-icon-previous.png":"img/xp-arrow-icon-previous.png"}],"js/File.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ = _interopRequireDefault(require("../img/*.*"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var wallpaperGrid = document.querySelector(".wallpaper-grid");

var File =
/*#__PURE__*/
function () {
  function File() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$name = _ref.name,
        name = _ref$name === void 0 ? "Unnamed" : _ref$name,
        _ref$type = _ref.type,
        type = _ref$type === void 0 ? "folder" : _ref$type,
        _ref$parentFolder = _ref.parentFolder,
        parentFolder = _ref$parentFolder === void 0 ? wallpaperGrid : _ref$parentFolder,
        _ref$innerFolders = _ref.innerFolders,
        innerFolders = _ref$innerFolders === void 0 ? [] : _ref$innerFolders,
        _ref$innerFiles = _ref.innerFiles,
        innerFiles = _ref$innerFiles === void 0 ? [] : _ref$innerFiles;

    _classCallCheck(this, File);

    this.name = name;
    this.type = type;
    this.parentFolder = parentFolder;
    this.innerFolders = innerFolders;
    this.innerFiles = innerFiles;
    this.associatedDesktopElement = null;
    this.createNecessaryElements();
    this.remove = this.remove.bind(this);
  }

  _createClass(File, [{
    key: "createNecessaryElements",
    value: function createNecessaryElements() {
      // create the file on the desktop or folder
      this.associatedDesktopElement = createDesktopElement(this.name, this.type);
      this.parentFolder.appendChild(this.associatedDesktopElement); // create the taskbar element
      // create the opened window
    }
  }, {
    key: "remove",
    value: function remove() {
      this.parentFolder.removeChild(this.associatedDesktopElement);
    }
  }]);

  return File;
}(); // Returns a desktop cell

/*
  <div class="cell">
    <img src="img/folder_empty-3.png" alt="">
    <span class="cell-name">
      Projects
    </span>
  </div>
*/


function createDesktopElement(fileName, fileType) {
  var desktopElement = document.createElement("div");
  desktopElement.classList.add("cell");
  var img = document.createElement("img");
  img.src = getFileIconUrl(fileType);
  img.alt = fileType;
  var cellName = document.createElement("span");
  cellName.classList.add("cell-name");
  cellName.innerText = fileName;
  desktopElement.appendChild(img);
  desktopElement.appendChild(cellName);
  return desktopElement;
}

function getFileIconUrl(fileIconName) {
  var fileIconUrl = "";

  switch (fileIconName) {
    case "folder":
      fileIconUrl += Object.values(_.default["folder-empty"])[0];
      break;

    default:
      fileIconUrl += Object.values(_.default["folder-empty"])[0];
      break;
  }

  return fileIconUrl;
}

var _default = File;
exports.default = _default;
},{"../img/*.*":"img/*.*"}],"js/folder.js":[function(require,module,exports) {
"use strict";

var _isChildElement = _interopRequireDefault(require("./utils/isChildElement"));

var _File = _interopRequireDefault(require("./File"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Programatically add a few folders
if (Array.from(document.querySelectorAll(".wallpaper-grid > .cell")).length === 0) {
  var testFile = new _File.default({
    name: "My test file",
    type: "folder"
  });
  var arr = [];

  for (var index = 0; index <= 20; index++) {
    arr.push(new _File.default({
      name: "My test file".concat(index),
      type: "folder"
    }));
  }
}

var folder = document.querySelector(".folder-opened");
var topBar = folder.querySelector(".top-bar");
var isMaximize = false;
var originalOffsetLeft;
var originalOffsetTop;
folder.addEventListener("mousedown", function (e) {
  var isClickingOnTopBar = (0, _isChildElement.default)(e.target, topBar) || e.target === topBar;

  if (isClickingOnTopBar && !isMaximize) {
    var moveAt = function moveAt(x, y) {
      folder.style.left = x - shiftX + "px";
      folder.style.top = y - shiftY + "px";
    };

    var onMouseMove = function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
    }; // Get the current position of the cursor relative to the folder


    var shiftX = e.clientX - folder.getBoundingClientRect().left;
    var shiftY = e.clientY - folder.getBoundingClientRect().top;
    folder.style.position = "absolute";
    folder.style.zIndex = 1000; // Append the folder to the body so the absolute positioning is relative to the body

    document.body.append(folder);
    document.addEventListener("mousemove", onMouseMove); // Clear event listeners when the element is released

    folder.onmouseup = function () {
      document.removeEventListener("mousemove", onMouseMove);
      folder.mouseup = null;
    };
  } // Maximize


  var toggleMaximizeButton = document.querySelector(".top-bar-button.maximize");

  if (e.target == toggleMaximizeButton) {
    if (isMaximize) {
      // go small screen
      folder.style.width = "";
      folder.style.height = "";
      folder.style.left = originalOffsetLeft + "px";
      folder.style.top = originalOffsetTop + "px";
      isMaximize = false;
    } else {
      // save the original position
      originalOffsetLeft = folder.offsetLeft;
      originalOffsetTop = folder.offsetTop; // go full screen

      folder.style.left = "0px";
      folder.style.top = "0px";
      folder.style.width = "100%";
      folder.style.height = "calc(100vh - 40px)";
      isMaximize = true;
    }
  } // Add to taskbar


  var taskbar = document.querySelector("ul.taskbar"); // Minimize

  var minimizeButton = document.querySelector(".top-bar-button.minimize");

  if (e.target == minimizeButton) {
    console.log("minimize!");
  } // The browser has its own drag and drop API, this resolves conflicts with that api


  folder.ondragstart = function () {
    return false;
  };
});

function makeListItem(child) {
  var li = document.createElement("li");
  li.appendChild(child);
  return li;
}
/*
 When a folder should be minimized it can be added as a flex item in the bottom bar
 so use appendchild so the element isn't cloned
 
 Add overruling styles that get rid of the absolute positioning for folders 
*/
},{"./utils/isChildElement":"js/utils/isChildElement.js","./File":"js/File.js"}],"index.js":[function(require,module,exports) {
"use strict";

require("./css/style.scss");

require("./js/right-click");

require("./js/folder");

if (module.hot) {
  module.hot.dispose(function () {// module is about to be replaced
  });
  module.hot.accept(function () {
    // module or one of its dependencies was just updated
    console.log("HMR initialized!");
  });
}
},{"./css/style.scss":"css/style.scss","./js/right-click":"js/right-click.js","./js/folder":"js/folder.js"}],"../../../../../usr/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "45331" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../../../../../usr/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/windowsxp.e31bb0bc.map