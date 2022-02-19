import NotesView from './NotesViews.js';
import NoteAPI from './NotesAPI.js';

//tie everything together similar to main but more detailed and structured
export default class App {
  constructor(root) {
    this.notes = [];
    this.activeNote = null;
    //call handlers to have then initialize and accisible and properties
    this.view = new NotesView(root, this._handlers());

    this._refreshNodes();
  }
  //denote its a private method
  //stores the methods
  _handlers() {
    return {
      //return and writen like this makes them dificult to or not accessible as just function
      //--no way to refrence to any of them instead, want to pass in like so
      //   onNoteSelect(noteId) {},
      //   onNoteAdd() {},
      //   onNoteEdit(newTitle, newBody) {},
      //   onNoteDelete(noteId) {},
      //**where function name: = the key and funciton as arrow just (arg) =>{actions} as the value
      //--this way can refrence access and utilize all with ease
      onNoteSelect: (noteId) => {
        //find the note in the list with matching id  (****why did === to == make all the difference???????*******)
        const selectedNote = this.notes.find((note) => note.id == noteId);
        this._setActiveNote(selectedNote);
      },
      //its like you build it for the edit inset vs adding
      //--- (where if build for edit insert add a param and now serves as adding new aswell clever )
      onNoteAdd: () => {
        const newNote = {
          title: '',
          body: '',
        };
        NoteAPI.saveNote(newNote);
        this._refreshNodes();
      },
      onNoteEdit: (title, body) => {
        NoteAPI.saveNote({
          id: this.activeNote.id,
          title,
          body,
        });
        this._refreshNodes();
      },
      onNoteDelete: (noteId) => {
        NoteAPI.deleteNote(noteId);
        this._refreshNodes();
      },
    };
  }
  _refreshNodes() {
    const notes = NoteAPI.getAllNotes();
    this._setNotes(notes);
    if (notes.length > 0) {
      //always the firts note (as when we get all note sort then for the most recet done/edited note first)
      this._setActiveNote(notes[0]);
    }
  }
  _setNotes(notes) {
    //intended to call the ui to whats visible there then show our notes
    // keeps a regrence to the current list of notes
    this.notes = notes;
    this.view.updateNoteList(notes);
    //only make visibility true when at least one note exist else stay hidden
    //---though instead of passing in hard code value like true we pass in an eval (dynamic)
    this.view.updateNotePreviewVisibility(notes.length > 0);
  }
  //
  _setActiveNote(note) {
    this.activeNote = note;
    //this.view  is an instence of NoteView(that was imported from NoteView)
    //--so here we refrence a method that exist within the NoteView
    this.view.updateActiveNote(note);
  }
}

//these _function alsomost here acting like an axilary for the function in the api where just function herer
//-calling a different function (does store and make availible here in this class ect..)
