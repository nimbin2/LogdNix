import {Component} from "react";
import moment from "moment";
import NewestPosts from "./NewestPosts";

class Block extends Component {

    static options = [{
        name: "Home",
        blocks: [
            {
                name: "Mails",
                item: [{text: "1. Der erste satrz", date: "20211006132222"}, {text: "2. Der zweite satrz", date: "20211006135222"}, {text: "3. Der dritte satrz", date: "19870723154920"} ],
                blocks: [{
                    name: "FAQ"
                }, {
                    name: "Antwortblöcke"
                }, {
                    name: "Newsletter"
                }
                ]
            }, {
                name: "Positionen",
                blocks: [
                    {
                        name: "Kasse",
                        blocks: [
                            {
                                name: "Check-In"
                            }, {
                                name: "Check-Out"
                            }
                        ]
                    }, {
                        name: "Fenster",
                        blocks: [
                            {
                                name: "Check-In Pre",
                                item: [{text: "ITEM aiuwdsa sda sd asid ", date: "20240723154920"} ]
                            }, {
                                name: "Check-In Runner-Zettel"
                            }, {
                                name: "Routen drucken"
                            }, {
                                name: "Packen"
                            }
                        ]
                    }, {
                        name: "Runner",
                        blocks: [
                            {
                                name: "Vorbereitung"
                            }, {
                                name: "Routen"
                            }
                        ]
                    }
                ]
            }, {
                name: "Schichtplan",
                blocks: [
                    {
                        name: "Schichten ändern",
                    }, {
                        name: "Schichten anlegen",
                    }, {
                        name: "Schichtplan"
                    }
                ]
            }, {
                name: "Ordner"
            }]
    }]
    //static active = this.options[0]
    static active = this.options[0].blocks[1].blocks[1]
    static statusActive
    static editBLOCK
    static statusEditBLOCK
    static addBLOCK = []
    static statusAddBLOCK
    static buttonsDisabled
    static statusButtonsDisabled
    static isAdmin = true
    static statusIsAdmin

    static downloadObject(obj, filename){
        let blob = new Blob([JSON.stringify(obj, null, 2)], {type: "application/json;charset=utf-8"}) //.slice(2,-1);
        let url = URL.createObjectURL(blob);
        let elem = document.createElement("a");
        elem.href = url;
        elem.download = filename;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
    }

    static initListener = (e) => {
        if (document.getElementById("Hold") && document.getElementById("Hold").contains(e.target)) {
            document.getElementById("Hold")?.removeEventListener('click', Block.initListener)
            NewestPosts.statusHideNewest(true)
        }
    }

    static init() {
        document.getElementById('FileInput').addEventListener('change', this.handleFileSelect, false);
        document.getElementById("Hold")?.addEventListener('click', Block.initListener)
        document.getElementById("SideBar").getElementsByClassName("active")[0]?.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"})
    }

    static setDate(date) {
        return moment(date).format('YYYYMMDDHHmmss')
    }

    static formatDate(date) {
        return moment(date, 'YYYYMMDDhhmmss')
    }

    static checkDateToday(date) {
        return this.formatDate(date).isSame(new Date(), "day")
    }
    static checkDateYesterday(date) {
        return this.formatDate(date).isSame(moment(new Date()).subtract(1, 'days'), "day")
    }
    static getDate(date) {
        let isToday
        this.checkDateToday(date) ? isToday = "heute," : (this.checkDateYesterday(date) ? isToday = "gestern, " : isToday = "DD.MM.YY,")
        return this.checkDateToday(date) || this.checkDateYesterday(date) ? isToday + this.formatDate(date).format(` HH:mm`) : this.formatDate(date).format(`${isToday}, HH:mm`)

    }

    static handleFileSelect(event) {
        const reader = new FileReader()
        reader.onload = this.handleFileLoad;
        reader.readAsText(event.target.files[0])
    }

    static handleFileLoad(event) {
        let result = event.target.result
        this.options = JSON.parse(result)
        this.statusActive(this.options[0])
    }

    static checkPreActive = (block) => {
        return this.active.position === block.position ?  false : this.active.position.toString().startsWith(block.position.toString())
    }

    static checkActive = (block) => {
        return this.active.position === block.position
    }

    static position = (block) => {
        return block.position.pop()
    }
    static positionSet = (block, position) => {
        Object.assign(block, {position: position})
    }

    static positionsSet = (blocks, position) => {
        blocks.forEach((block, i) => {
            this.positionSet(block, [...position, i])
            block.blocks && this.positionsSet(block.blocks, [...position, i])
        })
    }

    static all = () => {
        let allBlocks = []
        const getBlocks = (blocks) => {
            blocks.forEach((block) => {
                allBlocks = [...allBlocks, block]
                block.blocks && getBlocks(block.blocks)
            })
        }
        getBlocks(this.options)
        return allBlocks
    }

    static parents = (block) => {
        let blocks = []
        block.position.forEach((i, c) => {
            block = c === 0 ? this.options[0] : block.blocks[i]
            blocks = [...blocks, block]
        })
        return blocks
    }

    static parent = (block) => {
        return this.parents(block).reverse()[1]
    }


    static add = (block, name) => {
        !block.blocks && Object.assign(block, {blocks: []})
        block.blocks.unshift({name: name})
        this.positionsSet(block.blocks, block.position)
        return block
    }

    static get = (position) => {
        let block
        position.forEach((i, c) => {
            block = c === 0 ? this.options[0] : block.blocks[i]
        })
        return block
    }

    static edit = (block, name) => {
        block.name = name
        return block
    }

    static remove = (block) => {
        this.statusActive(this.parent(block))
        return this.parent(block).blocks.splice(block.position.pop(), 1);
    }
}

export default Block;