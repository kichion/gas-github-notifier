function isHoliday(){
  var today = new Date();

  //土日か判定
  var weekInt = today.getDay();
  if(weekInt <= 0 || 6 <= weekInt){
    return true;
  }

  //祝日か判定
  var calendarId = "ja.japanese#holiday@group.v.calendar.google.com";
  var calendar = CalendarApp.getCalendarById(calendarId);
  var events = calendar.getEventsForDay(today);
  if(events.length > 0){
    return true;
  }
 
  return false;
}
