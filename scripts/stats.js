var baseStats = {
    maxHp: 80,
    strength: 20,
    statIPL: {strength: 3,
        hp: 10},
    speed: 1.5,
};
var charStats = {
    name: 'name',
    hp: baseStats.maxHp,
    lvl: 1,
    totalXp: 0,
    xp: 0,
    bp: 0,
    totalLp: 0,
    lp: 0,
    maxHp: (1-1)*baseStats.statIPL.hp+baseStats.maxHp,
    strength: (1-1)*baseStats.statIPL.strength+baseStats.strength,
    speed: baseStats.speed,
    type: 'ally',
    acting: true,
    save: function () {
        return {
            name: this.name,
            hp: this.hp,
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
        this.lvl = me.lvl;
        this.totalXp = me.totalXp;
        this.xp = me.xp;
        this.bp = me.bp;
        this.lp = me.lp;
        this.maxHp = (me.lvl-1)*baseStats.statIPL.hp+baseStats.maxHp;
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
