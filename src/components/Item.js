import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {Component} from "react";
import Block from "./Block";
import OutsideClick from "./OutsideClick";
import RenderBlock from "./RenderBlock";


class Item extends Component {
    static addITEM
    static statusAddITEM
    static editITEM
    static statusEditITEM
    static editorInput
    static statusEditorInput

    static setBaseItem = (block) => {
        return !block.item && Object.assign(block, {item: []})
    }

    static all = () => {
        let items = []
        Block.all().forEach((block) => { block.item?.forEach((item) => {
            items.push([item, block])
        })})
        return items.sort((a, b) => {
            let aa = a[0].editDate || a[0].date
            let bb = b[0].editDate || b[0].date
            return bb - aa;
        });
    }

    static addItem = (block, data) => {
        this.setBaseItem(block)
        block.item.push(data)
        this.endInput()
        return block
    }

    static editItem = (block, item, i, data) => {
        Object.assign(item, {text: data.text, editDate: data.editDate})

        this.endInput()
        return item
    }

    static remove = (block, item, i) => {
        block.item.splice(i, 1)
        return block
    }

    static endInput = () => {
        this.statusEditITEM()
        this.statusAddITEM()
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
                    <button onClick={() => { this.statusEditITEM({block: block, item: item, index: i})}}>bearbeiten</button>
                </li>
                <li>
                    <button onClick={() => { document.getElementById("EditThisItem")?.removeAttribute("id"); Block.statusActive(this.remove(Block.active, item, i)); RenderBlock.statusReRender(!RenderBlock.reRender)}}>löschen</button>
                </li>
            </ul>
        </div>
    }

    static createEditor = (data) => {
        ClassicEditor.create( document.querySelector('#editor'), {
            toolbar: ['heading', '|', 'bold', 'italic', 'link', '|', 'fontColor', 'fontBackgroundColor', '|', 'alignment', 'bulletedList', 'numberedList', 'blockQuote', 'outdent', 'indent', '|', 'insertTable', '|', 'undo', 'redo'],
            language: "de"
        }).then( editor => {
            this.editITEM?.item.text && editor.setData(data);
            this.statusEditorInput(editor)
        } )
            .catch( error => {
                console.error( error );
            } );
    }

    static renderInput = (block, item, i) => {
        Block.statusButtonsDisabled(true)

        this.statusAddITEM({
            block: block,
            element: <form id="Active-form" className={this.editITEM ? "editItem" : "addItem"}>
                <div id="editor"/>
                <div className="buttons-container">
                    <button className="btn btn-default btn-green" onClick={(e) => {
                        e.preventDefault();
                        let input = this.editorInput.getData()
                        item ? this.editItem(block, item, i, {text: input, editDate: Block.setDate()}) :
                            input && input.length > 0 && this.addItem(block, {text: input, date: Block.setDate()});
                    }}><i className="fa fa-check" aria-hidden="true"/></button>
                    <button className="btn btn-default btn-red" onClick={() =>  this.endInput() }><i className="fa fa-close" aria-hidden="true"/></button>
                </div>
            </form>
        })
    }

    static renderItem = (block, item, i) => {
        return <div key={i} className="item white-card">
            <div className="date-container">
                <div className="date">{Block.getDate(item.date)}</div>
                {item.editDate && (<div className="date">bearbeitet: {Block.getDate(item.editDate)}</div>)}
            </div>
            <div dangerouslySetInnerHTML={{__html: item.text}}/>
            <div id="ButtonEdit">
                {this.editOptions(block, item, i)}
            </div>
        </div>
    }

    static renderItems = (block) => {return <div id="Items-Main" className="items">
        <div className="button-add-container">
            {((Block.isAdmin && this.addITEM?.block !== block) || this.editITEM) && (
                <button disabled={this.addITEM} className={`btn button-addItem`} onClick={() => {
                    this.renderInput(block);
                }}><i className="fa fa-plus" aria-hidden="true"/></button>
            )}
        </div>
        {!this.editITEM && this.addITEM && this.addITEM.block === block &&(
            <div id="AddItem" className="white-card add-card">{this.addITEM.element}</div>
        )}
        <div className="items">
            {block?.item?.map((item, i) => {
                    return (this.editITEM && this.editITEM.index === i && block === this.editITEM.block ) ? (
                        <div key={i} id="EditItem" className="white-card add-card">{this.addITEM?.element}</div>
                    ) :
                        this.renderItem(block, item, i)
                }
            )}
        </div>
    </div>}
}
export default Item