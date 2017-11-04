/* global Image ctx canvas window document */
const SimplexNoise = require('simplex-noise');
const Alea = require('alea');
const Config = require('../commun/Config');



module.exports = class TileGenerator {
    constructor() {
        this.SimplexNoiseTile = new SimplexNoise(new Alea(Config.mapGenerator.seedTile));
        this.SimplexNoiseHeight = new SimplexNoise(new Alea(Config.mapGenerator.seedHeight));
        this.SimplexNoiseTree = new SimplexNoise(new Alea(Config.mapGenerator.seedTree));
    }

    createTile(x, y) {
        const nx = x / Config.chunkSize.x;
        const ny = y / Config.chunkSize.y;
        const tileAsset = Math.floor(this.noiseTile(nx, ny) * Config.mapGenerator.nbTiles);
        const tileHeight = Math.floor(this.noiseHeight(nx, ny) * (Config.maxHeight * 2 / 3) + 1);
        const content = [];
        if (tileHeight > 2) {
            const treenoise = this.noiseTree(nx, ny);
            if (treenoise > 0.7) {
                content.push({id: 0});
            } else if (treenoise < 0.1) {
                content.push({id: 1});
            }
        }

        return {
            x: x,
            y: y,
            z: tileHeight,
            type: tileHeight <= 2 ? 13 : tileAsset,
            content: content
        };
    }



    noiseTile(nx, ny, f = 3) {
        let e = 0;
        let diviser = 0;
        for (let i = 1; i <= f; i++) {
            e += (this.SimplexNoiseTile.noise2D(Math.pow(2, i - 1) * nx, Math.pow(2, i - 1) * ny) / 2 + 0.5) / Math.pow(2, i - 1);
            diviser += 1 / Math.pow(2, i - 1);
        }
        return Math.pow(e / diviser, 1);
    }

    noiseHeight(nx, ny, f = 3) {
        let e = 0;
        let diviser = 0;
        for (let i = 1; i <= f; i++) {
            e += (this.SimplexNoiseHeight.noise2D(Math.pow(2, i - 1) * nx, Math.pow(2, i - 1) * ny) / 2 + 0.5) / Math.pow(2, i - 1);
            diviser += 1 / Math.pow(2, i - 1);
        }
        return Math.pow(e / diviser, 1);
    }

    noiseTree(nx, ny, f = 3) {
        let e = 0;
        let diviser = 0;
        for (let i = 1; i <= f; i++) {
            e += (this.SimplexNoiseTree.noise2D(Math.pow(2, i - 1) * nx, Math.pow(2, i - 1) * ny) / 2 + 0.5) / Math.pow(2, i - 1);
            diviser += 1 / Math.pow(2, i - 1);
        }
        return Math.pow(e / diviser, 1);
    }
};
