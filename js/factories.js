angular.module("zoner")
    .factory("cookingFct", function (drawingFct) {


        var filename;

        function handleFileSelect(evt, link) {
            var files = evt.files;
            filename = evt.files[0].name;
            link.img.filename = filename;

            for (var i = 0, f; f = files[i]; i++) {

                if (!f.type.match('image.*')) {

                    continue;
                }

                var reader = new FileReader();

                reader.onload = (function (theFile) {


                    var prevImgs = getCookedJson("images");
                    

                    if ($.inArray(filename, prevImgs) == -1) {
                        prevImgs.push(filename);
                        cookJson("images", prevImgs);

                    }

                    var savedAnnts = getCookie(filename + "_annts");
                    if (savedAnnts != "") {
                        link.sh.load = true;
                    } else {
                        presetCookies([filename + "_annts", filename + "_cats"]);
                    }



                    // ++ COOKIES - copy FROM original

                    // ++ handle with controller instead  

                    return function (e) {
                        presetCookies(["images", "annts"]);
                        $("#pickfile").hide();
                        $('img#editor').attr('src', e.target.result);

                        if ($('#grabber').length > 0)
                            $('#grabber').remove();

                        $("#reload").prop('disabled', false);
                        setTimeout(function () {
                            drawingFct.createEditor(link)
                        }, 100);
                    }




                })(f);
                reader.readAsDataURL(f);
            }
        }

        function presetCookies(cookList) {
            cookList.forEach(function (ck) {

                var chck = getCookie(ck);
                

                if (chck == null || chck == "undefined" || chck == "" || chck == "empty") {
                    setCookie(ck, "[]", 365);

                }



            });
        }


        function addToCooked(cVar, jVar) {
            var cooked = getCookedJson(cVar);
            cooked.push(jVar);
            cookJson(cVar, cooked, 365);

            
        }


        function getCookedJson(cVar) {
            console.log(cVar);
            var cooked = getCookie(cVar);

            if (cooked) {
                var toObj = JSON.parse(cooked);
                

                return toObj;
            } else {
                return [];
            }

        }

        function cookJson(cVar, jVar) {

            var toStr = JSON.stringify(jVar);
            setCookie(cVar, toStr, 365);

            
        }



        function setCookie(cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        }

        function getCookie(cname) {
            var name = cname + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }

        function saveAnnts(annts, cats) {
    
            cookJson(filename + "_annts", []);
            annts.forEach(function (a) {
                 var sh = a.shape;
                if (sh != null) {
                    a.shape = sh.attrs.path;
                }
                
                addToCooked(filename + "_annts", a);
                console.log(JSON.stringify(a));
                a.shape = sh;

            });

            cookJson(filename + "_cats", []);

            for (c in cats) {
                addToCooked(filename + "_cats", cats[c]);
            }


        }


        function loadCooked(scope) {

            var catList = getCookedJson(filename + "_cats");
            var catObj = {};
            catList.forEach(function (itm) {
                catObj[itm.id] = {
                    name: itm.name,
                    clr: itm.clr,
                    id: itm.id
                };
            });


            var shList = getCookedJson(filename + "_annts");

            return {
                cats: catObj,
                annts: shList
            };
        }



        return {
            handleFile: handleFileSelect,
            saveAnnts: saveAnnts,
            loadCooked: loadCooked
        };


    });


angular.module("zoner")
    .factory("xmlFct", function (drawingFct) {

        function getCats(xmlDoc) {
            var rsl = {};

            var caTags = xmlDoc.querySelectorAll("rendition");
            caTags.forEach(function (node) {
                var id = node.getAttribute("xmlid");
                var name = node.querySelector("label").innerHTML;
                var color = node.querySelector("code").innerHTML.replace(/ ?color: ?/i, "");

                rsl[id] = {
                    name: name,
                    id: id,
                    clr: color
                };
            });
            console.log(rsl);
            return rsl;
        }




        function getAnnts(xmlDoc) {
            var rsl = [];

            var annTags = xmlDoc.querySelectorAll("div[type=imtAnnotation]");
            annTags.forEach(function (node) {
                var corresp = node.getAttribute("corresp");
                word = node.querySelector("head").innerHTML;
                title = node.querySelector("p").innerHTML;
                shape = parseShapeXml(xmlDoc.querySelector("zone[xmlid=" + corresp.replace("#", "") + "]"));


                rsl.push({
                    word: word,
                    cat: shape.cat,
                    shape: shape.coords,
                    fields: {
                        title: {
                            name: "title",
                            value: title
                        }
                    }
                });
            });

            return rsl;
        }

        function parseShapeXml(zone) {
            var shapeCat = zone.getAttribute("rendition");
            if (zone.getAttribute("points")) {
                
                var shapePoints = zone.getAttribute("points");
             var shapeCoords=pointsToPath(shapePoints);

            } else {
                lrx = zone.getAttribute("lrx");
                lry = zone.getAttribute("lry");
                ulx = zone.getAttribute("ulx");
                uly = zone.getAttribute("uly");
                var shapeCoords = [{
                    x: ulx,
                    y: uly,
                    string: ulx + "," + uly
                }, {
                    x: lrx,
                    y: lry,
                    string: lrx + "," + lry
                }];
            }

            return {
                cat: shapeCat,
                coords: shapeCoords
            }
        };
    
    
    function pointsToPath(shapePoints){
           var shapeCoords = [];
                shapePoints=shapePoints.trim();
            console.log("INPUT POINTS: "+shapePoints);
                var pList = shapePoints.split(" ");
                pList.forEach(function (p) {
                    var xy = p.split(",");
                    shapeCoords.push({
                        x: xy[0],
                        y: xy[1],
                        string: xy[0] + "," + xy[1]
                    });

                });
        console.log("GENERATED COORDS:");
        console.log(JSON.stringify(shapeCoords));
        return shapeCoords;
    }
    

        return {
            getAnnts: getAnnts,
            getCats: getCats,
            pointsToPath: pointsToPath
        }

    });


// this module handles drawing of shapes

angular.module("zoner")
    .factory("drawingFct", function () {
    
    // NOTE: clicking on canvas gets disabled when you enter a shape/point to avoid confusion of event coordinates
      var mode = "drawing";
        var canvas;
        var paper;
        var coords = new Array();
        var points = new Array();
        var shapes = new Array();
        var rects = new Array();
        var imgWidth, imgheight, offset;
        var zm = parseFloat(1);
        var pointColour="#ffffff";
        var colour = 'black',
            mousedown = false,
            width = 1,
            lastX, lastY, path, pathString;
        var sPoint = null;
        var sShape = null;
        var sRef = null;
        var editedShape;
    
    //change point colour
    
    function changePointColour(newColour){
        pointColour=newColour;
    }
    
    
    // swich dele mode on and off
        function toggleDelete() {
            if (mode != "deletion") {
                changeMode("deletion");
                return true;
            } else if (points.length != 0) {
                changeMode("drawing");
                  $(canvas).click(function(e){placePoint(e)});
                return false;
            } else {
                changeMode("selection");
                  $(canvas).click(function(e){placePoint(e)});
                return false;
            }
        }

    // initialize the canvas and Raphael paper
        function createEditor(link) {
            imgwidth = $('#editor').width();
            imgheight = $('#editor').height();
            offset = $('img#editor').offset();

            link.img.width = imgwidth;
            link.img.height = imgheight;

            $('#canvas').css({
                position: "absolute",
                top: Math.floor(offset.top),
                left: 0,
                width: Math.floor(imgwidth),
                height: Math.floor(imgheight),
                zIndex: 1,
                opacity: .5,
            });

        // ?remove?
            canvas = document.getElementById('canvas'),
                paper = new Raphael(canvas, imgwidth, imgheight),
                $(canvas).css({
                    "top": 0
                });
        
        // basic event handler for click - draw point
            $(canvas).click(function(e){placePoint(e)});
            
        // event handler for displaying coordinates
            $(canvas).mousemove(function (e) {
                xpx = e.pageX - $(this).offset().left;
                ypx = e.pageY - $(this).offset().top;

                cpx = e.offsetX;
                cpy = e.offsetY;
                link.crds.x = (xpx + "/" + cpx);
                link.crds.xp = (Math.round((xpx / imgwidth) * 100));
                link.crds.y = (ypx + "/" + cpy);
                link.crds.yp = (Math.round((ypx / imgheight) * 100));
                link.crds.xy = (xpx + "," + ypx);
                
            // ?delete - handled by drag?
                if (sPoint != null) {
                    points[sPoint].attr({
                        cx: xpx,
                        cy: ypx
                    });
                }

                if (sShape != null) {
                    
                    var nPath = calcPath(xpx, ypx, sRef);
                    sShape.attr("path", nPath);
                }
                
            // send changes to controller
                link.$apply();
            });

        }


    // draw a point
        function nPoint(x, y, i) {
        // ?what is the point of mousedown
                mousedown = true;

                var size = Math.ceil(3 / zm);
               
                var point = paper.circle(x, y, size);
                point.attr("fill", pointColour);
                point.crds = i;
                
            // ?why 2 arrays?
                coords.push(point);
                points.push(point);
            
            // drag n drop functions
                function pointDrag(x, y) {
                    this.ox = this.attr("cx");
                    this.oy = this.attr("cy");
                    this.attr({
                        opacity: 0.5
                    });
                    
                }

                function pointMove(dx, dy) {
                    this.attr({
                        fill: "green"
                    });
                    this.attr({
                        cx: this.ox + (dx / zm),
                        cy: this.oy + (dy / zm)
                    });
                }

                function pointStop() {
                    var x = this.attr("cx");
                    var y = this.attr("cy");
                    this.attr({
                        opacity: 1
                    });
                    this.attr({
                        fill: "yellow"
                    });
                }

            // point event handlers
            // ?define for prototype?
                point.drag(pointMove, pointDrag, pointStop);

                point.mouseover(function (p) {
                    // ?is this necessary?
                    $(canvas).unbind("click");
                    this.attr("r", 6);
                });

                point.mouseout(function () {
                    // ?is this necessary?
                    $(canvas).click(function(e){placePoint(e)});
                    this.attr("r", 3);
                });
                
            // ?rewrite to angular?
                if (points.length > 2) {
                    $("#closepath").prop('disabled', false).html('Draw Polygon');
                } else if (points.length == 2) {
                    $("#closepath").prop('disabled', false).html('Draw Rectangle');
                } else {
                    $("#closepath").prop('disabled', true).html('Draw');
                }
                $('#clearpoints').prop('disabled', false);
          
            }


        
    
    // place point
        function placePoint(e) {
             if(mode=="editing"){
                console.log("You cannot add points in editing mode.");
            } else {
                
                if(mode=="selection" || mode=="deletion"){
                    changeMode("drawing");
                }
               
               if(e.currentTarget.tagName=="DIV"){
                var x = e.offsetX;
                var y = e.offsetY;
            }else if(e.currentTarget.tagName=="path"){
                var x = e.layerX;
                var y = e.layerY;
            }
                        var i = {
                            x: x,
                            y: y,
                            string: x + "," + y
                        };
                 console.log("placing a new point: " + x + " : " + y);
                console.log(e.currentTarget.tagName);
                        nPoint(x, y, i);  
                
            }
              
            
           
            }
    
    // map coordinates to points
        function readPoints(crds) {
            rsl = crds.map(function (cp) {
                var x = cp.attr("cx");
                var y = cp.attr("cy");
                return {
                    x: x,
                    y: y,
                    string: x + "," + y
                }
            });
            return rsl;
        }


    // drawing shape
        function nShape(annt, cat, scope, customCoords) {
            console.log("nSHAPE");
            // load custom coords - if drawing from XML
            if (customCoords) {
                coords = customCoords;
            } else {
                coords = readPoints(coords);
            }

            var path = null;

            if (coords.length == 2) {
                // calculate polygon coordinates from rectangle
                var x1 = coords[1].x;
                var y1 = coords[0].y;
                coords.splice(1, 0, {
                    x: x1,
                    y: y1,
                    string: x1 + "," + y1
                });

                var x2 = coords[0].x;
                var y2 = coords[2].y;
                coords.push({
                    x: x2,
                    y: y2,
                    string: x2 + "," + y2
                });


            }

            // calculate shape path from coords
                for (var i = 0; i < coords.length; i++) {
                    if (i == 0) {
                        var path = "M" + coords[i].string; 
                    } else {
                        path += "L" + coords[i].string; 
                    }

                }
                path += "z";

            // call drawing function proper and get shape object
            changeMode("selection");
                var rsl = cShape(annt, cat, scope, path);
               
                $("#clearpoints").prop('disabled', true);
            
           clearPoints();
            
            // send new shape to controller
            return rsl;
        }


    // shape drawing function proper
       function cShape(annt, cat, scope, path) {
           console.log("cSHAPE");
        // init shape object
            var shape = paper.path(path);

        // apply category format
            if (cat != null) {
                shape.attr({
                    fill: cat.clr,
                    opacity: 1
                });
            } else {
                shape.attr({
                    fill: "rgba(255,0,0,0.5)",
                    opacity: 1
                });
            }
           
        // shape event handlers
           // MODES
            shape.dblclick(function () {
                if (mode == "editing") {
                    scope.eShape();
                }
                
                changeMode("editing");
                scope.editMode(this);
                editShape(this);
            });

            shape.click(function (e) {
                if (mode=="deletion") {
                    annt.shape = null;
                    this.remove();
                  //  toggleDelete();
                   // scope.sh.delete=false;
                   
                    //?old: getPaths();

                } else if(mode=="selection") {
                    scope.activateAnnt(this);
                    highlightShape(this, "inverted", 7)
                } else {
                    console.log("calling place point");
                    placePoint(e);
                }

            });

            shape.hover(function (p) {
                // MODES
                $(canvas).unbind("click");
                switch(mode){
                    case "deletion": this.attr("stroke","red"); break;
                }
                this.attr("stroke-width", 3);
            });

            shape.mouseout(function (p) {
                // MODES
                $(canvas).click(function(e){placePoint(e)});
                this.attr("stroke", "black");
                this.attr("stroke-width", 1);
            });

        // drag n drop functions
            function shapeDrag(x, y) {
                if(mode=="selection"){
                   this.oPath = this.attr("path");
                    this.attr({
                    opacity: 0.5
                }); 
                }
                
            }

           
            function shapeMove(dx, dy) {
                 if(mode=="selection"){
                this.attr({
                    opacity: 0.7
                });
                var moved = reCalcPath(dx / zm, dy / zm, this.oPath);
                this.attr({
                    path: moved
                });
                 }
            }

            function shapeStop() {
                 if(mode=="selection"){
                this.attr({
                    opacity: 1
                });
                 }
            }

            shape.drag(shapeMove, shapeDrag, shapeStop);
           
            return shape;
        }


    // delete shape proper
        function delShape(which) {
            which.shape.remove();
            changeMode("selection");
            return null;
        }

    // ?probably delete?
        function calcPath(cx, cy, sRef) {
            var px = cx - sRef.x;
            var py = cy - sRef.y;

            var nPath = [];

            sRef.pth.forEach(function (pt) {
                if (pt[0] != "Z") {
                    var nx = parseFloat(pt[1] + px);
                    var ny = parseFloat(pt[2] + py);

                    nPath.push(pt[0] + nx + "," + ny);
                } else {
                    nPath.push("Z");
                }
            });

            nPath = nPath.join("");
            return nPath;
        }

    // recalc path after movement - used for shape dragging
        function reCalcPath(px, py, current) {
            var nPath = [];
            current.forEach(function (pt) {
                if (pt[0] != "Z") {
                    var nx = parseFloat(pt[1] + px);
                    var ny = parseFloat(pt[2] + py);

                    nPath.push(pt[0] + nx + "," + ny);
                } else {
                    nPath.push("Z");
                }


            });

            nPath = nPath.join("");
            return nPath;
        }
    
// editing functions
    // initialize editing
        function editShape(shp) {
            changeMode("editing");
            editedShape = shp;
            shp.attrs.path.forEach(function (pt) {
                if (pt[0] != "Z") {
                    var i = {
                        x: pt[1],
                        y: pt[2],
                        string: pt[1] + "," + pt[2]
                    };
                    nPoint(pt[1], pt[2], i)
                }

            });
        }

    // redraw a shape from points
        function redrawShape() {
            coords = readPoints(coords);
            for (var i = 0; i < coords.length; i++) {
                if (i == 0) {
                    var path = "M" + coords[i].string; 
                } else {
                    path += "L" + coords[i].string; 
                }
            }
            path += "z";
            editedShape.attr("path", path);
            clearPoints();
         
            // ?turn off edit mode?
        }

    // delete all points
        function clearPoints() {
            for (var i = 0; i < points.length; i++) {
                points[i].remove()
            }
            coords.length = 0;
            points.length = 0;
            $('#clearpoints').prop('disabled', true);
        
     }

    // delete all shapes
        function clearShapes(target) {
            confirmation = window.confirm("Are you sure? This will delete everything, and you can't undo it.");
            if (confirmation) {
                target.annts.forEach(function (a) {
                    a.shape = null;
                });
                
                paper.clear();
                points.length = 0;
                coords.length = 0;
                shapes.length = 0;
                rects.length = 0;
                $("#clearpoints").click();
                //?old: getPaths();
                $("#clearall").prop('disabled', true);

            } else return;
        }

    // change zoom
        function zoomChng(zChng) {
            zm = roundToTwo(parseFloat(zm + zChng));

            $("#editor").css({
                "transform": "scale(" + zm + "," + zm + ")"
            });
            $(canvas).css({
                "transform": "scale(" + zm + "," + zm + ")"
            });

            return zm;

            function roundToTwo(num) {
                return +(Math.round(num + "e+2") + "e-2");
            }
            
        }

    // change colour
        function reColour(a, newColour) {
            a.shape.attr("fill", newColour);
        }
    
    // highlight shape
        function highlightShape(shape, c, w) {
            shape.attr("stroke-width", w);
            
            if(c=="inverted"){
                c=invertColor(shape.attr("fill"));
            }
            
            shape.attr("stroke", c);
        }
    
    //change mode
    
    function changeMode(newMode){
        console.log("entering _" + newMode + "_ mode");
        mode=newMode;
        var cursorImg;
        switch(newMode){
            case "deletion": cursorImg="no-drop"; break; 
            case "selection": cursorImg="grab"; break; 
            case "editing": cursorImg="pointer"; break; 
            case "drawing": cursorImg="crosshair"; break; 
        }
        
        $("#canvas").css({cursor:cursorImg});
    }
    // functions for converting colour (external source)
    function invertColor(hex) {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    // invert color components
    var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
        g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
        b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
    // pad each with zeros and return
    return '#' + padZero(r) + padZero(g) + padZero(b);
}

function padZero(str, len) {
    len = len || 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
}
    
        return {
            createEditor: createEditor,
            nShape: nShape,
            cShape: cShape,
            delShape: delShape,
            clearPoints: clearPoints,
            clearShapes: clearShapes,
            zoomChng: zoomChng,
            reColour: reColour,
            redrawShape: redrawShape,
            highlightShape: highlightShape,
            toggleDelete: toggleDelete,
            changePointColour: changePointColour
        };


    });


	
	angular.module("zoner")
	.factory("uiFct",function(){
		
		var instr={loadfile:
					{row:[{i:"Upload an image from your computer.",s:true}],
					state:0, 
					show:true},
                   addAnnts:{row:[{i:"Before you create annotations, load an image",s:false}],
					state:0, 
					show:false},
                   annotations:{row:[{i:"Tab listing your annotations.",s:false}],
					state:0, 
					show:false},
                   categories:{row:[{i:"Create catagories",s:false}],
					state:0, 
					show:false},
                   fields:{row:[{i:"Create custom fields",s:false}],
					state:0, 
					show:false},
                   addCategory:{row:[{i:"Create custom fields",s:false}],
					state:0, 
					show:false},
                   drawShape:{row:[{i:"Place points on the canvas before you draw a shape.",s:false}],
					state:0, 
					show:false},
                   addField:{row:[{i:"Add custon fields to be available for every annotation.",s:false}],
					state:0, 
					show:false},
                   coordinates:{row:[{i:"displays coordinates as you move over the canvas",s:false}],
					state:0, 
					show:false}
                   
			 };
			 
		function getInstr()
		{
			return instr;
		}
		
		return {getInstr:getInstr};
		
	});