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
                    <li>Step-by-step guide</li>
                    <ol>
                        <li><a href="#loadImg">Load image</a></li>
                        <li><a href="#customFields">Create custom fields</a></li>
                        <li><a href="#customCats">Create custom categories</a></li>
                        <li><a href="#loadImg">Add annotations</a></li>
                        <ol>
                            <li><a href="#loadImg">One by one</a></li>
                            <li><a href="#loadImg">Load text</a></li>
                            <ol>
                                <li><a href="#loadImg">Plain text</a></li>
                                <li><a href="#loadImg">XML</a></li>
                                <li><a href="#loadImg">JSON</a></li>

                            </ol>
                        </ol>
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
                    <p>You can sort annotations into categories. Different categories get displayed in different colours. By default, all annotations are assigned the "default" category and displayed in blue. To add your own categories, go the the "categories" tab on the left. Use the colour picker at the bottom to select a colour and click the <button class="icon add"></button> add button. You can edit the names and colours of categories any time using the input fields and colour pickers in the "categories" tab.
                    </p>
                   
                </div>


                <h2><a name=about>About the Zoner</a></h2>
                <p>The tool uses <a href="http://raphaeljs.com/">raphael.js</a>, <a href="https://highlightjs.org/">highlight.js</a> and <a href="https://jquery.com/">jQuery</a>, and owes a lot to the fine people of <a href="http://stackoverflow.com/">StackOverflow</a> (in particular <a href="http://stackoverflow.com/questions/25487454/display-image-from-desktop-in-a-page">this question</a>).</p>


                <p>It was written by <a href="http://www.history.qmul.ac.uk/staff/profile/5467-dr-chris-sparks">Chris Sparks</a> to act as a teaching resource during for a <a href="http://digitalmanuscripts.eu/">DEMM Digital Editing TEI training week</a>.</p>
                <p>Please send comments or suggestions to <a href="https://twitter.com/sparkyc84">@sparkyc84</a>.</p>
                <p>The source code of this project is <a href="https://github.com/sparkyc84/tei-zoner">available to fork on GitHub</a>. It is licensed under the MIT License, which means you can use modify and embed it within other projects so long as you retain the copyright notice and license text. I’d be interested to hear about any uses of the tool, and would be happy to incorporate any fixes or enhancements you might suggest.</p>

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