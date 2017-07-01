const p5 = require('p5');
require('p5/lib/addons/p5.sound.js');

import svgAppend from 'tiny-svg/lib/append';
import svgAttr from 'tiny-svg/lib/attr';
import svgClear from 'tiny-svg/lib/clear';
import svgCreate from 'tiny-svg/lib/create';
import svgRemove from 'tiny-svg/lib/remove';

import { rotate, translate } from 'diagram-js/lib/util/SvgTransformUtil';

import { isConnection } from '../../util/GitterUtil';

import { getStepIndex } from '../../util/SequenceUtil';

import { getDistance, getMid } from '../../util/GeometryUtil';

import { tweenPoint } from '../../util/TweenUtil';

const MILLIS_PER_MINUTE = 60000;

const IMPULSE_RECT_WIDTH = 10;
const IMPULSE_RECT_HEIGHT = 4;

const round = Math.round;

class EmissionAnimation {
  constructor(eventBus, canvas, config, elementRegistry) {
    this._canvas = canvas;
    this._config = config;

    this.audioContext = p5.prototype.getAudioContext();

    console.log('creating emission animation layer');
    this.emissionAnimationLayer = canvas.getLayer('gitterEmissionAnimation', -700);

    this.impulses = [];

    this.timeLastLoopStart = 0;

    eventBus.on('gitter.audio.loopStart', context => {
      this.timeLastLoopStart = Date.now();

      svgClear(this.emissionAnimationLayer);

      this.impulses = [];

      const connections = elementRegistry.filter(e => isConnection(e));

      connections.forEach(connection => {
        this.createEmitterAnimation(connection);
      });
    });

    // update during animation
    eventBus.on('commandStack.shape.delete.postExecuted', ({ context }) => {
      const { shape } = context;

        this.impulses.forEach(({ emitter, listener, gfxGroup}) => {
          if (shape === emitter || shape === listener) {
            svgRemove(gfxGroup);
          }
        });

        this.impulses =
          this.impulses.filter(i => i.emitter !== shape && i.listener !== shape);
    });

    eventBus.on('commandStack.connection.create.postExecuted', ({ context }) => {
      const { connection } = context;

      this.createEmitterAnimation(connection);
    });

    eventBus.on('commandStack.connection.delete.postExecuted', ({ context }) => {
      const { source, target } = context;

      this.impulses.forEach(({ emitter, listener, gfxGroup}) => {
        if (source === emitter && target === listener) {
          svgRemove(gfxGroup);
        }
      });

      this.impulses =
        this.impulses.filter(i => i.emitter.id !== source.id || i.listener.id !== target.id);
    });

    // start animation loop
    this.updateAnimation();
  }

  createEmitterAnimation({ source, target }) {
    const { tempo } = this._canvas.getRootElement();

    const { maxDistance, offsetDistance } = this._config;

    const quarterNoteDuration = MILLIS_PER_MINUTE / tempo,
          sixteenthNoteDuration = quarterNoteDuration / 4;

    const emitter = source,
          listener = target;

    const { timeSignature } = emitter;

    const distance = getDistance(emitter, listener);

    const stepIndex = getStepIndex(distance, maxDistance, offsetDistance, timeSignature);

    if (stepIndex === 0) {

      // animation duration would be 0ms
      return;
    }

    const animationDuration = sixteenthNoteDuration * stepIndex;

    const emitterMid = getMid(emitter);
    const listenerMid = getMid(listener);

    const gfxGroup = svgCreate('g');

    translate(gfxGroup, emitterMid.x, emitterMid.y);

    svgAppend(this.emissionAnimationLayer, gfxGroup);

    const gfxRect = svgAttr(svgCreate('rect'), {
      x: - round(IMPULSE_RECT_WIDTH / 2),
      y: - round(IMPULSE_RECT_HEIGHT / 2),
      width: IMPULSE_RECT_WIDTH,
      height: IMPULSE_RECT_HEIGHT,
      fill: this._config.emitterColor
    });

    const rotation =
      Math.atan2(listenerMid.x - emitterMid.x, listenerMid.y - emitterMid.y)
      * 180 / Math.PI;

    // TODO: fix
    rotate(gfxRect, - rotation - 90);

    svgAppend(gfxGroup, gfxRect);

    this.impulses.push({
      startTime: this.timeLastLoopStart,
      animationDuration,
      emitter,
      listener,
      gfxGroup,
      gfxRect
    });
  }

  updateAnimation() {
    const currentTime = Date.now();

    this.impulses.forEach(impulse => {
      const {
        startTime,
        animationDuration,
        emitter,
        listener,
        gfxGroup,
        gfxRect
      } = impulse;

      const emitterMid = getMid(emitter);
      const listenerMid = getMid(listener);

      const startPoint = {
        x: emitterMid.x,
        y: emitterMid.y
      };

      const endPoint = {
        x: listenerMid.x,
        y: listenerMid.y
      };

      const time = currentTime - startTime;

      const newPoint = tweenPoint(startPoint, endPoint, time, animationDuration, 'eased');

      translate(gfxGroup, newPoint.x, newPoint.y);

      let rotation =
        Math.atan2(listenerMid.x - emitterMid.x, listenerMid.y - emitterMid.y)
        * 180 / Math.PI;

      rotation = - rotation - 90;

      svgAttr(gfxRect, {
        transform: `rotate(${rotation})`
      });

      if (currentTime >= startTime + animationDuration) {
        svgRemove(gfxGroup);

        this.impulses = this.impulses.filter(i => i !== impulse);
      }
    });

    requestAnimationFrame(this.updateAnimation.bind(this));
  }
}

EmissionAnimation.$inject = [ 'eventBus', 'canvas', 'config', 'elementRegistry' ];

export default EmissionAnimation;
