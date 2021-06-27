import init from './webtor/WebtorGenerator';
function clean(obj) {
    for (var propName in obj) {
        if (obj[propName] === null || obj[propName] === undefined) {
            delete obj[propName];
        }
    }
    return obj;
}
function makeEmbeds(els, init = {}) {
    for (const v of els) {
        let src = v.getAttribute('src');
        if (!src) {
            src = v.getAttribute('href');
        }
        let magnet = null;
        let torrentUrl = null;
        if (src && src.match('^magnet:.*')) {
            magnet = src;
        }
        if ((src && src.match('\.torrent$')) || (src && v.getAttribute('type') == 'application/x-bittorrent')) {
            torrentUrl = src;
        }
        if (v.getAttribute('data-torrent')) {
            torrentUrl = v.getAttribute('data-torrent');
        }
        const parent = v.parentNode;
        const width = v.getAttribute('width');
        const height = v.getAttribute('height');
        const poster = v.getAttribute('poster');
        const controls = v.getAttribute('controls') == '' || v.getAttribute('controls') == 'true';
        const attrData = {};
        for (const a of v.attributes) {
            if (a.name == 'data-config') continue;
            if (a.name.startsWith('data-')) {
                let val = a.value;
                try {
                    val = JSON.parse(a.value);
                } catch (e) {
                    console.log(e);
                }
                attrData[a.name.replace('data-', '')] = val;
            }
        }

        const tracks = [];
        for (const t of v.querySelectorAll('track')) {
            tracks.push(clean({
                srclang: t.getAttribute('srclang'),
                label:   t.getAttribute('label'),
                default: t.getAttribute('default'),
                src:     t.getAttribute('src'),
            }));
        }
        if (tracks.length > 0) {
            attrData.subtitles = tracks;
        }
        let config = v.getAttribute('data-config');
        if (config == null) {
            config = {};
        } else {
            config = JSON.parse(config);
        }
        const div = document.createElement('div');
        if (v.getAttribute('class')) div.setAttribute('class', v.getAttribute('class'));
        if (v.getAttribute('id')) div.setAttribute('id', v.getAttribute('id'));
        let data = {
            el: div,
            magnet,
            torrentUrl,
            width,
            height,
            poster,
            controls,
        };
        data = Object.assign({}, init, clean(data), attrData, config);
        parent.replaceChild(div, v);
        window.webtor.push(clean(data));
    }
}
window.webtor = init(window.webtor);
makeEmbeds(document.querySelectorAll('video'));
makeEmbeds(document.querySelectorAll('a[download]'), {mode: 'download', width: '400px'});
