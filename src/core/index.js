module.exports = {
  __init__: [ 'gitterRenderer', 'audio', 'gitterElementFactory', 'sounds', 'loadingOverlay' ],
  gitterRenderer: [ 'type', require('./GitterRenderer') ],
  audio: [ 'type', require('./Audio') ],
  gitterElementFactory: [ 'type', require('./GitterElementFactory') ],
  sounds: [ 'type', require('./Sounds') ],
  loadingOverlay: [ 'type', require('./LoadingOverlay') ]
};
