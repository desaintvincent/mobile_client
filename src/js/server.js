import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import http from 'http';
import socketio from 'socket.io';
import TilesRoute from './routes/tiles.route';
import logger from './core/logger/app-logger';
import config from './core/config/config.dev';
import connectToDb from './core/database/connect';
import assets from '../../assets/datas/assets.json';

const port = config.serverPort;
logger.stream = {
    write: function(message) {
        logger.info(message);
    }
};

connectToDb();

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(morgan('dev', { 'stream': logger.stream }));

app.get('/assetList', (req, res) => {
    res.send(assets);
});

app.get('/assets/*', (req, res) => {
    const options = {
        root: __dirname + '/../..',
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };
    res.sendFile(req.originalUrl, options, (err) => {
        if (err) {
            res.send(404);
        }
    });
});

const tilesRoute = new TilesRoute();

io.on('connection', (client) => {
    logger.info('Client connected - ', client.id);
    client.emit('connect', client);
    tilesRoute.listen(client);
});

server.listen(port, () => {
    logger.info('server started - ', port);
});
