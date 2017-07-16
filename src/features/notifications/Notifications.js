import domify from 'min-dom/lib/domify';
import  domAttr from 'min-dom/lib/attr';
import  domQuery from 'min-dom/lib/query';
import  domEvent from 'min-dom/lib/event';
import  domClasses from 'min-dom/lib/classes';

const IGNORED_COMMANDS = [
  'shape.move',
  'shape.delete',
  'connection.create',
  'connection.layout',
  'connection.move',
  'connection.delete',
  'gitter.changeRootProperties',
  'gitter.changeEmitterProperties',
  'gitter.changeListenerProperties',
  'gitter.audio.addSequence',
  'gitter.audio.removeSequence',
  'gitter.audio.updateSequence'
];

class Notifications {
  constructor(eventBus, canvas, propertiesPanel, gitterConfig, commandStack) {
    this._eventBus = eventBus;
    this._canvas = canvas;
    this._propertiesPanel = propertiesPanel;
    this._gitterConfig = gitterConfig;
    this._commandStack = commandStack;

    this.timesExecuted = 0;
    this.revertedCommands = [];

    this.init();

    eventBus.on('commandStack.reverted', (context) => {
      const command = context.command;

      if (IGNORED_COMMANDS.includes(command)) {
        return;
      }

      this.revertedCommands.push(context.context);

      this.showNotification('Undo');
    });

    eventBus.on('commandStack.execute', (context) => {
      const command = context.command;

      if (IGNORED_COMMANDS.includes(command)) {
        return;
      }

      if (context.context === this.revertedCommands[this.revertedCommands.length - 1]) {
        this.revertedCommands.pop();

        this.showNotification('Redo');
      }
    });
  }

  init() {
    this.$parent = domify(`
      <div class="notifications"></div>
    `);

    const propertiesPanelOpen = this._propertiesPanel.isOpen();

    const rightOpen = 10 + this._gitterConfig.propertiesPanelWidth;
    const rightClosed = 10 + this._gitterConfig.propertiesPanelWidthClosed;

    this.$parent.style.right = '' + (propertiesPanelOpen ? rightOpen : rightClosed) + 'px';

    this._eventBus.on('gitter.propertiesPanel.open', () => {
      this.$parent.style.right = '' + rightOpen + 'px';
    });

    this._eventBus.on('gitter.propertiesPanel.close', () => {
      this.$parent.style.right = '' + rightClosed + 'px';
    });

    this._canvas.getContainer().appendChild(this.$parent);
  }

  showNotification(text) {
    const $notification = domify(`
      <div class="notification">
        ${text}
      </div>
    `);

    this.$parent.appendChild($notification);

    domEvent.bind($notification, 'click', () => {
      $notification.remove();
    });

    setTimeout(() => {
      $notification.remove();
    }, this._gitterConfig.notificationTimeToLive);
  }
}

Notifications.$inject = [ 'eventBus', 'canvas', 'propertiesPanel', 'gitterConfig', 'commandStack' ];

module.exports = Notifications;
