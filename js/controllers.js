angular
.module("zoner")
.controller("main",function($scope,$log,cookingFct, drawingFct){

          $scope.sh={tInput:false, annTab:true, caTab:false, help:false, tei:false, load:false, redraw:false};
    
    $scope.img={filename:"file", width:0, height:0};
    $scope.c={Annt:{word:"--"}, origAnnt:null, shape:null};
    $scope.crds={};
    
    $scope.handleFile=function(evt){
        
        $log.info(evt);
   
        cookingFct.handleFile(evt, $scope);
        
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
                drawingFct.reColour(a,$scope.cats[a.cat].clr);
          $scope.$emit("save",{});
            }
     
     
     $scope.activate=function(shape){
         
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
.directive("shList",function($log, cookingFct){

    $log.info("directive shList initialized");
  
    return {
        controller:function($scope, drawingFct){
            //{word:"Beowulf",cat:null, shape:null}, {word:"Hwaet",cat:null, shape:null}
            $scope.annts=[];
      
           
         $scope.loadCooked=function()
            {
             console.log("loading at controller");
                var loaded=cookingFct.loadCooked($scope);
             
             console.log(loaded);
             
                $scope.annts=loaded.annts;
                $scope.cats=loaded.cats;
            }
            
            
            $scope.loadShList=function()
            {
                
            var words=$scope.tInput.split(" ");
          
            words.forEach(function(itm, ndx){
              //  shList.push({imtArea:"#imtArea_"+ndx, word:itm,cats:[],shape:null});
                
               $scope.annts.push({word:itm,cat:"default", shape:null})

            });
                        
            }
            
        
            
             $scope.newAnnt=function()
            {
         
               $scope.annts.push({word:"",cat:"default", shape:null});
                 $scope.$emit("save",{});
                

            }
             
             $scope.delAnnt=function(annt)
            {
                 if(annt.shape){
                    annt.shape=drawingFct.delShape(annt); 
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
               
               $scope.highlightShape=function(a,w){
                   
                   if(a.shape){
                     drawingFct.highlightShape(a,w);
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
                if($scope.cats[$scope.nClr]!=null)
                    {
                     alert("This colour is already in use");   
                    }
         else
             {
                 console.log($scope.nClr);
               $scope.cats[$scope.nClr]={name:"",clr:$scope.nClr, id:$scope.nClr};  
             }
               
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
.directive("controls",function($log){

    $log.info("directive controls initialized");
  
    return {
        controller:function($scope, drawingFct, $log){
            
            $scope.nShape=function(){
                $log.info("nShape at controller:" );
                $log.info($scope.c.Annt);
                
                if($scope.c.Annt.shape==null){
                    $scope.c.Annt.shape = drawingFct.nShape($scope.c.Annt, $scope.cats[$scope.c.Annt.cat],$scope);
                    $scope.$emit("save",{});
                }
                else{
                    alert("The selecetd annotation already has its own shape. Select a different annotation, please.");
                }
                
                   
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
            
            $scope.versions=[{title:"JSON"},{title:"TEI XML"}, {title:"xmlPlus"}];
            
            $scope.switchVersion=function(nv){
                $scope.cVersion=nv;
            }
            
            
            $scope.stringify=function(a, v)
            {
                
            //    console.log($scope.cats);
                
                switch(v)
                    {
                        case "xml2":   var tTag='&lt;div corresp="#imtArea_'+$scope.annts.indexOf(a)+'"type="imtAnnotation"&gt;&lt;head&gt;'+a.word+'&lt;/head&gt;&lt;div&gt;&lt;p&gt;'+a.word+'&lt;/p&gt;&lt;/div&gt;&lt;/div&gt;';  break;
                       case "json2": var tTag='{"word":"'+a.word+'","color":"'+$scope.cats[a.cat].clr+'","points":"'+$scope.getPoints(a.shape)+'", "cat":"'+$scope.cats[a.cat].name+'"}'; break;     
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