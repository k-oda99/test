// -----------------------------------------------------------------------------
// モジュールのインポート
const server = require("express")();
const line = require("@line/bot-sdk"); // Messaging APIのSDKをインポート

// -----------------------------------------------------------------------------
// パラメータ設定
const line_config = {
    channelAccessToken: process.env.LINE_ACCESS_TOKEN, // 環境変数からアクセストークンをセットしています
    channelSecret: process.env.LINE_CHANNEL_SECRET // 環境変数からChannel Secretをセットしています
};

// -----------------------------------------------------------------------------
// Webサーバー設定
server.listen(process.env.PORT || 3000);


// APIコールのためのクライアントインスタンスを作成
const bot = new line.Client(line_config);

// -----------------------------------------------------------------------------
// ルーター設定
server.post('/bot/webhook', line.middleware(line_config), (req, res, next) => {
    // 先行してLINE側にステータスコード200でレスポンスする。
    res.sendStatus(200);

    // すべてのイベント処理のプロミスを格納する配列。
    let events_processed = [];

    // イベントオブジェクトを順次処理。
    req.body.events.forEach((event) => {
        // この処理の対象をイベントタイプがメッセージで、かつ、テキストタイプだった場合に限定。
        if (event.type == "message" && event.message.type == "text"){
            // ユーザーからのテキストメッセージが「こんにちは」だった場合のみ反応。
            if (event.message.text == "カレンダー"){
                // replyMessage()で返信し、そのプロミスをevents_processedに追加。
                events_processed.push(bot.replyMessage(event.replyToken, {
                    type: "text",
                    text: "次の通院予定日は○月×日です！"
                }));
            }
        }
    });

    // すべてのイベント処理が終了したら何個のイベントが処理されたか出力。
    Promise.all(events_processed).then(
        (response) => {
            console.log(`${response.length} event(s) processed.`);
        }
    );
});

// const job = schedule.scheduleJob({
//     hour: 22,
//     minute: 05
//   }, function () {
//     var CHANNEL_ACCESS_TOKEN = 'AIK5oi6wDOmcuAhFyIJRYeewDfN8pttKrxTKv6EECY/ypTeh2D0ktRVmOCFsb6yhT+cbAWCaZEhKb499LRfi5lkQ+7gbXS1y/NKPw4EztxjPR+mlylgqpdi3rofH8DHIku/dlbdXorc6TrJZzq0/ewdB04t89/1O/w1cDnyilFU='; 
//     var USER_ID = 'Ue0ca3d3774092cd3ca5bbfed18e367b0';

//     function pushMessage() {
//         //deleteTrigger();
//     var postData = {
//         "to": USER_ID,
//         "messages": [{
//         "type": "text",
//         "text": "おはよう",
//         }]
//     };

//     var url = "https://api.line.me/v2/bot/message/push";
//     var headers = {
//         "Content-Type": "application/json",
//         'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
//     };

//     var options = {
//         "method": "post",
//         "headers": headers,
//         "payload": JSON.stringify(postData)
//     };
//     var response = UrlFetchApp.fetch(url, options);
//     }

//     pushMessage();
//   })