import './startup';
import './login-screen';
import './right-click';
import './clock';
import File from './File';
import WebBrowser from './WebBrowser';

const allFiles: File[] = [];

const website = document.createElement('div');
const css = `
  body {
    background: #f0edff;
  }
  h1 {
    font-family: sans-serif;
    color: #0d083a;
  }
`;
website.innerHTML = `
<h1>Welcome to www.eddyvinck.com</h1>
<p>This website is super cool.</p>
<img src="https://i.imgur.com/g3D5jNzg.jpg" alt="cat photo" style="height: 140px;" />`;

const aboutDotCom = {
  css: `
  body {
    background: #fafafa;
    font-family: serif;
  }
  h2 {
    background-color: yellow;
  }
  a {
    color: #0000ff;
    font-weight: bold;
  }
`,
  html: document.createElement('div'),
};
aboutDotCom.html.innerHTML = `
<h1>About this project</h1>
<p>
  This is a side project created by Eddy Vinck.
</p>
<p>
  You can find the repository <a href="https://github.com/eddyvinck/xp" target="_blank">here.</a>
</p>
<marquee>Marquee tags need to come back!</marquee>
<h2>Work in progress</h2>
<p>This project is still far from being finished.</p>
`;

WebBrowser.Sites.addSite('eddyvinck.com', { css, html: website });
WebBrowser.Sites.addSite('about.com', aboutDotCom);

// Add a few folders or files
allFiles.push(new File({ name: 'My test file', type: 'folder' }));

for (let index = 0; index <= 3; index++) {
  const newFile = new File({ name: `My test file (${index})`, type: 'folder' });
  allFiles.push(newFile);

  if (index === 3) {
    const innerFile = new File({ name: 'inner file', type: 'folder' });
    newFile.innerFiles.push(innerFile);
    allFiles.push(innerFile);
  }
}

allFiles.push(new WebBrowser({ name: 'www.eddyvinck.com' }));
allFiles.push(new WebBrowser({ name: 'about.com' }));

// Listener that sets all windows inactive
document.addEventListener('change-active-window', function() {
  allFiles.forEach((file) => {
    file.setActive(false);
  });
});

export default allFiles;
