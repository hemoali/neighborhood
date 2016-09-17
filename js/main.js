/*
	Locations Data
*/
var locationsData = new Array();
//Fetch locations from Foresquare API
$(document).ready(function () {
	//Define MVVM
	var locationsMVVM = new locationsViewModel();
	ko.applyBindings(locationsMVVM);

	$.getJSON("https://api.foursquare.com/v2/venues/search?client_id=4VGSQECE05IIHA1UJQAZPCINAMZYJODD4RNVMG4NSZRAH2ML&client_secret=JH5YXCQ1YGSJXJRCIGJETBNDAPFP5VE42GNM0WJFCLL0EMS5&v=20130815&ll=40.7,-74&query=sushi", function (result) {
		$.each(result, function (i, field) {
			if (i === "response") {
				$.each(field.venues, function (key, resturant) {
					locationsData.push({
						lat: resturant.location.lat,
						lng: resturant.location.lng,
						name: resturant.name,
						formattedPhone: resturant.contact.formattedPhone,
						formattedAddress: resturant.location.formattedAddress,
						url: resturant.url
					});
				});
			}
		});
	}).done(function () {
		locationsMVVM.init();
		//Add markers to the map
		locationsMVVM.addMarkers(bounds);
		// Hide overlay div
		$(".overlayDiv").hide(2000);
	}).fail(function () {
		alert("Something went wrong, please check your internet connection");
	});

});
/*
	Locations Model
*/

function locationsModel(location) {
	var self = this;
	self.lat = location.lat;
	self.lng = location.lng;
	self.name = location.name;
	self.formattedPhone = location.formattedPhone;
	self.formattedAddress = location.formattedAddress;
	self.url = location.url;
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
	//All locations list
	self.locationsList = ko.observableArray([]);
	// property to store the filter
	self.currentFilter = ko.observable();

	/**
		This function initializes the locationListObservable array
	*/
	self.init = function () {
		//Fill location data into observableArray
		locationsData.forEach(function (location) {
			self.locationsList.push(new locationsModel(location));
		});
	};
	/**
	This computed value filters the locations array and show the markers
	*/
	self.filterLocations = ko.computed(function () {
		if (!self.currentFilter()) {
			return self.locationsList();
		} else {
			hideMarkers();
			return ko.utils.arrayFilter(self.locationsList(), function (location) {
				if (location.name.toLowerCase().indexOf(self.currentFilter().toLowerCase()) >= 0) {
					location.marker.setMap(map);
					return true;
				}
			});
		}
	});
	/**
	This function gets called when filter button is clicked in order to change the currentFilter Value
	*/
	self.changeFilterValue = function () {
		self.currentFilter(self.filter_text.value);
	};
	/**
	This function adds the initial markers for all the locations
	*/
	self.addMarkers = function (bounds) {
		ko.utils.arrayForEach(self.locationsList(), function (location, index) {
			var marker;
			self.markers.push(marker = new google.maps.Marker({
				position: {
					lat: location.lat,
					lng: location.lng
				},
				map: map,
				id: index,
				location: location,
				animation: google.maps.Animation.DROP
			}));
			// Conenct the location and marker
			location.marker = marker;
			// Create an onclick event to open an infowindow at each marker.
			marker.addListener('click', function () {
				$(".active").removeClass("active");
				selectMarker(this, largeInfowindow);
			});
			bounds.extend(marker.position); // extend map to current marker
		});
		//fit the map to all markers 
		map.fitBounds(bounds);
	};


	/**
		This function gets called when list_item from the left panel gets clicked,
		it selects the marker on the map which represents the selected item
	*/
	self.itemClick = function (item, event) {
		$(".active").removeClass("active");
		$(event.target).addClass("active");
		selectMarker(item.marker, largeInfowindow);
	};
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
	/** 
	This function toggles sidebar view and gets triggered by hamburger icon
	*/
	self.toggleSideBar = function () {
		if (self.left_panel.style.width !== "1%") {
			self.changeSideBarSize(true);
		} else {
			self.changeSideBarSize(false);

		}
	};
};
/*
	This part initializes the Google map
*/
var map;
var largeInfowindow;
var bounds;

function initMap() {
	// Constructor creates a new map - only center and zoom are required.
	map = new google.maps.Map(document.getElementById('map'), {
		center: {
			lat: 40.7,
			lng: -74
		},
		zoom: 13
	});
	//Bound to show all markers
	bounds = new google.maps.LatLngBounds();
	largeInfowindow = new google.maps.InfoWindow();

}
/** This function populates the infowindow when the marker is clicked. We'll only allow
	one infowindow which will open at the marker that is clicked, and populate based
 	on that markers position.
*/
function populateInfoWindow(marker, infowindow) {
	// Check to make sure the infowindow is not already opened on this marker.
	if (infowindow.marker != marker) {
		infowindow.marker = marker;
		var strVar = "";
		strVar += "<div class=\"info-window-div\">";
		strVar += "<strong>"+marker.location.name+"<\/strong>";
		strVar += "<em>"+marker.location.formattedPhone+"<\/em>";
		strVar += "<p>"+marker.location.formattedAddress+"<\/p>";
		strVar += "<a target='_blank' href=\""+marker.location.url+"\">"+marker.location.name+"<\/a>";
		strVar += "<\/div>";
		infowindow.setContent(strVar);
		infowindow.open(map, marker);
		// Make sure the marker property is cleared if the infowindow is closed.
		infowindow.addListener('closeclick', function () {
			$(".active").removeClass("active");
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
/**
	This function changes the marker color when selected either from the left panel or directly from the maps
*/
function selectMarker(marker, largeInfowindow) {
	//Bounce the marker
	if (marker.getAnimation() !== null) {
		marker.setAnimation(null);
	} else {
		marker.setAnimation(google.maps.Animation.BOUNCE);
		setTimeout(function () {
			marker.setAnimation(null);
		}, 1400);
	}
	// Show info window
	populateInfoWindow(marker, largeInfowindow);
}
