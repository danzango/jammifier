# jammifier

## https://jammifier.pythonanywhere.com/

An app to jam to your favorite songs and learn some music theory!

From the main page:
- Click on the wheel menu to select a major key and view its different modes
- Or type in a song name and click on it. This will take you to the key and its relative major/minor for the song

When viewing a key / song:
- Click on the different modes to view the scales on the fretboard
- Click on the chords to view their shapes on the fretboard
- Use the drop-down to view the scales/chords in different instruments (Guitar, Guitar (Drop D ), Ukulele, Bass)
- Play the song directly from this page

## About
- Uses Django for the backend
- Uses mingus to get relative keys, scales, and chords: https://bspaans.github.io/python-mingus/
- Uses spotipy to search for songs and get predicted keys for songs: https://spotipy.readthedocs.io/en/2.19.0/
- Uses Javascript to display a fretboard for different instruments, and show different scales and chords on the fretboard3

