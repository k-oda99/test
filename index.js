// -----------------------------------------------------------------------------
// モジュールのインポート
const server = require("express")();
const line = require("@line/bot-sdk"); // Messaging APIのSDKをインポート
var schedule = require( 'node-schedule' );

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
            switch(event.message.text) {
                case "次の通院日":
                    events_processed.push(bot.replyMessage(event.replyToken, {
                        type: "text",
                        text: "次の通院予定日は○月×日です！"
                    }));
                case "はい":
                    events_processed.push(bot.replyMessage(event.replyToken, {
                        type: "text",
                        text: "今日も1日お疲れ様でした！😆\nおやすみなさい😴"
                    }));
                case "いいえ":
                    events_processed.push(bot.replyMessage(event.replyToken, {
                        type: "text",
                        text: "15分後にリマインドしますね！☺"
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

server.get('/bot/webhook', (req, res) => {
    // 先行してLINE側にステータスコード200でレスポンスする。
    res.sendStatus(200);

    console.log('プロファイル：')
    bot.getProfile().then(result => {
        console.log(result)
      });
    
    const message = {
        type: 'text',
        text: '服薬の準備はできていますか？',
        quickReply: {
            items: [
              {
                type: "action",
                imageUrl: "https://example.com/sushi.png",
                action: {
                  type: "message",
                  label: "はい",
                  text: "はい"
                }
              },
              {
                type: "action",
                imageUrl: "https://example.com/tempura.png",
                action: {
                  type: "message",
                  label: "いいえ",
                  text: "いいえ"
                }
              }
            ]
        }
    };

    function send () {
        bot.pushMessage('Ue0ca3d3774092cd3ca5bbfed18e367b0', message)
        .then(() => {
        
        })
        .catch((err) => {
        // error handling
        });
    }
    setTimeout(send, 5000)
});

// schedule.scheduleJob( '* * * * *', function(){
//     const message = {
//         type: 'text',
//         text: 'Hello World!'
//     };
    
//     bot.pushMessage('Ue0ca3d3774092cd3ca5bbfed18e367b0', message)
//         .then(() => {
        
//         })
//         .catch((err) => {
//         // error handling
//         });
// });