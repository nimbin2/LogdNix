import React, {Component} from "react";
import Block from "./Block";

class Navbar extends Component {

    static hideNav
    static statusHideNav

    static renderNavbarButton = (block ,canInput) => {
        return  <div className="navItem">
            {Block.editBLOCK === block && canInput ? (
                Block.renderEditName(block) ) : (
                <button disabled={Block.buttonsDisabled || Block.checkActive(block)} className={`navbarButton ${Block.checkPreActive(block) ? "preActive" : (Block.checkActive(block) ? "active" : "")}`}
                        onClick={() => Block.statusActive(block)}>{block.name}</button>
            )}
            {!Block.editBLOCK && Block.active === block && Block.renderEditButton(block)}
        </div>
    }

    static renderNavbar = (blocks, canInput) => (
        <ul>
            {blocks.map((block, i) => (
                <li key={i} className="navBlock list-group-item" id={`NavItem-${blocks[i].position.join("-")}`}>
                    {Navbar.renderNavbarButton(block, canInput)}

                    {Block.addBLOCK === block && (
                        <ul><li><div className="navItem">
                            {Block.renderAddBlock(block)}
                        </div></li></ul>
                    )}
                    {Block.active.position.toString().startsWith(block.position.toString()) && block.blocks && Navbar.renderNavbar(block.blocks, canInput)}
                </li>
            ))}
        </ul>
    )

    static renderTopBar = () => {
        return <ul>
            {Block.parents(Block.active).map((block, i) => <li key={i}>{Navbar.renderNavbarButton(block)}</li>)}
        </ul>
    }

    static renderSideBar = () => {
        return Navbar.renderNavbar(Block.options, true)
    }

    static renderBottomBar = () => {
        return <ul>
            {Block.active.blocks?.map((block, i) => <li key={i}>{Navbar.renderNavbarButton(block)}</li>)}
        </ul>
    }
}

export default Navbar