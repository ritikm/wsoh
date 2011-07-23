var locationSet = false;
function initialize() {
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        setCoords(position.coords.latitude, position.coords.longitude, position.coords.accuracy);
      }, 
      function() {
        handleNoGeolocation(true);
      });
  } else {
    handleNoGeolocation(false);
  }
  
  function handleNoGeolocation(browserSupportFlag) {
    now.noGeolocation = true;
    now.browserSupportFlag = browserSupportFlag;
    setCoords(37.414346, -122.076902, 16);
  }
}

function setCoords(lat, lng, accuracy) {
  now.lat = lat;
  now.lng = lng;
  now.accuracy = accuracy;
  locationSet = true;
  now.initUser();
}

