import React from "react";
import {observer} from "mobx-react-lite";
import {Button, Modal} from 'react-bootstrap';
import {useParams} from 'react-router-dom';
import axios from "axios";

import '../styles/canvas.scss';

import canvasState from '../store/canvasState';
import toolState from "../store/toolState";
import Brush from "../tools/Brush";
import Rect from "../tools/Rect";

const Canvas = observer(() => {
    const [show, setShow] = React.useState(true);
    const canvasRef = React.useRef();
    const inputRef = React.useRef();
    const params = useParams();

    React.useEffect(() => {
        canvasState.setCanvas(canvasRef.current);
        let ctx = canvasRef.current.getContext('2d')
        axios.get('http://localhost:5000/img?id=' + params.id)
            .then(response => {
                const img = new Image();
                img.src = response.data;
                img.onload = () => {
                    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                    ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
                }
            })
    }, []);

    React.useEffect(() => {
        if (canvasState.username) {
            const socket = new WebSocket('ws://localhost:5000/');
            canvasState.setSocket(socket)
            canvasState.setSessionId(params.id);
            toolState.setTool(new Brush(canvasRef.current, socket, params.id));
            socket.onopen = () => {
                socket.send(JSON.stringify({
                    id: params.id,
                    username: canvasState.username,
                    method: 'connection',
                }))
            }
            socket.onmessage = (event) => {
                let msg = JSON.parse(event.data);
                switch (msg.method) {
                    case 'connection': {
                        console.log(`пользователь присоединился! ${msg.username}`);
                        break;
                    }
                    case 'draw': {
                        drawHandler(msg);
                        break;
                    }
                }
            }
        }
    }, [canvasState.username]);

    const drawHandler = (message) => {
        const figure = message.figure;
        const ctx = canvasRef.current.getContext('2d');
        switch (figure.type) {
            case "brush": {
                Brush.draw(ctx, figure.x, figure.y)
                break;
            }
            case "rect": {
                Rect.StaticDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.color)
                break;
            }
            case "finish": {
                ctx.beginPath();
                break;
            }
        }
    }

    const handlerMouseDown = () => {
        canvasState.pushToUndo(canvasRef.current.toDataURL());
        axios.post('http://localhost:5000/img?id=' + params.id, {img: canvasRef.current.toDataURL()})
            .then(res => {
                console.log(res);
            })
    };

    const handlerConnection = (e) => {
        canvasState.setUserName(inputRef.current.value);
        setShow(false)
    };


    return (
        <div className='canvas'>
            <Modal show={show} onHide={() => {
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>Введите имя</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input type="text" ref={inputRef}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handlerConnection}>
                        Ok
                    </Button>
                </Modal.Footer>
            </Modal>
            <canvas onMouseDown={handlerMouseDown} width={600} height={400} ref={canvasRef}/>

        </div>
    )
});


export default Canvas;