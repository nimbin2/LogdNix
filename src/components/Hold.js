import {Component} from "react";
import Navbar from "./Navbar";

class Hold extends Component {
    static hold
    static statusHold
    static holdLayout = true
    static statusHoldLayout

    static resetHold = (block) => {
        let hold = Hold.hold
        if (Hold.hold?.indexOf(block) !== -1) {
            hold.splice(Hold.hold.indexOf(block), 1)
            hold = [block, ...hold]
            Hold.statusHold(hold)
        }
        return hold
    }

    static isHold = (block) => {
        return Hold.hold?.indexOf(block) !== -1;
    }

    static toggleHold = (block) => {
        if (Hold.hold.indexOf(block) !== -1) {
            Hold.hold.splice(Hold.hold.indexOf(block), 1)
            Hold.statusHold([...Hold.hold])
        } else {
            Navbar.statusHideNav(false)
            Hold.statusHold([block, ...Hold.hold])
        }
    }
}

export default Hold