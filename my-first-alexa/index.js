"use strict";

const Alexa = require('ask-sdk-core');

const fortunes = [
    { "score": "good", "description": "星みっつで良いでしょう" },
    { "score": "normal", "description": "星ふたつで普通でしょう" },
    { "score": "bad", "description": "星ひとつでイマイチでしょう" }
];

// 対話モデルで定義した、占いを実行するインテントのハンドラ
const HoroscopeIntentHandler = {
    canHandle(handlerInput) {
      const request = handlerInput.requestEnvelope.request;
      return request.type === 'IntentRequest'
        && request.intent.name === 'HoroscopeIntent';
    },
    handle(handlerInput) {
      const sign = handlerInput.requestEnvelope.request.intent.slots.StarSign.value; // スロットStarSignを参照
      const fortune = fortunes[Math.floor(Math.random() * 3)]; // ランダムに占い結果を取得
      const speechOutput = '今日の' + sign + 'の運勢は' + fortune.description; // 応答メッセージ文字列の作成
        console.log('sign: ', sign, ', fortune: ', fortune, ', speechOutput: ', speechOutput);

      // レスポンスの生成
      return handlerInput.responseBuilder
          .speak(speechOutput)
          .getResponse();
    },
};

// スキル起動時またはスキルの使い方を尋ねるインテントのハンドラ
const HelpHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'LaunchRequest'
            || (request.type === 'IntentRequest'
                && request.intent.name === 'AMAZON.HelpIntent');
    },
    handle(handlerInput) {
        const speechOutput = '今日の運勢を占います。' + 'たとえば、双子座の運勢を教えてと聞いてください';
        return handlerInput.responseBuilder
            .speak(speechOutput)
            .reprompt(speechOutput)
            .getResponse();
    },
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

        return handlerInput.responseBuilder.getResponse();
    },
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`Error handled: ${error.message}`);

        return handlerInput.responseBuilder
            .speak('Sorry, an error occurred.')
            .reprompt('Sorry, an error occurred.')
            .getResponse();
    },
};


const skillBuilder = Alexa.SkillBuilders.custom();

// Lambda関数のメイン処理
exports.handler = skillBuilder
    .addRequestHandlers(
        HoroscopeIntentHandler,
        HelpHandler,
        SessionEndedRequestHandler
    )
    .addErrorHandlers(ErrorHandler)
    .lambda();