import { pointDistance } from 'diagram-js/lib/util/Geometry';

const round = Math.round;

export function getMid(element) {
  return {
    x: round(element.x + element.width / 2),
    y: round(element.y + element.height / 2)
  };
}

export function getDistance(a, b) {
  return pointDistance(getMid(a), getMid(b));
}
