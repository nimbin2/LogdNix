import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Block from "../block/Block";
import Item from "./Item";


class Text extends Comment {
    static editorInput
    static statusEditorInput


    static createEditor = (data) => {
        ClassicEditor.create( document.querySelector('#editor'), {
            toolbar: ['heading', '|', 'bold', 'italic', 'link', '|', 'fontColor', 'fontBackgroundColor', '|', 'alignment', 'bulletedList', 'numberedList', 'blockQuote', 'outdent', 'indent', '|', 'insertTable', '|', 'undo', 'redo'],
            language: "de"
        }).then( editor => {
            Item.editITEM?.item.text && editor.setData(data);
            this.statusEditorInput(editor)
        } )
            .catch( error => {
                console.error( error );
            } );
    }

    static renderText = (item) => {
        return <div dangerouslySetInnerHTML={{__html: item.text}}/>
    }

    static renderAddText = (block) => {
        return <div className="button-add-container">
            {((Block.isAdmin && Item.addITEM?.block !== block) || Item.editITEM) && (
                <button disabled={Item.addITEM} className={`btn button-addItem`} onClick={() => {
                    Item.renderInput(block);
                }}><i className="fa fa-plus" aria-hidden="true"/></button>
            )}
        </div>
    }
}
export default Text