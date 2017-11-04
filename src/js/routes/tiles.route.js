import TilesController from './../controllers/tiles.controller';

export default class TilesRoute {
    constructor () {
        this.ctrl = new TilesController();
    }

    listen(client) {
        client.on('initMap',    (data) => { this.ctrl.initMap(client, data) });
        client.on('getChunk',   (data) => { this.ctrl.getChunk(client, data)} );
        client.on('setTile',    (data) => { this.ctrl.setTile(client, data)} );
    }
}