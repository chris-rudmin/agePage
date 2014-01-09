var agePage = function(){

	// Constants
	var minAgeForTextInDays = 180,
		fadeInDuration = 1000,
		textClass = "agePageText";

	var drawUiWithAge = function( pageUpdatedDate ) {
		var ageInDays = (new Date().getTime() - pageUpdatedDate.getTime()) / 86400000;

		if (ageInDays > minAgeForTextInDays) {
			$("<div/>")
				.addClass( textClass )
				.text( pageUpdatedDate.toDateString() )
				.hide()
				.appendTo("body")
				.fadeIn( fadeInDuration );
		}
	};

    var googleRequestFail = function(){
    	console.log("Getting last updated date from google failed. Using lastModified date.");
    	drawUiWithAge( new Date(document.lastModified) );
    };
	
	// Get the date of the first result. This might not be accurate.
	// Pages that are always up to date will not show in our results
	var googleRequestSuccess = function( data ) {

		var pageUpdatedDate,
			urlToSearch = document.URL.replace("http://", ""),
			titleToSearch = document.title,
			pageResults = $(data).find("#rso > li");

		pageResults.each( function() {

			var $this = $(this),
				resultUrl = $this.find("cite").text().replace("...", ""),
				resultTitle = $this.find("h3 a").text().replace("...", "");

			// Only use google date if url or title match
			if ( urlToSearch.indexOf( resultUrl ) != -1 || titleToSearch.indexOf( resultTitle ) != -1 ) {
				
				// Create a date if present
				pageUpdatedDate = new Date( $this.find("span.f").text().split(" - ")[0] );

				// Might be in different format
				if ( isNaN( pageUpdatedDate.getTime() ) ) {
					pageUpdatedDate = new Date( $this.find("div.f.slp").text().split(" - ")[0] );
				}

				return false;
			}
		});

		if ( pageUpdatedDate && !isNaN( pageUpdatedDate.getTime() ) ) {
			drawUiWithAge( pageUpdatedDate );
		}
		else {
			googleRequestFail();
		}
    };


	// Search for this URL in google from before 1 day ago
	// Google also scrapes pages for dates to accurately determine the date, which is why we will not attempt this here as well
	// Pages updated daily will not show in these results
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