import {Component, Fragment} from "react";
import Item from "./Item";
import Block from "./Block";

class Content extends Component {

    static content = (block) => {
        return <div key={block.position} className="content-block">
            <div className="header">
                <button disabled={Block.buttonsDisabled} className={`button-hold ${Block.isHold(block) ? "active" : "inactive"} `} onClick={() => {
                    Block.toggleHold(block)}}>
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
                    {Block.hold?.map((block, i) => {
                        return <li key={i}>
                            <button disabled={Block.buttonsDisabled || Block.active === block}
                                onClick={() => {
                                    let hold = Block.hold
                                    !Block.isHold(Block.active) && hold.splice(hold.indexOf(block), 1)
                                    !Block.isHold(Block.active) && Block.statusHold([block, Block.active, ...hold])
                                    Block.statusActive(block)
                                }}>{block.name}</button>
                        </li>
                    })}
                    {Block.hold?.length > 0 && (
                        <li><button onClick={() => Block.statusHoldLayout(!Block.holdLayout)}>{Block.holdLayout ? "50%" : "100%"}</button></li>
                    )}
                </ul>
            </div>
            <div id="Hold" className="content">
                {Content.content(Block.active)}
                {Block.hold?.map((block, i) => {
                    return Block.active !== block &&  <Fragment key={i}>
                        {Content.content(block)}
                    </Fragment>
                })}
            </div>
        </Fragment>
    )
}

export default Content