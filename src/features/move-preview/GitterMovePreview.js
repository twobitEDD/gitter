import svgAppend from 'tiny-svg/lib/append';
import svgAttr from 'tiny-svg/lib/attr';
import svgCreate from 'tiny-svg/lib/create';
import svgClear from 'tiny-svg/lib/clear';

import { isEmitter, isListener } from '../../util/GitterUtil';

function createEmitterPreview(cx, cy, timeSignature, maxDistance, offsetDistance) {
  const attrs = {
    stroke: '#333',
    strokeWidth: 1,
    fill: 'none'
  };

  const preview = svgCreate('g');

  const circleRadiusStep = (maxDistance - offsetDistance) / timeSignature;

  for (let i = 0; i < timeSignature; i++) {
    const circle = svgCreate('circle');

    svgAttr(circle, {
      cx,
      cy,
      r: i * circleRadiusStep + circleRadiusStep
    });

    svgAttr(circle, attrs);

    svgAppend(preview, circle);
  }

  return preview;
}

class GitterMovePreview {
  constructor(eventBus, canvas, elementRegistry, config) {
    const { maxDistance, offsetDistance } = config;

    const previewLayer = canvas.getLayer('gitterMovePreview');

    eventBus.on('shape.move.init',({ shape }) => {

      // listener
      if (isListener(shape)) {
        const emitters = elementRegistry.filter(e => isEmitter(e));

        console.log('emitters', emitters);

        emitters.forEach(emitter => {
          const { x, y, width, timeSignature } = emitter;

          const cx = Math.round(x + (width / 2));
          const cy = Math.round(y + (width / 2));

          const preview = createEmitterPreview(cx, cy, timeSignature, maxDistance, offsetDistance);

          svgAppend(previewLayer, preview);

          console.log(previewLayer.childNodes);
        });
      }
    });

    eventBus.on('shape.move.end', () => {
      svgClear(previewLayer);
    });
  }
}

GitterMovePreview.$inject = [ 'eventBus', 'canvas', 'elementRegistry', 'config' ];

module.exports = GitterMovePreview;
