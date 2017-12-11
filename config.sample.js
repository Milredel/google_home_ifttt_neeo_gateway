//-------------------------------------------
// Config initialization
//-------------------------------------------
let config = {};
config.neeo = {};
config.home = {};
config.freebox = {};

//-------------------------------------------
// NEEO Settings
//-------------------------------------------

//your public ip or DNS
config.home.public_dns = 'myowndns';

//a private token to "authenticate" from IFTT
config.home.private_token = 'myprivatetoken';

//the port you want this server to listen to
config.home.local_port = 8080;

//-------------------------------------------
// NEEO Settings
//-------------------------------------------

//neeo brain ip
config.neeo.brain_ip = 'myneeobrainip';

//neeo api version
config.neeo.api_version = 'v1';

//-------------------------------------------
// Freebox Settings
//-------------------------------------------

config.freebox.roomId = "myfreeeboxroomid";

config.freebox.deviceId = "myfreeboxdeviceid";

config.freebox.buttons = {
    "1" : "buttondigit1id",
    "2" : "buttondigit2id",
    "3" : "buttondigit3id",
    "4" : "buttondigit4id",
    "5" : "buttondigit5id",
    "6" : "buttondigit6id",
    "7" : "buttondigit7id",
    "8" : "buttondigit8id",
    "9" : "buttondigit9id",
    "0" : "buttondigit0id",
    "red" : "buttonredid"
};

config.freebox.channels = {
    "1" : "t f 1",
    "2" : "france 2",
    "3" : "france 3",
    "4" : "canal plus",
    "5" : "france 5",
    "6" : "m 6",
    "7" : "arte",
    "8" : "c 8",
    "9" : "w 9",
    "10" : "tmc",
    "11" : "n t 1",
    "12" : "n r j 12",
    "14" : "france 4",
    "16" : "c news",
    "17" : "c star",
    "18" : "gulli",
    "19" : "france ô",
    "20" : "h d 1",
    "21" : "l'équipe 21",
    "22" : "6 ter",
    "23" : "numéro 23",
    "24" : "r m c découverte",
    "25" : "chérie 25",
    "28" : "paris première",
    "29" : "r t l 9",
    "31" : "bein sports 1",
    "32" : "bein sports 2",
    "33" : "bein sports 3",
    "34" : "eurosport 1",
    "35" : "eurosport 2",
    "37" : "game one",
    "38" : "teva",
    "39" : "a b 1",
    "48" : "disney channel",
    "49" : "disney channel plus 1",
    "60" : "national geographic channel",
    "61" : "nat geo wild",
    "80" : "comédie plus",
    "81" : "polar plus",
    "82" : "warner tv",
    "83" : "série club",
    "90" : "mangas",
    "red" : "chaine précédente"
};

//-------------------------------------------

module.exports = config;