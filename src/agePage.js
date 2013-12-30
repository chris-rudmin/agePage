var agePage = function(){

	var maxYellowOpacity = 0.35;

	var drawUiWithAge = function( pageUpdatedDate ) {
		var ageInSeconds = new Date().getTime() - pageUpdatedDate.getTime();

		// Add yellow parchment
		// if ageInSeconds( )
	};

	// Search for this URL in google from before 1 day ago
	// NOTE! This is totally bad form, and can break if google changes it's request responses !
	$.ajax({
		url: "https://www.google.com/search",
		dataType: "html",
		data : {
			q: "site:"+document.URL, // Search for this specfic url
			tbs: "cdr:1,cd_min:,cd_max:", // Custom date rage (default)
		}
	}).done( function( data ) {
		var pageUpdatedDate = new Date( $(data).find("#rso li:first-child span.f").text().replace(" - ", "") );
		drawUiWithAge( isNaN( pageDate.getTime() ) ? document.lastModified : pageUpdatedDate );
    }).fail(function() {
	  	drawUiWithAge( document.lastModified );
	});

}();