import React, {useState, Fragment, useEffect} from "react";
import '../node_modules/font-awesome/css/font-awesome.min.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import './App.css';


function App() {
    let options = [
        {
            name: "Mails",
            item: [{text: "Der erste satrz"}],
            blocks: [
                {
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
        }
    ]
    const [modifyBlocks, statusModifyBlocks] = useState(options);
    const [renderBlock, statusRenderBlock] = useState(modifyBlocks[0]);
    const [hideNav, statusHideNav] = useState(false);
    const [reloadBlock, statusReloadBlock] = useState(true);
    const [editMode, statusEditMode] = useState(true);
    const [addITEM, statusAddITEM] = useState("");
    const [editITEM, statusEditITEM] = useState(false);
    const [disableButtons, statusDisableButtons] = useState(false);

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
    const setOptionsPosition = (blocks, c) => {
        blocks.forEach((block, i) => {
            Object.assign(block, {position: c+i.toString()});
            block.blocks && setOptionsPosition(block.blocks, `${c+i.toString()} ` )
        })
    }
    setOptionsPosition(modifyBlocks, "")

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

    const renderNavButton = (block, i) => (
        <div className="navItem" key={i || 0}>
            <button onClick={() => loadContent(block) }
                    disabled={disableButtons || renderBlock.position === block.position}
                    className={`navbarButton ${renderBlock.position.startsWith(block.position) && "active"}`}>{block.name}</button>
            { editMode && editNavOptions(block)}
        </div>
    )

    const renderSidebar = (block) => (
        <ul>
            {Object.keys(block).map((i) => block[i].name && (
                <li key={i} className="navBlock">
                    {renderNavButton(block[i])}
                    { block[i].blocks && renderBlock.position.startsWith(block[i].position) && renderSidebar(block[i].blocks)}
                </li>
            ))}
        </ul>
    )

    const getBlock = (block) => {
        let execute
        block.position.split(" ").forEach((i, c) => {
            execute = c === 0 ? `modifyBlocks[${i}]` : execute+`.blocks[${i}]`
        })
        // eslint-disable-next-line no-eval
        return eval(execute)
    }

    const saveBlock = () => {
        statusModifyBlocks(modifyBlocks)
        statusRenderBlock(getBlock(renderBlock))
        statusReloadBlock(!reloadBlock)
    }

    const setBlockItem = (block) => {
        ! block.item &&  Object.assign(block, {item: []});
        saveBlock();
    }

    const modifyBlock = (block, data) => {
        setBlockItem(block)
        block.item.push(data)
        saveBlock()
    }

    const addItem = (block, data) => {
        modifyBlock(block, data)
        statusAddITEM(false)
        statusEditITEM(false)
        statusDisableButtons(false);
    }

    const editItem = (item, i, data) => {
        for(let key in renderBlock.item[i]) {
            if(renderBlock.item[i].hasOwnProperty(key)) {
                renderBlock.item[i][key] = data || "";
            }
        }
        statusEditITEM(false);
        statusAddITEM(false);
        statusDisableButtons(false);
    }

    const removeBlock = (block) => {
        console.log(block)
        options.slice(block, 1)
    }

    const removeItem = (item, i) => {
        renderBlock.item.splice(i, 1);
        editITEM && statusEditITEM(false);
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
        <Fragment>
            <ul className="dropDown editNavItem-button">
                <li><button onClick={() => {addItemText(block); statusEditITEM(false);}}><i className="fa fa-pencil" aria-hidden="true"/></button></li>
                <li><button onClick={() => removeBlock(block)}><i className="fa fa-minus" aria-hidden="true"/></button></li>
                <li><button onClick={() => removeBlock(block)}><i className="fa fa-plus" aria-hidden="true"/></button></li>
            </ul>
        </Fragment>
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
            <div id="Sidebar" className={`${hideNav && !editMode ? "hidden" : ""}`}>
                {hideNav && !editMode && (
                    <button className={`hideSideBar ${ hideNav && !editMode ? "active" : ""}`} onClick={() => {
                        statusHideNav(!hideNav)
                    }}>{hideNav ? (<i className="fa fa-chevron-right" aria-hidden="true"/>) : (<i className="fa fa-chevron-left" aria-hidden="true"/>)}
                    </button>
                )}
                {renderSidebar(modifyBlocks)}
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
