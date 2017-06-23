import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import { isEmitter, isListener } from '../../util/GitterUtil';
import { getSequence } from '../../util/SequenceUtil';
import { getDistance } from '../../util/GeometryUtil';

class Sequences extends CommandInterceptor {
  constructor(audio, config, eventBus) {
    super(eventBus);

    const { maxDistance, offsetDistance } = config;

    // connection create
    this.postExecute('connection.create', event => {
      const { source, target } = event.context;

      const distance = getDistance(source, target);

      const sequence = getSequence(distance, maxDistance, offsetDistance);

      audio.addSequence(sequence, source, target);
    });

    // connection update

    // connection delete
    this.postExecute('connection.delete', event => {
      const { source, target } = event.context;

      audio.removeSequence(source, target);
    });

    // properties update
  }
}

Sequences.$inject = [ 'audio', 'config', 'eventBus' ];

module.exports = Sequences;
