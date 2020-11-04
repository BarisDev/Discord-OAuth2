const express = require('express');
const fetch = require('node-fetch');
const btoa = require('btoa');
const { catchAsync } = require('../utils');
var data = require('./data');

const router = express.Router();

const CLIENT_ID = '694688760343822446';
const CLIENT_SECRET = 'XM-JaYwbf1pm1q0rSRNEQ6NqNe_TWi4_';
const redirect = encodeURIComponent('http://localhost:50451/api/discord/callback');//https://bycalendar.herokuapp.com/api/discord/callback

router.get('/login', (req, res) => {
  res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify%20guilds&response_type=code&redirect_uri=${redirect}`);
});

router.get('/callback', catchAsync(async (req, res) => {
  if (!req.query.code) throw new Error('NoCodeProvided');
  const code = req.query.code;
  //Base64 string
  const creds = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
  console.log("btoa: "+creds)
  const params = `client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=authorization_code&code=${code}&redirect_uri=${redirect}&response_type=code&scope=identify`
  const response = await fetch(`https://discord.com/api/oauth2/token`,
    {
      method: 'POST',
      body: params,
      headers: {
        Authorization: `Basic ${creds}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).catch(err => console.error(err));
  const json = await response.json();
  
//TOKEN EXCHANGE STARTS

  //User info from discord
  const fetchDiscordUserInfo = await fetch('https://discord.com/api/users/@me', {
    headers: {
      Authorization: `Bearer ${json.access_token}`,
    }
  });
  
  const userInfo = await fetchDiscordUserInfo.json();
  userId = `${userInfo.id}`;
  userName = `${userInfo.username}`;
  userAvatarHash = `${userInfo.avatar}`;
  userAvatar = "https://cdn.discordapp.com/avatars/"+userId+"/"+userAvatarHash+".png";
  language = `${userInfo.locale}`;
  data.setUsername(userName);
  data.setImage(userAvatar);
  data.setLanguage(language);
  //Guild info from discord
  const fetchDiscordGuildInfo = await fetch('https://discord.com/api/users/@me/guilds', {
    headers: {
      Authorization: `Bearer ${json.access_token}`,
    }
  });
  const GuildInfo = await fetchDiscordGuildInfo.json();

  console.log("guild:"+GuildInfo.roles);

  var guildId = [];
  var guildName = [];
  var guildRole = [];
  for(var i = 0; i < GuildInfo.length; i++){
    guildId.push(GuildInfo[i].id);
    guildName.push(GuildInfo[i].name);
    guildRole.push(GuildInfo[i].roles);
  }
  data.setGuildId(guildId);
  data.setGuildname(guildName);
  //TODO:Roles returns null
  data.setGuildrole(guildRole);

//TOKEN EXCHANCE FINISHED
  res.redirect(`/guildCalendar`);
  //res.redirect(`/?token=${json.access_token}`);

}));

module.exports = router;