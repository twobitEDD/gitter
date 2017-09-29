import domify from 'min-dom/lib/domify';
import domQuery from 'min-dom/lib/query';
import domEvent from 'min-dom/lib/event';
import domClasses from 'min-dom/lib/classes';

import { isRoot } from '../../util/GitterUtil';

class KitSelect {
  constructor(canvas, eventBus, gitterConfig, gitterModeling) {
    this._canvas = canvas;
    this._eventBus = eventBus;
    this._gitterConfig = gitterConfig;
    this._gitterModeling = gitterModeling;

    this.init();

    eventBus.on([
      'commandStack.gitter.changeProperties.executed',
      'commandStack.gitter.changeProperties.reverted'
    ], ({ context }) => {
      const element = context.element;

      if (isRoot(element)) {
        this.update(element.soundKit);
      }
    });
  }

  init() {
    const container = this.container = domify(
      `<div class="kit-select">
        <p class="selected"></p>
        <ul class="select hidden">
        </ul>
      </div>`);

    this.selected = domQuery('.selected', container);
    this.select = domQuery('.select', container);

    domEvent.bind(this.selected, 'click', () => {
      if (domClasses(container).has('select-open')) {
        domClasses(container).remove('select-open');

        this.closeSelect();
      } else {
        domClasses(container).add('select-open');

        this.openSelect();
      }
    });

    domEvent.bind(document, 'click', e => {
      if (!e.target.closest('.kit-select')) {
        this.closeSelect();
      }
    });

    this.update(this._gitterConfig.initialSoundKit);

    this._canvas.getContainer().appendChild(container);
  }

  openSelect() {
    domClasses(this.select).remove('hidden');
  }

  closeSelect() {
    domClasses(this.select).add('hidden');
  }

  setSelectOptions(soundKit) {
    while(this.select.firstChild) {
      this.select.firstChild.remove();
    }

    Object.keys(this._gitterConfig.soundKits).forEach(key => {
      if (key === soundKit) {
        return;
      }

      const label = this._gitterConfig.soundKits[key].label;

      const option = domify(`<li class="option">${label}</li>`);

      domEvent.bind(option, 'click', () => {
        domClasses(this.container).remove('select-open');

        this.closeSelect();

        const rootElement = this._canvas.getRootElement();

        this._gitterModeling.changeProperties(rootElement, {
          soundKit: key
        });
      });

      this.select.appendChild(option);
    });
  }

  update(soundKit) {
    this.setSelectOptions(soundKit);

    const label = this._gitterConfig.soundKits[soundKit].label;

    this.selected.textContent = `Kit: ${label}`;
  }
}

KitSelect.$inject = [ 'canvas', 'eventBus', 'gitterConfig', 'gitterModeling' ];

export default KitSelect;