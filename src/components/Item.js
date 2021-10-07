import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {Component, Fragment} from "react";
import Block from "./Block";
import OutsideClick from "./OutsideClick";
import moment from 'moment';


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
        Object.assign(item, {text: data.text, editDate: data.editDate})

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

    static editOptions = (block, item, i) => {
        return <div>
            <button type="edit" className="btn btn-right" disabled={Block.buttonsDisabled}
                    onClick={(e) => {
                        e.target.id = "EditThisItem";
                        OutsideClick.statusInput({ id: "EditButtonOptions", function: () => document.getElementById("EditThisItem")?.removeAttribute("id")})
                    }}><i className="fa fa-ellipsis-h" aria-hidden="true"/></button>
            <ul id="EditButtonOptions" className="dropDown">
                <li>
                    <button onClick={() => { Item.statusEditITEM({block: block, item: item, index: i})}}>bearbeiten</button>
                </li>
                <li>
                    <button onClick={() => { document.getElementById("EditThisItem")?.removeAttribute("id"); Block.statusActive(Item.remove(Block.active, item, i)); Block.statusReRender(!Block.reRender)}}>löschen</button>
                </li>
            </ul>
        </div>
    }

    static createEditor = () => {
        return ClassicEditor.create( document.querySelector( '#editor' ) )
            .catch( error => {
                console.error( error );
            } );
    }

    static renderInput = (block, item, i) => {
        Block.statusButtonsDisabled(true)

        let input
        let itemValue = item?.text

        Item.statusAddITEM({
            block: block,
            element: <form id="Active-form" className={Item.editITEM ? "editItem" : "addItem"}>
                <div id="editor"/>
                <CKEditor startupFocus={true} editor={ClassicEditor} data={itemValue} onChange={(e, editor) => input = editor.getData()}/>
                    <div className="buttons-container">
                        <button className="btn btn-default btn-green" onClick={(e) => {
                            e.preventDefault();
                            item ? (input && input.length > 0 ?
                                    Item.editItem(block, item, i, {text: input, editDate: Block.setDate()}) : Item.editItem(block, item, i, {text: item.text, editDate: Block.setDate()})) :
                                input && input.length > 0 && Item.addItem(block, {text: input, date: Block.setDate()});
                        }}><i className="fa fa-check" aria-hidden="true"/></button>
                        <button className="btn btn-default btn-red" onClick={() =>  Item.endInput() }><i className="fa fa-close" aria-hidden="true"/></button>
                    </div>
                </form>
        })
    }

    static renderItems = (block) => {return <div id="Items-Main" className="items">
        <div className="button-add-container">
            {Block.isAdmin && Item.addITEM?.block !== block && (
                <button disabled={Item.addITEM} className={`btn button-addItem`} onClick={() => {
                    Item.renderInput(block);
                }}><i className="fa fa-plus" aria-hidden="true"/></button>
            )}
        </div>
        {!Item.editITEM && Item.addITEM && Item.addITEM.block === block &&(
            <div id="AddItem" className="white-card add-card">{Item.addITEM.element}</div>
        )}
        <div className="items">
            {block?.item?.map((item, i) => {
                console.log("--item", item)
                    return (Item.editITEM && Item.editITEM.index === i && block === Item.editITEM.block ) ? (
                        <div key={i} id="EditItem" className="white-card add-card">{Item.addITEM?.element}</div>
                    ) : (
                        <div key={i} className="item white-card">
                            <div className="date-container">
                                <div className="date">{Block.getDate(item.date)}</div>
                                {item.editDate && (<div className="date">bearbeitet: {Block.getDate(item.editDate)}</div>)}
                            </div>
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