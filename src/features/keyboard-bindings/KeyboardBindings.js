import domEvent from 'min-dom/lib/event';

class KeyboardBindings {
  constructor(eventBus, keyboard, canvas, elementRegistry, selection, lassoTool, handTool) {
    this._canvas = canvas;
    this._elementRegistry = elementRegistry;
    this._selection = selection;

    let handToolActive = false;

    domEvent.bind(document, 'keydown', e => {
      if (!handToolActive && e.keyCode === 32) {
        handTool.toggle();

        handTool.activateMove();

        handToolActive = true;

        e.stopPropagation();
      }
    });

    domEvent.bind(document, 'keyup', e => {
      if (handToolActive && e.keyCode === 32) {
        handTool.toggle();

        handToolActive = false;

        e.stopPropagation();
      }
    });

    keyboard.addListener((key, modifiers) => {

      // ctrl + a -> select all elements
      if (key === 65 && keyboard.isCmd(modifiers)) {
        this.selectAllElements();

        return true;
      }

      // l -> activate lasso tool
      if (key === 76) {
        lassoTool.toggle();

        return true;
      }

      // 72 -> toggle help overlay
      if (key === 72) {
        eventBus.fire('helpOverlay.toggle');

        return true;
      }

      // 27 -> clear selection
      if (key === 27) {

        if (this._selection.get().length) {
          this._selection.select(null);
        }
      }

     });
  }

  selectAllElements() {
    const rootElement = this._canvas.getRootElement();

    const elements = this._elementRegistry.filter(function(element) {
      return element !== rootElement;
    });

    this._selection.select(elements);

    return elements;
  }
}

KeyboardBindings.$inject = [
  'eventBus',
  'keyboard',
  'canvas',
  'elementRegistry',
  'selection',
  'lassoTool',
  'handTool'
];

module.exports = KeyboardBindings;
