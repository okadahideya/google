// gmailを取得して、スプレットシートに出力する

function getMessage() {
  var condition = 'has:attachment';
  var start = 0;
  var max = 20; //何件抽出するか
  var threads = GmailApp.search(condition, start, max);
  var messages = GmailApp.getMessagesForThreads(threads); //メール内容を取得

  var ss = SpreadsheetApp.getActiveSpreadsheet(); //スプレットシートを取得
  var ss = sheet = ss.getSheetByName('メール一覧'); //シート指定

  var firstRow = 2; //スイプレットシートの行を指定
  
  messages.forEach(function(message){
  var body = message[0].getPlainBody();

  var date = message[0].getDate();
  var numbers = body.split('認証番号 : ')[1].split('カ')[0]; //メールの一部取得
  var url = body.split('リンク : ')[1].split('-')[0];


  var data = [date, numbers, url]; //上記の変数をまとめる

  sheet.getRange(firstRow,1,1,data.length).setValues([data]); //スプレットシートに出力

  firstRow++; //足して次の行
  });
}