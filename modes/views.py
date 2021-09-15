from django.shortcuts import render
import mingus.core.scales as scales
import mingus.core.keys as keys
import mingus.core.progressions as progressions
import mingus.core.chords as chords
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from django.http import HttpResponseRedirect, HttpResponse
from django.urls import reverse
from django.shortcuts import redirect
import urllib
import json

keySigMapping = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B']
# minor keys have the same index in this list as their relative have above. This should probably be implemented as a Dict
minorMajorMapping = ['A','Bb','B','C','C#','D','Eb','E','F','Gb','G','G#']
modeMapping = ['minor', 'major']
classicProgression = ["I","ii","iii","IV","V","vi","viidim"]
jazzProgression = ["I7","ii7","iii7","IV7","Vdom7","vi7","vii7b5"]


class Track:
    def __str__(self):
        return self.name + ' by ' + self.artist
    name = ''
    artist = ''
    key = ''
    mode = ''
    img = ''
    urn = ''

class Chord:
    def __str__(self):
        return self.shorthand
    shorthand = ''
    notes = []

def index(request):
    return render(request, "modes/index.html")

def getMode(request, root):

    if (keys.is_valid_key(root)):
        rootNote = root
        base_scale = keys.get_notes(rootNote)
        ion_scale = scales.Ionian(base_scale[0]).ascending()
        dor_scale = scales.Dorian(base_scale[1]).ascending()
        phr_scale = scales.Phrygian(base_scale[2]).ascending()
        lyd_scale = scales.Lydian(base_scale[3]).ascending()
        mix_scale = scales.Mixolydian(base_scale[4]).ascending()
        aeo_scale = scales.Aeolian(base_scale[5]).ascending()
        loc_scale = scales.Locrian(base_scale[6]).ascending()
        minor = keys.relative_minor(rootNote)

        if root in ['G', 'D', 'A', 'E', 'B']:
            accidentals = 'sharps'
        else:
            accidentals = 'flats'

        classic_chords = progressions.to_chords(classicProgression, root)
        jazz_chords = progressions.to_chords(jazzProgression, root)

        classic_chords_list = []
        jazz_chords_list = []
        for chord in classic_chords:
            new_chord = Chord()
            new_chord.notes = chord
            new_chord.shorthand = chords.determine_triad(chord, shorthand=True, no_inversions=True)[0]
            classic_chords_list.append(new_chord)
        for chord in jazz_chords:
            new_chord = Chord()
            new_chord.notes = chord
            new_chord.shorthand = chords.determine_seventh(chord, shorthand=True, no_inversion=True)[0]
            jazz_chords_list.append(new_chord)

        return render(request, "modes/scale.html", {
            "root": root,
            "minor": minor,
            "ion_scale": ion_scale,
            "dor_scale": dor_scale,
            "phr_scale": phr_scale,
            "lyd_scale": lyd_scale,
            "mix_scale": mix_scale,
            "aeo_scale": aeo_scale,
            "loc_scale": loc_scale,
            "accidentals": accidentals,
            "classic_chords": classic_chords_list,
            "jazz_chords": jazz_chords_list
        })
    else:
        return render(request, "modes/error.html", {
            "message": "That key does not exist."
        })

def redirect_params(url, params=None):
    response = redirect(url)
    if params:
        query_string = urllib.urlencode(params)
        response['Location'] += '?' + query_string
    return response

def song(request, track_id):
    # Track id for landslide: 5ihS6UUlyQAfmp48eSkxuQ
    # Key for landslide: Eb major
    # Loving is easy: 5EYi2rH4LYs6M21ZLOyQTx
    # Pinegrove: 6m1vXqsfgF4p0mvxzQ1eQA

    sp = spotipy.Spotify(client_credentials_manager=SpotifyClientCredentials(client_id='0fbfe9612d1e4314a63dd1a1203f8054',
                                                                             client_secret='45ffeacde8d04221bb287876f504a238'))
    urn = 'spotify:track:' + track_id
    song_details = sp.audio_analysis(urn)
    artist_info = sp.track(urn)

    track = Track()
    track.key = keySigMapping[song_details["track"]["key"]]
    track.mode = modeMapping[song_details["track"]["mode"]]
    track.artist = artist_info["artists"][0]["name"]
    track.name = artist_info["name"]

    return render(request, "modes/test.html", {
        "tracks": track
    })

def suggest(request, search_string):
    sp = spotipy.Spotify(client_credentials_manager=SpotifyClientCredentials(client_id='0fbfe9612d1e4314a63dd1a1203f8054',
                                                                   client_secret='45ffeacde8d04221bb287876f504a238'))
    results = sp.search(q=search_string, type="track", limit=5)
    results_list = []

    for item in results["tracks"]["items"]:
        track = Track()
        track.name = item["name"]
        track.artist = item["artists"][0]["name"]
        track.key = item["id"]
        results_list.append(track)

    for track in results_list:
        urn = track.key
        track.urn = urn
        urn = 'spotify:track:' + urn
        song_deets = sp.audio_analysis(urn)
        track.key = keySigMapping[song_deets["track"]["key"]]
        track.mode = modeMapping[song_deets["track"]["mode"]]

    json_string = json.dumps([ob.__dict__ for ob in results_list])

    return HttpResponse(str(json_string))

def is_minor(request, key_sig):
    if (key_sig):
        relative_major = keySigMapping[minorMajorMapping.index(key_sig)]
        print('minor:', key_sig)
        print('relative major: ', relative_major)
        #dosomething with root here
    url = reverse('scales', kwargs={'root': relative_major})
    return HttpResponseRedirect(url)

def test(request):
    return render(request, "modes/test.html")
