# tei-zoner-angular
## A tool for creating &lt;zone> elements within TEI.

This tool is an extended version of Chris Spark's tei-zoner. It hooks together some JavaScript libraries to allow you to draw shapes on an image.  It uses the HTML5 File API to load images from a local computer using JavaScript, therefore avoiding any client-side processing. The information about the shapes can be tied with textual annotations and exported as XML or JSON.

## Trying it out

A live version of the original tool is available at https://static.chrissparks.org.uk/tei . A live version of the extended version can be found at http://delfiin.net/tei-zoner .

## Installation on a Server

Upload index.html (not index.php) and the contents of /js, /css and /templates to the server. No server-side technologies are used, so no setup is needed. 

## Files and folders
index.html - main page
/templates - HTML templates used in AngularJS directives
/js/controllers.js - main AngularJS controller + directives
/js/factories.js - AngularJS services, mainly drawingFct.js containing drawing functions


## Running on Your Own Computer
You can download the contents of this GitHub project to your computer as a zip and open index.html in your web browser.  So long as the directory structure remains intact, it will work anywhere. Internet connection is needed to access jQuery. If you want to work offline, provide a local version.

## Libraries Used
- Raphael.js for throwing shapes: https://dmitrybaranovskiy.github.io/raphael/
- Highlighter for making the generated TEI look pretty: https://highlightjs.org/
- jQuery for manipulating the DOM: http://jquery.com/
- AngularJS to handle the data structure and its interaction with the view: https://angularjs.org/

## Author
Original version written by Chris Sparks (https://github.com/sparkyc84/tei-zoner).  
AngularJS rewrite, annotations, categories and custom fields added by Marie Vaňková (vankova.maru@gmail.com). 

## License
The software is licensed under the MIT License.  You can do whatever you like with it so long as you include a copy of the text in the [LICENSE file](LICENSE) in this work or any work based in substantial part on it.
