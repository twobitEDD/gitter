import domify from 'min-dom/lib/domify';
import domEvent from 'min-dom/lib/event';
import domClasses from 'min-dom/lib/classes';

import { isListener } from '../../util/GitterUtil';

class SoundSelect {
  constructor(eventBus, config, commandStack) {
    this._config = config;
    this._commandStack = commandStack;

    this.init();

    this.createdShape = null;

    eventBus.on('commandStack.shape.create.postExecuted', ({ context }) => {
      const { shape } = context;

      this.createdShape = shape;

      if (isListener(shape)) {
        domClasses(this.$overlay).remove('hidden');
      }
    });
  }

  init() {
    this.$overlay = domify(`
      <div id="sound-select-overlay" class="hidden">
        <div class="title"><i class="fa fa-play"></i> Select Sound</div>
      </div>
    `);

    this._config.sounds.forEach(({ id, label }) => {

      const $button = domify(`
        <div class="sound-select-button">${label}</div>
      `);

      domEvent.bind($button, 'click', () => {
        if (this.createdShape === null) {
          return;
        }

        this._commandStack.execute('gitter.changeProperties', {
          element: this.createdShape,
          properties: {
            sound: id
          }
        });

        domClasses(this.$overlay).add('hidden');
      });

      this.$overlay.appendChild($button);
    });

    document.body.appendChild(this.$overlay);
  }
}

SoundSelect.$inject = [ 'eventBus', 'config', 'commandStack' ];

export default SoundSelect;
