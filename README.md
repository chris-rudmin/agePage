agePage
================================

This is a proof of concept Google Chrome Extension which adds visual cues to inform the user how old the page is they are looking at.

Pages will start to yellow after content is 3 months old
Cobwebs will begin to appear after page is one year old
One web will be added for every 6 months up to 4 years

How does it work?
-------------------------

We query google and scrape the reported page age from them. If this fails, we resort to the age reported by the server.

Note: We should really be using Google Custom Search Api https://developers.google.com/custom-search/ but it costs money.

Contributers
-------------------------------

Concept by John F. Walsh
Code by Chris Rudmin

Compiling
------------------------

TBD: