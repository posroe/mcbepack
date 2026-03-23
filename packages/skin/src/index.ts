#!/usr/bin/env node

import path from 'path';
import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { watch } from 'chokidar';
import { getSkinPath, getSkinBase64 } from './utils';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const publicPath = path.resolve(import.meta.dirname, '..', 'public');

const skinPath = await getSkinPath();

app.use(express.static(publicPath));

watch(skinPath).on('change', async () => {
    const skinBase64 = await getSkinBase64(skinPath);
    const data = JSON.stringify({ skinBase64, skinName: path.basename(skinPath) });
    wss.clients.forEach(c => c.send(data));
});

wss.on('connection', async (ws) => {
    const skinBase64 = await getSkinBase64(skinPath);
    const data = JSON.stringify({ skinBase64, skinName: path.basename(skinPath) });
    ws.send(data);
});

server.listen(8080, () => {
    console.log('Skin preview server is running at http://localhost:8080');
});