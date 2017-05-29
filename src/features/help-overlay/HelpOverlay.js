import domify from 'min-dom/lib/domify';
import domEvent from 'min-dom/lib/event';
import domClasses from 'min-dom/lib/classes';
import domQuery from 'min-dom/lib/query';

import { isRoot } from '../../util/GitterUtil';

class HelpOverlay {
  constructor(eventBus) {
    this.isHidden = true;

    const $helpIcon = domify(`
      <div id="help-icon">
        <i class="fa fa-question"></i>
      </div>
    `);

    document.body.appendChild($helpIcon);

    const $helpOverlay = domify(`
      <div id="help-overlay" class="hidden">
        <div class="close-icon">
          <i class="fa fa-times"></i>
        </div>
        <div class="title"><i class="fa fa-question"></i> Instructions</div>
        <div class="align-vertical">
          <div class="icon-gitter-emitter"></div>
          <span>Emits a signal that is transported to all connected listeners.</span>
        </div>
        <div class="align-vertical">
          <div class="icon-gitter-listener"></div>
          <span>Receives signals and playes a sound.</span>
        </div>
        <div class="title mt-20"><i class="fa fa-keyboard-o"></i> Keyboard Shortcuts</div>
        <table class="shortcuts">
          <tr>
            <td class="shortcut">CTRL + Z</td>
            <td> - </td>
            <td class="function">Undo</td>
          </tr>
          <tr>
            <td class="shortcut">CTRL + Y</td>
            <td> - </td>
            <td class="function">Redo</td>
          </tr>
          <tr>
            <td class="shortcut">CTRL + A</td>
            <td> - </td>
            <td class="function">Select All</td>
          </tr>
          <tr>
            <td class="shortcut">DEL</td>
            <td> - </td>
            <td class="function">Remove Selection</td>
          </tr>
          <tr>
            <td class="shortcut">L</td>
            <td> - </td>
            <td class="function">Toggle Lasso</td>
          </tr>
          <tr>
            <td class="shortcut">SPACE</td>
            <td> - </td>
            <td class="function">Toggle Pan</td>
          </tr>
          <tr>
            <td class="shortcut">H</td>
            <td> - </td>
            <td class="function">Toggle Help</td>
          </tr>
        </table>
        <div class="title mt-20"><i class="fa fa-info"></i> About</div>
        <div>
          Built with <i class="fa fa-heart"></i> by Philipp Fromme.
        </div>
        <div class="title mt-20"><i class="fa fa-external-link"></i> Links</div>
        <div class="mt-10">
          <i class="fa fa-github"></i> <a href="https://github.com/philippfromme/gitter" target="_blank" class="link">GitHub</a>
        </div>
      </div>
    `);

    document.body.appendChild($helpOverlay);

    eventBus.on('propertiespanel.select', ({ element }) => {
      if (isRoot(element)) {
        domClasses($helpIcon).add('inverted');
      } else {
        domClasses($helpIcon).remove('inverted');
      }
    });

    domEvent.bind($helpIcon, 'click', () => {
      domClasses($helpOverlay).remove('hidden');
      this.isHidden = false;
    });

    const $closeIcon = domQuery('.close-icon', $helpOverlay);

    domEvent.bind($closeIcon, 'click', () => {
      domClasses($helpOverlay).add('hidden');
      this.isHidden = true;
    });

    domEvent.bind(document, 'keydown', e => {
      if (e.keyCode === 27 && !this.isHidden) {
        domClasses($helpOverlay).add('hidden');
        this.isHidden = true;

        e.stopPropagation();
      }
    });

    eventBus.on('helpOverlay.toggle', () => {
      if (this.isHidden) {
        domClasses($helpOverlay).remove('hidden');
        this.isHidden = false;
      } else {
        domClasses($helpOverlay).add('hidden');
        this.isHidden = true;
      }
    });
  }
}

HelpOverlay.$inject = [ 'eventBus' ];

module.exports = HelpOverlay;
