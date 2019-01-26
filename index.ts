import './css/style.scss';
import './js/app';

interface IModule {
  hot: {
    dispose: Function;
  };
}

if (module.hot) {
  module.hot.dispose(function() {
    // module is about to be replaced
  });

  module.hot.accept(function() {
    // module or one of its dependencies was just updated
    console.log('HMR initialized!');
  });
}
