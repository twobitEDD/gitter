const p5 = require('p5');
require('p5/lib/addons/p5.sound.js');

class Sounds {
  constructor(eventBus, config, loadingOverlay) {
    this._eventBus = eventBus;
    this._config = config;
    this._loadingOverlay = loadingOverlay;

    this._sounds = {};

    this.loadSounds();
  }

  loadSounds() {
    this._loadingOverlay.addLoadingComponent(this);

    this._eventBus.fire('gitter.sounds.loading');

    let numberLoading = 0;

    this._config.sounds.forEach(s => {
      numberLoading++;

      const sound = p5.prototype.loadSound(s.path, () => {
        numberLoading--;

        if (numberLoading === 0) {
          this._loadingOverlay.removeLoadingComponent(this);

          this._eventBus.fire('gitter.sounds.loaded');
        }
      });

      this._sounds[s.id] = {
        sound,
        label: s.label
      };
    });
  }

  getSound(soundId) {
    if (this._sounds[soundId]) {
      return this._sounds[soundId];
    }
  }

  getAllSounds() {
    return this._sounds;
  }
}

Sounds.$inject = [ 'eventBus', 'config', 'loadingOverlay' ];

module.exports = Sounds;
