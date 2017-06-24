import Diagram from 'diagram-js';

// overridden diagram-js modules
import overriddenModules from './features/overridden';

// gitter modules
import autoConnect from './features/auto-connect';
import config from './config';
import coreModule from './core';
import cropping from './features/cropping';
import gitterContextPad from './features/context-pad';
import gitterMovePreview from './features/move-preview';
import gitterPalette from './features/palette';
import helpOverlay from './features/help-overlay';
import keyboardBindings from './features/keyboard-bindings';
import listenerAnimation from './features/listener-animation';
import modeling from './features/modeling';
import notifications from './features/notifications';
import ordering from './features/ordering';
import propertiesPanel from './features/properties-panel';
import gitterRules from './features/rules';
import sequences from './features/sequences';

class Gitter extends Diagram {
  constructor(options) {
    const diagramModules = [
      {
        config: [ 'value', config ],
        connectionDocking: [ 'type', require('diagram-js/lib/layout/CroppingConnectionDocking') ]
      },
      require('diagram-js/lib/features/selection'),
      require('diagram-js/lib/features/overlays'),
      require('diagram-js/lib/navigation/zoomscroll'),
      require('diagram-js/lib/navigation/movecanvas'),
      require('diagram-js/lib/features/auto-scroll'),
      require('diagram-js/lib/features/rules'),
      require('diagram-js/lib/features/modeling'),
      require('diagram-js/lib/features/move'),
      require('diagram-js/lib/features/outline'),
      require('diagram-js/lib/features/tool-manager'),
      require('diagram-js/lib/features/lasso-tool'),
      require('diagram-js/lib/features/hand-tool'),
      require('diagram-js/lib/features/palette'),
      require('diagram-js/lib/features/create'),
      require('diagram-js/lib/features/context-pad'),
      require('diagram-js/lib/features/connect'),
      require('diagram-js/lib/features/popup-menu'),
      require('diagram-js/lib/features/editor-actions'),
      require('diagram-js/lib/features/keyboard'),
      overriddenModules
    ];

    const gitterModules = [
      autoConnect,
      coreModule,
      cropping,
      gitterContextPad,
      gitterMovePreview,
      gitterPalette,
      gitterRules,
      helpOverlay,
      keyboardBindings,
      listenerAnimation,
      modeling,
      notifications,
      ordering,
      propertiesPanel,
      sequences
    ];

    super({
      modules: [
        ...diagramModules,
        ...gitterModules
      ]
    });
  }
}

export default Gitter;
