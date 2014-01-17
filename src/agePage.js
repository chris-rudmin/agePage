(function(){

    var displayAge = function( age ) {
        if ( moment().diff( age, "days" ) > 180 ) {
            moment.lang( chrome.i18n.getMessage("@@ui_locale") );
            $("<div/>")
                .addClass( "agePageText" )
                .text( chrome.i18n.getMessage( "published", age.fromNow() ) )
                .hide()
                .appendTo( "body" )
                .fadeIn( 1000 );
        }
    };

    // Getting last updated date from google failed. Using lastModified date.
    var googleRequestFail = function(){
        displayAge( moment( document.lastModified ) );
    };

    // Pages that are always up to date will not show in google search results
    // NOTE! This is totally bad form, and can break if google changes it's request responses !
    var googleRequestSuccess = function( data ) {

        var pageDate,
            urlToSearch = document.URL,
            titleToSearch = document.title;

        $(data).find("#rso > li").each( function() {

            // Long titles and urls have added ellipses. Strip them for matching
            var $this = $(this),
                resultUrl = $this.find("cite").text().replace("...", ""),
                resultTitle = $this.find("h3 a").text().replace(" ...", "");

            // Only use date if url or title match to reduce false positive
            if ( urlToSearch.indexOf( resultUrl ) != -1 || titleToSearch.indexOf( resultTitle ) != -1 ) {
                
                // I've seen dates come back in two different structures. 
                pageDate = moment( $this.find("span.f").text().split(" - ")[0] );
                if ( !pageDate.isValid() ) {
                    pageDate = moment( $this.find("div.f.slp").text().split(" - ")[0] );
                }

                return false;
            }
        });

        ( pageDate && pageDate.isValid() ? displayAge( pageDate ) : googleRequestFail() );
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

}());