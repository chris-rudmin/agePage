agePage
================================

This is a proof of concept Google Chrome Extension which informs the user how old the page is they are looking at.

Page age will appear in the bottom right after page is 180 days old.

Written with [jQuery](http://jquery.com/) and [Moment.js](http://momentjs.com/).

How does it work?
-------------------------

We query google and scrape the reported page age. If this fails, we resort to the age reported by the server.
In reality the age reported from the server is rarely accurate and google has a better estimate of page age.
More robust solution might be to find other internet services.

Note: This method will likely fail if google adjusts is request responses. We should really be using Google Custom Search API https://developers.google.com/custom-search/ but it costs money.

Contributers
-------------------------------

Concept: John F. Walsh

Code: Chris Rudmin


Known Issues
-------------------------------

Scraping the dates from google only work if results are in English.

Some domain roots do not search properly.


Compiling
------------------------

In the Chrome Extensions window, Enable Developer Mode by clicking in the top right. Then click Load Unpacked Extension and select this folder. You can also compile the extension from this window. 
