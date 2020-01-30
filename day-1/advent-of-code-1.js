const fs = require('fs');

fs.readFile('./input.txt', 'utf8', (err, data) => {
  const numbers = data.trim().split('\n');
  let sum = 0;
  numbers.forEach(n => {
    let startingMass = n;
    while (startingMass > 0) {
      const fuelRequirement = (Math.floor(startingMass / 3)) - 2;
      if (fuelRequirement > 0) {
        sum += fuelRequirement;
      }
      startingMass = fuelRequirement;
      console.log(startingMass);
    }
  });
  console.log('SUM: ', sum);
});
