/*
	Locations Data
*/

var locationsData = [
	{
		lat: 40.7213549,
		lng: -72.9980244,
		name: 'Ahmed'
	},
	{
		lat: 40.7413219,
		lng: -71.9980244,
		name: 'Ali'
	},
	{
		lat: 40.7314219,
		lng: -73.1980244,
		name: 'Mohammed'
	},
	{
		lat: 41.7417649,
		lng: -74.0980244,
		name: 'Amr'
	},
	{
		lat: 40.7113549,
		lng: -76.0980244,
		name: 'Zubair'
	},
];

/*
	Locations Model
*/

function locationsModel(location) {
	var self = this;
	self.lat = location.lat;
	self.lng = location.lng;
	self.name = location.name;
};

/*
	Locations ViewModel
*/

function locationsViewModel() {
	var self = this;
	//All markers of locations
	self.markers = [];
	//Views
	self.left_panel = document.getElementById("left_panel");
	self.ham_icon = document.getElementById("ham-icon");
	self.items_list = document.getElementById("items-list");
	self.toBeHiddenElements = document.getElementsByClassName("toBeHidden");
	self.main = document.getElementById("main");
	self.filter_text = document.getElementById("filter-text");

	// property to store the filter
	self.currentFilter = ko.observable();

	/**
		This function initializes the locationListObservable array
	*/
	self.init = function () {
		//Fill location data into observableArray
		self.locationsList = ko.observableArray([]);
		locationsData.forEach(function (location) {
			self.locationsList.push(new locationsModel(location));
		});
	}();

	/**
	This function filters the locations 
	*/
	self.filerLocations = function () {
		hideMarkers();
		var filterValue = self.filter_text.value; // get the filter value
		self.currentFilter(filterValue);
		//Search for matches
		self.markers.forEach(function (marker) {
			if (marker.title.indexOf(filterValue) >= 0) marker.setMap(map);
		});
	};
	/**
	This computed value filters the locations array
	*/
	self.filterLocations = ko.computed(function () {
		if (!self.currentFilter()) {
			return self.locationsList();
		} else {
			return ko.utils.arrayFilter(self.locationsList(), function (location) {
				if (location.name.indexOf(self.currentFilter()) >= 0) {
					return true;
				}
			});
		}
	});

	/**
		This function resizes the sidebar depending on the hide @param
	*/
	self.changeSideBarSize = function (hide) {
		self.left_panel.style.width = hide ? "1%" : "19%";
		self.ham_icon.style.width = hide ? "100%" : "10%";
			[].forEach.call(self.toBeHiddenElements, function (el) {
			el.style.display = hide ? 'none' : 'inline-block';
		});
		self.items_list.style.display = hide ? 'none' : 'block';
		self.main.style.width = hide ? "98%" : "80%";
		google.maps.event.trigger(map, "resize");
	};
	//Toggle sidebar view, triggered by hamburger icon
	self.toggleSideBar = function () {
		if (self.left_panel.style.width !== "1%") {
			self.changeSideBarSize(true);
		} else {
			self.changeSideBarSize(false);

		}
	};
};
var locationsMVVM = new locationsViewModel();
ko.applyBindings(locationsMVVM);
/*
	This part initializes the Google map to a certain position
*/
var map;


function initMap() {
	// Constructor creates a new map - only center and zoom are required.
	map = new google.maps.Map(document.getElementById('map'), {
		center: {
			lat: 40.7413549,
			lng: -73.9980244
		},
		zoom: 13
	});
	//Bound to show all markers
	var bounds = new google.maps.LatLngBounds();
	var largeInfowindow = new google.maps.InfoWindow();

	locationsData.forEach(function (location, index) {
		var marker;
		locationsMVVM.markers.push(marker = new google.maps.Marker({
			position: {
				lat: location.lat,
				lng: location.lng
			},
			map: map,
			id: index,
			title: location.name,
			animation: google.maps.Animation.DROP
		}));
		// Conenct the location and marker
		location.marker = marker;
		// Create an onclick event to open an infowindow at each marker.
		marker.addListener('click', function () {
			populateInfoWindow(this, largeInfowindow);
		});
		bounds.extend(marker.position); // extend map to current marker
	});
	//fit the map to all markers 
	map.fitBounds(bounds);
}
// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
	// Check to make sure the infowindow is not already opened on this marker.
	if (infowindow.marker != marker) {
		infowindow.marker = marker;
		infowindow.setContent('<div>' + marker.title + marker.id + '</div>');
		infowindow.open(map, marker);
		// Make sure the marker property is cleared if the infowindow is closed.
		infowindow.addListener('closeclick', function () {
			infowindow.setMarker(null);
		});
	}
}
/**
	This function hides all visible markers
*/
function hideMarkers() {
	locationsMVVM.markers.forEach(function (marker) {
		marker.setMap(null);
	});
}
