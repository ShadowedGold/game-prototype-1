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
    name: 'item affinity charm',
    sell: 20,
    type: 'equipment',
    subType: 'accessory',
    affinity: ['air', 'earth', 'fire', 'water', 'healing', 'offence', 'defence'],
    description: "Status affects the wearer inflicts last longer, wearer's healing is more effective and they deal more elemental damage."
  }
};