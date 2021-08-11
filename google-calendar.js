// シフト表作成と同時にメールで共有
function reflectCalendar() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
 
  var sheetShift = ss.getSheetByName('シフト表');
  var sheetMember = ss.getSheetByName('メンバー');
  var sheetRule = ss.getSheetByName('シフト規則');
 
  var _members = sheetMember.getRange('B3:C5').getValues();
  var members = {};
  _members.forEach(function(_members){
    members[_members[0]] = _members[1];
  });
 //  Logger.log(members);
 
  var _rules = sheetRule.getRange('B3:D5').getValues();
  var rules = {};
  _rules.forEach(function(_rules){
    rules[_rules[0]] = {'start':_rules[1], 'end':_rules[2]};
  });
 //  Logger.log(rules);
 
  var firstRow = 6;
  var firstColumn = 4;
 
  var lastRow = sheetShift.getLastRow(); //最後の行の取得
  var lastColumn = sheetShift.getLastColumn(); //最後のカラムの取得
 
  var year = sheetShift.getRange('B2').getValue(); //年
  var month = sheetShift.getRange('C2').getValue(); //月
 
  for(var row=firstRow; row<=lastRow; row++){
   var title = 'バイト';
   var name = sheetShift.getRange(row,2).getValue();
   
   var email = members[name];
 
   for(var column=firstColumn; column<=lastColumn; column++){
     var day  = sheetShift.getRange(4,column).getValue(); //日付
     var shift = sheetShift.getRange(6,column).getValue(); //シフト情報
     
     if(shift != '休'){
       var startTimeHour = rules[shift]['start'].getHours();
       var endTimeHour = rules[shift]['end'].getHours();
 
       var startTime = new Date(year, month-1, day, startTimeHour, 00);
       var endTime = new Date(year, month-1, day, endTimeHour, 00);
 
       createEvent(title, startTime, endTime, email);
     }
   }
  }
 
 }
 
 function createEvent(title, startTime, endTime, email){
   var calendar = CalendarApp.getDefaultCalendar();
   options = {
     // guests: email
   }
 
   calendar.createEvent(title,startTime,endTime);
 }
 