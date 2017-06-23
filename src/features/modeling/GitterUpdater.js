import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import { isEmitter, isListener } from '../../util/GitterUtil';

class GitterUpdater extends CommandInterceptor{
  constructor(eventBus) {
    super(eventBus);

    this.executed('gitter.changeProperties', ({ context }) => {
      const { element, oldProperties, properties } = context;

      if (isEmitter(element)) {

        // update time signature
        if (properties.timeSignature) {
          console.log('changed sound');
        }
      } else if (isListener(element)) {

        // update sound
        if (properties.sound) {
          console.log('changed timeSignature');
        }
      }
    });
  }
}

GitterUpdater.$inject = [ 'eventBus' ];

module.exports = GitterUpdater;
