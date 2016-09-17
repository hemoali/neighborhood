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
}

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
	//Views
	self.left_panel = document.getElementById("left_panel");
	self.ham_icon = document.getElementById("ham-icon");
	self.toBeHiddenElements = document.getElementsByClassName("toBeHidden");
	self.main = document.getElementById("main");
	//Fill location data into observableArray
	self.locationsList = ko.observableArray([]);
	locationsData.forEach(function (location) {
		self.locationsList.push(new locationsModel(location));
	});

	//Toggle sidebar view
	self.changeSideBarSize = function (hide) {
		self.left_panel.style.width = hide ? "1%" : "19%";
		self.ham_icon.style.width = hide ? "100%" : "10%";
			[].forEach.call(self.toBeHiddenElements, function (el) {
			el.style.display = hide ? 'none' : 'inline-block';
		});
		self.main.style.width = hide ? "98%" : "80%";
		google.maps.event.trigger(map, "resize");
	}
	self.toggleSideBar = function () {
		if (self.left_panel.style.width !== "1%") {
			self.changeSideBarSize(true);
		} else {
			self.changeSideBarSize(false);

		}
	};
};

ko.applyBindings(new locationsViewModel());
