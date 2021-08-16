const config2 = require('./config2.json');
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

let lines = [];


// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(config2.TOKEN, {polling: true});

// Creates a temporary array which includes all the files from the 
// directory. The array changes while running the bot.
let temp_files = fs.readdirSync(config2.DIRECTORY);


// Interacts with the user when the user gives /start command.
// Creates a button containing a command, when pushed, user sends the
// corresponding message.
bot.onText(/\/start/, (msg) => {
    
    bot.sendMessage(msg.chat.id, "hölökyn kölökyn", {
        "reply_markup": {
            "keyboard": [["/kaatuminen"], ["/quote"], ["/kolikko"]]
            }
        });       
});

bot.onText(/\/quote/, (msg) => {

    // Checks the time of the message and refers it to current time.
    // Is used to ignore messages while the bot is offline.
    // In this instance, the users messages are ignored if they are
    // older than five seconds.

    if (Date.now() - parseInt(msg.date)*1000 > 5000) {
        return;
    }

    let filename = config2.QUOTES
    bot.sendMessage(msg.chat.id,get_line(filename))

})


bot.onText(/\/addq/,(msg) => {

    // Checks the time of the message and refers it to current time.
    // Is used to ignore messages while the bot is offline.
    // In this instance, the users messages are ignored if they are
    // older than five seconds.

    if (Date.now() - parseInt(msg.date)*1000 > 5000) {
        return;
    }

    let filename = config2.QUOTES
    let quote = msg.text.substring(6)
    fs.appendFileSync(filename, '\n' + quote)
    bot.sendMessage(msg.chat.id, "quottista")

})

bot.onText(/\/äpö/,(msg) => {

    // Checks the time of the message and refers it to current time.
    // Is used to ignore messages while the bot is offline.
    // In this instance, the users messages are ignored if they are
    // older than five seconds.

    if (Date.now() - parseInt(msg.date)*1000 > 5000) {
        return;
    }

    bot.sendPoll(msg.chat.id, "Mihkä tänää äpölle?",
                [("Lé Reaktor"),("Newton"),("Hertsi")], 
                {is_anonymous: "False"})

})


bot.onText(/\/viis/,(msg) => {

    // Checks the time of the message and refers it to current time.
    // Is used to ignore messages while the bot is offline.
    // In this instance, the users messages are ignored if they are
    // older than five seconds.

    if (Date.now() - parseInt(msg.date)*1000 > 5000) {
        return;
    }

    let filename = config2.GAMBINA
    let message = fs.readFileSync(filename)
    bot.sendMessage(msg.chat.id,message)

})



bot.onText(/\/kolikko/,(msg) => {

    // Checks the time of the message and refers it to current time.
    // Is used to ignore messages while the bot is offline.
    // In this instance, the users messages are ignored if they are
    // older than five seconds.

    if (Date.now() - parseInt(msg.date)*1000 > 5000) {
        return;
    }


    // Randomizes an integer
   let random_num = Math.floor(Math.random() * 101)
   if(random_num >= 0 && random_num <= 49) {
    let file = config2.COIN_DIRECTORY + "kruuna.png" 
       bot.sendPhoto(msg.chat.id,fs.readFileSync(file), {caption: "kruuna boi"})
   } else if (random_num == 50) {
    let file = config2.COIN_DIRECTORY  + "mayhem.png" 
    bot.sendPhoto(msg.chat.id,fs.readFileSync(file), {caption: "mayhemii isosti, kellota"})
   } else {
    let file = config2.COIN_DIRECTORY + "klaava.png" 
    bot.sendPhoto(msg.chat.id,fs.readFileSync(file), {caption: "klaava boi"})
   }

})

// Interacts with the user when given a /kaatuminen command.
 bot.onText(/\/kaatuminen/, (msg) => {
     
    // Checks the time of the message and refers it to current time.
    // Is used to ignore messages while the bot is offline.
    // In this instance, the users messages are ignored if they are
    // older than five seconds.
    if (Date.now() - parseInt(msg.date)*1000 > 5000) {
        return;
    }
    
    // Checks how many files the array contains currently
    var file_amount = temp_files.length;

    // If the array is empty, it will be refilled.
    if (file_amount == 0) {
        bot.sendMessage(msg.chat.id, "vidusti kaatumista lol")
        temp_files = fs.readdirSync(config2.DIRECTORY);
    }

    // Creates a random index.
    var random = Math.floor(Math.random() * file_amount)

    // Determines the path for the video that will be sent to the user.
    let file = config2.DIRECTORY + temp_files[random]

    // Deletes the corresponding video from the files array to avoid
    // duplicate videos in the current loop.
    temp_files.splice(random,1)
    let koira = fs.readFileSync(file)


    // Sends the video to the user and adds a caption to it.
    bot.sendVideo(msg.chat.id, fs.readFileSync(file),{caption: "yeet"})


 });


 function get_line(filename) {
        
    if(lines.length == 0) {
        var data = fs.readFileSync(filename, 'utf8');
        lines = data.split("\n");
    }
    
    
    let line_no = Math.floor(Math.random() * lines.length)

    if(+line_no > lines.length){
      throw new Error('ei löytynä');
    }
    let quote = lines[+line_no]
    lines.splice(+line_no,1)
    return quote;
}

