Array.prototype.sortByAlphabetically = function(key) {
  return this.sort((a,b) => {
    if ( key ) {
      if ( a[key].toLowerCase() < b[key].toLowerCase() ) return -1;
      if ( a[key].toLowerCase() > b[key].toLowerCase() ) return 1;
    }else {
      if ( a.toLowerCase() < b.toLowerCase() ) return -1;
      if ( a.toLowerCase() > b.toLowerCase() ) return 1;
    }

    return 0;
  });
}

String.prototype.addDotNumber = function() {
  return this.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

String.prototype.addString = function (index, strToAdd) {
  return this.substring(0, index) 
    + strToAdd 
    + this.substring(index, this.length);
}

const replaceUrlTextHtml = (text, target = "_self") => 
  text
    // .replace(/\n/g, "( enter )")
    .replace(/(https?:\/\/[^\s]+)/g, url => {
      return `<a href="${url}" target="${target}">${url}</a>`;
    });
    // .replace(/\( enter \)/g, "\n");

const getQueryString =
  () => Object.fromEntries(
    (new URLSearchParams(window.location.search))
      .entries()
  );

const getData =
  (array, match = {}, limit = 0, sort = false) => {
    let l = 0;
    
    if ( sort ) {
      if ( sort.type && sort.type == "alphabetically" ) {
        array = array.sortByAlphabetically(sort.key);
      }else {
        array =
          array.sort(
            (a, b) => {
              if ( sort.order && sort.order == "asc" ) {
                return a[sort.key] - b[sort.key]
              }else {
                return b[sort.key] - a[sort.key]
              }
            }
          );
      }
    }

    return array.filter(
      a => {
        const isMatch = Object.keys(match).every(
          m => a[m] && a[m].toString().indexOf(match[m]) !== -1
        );

        if ( isMatch && ((limit !== 0 && l < limit) || limit === 0) ) {
          l++; return true;
        }

        return false;
      }
    )
  };

// Public Function

// const getCookie = function (name) {
//   let cookies = document.cookie.toString(), cIdx = 0, cookie = {}
  
//   if ( cookies != "" ) {
//     cookies = cookies.split(";")

//     while ( cIdx < cookies.length ) {
//       let key, val

//       key = cookies[cIdx].match(/^[^=]+/)
      
//       if ( key[0].replace(/\s+/, "") == "userExp" ) {
//         val = cookies[cIdx].substring(key[0].length + 1, cookies[cIdx].length)
//       }else {
//         val = cookies[cIdx].substring(key[0].length + 2, cookies[cIdx].length)
//       }

//       cookie[key[0].replace(/\s+/, "")] = val

//       cIdx++
//     }
//   }

//   if ( Object.keys(cookie).length == 0 ) {
//     cookie = []
//   }

//   return cookie
// }

const getCookie = function (name) {
  let cookies = document.cookie, cIdx = 0, cookie = []

  if ( cookies != "" ) {
    cookies = cookies.toString().split(";")
    cookie  = {}

    while ( cIdx < cookies.length ) {
      let c = cookies[cIdx].replace(/\s/g, "").split("=")
      if ( name ) {
        if ( c[0] == name ) {
          cookie[c[0]] = c[1]
        }
      }else {
        cookie[c[0]] = c[1]
      }
      cIdx++
    }
  }

  return cookie
}

const deleteAllCookies = () => {
  var cookies = document.cookie.split(";");

  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    var eqPos = cookie.indexOf("=");
    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
  }
}

const plusZero = function (num) { /*menambahkan angka 0 dari angka dibawah 10*/
  num = Number(num);
  return num < 10 ? '0' + num : num.toString();
}

// Returns the ISO week of the date.
Date.prototype.getWeek = function() {
  var date = new Date(this.getTime());
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  // January 4 is always in week 1.
  var week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
                        - 3 + (week1.getDay() + 6) % 7) / 7);
}

// Returns the four-digit year corresponding to the ISO week of the date.
Date.prototype.getWeekYear = function() {
  var date = new Date(this.getTime());
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  return date.getFullYear();
}

const getDates = function (year, month, week, date) {
  let resDates = []

  let m = 1 /*month*/
  while ( m <= 12 ) {
    let diw = 0
    let gdim = getDaysInMonth(m, year) /*mendapatkan hari dalam bulan tertentu*/

    let dim = 0 /*day in week*/
    while( dim < gdim.length ) {
      let splitGdim = gdim[dim].toString().split(' ')

      if ( !resDates[year] ) {
        resDates[year] = {}
      }

      if ( splitGdim[0] == 'Mon' ) {
        pushDates()
        if ( dim == (gdim.length - 1) ) {
          diw++
        }
      }else if ( splitGdim[0] == 'Sun' ) {
        pushDates()
        diw++
      }else {
        pushDates()
        if ( dim == (gdim.length - 1) ) {
          diw++
        }
      }

      // menambahkan data ke result array
      function pushDates() {
        if ( !month !== true && month != "" ) {
          if ( plusZero(gdim[dim].getMonth() + 1) == plusZero(month) ) {
            if ( !week !== true && week != "" ) {
              if ( (diw + 1) == Number(week) ) {
                if ( !date !== true && date != "" ) {
                  if ( plusZero(gdim[dim].getDate()) == plusZero(date) ) {
                    subPushDates(plusZero(month), week, date)
                  }
                }else {
                  subPushDates(plusZero(month), week, plusZero(gdim[dim].getDate()))
                }
              }
            }else {
              if ( !date !== true && date != "" ) {
                if ( plusZero(gdim[dim].getDate()) == plusZero(date) ) {
                  subPushDates(plusZero(month), plusZero(diw + 1), plusZero(gdim[dim].getDate()))
                }
              }else {
                subPushDates(plusZero(month), plusZero(diw + 1), plusZero(gdim[dim].getDate()))
              }
            }
          }
        }else if ( !week !== true && week != "" ) {
          if ( (diw + 1) == Number(week) ) {
            if ( !date !== true && date != "" ) {
              if ( plusZero(gdim[dim].getDate()) == plusZero(date) ) {
                subPushDates(plusZero(gdim[dim].getMonth() + 1), week, date)
              }
            }else {
              subPushDates(plusZero(gdim[dim].getMonth() + 1), week, plusZero(gdim[dim].getDate()))
            }
          }
        }else if ( !date !== true && date != "" ) {
          if ( plusZero(gdim[dim].getDate()) == plusZero(date) ) {
            subPushDates(plusZero(gdim[dim].getMonth() + 1), plusZero(diw + 1), plusZero(gdim[dim].getDate()))
          }
        }else {
          subPushDates(plusZero(gdim[dim].getMonth() + 1), plusZero(diw + 1), plusZero(gdim[dim].getDate()))
        }
      }

      function subPushDates(month, week, date) {
        if ( !resDates[year][month] ) {
          resDates[year][month] = {}
        }
        if ( !resDates[year][month][week] ) {
          resDates[year][month][week] = []
        }
        resDates[year][month][week].push(date)
      }

      dim++
    }
    m++
  }

  return resDates;
}

const dateSerialize = (dates) => {
  dates = new Date(dates);

  let date        = plusZero(dates.getDate());
  let month       = plusZero(dates.getMonth() + 1);
  let year        = dates.getFullYear();
  let hour        = plusZero(dates.getHours());
  let minute      = plusZero(dates.getMinutes());
  let second      = plusZero(dates.getSeconds());
  let weekInYear  = plusZero(dates.getWeek());
  let time        = hour + ':' + minute + ':' + second;
  let timestamp   = dates.getTime();
  let dateStr     = `${date} ${changeMonth(month, "fullEN")} ${year}`;

  let thisWeek    = Object.keys(getDates(year, month, null, date)[year][month])[0];
  let thisDate    = date
  let thisMonth   = Number(month)
  let thisYear    = year
  let thisHour    = Number(hour)
  let thisMinute  = minute
  let thisSecond  = second

  date              = year + '-' + month + '-' + date;

  let result        = {
    date, time, seconds : second, today : dates,
    thisYear, thisMonth, thisDate, thisHour, thisMinute, thisSecond,
    weekInYear, timestamp, thisWeek, dateStr
  };

  return result;
}

const currentTime = function () {
  return dateSerialize(new Date())
}


const getStrTime = dates => {
  const curTime = currentTime();
  dates         = dateSerialize(dates);
  const time    = dates.time.substring(0,5);

  const lastThan1Hour   = curTime.timestamp - (1000 * 60 * 59);
  const lastThan1Day    = curTime.timestamp - (1000 * 60 * 60 * 23 + (1000 * 60 * 59));
  const lastThan7Day    = curTime.timestamp - (1000 * 60 * 60 * 24 * 7);

  if ( dates.timestamp > lastThan1Hour ) {
    let minute;

    if ( dates.thisHour == curTime.thisHour ) {
      minute = Number(curTime.thisMinute) - Number(dates.thisMinute);
    }else {
      minute = 60 - Number(dates.thisMinute) + Number(curTime.thisMinute);
    }

    return minute + " minute ago";
  }else if ( dates.timestamp > lastThan1Day ) {
    const day   = Number(curTime.thisDate) - Number(dates.thisDate);

    if ( day === 0 ) {
      return "Today at " + time;
    }else if ( day === 1 ) {
      return "Yesterday at " + time;
    }else {
      return day + " day ago at " + time;
    }
  }else if ( dates.timestamp > lastThan7Day ) {
    const day = Number(curTime.thisDate) - Number(dates.thisDate);

    if ( day === 1 ) {
      return "Yesterday at " + time;
    }else {
      return day + " day ago at " + time;
    }
  }else {
    return changeDay(dates.date, "fullEN") + ", "
      + dates.thisDate + " "
      + changeMonth(dates.thisMonth, "fullEN") + " "
      + dates.thisYear + " at "
      + time;
  }
}

const getTimeString = date => {
  const curTime = dateSerialize(new Date());
  let result;
  date = dateSerialize(date)

  const timeRange = {
    year  : curTime.thisYear - date.thisYear,
    month : curTime.thisMonth - date.thisMonth,
    date  : curTime.thisDate - date.thisDate,
    hour  : curTime.thisHour - date.thisHour,
    minute: curTime.thisMinute - date.thisMinute,
    second: curTime.thisSecond - date.thisSecond
  }

  if ( timeRange.year == 0 && timeRange.month == 0 && timeRange.date == 0 && timeRange.hour >= 0 && timeRange.hour <= 5 ) {
    return date.time.substring(0,5);
  }else if ( timeRange.year == 0 && timeRange.month == 0 && timeRange.date == 0 && timeRange.hour > 5 ) {
    return "Today";
  }else if ( timeRange.year == 0 && timeRange.month == 0 && timeRange.date == 1 ) {
    return "Yesterday";
  }else if ( timeRange.year == 0 && timeRange.month == 0 && timeRange.date > 1 && timeRange.date <= 7 ) {
    return changeDay(date.today, "fullEN");
  }else {
    return changeMonth(date.thisMonth, "sortEN") + ", " + date.thisDate + " " + date.thisYear;
  }

  // else if ( timeRange.year == 0 && timeRange.month == 0 && timeRange.date > 7 ) {
  //   return changeMonth(date.thisMonth, "fullEN");
  // }else if ( timeRange.year == 0 && timeRange.month == 1 ) {
  //   return "Last Month";
  // }
}


const changeMonth = function (month, format = 'sortID') {
  let dataMonth = {
    'fullID' : [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ],
    'fullEN' : [
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ],
    'sortID' : [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
    ],
    'sortEN' : [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ]
  }

  return dataMonth[format][(Number(month) - 1)]
}

const changeMonthToNumber = function (month, format = 'sortID') {
  let monthData = {
    'fullID' : {
      'Januari' : 1, 'Februari' : 2, 'Maret': 3, 'April': 4, 'Mei': 5, 'Juni': 6, 'Juli': 7, 'Agustus': 8, 'September': 9,
      'Oktober': 10, 'November': 11, 'Desember': 12
    },
    'fullEN' : {
      'January' : 1, 'February' : 2, 'March': 3, 'April': 4, 'May': 5, 'June': 6, 'July': 7, 'August': 8, 'September': 9,
      'October': 10, 'November': 11, 'December': 12
    },
    'sortID' : {
      'Jan' : 1, 'Feb' : 2, 'Mar': 3, 'Apr': 4, 'Mei': 5, 'Jun': 6, 'Jul': 7, 'Agu': 8, 'Sep': 9,
      'Okt': 10, 'Nov': 11, 'Des': 12
    },
    'sortEN' : {
      'Jan' : 1, 'Feb' : 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6, 'Jul': 7, 'Aug': 8, 'Sep': 9,
      'Oct': 10, 'Nov': 11, 'Dec': 12
    }
  }

  return monthData[format][month]
}

const changeDay = function (date, format = 'sortID') {
  let newDate = new Date(date)
  let getDay  = newDate.toString().substring(0,3)

  let dayData = {
    'fullID' : {
      'Sun' : 'Minggu', 'Mon' : 'Senin', 'Tue' : 'Selasa', 'Wed' : 'Rabu', 'Thu' : 'Kamis', 'Fri' : 'Jum\'at', 'Sat' : 'Sabtu'
    },
    'fullEN' : {
      'Sun' : 'Sunday', 'Mon' : 'Monday', 'Tue' : 'Tuesday', 'Wed' : 'Wednesday', 'Thu' : 'Thursday', 'Fri' : 'Friday',
      'Sat' : 'Saturday'
    },
    'sortID' : {
      'Sun' : 'Min', 'Mon' : 'Sen', 'Tue' : 'Sel', 'Wed' : 'Rab', 'Thu' : 'Kam', 'Fri' : 'Jum', 'Sat' : 'Sab'
    },
    'sortEN' : {
      'Sun' : 'Sun', 'Mon' : 'Mon', 'Tue' : 'Tue', 'Wed' : 'Wed', 'Thu' : 'Thu', 'Fri' : 'Fri', 'Sat' : 'Sat'
    }
  }

  return dayData[format][getDay]
}

const getDaysInMonth = function (month, year, cond = 'default') {
  month = month - 1
  var date = new Date(year, month, 1);
  var days = [];

  while ( date.getMonth() == month ) {
    days.push(new Date(date.getFullYear(), date.getMonth(), date.getDate()))
    date = new Date(date.getFullYear() , date.getMonth() , date.getDate() + 1)
  }

  if ( cond == 'numberDate' ) {
    let dt = []
    let d = 0
    while ( d < days.length ) {
      dt.push(plusZero((d + 1)))
      d++
    }

    days = {
      fulldate  : days,
      date      : dt
    }
  }
  
  return days;
}

const amPMto24 = function (time) {
  if ( time.indexOf('AM') > 0 ) {
    if ( time.substring(0,2) == 12 ) {
      time = '0'
    }else {
      if ( time.substring(0,1) == '0' ) {
        time = time.substring(1,2)
      }else {
        time = time.substring(0,2)
      }
    }
  }else if ( time.indexOf('PM') > 0 ) {
    if ( time.substring(0,2) == 12 ) {
      time = '12'
    }else {
      if ( time.substring(0,1) == '0' ) {
        time = Number(time.substring(1,2)) + 12
        time = time.toString()
      }else {
        time = Number(time.substring(0,2)) + 12
        time = time.toString()
      }
    }
  }

  return time
}

const from24to12 = function(hour) {
  if ( Number(hour) >= 0 && Number(hour) < 12 ) {
    hour = hour == '00' ? '12' : hour
    hour = Number(hour) + ' a.m'
  }else {
    hour = plusZero(Number(hour) - 12)
    hour = hour == '00' ? '12' : hour
    hour = Number(hour) + ' p.m'
  }

  return hour
}

const titleCase = function (str) {
  var splitStr = str.toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
  }
  return splitStr.join(' '); 
}

String.prototype.titleCase = function() {
  return this.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

const getRandomColor = function () {
  var letters = '3456'.split('');
  var color = '#';        
  color += letters[Math.ceil(Math.random() * 3)];
  letters = '3456ABCD'.split('');
  for (var i = 0; i < 5; i++) {
      color += letters[Math.ceil(Math.random() * 7)];
  }
  // var letters = '0123456789ABCDEF'.split('');
  // var color = '#';
  // for (var i = 0; i < 6; i++) {
  //     color += letters[Math.ceil(Math.random() * 15)];
  // }

 return hexToRgbA(color)
}

const hexToRgbA = function (hex){
  var c;
  if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
    c= hex.substring(1).split('');
    if(c.length== 3){
        c= [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c= '0x'+c.join('');
    return {
      background: 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+', 0.2)',
      border: 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',1)'
    };
  }
  throw new Error('Bad Hex');
}

const getPercent = function(x, y) {
  let persen

  persen = ((x * 100) / y)
  persen = Math.round(persen) + '%'

  return persen
}

const splitDate = function(date) {
  let year, month, day, hour, minute, second, time

  date = date.split(" ")
  date[0] = date[0].split("-")
  date[1] = date[1].split(":")
  year = date[0][0]
  month = date[0][1]
  day = date[0][2]
  hour = date[1][0]
  minute = date[1][1]
  second = date[1][2]
  date = year + "-" + month + "-" + day
  time = hour + ":" + minute + ":" + second

  return {
    year: year,
    month: month,
    day: day,
    hour: hour,
    minute: minute,
    second: second,
    date: date,
    time: time
  }
}

let getDatePoint = (since = 2) => {
  let today, yesterday, CT = currentTime(),
    year, month, day

  today = CT.date

  CT.thisDate = Number(CT.thisDate) - 1
  if ( CT.thisDate == 0 ) {
    CT.thisMonth = Number(CT.thisMonth) - 1
    if ( CT.thisMonth == 0 ) {
      CT.thisYear   = Number(CT.thisYear) - 1
      CT.thisMonth  = 12
      CT.thisDate   = getDaysInMonth().length
    }
  }

  yesterday = CT.thisYear + "-" + CT.thisMonth + "-" + CT.thisDate

  return {
    today     : today,
    yesterday : yesterday,
    since     : since
  }
}

let numberToString = (num, lang = "en") => {
  let list = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]

  return list[num]
}

let getDay = (CT, date) => {
  let result = false, year, month, day

  if ( CT.thisYear == date.year ) {
    if ( CT.thisMonth == date.month ) {
      if ( CT.thisDate == date.day ) {
        result = 0
      }else {
        result = Number(CT.thisDate) - Number(date.day)
      }
    }else {
      let getMonth = 0, monIdx = Number(date.month)
      while(monthIdx < Number(CT.thisMonth)) {
        let dayLength = getDaysInMonth(monthIdx, date.year)
        getMonth += dayLength.length
        monthIdx++
      }
      result = getMonth + Number(CT.thisDate)
    }
  }else {
    result = false
  }

  return result
}

const fetchDate = date => {
  let year, month, day, hour, minute, second

  date[0] = date[0].split('/')
  date[1] = date[1].split(':')
  year    = date[0][2]
  month   = plusZero(date[0][0])
  day     = plusZero(date[0][1])
  hour    = plusZero(date[1][0])
  hour    = plusZero(amPMto24(hour + " " + date[1][2].substring(3,5)))
  minute  = plusZero(date[1][1])
  second  = plusZero(date[1][2].substring(0,2))
  date    = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second

  return {
    year: year,
    month: month,
    day: day,
    hour: hour,
    minute: minute,
    second: second,
    date: date
  }
}

const requestAjax = (param, callback) => {
  let result = [], options = {}
  
  if ( !param.async ) {
    param.async = false
  }

  param.success = function(res) {
    result = res
  }
  param.error   = function(e,err) {
    if ( e.status != 200 ) {
      console.log(e,err);
    }
  }

  $.ajax(param)

  return result
}


const request = function(req, callback) {
  const method  = req.method ? req.method : "POST";
  const data    = req.data ? req.data : req;
  let url       = req.pathURL;

  url += method == "GET" ? "?" + serialize(data) : "";

  var xhttp     = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      // Typical action to be performed when the document is ready:
      callback(JSON.parse(xhttp.response));
    }
  };
  xhttp.open(method, url, true);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send(JSON.stringify(data));
}

const serialize = function(obj) {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}


const makeID = (length = 5, charType = "all") => {
  var result           = [];
  var char       = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    number   : "0123456789"
  };
  char.all       = char.uppercase + char.lowercase + char.number
  var charLength = char[charType].length;

  for ( var i = 0; i < length; i++ ) {
    result.push(char[charType].charAt(Math.floor(Math.random() * 
    charLength)));
   }
   return result.join('');
}

const getBase64Size = base64 => {
  try {
    const equalMatch = base64.match(/=/g);
    const n = base64.length;
    const y = equalMatch ? equalMatch.length : 1;

    return ((n * (3/4)) - y);
  }catch(e) {console.log(e);
    return 0;
  }
}

const getBase64Image = img => {
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  var dataURL = canvas.toDataURL("image/png");
  return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

const getBase64FromUrl = async url => {
  const data = await fetch(url);
  const blob = await data.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob); 
    reader.onload = () => resolve(reader.result, url);
    reader.onerror = error => reject(error);
  });
}

// return a promise
const copyToClipboard = textToCopy => {
    // navigator clipboard api needs a secure context (https)
    if (navigator.clipboard && window.isSecureContext) {
        // navigator clipboard api method'
        return navigator.clipboard.writeText(textToCopy);
    } else {
        // text area method
        let textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        // make the textarea out of viewport
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        return new Promise((res, rej) => {
            // here the magic happens
            document.execCommand('copy') ? res() : rej();
            textArea.remove();
        });
    }
}


const getBase64URL = async url => {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();

    xhr.onload = function() {
      var reader = new FileReader();
      reader.onloadend = () => resolve(reader.result, url);
      reader.readAsDataURL(xhr.response);
    };

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status !== 200)
        reject(xhr.statusText);
    };

    xhr.open('GET', url);
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*")
    xhr.responseType = 'blob';
    xhr.send();
  });
}


const b64toBlob = (b64Data, contentType, sliceSize=512) => {
  b64Data = b64Data.replace(/^data:\w+\/\w+;base64,/, "");

  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, {type: contentType});
  return blob;
}


const getFilenameFromURL = (url) => {
  if (url) {
    let m = url.toString().match(/.*\/(.+?)\./);

    if (m && m.length > 1) {
      return m[1];
    }
  }

  return "";
}

const encrypt = function (msg, pass) {
  let keySize = 256;
  let ivSize = 128;
  let iterations = 100;
  let salt = CryptoJS.lib.WordArray.random(128/8);
  
  let key = CryptoJS.PBKDF2(pass, salt, {
      keySize: keySize/32,
      iterations: iterations
    });

  let iv = CryptoJS.lib.WordArray.random(128/8);
  
  let encrypted = CryptoJS.AES.encrypt(msg, key, { 
    iv: iv, 
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC
    
  });
  
  // salt, iv will be hex 32 in length
  // append them to the ciphertext for use  in decryption
  let transitmessage = salt.toString()+ iv.toString() + encrypted.toString();
  return transitmessage;
}

const decrypt = function (transitmessage, pass) {
  let keySize = 256;
  let ivSize = 128;
  let iterations = 100;
  let salt = CryptoJS.enc.Hex.parse(transitmessage.substr(0, 32));
  let iv = CryptoJS.enc.Hex.parse(transitmessage.substr(32, 32))
  let encrypted = transitmessage.substring(64);
  
  let key = CryptoJS.PBKDF2(pass, salt, {
      keySize: keySize/32,
      iterations: iterations
    });

  let decrypted = CryptoJS.AES.decrypt(encrypted, key, { 
    iv: iv, 
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC
    
  })
  return decrypted;
}

try{
  module.exports = {
    makeID, getCookie, plusZero, currentTime, getStrTime, getTimeString, changeMonth,
    changeMonthToNumber, changeDay, getDates, getDaysInMonth,
    amPMto24, from24to12, titleCase, getRandomColor, hexToRgbA,
    getPercent, splitDate, getDatePoint, getDay, fetchDate, getFilenameFromURL,
    getBase64Size, getData
  }
}catch(e) {

}