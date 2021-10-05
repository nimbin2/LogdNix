import React, {Component, useState, Fragment, useEffect} from "react";
import OutsideClick from "./OutsideClick";

class Block extends Component {

    static options = [{
        name: "Home",
        blocks: [
            {
                name: "Mails",
                item: [{text: "Der erste satrz"}],
                blocks: [{
                    name: "FAQ"
                }, {
                    name: "Antwortblöcke"
                }, {
                    name: "Newsletter"
                }
                ]
            }, {
                name: "Positionen",
                blocks: [
                    {
                        name: "Kasse",
                        blocks: [
                            {
                                name: "Check-In"
                            }, {
                                name: "Check-Out"
                            }
                        ]
                    }, {
                        name: "Fenster",
                        blocks: [
                            {
                                name: "Check-In Pre"
                            }, {
                                name: "Check-In Runner-Zettel"
                            }, {
                                name: "Routen drucken"
                            }, {
                                name: "Packen"
                            }
                        ]
                    }, {
                        name: "Runner",
                        blocks: [
                            {
                                name: "Vorbereitung"
                            }, {
                                name: "Routen"
                            }
                        ]
                    }
                ]
            }, {
                name: "Schichtplan",
                blocks: [
                    {
                        name: "Schichten ändern",
                    }, {
                        name: "Schichten anlegen",
                    }, {
                        name: "Schichtplan"
                    }
                ]
            }, {
                name: "Ordner"
            }]
    }]
    static active = Block.options[0]
    static statusActive
    static editBLOCK
    static statusEditBLOCK
    static addBLOCK = []
    static statusAddBLOCK
    static buttonsDisabled
    static statusButtonsDisabled
    static isAdmin = true
    static statusIsAdmin

    static checkPreActive = (block) => {
        return Block.active.position === block.position ?  false : Block.active.position.toString().startsWith(block.position.toString())
    }

    static checkActive = (block) => {
        return Block.active.position === block.position
    }

    static position = (block) => {
        return block.position.pop()
    }
    static positionSet = (block, position) => {
        Object.assign(block, {position: position})
    }

    static positionsSet = (blocks, position) => {
        blocks.forEach((block, i) => {
            Block.positionSet(block, [...position, i])
            block.blocks && Block.positionsSet(block.blocks, [...position, i])
        })
    }

    static parents = (block) => {
        let blocks = []
        block.position.forEach((i, c) => {
            block = c === 0 ? Block.options[0] : block.blocks[i]
            blocks = [...blocks, block]
        })
        return blocks
    }

    static parent = (block) => {
        return Block.parents(block).reverse()[1]
    }


    static add = (block, name) => {
        !block.blocks && Object.assign(block, {blocks: []})
        block.blocks.unshift({name: name})
        Block.positionsSet(block.blocks, block.position)
        return block
    }

    static get = (position) => {
        let block
        position.forEach((i, c) => {
            block = c === 0 ? Block.options[0] : block.blocks[i]
        })
        return block
    }

    static edit = (block, name) => {
        block.name = name
        return block
    }

    static remove = (block) => {
        Block.statusActive(Block.parent(block))
        return Block.parent(block).blocks.splice(block.position.pop(), 1);
    }

    static renderEditButton = (block) => Block.isAdmin && (
        <ul className="button-editBlock dropDown">
            <li>
                <button disabled={Block.buttonsDisabled && Block.buttonsDisabled !== "editBlock"} onClick={() => {
                    if (Block.editBLOCK?.name) {
                        Block.endRenderEdit()
                    } else {
                        Block.statusEditBLOCK(block)
                        Block.statusButtonsDisabled("editBlock")
                        OutsideClick.statusInput({id: "EditBlock",function: () => Block.endRenderEdit() })
                    }
                }}><i className="fa fa-pencil" aria-hidden="true"/></button>
            </li>
            <li>
                <button disabled={Block.buttonsDisabled && Block.buttonsDisabled !== "addBlock"} onClick={() => {
                    if (Block.addBLOCK?.name) {
                        Block.statusAddBLOCK()
                        Block.statusButtonsDisabled()
                        Block.endRenderAdd()
                    } else {
                        Block.statusAddBLOCK(block)
                        Block.statusButtonsDisabled("addBlock")
                        OutsideClick.statusInput({id: "EditBlock",function: () => Block.endRenderAdd() })
                    }
                }}><i className="fa fa-plus" aria-hidden="true"/></button>
            </li>
            {block.position !== "0" && (<li>
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
            <button disabled={Block.buttonsDisabled && Block.buttonsDisabled !== "addBlock"} onClick={(e) => {
                e.preventDefault()
                let addBlock = Block.add(block, input)
                Block.statusActive(Block.get([...addBlock.position, 0]))
                Block.endRenderAdd()
            }}><i className="fa fa-check" aria-hidden="true"/></button>
            <button onClick={(e) => {
                e.preventDefault()
                Block.endRenderAdd()
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
            <button disabled={Block.buttonsDisabled && Block.buttonsDisabled !== "editBlock"} onClick={(e) => {
                e.preventDefault()
                Block.statusActive(Block.edit(block, input && !input.startsWith(" ") ? input : block.name))
                Block.endRenderEdit()
            }}><i className="fa fa-check" aria-hidden="true"/></button>
            <button onClick={(e) => {
                e.preventDefault()
                Block.endRenderEdit()
            }}><i className="fa fa-close" aria-hidden="true"/></button>
        </form>
    }

}

export default Block;