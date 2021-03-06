const config2 = require('./config2.json');
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const cron = require('node-cron');
const puppeteer = require('puppeteer')

let lines = [];
let browser;


if(!fs.existsSync("juomat.json"))
    fs.writeFileSync("juomat.json", JSON.stringify({
        drinks: ['lonkero', 'kahvi', 'tee', 'keitto', 'siideri', 'vesi',
        'iso olut', 'mehu/energiajuoma', 'limukka/vichy', 'double salted vichy', 'lämmin olut', 'gatorade'],
        next_drink: ''
    }));

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(config2.TOKEN, {polling: true});

// Creates a temporary array which includes all the files from the 
// directory. The array changes while running the bot.
let temp_files = fs.readdirSync(config2.DIRECTORY);


// Interacts with the user when the user gives /start command.
// Creates a button containing a command, when pushed, user sends the
// corresponding message.
bot.onText(/\/start/i, (msg) => {
    
    bot.sendMessage(msg.chat.id, "hölökyn kölökyn", {
        "reply_markup": {
            "keyboard": [["/kaatuminen"], ["/quote"], ["/kolikko"]]
            }
        });       
});

bot.onText(/\/quote/i, (msg) => {

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



bot.onText(/\/addq/i,(msg) => {

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

bot.onText(/\/äpö/i,(msg) => {

    // Checks the time of the message and refers it to current time.
    // Is used to ignore messages while the bot is offline.
    // In this instance, the users messages are ignored if they are
    // older than five seconds.

    if (Date.now() - parseInt(msg.date)*1000 > 5000) {
        return;
    }

    let time = msg.text.substring(5)

    let link = config2.FOOD_LINK
    
    bot.sendPoll(msg.chat.id, "Mihkä tänää äpölle " + time + "?",
                [("Lé Reaktor"),("Newton"),("Hertsi"),("Café tietokonehuone")], 
                {is_anonymous: "False"})

    /*
    bot.sendMessage( msg.chat.id, "kopaseha näkymä " + link, 
                    {parse_mode: 'MarkdownV2', disable_web_page_preview: "True"} )
                    */
    scrape(msg);

})

bot.onText(/\/ruokalista/i,(msg) => {

    // Checks the time of the message and refers it to current time.
    // Is used to ignore messages while the bot is offline.
    // In this instance, the users messages are ignored if they are
    // older than five seconds.

    if (Date.now() - parseInt(msg.date)*1000 > 5000) {
        return;
    }

    let time = msg.text.substring(5)

    let link = config2.FOOD_LINK
    
    // Sends a link to a food menu.
    bot.sendMessage( msg.chat.id, "nauti " + link, 
                    {parse_mode: 'MarkdownV2', disable_web_page_preview: "True"} )

})





bot.onText(/\/ryys/i,(msg) => {

    // Checks the time of the message and refers it to current time.
    // Is used to ignore messages while the bot is offline.
    // In this instance, the users messages are ignored if they are
    // older than five seconds.

    if (Date.now() - parseInt(msg.date)*1000 > 5000) {
        return;
    }

    // Sends a poll to ask about where to drink.
    bot.sendPoll(msg.chat.id, "Mihkä tänää ryys?",
                [("Pottiin"),("Kottiin"),("Kapina"), ("Penthouse")], 
                {is_anonymous: "False"})

})


bot.onText(/\/viis/i,(msg) => {

    // Checks the time of the message and refers it to current time.
    // Is used to ignore messages while the bot is offline.
    // In this instance, the users messages are ignored if they are
    // older than five seconds.

    if (Date.now() - parseInt(msg.date)*1000 > 5000) {
        return;
    }

    // Sends an empty gambina meeting template
    let filename = config2.GAMBINA
    let message = fs.readFileSync(filename)
    bot.sendMessage(msg.chat.id,message)

})


bot.onText(/\/dale/i,(msg) => {

    // Checks the time of the message and refers it to current time.
    // Is used to ignore messages while the bot is offline.
    // In this instance, the users messages are ignored if they are
    // older than five seconds.

    if (Date.now() - parseInt(msg.date)*1000 > 5000) {
        return;
    }


    // Randomizes an integer
   let random_num = Math.floor(Math.random() * 101)
    
   
    // If random integer is between 0 and 49, sends a dale photo.
   if(random_num >= 0 && random_num <= 49) {
    let file = config2.DALE + "dale_otto.png" 
       bot.sendPhoto(msg.chat.id,fs.readFileSync(file), {caption: "original dale"})
   
   } else {

    // In other cases (between 50-100), a photo of heads will be posted.
    let file = config2.DALE + "dale_original.png" 
    bot.sendPhoto(msg.chat.id,fs.readFileSync(file), {caption: "dale from wish"})
   }

})



bot.onText(/\/kolikko/i,(msg) => {

    // Checks the time of the message and refers it to current time.
    // Is used to ignore messages while the bot is offline.
    // In this instance, the users messages are ignored if they are
    // older than five seconds.

    if (Date.now() - parseInt(msg.date)*1000 > 5000) {
        return;
    }


    // Randomizes an integer
   let random_num = Math.floor(Math.random() * 101)
   
   
   // If random integer is between 0 and 49, sends a photo of tails
   if(random_num >= 0 && random_num <= 49) {
    let file = config2.COIN_DIRECTORY + "kruuna.png" 
       bot.sendPhoto(msg.chat.id,fs.readFileSync(file), {caption: "kruuna boi"})
   } else if (random_num == 50) {

    // Then again if integer is exactly 50, a rare coin will be sent.
    let file = config2.COIN_DIRECTORY  + "mayhem.png" 
    bot.sendPhoto(msg.chat.id,fs.readFileSync(file), {caption: "mayhemii isosti, kellota"})
   } else {

    // In other cases (between 51-100), a photo of heads will be posted.
    let file = config2.COIN_DIRECTORY + "klaava.png" 
    bot.sendPhoto(msg.chat.id,fs.readFileSync(file), {caption: "klaava boi"})
   }

})

// Interacts with the user when given a /kaatuminen command.
 bot.onText(/\/kaatuminen/i, (msg) => {
     
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


     
    

async function scrape(msg) {
    
   const browser = await puppeteer.launch({args: ['--no-sandbox']})
   const page = await browser.newPage()

   await page.goto('https://unisafka.fi/tty/')
   await page.setViewport({width:1200, height: 2000})
   await page.waitForTimeout(800)
   
   var picture = await page.screenshot({clip:{x: 25, y:122, width:1150,height:1130}})
   
    bot.sendPhoto(msg.chat.id,picture,{caption: config2.FOOD_LINK, parse_mode: 'MarkdownV2', disable_web_page_preview: "True"})

   browser.close()
}
async function get_tiktok_url(url)
{
    


    if (!browser)
        browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://musicaldown.com/en/', { waitUntil: "domcontentloaded" });
    await page.evaluate((url) => {
        document.getElementsByClassName('input-field col s12')[0].children[0].value = url;
        document.getElementsByClassName('input-field col s12')[1].children[0].click();
    }, url);
    await page.waitForNavigation({ waitUntil: "domcontentloaded" });
    let direct_url = await page.evaluate(() => {
        for (let elem of document.getElementsByClassName('btn'))
            if (elem.innerText.includes('DIRECT LINK'))
                return elem.href;
    });
    page.close();
    return direct_url;
}


bot.onText(/(www\.tiktok\.com)|(vm\.tiktok\.com)/,(msg) => {

    // Checks the time of the message and refers it to current time.
    // Is used to ignore messages while the bot is offline.
    // In this instance, the users messages are ignored if they are
    // older than five seconds.

    const axios = require('axios');
    

    if (Date.now() - parseInt(msg.date)*1000 > 5000) {
        return;
    }

    let url = msg.text
    
    get_tiktok_url(url).then(direct_url =>
        axios.get(direct_url, { responseType: 'arraybuffer' }).then(axios_response => {
            
                    
            bot.sendVideo(msg.chat.id,axios_response.data);
   
        }).catch(console.error));

});


    
