// Initialize and add the map
function initMap() {
    // The location of Uluru
    const uluru = { lat:1.2939170885884703, lng: 103.77386420264736};

    // 1.2949576369246405, 103.7739244069212
    // The map, centered at Uluru
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 18, // how much to zoom in
      center: uluru,
    });
    // The marker, positioned at Uluru
    const marker = new google.maps.Marker({
      position: uluru,
      map: map,
    });
  }
  
  window.initMap = initMap;