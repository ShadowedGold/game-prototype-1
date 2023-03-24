var gambits = {
    target: ['self', 'ally', 'enemy'],
    condition: ['any','highest hp','highest max hp','hp < 25%','hp < 50%','hp < 75%','hp < 100%','lowest hp','lowest max hp','nearest','status: KO'],
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
            self: [3,4,5,6],
            ally: ['all'],
            enemy: [0,1,2,3,4,5,6,7,8,9]
        },
        action: {
            self: [0,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50],
            ally: [0,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50],
            enemy: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50]
        }
    }
};