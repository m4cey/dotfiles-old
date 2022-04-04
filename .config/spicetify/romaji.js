const checkInterval = setInterval(checkDOM, 100);
let albumCache = new Map();
let trackCache = new Map();
let config = {
    childList: true,
    attributes: true,
};
let state = {
    type: '',
    albumId: '',
};
let mainObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
            let trackList = document.querySelector(
                '.main-view-container__scroll-node-child .main-trackList-trackList'
            );
            if (trackList != null) {
                var trackExist = setInterval(function () {
                    const exampleTrack = document.querySelector(
                        '.main-trackList-trackListRow'
                    );
                    if (exampleTrack != null) {
                        let trackListWrapper =
                            exampleTrack.parentNode.parentNode;
                        trackObserver.observe(trackListWrapper, config);
                        let tracks = document.querySelectorAll(
                            '.main-trackList-trackListRow'
                        );

                        //Add an observer that know if it's an album or playlist
                        getType();
                        typeObserver.observe(
                            document.querySelector(
                                '.main-entityTitle-subtitle'
                            ),
                            config
                        );

                        tracks.forEach((row) => {
                            convertKanjiInRow(row);
                        });
                        clearInterval(trackExist);
                    }
                }, 100);
            }
        }
    });
});

let typeObserver = new MutationObserver((mutations) => {
    getType();
});

let trackObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
            let row = mutation.addedNodes[0].querySelector(
                '.main-trackList-trackListRow'
            );
            convertKanjiInRow(row);
        }
    });
});

async function convertKanjiInRow(row) {
    if (row == null) return;
    const html = {
        titleEl: row.querySelector('.main-trackList-rowTitle'),
        artistsEl: row.querySelectorAll('.main-trackList-rowSubTitle a'),
        albumEl:
            (state.type == 'playlist')
                ? row.querySelector('.main-trackList-rowSectionVariable a')
                : null,
    };
    const title = html.titleEl.innerHTML;

    let albumId = '';

    if (state.type == 'playlist') {
        const albumHref = row.querySelector(
            '.main-trackList-rowSectionVariable a'
        ).href;
        albumId = albumHref.split('/').slice(-1)[0];
    } else if (state.type == 'album') {
        albumId = state.albumId;
    } else {
        return;
    }

    //Calculate song hash from album id and song title
    const songHash = await sha256(`${title}${albumId}`);
    if (trackCache.has(songHash)) {
        writeRowInfo(html, trackCache.get(songHash));
    } else {
        const albumSpotify = await Spicetify.CosmosAsync.get(
            `hm://album/v1/album-app/album/${albumId}/desktop`
        );
        const params = {
            title: albumSpotify.name,
            artist: albumSpotify.artists[0].name,
        };

        if (albumCache.has(albumId)) {
            if (albumCache.get(albumId).title == '') return;
            getSongInAlbum(
                html,
                { deezer: albumCache.get(albumId), spotify: albumSpotify },
                { title: title, hash: songHash }
            );
        } else {
            fetchInfo(params, 'album').then((album) => {
                albumCache.set(albumId, album);
                if (album.title != '') {
                    getSongInAlbum(
                        html,
                        {
                            deezer: albumCache.get(albumId),
                            spotify: albumSpotify,
                        },
                        { title: title, hash: songHash }
                    );
                }
            });
        }
    }
}

function getSongInAlbum(html, albums, song) {
    let trackInfo = {};

    albums.spotify.discs.forEach((disc) => {
        disc.tracks.forEach((track) => {
            if (track.name == song.title) {
                trackInfo = {
                    disc: disc.number,
                    index: track.number,
                };
            }
        });
    });

    albums.deezer.songs.forEach((songDeezer) => {
        if (
            songDeezer.index == trackInfo.index &&
            songDeezer.disc == trackInfo.disc
        ) {
            const info = {
                title: songDeezer.title,
                artists: songDeezer.artists,
                album: albums.deezer.title,
            };
            const checkedInfo = checkForKanjiKanaInInfo(
                html,
                info
            );
            writeRowInfo(html, checkedInfo);
            trackCache.set(song.hash, checkedInfo);
        }
    });
}

function checkForKanjiKanaInInfo(html, info) {
    let resultInfo = info;
    const {albumEl, artistsEl, titleEl} = html;

    const title = titleEl.innerHTML;
    if (!title.isKanjiKana()) {
        resultInfo.title = title;
    }
    artistsEl.forEach((el, i) => {
        if (!el.innerHTML.isKanjiKana()) {
            info.artists[i] = el.innerHTML;
        }
    });
    if (state.type == 'playlist' && albumEl != null) {
        const album = albumEl.innerHTML;
        if (!album.isKanjiKana()) {
            resultInfo.album = album;
        }
    }
    return resultInfo;
}

function writeRowInfo(html, info) {
    const {titleEl, albumEl, artistsEl} = html;
    titleEl.innerHTML = info.title;
    artistsEl.forEach((el, i) => {
        el.innerHTML = info.artists[i];
    });
    if (albumEl != null) {
        albumEl.innerHTML =
            info.album;
    }
}

function fetchInfo(params, type) {
    return new Promise((resolve, reject) => {
        fetch(`http://localhost:3311/${type}`, {
            method: 'POST',
            body: JSON.stringify(params),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.text())
            .then((data) => {
                data = JSON.parse(data);
                resolve(data);
            });
    });
}

function checkDOM() {
    if (
        document.querySelector('.main-view-container__scroll-node-child') !=
        null
    ) {
        clearInterval(checkInterval);
        main();
    }
}

async function getAlbumHeader() {
    const id = state.albumId;

    if (albumCache.has(id)) {
        console.log(albumCache.get(id));
        writeAlbumHeader(albumCache.get(id));
    } else {
        const albumSpotify = await Spicetify.CosmosAsync.get(
            `hm://album/v1/album-app/album/${id}/desktop`
        );
        const params = {
            title: albumSpotify.name,
            artist: albumSpotify.artists[0].name,
        };
        fetchInfo(params, 'album').then((album) => {
            albumCache.set(id, album);
            writeAlbumHeader(album);
        });
    }
}

function writeAlbumHeader(album) {
    if (album.title != '') {
        const titleEl = document.querySelector('.main-entityHeader-title h1');
        const artistEl = document.querySelector(
            '.main-entityHeader-creatorWrapper a'
        );
        if (titleEl.innerHTML.isKanjiKana()) {
            titleEl.innerHTML = album.title;
        }
        if (artistEl.innerHTML.isKanjiKana()) {
            artistEl.innerHTML = album.artist;
        }
    }
}

async function getPlayingInfo(playerState) {
    const html = {
        titleEl: document.querySelector('.main-trackInfo-name span a'),
        artistsEl: document.querySelectorAll('.main-trackInfo-artists a'),
        albumEl: null
    }
    const albumId = playerState.data.track.metadata.album_uri
        .split(':')
        .slice(-1)[0];
    const title = playerState.data.track.metadata.title;

    
    //Calculate song hash from album id and song title
    const songHash = await sha256(`${title}${albumId}`);

    if (trackCache.has(songHash)) {
        const songinfo = trackCache.get(songHash);
        writeRowInfo(html, songinfo)
    } else {
        const albumSpotify = await Spicetify.CosmosAsync.get(
            `hm://album/v1/album-app/album/${albumId}/desktop`
        );
        const params = {
            title: albumSpotify.name,
            artist: albumSpotify.artists[0].name,
        };

        if (albumCache.has(albumId)) {
            if (albumCache.get(albumId).title == '') return;
            getSongInAlbum(
                html,
                { deezer: albumCache.get(albumId), spotify: albumSpotify },
                { title: title, hash: songHash }
            );
        } else {
            fetchInfo(params, 'album').then((album) => {
                albumCache.set(albumId, album);
                if (album.title != '') {
                    getSongInAlbum(
                        html,
                        {
                            deezer: albumCache.get(albumId),
                            spotify: albumSpotify,
                        },
                        { title: title, hash: songHash }
                    );
                }
            });
        }
    }
}

function getType() {
    const typeEl = document.querySelector('.main-entityTitle-subtitle');
    switch (typeEl.innerHTML) {
        case 'Playlist':
            state.type = 'playlist';
            break;
        case 'Album':
        case 'EP':
            state.type = 'album';
            state.albumId = Spicetify.Platform.History.location.pathname
                .split('/')
                .slice(-1)[0];
            getAlbumHeader();
            break;
        default:
            state.type = '';
            break;
    }
}

function main() {
    let mainElement = document.querySelector(
        '.main-view-container__scroll-node-child'
    );
    mainObserver.observe(mainElement, config);
    initCache();
    setInterval(writeCache, 1000);
    const playerInterval = setInterval(() => {
        if (Spicetify.Player) {
            Spicetify.Player.addEventListener('songchange', getPlayingInfo);
            clearInterval(playerInterval);
        }
    }, 100);
}

async function sha256(message) {
    // encode as UTF-8
    const msgBuffer = new TextEncoder().encode(message);

    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // convert bytes to hex string
    const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    return hashHex;
}

String.prototype.isKanjiKana = function () {
    return !!this.match(
        /[\u4E00-\u9FAF\u3040-\u3096\u30A1-\u30FA\uFF66-\uFF9D\u31F0-\u31FF]/
    );
};

Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};

let trackCacheSize = 0;
let albumCacheSize = 0;

function initCache() {
    if (window.localStorage.getItem('trackCache') != null) {
        trackCache = JSON.parse(
            window.localStorage.getItem('trackCache'),
            reviver
        );
        trackCacheSize = trackCache.size;
    } else {
        writeCache(true);
    }
    if (window.localStorage.getItem('albumCache') != null) {
        albumCache = JSON.parse(
            window.localStorage.getItem('albumCache'),
            reviver
        );
        albumCacheSize = albumCache.size;
    } else {
        writeCache(true);
    }
}

function writeCache(force = false) {
    if (trackCacheSize != trackCache.size || force) {
        window.localStorage.setItem(
            'trackCache',
            JSON.stringify(trackCache, replacer)
        );
        trackCacheSize = trackCache.size;
    }
    if (albumCacheSize != albumCache.size || force) {
        window.localStorage.setItem(
            'albumCache',
            JSON.stringify(albumCache, replacer)
        );
        albumCacheSize = albumCache.size;
    }
}

function replacer(key, value) {
    if (value instanceof Map) {
        return {
            dataType: 'Map',
            value: Array.from(value.entries()), // or with spread: value: [...value]
        };
    } else {
        return value;
    }
}

function reviver(key, value) {
    if (typeof value === 'object' && value !== null) {
        if (value.dataType === 'Map') {
            return new Map(value.value);
        }
    }
    return value;
}

const decodeEntities = (function () {
    // this prevents any overhead from creating the object each time
    var element = document.createElement('div');

    function decodeHTMLEntities(str) {
        if (str && typeof str === 'string') {
            // strip script/html tags
            str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gim, '');
            str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gim, '');
            element.innerHTML = str;
            str = element.textContent;
            element.textContent = '';
        }

        return str;
    }

    return decodeHTMLEntities;
})();
