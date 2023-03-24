var enemyTypes = {
  1: {
    name: 'Wolf',
    maxHp: 50,
    strength: 20,
    statIPL: {strength: 3,
              hp: 10},
    speed: 2.0,
    loot: [['healingHerb', 2, 0.6],
          ['gold', 2, 1.0],
          ['heal1', 1, 0.5]],
    gambits: [['enemy', 'any', 'attack']],
    description: 'A hungry wolf.'
  },
  2: {
    name: 'Imp',
    maxHp: 30,
    strength: 40,
    statIPL: {strength: 6,
              hp: 7},
    speed: 2.0,
    loot: [['magicDust', 2, 0.75],
          ['gold', 10, 0.1],
          ['heal1', 1, 0.5]],
    gambits: [['enemy', 'any', 'attack']],
    description: 'A mischievous imp.'
  },
  3: {
    name: 'Large Slime',
    maxHp: 100,
    strength: 30,
    statIPL: {strength: 5,
              hp: 15},
    speed: 3.0,
    loot: [['slime', 1, 0.8],
          ['gold', 25, 0.2],
          ['heal1', 1, 0.5]],
    gambits: [['enemy', 'any', 'attack']],
    description: 'An enormous slime.'
  },
  4: {
    name: 'Fire Sprite',
    maxHp: 40,
    strength: 20,
    statIPL: {strength: 3,
              hp: 5},
    speed: 2.0,
    loot: [['fireStone', 3, 0.5],
          ['gold', 5, 0.2],
          ['heal1', 1, 0.25]],
    gambits: [['enemy', 'any', 'attack']],
    element: 'fire',
    resist: [['fire', 'absorb'],
             ['water', 'weak']],
    description: 'A sprite made of fire.'
  },
  5: {
    name: 'Water Sprite',
    maxHp: 40,
    strength: 20,
    statIPL: {strength: 3,
              hp: 5},
    speed: 2.0,
    loot: [['waterStone', 3, 0.5],
          ['gold', 5, 0.2],
          ['heal1', 1, 0.25]],
    gambits: [['enemy', 'any', 'attack']],
    element: 'water',
    resist: [['water', 'absorb'],
             ['fire', 'weak']],
    description: 'A sprite made of water.'
  },
  6: {
    name: 'Air Sprite',
    maxHp: 40,
    strength: 20,
    statIPL: {strength: 3,
              hp: 5},
    speed: 2.0,
    loot: [['airStone', 3, 0.5],
          ['gold', 5, 0.2],
          ['heal1', 1, 0.25]],
    gambits: [['enemy', 'any', 'attack']],
    element: 'air',
    resist: [['air', 'absorb'],
             ['earth', 'weak']],
    description: 'A sprite made of air.'
  },
  7: {
    name: 'Earth Sprite',
    maxHp: 40,
    strength: 20,
    statIPL: {strength: 3,
              hp: 5},
    speed: 2.0,
    loot: [['earthStone', 3, 0.5],
          ['gold', 5, 0.2],
          ['heal1', 1, 0.25]],
    gambits: [['enemy', 'any', 'attack']],
    element: 'earth',
    resist: [['earth', 'absorb'],
             ['air', 'weak']],
    description: 'A sprite made of earth.'
  },
  spawn: function(typeNum, spawnNum, optLevel) {
    var level = optLevel || 1,
        enemyType = enemyTypes[typeNum],
        charNum = 64 + (spawnNum % 26),
        letter = (charNum > 64) ? String.fromCharCode(charNum) : String.fromCharCode(64+26);
    
    var spawnHp = (level-1)*enemyType.statIPL.hp+enemyType.maxHp;

    var enemy = {
      name: enemyType.name+' '+letter,
      maxHp: spawnHp,
      hp: spawnHp,
      lvl: level,
      strength: (level-1)*enemyType.statIPL.strength+enemyType.strength,
      speed: enemyType.speed,
      type: 'foe',
      acting: true,
      loot: enemyType.loot,
      gambits: enemyType.gambits,
      nextAction: { action: '',
                    target: '',
                    time: 0,
                    period: 0 },
      enemyNum: typeNum,
      statusEffects: []
    }
    if ('element' in enemyType) enemy['element'] = enemyType.element;
    if ('resist' in enemyType) enemy['resist'] = enemyType.resist;

    return enemy;
  },
  data: { 
    spawned: {},
    killed: {},
    looted: {}
  },
  save: function () { return this.data; },
  update: function () { this.data = saveData.enemies; }
};