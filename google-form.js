function sendEmail(e) {
  var itemResponses = e.response.getItemResponses();

  var name = itemResponses[0].getResponse();
  var email = itemResponses[1].getResponse();
  var schdule = itemResponses[2].getResponse();

  var to = email;
  var subject = 'イベント申し込み確認メール';
  var body = '\
    ${name}様\n\n\
    お申し込みありがとうございます。\n\
    [日程]:${schdule}'.replace('${name}', name).replace('${schdule}', schdule);
  GmailApp.sendEmail(to, subject, body);
}

function notifyLine(e){
  var itemResponses = e.response.getItemResponses();

  var name = itemResponses[0].getResponse();
  var email = itemResponses[1].getResponse();
  var schdule = itemResponses[2].getResponse();
  
  const ACCESS_TOKEN = 'トークンを記述する';

  var url = 'LineURLを記述する';

  var heaaders = {
    'Content-Type': 'application/json; charset=UTF-8',
    'Authorization': 'Bearer '+ACCESS_TOKEN
  };

  var message = '[通知]\n下記日程に申し込みが入りました。${schdule}'.replace('${name}', name).replace('${schdule}', schdule);

  var data = {
    'to': USER_ID,
    'messages': [
      {
        'type': 'text',
        'text': message
      }
    ]
  };

  var options = {
    'method': 'post',
    'headers': heaaders,
    'payload': JSON.stringify(data)
  };

  UrlFetchApp.fetch(url,options);

}
