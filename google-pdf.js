//スプレットシートから申込・見積書・PDF・メールを自動で行う

function getInfo() {
  // スプレットシート d/~/editの間がidになる
  var ssForm = SpreadsheetApp.openById('19fuc0Lc7t2kQokOmeoUSJHzGpqSiHOE8EExHGG6G78k'); //スプレットシート取得
  var sheetForm = ssForm.getSheetByName('記入情報');

  var lastRow = sheetForm.getLastRow();

  var timestamp = sheetForm.getRange(lastRow,1).getValue();
  var companyName = sheetForm.getRange(lastRow,2).getValue();
  var person = sheetForm.getRange(lastRow,3).getValue();
  var email = sheetForm.getRange(lastRow,4).getValue();

  var documentNumber = lastRow-1; //見積書NO

  var item1 = sheetForm.getRange(lastRow,5,1,4).getValues();
  var item2 = sheetForm.getRange(lastRow,9,1,4).getValues();
  var item3 = sheetForm.getRange(lastRow,13,1,4).getValues();

  //セルの結合に対して、spliceを使用
  item1[0].splice(1,0,'','');
  item2[0].splice(1,0,'','');
  item3[0].splice(1,0,'','');


  //見積書のテンプレート
  var ssQuotation = SpreadsheetApp.openById('147v9NlpWsFddopCjRLmmwaKvE3n0rZIyITtvdrLk6h0');
  // var sheetQuotation = ssQuotation.getSheetByName('見積書書き込み');

  //シートの複製
  var now = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyyMMdd_hhmm');
  var sheetName = now + '_' + companyName;
  var sheetQuotation = ssQuotation.duplicateActiveSheet().setName(sheetName);
  var sheetId = sheetQuotation.getSheetId();//PDfにするためのid取得
  sheetQuotation.activate();
  
  //書き込み
  sheetQuotation.getRange('A4').setValue(companyName);
  sheetQuotation.getRange('A5').setValue(person +'　様');
  sheetQuotation.getRange('F12').setValue(documentNumber);

  sheetQuotation.getRange('A17:F17').setValues(item1);
  sheetQuotation.getRange('A18:F18').setValues(item2);
  sheetQuotation.getRange('A19:F19').setValues(item3);

  // PDF出力
  SpreadsheetApp.flush();

  // edit#ではなくexport?に変換することでExcel出力可能
  // edit#ではなくexport?exportFormat=pdf&に変換することでPDF出力可能
  // 最後の桁数は見積書のID
  var url = '見積書のURLを記述/export?exportFormat=pdf&gid=SID'.replace('SID',sheetId);
  
  //APIでの認証
  var token = ScriptApp.getOAuthToken();
  var response = UrlFetchApp.fetch(url,{
    headers:{
      'Authorization': 'Bearer '+ token //'Bearer 'スペース必須
    }
  });

  var date = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyyMMdd');
  var blob = response.getBlob().setName(date+'_'+companyName+'御中.pdf');

  //見積書の保存場所フォルダー指定
  var folder = DriveApp.getFolderById('folderのIDを記述');
  var file = folder.createFile(blob);

  var to = email;
  var subject = 'テストメール';
  var body = 'こちらはテストメールです';
  var options = {
    attachments: [file]// 添付ファイル
  };

  //アドレスにメール送信
  GmailApp.sendEmail(
    to,
    subject,
    body,
    options
  );

}
