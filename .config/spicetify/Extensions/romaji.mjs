import "./node_modules/kuroshiro/dist/kuroshiro.min.js";
import "./node_modules/kuroshiro-analyzer-kuromoji/dist/kuroshiro-analyzer-kuromoji.min.js"

const kuroshiro = new Kuroshiro.default();
kuroshiro.init(new KuromojiAnalyzer);

function converter(input) {
    return kuroshiro.convert(input, {
        to: "romaji",
        mode: "spaced",
        romajiSystem: "passport"
    });
}

const fetchAlbum = async (uri) => {
    const res = await Spicetify.CosmosAsync.get(`hm://album/v1/album-app/album/${uri.split(":")[2]}/desktop`);
    return res.name;
};

const fetchShow = async (uri) => {
    const res = await Spicetify.CosmosAsync.get(`sp://core-show/v1/shows/${uri.split(":")[2]}?responseFormat=protobufJson`, {
        policy: { list: { index: true } },
    });
    return res.header.showMetadata.name;
};

const fetchArtist = async (uri) => {
    const res = await Spicetify.CosmosAsync.get(`hm://artist/v1/${uri.split(":")[2]}/desktop?format=json`);
    return res.info.name;
};

const fetchTrack = async (uri) => {
    const res = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/tracks/${uri.split(":")[2]}`);
    return res.name;
};

const fetchEpisode = async (uri) => {
    const res = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/episodes/${uri.split(":")[2]}`);
    return res.name;
};

const fetchPlaylist = async (uri) => {
    const res = await Spicetify.CosmosAsync.get(`sp://core-playlist/v1/playlist/${uri}/metadata`, {
        policy: { name: true },
    });
    return res.metadata.name;
};

async function showRomaji([uri]) {
    const type = uri.split(":")[1];
    let name;
    switch (type) {
        case Spicetify.URI.Type.TRACK:
            name = await fetchTrack(uri);
            break;
        case Spicetify.URI.Type.ALBUM:
            name = await fetchAlbum(uri);
            break;
        case Spicetify.URI.Type.ARTIST:
            name = await fetchArtist(uri);
            break;
        case Spicetify.URI.Type.SHOW:
            name = await fetchShow(uri);
            break;
        case Spicetify.URI.Type.EPISODE:
            name = await fetchEpisode(uri);
            break;
        case Spicetify.URI.Type.PLAYLIST:
        case Spicetify.URI.Type.PLAYLIST_V2:
            name = await fetchPlaylist(uri);
            break;
    }
    if (Kuroshiro.default.Util.hasJapanese(name)) {
        name = await converter(name);
        name = name.replace(/(^|\s)\S/g, t => t.toUpperCase());
    }
    Spicetify.showNotification(name);
}

new Spicetify.ContextMenu.Item(`Show Romaji`, showRomaji).register();
