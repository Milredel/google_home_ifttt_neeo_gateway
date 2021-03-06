var Client = require('castv2-client').Client;
var DefaultMediaReceiver = require('castv2-client').DefaultMediaReceiver;
var GoogleTTS = require('google-tts-api');
var AssistantNotifier = function(configuration) {
  this.host = configuration.googlehome.ip_address;
}
AssistantNotifier.prototype.init = function(plugins) {
  this.plugins = plugins;
  if (!this.host) return Promise.reject("[assistant-notifier] Erreur : vous devez configurer ce plugin !");
  return Promise.resolve(this);
};

/**
 * Fonction appelée par le système central
 *
 * @param {String} text Le texte à lire (par exemple: "bonjour et bienvenue")
 */
AssistantNotifier.prototype.action = function(text) {
  var _this=this;
  return new Promise(function(prom_res) {
    // on génère le texte
    GoogleTTS(text, "fr-FR", 1)
    .then(function(url) {
      var client = new Client();
      client.connect(_this.host, function() {
        client.launch(DefaultMediaReceiver, function(err, player) {
          var media = {
            contentId: url,
            contentType: 'audio/mp3',
            streamType: 'BUFFERED'
          };
          player.load(media, {
            autoplay: true
          }, function(err, status) {
            player.on('status', function(status) {
              if (status.playerState == "IDLE") {
                player.stop();
                client.close();
                prom_res();
              }
            });
          });
        })
      })
    })
  })
};

/**
 * Initialisation du plugin
 *
 * @param  {Object} configuration La configuration
 * @param  {Object} plugins Un objet qui contient tous les plugins chargés
 * @return {Promise} resolve(this)
 */
exports.init=function(configuration, plugins) {
  return new AssistantNotifier(configuration).init(plugins)
  .then(function(resource) {
    return resource;
  })
}