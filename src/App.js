import React, {useState, Fragment, useEffect} from "react";
import '../node_modules/font-awesome/css/font-awesome.min.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import './App.css';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';





function App() {
    let options = [{
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
    const [modifyBlocks, statusModifyBlocks] = useState(options)
    const [renderBlock, statusRenderBlock] = useState(modifyBlocks[0])
    const [hideNav, statusHideNav] = useState(false)
    const [reloadBlock, statusReloadBlock] = useState(true)
    const [editMode, statusEditMode] = useState(true)
    const [addITEM, statusAddITEM] = useState("")
    const [editITEM, statusEditITEM] = useState(false)
    const [disableButtons, statusDisableButtons] = useState(false)
    const [sortNavMode, statusSortNavMode] = useState(false)

    useEffect(() => {
        if (editITEM) {
            document.getElementById("Content").addEventListener('click', handleOutsideEditClick )
        } else {
            document.getElementById("Content").removeEventListener('click', handleOutsideEditClick )
            document.getElementById("EditThisItem")?.removeAttribute("id")
        }
        return () => {
            document.getElementById("Content").removeEventListener("click", handleOutsideEditClick);
        }
    }, [editITEM])

    useEffect(() => {
        !hideNav ?
            document.getElementById("Content").addEventListener('click', handleOutsideNavClick ) :
            document.getElementById("Content").removeEventListener('click', handleOutsideNavClick );
        return () => {
            document.getElementById("Content").removeEventListener("click", handleOutsideNavClick);
        }
    }, [hideNav])

    useEffect(() => {
        editMode ? statusHideNav(false) :
            document.getElementById("Content").addEventListener('click', handleOutsideNavClick )
    }, [editMode])

    const loadContent = (block) => {
        statusAddITEM("");
        statusEditITEM(false);
        statusRenderBlock(block);
    }

    // Modify modifyBlocks
    const setOptionsPosition = (blocks, prePosition) => {
        if (blocks.position) {
            prePosition = `${blocks.position.splice(0, -1)} `
        } else if (!prePosition) {
            prePosition = "";
        }

        blocks.forEach((block, i) => {
            Object.assign(block, {position: prePosition+i.toString()});
            block.blocks && setOptionsPosition(block.blocks, `${prePosition+i.toString()} ` )
        })
    }
    !modifyBlocks[0].blocks[0]?.position && setOptionsPosition(modifyBlocks)

    const blocksPosition = (blocks) => {
        return blocks[0].position?.slice(0, -1)
    }

    // Get block.position parent blocks
    const parentBlocks = () => {
        let blocks = []
        let block = modifyBlocks
        renderBlock.position.split(" ").forEach((i, c) => {
            block = c === 0 ? modifyBlocks[i] : block.blocks[i]
            blocks = [...blocks, block]
        })
        return blocks
    }

    const parentBlock = (block) => {
        let parentBlockPosition = block.position.split(" ");
        parentBlockPosition.pop()

        let execute
        parentBlockPosition.forEach((i, c) => {
            execute = c === 0 ? `modifyBlocks[${i}]` : execute+`.blocks[${i}]`
        })
        // eslint-disable-next-line no-eval
        return eval(execute)
    }

    const renderNavButton = (block, i) => (
        <div className="navItem" key={i || 0}>
            <button onClick={() => loadContent(block) }
                    disabled={disableButtons || renderBlock.position === block.position}
                    className={`navbarButton ${renderBlock.position.startsWith(block.position) && "active"}`}>{block.name}</button>
            { editMode && editNavOptions(block)}
        </div>
    )

    const renderSidebar = (blocks) => (
        <ul>
            {blocks.map((block, i) => block.name && (
                <li key={i} className="navBlock list-group-item" id={`NavItem-${blocks[i].position.replace(/ /g,"-")}`}>
                    {renderNavButton(blocks[i])}
                    { block.blocks && renderBlock.position.startsWith(block.position) && renderSidebar(block.blocks)}
                </li>
            ))}
        </ul>
    )

    const SidebarItem = SortableElement(({block}) => <li className="navBlock list-group-item" id={`NavItem-${block.position.replace(/ /g,"-")}`}>
        {renderNavButton(block)}
        { block.blocks && renderBlock.position.startsWith(block.position) && (<SortableList blocks={block.blocks} onSortEnd={onSortEnd}/>)}
    </li>);

    const SidebarSortableItem = SortableElement(({block}) => <li className="navBlock list-group-item" id={`NavItem-${block.position.replace(/ /g,"-")}`}>
        {renderNavButton(block)}
        { block.blocks && renderBlock.position.startsWith(block.position) && <SortableList lockAxis="y" blocks={block.blocks} onSortEnd={onSortEnd}/>}
    </li>);

    const SortableList = SortableContainer(({blocks}) => {
        return (
            <ul>
                {blocks?.map((block, i) =>
                    <SidebarSortableItem disabled={block.position !== renderBlock.position ? true : block.position === "0"} key={`item-${block.position}`} index={i} block={block} />
                )}
            </ul>
        );
    });

    const onSortEnd = ({oldIndex, newIndex}) => {
        let element = parentBlock(renderBlock).blocks;
        element.splice(oldIndex, 1);
        element.splice(newIndex, 0, renderBlock);
        console.log(element)
        saveBlock(renderBlock)
    };

    const getBlock = (block) => {
        let execute
        block.position.split(" ").forEach((i, c) => {
            execute = c === 0 ? `modifyBlocks[${i}]` : execute+`.blocks[${i}]`
        })
        // eslint-disable-next-line no-eval
        return eval(execute)
    }

    const saveBlock = (block) => {
        statusRenderBlock(getBlock(block) || options.blocks)
        statusReloadBlock(!reloadBlock)
    }

    const setBlockItem = (block) => {
        ! block.item &&  Object.assign(block, {item: []})
        saveBlock(block);
    }

    const modifyBlockItem = (block, data) => {
        setBlockItem(block)
        block.item.push(data)
        saveBlock(block)
    }

    const addItem = (block, data) => {
        modifyBlockItem(block, data)
        statusAddITEM(false)
        statusEditITEM(false)
        statusDisableButtons(false)
    }

    const editItem = (item, i, data) => {
        for(let key in renderBlock.item[i]) {
            if(renderBlock.item[i].hasOwnProperty(key)) {
                renderBlock.item[i][key] = data || ""
            }
        }
        statusEditITEM(false)
        statusAddITEM(false)
        statusDisableButtons(false)
    }

    const removeBlock = (block) => {
        let blockPosition
        let pBlock
        if (block.position.split(" ").length > 1) {
            blockPosition = block.position.slice(-1)
            pBlock = parentBlock(block)
            delete pBlock.blocks[blockPosition]
        } else {
            blockPosition = block.position
            pBlock = options.blocks
            delete pBlock[blockPosition]
        }
        setOptionsPosition(pBlock.blocks, `${pBlock.position} `)
        saveBlock(pBlock, block.position)
    }

    const removeItem = (item, i) => {
        renderBlock.item.splice(i, 1)
        editITEM && statusEditITEM(false)
        statusReloadBlock(!reloadBlock)
    }

    const addItemText = (item, i) => {
        statusEditITEM(false)
        statusAddITEM(false)
        statusDisableButtons(true)
        let input
        let itemValue
        if (renderBlock.item) {
            for(let key in renderBlock.item[i]) {
                if(renderBlock.item[i].hasOwnProperty(key)) {
                    itemValue = renderBlock.item[i][key];
                }
            }
        }
        statusAddITEM(
            <form className={editITEM ? "editItem" : "addItem"}>
                <CKEditor editor={ClassicEditor} data={itemValue} onChange={(e, editor) => input = editor.getData()}/>
                <button className="btn btn-default" onClick={(e) => {
                    e.preventDefault();
                    item ? editItem(item, i, input || itemValue) :
                        input && input.length > 0 && addItem(renderBlock, {text: input});
                }}>Save</button>
                <button className="btn btn-default" onClick={() => {statusAddITEM(false); statusDisableButtons(false)}}>Cancel</button>
            </form>
        )
    }

    const editOptions = (item, i) => (
        <Fragment>
            <button type="edit"  className="btn btn-default" disabled={disableButtons}
                    onClick={(e) => {
                        e.target.id = "EditThisItem";
                        !editITEM && statusEditITEM(item);
                    }}>...</button>
            <ul id="EditItem" className="dropDown">
                <li><button onClick={() => {
                    addItemText(item, i);
                    statusEditITEM(false);
                }}>bearbeiten</button></li>
                <li><button onClick={() => removeItem(item, i)}>löschen</button></li>
            </ul>
        </Fragment>
    )

    const editNavOptions = (block) => (
        <ul className="dropDown editNavItem-button">
            <li><button onClick={() => {addItemText(block); statusEditITEM(false);}}><i className="fa fa-pencil" aria-hidden="true"/></button></li>
            {block.position !== "0" && (
                <li><button onClick={() => removeBlock(block)}><i className="fa fa-minus" aria-hidden="true"/></button></li>)}
            <li><button onClick={() => removeBlock(block)}><i className="fa fa-plus" aria-hidden="true"/></button></li>
        </ul>
    )

    const handleOutsideEditClick = (e) => {
        if ( document.getElementById("ButtonEdit") && ! document.getElementById("ButtonEdit").contains(e.target)) {
            statusEditITEM(false);
        }
    }

    const handleOutsideNavClick = (e) => {
        if ( document.getElementById("Content").contains(e.target) ) {
            statusHideNav(true)
        }
    }

    const renderMain = () => (
        <Fragment>
            <div className="col">
                <h2>{renderBlock.name}</h2>
            </div>
            <div className="col">
                {renderBlock?.text}
            </div>
            <div className="col">
                {renderBlock?.item?.map((item, i) => (
                    <div key={i} className="item white-card">
                        <div dangerouslySetInnerHTML={{ __html: item.text }} />
                        <div id="ButtonEdit">
                            {editOptions(item, i)}
                        </div>
                    </div>
                )) }
                { addITEM && (
                    <div id={editITEM ? "EditItem" : "AddItem"} className="white-card">{addITEM}</div>
                )}
                { editMode && (
                    <button disabled={addITEM } className={`btn btn-default ${addITEM ? "d-none" : ""}`}  onClick={() => {
                        addItemText();
                    }}>Add Text</button>
                )}
            </div>
        </Fragment>
    )

    const renderBottomBar = () => (
        <div id="BottomBar">
            {renderBlock.blocks && renderSidebar(renderBlock.blocks)}
        </div>
    )

    return (
        <div id="SCC">
            <div id="Sidebar" className={`list-group ${hideNav && !editMode ? "hidden" : ""}`}>
                {hideNav && !editMode && (
                    <button className={`hideSideBar ${ hideNav && !editMode ? "active" : ""}`} onClick={() => {
                        statusHideNav(!hideNav)
                    }}>{hideNav ? (<i className="fa fa-chevron-right" aria-hidden="true"/>) : (<i className="fa fa-chevron-left" aria-hidden="true"/>)}
                    </button>
                )}
                {modifyBlocks && (<SortableList blocks={modifyBlocks} onSortEnd={onSortEnd}/>)}
                {/*renderSidebar(modifyBlocks)*/}

            </div>
            <div id="Main">
                <div id="TopBar">
                    <div className="topBar-items">
                        {parentBlocks().map((block, k) => renderNavButton(block, k) )}
                    </div>
                    <button id="EditMode-button" disabled={disableButtons} className={editMode ? "active" : "inActivw"} onClick={() => {
                        statusEditMode(!editMode);
                        statusHideNav(false);
                    }}>{editMode ? ("Admin") : ("User")}</button>
                </div>
                <div id="Content">
                    {renderBlock && ( renderMain() )}
                </div>
                <div id="BottomBar">
                    {renderBlock && ( renderBottomBar() )}
                </div>
            </div>
        </div>
    );
}

export default App;
