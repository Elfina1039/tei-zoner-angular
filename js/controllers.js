angular
.module("zoner")
.controller("main",function($scope,$log,cookingFct, drawingFct){

          $scope.sh={tInput:false,  help:false, tei:false, load:false, redraw:false, editBox:false};
    
    $scope.img={filename:"file", width:0, height:0};
    $scope.c={Annt:null, origAnnt:null, shape:null, tab:"annTab" };
    $scope.crds={};
    $scope.nClr="#ff0000";
    $scope.catCount=1;
    
    $scope.handleFile=function(evt){
        
        $log.info(evt);
   
        cookingFct.handleFile(evt, $scope);
        $scope.sh.editBox=true;
        
    };
    
    
      $scope.delShape=function(annt){
        
     annt.shape=drawingFct.delShape(annt);
          
        
    };
    
      $scope.eShape=function(){
        
    drawingFct.redrawShape();
     $scope.sh.redraw=false; 
        $scope.c.origAnnt=null;
        
    };
    
    $scope.reColourAll=function(cat)
            {
        console.log("recolouring: " + cat);
                $scope.annts.forEach(function(annt){
                    if(annt.cat==cat){
                        console.log("recolour: " + annt.cat);
                        drawingFct.reColour(annt,$scope.cats[cat].clr);
                    }
                    else{
                         console.log("no changes: " + annt.cat);
                    }
                    
                });
        
                $scope.$emit("save",{}); 
            }
    
    
    
     $scope.reColour=function(a)
            {
         console.log(a);
            drawingFct.reColour(a,$scope.cats[a.cat].clr);
          $scope.$emit("save",{});
            }
     
     
     $scope.activateAnnt=function(shape){
         
         $scope.annts.forEach(function(annt){
             if(annt.shape==shape){
                  // alert(annt.word);
                 $scope.c.Annt=annt;
             }
         });
         
       
     }
     
     $scope.editMode=function(shape){
        $scope.c.shape=shape;
         
         $scope.annts.forEach(function(annt){
             if(annt.shape==shape){
                  // alert(annt.word);
                 $scope.c.origAnnt=annt;
             }
         });
         
         $scope.sh.redraw=true;
            console.log("entering edit mode - " + $scope.sh.redraw);
     }
     
      $scope.assignShape=function(a){
        a.shape=$scope.c.shape;
        
          if($scope.c.origAnnt){
              $scope.c.origAnnt.shape=null;
          }
          
        drawingFct.clearPoints();  
        $scope.sh.redraw=false;
        $scope.c.origAnnt=null;
     }
       
    
    
    $scope.$on("save",function(e, dt){
        
        $log.info("autosaving...");
    cookingFct.saveAnnts($scope.annts, $scope.cats);
    });
  
    
    $log.info("controller MAIN initialized");
    

});

angular
.module("zoner")
.directive("currentAnnt",function(){
    
    return {templateUrl:"templates/currentAnnt.html"}
    
});


angular
.module("zoner")
.directive("shList",function($log, cookingFct, xmlFct){

    $log.info("directive shList initialized");
  
    return {
        controller:function($scope, drawingFct){
            //{word:"Beowulf",cat:null, shape:null}, {word:"Hwaet",cat:null, shape:null}
            $scope.annts=[];
      
            $scope.startDrag=function(){
                console.log("dragging");
            }
           
         $scope.loadCooked=function()
            {
             console.log("loading at controller");
                var loaded=cookingFct.loadCooked($scope);
             
             console.log(loaded);
             
                $scope.annts=loaded.annts;
                $scope.cats=loaded.cats;
             
                $scope.catCount=loaded.cats.keys().length+1;
            }
            
            
            $scope.loadShList=function()
            {
         
                   var words=$scope.tInput.split(" ");
          
            words.forEach(function(itm, ndx){
             console.log("adding "+ itm);
                
               $scope.annts.push({word:itm,cat:"default", shape:null, fields:$scope.getFields()});
   
            });
                
            }
            
             $scope.loadXml=function()
            {
                
            parser = new DOMParser();
                var replaced=$scope.tInput.replace(/xml:id/g,"xmlid");
            xmlDoc = parser.parseFromString(replaced,"text/xml"); 
                
                $scope.cats=xmlFct.getCats(xmlDoc);
                 
                var xmlAnnts=xmlFct.getAnnts(xmlDoc);
                 console.log(xmlAnnts);
                 
                 xmlAnnts.forEach(function(a){
                     console.log(a.shape.coords);
                     a.shape=drawingFct.nShape(a, $scope.cats[a.cat],$scope, a.shape.coords);
                     $scope.annts.push(a);
                 });
            }
        
            
             $scope.newAnnt=function()
            {
         
               $scope.annts.push({word:"",cat:"default", shape:null, fields:$scope.getFields()});
                 $scope.$emit("save",{});
                

            }
             
             $scope.delAnnt=function(annt)
            {
                 if(annt.shape){
                    annt.shape=drawingFct.delShape(annt); 
                 }
                 
                 if(annt==$scope.c.Annt){
                    $scope.c.Annt=null;
                 }
                 
                ind=$scope.annts.indexOf(annt);
                 $scope.annts.splice(ind, 1);
                  $scope.$emit("save",{});

            }
             
               $scope.moveAnnt=function(ndx, cAnnt)
            {
                ind=$scope.annts.indexOf(cAnnt);
                 $scope.annts.splice(ind, 1);
                $scope.annts.splice(ndx,0,cAnnt);
                    $scope.$emit("save",{});

            }
               
               $scope.highlightShape=function(a,c,w){
                   
                   if(a.shape){
                     drawingFct.highlightShape(a,c,w);
                 }
                   
                  
               }
             
            }
            
        ,
        templateUrl:"templates/shList.html"
    }

});


angular
.module("zoner")
.directive("catList",function($log){

    $log.info("directive catList initialized");
  
    return {
        
        controller:function($scope){
            
        $scope.cats={default:{name:"default", clr:"blue", id:"default"}};
         
                $scope.newCat=function()
            {       
             
            console.log($scope.nClr);
                    console.log($scope.catCount);
               $scope.cats["cat"+$scope.catCount]={name:"",clr:$scope.nClr, id:"cat"+$scope.catCount};
                    $scope.catCount++;
             
               
            }
                
            
                $scope.delCat=function(cat){
                    console.log(cat);
                    delete $scope.cats[cat.id];
                    console.log($scope.cats);
                }
            
        },
        
        templateUrl:"templates/catList.html"
    }

});

angular
.module("zoner")
.directive("fieldList",function($log){

    $log.info("directive fieldList initialized");
  
    return {
        
        controller:function($scope){
            
        $scope.fields=[{name:"title"}];
         
                $scope.newField=function()
            {       
               
               $scope.fields.push({name:""});
              
            }
                
                $scope.getFields=function(){
                    var rsl={};
                    
                    $scope.fields.forEach(function(f){
                        rsl[f.name]={name:f.name, value:""};
                        
                    });
                    console.log(rsl);
                  return rsl;  
                }
                
            
                $scope.delField=function(field){
                    console.log(field);
                    
                }
            
        },
        
        templateUrl:"templates/fieldList.html"
    }

});


angular
.module("zoner")
.directive("controls",function($log){

    $log.info("directive controls initialized");
  
    return {
        controller:function($scope, drawingFct, $log){
            
            $scope.nShape=function(){
                $log.info("nShape at controller:" );
                $log.info($scope.c.Annt);
                
                if($scope.c.Annt==null || $scope.c.Annt.shape!=null){
                    $scope.c.Annt={word:"_blank", cat:"default", shape:null, fields:$scope.getFields()};
                    console.log("adding blank");
                    $scope.annts.push($scope.c.Annt);
                }
               
                  $scope.c.Annt.shape = drawingFct.nShape($scope.c.Annt, $scope.cats[$scope.c.Annt.cat],$scope);
                    $scope.$emit("save",{});
                
                   
            };
            
            
            $scope.clearPoints=function(){
              drawingFct.clearPoints();  
            };
            
             $scope.clearShapes=function(){
              drawingFct.clearShapes($scope);  
            };
            
             $scope.zoomChng=function(zch){
              drawingFct.zoomChng(zch);  
            };
            
            $scope.toggleDelete=function(){
                drawingFct.toggleDelete();
            }
            
             $scope.roundNum=function(floatNum){
                // console.log(parseInt(floatNum));
                return parseInt(floatNum);
            }
            
            $scope.teiButton=function(shTei){
                if(shTei==true){
                    return "Hide TEI";
                }
                else{
                    return "Show TEI";
                }
            }
            
        },
        templateUrl:"templates/controls.html"
    }

});

angular
.module("zoner")
.directive("teiMarkup",function($log){

    $log.info("directive teiMarkup initialized");
  
    return {
        controller:function($scope){
            
            $scope.cVersion="TEI XML";
            
            $scope.versions=[{title:"JSON"},{title:"TEI XML"}, {title:"xmlPlus"},{title:"categories"}];
            
            $scope.switchVersion=function(nv){
                $scope.cVersion=nv;
            }
            
             $scope.getTitle=function(a){
                // console.log(a);
                if(a.fields.title && a.fields.title.value!=""){
                   // console.log("returning tile");
                    return a.fields.title.value;
                }else{
                   // console.log("returning word");
                    return a.word;
                }
            }
            
            
            $scope.stringify=function(a, v)
            {
                
                console.log(a.cat);
                if($scope.cats[a.cat]){
                    sColor=$scope.cats[a.cat].clr;
                    catId="default";
                }else{
                    sColor="#ffffff";
                    catId=$scope.cats[a.cat].id;
                }
                switch(v)
                    {
                        case "xml2":   var tTag='&lt;div corresp="#imtArea_'+$scope.annts.indexOf(a)+'"type="imtAnnotation"&gt;&lt;head&gt;'+a.word+'&lt;/head&gt;&lt;div&gt;&lt;p&gt;'+a.word+'&lt;/p&gt;&lt;/div&gt;&lt;/div&gt;';  break;
                       case "json2": var tTag='{"word":"'+a.word+'","color":"'+sColor+'","points":"'+$scope.getPoints(a.shape)+'", "cat":"'+catId+'"}'; break;     
                    }
                
             
                
                return tTag;
            }
            
            $scope.getPoints=function(shape)
            {
                  var x,y,points="";
                if(shape.attrs!=null)
                    {
                    
        for (var j=0; j < shape.attrs.path.length; j++){
          if ($.inArray(shape.attrs.path[j][0], new Array('M','L')) > -1){
            x = shape.attrs.path[j][1];
            y = shape.attrs.path[j][2];
            points += " " + Math.round(x) + "," + Math.round(y) + " ";
          }
        }  
                    }
                
        
                return points;
            }
            
        },
        templateUrl:"templates/teiMarkup.html"
    }

});