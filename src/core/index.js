import GitterRenderer from './GitterRenderer';
import Audio from './Audio';
import GitterElementFactory from './GitterElementFactory';
import Sounds from './Sounds';
import LoadingOverlay from './LoadingOverlay';
import ExportConfig from './ExportConfig';

export default {
  __init__: [
    'gitterRenderer',
    'audio',
    'gitterElementFactory',
    'sounds',
    'loadingOverlay',
    'exportConfig'
  ],
  gitterRenderer: [ 'type', GitterRenderer ],
  audio: [ 'type', Audio ],
  gitterElementFactory: [ 'type', GitterElementFactory ],
  sounds: [ 'type', Sounds ],
  loadingOverlay: [ 'type', LoadingOverlay ],
  exportConfig: [ 'type', ExportConfig ]
};
