<!doctype html>
<html lang="en">
<head>
  
  <meta charset="utf-8">

  <title>TEI Zoner</title>
  <meta name="author" content="Chris Sparks">

  <link rel="stylesheet" href="css/style.css?v=1.0">
  <link rel="stylesheet" href="css/highlighter-default.css">

  <!--[if lt IE 9]>
  <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
  <![endif]-->
</head>

<body ng-app="zoner"  ng-controller="main" >
    <div id=menu>
    
     <?php
$menu = 'zoner';

require('./menu.php');

?>
    
    </div>

    <div id=main>
      <div id=leftPan>  
    
      <ul class=tabul>
          <li id=annTab ng-click="sh.annTab=true; sh.caTab=false"><a href="#shList">Annotations.</a></li>
          <li id=catTab  ng-click="sh.caTab=true; sh.annTab=false"><a href="#catList">Categories</a></li>
      </ul>  
      
     <div id=shList ng-show="sh.annTab==true">
        
         <sh-list></sh-list>
         
    </div>
         
      <div id=catList ng-show="sh.caTab==true">
    
          <cat-list></cat-list>   
          
    </div>
      
      </div>
  
    <div id=drawing>
    
<section id="teistuff" ng-show="sh.tei==true">

    <tei-markup></tei-markup>    
    
</section>


  
<h2 id=helpLink ng-click="sh.help=!sh.help">?</h2>
<p>This tool allows you to generate TEI &lt;zone&gt; elements by drawing points on an image.  It is entirely browser-based (nothing is processed on the server), so it should be very fast.   </p> <div id=help ng-show="sh.help==true"> 
         <h1>TEI Zoner</h1>
<p>This tool allows you to generate TEI &lt;zone&gt; elements by drawing points on an image.  It is entirely browser-based (nothing is processed on the server), so it should be very fast.   </p>
<ul>
  <li>To set points of your shape, click anywhere on the image.</li>
  <li>To draw your shape, click [Draw Shape] in the bar at the bottom of the screen.</li>
  <li>If you have only drawn two points, you will get a rectangle.  Otherwise, the tool will draw a polygon.</li>
</ul>

<br>


<h2>About the Zoner</h2>
<p>The tool uses <a href="http://raphaeljs.com/">raphael.js</a>, <a href="https://highlightjs.org/">highlight.js</a> and <a href="https://jquery.com/">jQuery</a>, and owes a lot to the fine people of <a href="http://stackoverflow.com/">StackOverflow</a> (in particular <a href="http://stackoverflow.com/questions/25487454/display-image-from-desktop-in-a-page">this question</a>).</p>

    
<p>It was written by <a href="http://www.history.qmul.ac.uk/staff/profile/5467-dr-chris-sparks">Chris Sparks</a> to act as a teaching resource during for a <a href="http://digitalmanuscripts.eu/">DEMM Digital Editing TEI training week</a>.</p>
<p>Please send comments or suggestions to <a href="https://twitter.com/sparkyc84">@sparkyc84</a>.</p>
<p>The source code of this project is <a href="https://github.com/sparkyc84/tei-zoner">available to fork on GitHub</a>.  It is licensed under the MIT License, which means you can use modify and embed it within other projects so long as you retain the copyright notice and license text.  I’d be interested to hear about any uses of the tool, and would be happy to incorporate any fixes or enhancements you might suggest.</p>
    
    </div>  
    
  <div id=wrapper >  
   
    <img id="editor" />
<div id="canvas" ng-click="nPoint()"> </div>
  
        <form id="pickfile"><label>First, pick an image: <input type="file" id="files" name="files[]" onchange="angular.element(this).scope().handleFile(this)"/></label>
        </form>
        </div>
     
  
</div>
  
    
<div id="controls">
    <controls></controls>
</div>
    
<script src="js/angular.min.js"></script>  
  
    
    <script>
        
   
        angular.module("zoner",[]);

    </script>
      <script src="js/factories.js"></script>
      <script src="js/controllers.js"></script>
     
<script src="js/raphael-min.js"></script>
<script src="js/highlight.pack.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
    <script
  src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"
  integrity="sha256-T0Vest3yCU7pafRw9r+settMBX6JkKN06dqBnpQ8d30="
  crossorigin="anonymous"></script>
<!--<script src="js/zoner.js"></script> -->
    
    </div>
    
</body>
</html>
