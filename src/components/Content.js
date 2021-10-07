import {Component, Fragment} from "react";
import Item from "./Item";
import Block from "./Block";
import Hold from "./Hold";
import NewestPosts from "./NewestPosts";

class Content extends Component {

    static content = (block) => {
        return <div key={block.position} className="content-block">
            <div className="header">
                <button disabled={Block.buttonsDisabled} className={`button-hold ${Hold.isHold(block) ? "active" : "inactive"} `} onClick={() => {
                    Hold.toggleHold(block)}}>
                    <h2>{block.name}</h2>
                </button>
            </div>
            {Item.renderItems(block)}
        </div>
    }


    static renderContent = () => (
        <Fragment>
            <div className="holding-nav">
                <ul>
                    {Hold.hold?.map((block, i) => {
                        return <li key={i}>
                            <button disabled={Block.buttonsDisabled || Block.active === block}
                                onClick={() => {
                                    let hold = Hold.hold
                                    !Hold.isHold(Block.active) && hold.splice(hold.indexOf(block), 1)
                                    !Hold.isHold(Block.active) && Hold.statusHold([block, Block.active, ...hold])
                                    Block.statusActive(block)
                                }}>{block.name}</button>
                        </li>
                    })}
                    {Hold.hold?.length > 0 && (
                        <li><button onClick={() => Hold.statusHoldLayout(!Hold.holdLayout)}>{Hold.holdLayout ? "50%" : "100%"}</button></li>
                    )}
                </ul>
            </div>
            <div id="Hold" className="content">
                {this.content(Block.active)}
                {Hold.hold?.map((block, i) => {
                    return Block.active !== block &&  <Fragment key={i}>
                        {this.content(block)}
                    </Fragment>
                })}
            </div>
            {NewestPosts.renderNewestItems()}
        </Fragment>
    )
}

export default Content