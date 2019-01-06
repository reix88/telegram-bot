// Подключение API
    var TelegramBot = require('node-telegram-bot-api');
// Токен от BotFather
    var token = 'ваш_токен';

    var botOptions = {polling: true};
    var bot = new TelegramBot(token, botOptions);
    var notes = [];

// NodeJs (Запись Логов)
    var fs = require("fs");
    var jsonfile = require('jsonfile');


// Выводится в Терминале при подключения Bot-a
bot.getMe().then(function(me) {
    console.log('Hello! My name is %s!', me.first_name);
    console.log('My id is %s.', me.id);
    console.log('And my username is @%s.', me.username);
});

// Функции для Кодирования и Декодирования
function dec2hex(a) {
    return Number(parseInt(a, 10)).toString(16)
}

function dec2bin(a) {
    return Number(parseInt(a, 10)).toString(2)
}

function bin2dec(a) {
    return parseInt(a, 2)
}

function bin2hex(a) {
    return Number(parseInt(a, 2)).toString(16)
}

function hex2dec(a) {
    return parseInt(a, 16)
}

function hex2bin(a) {
    return Number(parseInt(a, 16)).toString(2)
}

function buildOctet(a) {
    for (var d = 8 - a.length, b = 0; b < d; b += 1) a = "0" + a;
    return a
}

function text2bin(a) {
    for (var d = "", b = [], c = a.length, b = "", e = 0; e < c; e += 1) b = encodeURIComponent(a.charAt(e)).split("%"), 2 < b.length ? (b = b[1] + b[2], d += hex2bin(b)) : d += buildOctet(dec2bin(a.charCodeAt(e)));
    return d
}

function bin2text(a) {
    for (var d = a.length >> 3, b = [], c = 0; c < d; c += 1) b[c] = a.substr(c << 3, 8);
    a = b.length;
    d = "";
    for (c = 0; c < a; c += 1)
        if ("110" === b[c].substr(0, 3)) {
            try {
                d += decodeURIComponent("%" + bin2hex(b[c]) + "%" + bin2hex(b[c + 1]))
            } catch (e) {
                continue
            }
            c += 1
        } else d += String.fromCharCode(bin2dec(b[c]));
    return d
};


// Команда /help
bot.onText(/\/help/, (msg) => {
    var userId = msg.chat.id;
    var messageText = msg.text;
    var messageDate = msg.date;
    var messageUsr = msg.from.username;

    var help = "Команды:\n\
/encode    текст_сообщения\n\
/decode    двоичный_код\n\
\n\
Пример:\n\
Я:  /encode Hello, World!\n\
Бот:  01001000 01100101 01101100 01101100 01101111 00101100 00100000 01010111 01101111 01110010 01101100 01100100 00100001\n\
\n\
Я:  /decode 01001000 01100101 01101100 01101100 01101111 00101100 00100000 01010111 01101111 01110010 01101100 01100100 00100001\n\
Бот:  Hello, World!";

    bot.sendMessage(userId, help);
    console.log(msg);

    // Запись логов
    var json = JSON.stringify(msg);
    fs.appendFileSync("log.txt", json);
});


// Команда /encode
bot.onText(/\/encode (.+)/, function(msg, match) {
    var userId = msg.chat.id;
    var messageText = msg.text;
    var messageDate = msg.date;
    var messageUsr = msg.from.username;

    var text = match[1];
    notes.push({
        'uid': userId,
        'text': text
    });

    bot.sendMessage(userId, text2bin(text));
    console.log(msg);

    var json = JSON.stringify(msg);
    fs.appendFileSync("log.txt", json);
});



// Команда /decode
bot.onText(/\/decode (.+)/, function(msg, match) {
    var userId = msg.chat.id;
    var messageText = msg.text;
    var messageDate = msg.date;
    var messageUsr = msg.from.username;

    var text = match[1];
    notes.push({
        'uid': userId,
        'text': text
    });

    bot.sendMessage(userId, bin2text(text));
    console.log(msg);

    var json = JSON.stringify(msg);
    fs.appendFileSync("log.txt", json);
});