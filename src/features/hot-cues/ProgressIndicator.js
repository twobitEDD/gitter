import { tweenLinear } from '../../util/TweenUtil';

const MILLIS_PER_MINUTE = 60000;

import domify from 'min-dom/lib/domify';
import domQuery from 'min-dom/lib/query';
import domEvent from 'min-dom/lib/event';
import domClasses from 'min-dom/lib/classes';
import domAttr from 'min-dom/lib/attr';


class ProgressIndicator {

  constructor(eventBus, canvas) {
    this.timeLastLoopStart = 0;
    this._canvas = canvas;

    eventBus.on('gitter.audio.loopStart', 4000, context => {
      this.timeLastLoopStart = Date.now();
    });

    eventBus.on('diagram.destroy', () => {
      this._destroyed = true;
    });

    this._init();

    eventBus.on([
      'gitter.create.end',
      'gitter.load.end'
    ], () => {
      this.updateAnimation();
    });
  }

  _init() {

    this.$rootEl = domify(`
      <div class="progress-indicator">
        <div class="progress"></div>
      </div>
    `);

    this.$progressEl = domQuery('.progress', this.$rootEl);
  }

  drawOn(parentEl) {

    if (!parentEl) {
      if (this.$rootEl.parentNode) {
        this.$rootEl.parentNode.removeChild(parentEl);
      }
    }

    parentEl.appendChild(this.$rootEl);
  }

  updateAnimation() {

    if (this._destroyed) {
      return;
    }

    const currentTime = Date.now();

    const { tempo } = this._canvas.getRootElement();

    const quarterNoteDuration = MILLIS_PER_MINUTE / tempo,
          sixteenthNoteDuration = quarterNoteDuration / 4;

    // TODO: fix, should be 16
    const loopDuration = sixteenthNoteDuration * 14.5;

    const elapsedLoopTime = currentTime - this.timeLastLoopStart;

    const newProgress = tweenLinear(0, 100, elapsedLoopTime, loopDuration);

    this.$progressEl.style.width = newProgress + '%';

    requestAnimationFrame(this.updateAnimation.bind(this));
  }
}

ProgressIndicator.$inject = [ 'eventBus', 'canvas' ];

module.exports = ProgressIndicator;