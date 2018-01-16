"use strict";

const Logger = SRV_DEPENDENCIES.logger;
const srvManager = SRV_DEPENDENCIES.srvManager;
const freeboxManager = SRV_DEPENDENCIES.freeboxManager;

class FreeboxController {

    constructor() { }

    async displayTVGuide(req, res) {
        const vars = {private_token : CONFIG.home.private_token};
        var linkRecipes = "/recipes?token="+CONFIG.home.private_token;
        var linkTVGuide = "/tv/guide?token="+CONFIG.home.private_token;

        var channels = SRV_VARS.data.tvChannels;
        
        res.render('tvguide', { channels: channels, linkRecipes: linkRecipes, linkTVGuide: linkTVGuide, vars: vars});
    }

}

module.exports = FreeboxController;