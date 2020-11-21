import uuid from './uuid';
import {iframeResize} from 'iframe-resizer';
const defaults = {
    baseUrl:    'https://webtor.io',
    // baseUrl: 'http://localhost:4000',
    width:      '800px',
    height:     null,
    mode:       'video',
    subtitles:  [],
    poster:     null,
    header:     true,
    title:      null,
    imdbId:     null,
    version:    VERSION,
    lang:       null,
    i18n:       {},
    features:   {},
};
let injected = false;
class Player {
    constructor(send) {
        this.send = send;
    }
    play() {
        this.send('play');
    }
    pause() {
        this.send('pause');
    }
    setPosition(val) {
        this.send('setPosition', val);
    }
    open(val) {
        var chunks = val.replace(/^\//, '').split('/'); 
        var file = chunks.pop();
        var pwd = '/' + chunks.join('/');
        this.send('open', {
            file: file,
            pwd: pwd,
        });
    }
}
class WebtorGenerator {
    TORRENT_FETCHED = 'torrent fetched';
    TORRENT_ERROR   = 'torrent error';
    INIT            = 'init';
    OPEN            = 'open';
    INJECT          = 'inject';
    INITED          = 'inited';
    PLAYER_STATUS   = 'player status';
    CURRENT_TIME    = 'current time';
    DURATION        = 'duration';
    OPEN_SUBTITLES  = 'open subtitles';

    push(data) {
        const id = uuid();
        const elId = `webtor-${id}`;
        const dd = Object.assign({}, defaults, data);
        const el = document.getElementById(dd.id);
        if (!el) throw `Failed to find element with id "${dd.id}"`;
        if (dd.torrentUrl && dd.magnet) {
            throw `There should be only one magnet or torrentUrl`;
        }
        if (!dd.torrentUrl && !dd.magnet) {
            throw `magnet or torrentUrl required`;
        }
        const params = {
            id,
            mode:     dd.mode,
            theme:    dd.theme,
            pwd:      dd.pwd,
            file:     dd.file,
            version:  dd.version,
            lang:     dd.lang,
            i18n:     dd.i18n,
            features: dd.features,
        };
        Object.keys(params).forEach(key => params[key] === undefined ? delete params[key] : {});
        const paramString = new URLSearchParams(params)
        const url = `${dd.baseUrl}/show?${paramString.toString()}`;
        const iframe = document.createElement('iframe');
        iframe.id = elId;
        if (dd.width)  iframe.width = dd.width;
        if (dd.height) iframe.height = dd.height;
        iframe.setAttribute('allowFullScreen', '');
        iframe.setAttribute('webkitAllowFullScreen', '');
        iframe.setAttribute('mozAllowFullScreen', '');
        iframe.scrolling = 'no';
        iframe.frameBorder = '0';
        if (!dd.height) {
            iframe.onload = () => {
                iframeResize({
                    heightCalculationMethod: 'taggedElement',
                    checkOrigin: false,
                }, `#${elId}`);
            }
        }
        iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; fullscreen; picture-in-picture';
        el.appendChild(iframe);
        iframe.src = url;
        const self = this;
        const player = new Player((name, data) => {
            iframe.contentWindow.postMessage({id, name, data}, '*');
        });
        window.addEventListener('message', function(event) {
            const d = event.data;
            if (typeof d === 'object') {
                if (d.id == id) {
                    d.player = player;
                    if (d.name == self.INIT) {
                        iframe.contentWindow.postMessage({id, name: 'init', data: JSON.parse(JSON.stringify(dd))}, '*');
                    } else if (d.name == self.INJECT && !injected) {
                        injected = true;
                        eval(d.data);
                    } else if (typeof data.on === 'function') {
                        dd.on(d);
                    }
                }
            }
        });
    }
}

export default function(data) {
    if (!data) {
        return new WebtorGenerator();
    } else if (Array.isArray(data)) {
        const wg = new WebtorGenerator();
        for (const d of data) {
            wg.push(d);
        }
        return wg;
    } else {
        return data;
    }
}