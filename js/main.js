// JavaScript Document
var loader;
var icon;
var navitem;
var pages;
var skycon_color;

$(document).ready(init);

function init() {
  navitem = document.querySelectorAll("#navbar ul li a");
  pages = document.querySelectorAll("section");
  for(var i = 0; i < pages.length; i++)
  {
    if(detectTouchSupport())
    {
      navitem[i].addEventListener("tap",showWeather,false);
    }
    else
    {
      navitem[i].addEventListener("click",showWeather,false);
    }  
  }

  skycon_color = "#7AD2FF";
  
  $.ajax({ 
    url: 'https://api.forecast.io/forecast/6f6b80e40134a0fa0a7923c7c1434a8d/45.3484,-75.7570?units=ca', 
    dataType: 'jsonp', 
    crossDomain: true, 
    xhrFields: {
      withCredentials: true
  }}).done( gotData ).fail( badThings );
}

function gotData(weatherData) {  
//Append Current Weather
  var current = '<div class="left">';
    current += '<ul>';
      current += '<li>Currently '+Math.round(weatherData.currently.temperature)+'&degC (feels like '+Math.round(weatherData.currently.apparentTemperature)+'&degC)</li>';
      current += '<li><canvas class="skycon" id="RIGHTNOW"></canvas></li>';
    current += '</ul>';
  current += '</div><div class="right">'
    current += '<p>Humidity: '+Math.round(weatherData.currently.humidity * 100)+'%</p>';
    current += '<p>Cloud Cover: '+Math.round(weatherData.currently.cloudCover * 100)+'%</p>';
    current += '<p>Windspeed: '+Math.round(weatherData.currently.windSpeed)+' kph</p>';
  current += '</div>';  

  $("#loading").hide();
  $("#currently div").append(current)
  $("#currently").show();

  var skycons = new Skycons({"color": skycon_color});
  skycons.add("RIGHTNOW",setSkycon(weatherData.currently.icon));
  skycons.play();

//Append Hourly Weather
  for (var i = 0; i < 8; i++) {
    var timeDay = weatherData.hourly.data[i].time * 1000;
    var today = new Date(timeDay);

    var month;
    var hour;

    if(today.getHours() < 12) 
    {
      hour = today.getHours()+" a.m.";
    } 
    else if(today.getHours() == 12) 
    {
      hour = today.getHours()+" p.m.";
    } 
    else if(today.getHours == 0) 
    {
      hour = "12 a.m.";
    } 
    else 
    {
      hour = (today.getHours() - 12)+" p.m.";
    }
  
    month = setDate(today.getMonth());

    var hourly = '<li class="forecast">';
      hourly += '<div class="left">';
        hourly += '<ul>';
          // time
          hourly+='<li>'+month+' '+today.getDate() + '  ' + hour+'</li>';
          //Icon
          hourly+='<li class="'+icon+'"><canvas class="skycon" id="icon'+i+'"></canvas></li>';
          //Summary
          hourly+='<li>'+Math.round(weatherData.hourly.data[i].temperature)+'&degC (feels like '+Math.round(weatherData.hourly.data[i].apparentTemperature)+'&degC) '+weatherData.hourly.data[i].summary+'</li>';
        hourly += '</ul>';
      hourly += '</div>';
      hourly += '<div class="right">';
        // humidity       
        hourly+='<p>Humidity: '+Math.round(weatherData.hourly.data[i].humidity * 100)+'%'+'</p>';
        // Cloud Cover %        
        hourly+='<p>Cloud Cover: '+Math.round(weatherData.hourly.data[i].cloudCover * 100)+'%'+'</p>';
        // Windspeed
        hourly+='<p>Windspeed: '+Math.round(weatherData.hourly.data[i].windSpeed)+ " " +"kph"+'</p>';
      hourly += '</div>';
    hourly+='</li>';

	  $(".weather-forecast > ul").append(hourly);
    addSkycon("icon"+i,skycon_color, setSkycon(weatherData.hourly.data[i].icon));
	}

//Append Daily Weather
  for(var i = 0; i < 8; i++) {
    today = new Date((weatherData.daily.data[i].time * 1000));
    var daily = '<li class="forecast">'
      daily += '<div class="left">';
        daily += '<ul>';
          daily += '<li>'+month+' '+today.getDate()+'</li>';
          daily += '<li class="'+daily+'"><canvas class="skycon" id="daily'+i+'"></canvas></li>';
          daily += '<li>'+Math.round(weatherData.daily.data[i].temperatureMin)+'&degC '+weatherData.daily.data[i].summary+'</li>';
        daily += '</ul>';
      daily += '</div><div class="right">';
        daily += '<p>Humidity: '+Math.round(weatherData.daily.data[i].humidity * 100)+'%'+'</p>';
        daily += '<p>Cloud Cover: '+Math.round(weatherData.daily.data[i].cloudCover * 100)+'%'+'</p>';
        daily += '<p>Windspeed: '+Math.round(weatherData.daily.data[i].windSpeed)+ " " +"kph"+'</p>';
    daily += '</div></li>';

    $("#daily > ul").append(daily);
    addSkycon("daily"+i,skycon_color, setSkycon(weatherData.daily.data[i].icon));
  }
}

function badThings() {
  $("#loading").hide();  
  var tryagain = document.createElement("h2");
  tryagain.innerHTML = "Loading failed, please try again later";
  document.querySelector("#currently").appendChild(tryagain);
}

function setSkycon(skyIcon) {
  var skycone;
  switch(skyIcon) {
    case "cloudy":
      return Skycons.CLOUDY;
      break;
    case "clear-day":
      return Skycons.CLEAR_DAY;
      break;
    case "clear-night":
      return Skycons.CLEAR_NIGHT;
      break;
    case "fog":
      return Skycons.FOG;
      break;
    case "hail":
    case "snow":
      return Skycons.SNOW;
      break;
    case "partly-cloudy-day":
      return Skycons.PARTLY_CLOUDY_DAY;
      break;
    case "partly-cloudy-night":
      return Skycons.PARTLY_CLOUDY_NIGHT;
      break;
    case "rain":
    case "thunderstorm":
      return Skycons.RAIN;
      break;
    case "sleet":
      return Skycons.SLEET;
      break;
    case "tornado": 
    case "wind":
      return Skycons.WIND;
      break;
    default: 
      return null;
      break;
  }
}

function setDate(date) {
  switch(date) {
    case 0:
      return "Jan";
      break;
    case 1:
      return "Feb";
      break;
    case 2:
      return "Mar";
      break;
    case 3:
      return "Apr";
      break;
    case 4:
      return "May";
      break;
    case 5:
      return "June";
      break;
    case 6:
      return "July";
      break;
    case 7:
      return "Aug";
      break;
    case 8:
      return "Sept";
      break;
    case 9:
      return "Oct";
      break;
    case 10:
      return "Nov";
      break;
    case 11:
      return "Dec";
      break;
    default:
      return "N/A";
      break;
  }
}

function addSkycon(id, color, icon) {
  var skycons = new Skycons({"color": color});
  skycons.add(id,icon);
  skycons.play();
}

function showWeather(ev) {
  ev.preventDefault();
  var target = ev.currentTarget.href;
  var current = target.split("#");
  for(var i = 0; i < pages.length; i++)
  {
    if(current[1] == pages[i].id)
    {
      $(pages[i]).show().addClass('active');
      $(navitem[i]).addClass('activetab');
    }
    else
    {
      $(pages[i]).hide().removeClass('active');
      $(navitem[i]).removeClass('activetab');
    }
  }
}

function detectTouchSupport() {
  msGesture = navigator && navigator.msPointerEnabled && navigator.msMaxTouchPoints > 0 && MSGesture;
  touchSupport = (("ontouchstart" in window) || msGesture || (window.DocumentTouch && document instanceof DocumentTouch));
  return touchSupport;
}