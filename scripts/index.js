var logging = {
  save: false,
  actions: {
    current: false,
    next: false,
    hpChange: false,
    items: false
  },
  loot: false,
  select: false
};

var baseStats = {
  maxHp: 80,
  //maxMp: 4,
  strength: 20,
  statIPL: {strength: 3,
            hp: 10},
  speed: 1.5,
};
var charStats = {
  name: 'name',
  hp: baseStats.maxHp,
  //mp: baseStats.maxMp,
  lvl: 1,
  totalXp: 0,
  xp: 0,
  bp: 0,
  totalLp: 0,
  lp: 0,
  maxHp: (1-1)*baseStats.statIPL.hp+baseStats.maxHp,
  //maxMp: Math.floor(1/2)*1+baseStats.maxMp,
  strength: (1-1)*baseStats.statIPL.strength+baseStats.strength,
  speed: baseStats.speed,
  type: 'ally',
  acting: true,
  save: function () {
    return {
      name: this.name,
      hp: this.hp,
      //mp: this.mp,
      lvl: this.lvl,
      totalXp: this.totalXp,
      xp: this.xp,
      bp: this.bp,
      lp: this.lp,
      gambits: this.gambits,
      equipment: this.equipment,
      progression: this.progression,
      statusEffects: this.statusEffects
    }
  },
  update: function (me) {
    this.name = me.name;
    this.hp = me.hp;
    this.mp = me.mp;
    this.lvl = me.lvl;
    this.totalXp = me.totalXp;
    this.xp = me.xp;
    this.bp = me.bp;
    this.lp = me.lp;
    this.maxHp = (me.lvl-1)*baseStats.statIPL.hp+baseStats.maxHp;
    //this.maxMp = Math.floor(me.lvl/2)*1+baseStats.maxMp;
    this.strength = (me.lvl-1)*baseStats.statIPL.strength+baseStats.strength;
    this.speed = baseStats.speed;
    this.gambits = me.gambits;
    this.equipment = me.equipment;
    this.progression = me.progression;
    this.statusEffects = me.statusEffects;
  },
  levelUp: function () {
    this.maxHp = (this.lvl-1)*baseStats.statIPL.hp+baseStats.maxHp;
    this.hp = this.maxHp;
    this.strength = (this.lvl-1)*baseStats.statIPL.strength+baseStats.strength;
  },
  addGambitSlot: function () {
    this.gambits.push(['', '', '', false]);
  },
  initialise: function (name, optXp, optLp) {
    var initXp = optXp || 0;
    this.totalXp = initXp;
    this.xp = initXp;

    var initLp = optLp || 0;
    this.totalLp = initLp;
    this.lp = initLp;

    this.name = name || "name";
    this.nextAction = { action: '',
                        target: '',
                        time: 0,
                        period: 0 };
    this.gambits = [['self', 'hp < 50%', 'heal1', true],
                    ['ally', 'status: KO', 'revive1', true],
                    ['enemy', 'any', 'attack', true]];
    this.equipment = { weapon: '',
                       armour: '',
                       accessory: '' };
    this.progression = ['phoenixAcc','heal1','revive1','armour1','sword1','attack'];
    this.statusEffects = [];

    checkLevel(this);

    return this;
  }
};

var entities = {
  allies: [],
  foes: [],
  lurkingFoes: [],
  count: function () {
    return this.allies.length + this.foes.length;
  },
  all: function () {
    var allEntities = [];
  
    this.allies.forEach((entity, i, array) => { allEntities.push(array[i]); });
    this.foes.forEach((entity, i, array) => { allEntities.push(array[i]); });

    return allEntities;
  },
  save: function () {
    var allyData = [];
    this.allies.forEach(ally => { allyData.push(ally.save()); });
    
    return allyData;
  },
  update: function (allyData) {
    allyData.forEach((ally, i) => { entities.allies[i].update(ally); });
  }
};

var gambits = {
  target: ['self', 'ally', 'enemy'],
  condition: ['any','highest hp','highest max hp','hp < 25%','hp < 50%','hp < 75%','hp < 100%','lowest hp','lowest max hp','mp < 25%','mp < 50%','mp < 75%','mp < 100%','nearest','status: KO'],
  action: [// ( 0- 5) skills
           'attack', 'steal', 'taunt1', 'taunt2', 'interrupt', 'psyonic',
           // ( 6-11) magic - debuff
           'slow1', 'slow2', 'armourBreak', 'halveStrength', 'fumble', 'clearBuff',
           // (12-13) magic - non-elemental damage
           'poison1', 'poison2',
           // (14-18) magic - buff
           'quicken1', 'quicken2', 'protect1', 'protect', 'doubleStrength',
           // (19-26) magic - healing
           'heal1', 'heal2', 'revive1', 'revive2', 'regen1', 'regen2', 'clearDebuff1', 'clearDebuff2',
           // (27-50) magic - elemental
           'air1', 'air2', 'air3', 'air4', 'air5', 'air6', 'earth1', 'earth2', 'earth3', 'earth4', 'earth5', 'earth6', 'fire1', 'fire2', 'fire3', 'fire4', 'fire5', 'fire6', 'water1', 'water2', 'water3', 'water4', 'water5', 'water6'],
  rules: {
    condition: {
      self: [3,4,5,6,9,10,11,12],
      ally: ['all'],
      enemy: [0,1,2,3,4,5,6,7,8,13]
    },
    action: {
      self: [0,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50],
      ally: [0,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50],
      enemy: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50]
    }
  }
};

var progression = {
  // magic - debuff
  slow1: {
    prereqAllOf: ['poison1'],
    cost: 1
  },
  slow2: {
    prereqOneOf: ['armourBreak', 'halveStrength', 'clearBuff', 'poison2'],
    prereqAllOf: ['slow1'],
    cost: 4
  },
  armourBreak: {
    prereqOneOf: ['slow1', 'quicken1'],
    cost: 2.5
  },
  halveStrength: {
    prereqOneOf: ['slow1', 'protect1'],
    cost: 2.5
  },
  fumble: {
    prereqOneOf: ['armourBreak', 'halveStrength', 'clearBuff', 'poison2'],
    cost: 4
  },
  clearBuff: {
    prereqOneOf: ['slow1', 'quicken1', 'protect1', 'clearDebuff1'],
    cost: 3
  },
  // magic - non-elemental damage
  poison1: {
    cost: 0.5
  },
  poison2: {
    prereqOneOf: ['quicken1', 'slow1'],
    prereqAllOf: ['poison1'],
    cost: 2
  },
  // magic - buff
  quicken1: {
    prereqAllOf: ['regen1'],
    cost: 1
  },
  quicken2: {
    prereqOneOf: ['armourBreak', 'clearBuff', 'regen2'],
    prereqAllOf: ['quicken1'],
    cost: 4
  },
  protect1: {
    prereqAllOf: ['regen1'],
    cost: 1.5
  },
  protect2: {
    prereqOneOf: ['doubleStrength', 'quicken2', 'clearDebuff2'],
    prereqAllOf: ['protect1'],
    cost: 5
  },
  doubleStrength: {
    prereqOneOf: ['armourBreak', 'halveStrength', 'clearBuff', 'regen2'],
    cost: 4
  },
  // magic - healing
  heal1: {
  },
  heal2: {
    prereqOneOf: ['quicken1', 'protect1', 'clearDebuff1'],
    cost: 2
  },
  revive1: {
  },
  revive2: {
    prereqOneOf: ['quicken1', 'protect1', 'clearDebuff1'],
    cost: 3
  },
  regen1: {
    cost: 1
  },
  regen2: {
    prereqOneOf: ['quicken1', 'protect1', 'clearDebuff1'],
    prereqAllOf: ['regen1'],
    cost: 2.5
  },
  clearDebuff1: {
    prereqAllOf: ['regen1'],
    cost: 1.5
  },
  clearDebuff2: {
    prereqOneOf: ['clearBuff', 'regen2', 'heal2', 'revive2'],
    prereqAllOf: ['clearDebuff1'],
    cost: 4
  },
  // magic - elemental
  air1: {
    cost: 0.5
  },
  air2: {
    prereqAllOf: ['air1'],
    cost: 1
  },
  air3: {
    prereqAllOf: ['air1'],
    cost: 1.5
  },
  air4: {
    prereqOneOf: ['air2', 'air3'],
    cost: 2
  },
  air5: {
    prereqAllOf: ['air3'],
    cost: 3
  },
  air6: {
    prereqOneOf: ['air4', 'air5'],
    cost: 4
  },
  earth1: {
    cost: 0.5
  },
  earth2: {
    prereqAllOf: ['earth1'],
    cost: 1
  },
  earth3: {
    prereqAllOf: ['earth1'],
    cost: 1.5
  },
  earth4: {
    prereqOneOf: ['earth2', 'earth3'],
    cost: 2
  },
  earth5: {
    prereqAllOf: ['earth3'],
    cost: 3
  },
  earth6: {
    prereqOneOf: ['earth4', 'earth5'],
    cost: 4
  },
  fire1: {
    cost: 0.5
  },
  fire2: {
    prereqAllOf: ['fire1'],
    cost: 1
  },
  fire3: {
    prereqAllOf: ['fire1'],
    cost: 1.5
  },
  fire4: {
    prereqOneOf: ['fire2', 'fire3'],
    cost: 2
  },
  fire5: {
    prereqAllOf: ['fire3'],
    cost: 3
  },
  fire6: {
    prereqOneOf: ['fire4', 'fire5'],
    cost: 4
  },
  water1: {
    cost: 0.5
  },
  water2: {
    prereqAllOf: ['water1'],
    cost: 1
  },
  water3: {
    prereqAllOf: ['water1'],
    cost: 1.5
  },
  water4: {
    prereqOneOf: ['water2', 'water3'],
    cost: 2
  },
  water5: {
    prereqAllOf: ['water3'],
    cost: 3
  },
  water6: {
    prereqOneOf: ['water4', 'water5'],
    cost: 4
  },
  // armour
  armour1: {
  },
  airArmour1: {
    cost: 1
  },
  earthArmour1: {
    cost: 1
  },
  fireArmour1: {
    cost: 1
  },
  waterArmour1: {
    cost: 1
  },
  armour2: {
    prereqOneOf: ['airArmour1', 'earthArmour1', 'fireArmour1', 'waterArmour1'],
    cost: 2
  },
  airArmour2: {
    prereqAllOf: ['airArmour1'],
    cost: 2
  },
  earthArmour2: {
    prereqAllOf: ['earthArmour1'],
    cost: 2
  },
  fireArmour2: {
    prereqAllOf: ['fireArmour1'],
    cost: 2
  },
  waterArmour2: {
    prereqAllOf: ['waterArmour1'],
    cost: 2
  },
  airArmour3: {
    prereqOneOf: ['armour2', 'airArmour2', 'earthArmour2', 'fireArmour2', 'waterArmour2'],
    prereqAllOf: ['airArmour1'],
    cost: 3
  },
  earthArmour3: {
    prereqOneOf: ['armour2', 'airArmour2', 'earthArmour2', 'fireArmour2', 'waterArmour2'],
    prereqAllOf: ['earthArmour1'],
    cost: 3
  },
  fireArmour3: {
    prereqOneOf: ['armour2', 'airArmour2', 'earthArmour2', 'fireArmour2', 'waterArmour2'],
    prereqAllOf: ['fireArmour1'],
    cost: 3
  },
  waterArmour3: {
    prereqOneOf: ['armour2', 'airArmour2', 'earthArmour2', 'fireArmour2', 'waterArmour2'],
    prereqAllOf: ['waterArmour1'],
    cost: 3
  },
  airArmour4: {
    prereqOneOf: ['airArmour3', 'earthArmour3', 'fireArmour3', 'waterArmour3'],
    prereqAllOf: ['airArmour1'],
    cost: 4
  },
  earthArmour4: {
    prereqOneOf: ['airArmour3', 'earthArmour3', 'fireArmour3', 'waterArmour3'],
    prereqAllOf: ['earthArmour1'],
    cost: 4
  },
  fireArmour4: {
    prereqOneOf: ['airArmour3', 'earthArmour3', 'fireArmour3', 'waterArmour3'],
    prereqAllOf: ['fireArmour1'],
    cost: 4
  },
  waterArmour4: {
    prereqOneOf: ['airArmour3', 'earthArmour3', 'fireArmour3', 'waterArmour3'],
    prereqAllOf: ['waterArmour1'],
    cost: 4
  },
  armour3: {
    prereqOneOf: ['airArmour3', 'earthArmour3', 'fireArmour3', 'waterArmour3'],
    prereqAllOf: ['airArmour1', 'earthArmour1', 'fireArmour1', 'waterArmour1'],
    cost: 4
  },
  // weapons - swords
  sword1: {
  },
  airSword1: {
    cost: 1
  },
  earthSword1: {
    cost: 1
  },
  fireSword1: {
    cost: 1
  },
  waterSword1: {
    cost: 1
  },
  sword2: {
    prereqOneOf: ['airSword1', 'earthSword1', 'fireSword1', 'waterSword1'],
    cost: 2
  },
  airSword2: {
    prereqAllOf: ['sword2'],
    cost: 3
  },
  earthSword2: {
    prereqAllOf: ['sword2'],
    cost: 3
  },
  fireSword2: {
    prereqAllOf: ['sword2'],
    cost: 3
  },
  waterSword2: {
    prereqAllOf: ['sword2'],
    cost: 3
  },
  sword3: {
    prereqAllOf: ['sword2'],
    cost: 3
  },
  // weapons - piercing
  piercing1: {
    cost: 1
  },
  piercing2: {
    prereqOneOf: ['sword2', 'scatter2'],
    prereqAllOf: ['piercing1'],
    cost: 2.5
  },
  piercing3: {
    prereqOneOf: ['sword3', 'scatter3'],
    prereqAllOf: ['piercing2'],
    cost: 4
  },
  // weapons - scatter
  scatter1: {
    cost: 1
  },
  airScatter1: {
    prereqAllOf: ['scatter1'],
    cost: 2
  },
  earthScatter1: {
    prereqAllOf: ['scatter1'],
    cost: 2
  },
  fireScatter1: {
    prereqAllOf: ['scatter1'],
    cost: 2
  },
  waterScatter1: {
    prereqAllOf: ['scatter1'],
    cost: 2
  },
  scatter2: {
    prereqOneOf: ['airScatter1', 'earthScatter1', 'fireScatter1', 'waterScatter1'],
    cost: 3
  },
  airScatter2: {
    prereqAllOf: ['scatter2'],
    cost: 4
  },
  earthScatter2: {
    prereqAllOf: ['scatter2'],
    cost: 4
  },
  fireScatter2: {
    prereqAllOf: ['scatter2'],
    cost: 4
  },
  waterScatter2: {
    prereqAllOf: ['scatter2'],
    cost: 4
  },
  scatter3: {
    prereqAllOf: ['scatter2'],
    cost: 4
  },
  // accessories - basic
  phoenixAcc: {
  },
  maxHPAcc: {
    cost: 1
  },
  lureAcc: {
    prereqAllOf: ['maxHPAcc'],
    cost: 2
  },
  vampireAcc: {
    prereqAllOf: ['maxHPAcc'],
    cost: 2
  },
  immunePoisonAcc: {
    prereqAllOf: ['maxHPAcc'],
    cost: 2
  },
  thornsAcc: {
    prereqOneOf: ['lureAcc', 'vampireAcc'],
    cost: 3
  },
  immuneSlowAcc: {
    prereqAllOf: ['immunePoisonAcc'],
    cost: 3
  },
  luckyAcc: {
    prereqOneOf: ['thornsAcc', 'immuneSlowAcc'],
    prereqAllOf: ['lureAcc'],
    cost: 4
  },
  immuneFumbleAcc: {
    prereqAllOf: ['immuneSlowAcc'],
    cost: 4
  },
  // accessories - special
  airAffinityAcc: {
    prereqOneOf: ['air1', 'airSword1', 'airScatter1'],
    prereqOneOf2: ['lureAcc', 'vampireAcc', 'immunePoisonAcc'],
    cost: 3
  },
  earthAffinityAcc: {
    prereqOneOf: ['earth1', 'earthSword1', 'earthScatter1'],
    prereqOneOf2: ['lureAcc', 'vampireAcc', 'immunePoisonAcc'],
    cost: 3
  },
  fireAffinityAcc: {
    prereqOneOf: ['fire1', 'fireSword1', 'fireScatter1'],
    prereqOneOf2: ['lureAcc', 'vampireAcc', 'immunePoisonAcc'],
    cost: 3
  },
  waterAffinityAcc: {
    prereqOneOf: ['water1', 'waterSword1', 'waterScatter1'],
    prereqOneOf2: ['lureAcc', 'vampireAcc', 'immunePoisonAcc'],
    cost: 3
  },
  enduringOffenceAcc: {
    prereqAllOf: ['poison1'],
    prereqOneOf: ['lureAcc', 'vampireAcc', 'immunePoisonAcc'],
    cost: 3
  },
  enduringDefenceAcc: {
    prereqAllOf: ['regen1'],
    prereqOneOf: ['lureAcc', 'vampireAcc', 'immunePoisonAcc'],
    cost: 3
  },
  healingAffinityAcc: {
    prereqOneOf: ['lureAcc', 'vampireAcc', 'immunePoisonAcc'],
    cost: 3
  },
  airEarthAffinityAcc: {
    prereqAllOf: ['airAffinityAcc', 'earthAffinityAcc'],
    cost: 4
  },
  fireWaterAffinityAcc: {
    prereqAllOf: ['fireAffinityAcc', 'waterAffinityAcc'],
    cost: 4
  },
  totalEnduranceAcc: {
    prereqAllOf: ['enduringOffenceAcc', 'enduringDefenceAcc'],
    cost: 4
  },
  elementalAffinityAcc: {
    prereqAllOf: ['fireWaterAffinityAcc', 'airEarthAffinityAcc'],
    cost: 5
  },
  itemAffinityAcc: {
    prereqAllOf: ['healingAffinityAcc', 'totalEnduranceAcc', 'elementalAffinityAcc'],
    cost: 6
  },
  // gambit slots
  gambitSlot1: {
    prereqOneOf: ['air1', 'earth1', 'fire1', 'water1',
                  'regen1',
                  'poison1'],
    cost: 1,
    type: 'gambit',
    name: 'gambit slot',
    description: 'An additional gambit slot.'
  },
  gambitSlot2: {
    prereqOneOf: ['air2', 'earth2', 'fire2', 'water2',
                  'slow1',
                  'quicken1', 'protect1',
                  'clearDebuff1'],
    cost: 2,
    type: 'gambit',
    name: 'gambit slot',
    description: 'An additional gambit slot.'
  },
  gambitSlot3: {
    prereqOneOf: ['air3', 'earth3', 'fire3', 'water3',
                  'armourBreak', 'halveStrength', 'clearBuff',
                  'poison2',
                  'regen2'],
    cost: 3,
    type: 'gambit',
    name: 'gambit slot',
    description: 'An additional gambit slot.'
  },
  gambitSlot4: {
    prereqOneOf: ['air4', 'earth4', 'fire4', 'water4',
                  'slow2', 'fumble',
                  'doubleStrength', 'quicken2'],
    cost: 3,
    type: 'gambit',
    name: 'gambit slot',
    description: 'An additional gambit slot.'
  },
  gambitSlot5: {
    prereqOneOf: ['air5', 'earth5', 'fire5', 'water5',
                  'heal2', 'revive2', 'clearDebuff2'],
    cost: 4,
    type: 'gambit',
    name: 'gambit slot',
    description: 'An additional gambit slot.'
  },
  gambitSlot6: {
    prereqOneOf: ['air6', 'earth6', 'fire6', 'water6',
                  'protect2'],
    cost: 5,
    type: 'gambit',
    name: 'gambit slot',
    description: 'An additional gambit slot.'
  },
  // skills
  attack: {
    type: 'skill',
    name: 'attack',
    description: 'Basic attack move. Uses weapon if one is equipped.'
  },
  steal: {
    prereqOneOf: ['poison1',
                  'regen1',
                  'air1', 'earth1', 'fire1', 'water1',
                  'airSword1', 'earthSword1', 'fireSword1', 'waterSword1',
                  'piercing1', 'scatter1'],
    cost: 1,
    type: 'skill',
    name: 'steal',
    description: 'Steal loot from foe.'
  },
  taunt1: {
    prereqOneOf: ['slow1',
                  'quicken1', 'protect1', 'clearDebuff1',
                  'air2', 'earth2', 'fire2', 'water2',
                  'air3', 'earth3', 'fire3', 'water3',
                  'sword2',
                  'airScatter1', 'earthScatter1', 'fireScatter1', 'waterScatter1'],
    cost: 2,
    type: 'skill',
    name: 'taunt',
    description: 'Taunt a target, so they target you.'
  },
  taunt2: {
    prereqOneOf: ['armourBreak', 'halveStrength', 'clearBuff', 'poison2',
                  'regen2', 'heal2', 'revive2',
                  'air4', 'earth4', 'fire4', 'water4',
                  'air5', 'earth5', 'fire5', 'water5',
                  'airSword2', 'earthSword2', 'fireSword2', 'waterSword2', 'sword3',
                  'piercing2', 'scatter2'],
    prereqAllOf: ['taunt1'],
    cost: 4,
    type: 'skill',
    name: 'taunt all',
    description: 'Taunt multiple targets, so they target you.'
  },
  interrupt: {
    prereqOneOf: ['armourBreak', 'halveStrength', 'clearBuff', 'poison2',
                  'regen2', 'heal2', 'revive2',
                  'air4', 'earth4', 'fire4', 'water4',
                  'air5', 'earth5', 'fire5', 'water5',
                  'airSword2', 'earthSword2', 'fireSword2', 'waterSword2', 'sword3',
                  'piercing2', 'scatter2'],
    cost: 4,
    type: 'skill',
    name: 'interrupt',
    description: "Interrupt a target's action."
  },
  psyonic: {
    prereqOneOf: ['slow2', 'fumble',
                  'doubleStrength', 'quicken2', 'clearDebuff2',
                  'air6', 'earth6', 'fire6', 'water6',
                  'piercing3', 'scatter3',
                  'airScatter2', 'earthScatter2', 'fireScatter2', 'waterScatter2'],
    cost: 5,
    type: 'skill',
    name: 'psyonic',
    description: 'Attack an enemy with your mind, instead of your weapon.'
  }
};

entities.allies.push(Object.create(charStats).initialise('Hero A'));

var resources = {
  data: {
    gold: 0,
    heal1: 5,
    revive1: 2,
    phoenixAcc: 1
  },
  save: function () { return this.data; },
  update: function () { this.data = saveData.resources; }
};

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
var selectedEnemy = '';

var itemTypes = {
  // items
  // - debuff
  slow1: {
    name: 'slow',
    sell: 8,
    debuff: 10,
    status: 'slow',
    type: 'item',
    description: "Temporarily slows a single target."
  },
  slow2: {
    name: 'slowing wave',
    sell: 8,
    debuff: 10,
    status: 'slow',
    type: 'item',
    multiTarget: true,
    description: "Temporarily slows multple targets."
  },
  armourBreak: {
    name: 'armour break',
    sell: 8,
    debuff: 10,
    status: 'vulnerable',
    type: 'item',
    description: "Temporarily halves a target's defence."
  },
  halveStrength: {
    name: 'weaken',
    sell: 8,
    debuff: 10,
    status: 'weak',
    type: 'item',
    description: "Temporarily halves a target's strength."
  },
  fumble: {
    name: 'fumble',
    sell: 8,
    debuff: 10,
    status: 'fumble',
    type: 'item',
    description: "Temporarily prevents a target from using items."
  },
  clearBuff: {
    name: 'clear buff',
    sell: 8,
    removeStatus: ['regenerating', 'fast', 'protected', 'strong'],
    type: 'item',
    description: "Removes all positive status effects from a target."
  },
  // - non-elemental damage
  poison1: {
    name: 'poison',
    sell: 8,
    debuff: 10,
    status: 'poisoned',
    type: 'item',
    description: "Temporarily poisons a single target."
  },
  poison2: {
    name: 'poisonous wave',
    sell: 8,
    debuff: 10,
    status: 'poisoned',
    type: 'item',
    multiTarget: true,
    description: "Temporarily poisons multiple targets."
  },
  // - buff
  quicken1: {
    name: 'quicken',
    sell: 8,
    buff: 10,
    status: 'fast',
    type: 'item',
    description: "Temporarily increases the speed of a target."
  },
  quicken2: {
    name: 'quickening wave',
    sell: 8,
    buff: 10,
    status: 'fast',
    type: 'item',
    multiTarget: true,
    description: "Temporarily increases the speed of multiple targets."
  },
  protect1: {
    name: 'protect',
    sell: 8,
    buff: 10,
    status: 'protected',
    type: 'item',
    description: "Temporarily halves damage to a target."
  },
  protect2: {
    name: 'protective wave',
    sell: 8,
    buff: 10,
    status: 'protected',
    type: 'item',
    multiTarget: true,
    description: "Temporarily halves damage to multiple targets."
  },
  doubleStrength: {
    name: 'strengthen',
    sell: 8,
    buff: 10,
    status: 'strong',
    type: 'item',
    description: "Target temporarily deals twice the damage."
  },
  // - healing
  heal1: {
    name: 'heal',
    buy: 10,
    sell: 5,
    healing: 'all',
    type: 'item',
    description: "Heals a single target."
  },
  heal2: {
    name: 'healing wave',
    sell: 5,
    healing: 'all',
    type: 'item',
    multiTarget: true,
    description: "Heals multiple targets."
  },
  revive1: {
    name: 'revive',
    buy: 20,
    sell: 10,
    healing: 'all',
    revive: true,
    type: 'item',
    description: "Revives KO'd target."
  },
  revive2: {
    name: 'reviving wave',
    sell: 10,
    healing: 'all',
    revive: true,
    type: 'item',
    multiTarget: true,
    description: "Revives multiple KO'd targets."
  },
  regen1: {
    name: 'regen',
    sell: 10,
    healing: '10%',
    buff: 10,
    status: 'regenerating',
    type: 'item',
    description: "Restores target's HP over time."
  },
  regen2: {
    name: 'regenerative wave',
    sell: 10,
    healing: '10%',
    buff: 10,
    status: 'regenerating',
    type: 'item',
    multiTarget: true,
    description: "Restores multiple targets' HP over time."
  },
  clearDebuff1: {
    name: 'purify',
    sell: 10,
    removeStatus: ['poisoned', 'slow', 'vulnerable', 'weak', 'fumble'],
    type: 'item',
    description: "Removes all negative status effects from a target."
  },
  clearDebuff2: {
    name: 'purifying wave',
    sell: 10,
    removeStatus: ['poisoned', 'slow', 'vulnerable', 'weak', 'fumble'],
    type: 'item',
    multiTarget: true,
    description: "Removes all negative status effects from multiple targets."
  },
  // - elemental (mDamage)
  air1: {
    name: 'air charge S',
    sell: 8,
    mDamage: ['air', 4],
    type: 'item',
    description: "Deals air damage to a single target."
  },
  air2: {
    name: 'air salvo S',
    sell: 8,
    mDamage: ['air', 6],
    type: 'item',
    multiTarget: true,
    description: "Deals air damage to multiple targets."
  },
  air3: {
    name: 'air charge M',
    sell: 8,
    mDamage: ['air', 12],
    type: 'item',
    description: "Deals moderate air damage to a single target."
  },
  air4: {
    name: 'air salvo M',
    sell: 8,
    mDamage: ['air', 18],
    type: 'item',
    multiTarget: true,
    description: "Deals moderate air damage to multiple targets."
  },
  air5: {
    name: 'air charge L',
    sell: 8,
    mDamage: ['air', 30],
    type: 'item',
    description: "Deals a lot of air damage to a single target."
  },
  air6: {
    name: 'air salvo L',
    sell: 8,
    mDamage: ['air', 36],
    type: 'item',
    multiTarget: true,
    description: "Deals a lot of air damage to multiple targets."
  },
  earth1: {
    name: 'earth charge S',
    sell: 8,
    mDamage: ['earth', 4],
    type: 'item',
    description: "Deals earth damage to a single target."
  },
  earth2: {
    name: 'earth salvo S',
    sell: 8,
    mDamage: ['earth', 6],
    type: 'item',
    multiTarget: true,
    description: "Deals earth damage to multiple targets."
  },
  earth3: {
    name: 'earth charge M',
    sell: 8,
    mDamage: ['earth', 12],
    type: 'item',
    description: "Deals moderate earth damage to a single target."
  },
  earth4: {
    name: 'earth salvo M',
    sell: 8,
    mDamage: ['earth', 18],
    type: 'item',
    multiTarget: true,
    description: "Deals moderate earth damage to multiple targets."
  },
  earth5: {
    name: 'earth charge L',
    sell: 8,
    mDamage: ['earth', 30],
    type: 'item',
    description: "Deals a lot of earth damage to a single target."
  },
  earth6: {
    name: 'earth salvo L',
    sell: 8,
    mDamage: ['earth', 36],
    type: 'item',
    multiTarget: true,
    description: "Deals a lot of earth damage to multiple targets."
  },
  fire1: {
    name: 'fire charge S',
    sell: 8,
    mDamage: ['fire', 4],
    type: 'item',
    description: "Deals fire damage to a single target."
  },
  fire2: {
    name: 'fire salvo S',
    sell: 8,
    mDamage: ['fire', 6],
    type: 'item',
    multiTarget: true,
    description: "Deals fire damage to multiple targets."
  },
  fire3: {
    name: 'fire charge M',
    sell: 8,
    mDamage: ['fire', 12],
    type: 'item',
    description: "Deals moderate fire damage to a single target."
  },
  fire4: {
    name: 'fire salvo M',
    sell: 8,
    mDamage: ['fire', 18],
    type: 'item',
    multiTarget: true,
    description: "Deals moderate fire damage to multiple targets."
  },
  fire5: {
    name: 'fire charge L',
    sell: 8,
    mDamage: ['fire', 30],
    type: 'item',
    description: "Deals a lot of fire damage to a single target."
  },
  fire6: {
    name: 'fire salvo L',
    sell: 8,
    mDamage: ['fire', 36],
    type: 'item',
    multiTarget: true,
    description: "Deals a lot of fire damage to multiple targets."
  },
  water1: {
    name: 'water charge S',
    sell: 8,
    mDamage: ['water', 4],
    type: 'item',
    description: "Deals water damage to a single target."
  },
  water2: {
    name: 'water salvo S',
    sell: 8,
    mDamage: ['water', 6],
    type: 'item',
    multiTarget: true,
    description: "Deals water damage to multiple targets."
  },
  water3: {
    name: 'water charge M',
    sell: 8,
    mDamage: ['water', 12],
    type: 'item',
    description: "Deals moderate water damage to a single target."
  },
  water4: {
    name: 'water salvo M',
    sell: 8,
    mDamage: ['water', 18],
    type: 'item',
    multiTarget: true,
    description: "Deals moderate water damage to multiple targets."
  },
  water5: {
    name: 'water charge L',
    sell: 8,
    mDamage: ['water', 30],
    type: 'item',
    description: "Deals a lot of water damage to a single target."
  },
  water6: {
    name: 'water salvo L',
    sell: 8,
    mDamage: ['water', 36],
    type: 'item',
    multiTarget: true,
    description: "Deals a lot of water damage to multiple targets."
  },
  // ingredients
  healingHerb: {
    name: 'healing herb',
    sell: 2,
    type: 'ingredient',
    description: "Herb commonly used in medicines."
  },
  slime: {
    name: 'slime',
    sell: 5,
    type: 'ingredient',
    description: "Slime with healing properties."
  },
  magicDust: {
    name: 'magic dust',
    sell: 6,
    type: 'ingredient',
    description: "Dust commonly used in magical items."
  },
  airStone: {
    name: 'air stone',
    sell: 2,
    type: 'ingredient',
    description: "Unexpectedly light stone."
  },
  earthStone: {
    name: 'earth stone',
    sell: 2,
    type: 'ingredient',
    description: "Unexpectedly heavy stone."
  },
  fireStone: {
    name: 'fire stone',
    sell: 2,
    type: 'ingredient',
    description: "Stone that always feels hot."
  },
  waterStone: {
    name: 'water stone',
    sell: 2,
    type: 'ingredient',
    description: "Stone that always feels wet."
  },
  // equipment
  // - weapons - swords
  sword1: {
    name: 'bronze sword',
    buy: 20,
    sell: 10,
    strength: 10,
    type: 'equipment',
    subType: 'weapon',
    description: "Bronze sword that provides a boost to strength."
  },
  airSword1: {
    name: 'air sword',
    sell: 15,
    strength: 10,
    type: 'equipment',
    subType: 'weapon',
    element: 'air',
    description: "Sword made of air."
  },
  earthSword1: {
    name: 'earth sword',
    sell: 15,
    strength: 10,
    type: 'equipment',
    subType: 'weapon',
    element: 'earth',
    description: "Sword made of earth."
  },
  fireSword1: {
    name: 'fire sword',
    sell: 15,
    strength: 10,
    type: 'equipment',
    subType: 'weapon',
    element: 'fire',
    description: "Sword made of fire."
  },
  waterSword1: {
    name: 'water sword',
    sell: 15,
    strength: 10,
    type: 'equipment',
    subType: 'weapon',
    element: 'water',
    description: "Sword made of water."
  },
  sword2: {
    name: 'iron sword',
    sell: 15,
    strength: 40,
    type: 'equipment',
    subType: 'weapon',
    description: "Iron sword that provides a superior boost to strength."
  },
  airSword2: {
    name: 'improved air sword',
    sell: 15,
    strength: 40,
    type: 'equipment',
    subType: 'weapon',
    element: 'air',
    description: "Improved sword made of air."
  },
  earthSword2: {
    name: 'improved earth sword',
    sell: 15,
    strength: 40,
    type: 'equipment',
    subType: 'weapon',
    element: 'earth',
    description: "Improved sword made of earth."
  },
  fireSword2: {
    name: 'improved fire sword',
    sell: 15,
    strength: 40,
    type: 'equipment',
    subType: 'weapon',
    element: 'earth',
    description: "Improved sword made of fire."
  },
  waterSword2: {
    name: 'improved water sword',
    sell: 15,
    strength: 40,
    type: 'equipment',
    subType: 'weapon',
    element: 'earth',
    description: "Improved sword made of water."
  },
  sword3: {
    name: 'admantite sword',
    sell: 15,
    strength: 80,
    type: 'equipment',
    subType: 'weapon',
    description: "Adamantite sword that provides an incrdible boost to strength."
  },
  // - weapons - piercing
  piercing1: {
    name: 'bronze spear',
    sell: 10,
    strength: 1,
    type: 'equipment',
    subType: 'weapon',
    piercing: true,
    description: "Bronze spear that provides a boost to strength, and ignores target's defence."
  },
  piercing2: {
    name: 'iron spear',
    sell: 10,
    strength: 2,
    type: 'equipment',
    subType: 'weapon',
    piercing: true,
    description: "Iron spear that provides a superior boost to strength, and ignores target's defence."
  },
  piercing3: {
    name: 'adamantite spear',
    sell: 10,
    strength: 3,
    type: 'equipment',
    subType: 'weapon',
    piercing: true,
    description: "Adamantite spear that provides an incredible boost to strength, and ignores target's defence."
  },
  // - weapons - scatter
  scatter1: {
    name: 'bronze whip',
    sell: 10,
    strength: 1,
    type: 'equipment',
    subType: 'weapon',
    multiTarget: true,
    description: "Bronze whip that provides a boost to strength, and damages multiple targets."
  },
  airScatter1: {
    name: 'air whip',
    sell: 10,
    strength: 1,
    type: 'equipment',
    subType: 'weapon',
    element: 'air',
    multiTarget: true,
    description: "Whip made of air, that damages multiple targets."
  },
  earthScatter1: {
    name: 'earth whip',
    sell: 10,
    strength: 1,
    type: 'equipment',
    subType: 'weapon',
    element: 'earth',
    multiTarget: true,
    description: "Whip made of earth, that damages multiple targets."
  },
  fireScatter1: {
    name: 'fire whip',
    sell: 10,
    strength: 1,
    type: 'equipment',
    subType: 'weapon',
    element: 'fire',
    multiTarget: true,
    description: "Whip made of fire, that damages multiple targets."
  },
  waterScatter1: {
    name: 'water whip',
    sell: 10,
    strength: 1,
    type: 'equipment',
    subType: 'weapon',
    element: 'water',
    multiTarget: true,
    description: "Whip made of water, that damages multiple targets."
  },
  scatter2: {
    name: 'iron whip',
    sell: 10,
    strength: 1,
    type: 'equipment',
    subType: 'weapon',
    multiTarget: true,
    description: "Iron whip that provides a superior boost to strength, and damages multiple targets."
  },
  airScatter2: {
    name: 'improved air whip',
    sell: 10,
    strength: 2,
    type: 'equipment',
    subType: 'weapon',
    element: 'air',
    multiTarget: true,
    description: "Improved whip made of air, that damages multiple targets."
  },
  earthScatter2: {
    name: 'improved earth whip',
    sell: 10,
    strength: 2,
    type: 'equipment',
    subType: 'weapon',
    element: 'earth',
    multiTarget: true,
    description: "Improved whip made of earth, that damages multiple targets."
  },
  fireScatter2: {
    name: 'improved fire whip',
    sell: 10,
    strength: 2,
    type: 'equipment',
    subType: 'weapon',
    element: 'fire',
    multiTarget: true,
    description: "Improved whip made of fire, that damages multiple targets."
  },
  waterScatter2: {
    name: 'improved water whip',
    sell: 10,
    strength: 2,
    type: 'equipment',
    subType: 'weapon',
    element: 'water',
    multiTarget: true,
    description: "Improved whip made of water, that damages multiple targets."
  },
  scatter3: {
    name: 'adamantite whip',
    sell: 10,
    strength: 3,
    type: 'equipment',
    subType: 'weapon',
    multiTarget: true,
    description: "Adamantite whip that provides an incredible boost to strength, and damages multiple targets."
  },
  // - armour
  armour1: {
    name: 'bronze shield',
    buy: 20,
    sell: 10,
    defence: 1,
    type: 'equipment',
    subType: 'armour',
    description: "Bronze shield that provides some defence."
  },
  airArmour1: {
    name: 'air shield',
    sell: 15,
    defence: 1,
    type: 'equipment',
    subType: 'armour',
    resist: [['air', 'half']],
    description: "Shield that halves air damage."
  },
  earthArmour1: {
    name: 'earth shield',
    sell: 15,
    defence: 1,
    type: 'equipment',
    subType: 'armour',
    resist: [['earth', 'half']],
    description: "Shield that halves earth damage."
  },
  fireArmour1: {
    name: 'fire shield',
    sell: 15,
    defence: 1,
    type: 'equipment',
    subType: 'armour',
    resist: [['fire', 'half']],
    description: "Shield that halves fire damage."
  },
  waterArmour1: {
    name: 'water shield',
    sell: 15,
    defence: 1,
    type: 'equipment',
    subType: 'armour',
    resist: [['water', 'half']],
    description: "Shield that halves water damage."
  },
  armour2: {
    name: 'iron shield',
    sell: 15,
    defence: 2,
    type: 'equipment',
    subType: 'armour',
    description: "Iron shield that provides superior defence."
  },
  airArmour2: {
    name: 'greater air shield',
    sell: 15,
    defence: 1,
    type: 'equipment',
    subType: 'armour',
    resist: [['air', 'immune'],['earth', 'weak']],
    description: "Shield that provides immunity to air damage, but weakness to earth."
  },
  earthArmour2: {
    name: 'greater earth shield',
    sell: 15,
    defence: 1,
    type: 'equipment',
    subType: 'armour',
    resist: [['earth', 'immune'],['air', 'weak']],
    description: "Shield that provides immunity to earth damage, but weakness to air."
  },
  fireArmour2: {
    name: 'greater fire shield',
    sell: 15,
    defence: 1,
    type: 'equipment',
    subType: 'armour',
    resist: [['fire', 'immune'],['water', 'weak']],
    description: "Shield that provides immunity to fire damage, but weakness to water."
  },
  waterArmour2: {
    name: 'greater water shield',
    sell: 15,
    defence: 1,
    type: 'equipment',
    subType: 'armour',
    resist: [['water', 'immune'],['fire', 'weak']],
    description: "Shield that provides immunity to water damage, but weakness to fire."
  },
  airArmour3: {
    name: 'protection from air shield',
    sell: 15,
    defence: 0,
    type: 'equipment',
    subType: 'armour',
    resist: [['air', 'immune']],
    description: "Shield that provides immunity to air damage."
  },
  earthArmour3: {
    name: 'protection from earth shield',
    sell: 15,
    defence: 0,
    type: 'equipment',
    subType: 'armour',
    resist: [['earth', 'immune']],
    description: "Shield that provides immunity to earth damage."
  },
  fireArmour3: {
    name: 'protection from fire shield',
    sell: 15,
    defence: 0,
    type: 'equipment',
    subType: 'armour',
    resist: [['fire', 'immune']],
    description: "Shield that provides immunity to fire damage."
  },
  waterArmour3: {
    name: 'protection from water shield',
    sell: 15,
    defence: 0,
    type: 'equipment',
    subType: 'armour',
    resist: [['water', 'immune']],
    description: "Shield that provides immunity to water damage."
  },
  airArmour4: {
    name: 'air barrier shield',
    sell: 15,
    defence: 3,
    type: 'equipment',
    subType: 'armour',
    resist: [['earth', 'weak']],
    description: "Shield that uses air to provide incredible defence, but is weak to earth."
  },
  earthArmour4: {
    name: 'earth barrier shield',
    sell: 15,
    defence: 3,
    type: 'equipment',
    subType: 'armour',
    resist: [['air', 'weak']],
    description: "Shield that uses earth to provide incredible defence, but is weak to air."
  },
  fireArmour4: {
    name: 'fire barrier shield',
    sell: 15,
    defence: 3,
    type: 'equipment',
    subType: 'armour',
    resist: [['water', 'weak']],
    description: "Shield that uses fire to provide incredible defence, but is weak to water."
  },
  waterArmour4: {
    name: 'water barrier shield',
    sell: 15,
    defence: 3,
    type: 'equipment',
    subType: 'armour',
    resist: [['fire', 'weak']],
    description: "Shield that uses water to provide incredible defence, but is weak to fire."
  },
  armour3: {
    name: 'elemental shield',
    sell: 15,
    defence: 3,
    type: 'equipment',
    subType: 'armour',
    resist: [['air', 'half'],['earth', 'half'],['fire', 'half'],['water', 'half']],
    description: "Shield that halves all elemental damage."
  },
  // - accessories - basic
  phoenixAcc: {
    name: 'phoenix charm',
    sell: 20,
    type: 'equipment',
    subType: 'accessory',
    description: "Brings the wearer back at half their max hp if they are KO'd, but breaks in the process."
  },
  maxHPAcc: {
    name: 'max hp charm',
    sell: 20,
    type: 'equipment',
    subType: 'accessory',
    description: "Increases the wearers maximum HP."
  },
  lureAcc: {
    name: 'lure charm',
    sell: 20,
    type: 'equipment',
    subType: 'accessory',
    description: "Increases the spawn rate of enemies."
  },
  vampireAcc: {
    name: 'vampire charm',
    sell: 20,
    type: 'equipment',
    subType: 'accessory',
    description: "Heals the wearer when they deal damage."
  },
  immunePoisonAcc: {
    name: 'antidote charm',
    sell: 20,
    type: 'equipment',
    subType: 'accessory',
    immune: ['poisoned'],
    description: "Grants the wearer immunity to poison."
  },
  thornsAcc: {
    name: 'thorns charm',
    sell: 20,
    type: 'equipment',
    subType: 'accessory',
    description: "Deals damage to anyone who attacks the wearer."
  },
  immuneSlowAcc: {
    name: 'speed charm',
    sell: 20,
    type: 'equipment',
    subType: 'accessory',
    immune: ['slow'],
    description: "Grants the wearer immunity to slow."
  },
  luckyAcc: {
    name: 'lucky charm',
    sell: 20,
    type: 'equipment',
    subType: 'accessory',
    description: "Increases the likelihood loot will drop when an enemy is defeated."
  },
  immuneFumbleAcc: {
    name: 'grip charm',
    sell: 20,
    type: 'equipment',
    subType: 'accessory',
    immune: ['fumble'],
    description: "Grants the wearer immunity to fumble."
  },
  // - accessories - special
  airAffinityAcc: {
    name: 'air affinity charm',
    sell: 20,
    type: 'equipment',
    subType: 'accessory',
    affinity: ['air'],
    description: "Wearer deals more air damage."
  },
  earthAffinityAcc: {
    name: 'earth affinity charm',
    sell: 20,
    type: 'equipment',
    subType: 'accessory',
    affinity: ['earth'],
    description: "Wearer deals more earth damage."
  },
  fireAffinityAcc: {
    name: 'fire affinity charm',
    sell: 20,
    type: 'equipment',
    subType: 'accessory',
    affinity: ['fire'],
    description: "Wearer deals more fire damage."
  },
  waterAffinityAcc: {
    name: 'water affinity charm',
    sell: 20,
    type: 'equipment',
    subType: 'accessory',
    affinity: ['water'],
    description: "Wearer deals more water damage."
  },
  enduringOffenceAcc: {
    name: 'enduring offence charm',
    sell: 20,
    type: 'equipment',
    subType: 'accessory',
    affinity: ['offence'],
    description: "Offensive status affects the wearer inflicts last longer."
  },
  enduringDefenceAcc: {
    name: 'enduring defence charm',
    sell: 20,
    type: 'equipment',
    subType: 'accessory',
    affinity: ['defence'],
    description: "Defensive status affects the wearer inflicts last longer."
  },
  healingAffinityAcc: {
    name: 'healing affinity charm',
    sell: 20,
    type: 'equipment',
    subType: 'accessory',
    affinity: ['healing'],
    description: "Wearer's healing is more effective."
  },
  airEarthAffinityAcc: {
    name: 'air and earth affinity charm',
    sell: 20,
    type: 'equipment',
    subType: 'accessory',
    affinity: ['air', 'earth'],
    description: "Wearer deals more air & earth damage."
  },
  fireWaterAffinityAcc: {
    name: 'fire and water affinity charm',
    sell: 20,
    type: 'equipment',
    subType: 'accessory',
    affinity: ['fire', 'water'],
    description: "Wearer deals more fire & water damage."
  },
  totalEnduranceAcc: {
    name: 'total endurance charm',
    sell: 20,
    type: 'equipment',
    subType: 'accessory',
    affinity: ['offence', 'defence'],
    description: "Status affects the wearer inflicts last longer."
  },
  elementalAffinityAcc: {
    name: 'elemental affinity charm',
    sell: 20,
    type: 'equipment',
    subType: 'accessory',
    affinity: ['air', 'earth', 'fire', 'water'],
    description: "Wearer deals more elemental damage."
  },
  itemAffinityAcc: {
    name: 'total endurance charm',
    sell: 20,
    type: 'equipment',
    subType: 'accessory',
    affinity: ['air', 'earth', 'fire', 'water', 'healing', 'offence', 'defence'],
    description: "Status affects the wearer inflicts last longer, wearer's healing is more effective and they deal more elemental damage."
  }
};

var craftingRecipes = {
  // items
  // - healing
  heal1: {
    healingHerb: 2,
    slime: 1
  },
  revive1: {
    healingHerb: 3,
    magicDust: 2
  },
  // - magic
  air1: {
    airStone: 2,
    magicDust: 1
  },
  earth1: {
    earthStone: 2,
    magicDust: 1
  },
  fire1: {
    fireStone: 2,
    magicDust: 1
  },
  water1: {
    waterStone: 2,
    magicDust: 1
  },
  // equipment
  // - weapons - swords
  airSword1: {
    sword1: 1,
    air1: 1
  },
  earthSword1: {
    sword1: 1,
    earth1: 1
  },
  fireSword1: {
    sword1: 1,
    fire1: 1
  },
  waterSword1: {
    sword1: 1,
    water1: 1
  },
  // - armour
  airArmour1: {
    armour1: 1,
    air1: 1
  },
  earthArmour1: {
    armour1: 1,
    earth1: 1
  },
  fireArmour1: {
    armour1: 1,
    fire1: 1
  },
  waterArmour1: {
    armour1: 1,
    water1: 1
  }
};

var areas = {
  1: {
    name: 'Arid Wastes',
    enemies: [1,2,4],
    //wolf, imp, fire sprite
    known: true,
    description: 'These wastes are arid.',
    level: 1
  },
  2: {
    name: 'Foggy Marsh',
    enemies: [1,3,5],
    //wolf, large slime, water sprite
    known: true,
    description: 'This marsh is foggy.',
    level: 1
  },
  3: {
    name: 'Crumbling Mountain Pass',
    enemies: [1,2,6],
    //wolf, imp, air sprite
    known: false,
    description: 'This mountain pass is crumbling.',
    level: 5
  },
  4: {
    name: 'Deep Caverns',
    enemies: [1,3,7],
    //wolf, large slime, earth sprite
    known: false,
    description: 'These caverns are deep.',
    level: 5
  }
};
var currentArea = 2;

var saveData = {
  text: '',
  date: '',
  created: '',
  lastTime: '',
  totalTime: '',
  resources: resources.save(),
  allies: entities.save(),
  enemies: enemyTypes.save()
};

var gameEl = document.getElementById("game"),
      infoEl = document.getElementById("info"),
      allyEls = document.getElementById("allies").children,
      foeEls = document.getElementById("foes").children,
    feed = document.getElementById('feed'),
    menuEl = document.getElementById("menu"),
    allyDetailsEl = document.getElementById('allyDetails'),
    areaEl = document.getElementById("area"),
    shopEl = document.getElementById("shop"),
    craftEl = document.getElementById("craft"),
    inventoryEl = document.getElementById("inventory"),
    bestiaryEl = document.getElementById("bestiary"),
    saveEl = document.getElementById("save"),
      inputxt = document.getElementById("inputxt"),
      outputxt = document.getElementById("outputxt"),
    descriptionEl = document.getElementById("description");

var passedTime = 0,
    paused = false,
    clickedTarget = '',
    clickedTargetEl = '',
    clickedItem = '',
    selectOpen = ['', false],
    dragSrcEl = null,
    subMenu = '',
    filter = '',
    lastUpdate = Date.now(),
    updateInterval = 1000/30,
    knownRecipes = 0,
    pressureTime = 10000;

// formatting purpose stuff
function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.substring(1);
}
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
// time stuff
function pad(n) {
  return n < 10 ? '0' + n : n;
}
function dhms(t) {
    var cd = 24 * 60 * 60 * 1000,
        ch = 60 * 60 * 1000,
        cm = 60 * 1000,
        d = Math.floor(t / cd),
        h = Math.floor( (t - d * cd) / ch),
        m = Math.floor( (t - d * cd - h * ch) / cm),
        s = Math.round( (t - d * cd - h * ch - m * cm) / 1000);
  if( s === 60 ){
    m++;
    s = 0;
  }
  if( m === 60 ){
    h++;
    m = 0;
  }
  if( h === 24 ){
    d++;
    h = 0;
  }
  return d+"d "+pad(h)+"h "+pad(m)+"m "+pad(s)+"s";
}
function getDt() {
  var now = Date.now();
  var dt = now - lastUpdate;
  lastUpdate = now;
  return dt;
}//game stuff
// menu stuff
function addHighlight(section) {
  document.getElementsByName(section)[0].classList.add('highlight');
}
function menu() {
  menuEl.classList.toggle('hidden');
}
function toggleSection(section) {
  var sectionEL;
  var sectionsArray = [[allyDetailsEl, "allyDetails", showAllyDetails],
                       [areaEl, "area", showArea],
                       [shopEl, "shop", showShop],
                       [craftEl, "craft", showCraft],
                       [inventoryEl, "inventory", showInventory],
                       [bestiaryEl, "bestiary", showBestiary],
                       [saveEl, "save", showSave]];
  
  // clear highlight if button was highlighted
  if (section != 'allyDetails')
  document.getElementsByName(section)[0].classList.remove('highlight');
  
  // reset the submenu & filter
  subMenu = '';
  filter = '';

  // reset the description
  clickedItem = '';
  descriptionEl.classList.add('hidden');

  // set sectionEl to the section
  sectionsArray.some(el => {
    if (el[1] == section) {
      sectionEl = el[0];
      return true;
    }
    else return false;
  });

  // if the game is already paused
  if (paused) {
    // if allyDetails was the active section
    if (!allyDetailsEl.classList.contains('hidden')) {
      // reset the target el
      clickedTargetEl.classList.remove('selected');
      clickedTarget = '';
      clickedTargetEl = '';
    }
    // if sectionEl wasn't the active section
    if (sectionEl.classList.contains('hidden')) {
      // hide all the other sections
      sectionsArray.forEach(el => {
        if (el[0] != sectionEl) {
          el[0].classList.add('hidden');
          
          // unselect the menu buttons
          if (el[1] != 'allyDetails')
          menuEl.querySelector('button[name="'+el[1]+'"]').classList.remove('selected');
        }
      });
    }
    // if sectionEl was the active section
    // or we can't tell which of skills or gambits was the last section open,
    // but the user clicked on the same ally again
    if (!sectionEl.classList.contains('hidden')) {
      // unpause the game
      paused = !paused;
    }
  } else {
    // if the game wasn't already paused
    // pause the game
    paused = !paused;
  }
  // hide sectionEl if it was hidden,
  // unhide it if it wasn't hidden
  sectionEl.classList.toggle('hidden');

  // unselect menu button if it was already selected,
  // select it if it wasn't already selected
  if (section != 'allyDetails')
  menuEl.querySelector('button[name="'+section+'"]').classList.toggle('selected');

  // show the right section
  sectionsArray.some(el => {
    if (el[1] == section) {
      el[2]();
      return true;
    }
    else return false;
  });
}
function subSectionNavigation(section, subMenuName, optFilter) {
  if (subMenuName != "") subMenu = subMenuName;
  filter = optFilter || '';

  // reset the description
  clickedItem = '';
  descriptionEl.classList.add('hidden');

  switch (section) {
    case 'shop':
      showShop();
      break;
    case 'inventory':
      showInventory();
      break;
    case 'craft':
      showCraft();
      break;
    case 'allyDetails':
      showAllyDetails();
      break;
  }
}
// area stuff
function checkAreaLevels(lvl) {
  var newArea = false;

  Object.keys(areas).forEach(area => {
    if ((areas[area].level-2 == lvl) && areas[area].known == false) {
      areas[area].known = true;
      newArea = true;
    }
  });

  if (newArea) addHighlight("area");
}
function clickedEnemyDesc(enemy) {
  selectedEnemy = enemy;
  toggleSection("bestiary");
}
function showSpawns() {
  var list = '';

  Object.keys(enemyTypes.data.spawned).forEach( enemy => {
    if (enemyTypes.data.spawned[enemy].area.includes(currentArea))
    list += "<div class='item desc' onclick='clickedEnemyDesc("+enemy+")'>"+
            enemyTypes[enemy].name+"</div>";
  });

  var content = (list != '') ? "<div class='item break'>Sighted enemies:</div>"+list : '';

  return content;
}
function showArea() {
  var content = '';
  if (paused) {
    content += "<div class='itemList'>";

    Object.keys(areas).some( area => {
      if (areas[area].known == false) return false;

      var areaSelected = (area == currentArea) ? 'disabled' : '';
      
      content +=
      "<div class='item'>"+
        "<button onclick='setArea("+area+")' "+areaSelected+">"+areas[area].name+"</button>"+
      "</div>";
    });

    content +=
    "</div><div class='itemList'>"+
      "<div class='item title'>"+areas[currentArea].name+"</div>"+
      "<div class='item'>"+areas[currentArea].description+"</div>"+
      "<div class='item break'>Area level: "+areas[currentArea].level+"</div>"+
      showSpawns()+
    "</div>";
  }
  areaEl.innerHTML = content;
}
function setArea(newArea) {
  currentArea = newArea;
  clearAllEnemies();
  showArea();
}
// dialogue stuff
function closeDialogue() {
  // close the dialogue
  document.getElementById("dialogue").remove();
}
function confirmDialogue(item, type) {
  // get the value
  var num = parseInt(document.getElementById("amount").value);

  // confirm the dialogue
  switch (type) {
    case "buy":
      buy(item, num);
      break;
    case "sell":
      sell(item, num);
      break;
    case "craft":
      craft(item, num);
      break;
  }

  // close dialogue
  closeDialogue();
}
function checkInput(input, max) {
  var checking = parseInt(input.value, 10);

  if (checking == NaN || checking < 1) input.value = 1;
  else if (checking > max) input.value = max;
}
function showDialogue(item, type) {
  var max,
      msg = capitalizeFirstLetter(type)+" how many "+itemTypes[item].name+"s?",
      dialogue = document.createElement("div");

  // set max
  switch (type) {
    case "buy":
      max = Math.floor(resources.data.gold / itemTypes[item].buy);
      break;
    case "sell":
      max = resources.data[item];
      break;
    case "craft":
      var maxArr = [];

      Object.keys(craftingRecipes[item]).forEach( ingredient => {
        maxArr.push(Math.floor(resources.data[ingredient] / craftingRecipes[item][ingredient]));
      });

      max = Math.min(...maxArr);
      break;
  }

  dialogue.id = 'dialogue';
  
  dialogue.innerHTML =
  "<div class='content'>"+
    "<div>"+msg+"</div>"+
    "<div class='row'>"+
      "<input type='number' id='amount' name='amount' min='1' max=\'"+max+"\' value='1' oninput='checkInput(this, \""+max+"\")'>"+
      "<button class='material-icons' onclick='closeDialogue()'>clear</button>"+
      "<button class='material-icons' onclick='confirmDialogue(\""+item+"\", \""+type+"\")'>check</button>"+
    "</div>"+
  "</div>";

  descriptionEl.parentNode.insertBefore(dialogue, descriptionEl.nextSibling);
}
// shop stuff
function isShopFilter(filterName) {
  return Object.keys(itemTypes).some( item => {
    if (subMenu == "buy") {
      if (('buy' in itemTypes[item]) &&
         ((itemTypes[item].type == filterName) || (itemTypes[item].subType == filterName) || (filterName == 'all'))) return true;
    } else {
      if (('sell' in itemTypes[item]) && (item in resources.data) && (resources.data[item] > 0) &&
         ((itemTypes[item].type == filterName) || (itemTypes[item].subType == filterName) || (filterName == 'all'))) return true;
    }
  });
}
function showShop() {
  var content = '';
  if (paused) {
    // submenu
    var buySelected = '',
        sellSelected = '';

    switch (subMenu) {
      default:
        subMenu = "buy";
      case "buy":
        buySelected = 'disabled';
        break;
      case "sell":
        sellSelected = 'disabled';
        break;
    }

    // filter
    var selected = {
      item: '',
      ingredient: '',
      weapon: '',
      armour: '',
      accessory: ''
    };

    Object.keys(selected).forEach( key => {
      if (!isShopFilter(key)) selected[key] = 'none';
    });

    if (filter in selected && selected[filter] != 'none') selected[filter] = 'disabled';
    else {
      Object.keys(selected).some( key => {
        if (selected[key] != 'none') {
          filter = key;
          selected[filter] = 'disabled';
          return true;
        } else filter = 'name';
      });
    }

    // content
    content +=
    "<div class='menuHolder'>"+
      "<div class='subMenu'>"+
        "<button name='buy' onclick='subSectionNavigation(\"shop\", \"buy\")' "+buySelected+">buy</button>"+
        "<button name='sell' onclick='subSectionNavigation(\"shop\", \"sell\")' "+sellSelected+">sell</button>"+
      "</div>"+
      "<div class='filter'>";

    Object.keys(selected).forEach( key => {
      if (selected[key] != 'none') {
        content +=
        "<button name='"+key+"' class='icon-"+key+"' "+
          "onclick='subSectionNavigation(\"shop\", \"\", \""+key+"\")' "+selected[key]+"></button>";
      }
    });

    content +=
    "</div></div>"+
    "<div class='item title'>"+
      "<div>"+filter+"</div>"+
      "<div>price</div>"+
      "<div>owned</div>"+
      "<div>"+subMenu+"</div>"+
    "</div><div class='itemList'>";
    
    var btnDisabled = '';

    Object.keys(itemTypes).some( item => {
      var owned = ((subMenu == "buy" && item in resources.data) || subMenu == "sell") ? resources.data[item] : 0;

      if (subMenu == "buy") {
        if (!('buy' in itemTypes[item]) ||
        ((itemTypes[item].type != filter) && (itemTypes[item].subType != filter) && (filter != 'all'))) return false;
        btnDisabled = (resources.data.gold >= itemTypes[item].buy) ? '' : 'disabled';
      } else {
        if (!('sell' in itemTypes[item]) || !(item in resources.data) || !(resources.data[item] > 0) ||
           ((itemTypes[item].type != filter) && (itemTypes[item].subType != filter) && (filter != 'all'))) return false;
        if (itemTypes[item].type == "equipment")
        btnDisabled = (countSpare(item) > 0) ? '' : 'disabled';
      }
      
      content +=
      "<div class='item desc' onclick='showDescription(event, this, \"shop\")'>"+
        "<div>"+itemTypes[item].name+"</div>"+
        "<div>"+itemTypes[item][subMenu]+"G</div>"+
        "<div>"+owned+"</div>"+
        "<div>"+
          "<button onclick='showDialogue(\""+item+"\", \""+subMenu+"\")' "+btnDisabled+">"+subMenu+"</button>"+
        "</div>"+
      "</div>";
    });

    content += "</div>";
  }
  shopEl.innerHTML = content;
}
function buy(item, optNum) {
  var num = optNum || 1;
  resources.data.gold -= itemTypes[item].buy * num;
  if (!(item in resources.data)) {
    resources.data[item] = 0;
    flagIfNewRecipe();
  }
  resources.data[item] += num;
  showShop();
}
function sell(item, optNum) {
  var num = optNum || 1;
  resources.data.gold += itemTypes[item].sell * num;
  resources.data[item] -= num;
  showShop();
}
// craft stuff
function isCraftFilter(filterName) {
  return Object.keys(craftingRecipes).some( recipe => {
    var knownRecipe = true;

    switch (filterName) {
      case "all":
        return true;
      case "healing":
        if (!("healing" in itemTypes[recipe])) return false;
        break;
      case "item":
        if (!(itemTypes[recipe].type == "item")) return false;
        break;
      case "weapon":
        if (!(itemTypes[recipe].subType == "weapon")) return false;
        break;
      case "armour":
        if (!(itemTypes[recipe].subType == "armour")) return false;
        break;
      case "accessory":
        if (!(itemTypes[recipe].subType == "accessory")) return false;
        break;
    }

    Object.keys(craftingRecipes[recipe]).some( ingredient => {
      if (!(ingredient in resources.data)) {
        knownRecipe = false;
        return false;
      }
    });
    if (!knownRecipe) return false;
    else return true;
  });
}
function flagIfNewRecipe() {
  var recipeCount = countKnownRecipes();
  if (recipeCount > knownRecipes) {
    knownRecipes = recipeCount;
    addHighlight('craft');
  }
}
function countKnownRecipes() {
  var knownRecipeCount = 0;

  Object.keys(craftingRecipes).forEach( recipe => {
    var knownRecipe = true;

    Object.keys(craftingRecipes[recipe]).some( ingredient => {
      if (!(ingredient in resources.data)) {
        knownRecipe = false;
        return false;
      }
    });

    if (knownRecipe) knownRecipeCount++;
  });
  
  return knownRecipeCount;
}
function showCraft() {
  var content = '';
  if (paused) {
    var selected = {
      all: '',
      healing: '',
      item: '',
      weapon: '',
      armour: '',
      accessory: ''
    };

    Object.keys(selected).forEach( key => {
      if (!isCraftFilter(key)) selected[key] = 'none';
    });

    if (filter in selected && selected[filter] != 'none') selected[filter] = 'disabled';
    else {
      Object.keys(selected).some( key => {
        if (selected[key] != 'none') {
          filter = key;
          selected[filter] = 'disabled';
          return true;
        } else filter = 'name';
      });
    }

    content += "<div class='filter'>";

    Object.keys(selected).forEach( key => {
      if (selected[key] != 'none') {
        var classBased = (key == "all") ? ["", "all"] : ["class='icon-"+key+"' ", ""];
        content +=
        "<button name='"+key+"' "+classBased[0]+
          "onclick='subSectionNavigation(\"craft\", \"\", \""+key+"\")' "+selected[key]+">"+classBased[1]+"</button>";
      }
    });

    content +=
    "</div>"+
    "<div class='item title'>"+
      "<div class='col'>"+
        "<div class='lineItem'>"+
          "<div>"+filter+"</div>"+
          "<div>owned</div>"+
        "</div>"+
      "</div>"+
      "<div class='col'>"+
        "<div class='lineItem'>"+
          "<div>ingredient</div>"+
          "<div>qty.</div>"+
        "</div>"+
      "</div>"+
      "<div class='col'>"+
        "<div class='lineItem'>"+
          "<div>craft</div>"+
        "</div>"+
      "</div>"+
    "</div><div class='itemList'>";
    
    Object.keys(craftingRecipes).some( recipe => {
      var knownRecipe = true;
      var lackingIngredients = false;
      var ingredientList = '';

      switch (filter) {
        case "all":
          break;
        case "healing":
          if (!("healing" in itemTypes[recipe])) return false;
          break;
        case "item":
          if (!(itemTypes[recipe].type == "item")) return false;
          break;
        case "weapon":
          if (!(itemTypes[recipe].subType == "weapon")) return false;
          break;
        case "armour":
          if (!(itemTypes[recipe].subType == "armour")) return false;
          break;
        case "accessory":
          if (!(itemTypes[recipe].subType == "accessory")) return false;
          break;
      }

      Object.keys(craftingRecipes[recipe]).some ( ingredient => {
        if (!(ingredient in resources.data)) {
          knownRecipe = false;
          return false;
        } else {
          var available = resources.data[ingredient];
          if (itemTypes[ingredient].type == 'equipment') available = countSpare(ingredient);
          if (available < craftingRecipes[recipe][ingredient]) lackingIngredients = true;
          
          ingredientList += "<div class='lineItem'>"+
                              "<div>"+itemTypes[ingredient].name+"</div>"+
                              "<div>"+craftingRecipes[recipe][ingredient]+"/"+available+"</div>"+
                            "</div>";
        }
      });
      if (!knownRecipe) return false;
      
      var owned = (!(recipe in resources.data)) ? 0 : resources.data[recipe];

      var btnDisabled = (lackingIngredients) ? 'disabled' : '';

      content +=
      "<div class='item desc' onclick='showDescription(event, this, \"craft\")'>"+
        "<div class='col'>"+
          "<div class='lineItem'>"+
            "<div>"+itemTypes[recipe].name+"</div>"+
            "<div>"+owned+"</div>"+
          "</div>"+
        "</div>"+
        "<div class='col'>"+ingredientList+"</div>"+
        "<div class='col'>"+
          "<div class='lineItem'>"+
            "<button onclick='showDialogue(\""+recipe+"\", \"craft\")' "+btnDisabled+">craft</button>"+
          "</div>"+
        "</div>"+
      "</div>";
    });

    content += "</div>";
  }
  craftEl.innerHTML = content;
}
function craft(recipe, optNum) {
  var num = optNum || 1;
  Object.keys(craftingRecipes[recipe]).forEach( ingredient => {
    resources.data[ingredient] -= craftingRecipes[recipe][ingredient] * num;
  });
  if (!(recipe in resources.data)) resources.data[recipe] = 0;
  resources.data[recipe] += num;
  showCraft();
}
// inventory stuff
function isInventoryFilter(filterName) {

}
function showInventory() {
  var content = '';
  if (paused) {
    var selected = {
      item: '',
      ingredient: '',
      weapon: '',
      armour: '',
      accessory: ''
    };

    if (!(filter in selected)) filter = 'item';
    selected[filter] = 'disabled';

    content +=
    "<div class='filter'>";

    Object.keys(selected).forEach( key => {
      content +=
      "<button name='"+key+"' class='icon-"+key+"' "+
        "onclick='subSectionNavigation(\"inventory\", \"\", \""+key+"\")' "+selected[key]+"></button>";
    });

    content +=
    "</div>"+
    "<div class='item title'>"+
      "<div>"+filter+"</div>";

    if (filter != 'item' && filter != 'ingredient') {
      content += "<div>equipped/owned</div></div><div class='itemList'>";
    } else {
      content += "<div>owned</div></div><div class='itemList'>";
    }
    
    Object.keys(itemTypes).some( item => {
      if (!(item in resources.data) || !(resources.data[item] > 0) || ((itemTypes[item].type != filter) && (itemTypes[item].subType != filter)))
      return false;
      
      content +=
      "<div class='item desc' onclick='showDescription(event, this, \"inventory\")'>"+
        "<div>"+itemTypes[item].name+"</div>";

      if (filter != 'item' && filter != 'ingredient') {
        var equipped = resources.data[item] - countSpare(item);
        content += "<div>"+equipped+"/"+resources.data[item]+"</div></div>";
      } else {
        content += "<div>"+resources.data[item]+"</div></div>";
      }
        
    });

    content += "</div>";
  }
  inventoryEl.innerHTML = content;
}
// bestiary stuff
function showBestiary() {
  var content = '';
  if (paused) {
    content += "<div class='itemList'>";

    // populate the enemy list
    if (selectedEnemy == '' && Object.keys(enemyTypes.data.spawned).length >= 1)
    selectedEnemy = Object.keys(enemyTypes.data.spawned)[0];

    Object.keys(enemyTypes.data.spawned).some( enemy => {
      var enemySelected = (enemy == selectedEnemy) ? 'disabled' : '';
      
      content +=
      "<div class='item'>"+
        "<button onclick='selectEnemy(\""+enemy+"\")' "+enemySelected+">"+enemyTypes[enemy].name+"</button>"+
      "</div>";
    });

    content += "</div>";

    // if there's a enemy to show details about...
    if (selectedEnemy != '') {
      var numKilled = (selectedEnemy in enemyTypes.data.killed) ? enemyTypes.data.killed[selectedEnemy] : 0; 

      // show name and num killed
      content +=
      "<div class='itemList'>"+
        "<div class='item title'>"+enemyTypes[selectedEnemy].name+"</div>"+
        "<div class='item'>Killed: "+numKilled+"</div>";

      // if we've killed the enemy before...
      if (numKilled > 0) {
        // show loot...
        content += "<div class='item table'>"+
                     "<div class='row'>"+
                       "<div class='cell'>Loot</div>"+
                       "<div class='cell'>Qty</div>"+
                       "<div class='cell'>Drops</div>"+
                     "</div>";

        // already discovered loot...
        if (selectedEnemy in enemyTypes.data.looted) {
          var looted = true;
          enemyTypes.data.looted[selectedEnemy].forEach(loot => {
            var lootName = (loot[0] == 'gold') ? 'gold' : itemTypes[loot[0]].name;
            content += "<div class='row'>"+
                         "<div class='cell'>"+lootName+"</div>"+
                         "<div class='cell'> x"+pad(loot[1])+"</div>"+
                         "<div class='cell'>"+(loot[2]*100)+"%</div>"+
                       "</div>";
          });
        }

        // loot we haven't discovered yet...
        var missing = 0;
        if (looted) {
          if (enemyTypes.data.looted[selectedEnemy].length < enemyTypes[selectedEnemy].loot.length)
          missing = enemyTypes[selectedEnemy].loot.length - enemyTypes.data.looted[selectedEnemy].length;
        } else {
          missing = enemyTypes[selectedEnemy].loot.length;
        }

        for (let i=0; i < missing; i++) {
          content += "<div class='row'>"+
                       "<div class='cell'>???</div>"+
                       "<div class='cell'> x??</div>"+
                       "<div class='cell'>??%</div>"+
                     "</div>";
        }

        content += "</div>";

        // show element if there is one
        if ('element' in enemyTypes[selectedEnemy])
        content += "<div class='item'>element: "+enemyTypes[selectedEnemy].element+"</div>";

        // show resists if there are any
        if ('resist' in enemyTypes[selectedEnemy]) {
          var resists = '';

          getResists(enemyTypes[selectedEnemy]).forEach( element => {
            if (element[1] != 'none')
            resists += "<div class='item'>"+element[0]+": "+element[1]+"</div>";
          });

          content += resists;
        }

        // description
        content += "<div class='item break'>"+enemyTypes[selectedEnemy].description+"</div>";
      }

      content += "<div class='item break'>Sighted locations:</div>";

      enemyTypes.data.spawned[selectedEnemy].area.forEach( area => {
        content += "<div class='item inset'>"+areas[area].name+"</div>";
      });

      content += "</div>";
    }
  }
  bestiaryEl.innerHTML = content;
}
function selectEnemy(newEnemy) {
  selectedEnemy = newEnemy;
  showBestiary();
}
// save stuff
function showSave() {

}
function save() {
  var now = Date.now();
  
  saveData.text = inputxt.value;
  saveData.date = (new Date()).toLocaleString('en-US');
  if (saveData.created == '') saveData.created = now;
  saveData.lastTime = now;
  saveData.totalTime = passedTime;
  saveData.resources = resources.save();
  saveData.allies = entities.save();
  saveData.enemies = enemyTypes.save();
  saveData.area = currentArea;
  
  localStorage.setItem('saveData', JSON.stringify(saveData));
  if (logging.save) console.log(saveData);
  outputxt.innerHTML = 'data saved';
}
function retrieve() {
  if (localStorage.getItem('saveData') === null) {
    outputxt.innerHTML = "no saved data";
  } else {
    saveData = JSON.parse(localStorage.getItem('saveData'));
    if (logging.save) console.log(saveData);
    entities.update(saveData.allies);
    resources.update();
    enemyTypes.update();
    currentArea = saveData.area;
    passedTime = saveData.totalTime;
    var timeSinceLastSave = dhms(Date.now() - saveData.lastTime);
    var totalTimePlayed = dhms(saveData.totalTime);
    outputxt.innerHTML = "note: "+saveData.text+"<br>"+saveData.date+"<br>"+timeSinceLastSave;
  }
}
function deleteData() {
  if (localStorage.getItem('saveData') === null) {
    outputxt.innerHTML = "saved data does not exist";
  } else {
    localStorage.removeItem('saveData');
    outputxt.innerHTML = inputxt.value+' save data deleted';
  }
}
// description stuff
function showDescription(e, el, section) {
  var elItem = '';

  e = window.event || e;
  var clickedOther = (el !== e.target) ? true : false;

  if (section == "craft") {
    //.item .col:first-child .lineItem:first-child
    Object.keys(itemTypes).some( item => {
      if (itemTypes[item].name == el.firstChild.firstChild.firstChild.innerHTML) {
        elItem = itemTypes[item];
        return true;
      }
    });
  } else {
    //.item div:first-child
    var foundObject = Object.keys(itemTypes).some( item => {
      if (itemTypes[item].name == el.firstChild.innerHTML) {
        elItem = itemTypes[item];
        return true;
      }
    });

    if (!foundObject) {
      Object.keys(progression).some( item => {
        if (progression[item].name == el.firstChild.innerHTML) {
          elItem = progression[item];
          return true;
        }
      });
    }
  }
  
  if (elItem == clickedItem || clickedOther) {
    descriptionEl.classList.add('hidden');
    clickedItem = '';
  } else {
    clickedItem = elItem;
    descriptionEl.classList.remove('hidden');
  }
  
  descriptionEl.innerHTML =
  "<div>"+capitalizeFirstLetter(elItem.name)+":</div>"+
  "<div>"+elItem.description+"</div>";
}
// enemy stuff
function clearAllEnemies() {
  // we'll need to set a new target for the allies that were targeting foes
  var needsNewTarget = [];
  entities.allies.forEach(ally => {
    if (ally.nextAction.target != "" && ally.nextAction.target.type == "foe") needsNewTarget.push(ally);
  });

  // clear parent array
  entities.foes = [];

  // clear foe els
  removeFoeSlot(true);
  
  // set new target for allies that were targeting foes
  needsNewTarget.forEach(ally => { setNextAction(ally); });
}
function getRandomInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function checkForLurkers() {
  var numAllies = entities.allies.length,
      numFoes = entities.foes.length,
      enemiesAround = entities.lurkingFoes.length + numFoes;

  var KOdAllies = 0;
  entities.allies.forEach(ally => {
    if (ally.hp <= 0) KOdAllies++;
  });

  // if we are fighting the same number of enemies as allies for 10 secs, increase the pressure; add another enemy
  if (pressureTime && (numAllies > numFoes || numAllies < numFoes || KOdAllies == numAllies)) pressureTime = false;
  else if (!pressureTime && numAllies == numFoes) pressureTime = passedTime + 10000;

  // if there are less enemies around than allies
  if (enemiesAround < numAllies && !(KOdAllies == numAllies)) {
    // spawn foe after a short random length of time if there is 1 ally
    // spawn foe after a longer random length of time if there is more than 1 ally or already an enemy
    if (numAllies == 1 || numFoes == 1) entities.lurkingFoes.push(getRandomInclusive(0, 1500)+passedTime);
    else entities.lurkingFoes.push(getRandomInclusive(500, 2000)+passedTime);

  } else if (numAllies < 3 && pressureTime && pressureTime <= passedTime) {
    // if we aren't at the max 3 enemies cap
    // and we are taking too long to kill enemies, we'll spawn another enemy
    entities.lurkingFoes.push(passedTime);
  }
}
function checkIfLurkersEngage() {
  var i = entities.lurkingFoes.length;

  while (i--) {
    if (entities.lurkingFoes[i] <= passedTime) {
      entities.foes.push(generateEnemy());
      entities.lurkingFoes.splice(i, 1);
    }
  }
}
function addFoeSlot() {
  var foeHolderEl = document.getElementById("foes");

  foeSlotEl = document.createElement("div");
  foeSlotEl.classList.add('foe');

  foeHolderEl.appendChild(foeSlotEl);
}
function removeFoeSlot(optAll) {
  var foeHolderEl = document.getElementById("foes");

  if (optAll) {
    while (foeHolderEl.firstChild) {
      foeHolderEl.removeChild(foeHolderEl.lastChild);
    }
  } else foeHolderEl.removeChild(foeHolderEl.lastChild);
}
function getLevelModifier() {
  var randomNum = Math.ceil(Math.random() * 100);

  switch (true) {
    case (randomNum <= 5):
      return 2;
    case (randomNum <= 15):
      return 1;
    case (randomNum <= 90):
      return 0;
    case (randomNum <= 100):
      return -1;
  }
}
function generateEnemy(optEnemyType) {
  var enemyType = optEnemyType || areas[currentArea].enemies[(Math.floor(Math.random() * areas[currentArea].enemies.length))];
  var level = areas[currentArea].level + getLevelModifier();

  if (level < 1) level = 1;

  if (!(enemyType in enemyTypes.data.spawned)) {
    enemyTypes.data.spawned[enemyType] = {
      number: 0,
      area: [currentArea]
    };
  } else {
    if (!(enemyTypes.data.spawned[enemyType].area.includes(currentArea)))
    enemyTypes.data.spawned[enemyType].area.push(currentArea);
  }

  enemyTypes.data.spawned[enemyType].number++;

  var newEnemy = Object.create(enemyTypes.spawn(enemyType, enemyTypes.data.spawned[enemyType].number, level));

  if (logging.actions.current) console.log(passedTime+': '+newEnemy.name+' showed up');
  //addToFeed(newEnemy.name+' showed up');

  addFoeSlot();

  return newEnemy;
}
// ally stuff
function addAllySlot(cost) {
  var allyHolderEl = document.getElementById("allies");

  allySlotEl = document.createElement("div");
  allySlotEl.classList.add('ally');
  allySlotEl.onclick = function() { clickedAlly(this); };
  
  allySlotEl.innerHTML = "<div class='unlock'><span class='ally-color'>Hire hero for</span><br>"+cost+" gold</div>";

  allyHolderEl.appendChild(allySlotEl);
}
function showAllyDetails() {
  var content = '';
  if (paused) {
    // submenu
    var equipmentSelected = '',
        gambitsSelected = '',
        skillsSelected = '';

    switch (subMenu) {
      default:
        subMenu = "equipment";
      case "equipment":
        equipmentSelected = 'disabled';
        break;
      case "gambits":
        gambitsSelected = 'disabled';
        break;
      case "skills":
        skillsSelected = 'disabled';
        break;
    }

    // content
    content +=
    "<div class='subMenu'>"+
      "<button name='equipment' onclick='subSectionNavigation(\"allyDetails\", \"equipment\")' "+
        equipmentSelected+">equipment</button>"+
      "<button name='gambits' onclick='subSectionNavigation(\"allyDetails\", \"gambits\")' "+
        gambitsSelected+">gambits</button>"+
      "<button name='skills' onclick='subSectionNavigation(\"allyDetails\", \"skills\")' "+
        skillsSelected+">skills</button>"+
    "</div>";

    switch (subMenu) {
      case "equipment":
        content += showEquipment(clickedTarget);
        break;
      case "gambits":
        content += showGambits(clickedTarget);
        break;
      case "skills":
        content += showSkills(clickedTarget);
        break;
    }
  }
  allyDetailsEl.innerHTML = content;

  if (subMenu == "gambits") {
    var gambitsEl = document.getElementById("gambits");
    addGambitClickHandling(gambitsEl);
  }
}
function clickedAlly(targetEl) {
  var i = Array.from(targetEl.parentNode.children).indexOf(targetEl);
  var target = entities.allies[i];
  
  // if i clicked an ally
  if (target !== undefined) {
    if (logging.select) console.log(target.name);
    
    // if i didn't previously have a selected ally,
    // now this is the selected ally
    if (clickedTargetEl == '') clickedTargetEl = targetEl;
    if (clickedTarget == '') clickedTarget = target;

    // if i didn't previously have a different selected ally...
    if (clickedTarget == target) {
      // select this target if it's a new target
      // unselect this target if it's an old target
      targetEl.classList.toggle("selected");
      
      // toggle active sections,
      // unselect clicked target if gambits is already active
      toggleSection("allyDetails");
    } else {
      // if i had a different ally selected previously
      // unselect them and select the new ally i clicked
      clickedTargetEl.classList.toggle("selected");
      targetEl.classList.toggle("selected");
      clickedTarget = target;
      clickedTargetEl = targetEl;
    }
    showAllyDetails();
  } else {
    // if i didn't click an ally, let's try and unlock an ally
    // if ally number == 1, then we'll be trying to unlock ally 2
    // if ally number == 2, then we'll be trying to unlock ally 3

    var numAllies = entities.allies.length;
    var allyCost = (numAllies > 2) ? 200 : 50;
    // if we have enough gold, deduct gold and...
    if (resources.data.gold >= allyCost) {
      resources.data.gold -= allyCost;

      var xp = 0;
      var lp = 0;
      entities.allies.forEach(ally => {
        xp += ally.totalXp;
        lp += ally.totalLp;
      });
      xp = Math.ceil(xp/numAllies);
      lp = Math.ceil(lp/numAllies);

      var letter = String.fromCharCode(65 + numAllies);
      
      // add the new ally
      entities.allies.push(Object.create(charStats).initialise('Hero '+letter, xp, lp));
    }
  }
}
// equipment stuff
function countSpare(item, optTarget) {
  var haveTarget = optTarget || false;
  var subType = itemTypes[item].subType;

  // check if allies are already equipping them all
  var equipped = 0;
  entities.allies.forEach( ally => {
    if (haveTarget) {
      if (ally != optTarget && ally.equipment[subType] == item) equipped++;
    } else {
      if (ally.equipment[subType] == item) equipped++;
    }
  });
  // return the number of spare equipment
  return resources.data[item] - equipped;
}
function selectEquipmentEl(subType) {
  var defaultVal = clickedTarget.equipment[subType];
  var options = "<option value=''>-</option>";
  
  var selected = false;

  // go through itemTypes...
  Object.keys(itemTypes).forEach( item => {
    // and find all equipment with the right subType
    if (itemTypes[item].type == 'equipment' && itemTypes[item].subType == subType) {
      // check they appear in resources
      if (item in resources.data && resources.data[item] > 0) {
        options += "<option value='"+item+"'";
      
        // check to see if this is the current equipped item
        if (item == defaultVal) {
          options += ' selected';
          selected = true;
        }
        // if they are all equipped already...
        // of if target hasn't unlocked them in progression...
        if (!(countSpare(item, clickedTarget) > 0) || !(clickedTarget.progression.includes(item)))
        options += ' disabled';
        
        options += ">"+itemTypes[item].name+"</option>";
      }
    }
  });
  
  if (!selected) clickedTarget.equipment[subType] = '';
  
  return "<select name='"+subType+"' onchange='updateEquipment(this, \""+subType+"\")'>"+options+"</select>";
}
function getStrength(target) {
  var strength = target.strength;

  if (target.type == 'ally') {
    if (target.equipment.weapon != '') {
      strength += itemTypes[target.equipment.weapon].strength;
    }
  }

  if (hasStatus(target, "weak")) strength /= 2;
  if (hasStatus(target, "strong")) strength *= 2;
  
  return strength;
}
function getDamageType(target) {
  var damageType = 'none';

  if (target.type == 'ally') {
    if (target.equipment.weapon != '') { 
      if ('element' in itemTypes[target.equipment.weapon])
      damageType = itemTypes[target.equipment.weapon].element;
    }
  } else {
    if ('element' in target)
    damageType = target.element;
  }

  return damageType;
}
function getResists(target) {
  var resists = [['fire', 'none'],
                 ['water', 'none'],
                 ['air', 'none'],
                 ['earth', 'none']];

  if (target.type == 'ally') {
    if (target.equipment.armour != '') {
      if ('resist' in itemTypes[target.equipment.armour]) {
        itemTypes[target.equipment.armour].resist.forEach( element => {
          resists.forEach( res => {
            if (res[0] == element[0]) res[1] = element[1];
          });
        });
      }
    }
  } else {
    if ('resist' in target) {
      target.resist.forEach( element => {
        resists.forEach( res => {
          if (res[0] == element[0]) res[1] = element[1];
        });
      });
    }
  }

  return resists;
}
function getDefence(target) {
  var defence = target.defence || 0;
  var damageTaken = 1;

  if (target.type == 'ally') {
    if (target.equipment.armour != '') {
      defence += itemTypes[target.equipment.armour].defence;
    }
  }

  switch (defence) {
    case 1:
      damageTaken = 0.9;
      break;
    case 2:
      damageTaken = 0.875;
      break;
    case 3:
      damageTaken = 0.75;
      break;
  }

  if (hasStatus(target, "vulnerable")) damageTaken *= 2;
  if (hasStatus(target, "protected")) damageTaken /= 2;

  return damageTaken;
}
function updateEquipment(targetEl, subType) {
  clickedTarget.equipment[subType] = targetEl.value;
  showAllyDetails();
}
function showProgress(target) {
  var xpProgress,
      neededXp;

  if (target.lvl < 100) {
    var toNextLevelXp = xpToNextLvl(target.lvl);
    xpProgress = (target.xp/toNextLevelXp)*100;
    neededXp = toNextLevelXp-target.xp;
  } else {
    xpProgress = 100;
    neededXp = "max";
  }

  var content =
  "<div class='progress'>"+
    "<div class='progressInfo'>"+
      "<div><div>Total XP:</div><div>"+numberWithCommas(target.totalXp)+"</div></div>"+
      "<div><div>XP to next level:</div><div>"+numberWithCommas(neededXp)+"</div></div>"+
    "</div>"+
    "<div class='barHolder'><div class='xpBar' style='width:"+xpProgress+"%'></div>"+
  "</div>";

  return content;
}
function showEquipment(target) {
  var content = '';

  var weaponSelect = selectEquipmentEl('weapon');
  var armourSelect = selectEquipmentEl('armour');
  var accessorySelect = selectEquipmentEl('accessory');

  var resistDivs = '';
  getResists(target).forEach( element => {
    resistDivs += "<div><div>"+element[0]+"</div><div>"+element[1]+"</div></div>";
  });

  content +=
  "<div id='equipment'>"+
    "<div class='col'>"+
      "<div class='stat'><div class='label'>strength: </div><div>"+getStrength(target)+"</div></div>"+
      "<div class='stat'><div class='label'>element: </div><div>"+getDamageType(target)+"</div></div>"+
      "<div class='stat'><div class='label'>defence: </div><div>"+(100-(getDefence(target)*100)).toFixed(1)+"%</div></div>"+
      "<div class='stat'><div class='label'>elemental resist: </div><div>"+resistDivs+"</div></div>"+
    "</div><div class='col'>"+
      "<div class='equipment'>"+
        "<div class='slot'><div class='icon-weapon'></div>"+weaponSelect+"</div>"+
        "<div class='slot'><div class='icon-armour'></div>"+armourSelect+"</div>"+
        "<div class='slot'><div class='icon-accessory'></div>"+accessorySelect+"</div>"+
      "</div>"+
      showProgress(target)+
    "</div>"+
  "</div>";

  return content;
}
// gambit stuff
function selectEl(gambit, i) {
  var defaultVal = gambit[i];
  var name = '';
  if (i == 0) name = 'target';
  if (i == 1) name = 'condition';
  if (i == 2) name = 'action';
  
  var options = "<option value=''>-</option>";
  
  var selected = false;
  
  gambits[name].some((option, o) => {
    if (name == 'condition' || name == 'action') {
      if (gambit[0] != '' && gambits.rules[name][gambit[0]][0] != "all") {
        // check it's in the rules for this kind of target
        if (!(gambits.rules[name][gambit[0]].includes(o))) return false;
      }

      if (name == 'action') {
        // check the hero has unlocked it in their progression
        if (!(clickedTarget.progression.includes(option))) return false;
      }
    }
    
    options += "<option value='"+option+"'";
    
    if (option == defaultVal) {
      options += ' selected';
      selected = true;
    }

    var optionName = option;
    if (name == 'action') {
      optionName = getActionName(option);
    }
    
    options += ">"+optionName+"</option>";
  });
  
  if (!selected) gambit[i] = '';

  return "<select name='"+name+"' onchange='updateGambit(this)' data-draggable='false'>"+options+"</select>";
}
function updateGambit(targetEl) {
  var i = Array.from(targetEl.parentNode.parentNode.children).indexOf(targetEl.parentNode);
  var gambit = clickedTarget.gambits[i];
  var field = targetEl.name;
  
  if (field == "target") gambit[0] = targetEl.value;
  if (field == "condition") gambit[1] = targetEl.value;
  if (field == "action") gambit[2] = targetEl.value;
  
  showAllyDetails();
}
function fitCurrentSelect(selectEl) {
  for (var i=0; i<selectEl.options.length; i++) {
    selectEl.options[i].title = selectEl.options[i].innerHTML;
    if (i != selectEl.options.selectedIndex) selectEl.options[i].innerHTML = '';
  }
}
function cancelSetAction(optAction, optTarget) {
  var gambitsEl = document.getElementById("gambits");

  var action = optAction || false;
  var target = optTarget || false;
  
  //remove 3 (close, confirm), run showTargetSelect (which removes last child)
  if (action && target) {
    gambitsEl.firstChild.removeChild(gambitsEl.firstChild.lastChild);
    gambitsEl.firstChild.removeChild(gambitsEl.firstChild.lastChild);
    gambitsEl.firstChild.firstChild.value = action;
    showTargetSelect();
  }
  //overwrite div with showActionSelect
  else if (action) {
    showActionSelect();
  }
  //overwrite div with showSetAction
  else {
    gambitsEl.firstChild.innerHTML = showSetAction(clickedTarget);
  }
}
function confirmSetAction(action, targetName) {
  var gambitsEl = document.getElementById("gambits");

  var target = '';
  var possibleTargets = entities.all();
  possibleTargets.some( thisTarget => {
    // if this target has the right name, we've found the target
    // else, this is not the target, keep looking
    if (thisTarget.name == targetName) {
      target = thisTarget;
      return true;
    } else return false;
  });

  clickedTarget.acting = true;
  setNextAction(clickedTarget, [target, action]);
  gambitsEl.firstChild.innerHTML = showSetAction(clickedTarget);
}
function pickedTarget(action) {
  var gambitsEl = document.getElementById("gambits");

  var target = gambitsEl.firstChild.children[1].value;
  gambitsEl.firstChild.children[1].disabled = true;
  fitCurrentSelect(gambitsEl.firstChild.children[1]);
  gambitsEl.firstChild.removeChild(gambitsEl.firstChild.lastChild);
  
  gambitsEl.firstChild.innerHTML +=
  "<button class='material-icons' onclick='confirmSetAction(\""+action+"\", \""+target+"\")'>check</button>"+
  "<button class='close material-icons' onclick='cancelSetAction(\""+action+"\", \""+target+"\")'>clear</button>";
  gambitsEl.firstChild.children[0].value = action;
  gambitsEl.firstChild.children[1].value = target;
}
function showTargetSelect() {
  var gambitsEl = document.getElementById("gambits");

  var action = gambitsEl.firstChild.firstChild.value;
  var actionIndex = gambits.action.indexOf(action);
  gambitsEl.firstChild.firstChild.disabled = true;
  fitCurrentSelect(gambitsEl.firstChild.firstChild);
  gambitsEl.firstChild.removeChild(gambitsEl.firstChild.lastChild);
  
  var options = "<option value=''>-</option>";
  var possibleTargets = entities.all();
  var i = possibleTargets.length;
  while (i--) {
    var targetType = '';
    if (possibleTargets[i].type == 'foe') {
      targetType = 'enemy';
    } else {
      if (possibleTargets[i] == clickedTarget) targetType = 'self';
      else targetType = 'ally';
    }
    if (gambits.rules.action[targetType][0] != "all" && !gambits.rules.action[targetType].includes(actionIndex)) {
      possibleTargets.splice(i, 1);
    } else {
      if ((action == "revive1" || action == "revive2") && possibleTargets[i].hp > 0)
      possibleTargets.splice(i, 1);
    }
  }
  possibleTargets.forEach(target => {
    options += "<option value='"+target.name+"'>"+target.name+"</option>";
  });
  
  gambitsEl.firstChild.innerHTML += "<select name='target' onchange='pickedTarget(\""+action+"\")'>"+options+"</select>";
  gambitsEl.firstChild.innerHTML +=
  "<button class='close material-icons' onclick='cancelSetAction(\""+action+"\")'>clear</button>";
  gambitsEl.firstChild.firstChild.value = action;
}
function showActionSelect() {
  var gambitsEl = document.getElementById("gambits");

  var options = "<option value=''>-</option>";
  var possibleActions = [...gambits.action];
  var i = possibleActions.length;
  while (i--) {
    var notAvailable = false;
    
    if (clickedTarget.progression.includes(possibleActions[i])) {
      if (hasStatus(clickedTarget, "fumble") &&
          getActionType(possibleActions[i]).includes("item"))
      notAvailable = true;

      if (!enoughItems(possibleActions[i])) notAvailable = true;
    } else notAvailable = true;

    if (notAvailable) possibleActions.splice(i, 1);
  }
  possibleActions.forEach(action => {
    options += "<option value='"+action+"'>"+getActionName(action)+"</option>";
  });
  gambitsEl.firstChild.innerHTML = "<select name='action' onchange='showTargetSelect()'>"+options+"</select>";
  gambitsEl.firstChild.innerHTML +=
  "<button class='close material-icons' onclick='cancelSetAction()'>clear</button>";
}
function showSetAction(target) {
  var deadDisabled = (target.hp > 0) ? "" : "disabled";
  return content = "<button onclick='showActionSelect()' "+deadDisabled+">set action</button>";
}
function addGambitClickHandling(gambitsEl) {
  var gambitEls = Array.from(gambitsEl.children[1].children);

  gambitEls.forEach(el => {
    el.addEventListener('dragstart', handleDragStart, false);
    el.addEventListener('dragover', handleDragOver, false);
    el.addEventListener('dragleave', handleDragLeave, false);
    el.addEventListener('dragenter', handleDragEnter, false);
    el.addEventListener('drop', handleDrop, false);
    el.addEventListener('dragend', handleDragEnd, false);
  });
}
function showGambits(target) {
  var content = '';

  content +=
  "<div id='gambits'>"+
    "<div class='setAction'>"+showSetAction(target)+"</div>"+
    "<div class='gambits'>";

  target.gambits.forEach((gambit, i) => {
    var state = (gambit[3]) ? "on" : "off";
    var extraClass = (gambit[3]) ? "" : " inactive";
    
    var targetSelect = selectEl(gambit, 0);
    var conditionSelect = selectEl(gambit, 1);
    var actionSelect = selectEl(gambit, 2);

    content +=
    "<div class='gambit"+extraClass+"' draggable='true'>"+
      "<button onclick='toggleGambit(this)'>"+state+"</button>"+
      targetSelect+conditionSelect+actionSelect+
      "<div class='grab material-icons'>drag_indicator</div></div>";
  });

  content += "</div></div>";

  return content;
}
function handleDragStart(e) {
  this.classList.add('over');
  dragSrcEl = this;
}
function handleDragEnd(e) {
  var gambitsEl = document.getElementById("gambits");

  var gambitEls = Array.from(gambitsEl.children[1].children);
  gambitEls.forEach(el => { el.classList.remove('over'); });
}
function handleDragOver(e) {
  if (e.preventDefault) e.preventDefault();
  return false;
}
function handleDragEnter(e) {
  this.classList.add('over');
}
function handleDragLeave(e) {
  if (dragSrcEl !== this) this.classList.remove('over');
}
function handleDrop(e) {
  var gambitsEl = document.getElementById("gambits");

  e.stopPropagation();
  
  if (dragSrcEl !== this) {
    var children = Array.from(gambitsEl.children[1].children);
    var targetElI = children.indexOf(this);
    var dragElI = children.indexOf(dragSrcEl);
    
    // update the els
    if (targetElI < dragElI) gambitsEl.children[1].insertBefore(dragSrcEl, this);
    else gambitsEl.children[1].insertBefore(dragSrcEl, this.nextSibling);
    
    // update the gambits
    var moving = clickedTarget.gambits.splice(dragElI, 1);
    clickedTarget.gambits.splice(targetElI, 0, moving[0]);
    
    showAllyDetails();
  }
  
  return false;
}
function toggleGambit(targetEl) {
  var i = Array.from(targetEl.parentNode.parentNode.children).indexOf(targetEl.parentNode);
  var gambit = clickedTarget.gambits[i];
  gambit[3] = !gambit[3];
  showAllyDetails();
}
// action stuff
function getActionName(action) {
  var name = action;
  if (action in progression) name = ('type' in progression[action]) ? progression[action].name : itemTypes[action].name;
  return name;
}
function updateActions() {
  var allEntities = entities.all();
  
  allEntities.forEach(entity => {
    if (entity.hp > 0) {
      // if i'm idle
      if (entity.acting == false) {
        // try to not be idle
        setNextAction(entity);
      } else {
        // if i'm not idle
        // check if there's a higher priority gambit
        // that i need to cancel my current action for...
        if (entity.nextAction.action == "attack") {
          var results = getAction(entity);
          if (results != false && getActionType(results[1]).includes('healing')) setNextAction(entity, results);
        }
        // and act when it's time to act
        if (passedTime >= entity.nextAction.time) {
          if (entity.nextAction.target != "") {
            var result = doAction(entity);
            // because we already set a new action for everyone who was targeting the dead target
            if (result != "target died") setNextAction(entity);
          }
        }
      }
    }
  });
}
function getActionType(action) {
  var actionDescriptions = [];
  if (action in itemTypes) {
    actionDescriptions.push("item");
    if ("healing" in itemTypes[action]) actionDescriptions.push("healing");
    if ("buff" in itemTypes[action]) actionDescriptions.push("buff");
    if ("debuff" in itemTypes[action]) actionDescriptions.push("debuff");
    if ("mDamage" in itemTypes[action]) actionDescriptions.push("mDamage");
    if ("revive" in itemTypes[action]) actionDescriptions.push("revive");
    if ("removeStatus" in itemTypes[action]) actionDescriptions.push("removeStatus");
  } else {
    actionDescriptions.push("attack");
  }
  return actionDescriptions;
}
function getActionTime(action) {
  var actionType = getActionType(action);
  // attacking = x1 speed
  // normal items = x1 speed
  // healing (not regen) = x0.5 speed
  if (actionType.includes("healing") && !(actionType.includes("buff"))) return 0.5;
  else return 1;
}
function enoughItems(action) {
  if (action in itemTypes) {
    if (resources.data[action] >= 1) return true;
    else return false;
  } else return true; // if i'm not using an item as my action
}
function doAction(me) {
  var action = me.nextAction.action,
      targets = [me.nextAction.target];
  
  if (logging.actions.current) {
    if (me.nextAction.target.name == undefined) {
      console.log(passedTime+": "+me.name+" did nothing");
    } else {
      var actionName = (me.nextAction.action in itemTypes) ? 
                        itemTypes[me.nextAction.action].name : progression[me.nextAction.action].name;
      console.log(passedTime+": "+me.name+" "+
                  actionName+"'d "+me.nextAction.target.name);
    }
  }
  
  /*
  if (me.nextAction.target.name == undefined) {
    addToFeed(me.name+" did nothing");
  } else {
    var actionName = (me.nextAction.action in itemTypes) ? 
                     itemTypes[me.nextAction.action].name : progression[me.nextAction.action].name;
    addToFeed(me.name+" "+actionName+"'d "+me.nextAction.target.name);
  }
  */

  var actionType = getActionType(action);

  if (me.type == "ally") {
    if ((me.equipment.weapon != '' && ("multiTarget" in itemTypes[me.equipment.weapon])) || (actionType.includes("item") && ("multiTarget" in itemTypes[action]))) {
      targets = (targets[0].type == "foe") ? [...entities.foes] : [...entities.allies];
    }
  }

  var results = [];

  switch (true) {
    case (action == 'attack'):
      targets.forEach( target => {
        // multi-target only targets non-KO targets
        if (target.hp > 0) {
          var result = attack(me, target, targets.length);
          results.push(result);
        }
      });
      break;
    case (actionType.includes("item")):
      resources.data[action]--;
      if (logging.actions.items) {
        var targetNames = '';
        targets.forEach((target, i) => {
          targetNames += target.name;
          if (i < (targets.length - 1)) targetNames += ', ';
        });
        console.log(me.name+' used '+itemTypes[action].name+' on '+targetNames);
      }

      targets.forEach( target => {
        // if the target is KO, only reviving items will work (multi-target relevant)
        if (target.hp <= 0) {
          if (actionType.includes("revive")) {
            heal(target, itemTypes[action].healing, me);
            target.acting = true;
          }
        } else {
          if (actionType.includes("buff")) addStatus(me, target, action, "defence");
          if (actionType.includes("debuff")) addStatus(me, target, action, "offence");
          if (actionType.includes("healing")) heal(target, itemTypes[action].healing, me);
          if (actionType.includes("mDamage")) {
            var result = attack(me, target, targets.length, action);
            results.push(result);
          }
          if (actionType.includes("removeStatus")) removeStatuses(target, itemTypes[action].removeStatus);
        }
      });
      break;
  }

  if (results.includes("target died")) return "target died";
}
function getAction(me) {
  var actionable = false,
      target = '',
      action = '';
  
  me.gambits.some( gambit => {
    // if the last gambit i checked was actionable, we're done here
    if (actionable) return true;
    
    // if this gambit is turned off, skip this gambit
    if (gambit[3] === false) return false;
    
    var tempTarget = gambit[0],
        condition = gambit[1];
    
    action = gambit[2];

    // if i have the fumble status and this is an item action, this gambit isn't actionable
    if (hasStatus(me, "fumble") && getActionType(action).includes("item")) return false;
    
    // if i need an item for this gambit and i don't have enough, this gambit isn't actionable
    if (enoughItems(action) == false) return false;
    
    // get the array of the target type for this gambit, ready to iterate through
    if (tempTarget == 'self') tempTarget = [me];
    else if (tempTarget == 'ally') tempTarget = (me.type == 'ally') ? entities.allies : entities.foes;
    else if (tempTarget == 'enemy') tempTarget = (me.type == 'ally') ? entities.foes : entities.allies;
    
    // we use this to confirm we've found a valid target
    // while we continue to check if there is a target with higher/lower x.
    var validTarget = false;
    
    tempTarget.some( entity => {
      // if the last target i checked was actionable, we're done here
      if (actionable) return true;
      
      if (condition == 'status: KO') {
        // if the target is KO'd...
        if (entity.hp == 0) {
          target = entity;
          actionable = true;
        }
      } else {
        // if the target isn't KO'd...
        if (entity.hp > 0) {
          // we'll either target the first entity that meets the condition, or...
          // we'll iterate through all the entities in the set, so we find the entity with the lowest/highest x.
          switch (condition) {
            case 'any':
              target = entity;
              actionable = true;
              break;
            case 'highest hp':
              if (target == '') {
                target = entity;
                validTarget = true;
              } else {
                if (entity.hp > target.hp) target = entity;
              }
              break;
            case 'highest max hp':
              if (target == '') {
                target = entity;
                validTarget = true;
              } else {
                if (entity.maxHp > target.maxHp) target = entity;
              }
              break;
            case 'hp < 25%':
              if (entity.hp < (entity.maxHp / 4)) {
                target = entity;
                actionable = true;
              }
              break;
            case 'hp < 50%':
              if (entity.hp < (entity.maxHp / 2)) {
                target = entity;
                actionable = true;
              }
              break;
            case 'hp < 75%':
              if (entity.hp < ((entity.maxHp / 4) * 3)) {
                target = entity;
                actionable = true;
              }
              break;
            case 'hp < 100%':
              if (entity.hp < entity.maxHp) {
                target = entity;
                actionable = true;
              }
              break;
            case 'lowest hp':
              if (target == '') {
                target = entity;
                validTarget = true;
              } else {
                if (entity.hp < target.hp) target = entity;
              }
              break;
            case 'lowest max hp':
              if (target == '') {
                target = entity;
                validTarget = true;
              } else {
                if (entity.maxHp < target.maxHp) target = entity;
              }
              break;
            case 'mp < 25%':
              if (entity.mp < (entity.maxMp / 4)) {
                target = entity;
                actionable = true;
              }
              break;
            case 'mp < 50%':
              if (entity.mp < (entity.maxMp / 2)) {
                target = entity;
                actionable = true;
              }
              break;
            case 'mp < 75%':
              if (entity.mp < ((entity.maxMp / 4) * 3)) {
                target = entity;
                actionable = true;
              }
              break;
            case 'mp < 100%':
              if (entity.mp < entity.maxMp) {
                target = entity;
                actionable = true;
              }
              break;
            case 'nearest':
              target = entity;
              actionable = true;
              break;
          }
        }
      }
    });
    
    // if we found a valid target, but we wanted to check other targets
    // before confirming which target we'd stick with, now we confirm we can take action.
    if (validTarget) actionable = true;
  });
  
  var result = [target, action];
  
  // if we determined one of the gambits was actionable, we can act on the result...
  // else none of the gambits were actionable.
  if (actionable) {
    me.acting = true;
    return result;
  } else return false;
}
function setNextAction(me, optResults) {
  var results = optResults || getAction(me);
  // if we had an actionable gambit we set the next action...
  // else we can't act.
  if (results != false) {
    me.nextAction.target = results[0];
    me.nextAction.action = results[1];
    me.nextAction.period = me.speed * getActionTime(results[1]) * 1000;

    if (hasStatus(me, "fast")) me.nextAction.period /= 2;
    if (hasStatus(me, "slow")) me.nextAction.period *= 2;

    me.nextAction.time = passedTime + me.nextAction.period;
  } else {
    me.nextAction.target = '';
    me.nextAction.action = '';
    me.nextAction.period = 0;
    me.nextAction.time = 0;
    me.acting = false;
  }
  
  if (logging.actions.next) {
    if (me.acting) {
      console.log(passedTime+": "+me.name+" will "+me.nextAction.action+" "+
                  me.nextAction.target.name+" at "+me.nextAction.time);
    }
  }
}
function hasAffinity(me, affinity) {
  if (typeof me === "boolean") {
    return me;
  }
  else {
    var haveAffinity = false;

    if (me.type == "ally") {
      var accessory = me.equipment.accessory;

      if (accessory != '' && ("affinity" in itemTypes[accessory]) && itemTypes[accessory].affinity.includes(affinity))
      haveAffinity = true;
    } else {
      if (("affinity" in me) && me.affinity.includes(affinity))
      haveAffinity = true;
    }

    return haveAffinity;
  }
}
function attack(attacker, target, totalTargets, optItem) {
  var damageType = (optItem) ? itemTypes[optItem].mDamage[0] : getDamageType(attacker);
  var strength = getStrength(attacker);
  var damage = (optItem) ? itemTypes[optItem].mDamage[1]*40 : strength;
  var hurt = true;

  damage = damage/totalTargets;

  if (logging.actions.hpChange) var damageDesc = '';
  //var damageDesc = '';

  if (damageType != 'none') {
    // if attacker has affinity for the damage type...
    if (hasAffinity(attacker, damageType)) damage = damage * 1.5;
    
    var resists = getResists(target);
    // check resists for damage
    resists.some( element => {
      if (element[0] == damageType) {
        switch (element[1]) {
          case 'weak':
            // do twice as much damage to target
            damage = damage * 2;
            break;
          case 'half':
            // reduce damage to target by 50%
            damage = damage / 2;
            break;
          case 'immune':
            // take no damage
            damage = 0;
            break;
          case 'absorb':
            // heal the target
            hurt = false;
            break;
        }

        if (logging.actions.hpChange) damageDesc = ' ('+element[1]+')';
        //damageDesc = ' ('+element[1]+')';

        return true;
      } else return false;
    });
  }
  // round damage down to whole number
  damage = Math.floor(damage*getDefence(target));

  if (logging.actions.hpChange) {
    var infoString = target.name+' takes '+damage;
    if (damageType != 'none') infoString += ' '+damageType;
    infoString += ' damage';
    if (damageDesc != ' (none)') infoString += damageDesc;
    infoString += ' from '+attacker.name;

    console.log(infoString);
  }
  
  
  /*var infoString = target.name+' takes '+damage;
  if (damageType != 'none') infoString += ' '+damageType;
  infoString += ' damage';
  if (damageDesc != ' (none)') infoString += damageDesc;
  infoString += ' from '+attacker.name;

  addToFeed(infoString);*/

  if (hurt) target.hp -= damage;
  else {
    // if the target isn't KO
    if (target.hp > 0) {
      heal(target, damage);
      return;
    }
  }

  if (target.hp <= 0) {
    die(target);
    return "target died";
  }
}
function heal(target, healAmount, optHealer) {
  var healing = healAmount;
  var affinity = (optHealer) ? hasAffinity(optHealer, "healing") : false;

  if (healing == 'all') target.hp = target.maxHp;
  else {
    if (healing == "10%") healing = Math.ceil(target.maxHp/10);

    // if healer has healing affinity...
    if (affinity) healing = healing * 1.5;

    target.hp = (target.hp+healing > target.maxHp) ? target.maxHp : target.hp+healing;
  }

  if (logging.actions.hpChange) {
    var healingAffinity = (affinity) ? ' (healing affinity)' : '';
    console.log(target.name+' healed '+healing+' hp'+healingAffinity);
  }

  /*
  var healingAffinity = (affinity) ? ' (healing affinity)' : '';
  addToFeed(target.name+' healed '+healing+' hp'+healingAffinity);
  */
}
function die(me) {
  var allEntities = entities.all();
  me.hp = 0;
  if (logging.actions.current) console.log(passedTime+': '+me.name+' died');
  //addToFeed(me.name+' died');

  if (me.type == 'foe') {
    // record my death
    if (!(me.enemyNum in enemyTypes.data.killed)) enemyTypes.data.killed[me.enemyNum] = 0;
    enemyTypes.data.killed[me.enemyNum]++;

    // if i was being targeted,
    // we'll need to set a new target for the entities targeting me
    var needsNewTarget = [];
    allEntities.forEach(entity => {
      if (entity.nextAction.target == me) needsNewTarget.push(entity);
    });
    
    // drop loot
    getLoot(me);
    
    // award bp & xp
    entities.allies.forEach( ally => {
      if (ally.hp > 0) {
        ally.bp += me.lvl;
        ally.totalXp += me.lvl;
        ally.xp += me.lvl;
        convertBP(ally);
        checkLevel(ally);
      }
    });
    
    // delete from parent array
    entities.foes.splice(entities.foes.indexOf(me), 1);
    removeFoeSlot();
    
    // set new target for entities that were targeting me
    needsNewTarget.forEach(entity => { setNextAction(entity); });
  }
  else {
    me.acting = false;
    me.nextAction.target = '';
    me.nextAction.action = '';
    me.nextAction.period = 0;
    me.nextAction.time = 0;

    removeStatuses(me, 'all');
    
    allEntities.forEach(entity => {
      if ((entity.nextAction.target == me) &&
          !(getActionType(entity.nextAction.action).includes('revive'))) {
        setNextAction(entity);
      }
    });
  }
}
function getLoot(target) {
  target.loot.forEach((loot) => {
    var prize = loot[0],
        amount = loot[1],
        chance = loot[2];
    var random = Math.random().toFixed(3);
    if (random <= chance) {
      // add loot to known info
      if (!(target.enemyNum in enemyTypes.data.looted)) {
        enemyTypes.data.looted[target.enemyNum] = [];
      }

      var match = false;
      enemyTypes.data.looted[target.enemyNum].some( lootedLoot => {
        if (loot[0] == lootedLoot[0] && loot[1] == lootedLoot[1]) {
          match = true;
          return true;
        }
      });
      if (match == false) enemyTypes.data.looted[target.enemyNum].push(loot);

      var newLoot = "";
      // get loot
      if (!(prize in resources.data)) {
        resources.data[prize] = 0;
        newLoot = " class='highlight-color'";
        flagIfNewRecipe();
      }
      resources.data[prize] += amount;
      
      if (logging.loot) {
        var name = (prize != 'gold') ? itemTypes[prize].name : 'gold';

        console.log(target.name+' dropped '+name+' x'+amount+
                    ' (chance: '+random+'/'+chance.toFixed(3)+')');
      }

      var name = (prize != 'gold') ? itemTypes[prize].name : 'gold';

      addToFeed("<span class='foe-color'>"+target.name+"</span> dropped <span"+newLoot+">"+name+"</span> x "+amount);

    }
  });
}
// status effects
function hasImmunity(me, status) {
  var haveImmunity = false;

  if (me.type == "ally") {
    var accessory = me.equipment.accessory;

    if (accessory != '' && ("immune" in accessory) && accessory.immune.includes(status))
    haveImmunity = true;
  } else {
    if (("immune" in me) && me.immune.includes(status))
    haveImmunity = true;
  }

  return haveImmunity;
}
function hasStatus(me, status) {
  return me.statusEffects.some(currentStatus => {
    if (currentStatus[0] == status) return true;
  });
}
function updateSpeed(me, status, optReset) {
  var reset = optReset || false;

  var progress = (me.nextAction.time-passedTime)/me.nextAction.period;

  if (status == "fast" || (status == "slow" && reset)) me.nextAction.period /= 2;
  if (status == "slow" || (status == "fast" && reset)) me.nextAction.period *= 2;

  me.nextAction.time = passedTime + Math.ceil((1-progress)*me.nextAction.period);
}
function addStatus(caster, target, item, statusType) {
  var status = itemTypes[item].status;
  // if target is immune to debuff...
  if (statusType == "offence" && hasImmunity(target, status)) {
    if (logging.actions.items)
    console.log(target.name+' is immune to '+status+' status');

    return;
  }

  var statusLength = (statusType == "defence") ? itemTypes[item].buff : itemTypes[item].debuff;

  // if caster has buff/debuff affinity...
  if (hasAffinity(caster, statusType)) statusLength = statusLength * 1.5;

  var info = [status, passedTime+(statusLength*1000)];

  // if regen or poison status...
  if (status == "regenerating") {
    info.push(statusLength - 1);
    info.push(item);
    info.push(hasAffinity(caster, "healing"));
  } else if (status == "poisoned") {
    info.push(statusLength);
    info.push(Math.round(caster.strength/2));
  }

  // opposite statuses
  var oppositeArray = [
    ['poisoned', 'regenerating'],
    ['weak', 'strong'],
    ['vulnerable', 'protected'],
    ['slow', 'fast']
  ];

  var opposite = '';

  oppositeArray.some(opposites => {
    if (opposites.includes(status)) {
      opposite = (opposites[0] == status) ? opposites[1] : opposites[0];
      return true;
    }
  });

  var addNew = true;

  // check for same and opposite statuses
  target.statusEffects.some((currentStatus, i) => {
    // same status...
    if (currentStatus[0] == status) {
      // we'll replace the current one if the new one will outlast it
      // we'll leave the current one if the new one is longer than the new one
      if (currentStatus[1] < info[1]) removeStatus(target, i);
      else addNew = false;

      return true;
    }
    
    // opposite status...
    if (currentStatus[0] == opposite) {
      if (currentStatus[1] < info[1]) {
        // we'll reduce the time of the new status, and replace the current opposite
        info[1] = info[1] - currentStatus[1];

        if (info.length > 2)
        info[2] = info[2] - currentStatus[2];
      } else {
        // if the current opposite would outlast the new status, we'll just remove it
        addNew = false;
      }
      removeStatus(target, i);
      return true;
    }
  });
  
  if (addNew) {
    // add new status
    target.statusEffects.push(info);

    // if the new status changes our speed, adjust our action length accordingly
    if (status == "fast" || status == "slow") updateSpeed(target, status);

    // reset action if it was an item and fumble
    if (status == "fumble" && getActionType(target.nextAction.action).includes("item"))
    setNextAction(target);
  }
}
function poisonDamage(target, damage) {
  if (logging.actions.hpChange)
  console.log(target.name+' takes '+damage+' poison damage');

  target.hp -= damage;

  if (target.hp <= 0) {
    die(target);
    return "target died";
  }
}
function removeStatus(target, i) {
  var status = target.statusEffects[i][0];
      
  if (status == "slow" || status == "fast") updateSpeed(target, status, true);

  target.statusEffects.splice(i, 1);
}
function removeStatuses(target, statusList) {
  var i = target.statusEffects.length;

  while (i--) {
    if (statusList == 'all' || statusList.includes(target.statusEffects[i][0]))
    removeStatus(target, i);
  }
}
function handleHorDOT(target) {
  target.statusEffects.forEach(statusEffect => {
    // if a status effect tick has passed...
    if (statusEffect.length > 2 && passedTime >= (statusEffect[1]-(statusEffect[2]*1000))) {
      switch (statusEffect[0]) {
        case "poisoned":
          poisonDamage(target, statusEffect[3]);
          break;
        case "regenerating":
          heal(target, itemTypes[statusEffect[3]].healing, statusEffect[4]);
          break;
      }

      // count down a tick
      statusEffect[2]--;
    }
  });
}
function expireStatusEffect(target) {
  var i = target.statusEffects.length;

  while (i--) {
    if (target.statusEffects[i][1] <= passedTime) removeStatus(target, i);
  }
}
function handleStatusEffects() {
  var allEntities = entities.all();

  allEntities.forEach(entity => {
    if (entity.statusEffects.length > 0) {
      // apply HOT and DOT
      handleHorDOT(entity);

      // expire status effects
      expireStatusEffect(entity);
    }
  });
}
// skills & xp stuff
function convertBP(target) {
  while (target.bp >= target.lvl) {
    target.bp -= target.lvl;
    target.totalLp++;
    target.lp++;
  }
}
function xpToNextLvl(level) {
  var min = -200,
      max = 10000,
      x0 = 50.5,
      k = 0.10,
      a = 0.80;

  return Math.round(min + (max - min) * ( 1 / (1 + Math.exp(-k * (level+1-x0))) ** a));
}
function checkLevel(target) {
  if (target.lvl < 100) {
    while (target.xp >= xpToNextLvl(target.lvl)) {
      target.xp -= xpToNextLvl(target.lvl);
      target.lvl++;
      target.levelUp();

      if (target.lvl == 3 && document.getElementById("allies").childElementCount == 1) addAllySlot(50);
      if (target.lvl == 12 && document.getElementById("allies").childElementCount == 2) addAllySlot(200);

      checkAreaLevels(target.lvl);
    }
  }
}
function unlockSkill(skill, cost) {
  clickedTarget.lp -= cost;
  clickedTarget.progression.push(skill);
  if (skill.search('gambitSlot') != -1) clickedTarget.addGambitSlot();
  showAllyDetails();
}
function isSkillsFilter(filterName) {
  return Object.keys(progression).some( unlockable => {
    switch (filterName) {
      case "all":
        return true;
      case "item":
        if (unlockable in itemTypes) {
          if (!(itemTypes[unlockable].type == "item")) return false;
        } else return false;
        break;
      case "weapon":
        if (unlockable in itemTypes) {
          if (!(itemTypes[unlockable].subType == "weapon")) return false;
        } else return false;
        break;
      case "armour":
        if (unlockable in itemTypes) {
          if (!(itemTypes[unlockable].subType == "armour")) return false;
        } else return false;
        break;
      case "accessory":
        if (unlockable in itemTypes) {
          if (!(itemTypes[unlockable].subType == "accessory")) return false;
        } else return false;
        break;
      case "gambit":
        if (!(progression[unlockable].type == "gambit")) return false;
        break;
      case "ability":
        if (!(progression[unlockable].type == "skill")) return false;
        break;
    }

    if (target.progression.includes(unlockable)) return true;
    else {
      var prereqAllOf = ('prereqAllOf' in progression[unlockable]) ? false : true;
      var prereqOneOf = ('prereqOneOf' in progression[unlockable]) ? false : true;
      var prereqOneOf2 = ('prereqOneOf2' in progression[unlockable]) ? false : true;

      if (!prereqAllOf)
      prereqAllOf = progression[unlockable].prereqAllOf.every( prereq => {
        return target.progression.includes(prereq);
      });

      if (!prereqOneOf)
      prereqOneOf = progression[unlockable].prereqOneOf.some( prereq => {
        return target.progression.includes(prereq);
      });

      if (!prereqOneOf2)
      prereqOneOf2 = progression[unlockable].prereqOneOf2.some( prereq => {
        return target.progression.includes(prereq);
      });

      if (prereqAllOf && prereqOneOf && prereqOneOf2) {
        return true;
      }
    }
  });
}
function showSkills(target) {
  var content = '';

  content +=
  "<div id='skills'>"+
    "<div class='item title'>"+
      "<div>skill</div>"+
      "<div>LP: "+target.lp+"</div>"+
      "<div>lp cost</div>"+
      "<div>unlock</div>"+
    "</div>"+
    "<div class='itemList'>";
  
  Object.keys(progression).forEach(unlockable => {
    var name = getActionName(unlockable);

    /*
    switch (filter) {
      case "all":
        break;
      case "item":
        if (unlockable in itemTypes) {
          if (!(itemTypes[unlockable].type == "item")) return false;
        } else return false;
        break;
      case "weapon":
        if (unlockable in itemTypes) {
          if (!(itemTypes[unlockable].subType == "weapon")) return false;
        } else return false;
        break;
      case "armour":
        if (unlockable in itemTypes) {
          if (!(itemTypes[unlockable].subType == "armour")) return false;
        } else return false;
        break;
      case "accessory":
        if (unlockable in itemTypes) {
          if (!(itemTypes[unlockable].subType == "accessory")) return false;
        } else return false;
        break;
      case "gambit":
        if (!(progression[unlockable].type == "gambit")) return false;
        break;
      case "ability":
        if (!(progression[unlockable].type == "skill")) return false;
        break;
    }
    */

    if (target.progression.includes(unlockable)) {
      content +=
      "<div class='item desc' onclick='showDescription(event, this, \"skills\")'>"+
        "<div>"+name+"</div>"+
      "</div>";
    } else {
      var prereqAllOf = ('prereqAllOf' in progression[unlockable]) ? false : true;
      var prereqOneOf = ('prereqOneOf' in progression[unlockable]) ? false : true;
      var prereqOneOf2 = ('prereqOneOf2' in progression[unlockable]) ? false : true;

      if (!prereqAllOf)
      prereqAllOf = progression[unlockable].prereqAllOf.every( prereq => {
        return target.progression.includes(prereq);
      });

      if (!prereqOneOf)
      prereqOneOf = progression[unlockable].prereqOneOf.some( prereq => {
        return target.progression.includes(prereq);
      });

      if (!prereqOneOf2)
      prereqOneOf2 = progression[unlockable].prereqOneOf2.some( prereq => {
        return target.progression.includes(prereq);
      });

      if (prereqAllOf && prereqOneOf && prereqOneOf2) {
        var cost = progression[unlockable].cost * 30;
        var disabled = (cost > target.lp) ? 'disabled' : '';

        content +=
        "<div class='item desc' onclick='showDescription(event, this, \"skills\")'>"+
          "<div>"+name+"</div>"+
          "<div>"+cost+"</div>"+
          "<div><button onclick='unlockSkill(\""+unlockable+"\", "+cost+") '"+
            disabled+">unlock</button></div>"+
        "</div>";
      }
    }
  });

  content += "</div></div>";

  return content;
}
// feed stuff
function removeSelf(el) {
  el.classList.add('remove');
  setTimeout(function() {el.remove();}, 750);
}
function addToFeed(info) {
  var newInfo = document.createElement("div");
  newInfo.innerHTML = info;
  feed.appendChild(newInfo);
  setTimeout(function() {removeSelf(newInfo);}, 2000);
  //feed.scrollTop = feed.scrollHeight;
}
// game stuff
function displayStatuses(me) {
  var statuses = '';

  me.statusEffects.forEach(status => {
    statuses += "<div name='"+status[0]+"' class='icon-"+status[0]+"'></div>";
  });

  return statuses;
}
function displayActions(me) {
  var actionProgress = (me.nextAction.time == 0) ? 0 :
    100-(((me.nextAction.time-passedTime)/me.nextAction.period)*100);

  var actionName = getActionName(me.nextAction.action);
  var action = (me.nextAction.target == '') ? 'none' : actionName+' '+me.nextAction.target.name;
  action = action.replaceAll(' ', '&nbsp;');

  if (action == 'none') {
    me.acting = false;
  }
  
  if (me.acting == false) {
    actionProgress = 0;
    if (me.hp == 0) action = "KO";
    else action = "idle";
  }
  
  return {action: action, actionProgress: actionProgress};
}
function showInfo() {
  var content= '';

  content +=
  "<div>Gold: "+resources.data.gold+"</div>"+
  "<div>"+capitalizeFirstLetter(itemTypes.heal1.name)+"s: "+resources.data.heal1+"</div>"+
  "<div>"+capitalizeFirstLetter(itemTypes.revive1.name)+"s: "+resources.data.revive1+"</div>";

  return content;
}
function showGame() {
  infoEl.innerHTML = showInfo();
  
  entities.allies.forEach((ally, i) => {
    var display = displayActions(ally);
    
    allyEls[i].innerHTML =
    "<div class='info'>"+
      "<span class='name'>"+ally.name+"</span><br>"+
      //"MP: "+ally.mp+"/"+ally.maxMp+"<br>"+
      "Level: "+ally.lvl+
      "<div class='statuses'>"+displayStatuses(ally)+"</div>"+
    "</div>"+
    "<div class='hpBar' style='width:"+(ally.hp/ally.maxHp)*100+"%'>"+
      "<div class='barLabel'>HP:&nbsp;"+ally.hp+"/"+ally.maxHp+"</div>"+
    "</div>"+
    "<div class='actionBar' style='width:"+display.actionProgress+"%'>"+
      "<div class='barLabel'>"+display.action+"</div>"+
    "</div>";
  });
  
  entities.foes.forEach((foe, i) => {
    var display = displayActions(foe);
    
    foeEls[i].innerHTML =
    "<div class='info'>"+
      "<span class='name'>"+foe.name+"</span><br>"+
      "Level: "+foe.lvl+
      "<div class='statuses'>"+displayStatuses(foe)+"</div>"+
    "</div>"+
    "<div class='hpBar' style='width:"+(foe.hp/foe.maxHp)*100+"%'>"+
      "<div class='barLabel'>HP:&nbsp;"+foe.hp+"/"+foe.maxHp+"</div>"+
    "</div>"+
    "<div class='actionBar' style='width:"+display.actionProgress+"%'>"+
      "<div class='barLabel'>"+display.action+"</div>"+
    "</div>";
  });
}
function runGame(dt) {
  if (!paused) {
    passedTime += dt;
    handleStatusEffects();
    checkForLurkers();
    checkIfLurkersEngage();
    updateActions();
  }

  // testing code
  handleTestingEl();

  showGame();
}

// testing stuff
function handleTestingEl() {
  if (clickedTarget != '' && subMenu == "equipment") showTestingEl();
  else {
    var testingEl = document.getElementById('testing');
    if (testingEl != null) testingEl.remove();
  }
}
function showTestingEl() {
  var testingEl = document.getElementById('testing');
  if (testingEl == null) {
    testingEl = document.createElement("div");
    testingEl.setAttribute("id", "testing");
    testingEl.style.marginTop = "4px";
    testingEl.style.textAlign = "right";
    testingEl.style.color = "var(--border-color)";
    testingEl.style.fontFamily = "Arial";
    testingEl.style.fontSize = "16px";

    var reviveBtn = (clickedTarget.hp <= 0) ?
    "<button onclick='reviveTarget(clickedTarget)'>revive</button>" :
    "";

    testingEl.innerHTML =
    "test:"+
    reviveBtn+
    "<button onclick='toggleFullscreen()'>fullscreen</button>"+
    "<button onclick='unlockAllProgress(clickedTarget)'>progress</button>"+
    "<button onclick='giveAllItems()'>items</button>";

    descriptionEl.parentNode.insertBefore(testingEl, descriptionEl.nextSibling);
  }
}
function toggleFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen();
  else document.documentElement.requestFullscreen();
}
function unlockAllProgress(target) {
  Object.keys(progression).forEach(unlockable => {
    if (!(target.progression.includes(unlockable))) target.progression.push(unlockable);
  });
}
function giveItem(name, num) {
  if (!(name in resources.data)) resources.data[name] = 0;
  resources.data[name] += num;
}
function giveAllItems(optNum) {
  var num = optNum || 2;

  Object.keys(itemTypes).forEach(item => {
    giveItem(item, num);
  });
}
function reviveTarget(target) {
  heal(target, "all");
  target.acting = true;
}

// set up game
retrieve();
entities.foes.push(generateEnemy());

for (let el of allyEls) { el.onclick = function() { clickedAlly(this); }; }

// run game
var updateGame = setInterval( function() { runGame(getDt()); }, updateInterval);