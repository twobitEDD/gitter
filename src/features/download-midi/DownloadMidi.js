import Midi from 'jsmidgen';
import FileSaver from 'file-saver';

import domify from 'min-dom/lib/domify';
import domEvent from 'min-dom/lib/event';
import domClasses from 'min-dom/lib/classes';

import { isRoot } from '../../util/GitterUtil';
import { getSequenceFromSequences } from '../../util/SequenceUtil';

const NOTES = [ 'c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b' ];
const SEMI_TONES = 12;
const MEASURES = 16;

function getNoteFromIndex(index) {
  const noteIndex = index % SEMI_TONES;
  const octaveIndex = Math.floor(index / SEMI_TONES) + 3;
  
  return NOTES[noteIndex] + octaveIndex;
}

class DownloadMidi {
  constructor(eventBus, canvas, audio) {
    this._audio = audio;

    const $downloadIcon = domify(`
      <div id="download-icon">
        <i class="fa fa-download"></i>
      </div>
    `);

    document.body.appendChild($downloadIcon);

    eventBus.on('propertiespanel.select', ({ element }) => {
      if (isRoot(element)) {
        domClasses($downloadIcon).add('inverted');
      } else {
        domClasses($downloadIcon).remove('inverted');
      }
    });

    domEvent.bind($downloadIcon, 'click', () => {
      this.saveMidi();
    });
  }

  saveMidi() {
    const file = new Midi.File();
    var track = new Midi.Track();
    file.addTrack(track);

    const allPhrases = this._audio.getAllPhrases();

    const sequences = [];

    Object.values(allPhrases).forEach(phrase => {
      const sequence = getSequenceFromSequences(phrase);

      sequences.push(sequence);
    });

    for (let i = 0; i < MEASURES; i++) {
      const chord = [];

      sequences.forEach((sequence, sequenceIndex) => {
        if (sequence[i]) {
          chord.push(getNoteFromIndex(sequenceIndex));
        }
      });

      if (chord.length) {
        track.addChord(0, chord, 32);
      } else {
        track.noteOff(0, '', 32);
      }
    }

    FileSaver.saveAs(new Blob([
      new Uint8Array([].map.call(file.toBytes(), c => {
        return c.charCodeAt(0);
      })).buffer
    ], {
      type: 'application/x-midi'
    }) , 'gitter.mid' );
  }
}

DownloadMidi.$inject = [ 'eventBus', 'canvas', 'audio' ];

export default DownloadMidi;