const fs = require("fs");

const appendSets = (setA, setB) => {
  setB.forEach(n => setA.add(n));
  return setA;
};

const getCoordinatesFromMovement = (
  currentCoords,
  direction,
  distance,
  currentWireDistance
) => {
  let coords = [];
  let [currentX, currentY] = currentCoords;

  let changingHorizontal = true;
  let sum = 0;
  if (direction === "L") {
    sum = -1;
  } else if (direction === "R") {
    sum = 1;
  } else if (direction === "U") {
    sum = 1;
    changingHorizontal = false;
  } else if (direction === "D") {
    sum = -1;
    changingHorizontal = false;
  } else {
    console.log("uhhhh ¯\\_(ツ)_/¯");
  }

  for (let i = distance; i > 0; i--) {
    currentX = changingHorizontal ? currentX + sum : currentX;
    currentY = changingHorizontal ? currentY : currentY + sum;
    currentWireDistance += 1;
    coords.push({
      coord: `${currentX},${currentY}`,
      distance: currentWireDistance
    });
  }

  return {
    coords,
    lastCoord: [currentX, currentY]
  };
};

const getWireCoordinates = wireMovements => {
  let coords = [];
  let currentCoords = [0, 0];
  let currentWireDistance = 0;
  wireMovements.forEach(movement => {
    const direction = movement.substring(0, 1);
    const distance = parseInt(movement.substring(1));
    const movementCoords = getCoordinatesFromMovement(
      currentCoords,
      direction,
      distance,
      currentWireDistance
    );
    coords = coords.concat(movementCoords.coords);

    const lastCoord = movementCoords[movementCoords.length - 1];
    currentCoords = movementCoords.lastCoord;
    currentWireDistance += distance;
  });

  return coords;
};

const getIntersection = (firstWire, secondWire) => {
  let intersection = new Set();
  secondWire.forEach(coordObj => {
    const matchingCoord = firstWire.find(c => c.coord === coordObj.coord);
    if (matchingCoord !== undefined) {
      intersection.add({
        coord: matchingCoord.coord,
        distance: coordObj.distance + matchingCoord.distance
      });
    }
  });
  return intersection;
};

const findClosestIntersection = intersections => {
  let smallestSum = 10000000;
  intersections.forEach(i => {
    const currentSum = i
      .split(",")
      .reduce((acc, current) => Math.abs(acc) + Math.abs(current));
    if (currentSum < smallestSum) {
      smallestSum = currentSum;
    }
  });
  return smallestSum;
};

const findIntersectionWithFewestSteps = intersections => {
  let cheapestIntersection;
  intersections.forEach(intersection => {
    if (
      !cheapestIntersection ||
      intersection.distance < cheapestIntersection.distance
    ) {
      cheapestIntersection = intersection;
    }
  });
  return cheapestIntersection;
};

fs.readFile("./input.txt", "utf8", (err, data) => {
  const movements = data.trim().split("\n");
  const firstWireMovements = movements[0].trim().split(",");
  const secondWireMovements = movements[1].trim().split(",");

  // Get all individual coordinates for each wire based on directions.
  const firstWireCoords = getWireCoordinates(firstWireMovements);
  const secondWireCoords = getWireCoordinates(secondWireMovements);

  // Find intersection points.
  const intersections = getIntersection(firstWireCoords, secondWireCoords);

  // Get closest intersection.
  //const answer = findClosestIntersection(intersections);

  // Get intersection with fewest steps.
  const answer = findIntersectionWithFewestSteps(intersections);
  console.log("Answer: ", answer);
});
