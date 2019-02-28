import './startup';
import './login-screen';
import './right-click';
import './clock';
import File from './File';
import WebBrowser from './WebBrowser';

const allFiles: (File | WebBrowser)[] = [];

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

// Listener that sets all windows inactive
document.addEventListener('change-active-window', function() {
  allFiles.forEach((file) => {
    file.setActive(false);
  });
});

export default allFiles;
