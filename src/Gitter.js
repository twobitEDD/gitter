import Diagram from 'diagram-js';

// gitter modules
import autoConnect from './features/auto-connect';
import gitterConfig from './config';
import coreModule from './core';
import cropping from './features/cropping';
import emissionAnimation from './features/emission-animation';
import emitterAnimation from './features/emitter-animation';
import gitterEmitterPreview from './features/emitter-preview';
import gitterMovePreview from './features/move-preview';
import gitterPalette from './features/palette';
import gitterRules from './features/rules';
import keyboardBindings from './features/keyboard-bindings';
import kitSelect from './features/kit-select';
import listenerAnimation from './features/listener-animation';
import gitterModeling from './features/modeling';
import ordering from './features/ordering';
import overridden from './features/overridden'; // overridden diagram-js features
import radialMenu from './features/radial-menu';
import saveMidi from './features/save-midi';
import sequences from './features/sequences';
import tempoControl from './features/tempo-control';
import hotCues from './features/hot-cues';

import { isRoot, isEmitter, isListener } from './util/GitterUtil';

function Gitter(options) {

  const diagramModules = [
    {
      gitter: [ 'value', this ],
      gitterConfig: [ 'value', gitterConfig ],
      connectionDocking: [ 'type', require('diagram-js/lib/layout/CroppingConnectionDocking') ]
    },
    require('diagram-js/lib/features/auto-scroll'),
    require('diagram-js/lib/features/connect'),
    require('diagram-js/lib/features/context-pad'),
    require('diagram-js/lib/features/create'),
    require('diagram-js/lib/features/editor-actions'),
    require('diagram-js/lib/features/hand-tool'),
    require('diagram-js/lib/features/keyboard'),
    require('diagram-js/lib/features/lasso-tool'),
    require('diagram-js/lib/features/modeling'),
    require('diagram-js/lib/features/move'),
    require('diagram-js/lib/features/outline'),
    require('diagram-js/lib/features/overlays'),
    require('diagram-js/lib/features/palette'),
    require('diagram-js/lib/features/popup-menu'),
    require('diagram-js/lib/features/rules'),
    require('diagram-js/lib/features/selection'),
    require('diagram-js/lib/features/tool-manager'),
    require('diagram-js/lib/navigation/movecanvas'),
    require('diagram-js/lib/navigation/zoomscroll'),
    {
      movePreview: [ 'value', {} ]
    }
  ];

  const gitterModules = [
    autoConnect,
    coreModule,
    cropping,
    emissionAnimation,
    emitterAnimation,
    gitterEmitterPreview,
    gitterMovePreview,
    gitterPalette,
    gitterRules,
    hotCues,
    keyboardBindings,
    kitSelect,
    listenerAnimation,
    gitterModeling,
    ordering,
    overridden,
    radialMenu,
    saveMidi,
    sequences,
    tempoControl
  ];

  const additionalModules = options.additionalModules || [];

  Diagram.call(this, {
    ...options,
    ...{
      modules: [
        ...diagramModules,
        ...gitterModules,
        ...additionalModules
      ]
    }
  });
};

Gitter.prototype = Object.create(Diagram.prototype, {
  constructor: {
    value: Gitter,
    enumerable: false,
    writable: true,
    configurable: true
  }
});

Gitter.prototype.create = function() {
  const canvas = this.get('canvas');
  const eventBus = this.get('eventBus');
  const gitterConfig = this.get('gitterConfig');
  const gitterElementFactory = this.get('gitterElementFactory');

  eventBus.fire('gitter.create.start');

  const rootShape = gitterElementFactory.createRoot();

  canvas.setRootElement(rootShape);

  const x = Math.floor(canvas.getContainer().clientWidth / 3) - 15;
  const y = Math.floor(canvas.getContainer().clientHeight / 2) - 15;

  const emitter = gitterElementFactory.createEmitter({
    id: 'Emitter_1',
    type: 'gitter:Emitter',
    x,
    y,
    width: gitterConfig.shapeSize,
    height: gitterConfig.shapeSize
  });

  canvas.addShape(emitter, rootShape);

  eventBus.fire('gitter.create.end');
};

/**
 * Internal load. Loads all elements.
 */
Gitter.prototype._load = function(elements) {
  const gitterConfig = this.get('gitterConfig'),
        canvas = this.get('canvas'),
        modeling = this.get('modeling'),
        gitterElementFactory = this.get('gitterElementFactory'),
        sounds = this.get('sounds');

  const { shapeSize } = gitterConfig;

  this.clear();

  // add root first
  const rootElement = elements.filter(({ isRoot }) => isRoot)[0];

  if (!rootElement) {
    throw new Error('root not found');
  }

  const { tempo, soundKit } = rootElement;

  const rootShape = gitterElementFactory.createRoot({
    tempo,
    soundKit
  });

  canvas.setRootElement(rootShape);

  sounds.setSoundKit(soundKit);

  elements.forEach(element => {

    if (element.isRoot) {
      return;
    } else if (isEmitter(element)) {
      const { type, x, y, timeSignature } = element;

      const emitterShape = gitterElementFactory.createEmitter({
        type,
        timeSignature,
        width: shapeSize,
        height: shapeSize
      });

      modeling.createShape(emitterShape, { x, y }, rootShape);
    } else if (isListener(element)) {
      const { type, x, y, sound } = element;

      const listenerShape = gitterElementFactory.createEmitter({
        type,
        sound,
        width: shapeSize,
        height: shapeSize
      });

      modeling.createShape(listenerShape, { x, y }, rootShape);
    }

  });
};

/**
 * Loads all elements and configurations.
 */
Gitter.prototype.load = function(descriptors) {
  const eventBus = this.get('eventBus'),
        exportConfig = this.get('exportConfig');

  eventBus.fire('gitter.load.start');

  try {
    const { elements, exportedConfigs } = JSON.parse(descriptors);

    this._load(elements);

    exportConfig.import(exportedConfigs);

    eventBus.fire('gitter.load.end');
  } catch(e) {
    throw new Error('could not load', e);
  }
};

/**
 * Internal save. Saves all elements.
 */
Gitter.prototype._save = function() {
  const elementRegistry = this.get('elementRegistry');

  let elements = [];

  Object.values(elementRegistry._elements).forEach(({ element }) => {

    let descriptor;

    if (isRoot(element)) {
      descriptor = {
        isRoot: true,
        tempo: element.tempo,
        soundKit: element.soundKit
      };
    } else if (isEmitter(element)) {
      descriptor = {
        type: element.type,
        timeSignature: element.timeSignature,
        x: element.x,
        y: element.y
      };
    } else if (isListener(element)) {
      descriptor = {
        type: element.type,
        sound: element.sound,
        x: element.x,
        y: element.y
      };
    }

    if (descriptor) {
      elements = [
        ...elements,
        descriptor
      ];
    }
  });

  return elements;
};

/**
 * Saves all elements and additional configurations.
 */
Gitter.prototype.save = function() {
  const exportConfig = this.get('exportConfig');

  const exportedConfigs = exportConfig.export();

  return JSON.stringify({
    elements: this._save(),
    exportedConfigs: exportedConfigs
  });
};

Gitter.prototype.saveMidi = function() {
  const saveMidi = this.get('saveMidi');

  if (!saveMidi) {
    throw new Error('feature not found');
  }

  saveMidi.saveMidi();
};

export default Gitter;
