import React, {useState, Fragment, useEffect} from "react";
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
    const [addITEM, statusAddITEM] = useState("");
    const [editITEM, statusEditITEM] = useState(false);

    useEffect(() => {
        if (editITEM) {
            document.getElementById("Content").addEventListener('click', handleOutsideEditClick )
        } else {
            console.log("CLOSWs")
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
            document.getElementById("Content").removeEventListener('click', handleOutsideNavClick )
        return () => {
            document.getElementById("Content").removeEventListener("click", handleOutsideNavClick);
        }
    }, [hideNav])

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

    const renderNavButton = (block, k) => (
        <button key={k || 0}
                onClick={() => loadContent(block) }
                disabled={ block.position === renderBlock.position && block.blocks && block.blocks.length === 0}
                className={`navbarButton ${renderBlock.position.startsWith(block.position) && "active"}`}>{block.name}</button>
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

    const saveItem = (block, data) => {
        modifyBlock(block, data)
        statusAddITEM()
        statusEditITEM()
    }

    const editItem = (item, i, text) => {
        console.log("EDIT")
        for(let key in renderBlock.item[i]) {
            if(renderBlock.item[i].hasOwnProperty(key)) {
                renderBlock.item[i][key] = text
            }
        }
        console.log(renderBlock.item[i])
        editITEM && statusEditITEM(false);
    }

    const removeItem = (item, i) => {
        renderBlock.item.splice(i, 1);
        editITEM && statusEditITEM(false);
    }

    const addText = (block) => {
        let input
        statusAddITEM(
            <form className="addITEM">
                <textarea value={input} onChange={(e) => input = e.target.value} />
                <button className="btn btn-default" onClick={(e) => {
                    e.preventDefault();
                    input && input.length > 0 && saveItem(block, {text: input})
                }}>Save</button>
                <button className="btn btn-default" onClick={() => statusAddITEM()}>Cancel</button>
            </form>
        )
    }

    const editOptions = (item, i) => (
        <ul id="EditItem" className="dropDown">
            <li><button onClick={() => editItem(item, i, "huuu")}>bearbeiten</button></li>
            <li><button onClick={() => removeItem(item, i)}>löschen</button></li>
        </ul>
    )

    const handleOutsideEditClick = (e) => {
        if ( document.getElementById("EditButton") && ! document.getElementById("EditButton").contains(e.target)) {
            statusEditITEM(false);
        }
    }

    const handleOutsideNavClick = (e) => {
        if ( document.getElementById("Content").contains(e.target)) {
            statusHideNav(true)
        }
    }

    const setEditItem = (e) => {
        e.target.id = "EditThisItem"
        statusEditITEM(e);
    }

    const renderMain = () => (
        <Fragment>
            <div className="col">
                <h2>{renderBlock.name}</h2>
                <button disabled={addITEM} className="btn btn-default" onClick={() => {
                    addText(renderBlock);
                }}>Add Text</button>
            </div>
            <div className="col">
                {renderBlock?.text}
            </div>
            <div className="col">
                {renderBlock?.item?.map((item, i) => (
                    <div key={i} className="item white-card">
                        {item.header && (<h3>{item.header}</h3>)}
                        <p>{item.text}</p>
                        <div id="EditButton">
                            <button type="edit"  className="btn btn-default"
                                    onClick={(e) => !editITEM && setEditItem(e)}>...</button>
                            {editITEM ? editOptions(item, i) : "nulll"}
                        </div>
                    </div>
                )) }
                <div className="addITEM">{addITEM}</div>
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
            <div id="Sidebar" className={`${hideNav && "hidden"}`}>
                <button className={`hideSideBar ${ hideNav && "active"}`} onClick={() => {
                    statusHideNav(!hideNav)
                }}>X</button>
                {renderSidebar(modifyBlocks)}
            </div>
            <div id="Main">
                <div id="TopBar">
                    {parentBlocks().map((block, k) => renderNavButton(block, k) )}
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
