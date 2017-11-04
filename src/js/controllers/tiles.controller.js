import Tile from '../models/tiles.model';
import TileGenerator from '../components/TileGenerator';
import Config from '../commun/Config';
import schedule from 'node-schedule';
import Assets from '../../../assets/datas/assets.json';

export default class TilesController {
    constructor() {
        this.tileGenerator = new TileGenerator();
    }

    async initMap(client, data) {
        const ox = data.x;
        const oy = data.y;

        const minx = parseInt(ox, 10) - Config.chunkSize.x;
        const miny = parseInt(oy, 10) - Config.chunkSize.y;
        const maxx = parseInt(ox, 10) + Config.chunkSize.x;
        const maxy = parseInt(oy, 10) + Config.chunkSize.y;
        const result = [];

        for (let x = minx; x < maxx; x++) {
            for (let y = miny; y < maxy; y++) {
                const tile = await Tile.getTile(x, y);
                if (!tile) {
                    const tileToAdd = Tile(this.tileGenerator.createTile(x, y));
                    const savedTile = await Tile.addTile(tileToAdd);
                    result.push(savedTile);
                } else {
                    result.push(tile);
                }
            }
        }
        client.emit('initMap', result);
    }

    async getChunk(client, data) {
        const ox = data.x;
        const oy = data.y;

        const minx = parseInt(ox, 10) * Config.chunkSize.x;
        const miny = parseInt(oy, 10) * Config.chunkSize.y;
        const maxx = minx + Config.chunkSize.x;
        const maxy = miny + Config.chunkSize.y;
        const tiles = [];

        for (let x = minx; x < maxx; x++) {
            for (let y = miny; y < maxy; y++) {
                const tile = await Tile.getTile(x, y);
                if (!tile) {
                    const tileToAdd = Tile(this.tileGenerator.createTile(x, y));
                    const savedTile = await Tile.addTile(tileToAdd);
                    tiles.push(savedTile);
                } else {
                    tiles.push(tile);
                }
            }
        }

        client.emit('setChunk', {
            chunk: {
                x: ox,
                y: ox
            },
            tiles: tiles
        });
    }

    async setTile(client, data, isCron = false) {
        let needCron = false;
        let waitingTime = 0;
        if (data.content && data.content.length > 0 && !isCron) {
            const ids = Object.keys(Assets.object);
            const object = Assets.object[ids[data.content[0].id]];
            if (object.waitingTime !== undefined && object.waitingTime > 0) {
                needCron = true;
                waitingTime = object.waitingTime * Config.buildingTime;
            }
        }
        const o = {
            x: data.x,
            y: data.y,
            type: data.type,
            z: data.z,
            content: (needCron ? [{id: 3}] : data.content)
        };


        if (needCron) {
            const now = new Date();
            let date = new Date(now.getTime() + waitingTime * 1000);
            o.content[0].start = now.getTime();
            o.content[0].end = date.getTime();
            const j = schedule.scheduleJob(date, () => {
                this.setTile(client, data, true);
            });
        }

        try {
            const updatedTile = await Tile.updateTile(data.x, data.y, o);
            client.emit('updateTile', o);
            client.broadcast.emit('updateTile', o);
        } catch (err) {
            console.log('emit updateTile', err);
        }
    }
}
