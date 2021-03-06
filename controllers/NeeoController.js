"use strict";

const Logger = SRV_DEPENDENCIES.logger;
const neeoManager = SRV_DEPENDENCIES.neeoManager;
const srvManager = SRV_DEPENDENCIES.srvManager;
const commandConfigDir = BASE_DIR + '/conf/commands';

class NeeoController {

    constructor() { }

    async executeFreebox(req, res) {
        try {
            var qData = req.query;
            var channel = qData.channel;
            var roomId = CONFIG.freebox.roomId;
            var deviceId = CONFIG.freebox.deviceId;
            if (channel == undefined) {
                throw new Error('Missing parameter channel. Cannot move on.');
            }
            if (roomId == undefined) {
                throw new Error('Missing config parameter roomId for freebox. Cannot move on.');
            }
            if (deviceId == undefined) {
                throw new Error('Missing config parameter deviceId for freebox. Cannot move on.');
            }
            channel = channel.replace("sur ", "");
            if (channel.indexOf("la") == 0) {
                channel = channel.replace("la ", "");
            }
            var filteredChannel = UTILS.filterInt(channel);
            if (isNaN(filteredChannel)) {
                var channelNumber = UTILS.getChannelNumberFromName(channel);
                if (channelNumber == undefined) {
                    throw new Error('Impossible to find channel number for "'+channel+'". Cannot move on.');
                }
                channel = channelNumber;
            }
            if (channel == "red") {
                var buttonId = CONFIG.freebox.buttons["red"];
                if (buttonId == undefined) {
                    throw new Error('Button not found "'+digit+'". Cannot move on.');            
                }
                var executeUrl = UTILS.formatLocalButtonUrl("trigger", roomId, deviceId, buttonId);
                var response = await neeoManager.getByUrl(executeUrl);
            } else {
                var digits = channel.split('');
                for (var i = 0; i < digits.length ; i++) {
                    var digit = digits[i];
                    var buttonId = CONFIG.freebox.buttons[digit];
                    if (buttonId == undefined) {
                        throw new Error('Button not found "'+digit+'". Cannot move on.');
                    }
                    var executeUrl = UTILS.formatLocalButtonUrl("trigger", roomId, deviceId, buttonId);
                    var response = await neeoManager.getByUrl(executeUrl);
                }
            }
            res.send("OK I received something from IFTTT and triggered the button(s) accordingly");
        } catch (e) {
            res.send('Error executing action ('+e+').');
        }
    }

    async execute(req, res) {
        try {
            var qData = req.query;
            var roomId = qData.room;
            var action = qData.action;
            var recipeId = qData.recipe;
            var deviceId = qData.device;
            var buttonId = qData.button;
            var repeat = qData.repeat;

            var authorizedActions = ["on", "off", "trigger"];
            if (action == undefined) {
                throw new Error('Missing parameter action. Cannot move on.');
            }
            if (authorizedActions.indexOf(action) === -1) {
                throw new Error('Unauthorized action. Cannot move on.');
            }
            if ((action == "on" || action == "off") && (roomId == undefined || recipeId == undefined)) {
                throw new Error('Missing parameter room or recipe for this action. Cannot move on.');
            }
            if ((action == "trigger") && (roomId == undefined || deviceId == undefined || buttonId == undefined)) {
                throw new Error('Missing parameter room, device or button for this action. Cannot move on.');
            }
            if (repeat != undefined && !Number.isInteger(parseInt(repeat, 10))) {
                throw new Error('Repeat parameter is not valid. Cannot move on.');    
            }
            if (action == "on" || action == "off") {
                var recipeIsActiveUrl = UTILS.formatLocalUrl("isactive", roomId, recipeId);
                var responseJSON = await neeoManager.getByUrl(recipeIsActiveUrl);
                if (responseJSON.active == undefined) {
                    throw new Error("Cannot get powerState for the recipe.");
                }
                if ((action == "on" && !responseJSON.active) || (action == "off" && responseJSON.active)) {
                    var executeUrl = UTILS.formatLocalUrl("execute", roomId, recipeId);
                    var response = await neeoManager.getByUrl(executeUrl);
                    res.send('OK, I received something from IFTTT and executed the recipe');
                } else {
                    res.send('OK, I received something from IFTTT but nothing to do regarding state of the recipe');
                }
            }
            if (action == "trigger") {
                if (repeat == undefined) {
                    repeat = 1;
                }
                var executeUrl = UTILS.formatLocalButtonUrl("trigger", roomId, deviceId, buttonId);
                for (var i = 0; i < repeat; i++) {
                    var responseJSON = await neeoManager.getByUrl(executeUrl);
                }
                if (repeat > 1) {
                    res.send('OK, I received something from IFTTT and triggered the button '+repeat+' times');    
                }
                res.send('OK, I received something from IFTTT and triggered the button');
            }
        } catch (e) {
            res.send('Error executing action ('+e+').');
        }
    }

    async handleWebhook(req, res) {
        res.end();
        var event = req.body;
        if (event.action == "launch" || event.action == "poweroff") {
            var newState = event.action == "launch" ? true : false;
            var recipe = neeoManager.updateRecipe("launch", event.recipe, {isPoweredOn: newState});
            if (recipe == null) {
                throw new Error("Problem updating recipe : ("+e+")");
            }
            req.io.sockets.emit('brain update recipe', {recipe: recipe});            
        }
        event.message = "A NEEO button has been pushed";
        Logger.log(event);
    }

    async loadCommandsForRecipe(req, res) {
        var recipe_id = req.params.id;
        if (SRV_VARS.data.recipeSteps[recipe_id] == undefined) {
            const result = UTILS.formatReturn(RESULT_MISSING, "unknown recipe id", true, {});
            return srvManager.manageResult(res, result);
        }
        var recipeSteps = SRV_VARS.data.recipeSteps[recipe_id].steps;
        for (var i = 0; i < recipeSteps.length; i++) {
            var step = recipeSteps[i];
            if (step.type == "controls") {
                var deviceName = step.scenarioName;
            }
        }
        if (deviceName == undefined) {
            const result = UTILS.formatReturn(RESULT_MISSING, "impossible to find controls in steps", true, {});
            return srvManager.manageResult(res, result);
        }
        
        var commandConfig = SRV_VARS.data.commandConfigs[deviceName];
        if (commandConfig == undefined) {
            commandConfig = SRV_VARS.data.commandConfigs["default"];
        }
        
        return res.render('commands', { recipe_id: recipe_id, device_name: deviceName, config: commandConfig });
    }
}

module.exports = NeeoController;
