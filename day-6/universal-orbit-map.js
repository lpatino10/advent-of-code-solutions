const fs = require('fs');

class Node {
  constructor(name) {
    this.name = name;
    this.orbitedBy = [];
  }

  addOrbitedBy(orbitedBy) {
    this.orbitedBy.push(orbitedBy);
  }

  setOrbiting(orbiting) {
    this.orbiting = orbiting;
  }

  setDistanceFromCom(distance) {
    this.distanceFromCom = distance;
  }
}

const buildOrbitTree = orbits => {
  let comNode;
  let youNode;
  let santaNode;
  let createdNodes = {};

  orbits.forEach(orbit => {
    const [centralBody, orbitingBody] = orbit.split(')');

    // Get/create nodes for each object.
    let centralBodyNode;
    if (createdNodes[centralBody]) {
      centralBodyNode = createdNodes[centralBody];
    } else {
      centralBodyNode = new Node(centralBody);
      createdNodes = {
        ...createdNodes,
        [centralBody]: centralBodyNode,
      };
    }
    let orbitingBodyNode;
    if (createdNodes[orbitingBody]) {
      orbitingBodyNode = createdNodes[orbitingBody];
    } else {
      orbitingBodyNode = new Node(orbitingBody);
      createdNodes = {
        ...createdNodes,
        [orbitingBody]: orbitingBodyNode,
      };
    }

    // Set orbiting relationship.
    centralBodyNode.addOrbitedBy(orbitingBodyNode);
    orbitingBodyNode.setOrbiting(centralBodyNode);

    // Store the pointers we care about if we've found them.
    if (centralBody === 'COM') {
      comNode = centralBodyNode;
    }
    if (orbitingBody === 'YOU') {
      youNode = orbitingBodyNode;
    }
    if (orbitingBody === 'SAN') {
      santaNode = orbitingBodyNode;
    }
  });

  return {
    comNode,
    youNode,
    santaNode,
  };
};

const printOrbitTree = comNode => {
  const queue = [];
  queue.unshift(comNode);

  while (queue.length > 0) {
    const currentNode = queue.pop();
    console.log(
      `${currentNode.name} orbited by ${currentNode.orbitedBy.map(
        o => o.name,
      )}`,
    );

    currentNode.orbitedBy.forEach(o => {
      queue.unshift(o);
    });
  }
};

const countOrbits = comNode => {
  comNode.setDistanceFromCom(0);
  const queue = [];
  queue.unshift(comNode);
  let totalOrbitCount = 0;

  while (queue.length > 0) {
    const currentNode = queue.pop();
    const currentDistanceFromCom = currentNode.distanceFromCom;
    currentNode.orbitedBy.forEach(o => {
      totalOrbitCount += currentDistanceFromCom + 1;
      o.setDistanceFromCom(currentDistanceFromCom + 1);
      queue.unshift(o);
    });
  }

  return totalOrbitCount;
};

const findMinOrbitalTransfers = (youNode, santaNode) => {
  let youPathNode = youNode;
  let santaPathNode = santaNode;
  let santaSeenNodes = {};
  let youSeenNodes = {};
  let minTransfers = 0;
  let checkingYou = true;

  while (minTransfers === 0) {
    if (checkingYou && youNode.orbiting) {
      const currentNodeToCheck = youPathNode.orbiting;
      const currentNodeDistanceFromCom = currentNodeToCheck.distanceFromCom;

      if (santaSeenNodes[currentNodeToCheck.name]) {
        minTransfers =
          youNode.orbiting.distanceFromCom -
          currentNodeDistanceFromCom +
          (santaNode.orbiting.distanceFromCom - currentNodeDistanceFromCom);
      }

      youSeenNodes = {
        ...youSeenNodes,
        [currentNodeToCheck.name]: currentNodeToCheck,
      };
      youPathNode = currentNodeToCheck;
    } else if (!checkingYou && santaPathNode.orbiting) {
      const currentNodeToCheck = santaPathNode.orbiting;
      const currentNodeDistanceFromCom = currentNodeToCheck.distanceFromCom;

      if (youSeenNodes[currentNodeToCheck.name]) {
        minTransfers =
          youNode.orbiting.distanceFromCom -
          currentNodeDistanceFromCom +
          (santaNode.orbiting.distanceFromCom - currentNodeDistanceFromCom);
      }

      santaSeenNodes = {
        ...santaSeenNodes,
        [currentNodeToCheck.name]: currentNodeToCheck,
      };
      santaPathNode = currentNodeToCheck;
    }

    checkingYou = !checkingYou;
  }

  return minTransfers;
};

fs.readFile('./input.txt', 'utf8', (_, data) => {
  const orbits = data.split('\n');

  // Build out tree of orbits.
  const { comNode, youNode, santaNode } = buildOrbitTree(orbits);
  //printOrbitTree(comNode);

  // Starting with COM, run BFS to exhaustively search tree and count total orbits, adding 1 each layer.
  const orbitCount = countOrbits(comNode);
  console.log(`There are ${orbitCount} total orbits.`);

  // Find minimun number of orbital transfers from YOU to SAN.
  const minOrbitalTransfers = findMinOrbitalTransfers(youNode, santaNode);
  console.log(
    `We can make a minimum of ${minOrbitalTransfers} orbital transfers to get to the object Santa is orbiting.`,
  );
});
