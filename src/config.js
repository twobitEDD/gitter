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
  initialSound: 'kick-606',
  sounds: [
    { id: 'kick-606', label: 'Kick 606', path: './audio/kick-606.mp3' },
    { id: 'snare-606', label: 'Snare 606', path: './audio/snare-606.mp3' },
    { id: 'closedhat-606', label: 'Closed Hihat 606', path: './audio/closedhat-606.mp3' }
  ]
};
