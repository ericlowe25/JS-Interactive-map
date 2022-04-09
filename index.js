// What APIs will you need and in what order?
// How will you obtain the user's location?
// How will you add the user's location to the map?
// How will you get the selected location from the user?
// How will you add that information to the map?

//create a select interface:  coffee, restaurant, hotel, and market. 

//create a space where you will place your map.

//sorting function based on criteria
//parking/transportation; uber stops, public transportation

//build leaflet map

const userMap = {
    //Grab user location
   userPosition: [],
   userLocalMap:  {},
   userMarker: {},
   locations: [],
   locationMarkers: {},

   initializeMap() {
       this.userLocalMap = L.map('map', {center: this.userPosition, zoom: 11,});
   
       // Add OpenStreetMap tiles:
       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
           attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
           minZoom: '10',
       }).addTo(this.userLocalMap)
   
       //Add user location marker
       const marker = L.marker(this.userPosition)
       marker.addTo(this.userLocalMap).bindPopup('<p1><b>Your are here</b></p1>').openPopup()
   },

   addBusinesLocations(){
       this.locations.forEach((location) => {
           userMap.locationMarkers = L.marker([location.lat, location.long])
           userMap.locationMarkers.addTo(userMap.userLocalMap).bindPopup(`<p1><b>${location.name}</b></p1>`).openPopup()
       })
   },


}

//Get user location 
async function getUserPosition(){
   let pos = await new Promise((resolve, reject) => {navigator.geolocation.getCurrentPosition(resolve, reject);});
   console.log(pos.coords)
   return [pos.coords.latitude, pos.coords.longitude]
}

//Wait for page load
window.onload = async () => {
   let coords = await getUserPosition()
   userMap.userPosition = coords
   userMap.initializeMap()
}

//Fetch Foursquare data via API
async function getFoursquareData(category){
   const options = {
       method: 'GET',
       headers: {
       Accept: 'application/json',
       Authorization: 'fsq3TwTLp/PEtwqDA0+0AU3MuV1uGoi/4cJtd1B28ahOiC8='
       }
   }
   let lat = userMap.userPosition[0]
   let long = userMap.userPosition[1]

   
   let response = await fetch(`https://cors-anywhere.herokuapp.com/https://api.foursquare.com/v3/places/search?&query=${business}&limit=${limit}&ll=${lat}%2C${lon}`, options)
   let data = await response.json()
   let localBusinesses = data.results

   return localBusinesses
}


let locationButtons = document.querySelectorAll(".locationButton")
locationButtons.forEach((location) => { 
   location.addEventListener('click', async () => {
       let category = location.textContent;
       let selectionData = await getFoursquareData(category)
       
       selectionData.forEach((location) => {
           userMap.locations.push({name: location.name, lat: location.geocodes.main.latitude, long: location.geocodes.main.longitude})
       })
       userMap.addBusinesLocations()

   })
})


