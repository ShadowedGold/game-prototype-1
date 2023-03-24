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