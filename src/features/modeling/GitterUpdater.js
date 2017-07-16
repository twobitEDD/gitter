import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import ChangeRootPropertiesHandler from './cmd/ChangeRootPropertiesHandler';
import ChangeListenerPropertiesHandler from './cmd/ChangeListenerPropertiesHandler';

import { isRoot, isEmitter, isListener } from '../../util/GitterUtil';
import { getSequence } from '../../util/SequenceUtil';
import { getDistance } from '../../util/GeometryUtil';

function connected(source, target) {
  if (!source.outgoing.length || !target.incoming.length) {
    return false;
  }

  let connected = false;

  source.outgoing.forEach(outgoing => {
    target.incoming.forEach(incoming => {
      if (outgoing === incoming) {
        connected = true;
      }
    })
  });

  return connected;
}

class GitterUpdater extends CommandInterceptor {
  constructor(eventBus, commandStack, audio, sounds, elementRegistry, gitterConfig) {
    super(eventBus);

    const { maxDistance, offsetDistance } = gitterConfig;

    commandStack.registerHandler('gitter.changeRootProperties', ChangeRootPropertiesHandler);
    commandStack.registerHandler('gitter.changeListenerProperties', ChangeListenerPropertiesHandler);

    const mainPart = audio.getMainPart();

    this.postExecute('gitter.changeProperties', ({ context }) => {
      const { element, oldProperties, properties } = context;

      if (isRoot(element)) {
        commandStack.execute('gitter.changeRootProperties', {
          mainPart,
          oldProperties,
          properties
        });

      } else if (isEmitter(element)) {

        // update time signature
        if (properties.timeSignature) {
          const listeners = elementRegistry.filter(e => {
            return isListener(e) && connected(element, e);
          });

          listeners.forEach(listener => {
            const distance = getDistance(element, listener);

            const sequence = getSequence(distance, maxDistance, offsetDistance, properties.timeSignature);

            audio.updateSequence(sequence, element, listener);
          });
        }
      } else if (isListener(element)) {
        const onPlay = () => {
          eventBus.fire('gitter.audio.playSound', {
            listener: element
          });
        };

        commandStack.execute('gitter.changeListenerProperties', {
          mainPart,
          listener: element,
          oldProperties,
          properties,
          sounds,
          onPlay
        });
      }
    });
  }
}

GitterUpdater.$inject = [
  'eventBus',
  'commandStack',
  'audio',
  'sounds',
  'elementRegistry',
  'gitterConfig'
];

module.exports = GitterUpdater;
