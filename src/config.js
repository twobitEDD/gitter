import clapSvg from '../assets/icons/clap.svg';
import closedhatSvg from '../assets/icons/closedhat.svg';
import kickSvg from '../assets/icons/kick.svg';
import openhatSvg from '../assets/icons/openhat.svg';
import removeSvg from '../assets/icons/remove.svg';
import snareSvg from '../assets/icons/snare.svg';
import tomSvg from '../assets/icons/tom.svg';

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
  sounds: [
    { id: 'kick', label: 'Kick', path: './audio/kick-2.wav' },
    { id: 'clap', label: 'Clap', path: './audio/clap-2.wav' },
    { id: 'snare', label: 'Snare', path: './audio/snare.wav' },
    { id: 'closedhat', label: 'Closed Hihat', path: './audio/closedhat-2.wav' },
    { id: 'openhat', label: 'Open Hihat', path: './audio/openhat-1.wav' },
    { id: 'tom', label: 'Tom', path: './audio/tom-1.wav' }
  ],
  icons: {
    clap: clapSvg,
    closedhat: closedhatSvg,
    kick: kickSvg,
    openhat: openhatSvg,
    remove: removeSvg,
    snare: snareSvg,
    tom: tomSvg
  }
};
