const isPasswordCandidate = number => {
  const numberString = number.toString();
  let previousDigit;
  let currentConsecutiveDigits = 1;
  let foundSameAdjacentDigits = false;
  let neverDecreases = true;

  numberString.split('').forEach(digit => {
    if (previousDigit && previousDigit === digit) {
      currentConsecutiveDigits += 1;
    } else if (previousDigit && previousDigit !== digit) {
      if (currentConsecutiveDigits === 2) {
        foundSameAdjacentDigits = true;
      }
      currentConsecutiveDigits = 1;
    }

    if (previousDigit && parseInt(previousDigit, 10) > parseInt(digit, 10)) {
      neverDecreases = false;
    }

    previousDigit = digit;
  });

  if (
    (foundSameAdjacentDigits || currentConsecutiveDigits === 2) &&
    neverDecreases
  ) {
    return true;
  }
  return false;
};

const input = '278384-824795';
//const input = '111122-111122';
const [lowerBound, upperBound] = input.split('-');

let numberOfCandidates = 0;
for (let i = lowerBound; i <= upperBound; i++) {
  if (isPasswordCandidate(i)) {
    numberOfCandidates++;
  }
}

console.log(`There are ${numberOfCandidates} possible passwords.`);
