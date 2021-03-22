const express = require('express');
const app = express();
const WsServer = require('express-ws')(app);
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const aWss = WsServer.getWss();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.ws('/', (user_socket, req) => {
    user_socket.on('message', (data) => {
        const message = JSON.parse(data);
        switch (message.method) {
            case 'connection': {
                handlerConnection(user_socket, message);
                break;
            }
            case 'draw': {
                handlerBroadcastConnection(user_socket, message);
                break;
            }
        }
    })
});

app.post('/img', (req, res) => {
    const data = req.body.img.replace('data:image/png;base64,', '');
    fs.writeFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`), data, 'base64');
    return res.status(200).json({message: 'Ok'});
});

app.get('/img', (req, res) => {
    const file = fs.readFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`));
    const data = `data:image/png;base64,` + file.toString('base64');
    return res.status(200).json(data);
});

app.listen(PORT, () => {
    console.log(`server is running...`)
});


const handlerConnection = (user_socket, message) => {
    user_socket.id = message.id;
    handlerBroadcastConnection(user_socket, message);
}

const handlerBroadcastConnection = (user_socket, data) => {
    aWss.clients.forEach(client => {
        if (client.id === data.id) {
            client.send(JSON.stringify(data));
        }
    });
}