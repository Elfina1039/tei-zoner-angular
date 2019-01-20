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

<body>
    <div id=menu>

        <?php
$menu = 'zoner';

require('./menu.php');

?>

    </div>

    <div id=main ng-app="zoner" ng-controller="main">
        <div id=leftPan>

            <ul class=tabul>
                <li id=annTab ng-click="c.tab='annTab'"><a href="#shList">Annotations.</a>
                    <inst-row wind=annotations></inst-row>
                </li>
                <li id=catTab ng-click="c.tab='caTab'"><a href="#catList">Categories</a>
                    <inst-row wind=categories></inst-row>
                </li>
                <li id=fieldTab ng-click="c.tab='fieldTab'"><a href="#catList">Fields</a>
                    <inst-row wind=fields></inst-row>
                </li>
            </ul>

            <div id=shList ng-show="c.tab=='annTab'" class="tab">

                <sh-list></sh-list>

            </div>

            <div id=catList ng-show="c.tab=='caTab'" class="tab">

                <cat-list></cat-list>

            </div>

            <div id=fieldList ng-show="c.tab=='fieldTab'" class="tab">

                <field-list></field-list>

            </div>

        </div>

        <div id=drawing>

            <section id="teistuff" ng-show="sh.tei==true">

                <tei-markup></tei-markup>

            </section>




            <div id=wrapper>

                <img id="editor" />
                <div id="canvas" ng-click="nPoint()"> </div>

                <form id="pickfile"><label>First, pick an image: <input type="file" id="files" name="files[]" onchange="angular.element(this).scope().handleFile(this)" /></label>
                </form>

                <inst-row wind=loadfile></inst-row>

            </div>



            <div id="controls">
                <controls></controls>
            </div>

            <div id=help ng-class="sh.help ? 'slideDown' : 'slideUp'">
                <h1>TEI Zoner</h1>
                <p>This tool allows you to generate TEI &lt;zone&gt; elements by drawing points on an image and link them to annotations. It is entirely browser-based (nothing is processed on the server). You can get the output in XML or JSON. </p>
                <ol>
                    <li><a href="#loadImg">Step-by-step guide</a></li>
                    <ol>
                        <li><a href="#loadImg">Load image</a></li>
                        <li><a href="#customFields">Create custom fields</a></li>
                        <li><a href="#customCats">Create custom categories</a></li>
                        <li><a href="#addAnnts">Add annotations</a></li>
                        <ol>
                                <li><a href="#loadText">Plain text</a></li>
                                <li><a href="#loadXML">XML</a></li>
                                <li><a href="#loadJSON">JSON</a></li>

                        </ol>
                        
                        <li><a href="#editAnnts">Edit annotations</a></li>
                         <li><a href="#draw">Draw shapes</a></li>
                         <li><a href="#getOutput">Get output</a></li>
                        <li><a href="#backup">Backup options</a></li>
                    </ol>
                    <li><a href="#about">About the Zoner</a></li>
                </ol>

                <div class=chapter id=loadImg>
                    <h2 >Load image</h2>
                    <p>First of all, click the "browse button" and select an image from your computer.</p>
                </div>
                
                <div class=chapter id=customFields>
                    <h2 >Create custom fields</h2>
                    <p>Before you draw zones and add annotations, you can define fields to be added to each annotation. <strong>You need to create the fileds before you add annotations. It is impossible to add fields to existing annotations or edit their name.</strong>
                    The "title" field is incorporated in the XML format and exported, other fields are exported only in JSON format.</p>
                    <p>
                        To add a field, go to the "Fields" tab on the left. Click the <button class="icon add"></button> add button. Once you create a field, you can edit its name.
                    </p>
                </div>
                
                <div class=chapter id=customCats>
                    <h2 >Create custom categories</h2>
                    <p>You can sort annotations into categories. Different categories get displayed in different colours. By default, all annotations are assigned the "default" category and displayed in blue. To add your own categories, go the the "categories" tab on the left. Use the colour picker at the bottom to select a colour and click the <button class="icon add"></button> add button. You can edit the names and colours of categories any time using the input fields and colour pickers in the "Categories" tab.
                    </p>
                   
                </div>
                
                <div class=chapter id=addAnnts>
                    <h2 >Add annotations</h2>
                    <p>Annotations provide a way of linking shapes to textual data such as words which appear in the manuscript, information about the picture etc. Each annotation has a "name" field, a category and a "title" field (unless you delete it in the "Fields" tab) plus any fields added manually.
                        By deafault, each shape has a blank annotation assigned but you can also provide the annotations first and add shapes after that. To add a single annotation, click the <button class="icon add"></button> add button in the "Annotations tab". If you want to add more annotations at once, you can use the text input field. Click the button <button>Text input</button> at the top of the "Annotations" tab to display a small text area. Annotations can be loaded from plain text, XML or JSON. 
                    </p>
                    
                     <div class=subChapter id=loadText>
                    <h2 >Plain text</h2>
                         <p>If you input a stretch of plain text it is split into individual words (space is taken as separator) and each word becomes a single annotation. This is a good option if you have a transcription of a text from a manuscript and you want to annotate a lot of words. Click <button>Load text</button> to create annotations.
                    </p>
                   
                </div>
                    
                     <div class=subChapter id=loadXML>
                    <h2 >XML</h2>
                         <p>If you already have some data in the !!right XML format, you can load it. The Zoner is capable of reading data about annotations, zones and categories, it creates a list of annotations, categories and draws the shapes on the image.
                             
                             Click <button>Load XML</button> to create annotations.
                         </p>
                </div>
                    
                     <div class=subChapter id=loadJSON>
                    <h2 >JSON</h2>
                         <p>JSON is a suitable option for restoring data if you want to continue working on an image. The zoner reads JSON generated previously by itself. Unlike XML, JSON can load also custom fields.
                             
                            Click <button>Load JSON</button> to create annotations.
                         </p>
                </div>
                   
                </div>
                
                   <div class=chapter id=editAnnts>
                    <h2 >Edit annotations</h2>
                       <p>Each annotation is displayed as an editable input field <input class=annt  style="width:15em"  value="annotation" readonly/> on a separate line. Click the input field to "activate" the annotation and display additional buttons. If the annotation has a shape linked to it, it will be highlighted. 
                           
                           <ul>
                           <li>To delete an annotation, click the <button class="icon delAnnt"></button> button which appears on the right.
                             <li>To delete the shape linked to the annotation, click t the <button class="icon delete"></button> button which appears on the right.
                               <li>To move the annotation up or down the list, click the <button class="icon move"></button> displayed left of the annotaion fields. Your "selected" annotation will be moved <i>above</i> the annotation which you clicked. 
                               <li> Category and custom fields can be edited in the small bux "current annotation" at the top of the list of annotations. Select a category using the <select style="border:1px solid rgb(125,125,125)"><option>select</option></select> element.
                               
                       </ul>
                       </p>
            
                    <div class=subChapter id=drawingMode>
                    <h2 >Drawing mode</h2>
                        <p>To create a shape on the canvas, place at least two points on the canvas and click the <button>Draw rectangle</button> / <button>Draw polygon</button>  button in the toolbar at the top. Rectangles are drawn by placing two points only.
                         </p>
                        
                        <p>To remove the points before drawing a shape, click <button>Clear points</button>. I you need to change the colour of the points, use the colour picker <input type=color value=#ffffff/> in the toolbar at the top. You can also zoom in and out using the zooming buttons <button class="icon zoomIn"></button><button class="icon zoomOut"></button>. Your current zoom is displayed in the white box next to the buttons. The other white box dynamically displays the coordinates of your cursor.
                    
                        </p>
                </div>
                
                  <div class=subChapter id=selectionMode>
                    <h2 >Selection mode</h2>
                        <p>
                    If you click a shape in selection mode, you activate the relevant annotation as if you clicked the annotation in the lieft tab. Moreover, you can move the shapes using standard drag and drop.
                        </p>
                </div>
                
                <div class=subChapter id=deleteMode>
                    <h2 >Deletion mode</h2>
                        <p>
                    To enter deletion mode, click <button>Delete</button>. The button will remain black while deletion mode is active. When you hover over a shape in deletion mode, its border becomes red. Click the shape to delete it. Be careful, once you delete a shape, you cannot undo it. To exist delete mode, click <button class=active>Delete</button> again.
                        </p>
                </div>
                
                <div class=subChapter id=editMode>
                    <h2 >Edit mode</h2>
                        <p>
                            To enter edit mode, doubleclick the shape that you want to edit. The points defining the shape will re-appear on the canvas and the draw button will change to <button>Re-draw</button>. Drag the points to move them and click the button to redraw the shape. 
                        </p>
                </div>
                
                
                    
                </div>
            
            
                <div class=chapter id=getOutput>
                    <h2 >Get output</h2>
                       <p>The output gets generated as you work. To display it, click <button>Show TEI</button> in the top left conrner of the canvas. A box will appear in the centre of the screen and you can copy and paste the text. Output is available as XML or JSON: 
                       </p>
                    
                    <p>
                  
                        <ul>
                            <li><button style="width:inherit">JSON</button> gives you the complete data for annotations and categories. It can be stored and used to load the data back to the zoner. </li>
                            
                             <li><button style="width:inherit">XML zones</button> contains "graphic" and "zone" XML tags </li>
                            
                            <li><button style="width:inherit">XML annotations/text</button> XML tags for annotations </li>
                             <li><button style="width:inherit">XML categories</button> XML tags for the definition of categories</li>
                            <li><button style="width:inherit">IMT XML</button> a complete IMT XML file including categories and annotations with shapes</li>
                     
                    </ul>
                    </p>
            
                    
                </div>
        
        
                <div class=chapter id=backtup>
                    <h2 >Backup</h2>
                    <p>As mentioned previously, you can store the JSON or XML data generated by the Zoner and then re-loaded. Moreover, your work gets saved automatically as cookies in your browser. <strong>In order to be able to recover the data you need to use the same name of the annotated image</strong>. If you load an image for which you have some cookies stored the button <button>Load saved</button> will appear at the top of the "Annotations" tab (this can take several seconds). Click it to restore you data.  
                    </p>
                    
                    <p>
                        <strong>Cookies are not the preferred backup option. The functionality was included mainly in order to prevent data loss in case your browser crashes unexpectedly. </strong>
                    </p>
            
                    
                </div>
        
        

                <div id="about" class=chapter>
                <h2><a name=about>About the Zoner</a></h2>
                <p>The tool uses <a href="http://raphaeljs.com/">raphael.js</a>, <a href="https://highlightjs.org/">highlight.js</a> and <a href="https://jquery.com/">jQuery</a>, and owes a lot to the fine people of <a href="http://stackoverflow.com/">StackOverflow</a> (in particular <a href="http://stackoverflow.com/questions/25487454/display-image-from-desktop-in-a-page">this question</a>).</p>


                <p>It was written by <a href="http://www.history.qmul.ac.uk/staff/profile/5467-dr-chris-sparks">Chris Sparks</a> to act as a teaching resource during for a <a href="http://digitalmanuscripts.eu/">DEMM Digital Editing TEI training week</a>.</p>
                <p>Please send comments or suggestions to <a href="https://twitter.com/sparkyc84">@sparkyc84</a>.</p>
                <p>The source code of this project is <a href="https://github.com/sparkyc84/tei-zoner">available to fork on GitHub</a>. It is licensed under the MIT License, which means you can use modify and embed it within other projects so long as you retain the copyright notice and license text. I’d be interested to hear about any uses of the tool, and would be happy to incorporate any fixes or enhancements you might suggest.</p>
                </div>
            </div>


        </div>




        <script src="js/angular.min.js"></script>


        <script>
            angular.module("zoner", []);
        </script>
        <script src="js/dragNdrop.js"></script>
        <script src="js/factories.js"></script>
        <script src="js/controllers.js"></script>

        <script src="js/raphael-min.js"></script>
        <script src="js/highlight.pack.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
        <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js" integrity="sha256-T0Vest3yCU7pafRw9r+settMBX6JkKN06dqBnpQ8d30=" crossorigin="anonymous"></script>
        <!--<script src="js/zoner.js"></script> -->

    </div>

</body>

</html>