angular
    .module("zoner")
    .controller("main", function ($scope, $log, cookingFct, drawingFct, uiFct) {

        $scope.instr = uiFct.getInstr();
        $scope.sh = {
            tInput: false,
            help: false,
            tei: false,
            load: false,
            redraw: false,
            editBox: false,
            delete: false,
            emptyAnnts: false
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
        $scope.tInput = {
            text: "",
            separator: " "
        }

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

            $scope.instr.addAnnts.state = 1;

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
            $scope.annts.forEach(function (annt) {
                if (annt.cat == cat) {
                    drawingFct.reColour(annt, $scope.cats[cat].clr);
                } else {
                }

            });

            $scope.$emit("save", {});
        }



        $scope.reColour = function (a) {
            drawingFct.reColour(a, $scope.cats[a.cat].clr);
            $scope.$emit("save", {});
        }


        $scope.activateAnnt = function (shape) {

            $scope.annts.forEach(function (annt, ind) {
                if (annt.shape == shape) {
                    // alert(annt.word);
                    $scope.c.Annt = annt;
                    $scope.c.shape = shape;
                    $scope.c.origAnnt = annt;

                    if ($scope.c.origAnnt.word == "blank") {
                        $scope.delAnnt($scope.c.origAnnt);
                    }

                    var editBox = document.getElementById("cAnnt");
                    var newScroll = document.getElementById("annt" + ind).offsetTop - editBox.offsetHeight - editBox.offsetTop + 10;
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

        }

        $scope.assignShape = function (a) {
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
                annt.shape = drawingFct.cShape(annt, $scope.cats[annt.cat], $scope, path);


            });

        }



        $scope.$on("save", function (e, dt) {

            $log.info("autosaving...");
            cookingFct.saveAnnts($scope.annts, $scope.cats);
        });



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
                    }

                    $scope.loadCooked = function () {
                        var loaded = cookingFct.loadCooked($scope);
                        $scope.initialize(loaded, drawingFct.cShape);
                    }

                    $scope.loadJson = function () {
                        var loaded = JSON.parse($scope.tInput.text);
                        $scope.initialize(loaded, drawingFct.nShape);
                    }

                    $scope.initialize = function (loaded, drawingFnc) {

                        if (loaded.fields) {
                            $scope.fields = loaded.fields;
                        }

                        $scope.annts = loaded.annts;
                        $scope.cats = loaded.cats;
                        $scope.catCount = Object.keys(loaded.cats).length + 1;
                        $scope.annts.forEach(function (a) {
                            if (a.shape) {
                                if (typeof a.shape === "string") {
                                    a.shape = xmlFct.pointsToPath(a.shape);

                                }
                                a.shape = drawingFnc(a, $scope.cats[a.cat], $scope, a.shape);
                            }
                        });

                    }
                    $scope.loadShList = function () {

                        var words = $scope.tInput.text.split($scope.tInput.separator);

                        words.forEach(function (itm, ndx) {

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
                        var replaced = $scope.tInput.text.replace(/xml:id/g, "xmlid");
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
                    $scope.cats["cat" + $scope.catCount] = {
                        name: "",
                        clr: $scope.nClr,
                        id: "cat" + $scope.catCount
                    };
                    $scope.catCount++;


                }


                $scope.delCat = function (cat) {
                    delete $scope.cats[cat.id];
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
                    return rsl;
                }


                $scope.delField = function (field) {

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
                },
                    {
                        title: "XMLcomplete",
                        label: "IMT XML"
                }];

                $scope.switchVersion = function (nv) {
                    $scope.cVersion = nv;
                }



                $scope.getTitle = function (a) {
                    if (a.fields.title && a.fields.title.value != "") {
                        return a.fields.title.value;
                    } else {
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

                    if (!shape) {
                        return;
                    }
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
    .directive("xmlGraphic", function () {
        return {
            templateUrl: "templates/xmlGraphic.html"
        }

    });

angular.module("zoner")
    .directive("xmlAnnotations", function () {
        return {
            templateUrl: "templates/xmlAnnotations.html"
        }

    });

angular.module("zoner")
    .directive("xmlCategories", function () {
        return {
            templateUrl: "templates/xmlCategories.html"
        }

    });

angular.module("zoner")
    .directive("xmlComplete", function () {
        return {
            templateUrl: "templates/xmlComplete.html"
        }

    });

angular.module("zoner")
    .directive("jsonComplete", function () {
        return {
            templateUrl: "templates/jsonComplete.html"
        }

    });




angular.module("zoner")
    .directive("instRow", function () {
        return {
            scope: true,
            link: {
                post: function (scope, iElement, iAttributes, controller) {
                    scope.wind = iAttributes.wind;
                    scope.toggle = function () {
                        scope.instr[scope.wind].show = !scope.instr[scope.wind].show;
                    }
                }

            },
            template: "<sup style='display:none' class='instr' ng-mouseenter='toggle()' ng-mouseleave='toggle()'><span ng-show='instr[wind].show!=false || instr[wind].row[instr[wind].state].s!=false'>{{instr[wind].row[instr[wind].state].i}}</span><span ng-show='instr[wind].show==false && instr[wind].row[instr[wind].state].s==false'>?</span></sup>"
        }

    });