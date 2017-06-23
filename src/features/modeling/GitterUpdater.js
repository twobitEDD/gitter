import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import ChangeRootPropertiesHandler from './cmd/ChangeRootPropertiesHandler';
import ChangeListenerProperties from './cmd/ChangeListenerProperties';

import { isRoot, isEmitter, isListener } from '../../util/GitterUtil';

class GitterUpdater extends CommandInterceptor {
  constructor(eventBus, commandStack, audio, sounds) {
    super(eventBus);

    commandStack.registerHandler('gitter.changeRootProperties', ChangeRootPropertiesHandler);
    commandStack.registerHandler('gitter.changeListenerProperties', ChangeListenerProperties);

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
          console.log('changed timeSignature');
        }
      } else if (isListener(element)) {
        commandStack.execute('gitter.changeListenerProperties', {
          mainPart,
          listener: element,
          oldProperties,
          properties,
          sounds
        });
      }
    });
  }
}

GitterUpdater.$inject = [ 'eventBus', 'commandStack', 'audio', 'sounds' ];

module.exports = GitterUpdater;
