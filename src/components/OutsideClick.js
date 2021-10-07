import {Component} from "react";

class OutsideClick extends Component {

    static input
    static statusInput

    static handleOutsideClick = (e) => {
        if (document.getElementById(this.input.id) && !document.getElementById(this.input.id).contains(e.target)) {
            this.input.function()
            this.statusInput()
        }
    }
}

export default OutsideClick