import React, {Component} from "react";
import Block from "./block/Block";
import RenderBlock from "./block/RenderBlock";
import NewestPosts from "./NewestPosts";

class Navbar extends Component {

    static hideNav
    static statusHideNav
    static expandNav
    static statusExpandNav
    static sideBarIsScrollable
    static statusSideBarIsScrollable
    static expandBUTTON
    static statusExpandBUTTON
    static statusSideBarWidth
    static sideBarWidth

    static init = () => {
        this.statusSideBarIsScrollable(this.getSideBarIsScrollable())
        document.getElementById("ActiveNav")?.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"})
        console.log("UUU", document.getElementById("ActiveNav"))
        console.log(Navbar.expandNav, Navbar.sideBarIsScrollable, Navbar.getSideBarIsScrollable().toString())
    }

    static getSideBarIsScrollable = () => {
        let scroll = document.getElementById("SideBar-Content")?.scrollWidth
        let client = document.getElementById("SideBar-Content")?.clientWidth
        return scroll > client
    }

    static renderExpandButton = () => {
        return <button disabled={Block.buttonsDisabled} className={`expandSideBar ${this.getSideBarIsScrollable && !this.hideNav ? "active" : ""}`}
                    onClick={() => { this.hideNav && this.statusHideNav(false); this.statusExpandNav(!this.expandNav)}}>
                {this.expandNav ? (<i className="fa fa-chevron-left" aria-hidden="true"/>) : ( <i className="fa fa-chevron-right" aria-hidden="true"/>)}
            </button>}

    static renderNavbarButton = (block ,canInput) => {
        return  <div className="navItem">
            {Block.editBLOCK === block && canInput ? (
                RenderBlock.renderEditName(block) ) : (
                <button disabled={Block.buttonsDisabled || Block.checkActive(block)} className={`navbarButton ${Block.checkPreActive(block) ? "preActive" : (Block.checkActive(block) ? "active" : "")}`}
                        onClick={(e) => {
                            Block.statusActive(block)
                            document.getElementById("ActiveNav")?.removeAttribute("id")
                            NewestPosts.statusHideNewest(true)
                            e.target.id = "ActiveNav"
                            console.log(block.position)
                        }}>{block.name}</button>
            )}
            {!Block.editBLOCK && Block.active === block && RenderBlock.renderEditButton(block)}
        </div>
    }

    static renderNavbar = (blocks, canInput) => (
        <ul>
            {blocks.map((block, i) => (
                <li key={i} className="navBlock list-group-item" id={`NavItem-${blocks[i].position.join("-")}`}>
                    {this.renderNavbarButton(block, canInput)}

                    {Block.addBLOCK === block && (
                        <ul><li><div className="navItem">
                            {RenderBlock.renderAddBlock(block)}
                        </div></li></ul>
                    )}
                    {Block.active.position.toString().startsWith(block.position.toString()) && block.blocks && this.renderNavbar(block.blocks, canInput)}
                </li>
            ))}
        </ul>
    )

    static renderTopBar = () => {
        return <div className="items"><ul>
            {Block.parents(Block.active).map((block, i) => <li key={i}>{this.renderNavbarButton(block)}</li>)}
        </ul></div>
    }

    static renderSideBar = () => {
        return this.renderNavbar(Block.options, true)
    }

    static renderBottomBar = () => {
        return <ul>
            {Block.active.blocks?.map((block, i) => <li key={i}>{this.renderNavbarButton(block)}</li>)}
        </ul>
    }
}

export default Navbar