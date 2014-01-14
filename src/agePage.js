var agePage = function(){

	var displayAge = function( pageUpdatedDate ) {
		if ( moment().diff( pageUpdatedDate, "days" ) > 180 ) {

    		// Set localization for date display
    		moment.lang( chrome.i18n.getMessage("@@ui_locale") );

			$("<div/>")
				.addClass( "agePageText" )
				.text( chrome.i18n.getMessage( "published", pageUpdatedDate.fromNow() ) )
				.hide()
				.appendTo( "body" )
				.fadeIn( 1000 );
		}
	};

    var googleRequestFail = function(){
    	console.log("Getting last updated date from google failed. Using lastModified date.");
    	displayAge( moment( document.lastModified ) );
    };

	// Pages that are always up to date will not show in google search results
	// NOTE! This is totally bad form, and can break if google changes it's request responses !
	var googleRequestSuccess = function( data ) {

		var pageUpdatedDate,
			urlToSearch = document.URL.replace("http://", ""),
			titleToSearch = document.title,
			pageResults = $(data).find("#rso > li");

		pageResults.each( function() {

			var $this = $(this),
				resultUrl = $this.find("cite").text().replace("...", ""),
				resultTitle = $this.find("h3 a").text().replace("...", "");

			// Only use date if url or title match to reduce false positive
			if ( urlToSearch.indexOf( resultUrl ) != -1 || titleToSearch.indexOf( resultTitle ) != -1 ) {
				
				// Create a date if present
				pageUpdatedDate = moment( $this.find("span.f").text().split(" - ")[0] );

				// Might be in different format
				if ( !pageUpdatedDate.isValid() ) {
					pageUpdatedDate = moment( $this.find("div.f.slp").text().split(" - ")[0] );
				}

				return false;
			}
		});

		if ( pageUpdatedDate && pageUpdatedDate.isValid() ) {
			displayAge( pageUpdatedDate );
		}

		else {
			googleRequestFail();
		}
    };

	// Search for this URL in google from before 1 day ago
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