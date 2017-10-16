import domify from 'min-dom/lib/domify';
import domQuery from 'min-dom/lib/query';
import domEvent from 'min-dom/lib/event';
import domClasses from 'min-dom/lib/classes';
import domAttr from 'min-dom/lib/attr';

import { isEmitter, isListener } from '../../util/GitterUtil';

import ProgressIndicator from './ProgressIndicator';

class HotCues {
  constructor(eventBus, canvas, gitterConfig, commandStack, gitter, exportConfig) {
    this._eventBus = eventBus;
    this._canvas = canvas;
    this._commandStack = commandStack;
    this._gitter = gitter;

    this._progressIndicator = new ProgressIndicator(eventBus, canvas);

    this.init();

    exportConfig.registerExport({
      id: 'hot-cues',
      exportConfig: () => {
        return {
          slots: this._slots,
          activeSlot: this._activeSlot
        };
      },

      importConfig: (config) => {
        this._slots = config.slots;

        this._slots.forEach((slot, slotId) => {
          let slotEl = this._getSlotEl(slotId);

          if (slot !== null) {
            domClasses(slotEl).add('existing');
          }
        });

        this._setActive(config.activeSlot);
      }
    });

    eventBus.on('commandStack.changed', () => {
      this.setDirty();
    });

    eventBus.on('gitter.audio.loopStart', 2000, context => {

      if (this._nextJump) {
        this._actualJumpTo(this._nextJump);

        this._nextJump = null;
      }
    }, this);
  }

  init() {
    this.$rootEl = domify(`
      <div class="hot-cues">
        <div class="slots">
        </div>
      </div>
    `);

    this.$slotsEl = domQuery('.slots', this.$rootEl);

    this._slots = [];
    this._activeSlot = null;

    for (let i = 0; i < 9; i++) {

      let slotEl = domify(`
        <div class="slot" data-id="${i}">
          ${i + 1}
          <span class="dirty-indicator">*</span>
        </div>
      `);

      if (this._slots[i]) {
        domClasses(slotEl).add('existing');
      }

      domEvent.bind(slotEl, 'click', (e) => {
        if (e.ctrlKey) {

          // save slot
          this.saveSlot(i);
        } else {

          // jump to slot
          this.jumpTo(i);
        }
      });

      this.$slotsEl.appendChild(slotEl);
    }

    domEvent.bind(this.$slotsEl, 'mousedown', event => {
      event.stopPropagation();

      var target = event.target;

      var slotId = parseInt(domAttr(target, 'data-id'), 10);

      this.jumpTo(slotId);
    });

    this._canvas.getContainer().appendChild(this.$rootEl);
  }

  saveSlot(slotId) {
    this._slots[slotId] = this._gitter._save();

    let slotEl = this._getSlotEl(slotId);

    if (slotEl) {
      domClasses(slotEl).add('existing');
      domClasses(slotEl).add('saved');

      setTimeout(function() {
        domClasses(slotEl).remove('saved');
      }, 500);

      this._setActive(slotId);
    }
  }

  _actualJumpTo(jumpTarget) {
    let {
      slotId
    } = jumpTarget;

    let slot = this._slots[slotId];

    this._gitter._load(slot);

    this._setActive(slotId);
  }

  _setActive(slotId) {
    this._activeSlot = slotId;

    let slotEl = this._getSlotEl(slotId);

    var activeSlotEl = this._getActiveSlotEl();

    if (activeSlotEl) {
      domClasses(activeSlotEl).remove('active');
      domClasses(activeSlotEl).remove('dirty');
    }

    if (slotEl) {
      domClasses(slotEl).remove('jumping');
      domClasses(slotEl).add('active');

      this._progressIndicator.drawOn(slotEl);
    }
  }

  _getActiveSlotEl() {
    return domQuery(`.active`, this.$slotsEl);
  }

  _getSlotEl(slotId) {
    return domQuery(`[data-id='${slotId}']`, this.$slotsEl);
  }

  setDirty() {
    let activeEl = this._getActiveSlotEl();

    if (activeEl) {
      domClasses(activeEl).add('dirty');
    }
  }

  jumpTo(slotId) {

    if (!this._slots[slotId]) {
      return;
    }

    let slotEl = this._getSlotEl(slotId);

    domClasses(slotEl).add('jumping');

    this._nextJump = { slotId };
  }
}

HotCues.$inject = [
  'eventBus',
  'canvas',
  'gitterConfig',
  'commandStack',
  'gitter',
  'exportConfig'
];

export default HotCues;
