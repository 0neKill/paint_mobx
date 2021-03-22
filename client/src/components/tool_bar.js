import React from "react";

import '../styles/tool_bar.scss';

import toolState from "../store/toolState";
import canvasState from "../store/canvasState";
import Brush from "../tools/Brush";
import Rect from "../tools/Rect";
import Circle from "../tools/Circle";
import Line from "../tools/Line";
import Eraser from "../tools/Eraser";

export default function ToolBar() {
    const handlerChangeColor = e => {
        toolState.setStrokeColor(e.target.value);
        toolState.setFillColor(e.target.value);
    }
    const download = () => {
        const dataUrl = canvasState.canvas.toDataURL();
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = canvasState.sessionId + '.jpg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
    return (
        <div className='tool-bar'>
            <button className='tool-bar__btn brush'
                    onClick={() => toolState.setTool(new Brush(canvasState.canvas, canvasState.socket, canvasState.sessionId))}/>
            <button className='tool-bar__btn rect'
                    onClick={() => toolState.setTool(new Rect(canvasState.canvas, canvasState.socket, canvasState.sessionId))}/>
            <button className='tool-bar__btn circle' onClick={() => toolState.setTool(new Circle(canvasState.canvas))}/>
            <button className='tool-bar__btn eraser' onClick={() => toolState.setTool(new Eraser(canvasState.canvas))}/>
            <button className='tool-bar__btn line' onClick={() => toolState.setTool(new Line(canvasState.canvas))}/>
            <input type="color" style={{marginLeft: 10}} onChange={handlerChangeColor}/>
            <button className='tool-bar__btn undo' onClick={() => canvasState.undo()}/>
            <button className='tool-bar__btn redo' onClick={() => canvasState.redo()}/>
            <button className='tool-bar__btn save' onClick={download}/>
        </div>
    )
}