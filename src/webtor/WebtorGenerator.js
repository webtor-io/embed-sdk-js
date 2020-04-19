import uuid from './uuid';
import {iframeResize} from 'iframe-resizer';
const defaults = {
    baseUrl:    'https://webtor.io',
    // baseUrl: 'http://localhost:4000',
    width:      '800px',
    mode:       'video',
    subtitles:  [],
    poster:     null,
    header:     true,
    title:      null,
    imdbId:     null,
};
class WebtorGenerator {
    TORRENT_FETCHED = 'torrent fetched';
    TORRENT_ERROR = 'torrent error';
    INIT = 'init';

    push(data) {
        const id = uuid();
        const elId = `webtor-${id}`;
        data = Object.assign(defaults, data);
        const el = document.getElementById(data.id);
        if (!el) throw `Failed to find element with id "${data.id}"`;
        if (data.torrentUrl && data.magnet) {
            throw `There should be only one magnet or torrentUrl`;
        }
        if (!data.torrentUrl && !data.magnet) {
            throw `magnet or torrentUrl required`;
        }
        const params = {
            id,
            // magnet: data.magnet,
            mode: data.mode,
            theme: data.theme,
            // torrent_url: data.torrentUrl,
        };
        Object.keys(params).forEach(key => params[key] === undefined ? delete params[key] : {});
        const paramString = new URLSearchParams(params)
        const url = `${data.baseUrl}/show?${paramString.toString()}`;
        const iframe = document.createElement('iframe');
        iframe.id = elId;
        iframe.width = data.width;
        iframe.setAttribute('allowFullScreen', '');
        iframe.setAttribute('webkitAllowFullScreen', '');
        iframe.setAttribute('mozAllowFullScreen', '');
        iframe.scrolling = 'no';
        iframe.frameBorder = '0';
        iframe.onload = () => {
            iframeResize({
                heightCalculationMethod: 'taggedElement',
                checkOrigin: false,
            }, `#${elId}`);
        }
        iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
        el.appendChild(iframe);
        iframe.src = url;
        const self = this;
        window.addEventListener('message', function(event) {
            const d = event.data;
            if (typeof d === 'object') {
                if (d.id == id && typeof data.on === 'function') {
                    if (d.name == self.INIT) {
                        iframe.contentWindow.postMessage({id, name: 'init', data: JSON.parse(JSON.stringify(data))}, '*');
                    }
                    data.on(d);
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