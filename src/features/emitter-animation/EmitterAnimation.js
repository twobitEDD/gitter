const p5 = require('p5');
require('p5/lib/addons/p5.sound.js');

import svgAppend from 'tiny-svg/lib/append';
import svgAttr from 'tiny-svg/lib/attr';
import svgClear from 'tiny-svg/lib/clear';
import svgCreate from 'tiny-svg/lib/create';

import { isEmitter } from '../../util/GitterUtil';

class EmitterAnimation {
  constructor(eventBus, canvas, config, elementRegistry) {
    const { maxDistance, offsetDistance } = config;

    this.audioContext = p5.prototype.getAudioContext();

    const emitterAnimationLayer = canvas.getLayer('gitterEmitterAnimation');

    // start animation loop
    this.updateAnimation();

    const currentTime = this.audioContext.currentTime * 1000;

    eventBus.on('gitter.audio.loopStart', context => {

      svgClear(emitterAnimationLayer);

      const emitters = elementRegistry.filter(e => isEmitter(e));

      const { tempo } = canvas.getRootElement();

      emitters.forEach(emitter => {
        const { x, y, width, timeSignature } = emitter;
      });
    });
  }

  updateAnimation() {
    requestAnimationFrame(this.updateAnimation.bind(this));

    const currentTime = this.audioContext.currentTime * 1000;
  }
}

EmitterAnimation.$inject = [ 'eventBus', 'canvas', 'config', 'elementRegistry' ];

export default EmitterAnimation;
