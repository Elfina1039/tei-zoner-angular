angular
    .module("zoner")
    .controller("main", function ($scope, $log, cookingFct, drawingFct, uiFct) {

    $scope.instr=uiFct.getInstr();
        $scope.sh = {
            tInput: false,
            help: false,
            tei: false,
            load: false,
            redraw: false,
            editBox: false,
            delete: false
        };

        $scope.img = {
            filename: "file",
            width: 0,
            height: 0
        };
        $scope.c = {
            Annt: null,
            origAnnt: null,
            shape: null,
            tab: "annTab"
        };
        $scope.crds = {
            zoom: 1,
            pointColour: "#ffffff"
        };
        $scope.nClr = "#ff0000";
        $scope.catCount = 1;

        $scope.handleFile = function (evt) {

            $log.info(evt);

            cookingFct.handleFile(evt, $scope);
            $scope.sh.editBox = true;

        };


        $scope.delShape = function (annt) {

            annt.shape = drawingFct.delShape(annt);


        };

        $scope.eShape = function () {

            drawingFct.redrawShape();
            $scope.sh.redraw = false;
            $scope.c.origAnnt = null;

        };

        $scope.reColourAll = function (cat) {
            console.log("recolouring: " + cat);
            $scope.annts.forEach(function (annt) {
                if (annt.cat == cat) {
                    console.log("recolour: " + annt.cat);
                    drawingFct.reColour(annt, $scope.cats[cat].clr);
                } else {
                    console.log("no changes: " + annt.cat);
                }

            });

            $scope.$emit("save", {});
        }



        $scope.reColour = function (a) {
            console.log(a);
            drawingFct.reColour(a, $scope.cats[a.cat].clr);
            $scope.$emit("save", {});
        }


        $scope.activateAnnt = function (shape) {

            $scope.annts.forEach(function (annt, ind) {
                if (annt.shape == shape) {
                    // alert(annt.word);
                    $scope.c.Annt = annt;
                    $scope.c.shape = shape;
                    $scope.c.origAnnt=annt;
                    
                    if($scope.c.origAnnt.word=="blank"){
                        $scope.delAnnt($scope.c.origAnnt);
                    }

                    var editBox = document.getElementById("cAnnt");
                    var newScroll = document.getElementById("annt" + ind).offsetTop - editBox.offsetHeight - editBox.offsetTop + 10;
                    console.log("new scroll: " + newScroll);
                    document.getElementById("shList").scrollTop = newScroll;
                }
            });


        }

        $scope.editMode = function (shape) {
            $scope.sh.redraw = true;
            $scope.c.shape = shape;

            $scope.annts.forEach(function (annt) {
                if (annt.shape == shape) {
                    // alert(annt.word);
                    $scope.c.origAnnt = annt;
                }
            });


            console.log("entering edit mode - " + $scope.sh.redraw);
        }

        $scope.assignShape = function (a) {
            console.log( $scope.c.shape);
            a.shape = $scope.c.shape;

            if ($scope.c.origAnnt) {
                $scope.c.origAnnt.shape = null;
            }

            drawingFct.clearPoints();
            $scope.sh.redraw = false;
            $scope.c.origAnnt = null;
        }

        $scope.redrawAll = function () {
            $scope.annts.forEach(function (annt) {
                var path = annt.shape.attrs.path;
                annt.shape = drawingFct.delShape(annt);
                annt.shape = drawingFct.cShape( annt, $scope.cats[annt.cat], $scope, path);


            });

        }



        $scope.$on("save", function (e, dt) {

            $log.info("autosaving...");
            cookingFct.saveAnnts($scope.annts, $scope.cats);
        });


        $log.info("controller MAIN initialized");


    });

angular
    .module("zoner")
    .directive("currentAnnt", function () {

        return {
            templateUrl: "templates/currentAnnt.html"
        }

    });


angular
    .module("zoner")
    .directive("shList", function ($log, cookingFct, xmlFct) {

        $log.info("directive shList initialized");

        return {
            controller: function ($scope, drawingFct) {
                    //{word:"Beowulf",cat:null, shape:null}, {word:"Hwaet",cat:null, shape:null}
                    $scope.annts = [];

                    $scope.startDrag = function () {
                        console.log("dragging");
                    }

                    $scope.loadCooked = function () {
                        console.log("loading at controller");
                        var loaded = cookingFct.loadCooked($scope);
                        $scope.initialize(loaded, drawingFct.cShape);
                    }

                    $scope.loadJson = function () {
                        var loaded = JSON.parse($scope.tInput);
                        $scope.initialize(loaded,drawingFct.nShape);
                    }

                    $scope.initialize = function (loaded, drawingFnc) {
                        console.log(JSON.stringify(loaded));
                        $scope.annts = loaded.annts;
                        $scope.cats = loaded.cats;
                        $scope.catCount=Object.keys(loaded.cats).length+1;
                        console.log("drawing shapes");
                        $scope.annts.forEach(function (a) {
                            if (a.shape) {
                                if (typeof a.shape === "string") {
                                    console.log(JSON.stringify(a.shape));
                                     a.shape = xmlFct.pointsToPath(a.shape);
                                   
                                }
                                
                                a.shape = drawingFnc(a, $scope.cats[a.cat], $scope, a.shape);
                            }
                        });

                    }
                    $scope.loadShList = function () {

                        var words = $scope.tInput.split(" ");

                        words.forEach(function (itm, ndx) {
                            console.log("adding " + itm);

                            $scope.annts.push({
                                word: itm,
                                cat: "default",
                                shape: null,
                                fields: $scope.getFields()
                            });

                        });

                    }

                    $scope.loadXml = function () {

                        parser = new DOMParser();
                        var replaced = $scope.tInput.replace(/xml:id/g, "xmlid");
                        xmlDoc = parser.parseFromString(replaced, "text/xml");

                        var xmlCats = xmlFct.getCats(xmlDoc);
                        var xmlAnnts = xmlFct.getAnnts(xmlDoc);

                        $scope.initialize({
                            annts: xmlAnnts,
                            cats: xmlCats
                        }, drawingFct.nShape);
                    }


                    $scope.newAnnt = function () {

                        $scope.annts.push({
                            word: "",
                            cat: "default",
                            shape: null,
                            fields: $scope.getFields()
                        });
                        $scope.$emit("save", {});


                    }

                    $scope.delAnnt = function (annt) {
                        if (annt.shape) {
                            annt.shape = drawingFct.delShape(annt);
                        }

                        if (annt == $scope.c.Annt) {
                            $scope.c.Annt = null;
                        }

                        ind = $scope.annts.indexOf(annt);
                        $scope.annts.splice(ind, 1);
                        $scope.$emit("save", {});

                    }

                    $scope.moveAnnt = function (ndx, cAnnt) {


                        ind = $scope.annts.indexOf(cAnnt);
                        console.log("moving from " + ind + " to " + ndx);
                        if (ndx > ind) {
                            ndx--;
                        }
                        $scope.annts.splice(ind, 1);
                        $scope.annts.splice(ndx, 0, cAnnt);
                        $scope.$emit("save", {});
                        $scope.redrawAll();

                    }

                    $scope.highlightShape = function (a, c, w) {

                        if (a.shape) {
                            drawingFct.highlightShape(a.shape, c, w);
                        }


                    }

                }

                ,
            templateUrl: "templates/shList.html"
        }

    });


angular
    .module("zoner")
    .directive("catList", function ($log) {

        $log.info("directive catList initialized");

        return {

            controller: function ($scope) {

                $scope.cats = {
                    default: {
                        name: "default",
                        clr: "#0000ff",
                        id: "default"
                    }
                };

                $scope.newCat = function () {

                    console.log($scope.nClr);
                    console.log($scope.catCount);
                    $scope.cats["cat" + $scope.catCount] = {
                        name: "",
                        clr: $scope.nClr,
                        id: "cat" + $scope.catCount
                    };
                    $scope.catCount++;


                }


                $scope.delCat = function (cat) {
                    console.log(cat);
                    delete $scope.cats[cat.id];
                    console.log($scope.cats);
                }

            },

            templateUrl: "templates/catList.html"
        }

    });

angular
    .module("zoner")
    .directive("fieldList", function ($log) {

        $log.info("directive fieldList initialized");

        return {

            controller: function ($scope) {

                $scope.fields = [{
                    name: "title"
                }];

                $scope.newField = function () {

                    $scope.fields.push({
                        name: ""
                    });

                }

                $scope.getFields = function () {
                    var rsl = {};

                    $scope.fields.forEach(function (f) {
                        rsl[f.name] = {
                            name: f.name,
                            value: ""
                        };

                    });
                    console.log(rsl);
                    return rsl;
                }


                $scope.delField = function (field) {
                    console.log(field);

                }

            },

            templateUrl: "templates/fieldList.html"
        }

    });


angular
    .module("zoner")
    .directive("controls", function ($log) {

        $log.info("directive controls initialized");

        return {
            controller: function ($scope, drawingFct, $log) {

                $scope.nShape = function () {
                    $log.info("nShape at controller:");
                    $log.info($scope.c.Annt);

                    if ($scope.c.Annt == null || $scope.c.Annt.shape != null) {
                        $scope.c.Annt = {
                            word: "_blank",
                            cat: "default",
                            shape: null,
                            fields: $scope.getFields()
                        };
                        console.log("adding blank");
                        $scope.annts.push($scope.c.Annt);
                    }

                    $scope.c.Annt.shape = drawingFct.nShape($scope.c.Annt, $scope.cats[$scope.c.Annt.cat], $scope);
                    $scope.$emit("save", {});


                };


                $scope.clearPoints = function () {
                    drawingFct.clearPoints();
                };

                $scope.clearShapes = function () {
                    drawingFct.clearShapes($scope);
                };

                $scope.zoomChng = function (zch) {
                    if ($scope.crds.zoom > 0.1 || zch > 0) {
                        $scope.crds.zoom = drawingFct.zoomChng(zch);
                    }

                };

                $scope.changePointColour = function (zch) {
                    drawingFct.changePointColour($scope.crds.pointColour);
                };

                $scope.toggleDelete = function () {
                    $scope.sh.delete = drawingFct.toggleDelete();
                }

                $scope.roundNum = function (floatNum) {
                    // console.log(parseInt(floatNum));
                    return parseInt(floatNum);
                }

                $scope.teiButton = function (shTei) {
                    if (shTei == true) {
                        return "Hide TEI";
                    } else {
                        return "Show TEI";
                    }
                }

            },
            templateUrl: "templates/controls.html"
        }

    });

angular
    .module("zoner")
    .directive("teiMarkup", function ($log, cookingFct) {

        $log.info("directive teiMarkup initialized");

        return {
            controller: function ($scope) {

                $scope.cVersion = "TEI XML";

                $scope.versions = [{
                    title: "JSON",
                    label: "JSON"
                }, {
                    title: "TEI XML",
                    label: "XML zones"
                }, {
                    title: "xmlPlus",
                    label: "XML annotations/text"
                }, {
                    title: "categories",
                    label: "XML categories"
                }];

                $scope.switchVersion = function (nv) {
                    $scope.cVersion = nv;
                }



                $scope.getTitle = function (a) {
                    // console.log(a);
                    if (a.fields.title && a.fields.title.value != "") {
                        // console.log("returning tile");
                        return a.fields.title.value;
                    } else {
                        // console.log("returning word");
                        return a.word;
                    }
                }


                $scope.stringify = function (a, v) {

                    if ($scope.cats[a.cat]) {
                        sColor = $scope.cats[a.cat].clr;
                        catId = $scope.cats[a.cat].id;
                    } else {
                        sColor = "#ffffff";
                        catId = "default";

                    }
                    switch (v) {
                        case "xml2":
                            var tTag = '&lt;div corresp="#imtArea_' + $scope.annts.indexOf(a) + '"type="imtAnnotation"&gt;&lt;head&gt;' + a.word + '&lt;/head&gt;&lt;div&gt;&lt;p&gt;' + a.word + '&lt;/p&gt;&lt;/div&gt;&lt;/div&gt;';
                            break;
                        case "json2":
                            var tTag = '{"word":"' + a.word + '","color":"' + sColor + '","shape":"' + $scope.getPoints(a.shape) + '", "cat":"' + catId + '", "fields":' + JSON.stringify(a.fields) + '}';
                            break;

                    }



                    return tTag;
                }

                $scope.stringifyAnnts = function (annts) {
                    var rsl = [];
                    console.log(annts);
                    annts.forEach(function (annt) {
                        rsl.push($scope.stringify(annt, "json2"));
                    });
                    return rsl.join(",");
                }

                $scope.stringifyPure = function (inp) {
                    return JSON.stringify(inp);
                }

                $scope.getPoints = function (shape) {
                    var x, y, points = "";
                    if (shape.attrs != null) {

                        for (var j = 0; j < shape.attrs.path.length; j++) {
                            if ($.inArray(shape.attrs.path[j][0], new Array('M', 'L')) > -1) {
                                x = shape.attrs.path[j][1];
                                y = shape.attrs.path[j][2];
                                points += " " + Math.round(x) + "," + Math.round(y) + " ";
                            }
                        }
                    }


                    return points;
                }

            },
            templateUrl: "templates/teiMarkup.html"
        }

    });


 angular.module("zoner")
 .directive("instRow",function(){
	return {
		scope:true,
		link:{
			post:function(scope,iElement,iAttributes,controller)
			{
				scope.wind=iAttributes.wind;
				console.log(scope.wind);
				scope.toggle=function(){
					scope.instr[scope.wind].show=!scope.instr[scope.wind].show;
					console.log(scope.instr[scope.wind].show);
				}
			}
			
		},
		template:"<sup class='instr' ng-mouseenter='toggle()' ng-mouseleave='toggle()'><span ng-show='instr[wind].show!=false || instr[wind].row[instr[wind].state].s!=false'>{{instr[wind].row[instr[wind].state].i}}</span><span ng-show='instr[wind].show==false && instr[wind].row[instr[wind].state].s==false'>?</span></sup>"
		}
		
	});