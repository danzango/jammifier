const root = document.documentElement;

const fretboard = document.querySelector('.fretboard');
const selectedInstrumentSelector = document.querySelector('#instrument-selector');
const accidentals = document.querySelector('.accidentals').getAttribute('data-accidentals');
const singleFretMarkPositions = [3, 5, 7, 9, 15, 17, 19, 21];
const doubleFretMarkPositions = [12, 24];
const notesFlat = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
const notesSharp = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
// const noteOpacity = 0;
const instrumentTuningPresets = {
    'Guitar': [4, 11, 7, 2, 9, 4],
    'Guitar (drop D)': [4, 11, 7, 2, 9, 2],
    'Bass': [7, 2, 9, 4],
    'Ukulele': [9, 4, 0, 7]
};
const numberOfFretsSelector = document.querySelector('#number-of-frets');
const showAllNotesSelector = document.querySelector('#show-all-notes');
const showMultipleNotesSelector = document.querySelector('#show-multiple-notes');
const scaleSelector = document.querySelectorAll('.tablinks');
const chordSelector = document.querySelectorAll('.chord-button');
const scaleContainers = document.querySelectorAll('.block_containers');
const scaleColors = ["#FF6663", "#FEB144", "#FDDD5C", "#9EE09E", "#9EC1CF", "#8686AF", "#CC99C9","#FF6663"];

let allNotes;
let showMultipleNotes = false;
let selectedInstrument = 'Guitar';
let numberOfStrings = instrumentTuningPresets[selectedInstrument].length;
let numberOfFrets = 15;



const app = {
    init() {
        this.setupFretboard();
        this.setupEventListeners();
        this.setupSelectedInstrumentSelector();
    },
    setupFretboard() {

        fretboard.innerHTML = '';
        root.style.setProperty('--number-strings', numberOfStrings);
        // root.style.setProperty('--note-opacity', noteOpacity);

        //Add strings
        for (let i = 0; i < numberOfStrings; i++) {
            let string = tools.createElement('div');
            string.classList.add('string');
            fretboard.appendChild(string);

            // Add frets
            for (let fret = 0; fret <= numberOfFrets; fret++) {
                let noteFret = tools.createElement('div');
                noteFret.classList.add('note-fret');
                string.appendChild(noteFret);

                let noteName = this.generateNoteNames((fret + instrumentTuningPresets[selectedInstrument][i]), accidentals);
                noteFret.setAttribute('data-note', noteName);

                //Add fret numbers
                noteFret.setAttribute('data-fret', fret);

                if (i === 0 && singleFretMarkPositions.indexOf(fret) !== -1) {
                    noteFret.classList.add('single-fretmark');
                }

                if (i === 0 && doubleFretMarkPositions.indexOf(fret) !== -1 ) {
                    let doubleFretmark = tools.createElement('div');
                    doubleFretmark.classList.add('double-fretmark');
                    noteFret.appendChild(doubleFretmark);
                }


                let string_num = i + 1;
                noteFret.setAttribute('data-string', string_num);

            }
            // Add last string ID
            if (i + 1 == numberOfStrings) {
                string.setAttribute("id", "last-string");
            }
        }
        allNotes = document.querySelectorAll('.note-fret');
    },
    generateNoteNames(noteIndex, accidentals) {
        noteIndex = noteIndex % 12;
        let noteName;
        if (accidentals === 'flats') {
            noteName = notesFlat[noteIndex];
        } else if (accidentals === 'sharps') {
            noteName = notesSharp[noteIndex];
        }
        return noteName;
    },
    setupSelectedInstrumentSelector() {
        for (instrument in instrumentTuningPresets){
            let instrumentOption = tools.createElement('option', instrument);
            selectedInstrumentSelector.appendChild(instrumentOption);
        }
    },
    showNoteDot(event) {
        if (event.target.classList.contains('note-fret')) {
            if (showMultipleNotes) {
                app.toggleMultipleNotes(event.target.dataset.note, 1);
            }
            else {
                event.target.style.setProperty('--note-opacity', 1);
            }
        }
    },
    hideNoteDot(event) {
        if (showMultipleNotes) {
            app.toggleMultipleNotes(event.target.dataset.note, 0);
        }
        else {
            event.target.style.setProperty('--note-opacity', 0);
        }
    },
    setupEventListeners() {

        fretboard.addEventListener("mouseover", this.showNoteDot);
        fretboard.addEventListener("mouseout", this.hideNoteDot);

        selectedInstrumentSelector.addEventListener("change", (event) => {
            selectedInstrument = event.target.value;
            numberOfStrings = instrumentTuningPresets[selectedInstrument].length;
            this.setupFretboard();

            openScale(event, 'Ionian');
            this.buildScale('ion_scale');
            document.querySelector('data')
            document.querySelector('[data-scale="ion_scale"]').classList.add('active')
        });

        numberOfFretsSelector.addEventListener('change', (event) => {
            numberOfFrets = numberOfFretsSelector.value;
            this.setupFretboard();
        });

        showAllNotesSelector.addEventListener('change', () => {
            if (showAllNotesSelector.checked) {
                root.style.setProperty('--note-opacity', 1);
                fretboard.removeEventListener("mouseover", this.showNoteDot);
                fretboard.removeEventListener("mouseout", this.hideNoteDot);
                this.setupFretboard();
            } else {
                root.style.setProperty('--note-opacity', 0);
                fretboard.addEventListener("mouseover", this.showNoteDot);
                fretboard.addEventListener("mouseout", this.hideNoteDot);
                this.setupFretboard();
            }
        });

        showMultipleNotesSelector.addEventListener('change', () => {
           showMultipleNotes = !showMultipleNotes;
        });

        for (const button of scaleSelector) {
          button.addEventListener('click', (event) => {
           scale = event.target.getAttribute('data-scale');
           this.buildScale(scale);
        });
        }

        document.addEventListener("DOMContentLoaded", () => {
            document.querySelectorAll('.chord-button').forEach(button => {
                button.onclick = function() {
                    notes = this.dataset.notes;
                    app.buildChord(notes);
            }
            })
        });

        document.addEventListener("DOMContentLoaded", () => {
          openScale(event, 'Ionian');
          this.buildScale('ion_scale');
          document.querySelector('data')
          document.querySelector('[data-scale="ion_scale"]').classList.add('active')
        });

        document.addEventListener("DOMContentLoaded", () => {
                this.loadTrack();
        });
    },
    toggleMultipleNotes(noteName, opacity) {
        for (let i = 0; i < allNotes.length; i++) {
            if (allNotes[i].dataset.note === noteName) {
                allNotes[i].style.setProperty('--note-opacity', opacity)
            }
        }
    },
    findBaseFret(note) {
        const stringSelector = document.querySelector('#last-string');

        let fretNum = 0;
        let array = Array.from(stringSelector.childNodes);

        for (let i=0; i < array.length; i++) {
            if (array[i].dataset.note === note) {
                fretNum = array[i].dataset.fret;

                if (fretNum == 0) {
                    // Otherwise E major gets messed up
                    fretNum = fretNum + 12;
                }

                return fretNum;
            }
        }
    },
    findBaseNote(note) {
        let baseNote = 0;
        for (let i = 0; i < allNotes.length; i++) {
                if (allNotes[i].dataset.note === note) {
                    baseNote = i;
                    return baseNote;
                }
        }
    },
    buildScale (scale) {
        showMultipleNotes = false;
        this.setupFretboard();
        fretboard.removeEventListener("mouseout", this.hideNoteDot);
        fretboard.removeEventListener("mouseover", this.showNoteDot);

        scaleContainers.forEach(function(scale){
           scale.style.visibility = "hidden";
        });

        mode_scale = document.getElementById(scale).innerHTML;
        mode_scale = mode_scale.replace(/[\[\]']+/g,'');
        mode_scale = mode_scale.split(" ").join("")
        mode_scale = mode_scale.split(',');
        startingFret = this.findBaseFret(mode_scale[0]);
        startingFret = parseInt(startingFret);
        console.log('starting fret:', startingFret);
        let startingIndex = this.findBaseNote(mode_scale[0]);

        // Need to print only notes 1 fret to the left and 3 to the right at most
        for (let i = 0; i < allNotes.length; i++) {
            for (let j = 0; j < mode_scale.length; j++){
                if (allNotes[i].dataset.note === mode_scale[j]) {
                    if (j === 0) {
                        if (allNotes[i].dataset.fret <= (startingFret + 3) && allNotes[i].dataset.fret >= startingFret - 1){
                            allNotes[i].style.setProperty('--fret-before-background', scaleColors[j]);
                            allNotes[i].style.setProperty('--note-opacity', 1);
                    }
                    }
                    else if (allNotes[i].dataset.fret <= (startingFret + 3) && allNotes[i].dataset.fret >= (startingFret - 1)){
                        allNotes[i].style.setProperty('--fret-before-background', scaleColors[j]);
                        allNotes[i].style.setProperty('--note-opacity', 1);
                    }
                }
            }
        }
    },
    buildChord (chord) {
        showMultipleNotes = false;
        this.setupFretboard();
        fretboard.removeEventListener("mouseout", this.hideNoteDot);
        fretboard.removeEventListener("mouseover", this.showNoteDot);

        chord = chord.replace(/[\[\]']+/g,'');
        chord = chord.split(" ").join("")
        chord = chord.split(',');
        startingFret = this.findBaseFret(chord[0]);
        startingFret = parseInt(startingFret);
        console.log(chord);

        for (let i = 0; i < allNotes.length; i++) {
            for (let j = 0; j < chord.length; j++){
                if (allNotes[i].dataset.note === chord[j]) {
                    //parse string as num
                    stringNum = parseInt(allNotes[i].dataset.string);

                    if (chord.length === 3){
                        // Chord is a triad
                        if (stringNum > 2 && (allNotes[i].dataset.fret <= (startingFret + 2) && allNotes[i].dataset.fret >= startingFret)) {
                            allNotes[i].style.setProperty('--fret-before-background', scaleColors[j]);
                            allNotes[i].style.setProperty('--note-opacity', 1);
                        }
                    }
                    if (chord.length === 4){
                        // Chord is a 7th
                        if (stringNum > 1 && (allNotes[i].dataset.fret <= (startingFret + 1) && allNotes[i].dataset.fret >= startingFret)) {
                            allNotes[i].style.setProperty('--fret-before-background', scaleColors[j]);
                            allNotes[i].style.setProperty('--note-opacity', 1);
                        }
                    }
                }
            }
        }
    },
    loadTrack() {
        // Retrieve the object from storage
        if (localStorage.getItem('trackUrn') === null) {
            document.getElementById("trackDiv").classList.add('display-none');
        } else {
            var retrievedObject = localStorage.getItem('trackUrn');
            console.log(retrievedObject);
            var parsedData = JSON.parse(retrievedObject);
            console.log(parsedData.urn)
            let href = 'https://open.spotify.com/embed/track/' + parsedData.urn;
            document.getElementById("trackFrame").src = href;
            document.querySelector(".settings").classList.add('move-down');
            document.getElementById("title").classList.add('move-down');
            document.getElementById("trackDiv").classList.remove('display-none');
            localStorage.removeItem('trackUrn')
        }
    }
};

const tools = {
    createElement(element, content) {
        element = document.createElement(element);
        if (arguments.length > 1) {
            element.innerHTML = content;
        }
        return element;
    }

};

app.init();