import GitterUpdater from './GitterUpdater';
import Modeling from './Modeling';

module.exports = {
  __init__: [ 'gitterUpdater', 'gitterModeling' ],
  gitterUpdater: [ 'type', GitterUpdater ],
  gitterModeling: [ 'type', Modeling ]
};
