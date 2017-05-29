import BaseElementFactory from 'diagram-js/lib/core/ElementFactory';

class GitterElementFactory extends BaseElementFactory {
  constructor(config, sounds) {
    super();

    this.baseCreate = BaseElementFactory.prototype.create;

    this.handlers = {

      // root
      root: attrs => {
        return this.baseCreate('root', Object.assign({
          id: 'root',
          tempo: config.initialTempo
        }, attrs));
      },

      // emitter
      emitter: attrs => {
        return this.baseCreate('shape', Object.assign({
          type: 'gitter:Emitter',
          width: config.shapeSize,
          height: config.shapeSize,
          timeSignature: config.initialTimeSignature
        }, attrs));
      },

      // listener
      listener: attrs => {
        return this.baseCreate('shape', Object.assign({
          type: 'gitter:Listener',
          width: config.shapeSize,
          height: config.shapeSize,
          sound: config.initialSound
        }, attrs));
      }
    }
  }

  create(elementType, attrs) {
    return this.handlers[elementType](attrs);
  }

  createRoot(attrs) {
    return this.create('root', attrs);
  }

  createEmitter(attrs) {
    return this.create('emitter', attrs);
  }

  createListener(attrs) {
    return this.create('listener', attrs);
  }
}

GitterElementFactory.$inject = [ 'config', 'sounds' ];

module.exports = GitterElementFactory;
