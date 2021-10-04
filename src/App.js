import {useState, useEffect} from "react";
import '../node_modules/font-awesome/css/font-awesome.min.css';
import './App.css';
import Block from './components/Block'
import Navbar from './components/Navbar'
import OutsideClick from "./components/OutsideClick";


function App() {

    const [active, statusActive] = useState(Block.active)
    const [editBLOCK, statusEditBLOCK] = useState(Block.editBLOCK)
    const [addBLOCK, statusAddBLOCK] = useState(Block.addBLOCK)
    const [outsideClickId, statusOutsideClickId] = useState()
    const [renderSideBar, statusRenderSideBar] = useState()
    const [renderTopBar, statusRenderTopBar] = useState()
    const [renderBottomBar, statusRenderBottomBar] = useState()
    const [buttonsDisabled, statusButtonsDisabled] = useState(false)


    useEffect(() => {
        Block.active = active
        Block.statusActive = statusActive
        Block.active = active
        rerennderNavbar()
    }, [active])

    useEffect(() => {
        Block.editBLOCK = editBLOCK
        Block.statusEditBLOCK = statusEditBLOCK
        rerennderNavbar()
    }, [editBLOCK])

    useEffect(() => {
        Block.addBLOCK = addBLOCK
        Block.statusAddBLOCK = statusAddBLOCK
        Block.addBLOCK = addBLOCK
        rerennderNavbar()
    }, [addBLOCK])

    useEffect(() => {
        OutsideClick.id = outsideClickId
        OutsideClick.statusId = statusOutsideClickId

        if (OutsideClick.id) {
            document.getElementById("Content").addEventListener('click', OutsideClick.handleOutsideClick)
        } else {
            document.getElementById("Content").removeEventListener('click', OutsideClick.handleOutsideClick)
        }
        return () => {
            document.getElementById("Content").removeEventListener("click", OutsideClick.handleOutsideClick);
        }
    }, [outsideClickId])

    useEffect(() => {
        Block.buttonsDisabled = buttonsDisabled
        Block.statusButtonsDisabled = statusButtonsDisabled
        rerennderNavbar()
    }, [buttonsDisabled])


    Block.positionsSet(Block.options, [])

    const rerennderNavbar = () => {
        statusRenderSideBar(Navbar.renderSideBar())
        statusRenderTopBar(Navbar.renderTopBar())
        statusRenderBottomBar(Navbar.renderBottomBar())
    }



    return (
        <div id="LoggdNix">
            <div id="Sidebar">
                {renderSideBar}
            </div>
            <div id="Main">
                <div id="TopBar">
                    {renderTopBar}
                </div>
                <div id="Content">
                    <h2>{active.name}</h2>
                </div>
                <div id="BottomBar">
                    {renderBottomBar}
                </div>
            </div>
        </div>
    );
}

export default App;
