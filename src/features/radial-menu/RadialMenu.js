import domEvent from 'min-dom/lib/event';
import domClasses from 'min-dom/lib/classes';
import domify from 'min-dom/lib/domify';

import { isEmitter, isListener } from '../../util/GitterUtil';

function calculateStep(numberOfEntries) {
  return 2 * Math.PI / numberOfEntries;
}

class RadialMenu {
  constructor(commandStack, gitterConfig, eventBus, modeling, overlays) {
    this._commandStack = commandStack;
    this._gitterConfig = gitterConfig;
    this._modeling = modeling;
    this._overlays = overlays;

    this.overlay = undefined;
    this.element = undefined;

    eventBus.on('selection.changed', ({ newSelection }) => {
      if (this.overlay) {
        overlays.remove(this.overlay);

        this.overlay = undefined;
      }

      // return if no single element selected
      if (newSelection.filter(e => isEmitter(e) || isListener(e)).length !== 1) {
        this.element = undefined;

        return;
      };

      const element = newSelection[0];

      // return if not listener
      if (!isEmitter(element) && !isListener(element)) {
        this.element = undefined;

        return;
      };

      this.element = element;

      this.updateOverlay(element)
    });
  }

  updateOverlay(element) {
    if (this.overlay) {
      this._overlays.remove(this.overlay);

      this.overlay = undefined;
    }

    const html = this.getOverlay(element);
    
    // TODO: fix, why -10?
    this.overlay = this._overlays.add(element, 'menu', {
      position: {
        top: -10,
        left: -10
      },
      html
    });
  }

  getOverlay(element) {
    const container = document.createElement('div');

    domClasses(container).add('radial-menu');

    //////////
    // Emitter
    //////////
    if (isEmitter(element)) {
      const entryDescriptors = [{
        onClick: () => {
          this._modeling.removeElements([ this.element ]);
        },
        addClasses: [ 'entry-remove' ],
        icon: this._gitterConfig.icons.remove
      }];

      this._gitterConfig.timeSignatures.forEach(timeSignature => {
        const addClasses = [ `entry-${timeSignature.id}` ];
        
        if (this.element.timeSignature === timeSignature.id) {
          addClasses.push('active');
        }

        entryDescriptors.push({
          onClick: () => {
            if (this.element.timeSignature === timeSignature.id) {
              return;
            }

            this._commandStack.execute('gitter.changeProperties', {
              element: this.element,
              properties: {
                timeSignature: timeSignature.id
              }
            });

            this.updateOverlay(this.element);
          },
          addClasses,
          label: timeSignature.label
        });
      });
      
      const entries = this.getEntries(entryDescriptors);

      this.appendEntries(container, entries);
    } else 
    
    //////////
    // Listener
    //////////
    if (isListener(element)) {
      const entryDescriptors = [{
        onClick: () => {
          this._modeling.removeElements([ this.element ]);
        },
        addClasses: [ 'entry-remove', ],
        icon: this._gitterConfig.icons.remove
      }];

      this._gitterConfig.sounds.forEach(sound => {
        const addClasses = [ `entry-${sound.id}` ];

        if (this.element.sound === sound.id) {
          addClasses.push('active');
        }

        entryDescriptors.push({
          onClick: () => {
            if (this.element.sound === sound.id) {
              return;
            }

            this._commandStack.execute('gitter.changeProperties', {
              element: this.element,
              properties: {
                sound: sound.id
              }
            });

            this.updateOverlay(this.element);
          },
          addClasses,
          icon: this._gitterConfig.icons[sound.id]
        });
      });

      const entries = this.getEntries(entryDescriptors);

      this.appendEntries(container, entries);
    }

    return container;
  }

  getEntries(entryDescriptors) {
    const { shapeSize } = this._gitterConfig;

    const entries = [];

    const step = calculateStep(entryDescriptors.length);
    
    entryDescriptors.forEach((descriptor, i) => {
      const entry = document.createElement('div');
      
      domClasses(entry).add('entry');

      const top = Math.cos(i * step) * shapeSize * 2;
      const left = Math.sin(i * step) * shapeSize * 2;
    
      Object.assign(entry.style, {
        top: (top + shapeSize / 2) + 'px',
        left: (left + shapeSize / 2) + 'px',
        width: shapeSize + 'px',
        height: shapeSize + 'px'
      });

      if (descriptor.onClick) {
        domEvent.bind(entry, 'click', descriptor.onClick);
      }

      if (descriptor.addClasses) {
        descriptor.addClasses.forEach(cls => {
          domClasses(entry).add(cls);
        })
      }

      if (descriptor.icon) {
        const icon = domify(descriptor.icon);
        
        entry.appendChild(icon);
      }

      if (descriptor.label) {
        const span = document.createElement('span');

        span.textContent = descriptor.label;

        entry.appendChild(span);
      }

      entries.push(entry);
    });

    return entries;
  }

  appendEntries(container, entries) {
    entries.forEach(entry => {
      container.appendChild(entry);
    });
  }
}

RadialMenu.$inject = [ 'commandStack', 'gitterConfig', 'eventBus', 'modeling', 'overlays' ];

export default RadialMenu;