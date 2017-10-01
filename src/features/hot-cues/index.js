module.exports = {
  __init__: [ 'progressIndicator', 'hotCues' ],
  progressIndicator: [ 'type', require('./ProgressIndicator') ],
  hotCues: [ 'type', require('./HotCues') ],
};
