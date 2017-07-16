import domify from 'min-dom/lib/domify';
import domQuery from 'min-dom/lib/query';
import domEvent from 'min-dom/lib/event';
import domClasses from 'min-dom/lib/classes';

import ChangePropertiesHandler from './cmd/ChangePropertiesHandler';

import EntryFactory from './EntryFactory';

import { isEmitter, isListener } from '../../util/GitterUtil';

class PropertiesPanel {
  constructor(eventBus, canvas, gitterConfig, commandStack, sounds) {
    this._eventBus = eventBus;
    this._canvas = canvas;
    this._gitterConfig = gitterConfig;
    this._commandStack = commandStack;
    this._sounds = sounds;

    commandStack.registerHandler('gitter.changeProperties', ChangePropertiesHandler);

    this.entryFactory = new EntryFactory();

    this.currentElement = undefined;
    this.isClosed = false;
    this.ignoreSelectionChanges = false;

    this.init();

    eventBus.on('selection.changed', e => {
      if (this.ignoreSelectionChanges) {
        return;
      }

      if (e.newSelection.length > 1) {

        // update with undefined if multiple elements selected
        this.update();
      } else if (!e.newSelection.length) {

        // default to root element
        const newElement = canvas.getRootElement();

        this.currentElement = newElement;

        this.update(newElement);
      } else {
        const newElement = e.newSelection[0];

        this.currentElement = newElement;

        this.update(newElement);
      }
    });

    eventBus.on([
      'commandStack.gitter.changeProperties.executed',
      'commandStack.gitter.changeProperties.reverted'
    ], (context) => {
      const element = context.context.element;

      if (element === this.currentElement) {
        this.update(element);
      }
    });

    eventBus.on([ 'shape.move.start', 'create.start' ], () => {
      this.ignoreSelectionChanges = true;
    });

    eventBus.on([
      'shape.move.end',
      'shape.move.ended',
      'create.end',
      'create.canceled'
    ], () => {
      this.ignoreSelectionChanges = false;
    });
  }

  init() {
    this.$propertiesPanel = domify(`
      <div class="properties-panel emitter">
        <div class="open"><i class="fa fa-bars" aria-hidden="true"></i></div>
        <div class="close"><i class="fa fa-times" aria-hidden="true"></i></div>
        <div class="title"></div>
        <div class="properties"></div>
      </div>
    `);

    Object.assign(this.$propertiesPanel.style, {
      width: this._gitterConfig.propertiesPanelWidth + 'px'
    });

    this.$closeIcon = domQuery('.close', this.$propertiesPanel);
    this.$title = domQuery('.title', this.$propertiesPanel);
    this.$properties = domQuery('.properties', this.$propertiesPanel);

    domEvent.bind(this.$propertiesPanel, 'mousedown', event => {
      event.stopPropagation();
    });

    domEvent.bind(this.$closeIcon, 'click', e => {
      this.close();

      e.stopPropagation();
    });

    domEvent.bind(this.$propertiesPanel, 'click', () => {
      if (this.isClosed) {
        this.open();
      }
    });

    this._canvas.getContainer().appendChild(this.$propertiesPanel);
  }

  open() {
    domClasses(this.$propertiesPanel).remove('closed');

    this.isClosed = false;

    this._eventBus.fire('gitter.propertiesPanel.open');
  }

  close() {
    domClasses(this.$propertiesPanel).add('closed');

    this.isClosed = true;

    this._eventBus.fire('gitter.propertiesPanel.close');
  }

  isOpen() {
    return this.isOpen;
  }

  update(element) {
    if (typeof element === 'undefined') {
      element = this._canvas.getRootElement();
    }

    // emitter
    if (isEmitter(element)) {
      this._eventBus.fire('propertiespanel.select', { element });

      domClasses(this.$propertiesPanel).remove('root');
      domClasses(this.$propertiesPanel).remove('listener');
      domClasses(this.$propertiesPanel).add('emitter');

      domClasses(this.$propertiesPanel).remove('inverted');

      this.$title.textContent = 'EMITTER';

      const options = [];

      const timeSignatures = this._gitterConfig.timeSignatures;

      const selectedOption = element.timeSignature;

      timeSignatures.forEach(timeSignature => {
        options.push({
          value: timeSignature.id,
          label: timeSignature.label
        });
      });

      // create emitter entries
      this.updateEntries([
        {
          type: 'select',
          label: 'Time Signature',
          selectedOption: element.timeSignature || options[0].value,
          options,
          onChange: value => {
            this.changeProperties(element, { timeSignature: value });
          }
        }
      ]);

    // listener
    } else if (isListener(element)) {
      this._eventBus.fire('propertiespanel.select', { element });

      domClasses(this.$propertiesPanel).remove('root');
      domClasses(this.$propertiesPanel).remove('emitter');
      domClasses(this.$propertiesPanel).add('listener');

      domClasses(this.$propertiesPanel).remove('inverted');

      this.$title.textContent = 'LISTENER';

      const options = [];

      const sounds = this._sounds.getAllSounds();

      const selectedOption = element.sound;

      Object.keys(sounds).forEach(key => {
        options.push({
          value: key,
          label: sounds[key].label
        });
      });

      // create listener entries
      this.updateEntries([
        {
          type: 'select',
          label: 'Sound',
          selectedOption: selectedOption || options[0].value,
          options,
          onChange: value => {
            this.changeProperties(element, { sound: value });
          }
        }
      ]);

    // root
    } else {
      this._eventBus.fire('propertiespanel.select', { element });

      domClasses(this.$propertiesPanel).remove('emitter');
      domClasses(this.$propertiesPanel).remove('listener');
      domClasses(this.$propertiesPanel).add('root');

      domClasses(this.$propertiesPanel).add('inverted');

      this.$title.textContent = 'ROOT';

      let oldTempo = undefined;

      // create root entries
      this.updateEntries([
        {
          type: 'range',
          label: 'Tempo',
          value: element.tempo,
          min: 70,
          max: 140,
          step: 1,
          onInput: value => {
            if (!oldTempo) {
              oldTempo = element.tempo;
            }

            element.tempo = value;

            this._eventBus.fire('gitter.propertiesPanel.tempoInput', {
              tempo: value
            });
          },
          onChange: value => {
            element.tempo = oldTempo;

            this.changeProperties(element, { tempo: value });

            oldTempo = undefined;
          }
        }
      ]);
    }
  }

  updateEntries(gitterConfig) {
    while (this.$properties.firstChild) {
      this.$properties.removeChild(this.$properties.firstChild);
    }

    gitterConfig.forEach(entryConfig => {
      const entry = this.entryFactory.createEntry(entryConfig);

      this.$properties.appendChild(entry);
    });
  }

  changeProperties(element, properties) {
    this._commandStack.execute('gitter.changeProperties', {
      element,
      properties
    });
  }
}

PropertiesPanel.$inject = [ 'eventBus', 'canvas', 'gitterConfig', 'commandStack', 'sounds' ];

module.exports = PropertiesPanel;
