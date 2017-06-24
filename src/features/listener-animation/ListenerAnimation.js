import svgAppend from 'tiny-svg/lib/append';
import svgAttr from 'tiny-svg/lib/attr';
import svgCreate from 'tiny-svg/lib/create';
import svgRemove from 'tiny-svg/lib/remove';

class ListenerAnimation {
  constructor(eventBus, canvas, config) {
    const listenerAnimationLayer = canvas.getLayer('gitterListenerAnimation');

    eventBus.on('gitter.audio.playSound', ({ listener }) => {
      const { x, y, width } = listener;

      const circle = svgCreate('circle');

      svgAttr(circle, {
        cx: Math.round(x + (width / 2)),
        cy: Math.round(y + (width / 2)),
        r: 30
      });

      svgAttr(circle, {
        stroke: 'none',
        fill: config.emitterColor
      });

      svgAppend(listenerAnimationLayer, circle);

      setTimeout(() => {
        svgRemove(circle);
      }, 30);
    });
  }
}

ListenerAnimation.$inject = [ 'eventBus', 'canvas', 'config' ];

export default ListenerAnimation;
