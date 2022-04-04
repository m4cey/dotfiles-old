// @ts-check
// NAME: Sort popularity
// AUTHOR: drSychev
// VERSION: 1.0
// DESCRIPTION: Adds artist tracks sorted by rating

/// <reference path="../spicetify-cli/globals.d.ts" />
(function playNext(){
  if (!(Spicetify.CosmosAsync && Spicetify.Queue && Spicetify.ContextMenu && Spicetify.URI)){
    setTimeout(playNext, 200);
    return;
  }

  let artistId = null;

  async function main() {

    let artistId     = getArtistId();
    let artist       = await Spicetify.CosmosAsync.get(`hm://artist/v3/${artistId}/desktop/entity?format=json`);
    let albumsDiscs  = await getDiscs(artist.releases.albums);
    let singlesDiscs = await getDiscs(artist.releases.singles);
    let discs = albumsDiscs.concat(singlesDiscs).flat();
    let tracks = getTracks(discs);
    let sortTracks = sortByPopularity(tracks);
    addToNext(sortTracks);

  }

  function uriTrack(uris){
    if (uris.length > 1) {
      return true;
    }
    const uriObj = Spicetify.URI.fromString(uris[0]);
    artistId = uriObj._base62Id;
    return uriObj.type === Spicetify.URI.Type.ARTIST;

  }

  function getArtistId() {
    let section = document.querySelector('.main-view-container__scroll-node-child section');
    if (section === null) {
      return null;
    }

    return artistId;
  }

  async function uploadAlbum(uri) {
    let albumId = uri.replace(/^.+:/, '');
        let response = await Spicetify.CosmosAsync.get(`hm://album/v1/album-app/album/${albumId}/desktop`);
        return response.discs;
  }

  async function getDiscs(album) {
    let discs = [];

    for (const release of album.releases) {
      discs[discs.length] = release.discs ?
          new Promise(resolve => {resolve(release.discs)}) : await uploadAlbum(release.uri);
    }

    return await Promise.all(discs);
  }


  function getTracks(disks) {
    let tracks = [];
    for (const disk of disks) {
      tracks = tracks.concat(disk.tracks);
    }

    return tracks;
  }

  // Сортирует треки по рейтенгу или по количеству прослушиваний
  function sortByPopularity(tracks) {
    return tracks.sort(function(firstTrack, secondTrack) {
      return  secondTrack.popularity - firstTrack.popularity ||  secondTrack.playcount - firstTrack.playcount;
    });
  }

  // Добавляет треки в очередь
  async function addToNext(tracks){
    const newTracks = tracks.map(track => ({
      uri:track.uri,
      provider: "queue",
      metadata: {
        is_queued: true,
      }
    }))
    await Spicetify.CosmosAsync.put("sp://player/v2/main/queue", {
      queue_revision: Spicetify.Queue?.queueRevision,
      next_tracks: newTracks,
      prev_tracks: Spicetify.Queue?.prevTracks
    })
        .then(() => Spicetify.showNotification("Tracks added to queue"))
        .catch( (err) => {
          console.error("Failed to add to queue",err);
          Spicetify.showNotification("Unable to Add! Check Console.");
        })
  }

  // Добавить кнопку в контекстное меню
  new Spicetify.ContextMenu.Item(
      "Play by popularity",
      main,
      uriTrack,
      `<svg role="img" height="16" width="16" viewBox="0 0 20 20" fill="currentColor"><path d="M3.67 8.67h14V11h-14V8.67zm0-4.67h14v2.33h-14V4zm0 9.33H13v2.34H3.67v-2.34zm11.66 0v7l5.84-3.5-5.84-3.5z"></path></svg>`
  ).register();
})();
