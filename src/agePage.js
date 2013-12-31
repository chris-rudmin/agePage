var agePage = function(){

	// Constants
	var maxYellowOpacity = 0.35,
		minAgeForYellowingInDays = 90,
		minAgeForText = 365,
		fadeInDuration = 4000,
		easingAlgorithm = "swing",
		imageYellowClass = "agePageYellow",
		textClass = "agePageText",
		imageYellowUrl = chrome.extension.getURL("images/yellow.jpg");


	var drawUiWithAge = function( pageUpdatedDate ) {
		var ageInDays = (new Date().getTime() - pageUpdatedDate.getTime()) / 86400000;
		console.log("This page is "+ageInDays+" days old");

		// Draw yellow aging
		if (ageInDays > minAgeForYellowingInDays) {

			var yellowOpacity = maxYellowOpacity;
			if ( ageInDays < minAgeForText) {
				yellowOpacity = yellowOpacity * ((ageInDays - minAgeForYellowingInDays) / (minAgeForText - minAgeForYellowingInDays));
			}

			$("<div/>")
				.addClass( imageYellowClass )
				.css({
					"background-image": "url("+imageYellowUrl+")",
					"height": $(document).height()
				})
				.appendTo("body")
				.fadeTo( fadeInDuration, yellowOpacity, easingAlgorithm );

			// add text
			if ( ageInDays > minAgeForText ) {
				$("<div/>")
					.addClass( textClass )
					.text("This page is "+Math.floor(ageInDays)+" days old")
					.appendTo("body")
					.fadeIn( fadeInDuration, easingAlgorithm );
			}
		}
	};

    var googleRequestFail = function(){
    	console.log("Getting last updated date from google failed. Using lastModified date from header.");
    	drawUiWithAge( new Date(document.lastModified) );
    };
	
	// Get the date of the first result. This might not be accurate.
	var googleRequestSuccess = function( data ) {
		var pageUpdatedDate = new Date( $(data).find("#rso li:first-child span.f").text().replace(" - ", "") );

		if ( isNaN( pageUpdatedDate.getTime() ) ) {
			googleRequestFail();
		}
		else {
			drawUiWithAge( pageUpdatedDate );
		}
    };


	// Search for this URL in google from before 1 day ago
	// NOTE! This is totally bad form, and can break if google changes it's request responses !
	var request = $.ajax({
		url: "https://www.google.com/search",
		dataType: "html",
		data : {
			q: "inurl:"+document.URL, // Search query for this specfic url
			tbs: "cdr:1,cd_min:,cd_max:", // Custom date rage. This forces the result to show us the page age.
		}
	});

	request.done( googleRequestSuccess );
	request.fail( googleRequestFail );

}();