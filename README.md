# embed-sdk-js

Webtor.io SDK for online torrent streaming your site

## Features

* Supports magnet-uri and external torrent-files
* Supports video (avi, mkv, mp4, m4v) with subtitles (vtt, srt)
* No additional plugins/extensions required

## Basic usage

Generates embed for video player:
```html
<video controls src="magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel"></video>
<script src="https://cdn.jsdelivr.net/npm/@webtor/embed-sdk-js/dist/index.min.js" charset="utf-8" async></script>
```

Generates embed for video player with subtitle tracks, poster, custom title and width:
```html
<video controls src="magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel" poster="https://via.placeholder.com/150/0000FF/808080" width="100%" data-title="Sintel">
    <track srclang="en" label="test" default src="https://raw.githubusercontent.com/andreyvit/subtitle-tools/master/sample.srt">
</video>
<script src="https://cdn.jsdelivr.net/npm/@webtor/embed-sdk-js/dist/index.min.js" charset="utf-8" async></script>
```
Video element is replaced by wrapper div in this scenarios.

## Video element attributes (streaming)

Attribute    | Description
-------------|-------------
id           | ID of wrapper div
class        | Class of wrapper div
width        | Width of an iframe (might be any css width value: 800px, 100%, etc... 800px by default)
height       | Height of an iframe (might be any css width value: 800px, 100%, etc... optional)
src          | Magnet url or url to torrent file (required)
poster       | Url to the poster image (optional)
type         | Use `application/x-bittorrent` for torrent file url in case if it has no `.torrent` extension
controls     | Enables all player features
data-config  | Additional player configuration in JSON (see [Player configuration](#player-configuration))
data-*       | Set specific configuration value for a key (see [Player configuration](#player-configuration))

## Advanced usage

Generates embed for video player:
```html
    <div id="player" class="webtor" />
    <script>
        window.webtor = window.webtor || [];
        window.webtor.push({
            id: 'player',
            magnet: 'magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F',
            poster: 'https://via.placeholder.com/150/0000FF/808080',
            subtitles: [
                {
                    srclang: 'en',
                    label: 'test',
                    src: 'https://raw.githubusercontent.com/andreyvit/subtitle-tools/master/sample.srt',
                    default: true,
                }
            ],
            lang: 'en',
        });
    </script>
    <script src="https://cdn.jsdelivr.net/npm/@webtor/embed-sdk-js/dist/index.min.js" charset="utf-8" async></script>
```
[Here is live examples](https://webtor.io/embed/example)

## Embed configuration

Attribute  | Description
-----------|-------------
id         | Element id where player will be embedded
magnet     | Magnet URI (torrentUrl ot magnet is required)
width      | Width of an iframe (might be any css width value: 800px, 100%, etc... 800px by default)  
height     | Height of an iframe (might be any css width value: 800px, 100%, etc... optional)
torrentUrl | Url of the torrent-file (HTTP-server **MUST** include header "Access-Control-Allow-Origin: *" to allow torrent-file download on client-side)
poster     | Url to the poster image (optional)
on         | Callback-function to capture player events (optional)
subtitles  | Array of subtitles (optional, see [Subtitle configuration](#subtitle-configuration) for more details)
title      | Replaces original file name in a header with specific title (optional)
imdbId     | Helps to find subtitles and additional metadata (example values 'tt0133093' or '0133093' or even '133093', optional)
header     | Shows header with current progress and title (true/false, default: true)
pwd        | Selected directory in torrent (optional)
file       | Selected file in torrent in selected directory (optional, by default selects first video file)
path       | Selected file by full file path in torrent, can be used instead of `pwd` and `file` (optional)
lang       | Override ui language (optional)
userLang   | Override user language (optional)
controls   | Enables all features (true/false, default: true)
features   | Enables or disables specific player features (optional)
baseUrl    | Url of Webtor instance (By default: https://webtor.io)

## Subtitle configuration

Attribute  | Description
-----------|-------------
srclang    | Two-letter language code
label      | Subtitle label
src        | `url` to the subtitle src, could be `vtt`, `srt` and `m3u8`. It should be direct link to subtitle.
default    | If true this track will be selected by default (true/false, optional)

## Player features

Name          | Description
--------------|-------------
subtitles     | Enables subtitles control
settings      | Enables settings control (cog)
fullscreen    | Enables fullscreen control
playpause     | Enables plays/pause control
currentTime   | Displays current time
timeline      | Enables timeline control
duration      | Displays total duration
volume        | Enables volume control
chromecast    | Enables chromecast support
embed         | Enables embed button
opensubtitles | Enables OpenSubtitles support

## Using with your own self-hosted Webtor instance

After installing Webtor instance according to the [instruction](https://github.com/webtor-io/self-hosted/) just switch `baseUrl` configuration attribute to your own. 

