import {Component} from "react";

class OutsideClick extends Component {

    static input
    static statusInput

    static handleOutsideClick = (e) => {
        if (document.getElementById(OutsideClick.input.id) && !document.getElementById(OutsideClick.input.id).contains(e.target)) {
            OutsideClick.input.function()
            OutsideClick.statusInput()
        }
    }
}

export default OutsideClick