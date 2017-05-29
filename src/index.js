const p5 = require('p5');
require('p5/lib/addons/p5.sound.js');

import Gitter from './Gitter';

const gitter = window.gitter = new Gitter({ container: '#canvas' });

const modeling = gitter.get('modeling');
const gitterElementFactory = gitter.get('gitterElementFactory');
const canvas = gitter.get('canvas');
const selection = gitter.get('selection');
const config = gitter.get('config');
const keyboard = gitter.get('keyboard');

// inital diagram
const rootShape = gitterElementFactory.createRoot();

canvas.setRootElement(rootShape);

const x = Math.floor(document.documentElement.clientWidth / 2) - 15;
const y = Math.floor(document.documentElement.clientHeight / 2) - 15;

const emitter = gitterElementFactory.createEmitter({
  id: 'Emitter_1',
  type: 'gitter:Emitter',
  x: x - config.propertiesPanelWidth,
  y,
  width: config.shapeSize,
  height: config.shapeSize
});

canvas.addShape(emitter, rootShape);

keyboard.bind(document);

selection.select(emitter);

window.gitter = gitter;
