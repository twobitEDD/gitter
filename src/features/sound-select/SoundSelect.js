import domify from 'min-dom/lib/domify';
import domEvent from 'min-dom/lib/event';
import domClasses from 'min-dom/lib/classes';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import { isListener } from '../../util/GitterUtil';

class SoundSelect extends CommandInterceptor {
  constructor(eventBus, config, commandStack) {
    super(eventBus);

    this._config = config;
    this._commandStack = commandStack;

    this.init();

    this.createdShape = undefined;

    this.postExecuted('shape.create', ({ context }) => {
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
        if (this.createdShape === undefined) {
          return;
        }

        // TODO: fix, this is actually a seperate command, even if the overlay
        // was showed in the post-executed phase of the previous command
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
