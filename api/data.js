var username;
var guildname;
var userImage;
var guildId;
var language;
var guildrole;
//USER
exports.setUsername = function(text){
    username = text;
};

exports.sendUsername = function(){
    return username;
};

exports.setImage = function(image){
    userImage = image;
}
exports.sendImage = function(){
    return userImage;
}

exports.setLanguage = function(lang){
    language = lang;
}
exports.sendLanguage = function(){
    return language;
}

//GUILD
exports.setGuildname = function(text){
    guildname = text;
}
exports.sendGuildname = function(){
    return guildname;
}

exports.setGuildId = function(id){
    guildId = id;
}
exports.sendGuildId = function(){
    return guildId;
}

exports.setGuildrole = function(role){
    guildrole = role;
}
exports.sendGuildrole = function(){
    return guildrole;
}