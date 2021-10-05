import {Component} from "react";

class OutsideClick extends Component {

    static input

    static handleOutsideClick = (e) => {
        OutsideClick.input.function()
        /*
        if (document.getElementById(OutsideClick.input.id) && !document.getElementById(OutsideClick.input.id).contains(e.target)) {
            OutsideClick.input.function()
        }*/
    }
}

export default OutsideClick