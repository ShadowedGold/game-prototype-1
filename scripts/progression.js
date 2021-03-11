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
