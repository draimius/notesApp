export default class NoteAPI {
  static getAllNotes() {
    //go to local storage returh them else if none return empty array
    const notes = JSON.parse(localStorage.getItem('noteapp-notes') || '[]');

    //takes notes and sorts( if a > b return -1 else return 1  (does that serve as an index in notes array???))
    return notes.sort((a, b) => {
      //order note to most recent ontop always
      return new Date(a.updated) > new Date(b.updated) ? -1 : 1;
    });
  }

  static saveNote(noteToSave) {
    //id and time be added here
    //also takes in the title and body
    const notes = NoteAPI.getAllNotes();
    //checking the existing notes array contians id of note passed in (if already exist then its an edit not new )
    const existing = notes.find((note) => note.id == noteToSave.id);

    if (existing) {
      //update the title from exitign to the new title, body and new time stap
      existing.title = noteToSave.title;
      existing.body = noteToSave.body;
      existing.updated = new Date().toISOString();

      //if dosent exist we insert the new note
    } else {
      noteToSave.id = Math.floor(Math.random() * 1000000);
      //generate new time stap and set date value (thing here is setting keys but dont see obj defined explicitly??)
      //-jits becuase the thing we are passing in is an object itself
      noteToSave.updated = new Date().toISOString();

      notes.push(noteToSave);
    }
    //then reseting the value of 'notesapp-note' we pulled notes from (overwrites our existing entry)
    localStorage.setItem('noteapp-notes', JSON.stringify(notes));
    //set the selected item key/value to json stringigy of new notes(added to arr)
  }

  static deleteNote(id) {
    const notes = NoteAPI.getAllNotes();
    const newNotes = notes.filter((note) => note.id != id);
    //if not found then what???? //probaly simply way to prevent cant slect if dont exist
    //if not found just return the same value already had anyways no change
    //basically reasigns the arr value of the key'noteapp-notes
    localStorage.setItem('noteapp-notes', JSON.stringify(newNotes));
  }
}
