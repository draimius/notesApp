export default class NotesView {
  //root referce to the div with app id
  constructor(
    root,
    //we destructure so that we can directly grab each of those value (function , var, ect..) for whatever obj is passed in
    { onNoteSelect, onNoteAdd, onNoteEdit, onNoteDelete } = {}
  ) {
    //passed in from main obj of methods and var refrenced here for use withing this class
    this.root = root;
    this.onNoteSelect = onNoteSelect;
    this.onNoteAdd = onNoteAdd;
    this.onNoteEdit = onNoteEdit;
    this.onNoteDelete = onNoteDelete;
    this.root.innerHTML = `
        <div class="notes__sidebar">
            <button class="notes__add" type="button">Add Note</button>
            <div class="notes__list"></div>
        </div>
        <div class="notes__preview">
            <input class="notes__title" type="text" placeholder="New Note..." />
            <textarea class="notes__body" placeholder="Take Note..."></textarea>
        </div>
        `;

    const btnAddNote = this.root.querySelector('.notes__add');
    const inpTitle = this.root.querySelector('.notes__title');
    const inpBody = this.root.querySelector('.notes__body');

    btnAddNote.addEventListener('click', () => {
      this.onNoteAdd();
    });
    //blur fires when element has lost focus
    [inpTitle, inpBody].forEach((inputField) => {
      inputField.addEventListener('blur', () => {
        //trim removes all white space both ends
        const updatedTitle = inpTitle.value.trim();
        const updatedBody = inpBody.value.trim();

        this.onNoteEdit(updatedTitle, updatedBody);
      });
    });
    //TODO: hide the note preview by default**
    //make it so by default right side visibility is off till note item is created/edit???
    this.updateNotePreviewVisibility(false);
  }
  //using _ to denote its a privite method(what does that mean?)
  _createListItemHTML(id, title, body, update) {
    //creates the html string for sidebar item
    const MAX_BODY_LENGTH = 60; //max length befire we just '...' 60char... no char displayed after 60thcahr
    //use data atribute to track/locate find the specified its
    //--we do substring to apply the max length to go from 0 to 60 max for char(string index)
    //---then checks if the length is greater than max add the ... else dont
    //---updated will be object with value we do to toLocale string (null, {setting new Date() value to what we want}) we only want 2nd param
    return `
        <div class="notes__list-item" data-note-id="${id}">
            <div class="notes__small-title">${title}</div>
            <div class="notes__small-body">
            ${body.substring(0, MAX_BODY_LENGTH)}
            ${body.length > MAX_BODY_LENGTH ? '...' : ''}
            </div>
            <div class="notes__small-updated">
            ${update.toLocaleString('en-US', {
              dateStyle: 'full',
              timeStyle: 'short',
            })}
            </div>
        </div>
    `;
  }

  //notes = an array of obj note objs
  updateNoteList(notes) {
    const notesListContainer = this.root.querySelector('.notes__list');

    //empty list(clear)
    notesListContainer.innerHTML = '';

    for (const note of notes) {
      const html = this._createListItemHTML(
        note.id,
        note.title,
        note.body,
        //for timestamp update we create a new Date instance passing in the (note.update) what's its value rn????
        new Date(note.updated)
      );
      //inserting adjacent to what? before the the notesListContainer above (figured would go inside it not above it??)
      notesListContainer.insertAdjacentHTML('beforeend', html);
    }

    //add selct/delete events for each list item
    //we want to select the item not the whole note just the item poirtion
    notesListContainer
      .querySelectorAll('.notes__list-item')
      .forEach((noteListItem) => {
        noteListItem.addEventListener('click', () => {
          //id comes from the html data attribute previously set(this way we have access to the note items individaul id)
          //note from html to here in dataset (get converted to camelCase so
          this.onNoteSelect(noteListItem.dataset.noteId);
        });
        //interesting here adding an event listener to something reached in the first event addint the item particularly
        //because its already being been used it exist as a variable and i dont have to go in a grab all then again
        //if how i think it is didnt have to refrence because all in one 'fuction' its in scope
        noteListItem.addEventListener('dblclick', () => {
          const doDelete = confirm(
            'are you sure you want to delete this note?'
          );
          if (doDelete) {
            this.onNoteDelete(noteListItem.dataset.noteId);
          }
        });
      });
  }
  //must be doing somethign before this to get to the single note out of all notes
  //takes in just one note the note selected
  updateActiveNote(note) {
    //highlight preview when selected
    //also display whole note in the right display shoeing whole title and body ect...
    // update input field(title section) to the value(title) of the active note

    this.root.querySelector('.notes__title').value = note.title;
    this.root.querySelector('.notes__body').value = note.body;

    //remove class from any item (if previously selected removed to select new and only diplay highlight on that one)
    this.root.querySelectorAll('.notes__list-item').forEach((noteListItem) => {
      noteListItem.classList.remove('notes__list-item--selected');
    });

    this.root
      .querySelector(`.notes__list-item[data-note-id="${note.id}"]`)
      .classList.add('notes__list-item--selected');
  }

  updateNotePreviewVisibility(visible) {
    this.root.querySelector('.notes__preview').style.visibility = visible
      ? 'visible'
      : 'hidden';
  }
}
