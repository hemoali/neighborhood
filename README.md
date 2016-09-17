# Sushi Map
Sushi map is a simple web application that shows some Sushi restaurants in a certain zone.

###How it works
Sushi map fetches the nearest restaurants to a certain, predefined point from Foursquare API.

###How to use?
You have to open the web application in the browser and wait for the data to be load from the server (The black overlay view will disappear when the data is loaded successfully).

###How to filter data?
You will find a small text box in the left panel, start typing the search value and the results will be filtered and the markers will be filtered as well.

###How to get more info?
You can click on any restaurant either from the left menu or the map's marker, and the info window will pop up with some useful info:
- Name
- Phone number
- Address
- URL (for more info)

###How to show/hide left menu?
You can achieve the full-screen view for the map by toggling the left menu using the hamburger icon.
###What if I got an error message or the overlay view didn't disappear?
You may need to:
- Double check your internet connection.
- Check if your firewall blocks either Google maps or Foursquare websites.
- Refresh the page.

###Credits
Main features of the application based on:
- Google maps V3 API
- Foursquare API

Some useful code was copied from:
- Stackoverflow
- Foursquare documentations
- Knockout JS framework documentations
- Udacity GitHub repos
