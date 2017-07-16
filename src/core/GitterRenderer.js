import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

import { componentsToPath, createLine } from 'diagram-js/lib/util/RenderUtil';

import svgAppend from 'tiny-svg/lib/append';
import svgAttr from 'tiny-svg/lib/attr';
import svgCreate from 'tiny-svg/lib/create';

import { isEmitter, isListener, isConnection } from '../util/GitterUtil';

class CustomRenderer extends BaseRenderer {
  constructor(eventBus, canvas, gitterConfig) {
    super(eventBus, 2000);

    this._gitterConfig = gitterConfig;

    this.drawEmitter = (p, width, height, color) => {
      const cx = width / 2,
            cy = height / 2;

      const attrs = {
        stroke: color,
        strokeWidth: 1,
        fill: '#000'
      };

      const circle = svgCreate('circle');

      svgAttr(circle, {
        cx: cx,
        cy: cy,
        r: Math.round((width + height) / 4)
      });

      svgAttr(circle, attrs);

      svgAppend(p, circle);

      return circle;
    };

    this.drawListener = (p, width, height, outerColor, innerColor) => {
      const cx = width / 2,
            cy = height / 2;

      const attrs = {
        strokeWidth: 1,
        fill: '#000'
      };

      const circle = svgCreate('circle');

      svgAttr(circle, {
        cx: cx,
        cy: cy,
        r: Math.round((width + height) / 4),
        stroke: outerColor
      });

      svgAttr(circle, attrs);

      svgAppend(p, circle);

      const innerCircle = svgCreate('circle');

      svgAttr(innerCircle, {
        cx: cx,
        cy: cy,
        r: Math.round((width + height) / 4) - 6,
        stroke: innerColor
      });

      svgAttr(innerCircle, attrs);

      svgAppend(p, innerCircle);

      return circle;
    };

    this.getCirclePath = shape => {
      const cx = shape.x + shape.width / 2,
            cy = shape.y + shape.height / 2,
            radius = shape.width / 2;

      const circlePath = [
        ['M', cx, cy],
        ['m', 0, -radius],
        ['a', radius, radius, 0, 1, 1, 0, 2 * radius],
        ['a', radius, radius, 0, 1, 1, 0, -2 * radius],
        ['z']
      ];

      return componentsToPath(circlePath);
    };

    this.drawConnection = (p, element) => {
      const attrs = {
        strokeWidth: 1,
        stroke: gitterConfig.emitterColor
      };

      return svgAppend(p, createLine(element.waypoints, attrs));
    };

    this.getCustomConnectionPath = connection => {
      const waypoints = connection.waypoints.map(function(p) {
        return p.original || p;
      });

      const connectionPath = [
        ['M', waypoints[0].x, waypoints[0].y]
      ];

      waypoints.forEach(function(waypoint, index) {
        if (index !== 0) {
          connectionPath.push(['L', waypoint.x, waypoint.y]);
        }
      });

      return componentsToPath(connectionPath);
    };
  }

  canRender(element) {
    return /^gitter\:/.test(element.type);
  }

  drawShape(parent, element) {
    if (isEmitter(element)) {
      return this.drawEmitter(parent, element.width, element.height, this._gitterConfig.emitterColor);
    } else if (isListener(element)) {
      return this.drawListener(parent, element.width, element.height, this._gitterConfig.emitterColor, this._gitterConfig.listenerColor);
    }
  }

  getShapePath(shape) {
    if (isEmitter(shape) || isListener(shape)) {
      return this.getCirclePath(shape);
    }
  }

  drawConnection(p, element) {
    if (isConnection(element)) {
      return this.drawConnection(p, element);
    }
  }
}

CustomRenderer.$inject = [ 'eventBus', 'canvas', 'gitterConfig' ];

module.exports = CustomRenderer;
