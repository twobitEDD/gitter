const STEPS = 16;

function zeros(length) {
  let array = [];

  for(let i = 0; i < length; i++) {
    array = [ ...array, 0 ];
  }

  return array;
}

export function getSequence(distance, maxDistance, offsetDistance) {
  let index = Math.floor(STEPS / (maxDistance - offsetDistance) * distance);

  const sequence = zeros(STEPS);
  sequence[index] = 1;

  index = Math.min(index, 15);

  return sequence;
}

export function getSequenceFromSequences(sequences) {
  const sequence = zeros(STEPS);

  Object.values(sequences).forEach(value => {

    value.forEach((step, index) => {
      sequence[index] = step ? step : sequence[index];
    });

  });

  return sequence;
}
