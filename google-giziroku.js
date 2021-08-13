// 議事録の自動作成システム

function getEvent() {
  var calendarId = 'hideya400@gmail.com';
  var myCalendar = CalendarApp.getCalendarById(calendarId); //カレンダー情報取得

  var date = new Date(); //取得開始日
  date.setDate(date.getDate()+1);
  var myEvents = myCalendar.getEventsForDay(date);
  // Logger.log(myEvents);

  var filteredEvents = myEvents.filter(function(myEvent){
    var title = myEvent.getTitle();
    if(title.indexOf('MTG') != -1){ //MTGの文字を含むものだけ取得する
      return true;
    }
  });


  return filteredEvents;
}

//議事録のフォルダを取得
//議事録フォルダのURLが必須 https://----/folders/以降のIDのみ使用する
function createDocument(){

  var events = getEvents();
  events.forEach(function(event){
    var startTime = event.getStartTime();
    startTime = Utilities.formatDate(startTime, 'Asia/Tokyo', 'yyyy/MM/dd HH:mm');
    var endTime = event.getEndTime();
    endTime = Utilities.formatDate(endTime, 'Asia/Tokyo', 'HH:mm');
    mtgTitle = event.getTitle().split('G')[1]; //MTGの後のタイトル内容を取得
    var guests = event.getGuestList(true).map(function(guest){return guest.getName()}); //ゲストの名前を取得

    var date = new Date();
    date.setDate(date.getDate()+1);
    date = Utilities.formatDate(date, 'Asia/Tokyo', 'yyyy/MM/dd');

    var folder = DriveApp.getFolderById('urlIdを記述する'); //googleドライブのフォルダ指定
    var doc = DocumentApp.create(date+'_'+mtgTitle);

    var docFile = DriveApp.getFileById(doc.getId());
    folder.addFile(docFile);//ファイルの追加

    var body = doc.getBody();//ファイルの中身を取得
    var par1 = body.appendParagraph('議事録');//ファイルの中身を記述追加
    par1.setHeading(DocumentApp.ParagraphHeading.TITLE);//文字を大きく変換
    par1.setAlignment(DocumentApp.HorizontalAlignment.CENTER);//文字をセンターに配置

    var par2 = body.appendParagraph('概要');
    par2.setHeading(DocumentApp.ParagraphHeading.HEADING2);

    body.appendListItem('日時:'+startTime+'~'+endTime).setGlyphType(DocumentApp.GlyphType.BULLET);//.setGlyphType(DocumentApp.GlyphType.BULLET)黒丸を出力
    body.appendListItem('場所:'+place).setGlyphType(DocumentApp.GlyphType.BULLET);
    body.appendListItem('議題:'+mtgTitle).setGlyphType(DocumentApp.GlyphType.BULLET);
    body.appendListItem('出席者:'+guests).setGlyphType(DocumentApp.GlyphType.BULLET);

    var par3 = body.appendParagraph('議事録内容');
    par3.setHeading(DocumentApp.ParagraphHeading.HEADING2);
    body.appendParagraph('');

    var par4 = body.appendParagraph('決定事項');
    par4.setHeading(DocumentApp.ParagraphHeading.HEADING2);
    body.appendParagraph('');
  });
}