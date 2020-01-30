const fs = require('fs');
const readlineSync = require('readline-sync');

const getParam = (opcodes, value, mode) => {
  if (mode === 0) {
    return opcodes[value];
  }
  return value;
};

const readOpcodes = opcodes => {
  let i = 0;

  while (i < opcodes.length) {
    const currentIndexNum = opcodes[i];
    const currentOpcodeString = currentIndexNum.toString();

    // The final two digits are the opcode.
    let opcode;
    if (currentOpcodeString.length === 1) {
      opcode = currentOpcodeString.charAt(0);
    } else if (currentOpcodeString.length > 1) {
      opcode = currentOpcodeString.substring(currentOpcodeString.length - 2);
    }

    // The 3rd digit is the first parameter's mode.
    let firstParamMode = 0;
    if (currentOpcodeString.length >= 3) {
      firstParamMode = parseInt(
        currentOpcodeString.charAt(currentOpcodeString.length - 3),
        10,
      );
    }

    // The 2nd digit is the second parameter's mode.
    let secondParamMode = 0;
    if (currentOpcodeString.length >= 4) {
      secondParamMode = parseInt(
        currentOpcodeString.charAt(currentOpcodeString.length - 4),
        10,
      );
    }

    // The 1st digit is the third parameter's mode.
    let thirdParamMode = 0;
    if (currentOpcodeString.length >= 5) {
      thirdParamMode = parseInt(
        currentOpcodeString.charAt(currentOpcodeString.length - 5),
        10,
      );
    }

    /* console.log('Opcode: ', opcode);
    console.log('First parameter mode: ', firstParamMode);
    console.log('Second parameter mode: ', secondParamMode);
    console.log('Third parameter mode: ', thirdParamMode); */

    const opcodeNumber = parseInt(opcode, 10);
    if (opcodeNumber === 1) {
      // sum
      const firstArg = getParam(opcodes, opcodes[i + 1], firstParamMode);
      const secondArg = getParam(opcodes, opcodes[i + 2], secondParamMode);
      const sum = firstArg + secondArg;
      opcodes[opcodes[i + 3]] = sum;
      i += 4;
    } else if (opcodeNumber === 2) {
      // multiply
      const firstArg = getParam(opcodes, opcodes[i + 1], firstParamMode);
      const secondArg = getParam(opcodes, opcodes[i + 2], secondParamMode);
      const product = firstArg * secondArg;
      opcodes[opcodes[i + 3]] = product;
      i += 4;
    } else if (opcodeNumber === 3) {
      // input
      const ans = readlineSync.question('Integer input: ');
      opcodes[opcodes[i + 1]] = parseInt(ans, 10);
      i += 2;
    } else if (opcodeNumber === 4) {
      // output
      const firstArg = getParam(opcodes, opcodes[i + 1], firstParamMode);
      console.log(firstArg);
      i += 2;
    } else if (opcodeNumber === 5) {
      // jump-if-true
      const firstArg = getParam(opcodes, opcodes[i + 1], firstParamMode);
      const secondArg = getParam(opcodes, opcodes[i + 2], secondParamMode);
      if (firstArg !== 0) {
        i = secondArg;
      } else {
        i += 3;
      }
    } else if (opcodeNumber === 6) {
      // jump-if-false
      const firstArg = getParam(opcodes, opcodes[i + 1], firstParamMode);
      const secondArg = getParam(opcodes, opcodes[i + 2], secondParamMode);
      if (firstArg === 0) {
        i = secondArg;
      } else {
        i += 3;
      }
    } else if (opcodeNumber === 7) {
      // less than
      const firstArg = getParam(opcodes, opcodes[i + 1], firstParamMode);
      const secondArg = getParam(opcodes, opcodes[i + 2], secondParamMode);
      let valueToStore = 0;
      if (firstArg < secondArg) {
        valueToStore = 1;
      }
      opcodes[opcodes[i + 3]] = valueToStore;
      i += 4;
    } else if (opcodeNumber === 8) {
      // equals
      const firstArg = getParam(opcodes, opcodes[i + 1], firstParamMode);
      const secondArg = getParam(opcodes, opcodes[i + 2], secondParamMode);
      let valueToStore = 0;
      if (firstArg === secondArg) {
        valueToStore = 1;
      }
      opcodes[opcodes[i + 3]] = valueToStore;
      i += 4;
    } else if (opcodeNumber === 99) {
      // end
      break;
    } else {
      console.log("That's weird...", opcodeNumber);
      break;
    }
  }

  return opcodes;
};

fs.readFile('./input.txt', 'utf8', (_, data) => {
  const originalMemory = data
    .trim()
    .split(',')
    .map(n => parseInt(n));
  readOpcodes(originalMemory);
});
