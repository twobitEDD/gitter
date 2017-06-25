import svgAppend from 'tiny-svg/lib/append';
import svgAttr from 'tiny-svg/lib/attr';
import svgCreate from 'tiny-svg/lib/create';
import svgClear from 'tiny-svg/lib/clear';

var translate = require('diagram-js/lib/util/SvgTransformUtil').translate;

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

class EmitterPreview {
  constructor(eventBus, canvas, elementRegistry, config) {
    const { maxDistance, offsetDistance } = config;

    const emitterPreviewLayer = canvas.getLayer('gitterEmitterPreview');

    eventBus.on('shape.move.start',({ context }) => {
      const { shapes } = context;

      const hasMovingListeners = shapes.filter(s => isListener(s)).length;

      const emitters = elementRegistry.filter(e => isEmitter(e));

      const movingGroup = context.movingGroup = svgCreate('g');
      const nonMovingGroup = svgCreate('g');

      svgAppend(emitterPreviewLayer, movingGroup);
      svgAppend(emitterPreviewLayer, nonMovingGroup);

      emitters.forEach(emitter => {
        const { x, y, width, timeSignature } = emitter;

        const cx = Math.round(x + (width / 2));
        const cy = Math.round(y + (width / 2));

        const preview = createEmitterPreview(cx, cy, timeSignature, maxDistance, offsetDistance);

        if (shapes.includes(emitter)) {
          svgAppend(movingGroup, preview);
        } else if (hasMovingListeners) {
          svgAppend(nonMovingGroup, preview);
        }
      });
    });

    eventBus.on('shape.move.move', ({ dx, dy, context }) => {
      const { movingGroup } = context;

      translate(movingGroup, dx, dy);
    });

    eventBus.on('create.start', ({ shape }) => {
      if (isListener(shape)) {
        const emitters = elementRegistry.filter(e => isEmitter(e));

        emitters.forEach(emitter => {
          const { x, y, width, timeSignature } = emitter;

          const cx = Math.round(x + (width / 2));
          const cy = Math.round(y + (width / 2));

          const preview = createEmitterPreview(cx, cy, timeSignature, maxDistance, offsetDistance);

          svgAppend(emitterPreviewLayer, preview);
        });
      }
    });

    eventBus.on([
      'shape.move.end',
      'shape.move.cancel',
      'create.end',
      'create.cancel'
    ], () => {
      svgClear(emitterPreviewLayer);
    });
  }
}

EmitterPreview.$inject = [ 'eventBus', 'canvas', 'elementRegistry', 'config' ];

module.exports = EmitterPreview;
