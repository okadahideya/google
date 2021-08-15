//webページからデータを取得し、グラフ化を行い、自動で毎日更新する

function scraping() {
  var url = 'webページURLを記述';
  var response = UrlFetchApp.fetch(url);
  var content = response.getContentText('UTF-8');//responseを整える

  //受講者数の数
  var parser = Parser.data(content);
  var subscribers = parser.from('<p class="subscribers">').to('</p>').build();//HTML内部でどこからどこまで取得するか指定
  subscribers = Number(subscribers.split('：')[1]);

  //レビューの数
  var reviews = parser.from('<p class="reviews">').to('</p>').build();
  reviews = Number(reviews.split('：')[1]);
  //Logger.log(reviews);//typeofで型を確認可能

  var today = new Date();
  return[today, subscribers, reviews];//配列にまとめる
}

function writeData(){
  var results = scraping();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('データ');

  var lastRow = sheet.getLastRow();
  sheet.getRange(lastRow+1,1,1,3).setValues([results]);
  
}
