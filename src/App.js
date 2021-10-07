import {useState, useEffect} from "react";
import '../node_modules/font-awesome/css/font-awesome.min.css';
import './App.css';
import Block from './components/Block'
import Navbar from './components/Navbar'
import OutsideClick from "./components/OutsideClick";
import Item from "./components/Item";
import Content from "./components/Content";


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
    const [reRender, statusReRender] = useState(Block.reRender)


    useEffect(() => {
        Block.active = active
        Block.statusActive = statusActive
        Block.active = active
        Block.hold && Block.resetHold(active)

        reRenderAll()
    }, [active])

    useEffect(() => {
        Block.editBLOCK = editBLOCK
        Block.statusEditBLOCK = statusEditBLOCK
        reRenderAll()
    }, [editBLOCK])

    useEffect(() => {
        Block.addBLOCK = addBLOCK
        Block.statusAddBLOCK = statusAddBLOCK
        reRenderAll()
    }, [addBLOCK])

    useEffect(() => {
        OutsideClick.input = outsideClickInput
        OutsideClick.statusInput = statusOutsideClickInput

        if (OutsideClick.input) {
            document.getElementById("Content")?.addEventListener('click', OutsideClick.handleOutsideClick)
        } else {
            document.getElementById("Content")?.removeEventListener('click', OutsideClick.handleOutsideClick)
        }
        return () => {
            document.getElementById("Content")?.removeEventListener("click", OutsideClick.handleOutsideClick)
        }
    }, [outsideClickInput])

    useEffect(() => {
        Block.buttonsDisabled = buttonsDisabled
        Block.statusButtonsDisabled = statusButtonsDisabled
        reRenderAll()
    }, [buttonsDisabled])

    useEffect(() => {
        Block.isAdmin = isAdmin
        Block.statusIsAdmin = statusIsAdmin
        reRenderAll()
        //!isAdmin && !Block.hideNav && OutsideClick.statusInput({id: "Sidebar",function: () => Navbar.statusHideNav(true) })
    }, [isAdmin])

    useEffect(() => {
        Navbar.hideNav = hideNav
        Navbar.statusHideNav = statusHideNav
        !hideNav && Block.isAdmin && OutsideClick.statusInput({id: "Sidebar",function: () => Navbar.statusHideNav(true) })
    }, [hideNav])

    useEffect(() => {
        Item.editITEM = editITEM
        Item.statusEditITEM = statusEditITEM
        console.log(Item.editITEM?.block, Item.editITEM?.item, Item.editITEM?.index)
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
    }, [reRenderContent])

    useEffect(() => {
        Block.hold = holdBlocks
        Block.statusHold = statusHoldBlocks
        statusReRenderContent(Content.renderContent())
        setHoldLayout()
    }, [holdBlocks])

    useEffect(() => {
        Block.holdLayout = holdLayout
        Block.statusHoldLayout = statusHoldLayout
        statusReRenderContent(Content.renderContent())
        setHoldLayout()
    }, [holdLayout])

    useEffect(() => {
        Block.reRender = reRender
        Block.statusReRender = statusReRender
        reRenderAll()
    }, [reRender])

    Block.positionsSet(Block.options, [])

    const reRenderNavbar = () => {
        statusRenderSideBar(Navbar.renderSideBar())
        statusRenderTopBar(Navbar.renderTopBar())
        statusRenderBottomBar(Navbar.renderBottomBar())
        Block.init()
    }

    const reRenderAll = () => {
        reRenderNavbar()
        statusReRenderContent(Content.renderContent())
        document.getElementById("Hold")?.scrollIntoView()
    }

    const setHoldLayout = () => {
        if (document.getElementById("Hold")) {
            document.getElementById("Hold").style.gridTemplateColumns = `repeat(${Block.hold.length+1}, ${Block.holdLayout ? "50%" : "100%"})`
        }
    }

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
