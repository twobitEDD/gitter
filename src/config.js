export default {
  maxDistance: 400, // px
  offsetDistance: 20, // px
  emitterColor: '#34D1BF',
  listenerColor: '#D1345B',
  shapeSize: 20, // px
  propertiesPanelWidth: 220, // px
  propertiesPanelWidthClosed: 34, // px
  initialTempo: 120, // bpm
  notificationTimeToLive: 3000, // ms
  initialTimeSignature: '8',
  timeSignatures: [
    { id: '2', label: '1/2' },
    { id: '4', label: '1/4' },
    { id: '8', label: '1/8' },
    { id: '16', label: '1/16' },
  ],
  initialSound: 'kick-1',
  sounds: [
    { id: 'kick-1', label: 'Kick 1', path: './audio/kick-1.wav' },
    { id: 'kick-2', label: 'Kick 2', path: './audio/kick-2.wav' },
    { id: 'clap-1', label: 'Clap 1', path: './audio/clap-1.wav' },
    { id: 'clap-2', label: 'Clap 2', path: './audio/clap-2.wav' },
    { id: 'snare', label: 'Snare', path: './audio/snare.wav' },
    { id: 'closedhat-1', label: 'Closed Hihat 1', path: './audio/closedhat-1.wav' },
    { id: 'closedhat-2', label: 'Closed Hihat 2', path: './audio/closedhat-2.wav' },
    { id: 'openhat-1', label: 'Open Hihat', path: './audio/openhat-1.wav' },
    { id: 'tom-1', label: 'Tom 1', path: './audio/tom-1.wav' },
    { id: 'tom-2', label: 'Tom 2', path: './audio/tom-2.wav' },
    { id: 'impact', label: 'FX', path: './audio/impact.wav' }
    ]
};
