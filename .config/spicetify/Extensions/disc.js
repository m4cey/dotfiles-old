// @ts-check
// NAME: Discord Share
// AUTHOR: akameki
// DESCRIPTION: Copy URI and URL to the clipboard for Discord.
/// <reference path="../globals.d.ts" />

(function Disc() {
    const BUTTON_TEXT = "Copy Discord text";
    const NOTIF_TEXT = "Copied to clipbaord!";

    const { CosmosAsync, ContextMenu, URI } = Spicetify;
    if (!(CosmosAsync && URI)) {
        setTimeout(Disc, 500);
        return;
    }
    const onClickBack = ([uriString]) => {
        const parts = uriString.split(":");
        const uri = `${parts[0]}://${parts[1]}/${parts[2]}`;
        const link = URI.fromString(uriString).toSecureOpenURL();
        const discordText = `<${uri}> • ${link}`; // customize the format here!
        CosmosAsync.put("sp://desktop/v1/clipboard", discordText).then(() => Spicetify.showNotification(NOTIF_TEXT));
    }
    const shouldAddCallback = (uris) => uris.length == 1;
    new ContextMenu.Item(BUTTON_TEXT, onClickBack, shouldAddCallback, "copy").register();
})();