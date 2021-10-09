import {Component} from "react";
import OutsideClick from "../OutsideClick";
import Block from "./Block";

class RenderBlock extends Component {
    static reRender = false
    static statusReRender

    static renderEditButton = (block) => Block.isAdmin && (
        <ul className="button-editBlock dropDown">
            <li>
                <button disabled={Block.buttonsDisabled && Block.buttonsDisabled !== "editBlock"} onClick={() => {
                    if (Block.editBLOCK?.name) {
                        RenderBlock.endRenderEdit()
                    } else {
                        Block.statusEditBLOCK(block)
                        Block.statusButtonsDisabled("editBlock")
                        OutsideClick.statusInput({id: "EditBlock",function: () => RenderBlock.endRenderEdit() })
                    }
                }}><i className="fa fa-pencil" aria-hidden="true"/></button>
            </li>
            <li>
                <button disabled={Block.buttonsDisabled && Block.buttonsDisabled !== "addBlock"} onClick={() => {
                    if (Block.addBLOCK?.name) {
                        Block.statusAddBLOCK()
                        Block.statusButtonsDisabled()
                        RenderBlock.endRenderAdd()
                    } else {
                        Block.statusAddBLOCK(block)
                        Block.statusButtonsDisabled("addBlock")
                        OutsideClick.statusInput({id: "EditBlock",function: () => RenderBlock.endRenderAdd() })
                    }
                }}><i className="fa fa-plus" aria-hidden="true"/></button>
            </li>
            {block.position.length > 1 && (<li>
                <button disabled={Block.buttonsDisabled} onClick={() => Block.remove(block)}><i className="fa fa-minus" aria-hidden="true"/></button>
            </li>)}
        </ul>
    )

    static endRenderAdd = () => {
        Block.statusAddBLOCK()
        Block.statusButtonsDisabled()
        OutsideClick.statusInput()
    }
    static renderAddBlock = (block) => {
        let input
        return <form id="EditBlock">
            <input type="text" autoFocus value={input} onChange={(e) => input = e.target.value}/>
            <button className="btn" disabled={Block.buttonsDisabled && Block.buttonsDisabled !== "addBlock"} onClick={(e) => {
                e.preventDefault()
                let addBlock = Block.add(block, input)
                Block.statusActive(Block.get([...addBlock.position, 0]))
                RenderBlock.endRenderAdd()
            }}><i className="fa fa-check" aria-hidden="true"/></button>
            <button className="btn" onClick={(e) => {
                e.preventDefault()
                RenderBlock.endRenderAdd()
            }}><i className="fa fa-close" aria-hidden="true"/></button>
        </form>
    }

    static endRenderEdit = () => {
        Block.statusEditBLOCK()
        Block.statusButtonsDisabled()
        OutsideClick.statusInput()
    }
    static renderEditName = (block) => {
        let input
        return <form id="EditBlock">
            <input type="text" autoFocus defaultValue={block.name} onChange={e => input = e.target.value}/>
            <button className="btn" disabled={Block.buttonsDisabled && Block.buttonsDisabled !== "editBlock"} onClick={(e) => {
                e.preventDefault()
                Block.statusActive(Block.edit(block, input && !input.startsWith(" ") ? input : block.name))
                RenderBlock.endRenderEdit()
            }}><i className="fa fa-check" aria-hidden="true"/></button>
            <button className="btn" onClick={(e) => {
                e.preventDefault()
                RenderBlock.endRenderEdit()
            }}><i className="fa fa-close" aria-hidden="true"/></button>
        </form>
    }
}
export default RenderBlock