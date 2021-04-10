import init from './webtor/WebtorGenerator';
function clean(obj) {
    for (var propName in obj) {
        if (obj[propName] === null || obj[propName] === undefined) {
            delete obj[propName];
        }
    }
    return obj;
}
window.webtor = init(window.webtor);
for (const v of document.querySelectorAll('video')) {
    const src = v.getAttribute('src');
    let magnet = null;
    let torrentUrl = null;
    if (src && src.match('^magnet:.*')) {
        magnet = src;
    }
    if (src && src.match('\.torrent$')) {
        torrentUrl = src;
    }
    if (v.getAttribute('data-torrent')) {
        torrentUrl = v.getAttribute('data-torrent');
    }
    const parent = v.parentNode;
    const width = v.getAttribute('width');
    const height = v.getAttribute('height');
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
    };
    data = Object.assign({}, data, config);
    parent.replaceChild(div, v);
    window.webtor.push(clean(data));
}
