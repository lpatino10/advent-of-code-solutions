const fs = require("fs");

const readOpcodes = (opcodes) => {
  let i = 0;

  while (i < opcodes.length) {
    const currentOpcode = opcodes[i];
    if (currentOpcode === 1) {
      const sum = opcodes[opcodes[i + 1]] + opcodes[opcodes[i + 2]];
      opcodes[opcodes[i + 3]] = sum;
      i += 4;
    } else if (currentOpcode === 2) {
      const product = opcodes[opcodes[i + 1]] * opcodes[opcodes[i + 2]];
      opcodes[opcodes[i + 3]] = product;
      i += 4;
    } else if (currentOpcode === 99) {
      break;
    } else {
      console.log('That\'s weird...', currentOpcode);
      break;
    }
  }

  return opcodes;
}

fs.readFile("./input.txt", "utf8", (err, data) => {
  const originalMemory = data.trim().split(",").map(n => parseInt(n));
  const goalResult = 19690720;
  let noun = 0;
  let verb = 0;
  let foundNoun = false;
  let foundVerb = false;

  while (!foundNoun || !foundVerb) {
    const testInput = originalMemory.slice();
    testInput[1] = noun;
    testInput[2] = verb;
    const result = readOpcodes(testInput)[0];

    if (result > goalResult) {
      if (!foundNoun) {
        noun -= 1;
        foundNoun = true;
        verb++;
      }
    } else if (result < goalResult) {
      if (!foundNoun) {
        noun++;
      } else {
        verb++;
      }
    } else {
      console.log(result);
      foundNoun = true;
      foundVerb = true;
    }
  }
  //console.log(readOpcodes(originalMemory));

  console.log('Noun:', noun);
  console.log('Verb:', verb);
});
