import {useState, useEffect} from "react";
import '../node_modules/font-awesome/css/font-awesome.min.css';
import './App.css';
import Block from './components/Block'
import Navbar from './components/Navbar'
import OutsideClick from "./components/OutsideClick";
import Item from "./components/Item";
import Content from "./components/Content";
import Hold from "./components/Hold";
import RenderBlock from "./components/RenderBlock";
import NewestPosts from "./components/NewestPosts";


function App() {

    const [active, statusActive] = useState(Block.active)
    const [editBLOCK, statusEditBLOCK] = useState(Block.editBLOCK)
    const [addBLOCK, statusAddBLOCK] = useState(Block.addBLOCK)
    const [outsideClickInput, statusOutsideClickInput] = useState()
    const [renderSideBar, statusRenderSideBar] = useState()
    const [renderTopBar, statusRenderTopBar] = useState()
    const [renderBottomBar, statusRenderBottomBar] = useState()
    const [reRenderContent, statusReRenderContent] = useState()
    const [buttonsDisabled, statusButtonsDisabled] = useState(false)
    const [isAdmin, statusIsAdmin] = useState(Block.isAdmin)
    const [hideNav, statusHideNav] = useState(false)
    const [addITEM, statusAddITEM] = useState()
    const [editITEM, statusEditITEM] = useState()
    const [holdBlocks, statusHoldBlocks] = useState([])
    const [holdLayout, statusHoldLayout] = useState([])
    const [reRender, statusReRender] = useState(RenderBlock.reRender)
    const [editorInput, statusEditorInput] = useState()
    const [hideNewest, statusHideNewest] = useState()

    RenderBlock.statusReRender = statusReRender
    useEffect(() => {
        Block.active = active
        Block.statusActive = statusActive
        Block.active = active
        RenderBlock.statusReRender(!RenderBlock.reRender)
        Hold.hold && Hold.resetHold(active)
    }, [active])

    useEffect(() => {
        Block.editBLOCK = editBLOCK
        Block.statusEditBLOCK = statusEditBLOCK
        RenderBlock.statusReRender(!RenderBlock.reRender)
    }, [editBLOCK])

    useEffect(() => {
        Block.addBLOCK = addBLOCK
        Block.statusAddBLOCK = statusAddBLOCK
        RenderBlock.statusReRender(!RenderBlock.reRender)
    }, [addBLOCK])

    useEffect(() => {
        OutsideClick.input = outsideClickInput
        OutsideClick.statusInput = statusOutsideClickInput
        let mainId = OutsideClick.input?.mainId ? OutsideClick.input.mainId  : "LogdNix"

        if (OutsideClick.input) {
            document.getElementById(mainId)?.addEventListener('click', OutsideClick.handleOutsideClick)
        } else {
            document.getElementById(mainId)?.removeEventListener('click', OutsideClick.handleOutsideClick)
        }
        return () => {
            document.getElementById(mainId)?.removeEventListener("click", OutsideClick.handleOutsideClick)
        }
    }, [outsideClickInput])

    useEffect(() => {
        Block.buttonsDisabled = buttonsDisabled
        Block.statusButtonsDisabled = statusButtonsDisabled
        RenderBlock.statusReRender(!RenderBlock.reRender)
    }, [buttonsDisabled])

    useEffect(() => {
        Block.isAdmin = isAdmin
        Block.statusIsAdmin = statusIsAdmin
        RenderBlock.statusReRender(!RenderBlock.reRender)
        !isAdmin && !Block.hideNav && OutsideClick.statusInput({id: "Sidebar",function: () => Navbar.statusHideNav(true), mainId: "Content" })
    }, [isAdmin])

    useEffect(() => {
        Navbar.hideNav = hideNav
        Navbar.statusHideNav = statusHideNav
        !hideNav && OutsideClick.statusInput({id: "Sidebar",function: () => Navbar.statusHideNav(true), mainId: "Content" })
    }, [hideNav])

    useEffect(() => {
        Item.editITEM = editITEM
        Item.statusEditITEM = statusEditITEM
        Item.editITEM && Item.renderInput(Item.editITEM?.block, Item.editITEM?.item, Item.editITEM?.index)
    }, [editITEM])

    useEffect(() => {
        Item.addITEM = addITEM
        Item.statusAddITEM = statusAddITEM
        statusReRenderContent(Content.renderContent())
    }, [addITEM])

    useEffect(() => {
        Item.reRenderContent = reRenderContent
        Item.statusReRenderContent = statusReRenderContent
        addITEM && document.getElementById("Active-form")?.getElementsByClassName("ck-editor__main").length < 1 && Item.createEditor(editITEM?.item.text)
    }, [reRenderContent, addITEM, editITEM])

    useEffect(() => {
        Hold.hold = holdBlocks
        Hold.statusHold = statusHoldBlocks
        statusReRenderContent(Content.renderContent())
        setHoldLayout()
    }, [holdBlocks])

    useEffect(() => {
        Hold.holdLayout = holdLayout
        Hold.statusHoldLayout = statusHoldLayout
        statusReRenderContent(Content.renderContent())
        setHoldLayout()
    }, [holdLayout])

    useEffect(() => {
        RenderBlock.reRender = reRender
        RenderBlock.statusReRender = statusReRender
        reRenderNavbar()
        statusReRenderContent(Content.renderContent())
        document.getElementById("Hold")?.scrollIntoView()
    }, [reRender])

    useEffect(() => {
        Item.editorInput = editorInput
        Item.statusEditorInput = statusEditorInput
    }, [editorInput])

    useEffect(() => {
        NewestPosts.hideNewest = hideNewest
        NewestPosts.statusHideNewest = statusHideNewest
        statusReRenderContent(Content.renderContent())
    }, [hideNewest])


    Block.positionsSet(Block.options, [])

    const reRenderNavbar = () => {
        statusRenderSideBar(Navbar.renderSideBar())
        statusRenderTopBar(Navbar.renderTopBar())
        statusRenderBottomBar(Navbar.renderBottomBar())
        Block.init()
    }

    const setHoldLayout = () => {
        if (document.getElementById("Hold")) {
            if (!Hold.hold?.length > 0) {
                document.getElementById("Hold").style.gridTemplateColumns = "unset"
            } else {
                document.getElementById("Hold").style.gridTemplateColumns = `repeat(${Hold.hold.length+1}, ${Hold.holdLayout ? "50%" : "100%"})`
            }
        }
    }

    useEffect(() => {
    })

    return (
        <div id="LogdNix">
            <div id="Sidebar" className={hideNav ? "hidden" : ""}>
                <button disabled={Block.buttonsDisabled} className={`hideSideBar ${hideNav ? "active" : ""}`} onClick={() => { statusHideNav(!hideNav) }}>
                    {hideNav ? (<i className="fa fa-chevron-right" aria-hidden="true"/>) : ( <i className="fa fa-chevron-left" aria-hidden="true"/>)} </button>
                {renderSideBar}
            </div>
            <div id="Main">
                <div id="TopBar">
                    {renderTopBar}
                    <div className="buttons-right">
                        <button disabled={Block.buttonsDisabled} className="button-export" onClick={() => Block.downloadObject(Block.options, "LogdNix.data")}>Export</button>
                        <div className="fileInput">
                            <input disabled={Block.buttonsDisabled} id="FileInput" type="file" name="file"/>
                            <label htmlFor="FileInput">Import</label>
                        </div>
                        <button id="EditMode-button" disabled={Block.buttonsDisabled} className={isAdmin ? "active" : "inActivw"}
                                onClick={() => { statusIsAdmin(!isAdmin); }}>{isAdmin ? ("Admin") : ("User")}</button>
                    </div>
                </div>
                <div id="Content">
                    {reRenderContent}
                </div>
                <div id="BottomBar">
                    {renderBottomBar}
                </div>
            </div>
        </div>
    );
}

export default App;
