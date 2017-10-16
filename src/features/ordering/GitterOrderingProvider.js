import OrderingProvider from 'diagram-js/lib/features/ordering/OrderingProvider';

import find from 'lodash/find';
import findIndex from 'lodash/findIndex';

import { isConnection } from '../../util/GitterUtil';

class GitterOrderingProvider extends OrderingProvider {
  constructor(eventBus) {
    super(eventBus);

    this.getOrdering = (element, newParent) => {
      if (isConnection(element)) {
        return {
          index: 0,
          newParent
        };
      } else {
        const index = newParent.children.length - 1;
        return {
          index,
          newParent
        };
      }
    }
  }
}

GitterOrderingProvider.$inject = [ 'eventBus' ];

export default GitterOrderingProvider;
