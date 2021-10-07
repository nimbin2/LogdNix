import {Component} from "react";
import Item from "./Item";
import OutsideClick from "./OutsideClick";
import Block from "./Block";
import Navbar from "./Navbar";

class NewestPosts extends Component {
    static hideNewest = false
    static statusHideNewest

    static newestItems = (amount) => {
        return Item.all().slice(0, amount)
    }

    static renderNewestItems = () => {
        return <div id="Newest-Items" className={`content-block ${NewestPosts.hideNewest ? "inactive" : "active"}`}>
            <h2>Neue Beiträge</h2>
            <div>
                <button onClick={() => {
                    this.hideNewest && OutsideClick.statusInput({ id: "Newest-Items", function: () => NewestPosts.statusHideNewest(true), mainId: "Hold"})
                    this.statusHideNewest(!this.hideNewest)
                }} className="hide"><i className={`fa fa-chevron-${this.hideNewest ? "up" : "down"}`} aria-hidden="true"/></button>
                {this.newestItems().map((data, i) => {
                    let block = data[1]
                    let item = data[0]
                    let title = block.name
                    return <div key={i} className="item">
                        <button onClick={() => Block.statusActive(block)}/>
                        <h3>{title}</h3>
                        {Item.renderItem(block, item, i)}
                    </div>
                })}
            </div>
        </div>
    }
}

export default NewestPosts