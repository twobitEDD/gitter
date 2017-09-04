import removeSvg from '../assets/icons/remove.svg';

export default {
  maxDistance: 400, // px
  offsetDistance: 20, // px
  emitterColor: '#34D1BF',
  listenerColor: '#D1345B',
  shapeSize: 20, // px
  minTempo: 70, // bpm
  maxTempo: 140, // bpmn
  initialTempo: 120, // bpm
  initialTimeSignature: '8',
  timeSignatures: [
    { id: '2', label: '1/2' },
    { id: '4', label: '1/4' },
    { id: '8', label: '1/8' },
    { id: '16', label: '1/16' },
  ],
  initialSound: undefined,
  initialSoundKit: 'alphabetical',
  soundKits: {
    'alphabetical': {
      label: 'Alphabetical',
      sounds: [
        { id: 'kick', label: 'Kick', path: './audio/alphabetical/kick.wav' },
        { id: 'clap', label: 'Clap', path: './audio/alphabetical/clap.wav' },
        { id: 'snare', label: 'Snare', path: './audio/alphabetical/snare.wav' },
        { id: 'closedhat', label: 'Closed Hihat', path: './audio/alphabetical/closedhat.wav' },
        { id: 'openhat', label: 'Open Hihat', path: './audio/alphabetical/openhat.wav' },
        { id: 'tom', label: 'Tom', path: './audio/alphabetical/tom.wav' }
      ]
    },
    'glitch-baby': {
      label: 'Glitch Baby',
      sounds: [
        { id: 'kick', label: 'Kick', path: './audio/glitch-baby/kick.wav' },
        { id: 'clap', label: 'Clap', path: './audio/glitch-baby/clap.wav' },
        { id: 'snare', label: 'Snare', path: './audio/glitch-baby/snare.wav' },
        { id: 'closedhat', label: 'Closed Hihat', path: './audio/glitch-baby/closedhat.wav' },
        { id: 'openhat', label: 'Open Hihat', path: './audio/glitch-baby/openhat.wav' },
        { id: 'tom', label: 'Tom', path: './audio/glitch-baby/tom.wav' }
      ]
    },
    'alkaloid': {
      label: 'Alkaloid',
      sounds: [
        { id: 'kick', label: 'Kick', path: './audio/alkaloid/kick.wav' },
        { id: 'clap', label: 'Clap', path: './audio/alkaloid/clap.wav' },
        { id: 'snare', label: 'Snare', path: './audio/alkaloid/snare.wav' },
        { id: 'closedhat', label: 'Closed Hihat', path: './audio/alkaloid/closedhat.wav' },
        { id: 'openhat', label: 'Open Hihat', path: './audio/alkaloid/openhat.wav' },
        { id: 'tom', label: 'Tom', path: './audio/alkaloid/tom.wav' }
      ]
    },
    // 'bottle-poppin': {
    //   label: 'Bottle Poppin',
    //   sounds: []
    // },
    // 'ganja': {
    //   label: 'Ganja',
    //   sounds: []
    // }
  },
  icons: {
    remove: removeSvg
  }
};
