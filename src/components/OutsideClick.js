import {Component} from "react";

class OutsideClick extends Component {

    static id
    static statusId
    static closeFunction

    static handleOutsideClick = (e) => {
        if (document.getElementById(OutsideClick.id) && !document.getElementById(OutsideClick.id).contains(e.target)) {
            OutsideClick.statusId(false);
        }
    }
}

export default OutsideClick