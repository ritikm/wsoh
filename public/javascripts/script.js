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
    
  }
}

function setCoords(lat, lng, accuracy) {
  now.lat = lat;
  now.lng = lng;
  now.accuracy = accuracy;
  locationSet = true;
  now.initUser();
}
