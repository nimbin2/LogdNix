import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {Component} from "react";
import Block from "./Block";
import OutsideClick from "./OutsideClick";

class Item extends Component {
    static addITEM
    static statusAddITEM
    static editITEM
    static statusEditITEM

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

    static editOptions = (item, i) => {
        return <div>
            <button type="edit" className="btn btn-default" disabled={Block.buttonsDisabled}
                    onClick={(e) => {
                        e.target.id = "EditThisItem";
                        OutsideClick.statusInput({ id: "EditButtonOptions", function: () => document.getElementById("EditThisItem")?.removeAttribute("id")})
                    }}>...</button>
            <ul id="EditButtonOptions" className="dropDown">
                <li>
                    <button onClick={() => { Item.statusEditITEM({item: item, index: i})}}>bearbeiten</button>
                </li>
                <li>
                    <button onClick={() => Item.remove(Block.active, item, i)}>löschen</button>
                </li>
            </ul>
        </div>
    }

    static renderInput = (item, i) => {
        Block.statusButtonsDisabled(true)
        console.log("RENDER", Item.editITEM)

        let input
        let itemValue
        if (Block.active.item) {
            for (let key in Block.active.item[i]) {
                if (Block.active.item[i].hasOwnProperty(key)) {
                    itemValue = Block.active.item[i][key];
                }
            }
        }

        Item.statusAddITEM(
            <form className={Item.editITEM ? "editItem" : "addItem"}>
                <CKEditor editor={ClassicEditor} data={itemValue} onChange={(e, editor) => input = editor.getData()}/>
                <button className="btn btn-default" onClick={(e) => {
                    e.preventDefault();
                    item ? Item.editItem(Block.active, item, i, input || itemValue) :
                        input && input.length > 0 && Item.addItem(Block.active, {text: input});
                }}>Save
                </button>
                <button className="btn btn-default" onClick={() =>  Item.endInput() }>Cancel</button>
            </form>
        )
    }

    static renderItems = (block) => {console.log("wusa"); return <div id="Items-Main" className="items">
        {block?.item?.map((item, i) => {
            return (Item.editITEM && Item.editITEM.index === i) ? (
                <div key={i} id="EditItem" className="white-card">{Item.addITEM}</div>
            ) : (
                <div key={i} className="item white-card">
                    <div dangerouslySetInnerHTML={{__html: item.text}}/>
                    <div id="ButtonEdit">
                        {Item.editOptions(item, i)}
                    </div>
                </div>
            )
        })}
        {!Item.editITEM && Item.addITEM && (
            <div id="AddItem" className="white-card">{Item.editITEM?.index}{Item.addITEM}</div>
        )}
        {Block.isAdmin && (
            <button disabled={Item.addITEM} className={`btn btn-default ${Item.addITEM ? "d-none" : ""}`} onClick={() => {
                Item.renderInput();
            }}>Add Text</button>
        )}
    </div>}
}
export default Item