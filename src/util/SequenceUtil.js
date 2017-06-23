const STEP_FIELDS = 16;

function zeros(length) {
  let array = [];

  for(let i = 0; i < length; i++) {
    array = [ ...array, 0 ];
  }

  return array;
}

export function getSequence(distance, maxDistance, offsetDistance, timeSignature) {
  let index = Math.floor(STEP_FIELDS / (maxDistance - offsetDistance) * distance);

  const sequence = zeros(STEP_FIELDS);
  index = Math.min(index, 15);

  // time signature 1/2 -> length = 8
  // time signature 1/4 -> length = 4
  // time signature 1/8 -> length = 2
  // time signature 1/16 -> length = 1
  const length = STEP_FIELDS / timeSignature;

  // index 10, time signature 1/2 -> index = Math.floor(10 / 8) * 8 -> 8
  // index 10, time signature 1/8 -> index = Math.floor(10 / 2) * 2 -> 10
  index = Math.floor(index / length) * length;

  sequence[index] = 1;

  return sequence;
}

export function getSequenceFromSequences(sequences) {
  const sequence = zeros(STEP_FIELDS);

  Object.values(sequences).forEach(value => {

    value.forEach((step, index) => {
      sequence[index] = step ? step : sequence[index];
    });

  });

  return sequence;
}
