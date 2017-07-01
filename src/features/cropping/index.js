import Cropping from './Cropping';
import GitterConnectionCropping from './GitterConnectionCropping';

module.exports = {
  __init__: [ 'cropping', 'gitterConnectionCropping' ],
  cropping: [ 'type', Cropping ],
  gitterConnectionCropping: [ 'type', GitterConnectionCropping ]
};
