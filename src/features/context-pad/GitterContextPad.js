import { isConnection } from '../../util/GitterUtil';

class GitterContextPad {
  constructor(contextPad, modeling) {
    this._modeling = modeling;

    contextPad.registerProvider(this);
  }

  getContextPadEntries(element) {
    const actions = {};

    const removeElement = () => {
      this._modeling.removeElements([ element ]);
    }

    if (!isConnection(element)) {
      Object.assign(actions, {
        'delete': {
          group: 'edit',
          className: 'bpmn-icon-trash',
          title: 'Remove',
          action: {
            click: removeElement,
            dragstart: removeElement
          }
        }
      });
    }

    return actions;
  };
}

GitterContextPad.$inject = [
  'contextPad',
  'modeling'
];

module.exports = GitterContextPad;
