import {useState, useEffect} from "react";
import '../node_modules/font-awesome/css/font-awesome.min.css';
import './App.css';
import Block from './components/Block'
import Navbar from './components/Navbar'
import OutsideClick from "./components/OutsideClick";
import Item from "./components/Item";


function App() {

    const [active, statusActive] = useState(Block.active)
    const [editBLOCK, statusEditBLOCK] = useState(Block.editBLOCK)
    const [addBLOCK, statusAddBLOCK] = useState(Block.addBLOCK)
    const [outsideClickInput, statusOutsideClickInput] = useState()
    const [renderSideBar, statusRenderSideBar] = useState()
    const [renderTopBar, statusRenderTopBar] = useState()
    const [renderBottomBar, statusRenderBottomBar] = useState()
    const [reRenderItems, statusReRenderItems] = useState()
    const [buttonsDisabled, statusButtonsDisabled] = useState(false)
    const [isAdmin, statusIsAdmin] = useState(Block.isAdmin)
    const [hideNav, statusHideNav] = useState(false)
    const [addITEM, statusAddITEM] = useState()
    const [editITEM, statusEditITEM] = useState()


    useEffect(() => {
        Block.active = active
        Block.statusActive = statusActive
        Block.active = active
        reRenderNavbar()
        statusReRenderItems(Item.renderItems(active))
    }, [active])

    useEffect(() => {
        Block.editBLOCK = editBLOCK
        Block.statusEditBLOCK = statusEditBLOCK
        reRenderNavbar()
    }, [editBLOCK])

    useEffect(() => {
        Block.addBLOCK = addBLOCK
        Block.statusAddBLOCK = statusAddBLOCK
        Block.addBLOCK = addBLOCK
        reRenderNavbar()
    }, [addBLOCK])

    useEffect(() => {
        OutsideClick.input = outsideClickInput
        OutsideClick.statusInput = statusOutsideClickInput

        if (OutsideClick.input) {
            document.getElementById("Content").addEventListener('click', OutsideClick.handleOutsideClick)
        } else {
            OutsideClick.input?.function()
            document.getElementById("Content").removeEventListener('click', OutsideClick.handleOutsideClick)
        }
        return () => {
            document.getElementById("Content").removeEventListener("click", OutsideClick.handleOutsideClick)
        }
    }, [outsideClickInput])

    useEffect(() => {
        Block.buttonsDisabled = buttonsDisabled
        Block.statusButtonsDisabled = statusButtonsDisabled
        reRenderNavbar()
    }, [buttonsDisabled])

    useEffect(() => {
        Block.isAdmin = isAdmin
        Block.statusIsAdmin = statusIsAdmin
        reRenderNavbar()
        !isAdmin && !hideNav && OutsideClick.statusInput({id: "Sidebar",function: () => Navbar.statusHideNav(true) })
    }, [isAdmin])

    useEffect(() => {
        Navbar.hideNav = hideNav
        Navbar.statusHideNav = statusHideNav
        if ( !hideNav && !isAdmin ) {
            OutsideClick.statusInput({id: "Sidebar",function: () => Navbar.statusHideNav(true) })
        }  else {
            OutsideClick.statusInput()
        }
        return () => {
            OutsideClick.statusInput()
        }
    }, [hideNav])

    useEffect(() => {
        Item.editITEM = editITEM
        Item.statusEditITEM = statusEditITEM
        console.log("Item.editITEM.item, Item.editITEM.index")
        console.log(Item.editITEM?.item, Item.editITEM?.index)
        Item.editITEM && Item.renderInput(Item.editITEM?.item, Item.editITEM?.index)
    }, [editITEM])

    useEffect(() => {
        console.log("ADD", addITEM)
        Item.addITEM = addITEM
        Item.statusAddITEM = statusAddITEM
        statusReRenderItems(Item.renderItems(active))
    }, [addITEM])

    Block.positionsSet(Block.options, [])

    const reRenderNavbar = () => {
        statusRenderSideBar(Navbar.renderSideBar())
        statusRenderTopBar(Navbar.renderTopBar())
        statusRenderBottomBar(Navbar.renderBottomBar())
    }


    return (
        <div id="LogdNix">
            <div id="Sidebar" className={hideNav ? "hidden" : ""}>
                <button className={`hideSideBar ${hideNav ? "active" : ""}`} onClick={() => { statusHideNav(!hideNav) }}>
                    {hideNav ? (<i className="fa fa-chevron-right" aria-hidden="true"/>) : ( <i className="fa fa-chevron-left" aria-hidden="true"/>)} </button>
                {renderSideBar}
            </div>
            <div id="Main">
                <div id="TopBar">
                    {renderTopBar}
                    <button id="EditMode-button" disabled={Block.buttonsDisabled} className={isAdmin ? "active" : "inActivw"}
                            onClick={() => { statusIsAdmin(!isAdmin); }}>{isAdmin ? ("Admin") : ("User")}</button>
                </div>
                <div id="Content">
                    <h2>{active.name}</h2>
                    {reRenderItems}
                </div>
                <div id="BottomBar">
                    {renderBottomBar}
                </div>
            </div>
        </div>
    );
}

export default App;
