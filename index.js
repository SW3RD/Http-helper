const Discord = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
const client = new Discord.Client({intents:["DirectMessages","GuildMembers","Guilds","DirectMessages","GuildMessages","MessageContent","GuildMessageReactions","DirectMessageReactions"]});
const axios = require("axios");
const fs = require('fs');
const config = JSON.parse(fs.readFileSync("./config.json",{encoding:'utf-8'}));


const cooldownarray = [];

client.on("ready",() =>{
  client.user.setPresence({
    activities: [{ name: `${client.guilds.cache.size} guilds!`, type: 3 }],
    status: 'online',
  });

    console.log("bot is ready");
});
client.on("guildCreate",(guild) =>{
 config[guild.id] = JSON.parse("{\"prefix\":\"$\",\"channel\":\"\"}");

fs.writeFileSync("./config.json",JSON.stringify(config));
});
client.on("messageCreate",(message) =>{
if(message.author.bot) return;

if(message.guild !== null){

if(message.channel.name === config[message.guild.id]["channel"] && !(message.content.startsWith(config[message.guild.id]["prefix"] + "help") || message.content.startsWith(config[message.guild.id]["prefix"] + "info") || message.content.startsWith(config[message.guild.id]["prefix"] + "newrequest"))) return message.delete()


if(message.content.startsWith(config[message.guild.id]["prefix"] + "init")){
  if(!message.member.permissions.has("Administrator")) return;

  const setprefix = new Discord.EmbedBuilder()
  .setColor(0x0099FF)
  .setAuthor({name:message.author.username,iconURL:message.author.avatarURL()})
  .setDescription("Initiate")
  .addFields({name:"What prefix do you want?",value:'```Default : ${command}```'})
  const setchannel = new Discord.EmbedBuilder()
  .setColor(0x0099FF)
  .setAuthor({name:message.author.username,iconURL:message.author.avatarURL()})
  .setDescription("Initiate")
  .addFields({name:"What channel do you want?",value:'```Please enter the name of the channel not the id```'})
  .setThumbnail(message.author.avatarURL())
  .setThumbnail(message.author.avatarURL())


  const donep = new Discord.EmbedBuilder()
  .setColor(0x0099FF)
  .setAuthor({name:message.author.username,iconURL:message.author.avatarURL()})
  .setDescription("Initiate")
  .addFields({name:"Done",value:'Config saved'})
  .setThumbnail(message.author.avatarURL())
  .setThumbnail(message.author.avatarURL())

  const errchannel = new Discord.EmbedBuilder()
  .setColor(0x0099FF)
  .setAuthor({name:message.author.username,iconURL:message.author.avatarURL()})
  .setDescription("Initiate")
  .addFields({name:"Error",value:'Channel not found'})
  .setThumbnail(message.author.avatarURL())
  .setThumbnail(message.author.avatarURL())
  const messagefilter = (user) => user.author.id === message.author.id;
 message.channel.send({embeds:[setprefix]}).then(msg =>{
  msg.channel.awaitMessages({filter:messagefilter,max:1,errors:['time'],time:600000}).then((collected) =>{
    config[message.guild.id]["prefix"] = collected.first().content;
    fs.writeFileSync("./config.json",JSON.stringify(config));
    msg.channel.send({embeds:[setchannel]}).then(msg =>{
      msg.channel.awaitMessages({filter:messagefilter,max:1,errors:['time'],time:600000}).then((collected) =>{
        let channel =message.guild.channels.cache.find(c => c.name === collected.first().content);
        if(!channel) return msg.channel.send({embeds:[errchannel]});
        config[message.guild.id]["channel"] = collected.first().content;
        fs.writeFileSync("./config.json",JSON.stringify(config));
        const init = new Discord.EmbedBuilder()
        .setColor(0x0099FF)
        .setAuthor({name:"Http Helper By SW3RD#1111",iconURL:client.user.avatarURL()})
        .setDescription("Welcome,\n\nThis bot still in `Alpha Mode` so, if you found any bugs contact me.\nto make a new http request type `" + config[message.guild.id]["prefix"] + "newrequest` in chat.\ncooldown between tries `60` seconds.\n`Raw request feature` SOON\n\n**[Invite me to your server](https://discord.com/oauth2/authorize?client_id=1011250270438694943&permissions=8&scope=bot)**")
        .setThumbnail(client.user.avatarURL())
        channel.send({embeds:[init]});
        msg.channel.send({embeds:[donep]});
      });
    });
  });
 });
}

if(message.content.startsWith(config[message.guild.id]["prefix"] + "help")){
  const help = new Discord.EmbedBuilder()
  .setColor(0x0099FF)
  .setAuthor({name:message.author.username,iconURL:message.author.avatarURL()})
  .setDescription("Help")
  .addFields({name:"Member Commands",value:'`' + config[message.guild.id]["prefix"] + 'newrequest` | to make a new http request\n`' + config[message.guild.id]["prefix"] + 'info` | to see information about the bot'})
  .addFields({name:"Admin Commands",value:'`' + config[message.guild.id]["prefix"] + 'init` | to show welcome message'})
  .setThumbnail(message.author.avatarURL())
  .setFooter({text:`Requested By ${message.author.username}#${message.author.discriminator}`,iconURL:message.author.avatarURL()})
  .setTimestamp();
message.author.send({embeds:[help]}).then(() =>{
message.react('✅');
});
}

if(message.content.startsWith(config[message.guild.id]["prefix"] + "info")){
  const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
  const help = new Discord.EmbedBuilder()
  .setColor(0x0099FF)
  .setAuthor({name:message.author.username,iconURL:message.author.avatarURL()})
  .setDescription("Info")
  .addFields({name:"Uptime",value:'`' + duration + '`'})
  .addFields({name:"Guilds",value:'`' + client.guilds.cache.size + '`'})
  .addFields({name:"Users",value:'`' + client.users.cache.size + '`'})
  .addFields({name:"Requests Count",value:'`' + config["request_count"] + '`'})
  .addFields({name:"Developer",value:'`SW3RD#1111`'})
  .addFields({name:"Team",value:'`Falcon Digital` **[Join](https://discord.gg/FcBpcDXFHj)**'})
  .addFields({name:"‎",value:'**[Invite me to your server](https://discord.com/oauth2/authorize?client_id=1011250270438694943&permissions=8&scope=bot)**'})
  .setThumbnail(message.author.avatarURL())
  .setFooter({text:`Requested By ${message.author.username}#${message.author.discriminator}`,iconURL:message.author.avatarURL()})
  .setTimestamp();
message.channel.send({embeds:[help]})
}
if(message.content.startsWith(config[message.guild.id]["prefix"] + "newrequest")){
    let method,url,data,headersbool,headers = {};
    const choices = new Discord.EmbedBuilder()
    .setColor(0x0099FF)
    .setAuthor({name:message.author.username,iconURL:message.author.avatarURL()})
    .setDescription("Setup")
    .addFields({name:"What is the method?",value:'‎\n:one:‎ ‎ ‎ GET\n\n:two: ‎ ‎ POST\n‎'})
    .setThumbnail(message.author.avatarURL())

    const wheaders = new Discord.EmbedBuilder()
    .setColor(0x0099FF)
    .setAuthor({name:message.author.username,iconURL:message.author.avatarURL()})
    .setDescription("Setup")
    .addFields({name:"With headers or no?\n\n",value:'‎\n:one:‎ ‎ ‎ Yes\n\n:two: ‎ ‎ No\n‎'})
    .setThumbnail(message.author.avatarURL())

    const expired = new Discord.EmbedBuilder()
    .setColor(0x0099FF)
    .setAuthor({name:message.author.username,iconURL:message.author.avatarURL()})
    .setDescription("An error occurred")
    .addFields({name:"Error",value:'Session Destroyed (maybe entered wrong headers / your session time expired)'})
    .setThumbnail(message.author.avatarURL())

    const length = new Discord.EmbedBuilder()
    .setColor(0x0099FF)
    .setAuthor({name:message.author.username,iconURL:message.author.avatarURL()})
    .setDescription("An error occurred")
    .addFields({name:"Error",value:'Response data length is more than 2000'})
    .setThumbnail(message.author.avatarURL())

    const urls = new Discord.EmbedBuilder()
    .setColor(0x0099FF)
    .setAuthor({name:message.author.username,iconURL:message.author.avatarURL()})
    .setDescription("Setup")
    .addFields({name:"What is the url?",value:'```https://${host}/${endpoint}```'})
    .setThumbnail(message.author.avatarURL())
    const headerz = new Discord.EmbedBuilder()
    .setColor(0x0099FF)
    .setAuthor({name:message.author.username,iconURL:message.author.avatarURL()})
    .setDescription("Setup")
    .addFields({name:"What is the headers?",value:'```Ex: Content-Type: application/json\nUser-Agent: okhttp/3.1.2.1```'})
    .setThumbnail(message.author.avatarURL())

    const postz = new Discord.EmbedBuilder()
    .setColor(0x0099FF)
    .setAuthor({name:message.author.username,iconURL:message.author.avatarURL()})
    .setDescription("Setup")
    .addFields({name:"What is the body data?",value:'```Ex: {"user":"user1","password":"qwerty123"}```'})
    .setThumbnail(message.author.avatarURL())

    const cooldown = new Discord.EmbedBuilder()
    .setColor(0x0099FF)
    .setAuthor({name:message.author.username,iconURL:message.author.avatarURL()})
    .setDescription("Error")
    .addFields({name:"Error",value:"You're on cooldown"})
    .setThumbnail(message.author.avatarURL())

   console.log(message.author.id);
    if(message.channel.name !== config[message.guild.id]["channel"]) return message.delete();
    if(cooldownarray.find(id => id === message.author.id)) return message.author.send({embeds:[cooldown]}).then(() =>{message.react('❌')});
    message.react('✅');

    const filter = (reaction, user) => (reaction.emoji.name === "1️⃣" || reaction.emoji.name === "2️⃣") && user.id === message.author.id
    const messagefilter = (user) => user.author.id === message.author.id;
    message.author.send({embeds:[choices]}).then((msg)=>{
        msg.react("1️⃣").then(() =>{
        msg.react("2️⃣");
       });
       msg.awaitReactions({filter:filter,errors:['time'],max:1,time:600000}).then((collected) =>{
        const reaction = collected.first();
          if(reaction.emoji.name == '1️⃣'){
            method = "GET";
          }else if(reaction.emoji.name == '2️⃣'){
            method = "POST";
          }
          msg.channel.send({embeds:[wheaders]}).then((msg)=>{
            msg.react("1️⃣").then(() =>{
            msg.react("2️⃣");
               }); 
               msg.awaitReactions({filter:filter,errors:['time'],max:1,time:600000}).then((collected) =>{
                const reaction = collected.first();
                if(reaction.emoji.name == '1️⃣'){
                  headersbool = true;
                  }else if(reaction.emoji.name == '2️⃣'){
                    headersbool = false;
                  }

                  msg.channel.send({embeds:[urls]}).then(msg =>{
                  msg.channel.awaitMessages({filter:messagefilter,max:1,errors:['time'],time:600000}).then((collected) =>{
                    const urlz = collected.first().content;
                    console.log(urlz);
                    if(!(urlz.startsWith("https") || urlz.startsWith("http"))) return msg.channel.send({embeds:[expired]});
                    url = urlz;

                    if(headersbool){
                      msg.channel.send({embeds:[headerz]}).then(msg =>{
                        msg.channel.awaitMessages({filter:messagefilter,max:1,errors:['time'],time:600000}).then((collected) =>{
                          const header1 = collected.first().content;
                          if(!(header1.includes(":"))) return msg.channel.send({embeds:[expired]});
                       const args = header1.split("\n");
              
                       for(let i=0; i<args.length; i++){
                        headers[args[i].split(":")[0].replace(' ', '')] = args[i].split(":")[1].replace(' ', '');
                       }
                     
                   

                                          

                    if(method.includes("POST")){
                      msg.channel.send({embeds:[postz]}).then(msg =>{
                        msg.channel.awaitMessages({filter:messagefilter,max:1,errors:['time'],time:600000}).then((collected) =>{
                          data = collected.first().content;

                          axios({
                            method: method,
                            url: url,
                            headers:headers,
                            data: data

                          
                          }).then(async r =>{
                   
                            fs.writeFileSync(`${message.author.id}.txt`, JSON.stringify(r.data));
                            const responsedata = new Discord.EmbedBuilder()
                            .setColor(0x0099FF)
                            .setAuthor({name:msg.author.username,iconURL:msg.author.avatarURL()})
                            .setDescription("Done!")
                            .addFields({name:"Status",value:'```Status Code : ' + r.status + '```'})
                            .setThumbnail(msg.author.avatarURL());
                            await msg.channel.send({embeds:[responsedata]});
                            await msg.channel.send({files:[`${message.author.id}.txt`]})
                            await fs.unlinkSync(`${message.author.id}.txt`);
                            config["request_count"] = config["request_count"] + 1
                            await fs.writeFileSync(`./config.json`, JSON.stringify(config));
                            await cooldownarray.push(message.author.id);
                            await setTimeout(() =>{
                             for(let i=0; i<cooldownarray.length; i++){
                              if(cooldownarray[i].includes(message.author.id)){
                                cooldownarray.splice(i,1);
                              }
                             }
                            },60000);
                          }).catch(async (err)  =>{
                            if(err.response){
                              fs.writeFileSync(`${message.author.id}.txt`, JSON.stringify(err.response.data));
                              const responsedata = new Discord.EmbedBuilder()
                              .setColor(0x0099FF)
                              .setAuthor({name:msg.author.username,iconURL:msg.author.avatarURL()})
                              .setDescription("Done!")
                              .addFields({name:"Status",value:'```Status Code : ' + err.response.status + '```'})
                              .setThumbnail(msg.author.avatarURL());
                              await msg.channel.send({embeds:[responsedata]});
                              await msg.channel.send({files:[`${message.author.id}.txt`]})
                              await fs.unlinkSync(`${message.author.id}.txt`);
                              config["request_count"] = config["request_count"] + 1
                              await fs.writeFileSync(`./config.json`, JSON.stringify(config));
                              await cooldownarray.push(message.author.id);
                            await setTimeout(() =>{
                             for(let i=0; i<cooldownarray.length; i++){
                              if(cooldownarray[i].includes(message.author.id)){
                                cooldownarray.splice(i,1);
                              }
                             }
                            },60000);
                            }else{
                              console.log(err);
                              msg.channel.send({embeds:[expired]});
                            }
                            
                          });


                        }).catch(err =>{
                          console.log(err);
                          msg.channel.send({embeds:[expired]});

                        });
                      });
                    }else{
                                    
                    axios({
                      method: method,
                      url: url,
                      headers:headers,

                    
                    }).then(async r =>{
                      fs.writeFileSync(`${message.author.id}.txt`, JSON.stringify(r.data));
                      const responsedata = new Discord.EmbedBuilder()
                      .setColor(0x0099FF)
                      .setAuthor({name:msg.author.username,iconURL:msg.author.avatarURL()})
                      .setDescription("Done!")
                      .addFields({name:"Status",value:'```Status Code : ' + r.status + '```'})
                      .setThumbnail(msg.author.avatarURL());
                      await msg.channel.send({embeds:[responsedata]});
                      await msg.channel.send({files:[`${message.author.id}.txt`]})
                      await fs.unlinkSync(`${message.author.id}.txt`);
                      await cooldownarray.push(message.author.id);
                            await setTimeout(() =>{
                             for(let i=0; i<cooldownarray.length; i++){
                              if(cooldownarray[i].includes(message.author.id)){
                                cooldownarray.splice(i,1);
                              }
                             }
                            },60000);
                    }).catch(async (err)  =>{
                      if(err.response){
                        fs.writeFileSync(`${message.author.id}.txt`, JSON.stringify(err.response.data));
                        const responsedata = new Discord.EmbedBuilder()
                        .setColor(0x0099FF)
                        .setAuthor({name:msg.author.username,iconURL:msg.author.avatarURL()})
                        .setDescription("Done!")
                        .addFields({name:"Status",value:'```Status Code : ' + err.response.status + '```'})
                        .setThumbnail(msg.author.avatarURL());
                        await msg.channel.send({embeds:[responsedata]});
                        await msg.channel.send({files:[`${message.author.id}.txt`]})
                        await fs.unlinkSync(`${message.author.id}.txt`);
                        config["request_count"] = config["request_count"] + 1
                        await fs.writeFileSync(`./config.json`, JSON.stringify(config));
                        await cooldownarray.push(message.author.id);
                            await setTimeout(() =>{
                             for(let i=0; i<cooldownarray.length; i++){
                              if(cooldownarray[i].includes(message.author.id)){
                                cooldownarray.splice(i,1);
                              }
                             }
                            },60000);
                      }else{
                        console.log(err);
                        msg.channel.send({embeds:[expired]});
                      }
                    });
                    }

      

                        }).catch(err =>{
                          console.log(err);
                          msg.channel.send({embeds:[expired]});

                        });
                      });
                    }else{
                                         

                    if(method.includes("POST")){
                      msg.channel.send({embeds:[postz]}).then(msg =>{
                        msg.channel.awaitMessages({filter:messagefilter,max:1,errors:['time'],time:600000}).then((collected) =>{
                          data = collected.first().content;

                          axios({
                            method: method,
                            url: url,
                            data: data

                          
                          }).then(async r =>{
                            fs.writeFileSync(`${message.author.id}.txt`, JSON.stringify(r.data));
                            const responsedata = new Discord.EmbedBuilder()
                            .setColor(0x0099FF)
                            .setAuthor({name:msg.author.username,iconURL:msg.author.avatarURL()})
                            .setDescription("Done!")
                            .addFields({name:"Status",value:'```Status Code : ' + r.status + '```'})
                            .setThumbnail(msg.author.avatarURL());
                            await msg.channel.send({embeds:[responsedata]});
                            await msg.channel.send({files:[`${message.author.id}.txt`]})
                            await fs.unlinkSync(`${message.author.id}.txt`);
                            config["request_count"] = config["request_count"] + 1
                            await fs.writeFileSync(`./config.json`, JSON.stringify(config));
                            await cooldownarray.push(message.author.id);
                            await setTimeout(() =>{
                             for(let i=0; i<cooldownarray.length; i++){
                              if(cooldownarray[i].includes(message.author.id)){
                                cooldownarray.splice(i,1);
                              }
                             }
                            },60000);
                          }).catch(async (err)  =>{
                            if(err.response){
                              fs.writeFileSync(`${message.author.id}.txt`, JSON.stringify(err.response.data));
                              const responsedata = new Discord.EmbedBuilder()
                              .setColor(0x0099FF)
                              .setAuthor({name:msg.author.username,iconURL:msg.author.avatarURL()})
                              .setDescription("Done!")
                              .addFields({name:"Status",value:'```Status Code : ' + err.response.status + '```'})
                              .setThumbnail(msg.author.avatarURL());
                              await msg.channel.send({embeds:[responsedata]});
                              await msg.channel.send({files:[`${message.author.id}.txt`]})
                              await fs.unlinkSync(`${message.author.id}.txt`);
                              config["request_count"] = config["request_count"] + 1
                              await fs.writeFileSync(`./config.json`, JSON.stringify(config));
                              await cooldownarray.push(message.author.id);
                              await setTimeout(() =>{
                               for(let i=0; i<cooldownarray.length; i++){
                                if(cooldownarray[i].includes(message.author.id)){
                                  cooldownarray.splice(i,1);
                                }
                               }
                              },60000);
                            }else{
                              console.log(err);
                              msg.channel.send({embeds:[expired]});
                            }
                          });


                        }).catch(err =>{
                          console.log(err);
                          msg.channel.send({embeds:[expired]});

                        });
                      });
                    }else{
                                      
                    axios({
                      method: method,
                      url: url,
                      headers:headers,

                    
                    }).then(async r =>{
                      fs.writeFileSync(`${message.author.id}.txt`, JSON.stringify(r.data));
                      const responsedata = new Discord.EmbedBuilder()
                      .setColor(0x0099FF)
                      .setAuthor({name:msg.author.username,iconURL:msg.author.avatarURL()})
                      .setDescription("Done!")
                      .addFields({name:"Status",value:'```Status Code : ' + r.status + '```'})
                      .setThumbnail(msg.author.avatarURL());
                      await msg.channel.send({embeds:[responsedata]});
                      await msg.channel.send({files:[`${message.author.id}.txt`]})
                      await fs.unlinkSync(`${message.author.id}.txt`);
                      config["request_count"] = config["request_count"] + 1
                      await fs.writeFileSync(`./config.json`, JSON.stringify(config));
                      await cooldownarray.push(message.author.id);
                            await setTimeout(() =>{
                             for(let i=0; i<cooldownarray.length; i++){
                              if(cooldownarray[i].includes(message.author.id)){
                                cooldownarray.splice(i,1);
                              }
                             }
                            },60000);
                    }).catch(async (err) =>{
                      if(err.response){
                        fs.writeFileSync(`${message.author.id}.txt`, JSON.stringify(err.response.data));
                        const responsedata = new Discord.EmbedBuilder()
                        .setColor(0x0099FF)
                        .setAuthor({name:msg.author.username,iconURL:msg.author.avatarURL()})
                        .setDescription("Done!")
                        .addFields({name:"Status",value:'```Status Code : ' + err.response.status + '```'})
                        .setThumbnail(msg.author.avatarURL());
                        await msg.channel.send({embeds:[responsedata]});
                        await msg.channel.send({files:[`${message.author.id}.txt`]})
                        await fs.unlinkSync(`${message.author.id}.txt`);
                        config["request_count"] = config["request_count"] + 1
                        await fs.writeFileSync(`./config.json`, JSON.stringify(config));
                        await cooldownarray.push(message.author.id);
                            await setTimeout(() =>{
                             for(let i=0; i<cooldownarray.length; i++){
                              if(cooldownarray[i].includes(message.author.id)){
                                cooldownarray.splice(i,1);
                              }
                             }
                            },60000);
                      }else{
                        console.log(err);
                        msg.channel.send({embeds:[expired]});
                      }
                    });
                    }

    

                    }



                  }).catch(err =>{
                    console.log(err);
                    msg.channel.send({embeds:[expired]});
                  });
                  });


                  
               }).catch((err) =>{
                console.log(err);
                msg.channel.send({embeds:[expired]});
               });
          });
       }).catch((err) =>{
        console.log(err);
        msg.channel.send({embeds:[expired]});
      });
    });
    

    
}
}
});

client.login(process.env.token);