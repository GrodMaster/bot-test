const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const token = '5623717286:AAFgkQf9FLPNR3HJpDE4T-xfTZGcmbTDUYU'

const bot = new TelegramApi(token, {polling: true})

const chats = {};


const startGame = async (chatId)=>{
    await bot.sendMessage(chatId, 'Я сейчас загадаю число от 0 до 9, а ты должен угадать');
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Погнали', gameOptions)
}

const start = ()=>{
    bot.setMyCommands([
        {command: '/start', description:'Начальное приветствие'},
        {command: '/info', description:'Информация'},
        {command: '/game', description: 'Мини игра "Угадай число"'}
    ])
    
    bot.on('message',async msg=>{
        const text = msg.text;
        const chatId = msg.chat.id;
    
        if(text === '/start'){
            await  bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/7.webp')
            return  bot.sendMessage(chatId, `Добро пожаловать в бот` )
        }
        if(text === '/info'){
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}, твой логин #${msg.from.username}`)
        }
        if(text === '/game'){
            return startGame(chatId)
        }
        return (
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/1.webp'),
            await bot.sendMessage(chatId, 'Я тебя не понял, попробуй еще раз')
        )
    })
    bot.on('callback_query',msg =>{
        const data = msg.data;
        const chatId = msg.message.chat.id
        if(data === '/again'){
            return startGame(chatId)
        }
        if(data === chats[chatId]){
            return bot.sendMessage(chatId, `Поздравляю, ты угадал ${chats[chatId]}!`, againOptions)
        }else{
            return bot.sendMessage(chatId, `К сожалению не угадал! ${chats[chatId]}`, againOptions)
        }
    })
}

start()