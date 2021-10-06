import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {Component, Fragment} from "react";
import Block from "./Block";
import OutsideClick from "./OutsideClick";
import { DragDropContext } from 'react-beautiful-dnd';
import { useDrag } from 'react-dnd'


class Item extends Component {
    static addITEM
    static statusAddITEM
    static editITEM
    static statusEditITEM
    static reRenderItems
    static statusReRenderItems

    static setBaseItem = (block) => {
        return !block.item && Object.assign(block, {item: []})
    }

    static addItem = (block, data) => {
        Item.setBaseItem(block)
        block.item.push(data)
        Item.endInput()
        return block
    }

    static editItem = (block, item, i, data) => {
        for (let key in block.item[i]) {
            if (block.item[i].hasOwnProperty(key)) {
                block.item[i][key] = data || ""
            }
        }

        Item.endInput()
        return item
    }

    static remove = (block, item, i) => {
        block.item.splice(i, 1)
        return block
    }

    static endInput = () => {
        Item.statusEditITEM()
        Item.statusAddITEM()
        Block.statusButtonsDisabled(false)

    }

    static onDragEnd = () => {
        console.log("DragEnd")
    }

    static editOptions = (block, item, i) => {
        return <div>
            <button type="edit" className="btn btn-right" disabled={Block.buttonsDisabled}
                    onClick={(e) => {
                        e.target.id = "EditThisItem";
                        OutsideClick.statusInput({ id: "EditButtonOptions", function: () => document.getElementById("EditThisItem")?.removeAttribute("id")})
                    }}>...</button>
            <ul id="EditButtonOptions" className="dropDown">
                <li>
                    <button onClick={() => { Item.statusEditITEM({block: block, item: item, index: i})}}>bearbeiten</button>
                </li>
                <li>
                    <button onClick={() => {  Block.statusActive(); Item.remove(Block.active, item, i); Block.statusActive(Block.active)}}>löschen</button>
                </li>
            </ul>
        </div>
    }

    static renderInput = (block, item, i) => {
        Block.statusButtonsDisabled(true)
        console.log("RENDER", Item.editITEM)

        let input
        let itemValue
        if (block.item) {
            for (let key in block.item[i]) {
                if (block.item[i].hasOwnProperty(key)) {
                    itemValue = block.item[i][key];
                }
            }
        }

        Item.statusAddITEM(
            <form id="Active-form" className={Item.editITEM ? "editItem" : "addItem"}>
                <CKEditor editor={ClassicEditor} data={itemValue} onChange={(e, editor) => input = editor.getData()}/>
                <button className="btn btn-default btn-green" onClick={(e) => {
                    e.preventDefault();
                    item ? Item.editItem(block, item, i, input || itemValue) :
                        input && input.length > 0 && Item.addItem(block, {text: input});
                }}><i className="fa fa-check" aria-hidden="true"/></button>
                <button className="btn btn-default btn-red" onClick={() =>  Item.endInput() }><i className="fa fa-close" aria-hidden="true"/></button>
            </form>
        )
    }

    static renderItems = (block) => {return <div id="Items-Main" className="items">
        <div className="button-add-container">
            {Block.isAdmin && !Item.addITEM && (
                <button disabled={Item.addITEM} className={`btn button-addItem ${Item.addITEM ? "d-none" : ""}`} onClick={() => {
                    Item.renderInput(block);
                }}><i className="fa fa-plus" aria-hidden="true"/></button>
            )}
        </div>
        {!Item.editITEM && Item.addITEM && (
            <div id="AddItem" className="white-card add-card">{Item.editITEM?.index}{Item.addITEM}</div>
        )}
        <div className="items">
            {block?.item?.map((item, i) => {
                    return (Item.editITEM && Item.editITEM.index === i) ? (
                        <div key={i} id="EditItem" className="white-card add-card">{Item.addITEM}</div>
                    ) : (
                        <div key={i} className="item white-card">
                            <div dangerouslySetInnerHTML={{__html: item.text}}/>
                            <div id="ButtonEdit">
                                {Item.editOptions(block, item, i)}
                            </div>
                        </div>
                    )
                }
            )}
        </div>
    </div>}
}
export default Item