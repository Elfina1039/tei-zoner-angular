angular
.module("zoner")
.controller("main",function($scope,$log,cookingFct, drawingFct){

          $scope.sh={tInput:false, annTab:true, caTab:false, help:false, tei:false, load:false};
    
    $scope.img={filename:"file", width:0, height:0};
    $scope.c={Annt:{word:"--"}};
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
          
        
    };
    
    $scope.reColourAll=function(cat)
            {
        console.log("recolouring: " + cat);
                $scope.annts.forEach(function(annt){
                    if(annt.cat==cat){
                        console.log("recolour: " + annt.cat);
                        drawingFct.reColour($scope.cats[cat].clr);
                    }
                    else{
                         console.log("no changes: " + annt.cat);
                    }
                    
                });
        
                
            }
    
    
    
     $scope.reColour=function(a)
            {
                drawingFct.reColour($scope.cats[a.cat].clr);
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
        controller:function($scope){
            //{word:"Beowulf",cat:null, shape:null}, {word:"Hwaet",cat:null, shape:null}
            $scope.annts=[];
      
           
         $scope.loadCooked=function()
            {
             console.log("loading at controller");
                var loaded=cookingFct.loadCooked();
             
             console.log(loaded);
             
                $scope.annts=loaded.annts;
                $scope.cats=loaded.cats;
            }
            
            
            $scope.loadShList=function()
            {
                
            var words=$scope.tInput.split(" ");
          
            words.forEach(function(itm, ndx){
              //  shList.push({imtArea:"#imtArea_"+ndx, word:itm,cats:[],shape:null});
                
               $scope.annts.push({word:itm,cat:null, shape:null})

            });
                        
            }
            
             $scope.newAnnt=function()
            {
         
               $scope.annts.push({word:"",cat:null, shape:null});
                 $scope.$emit("save",{});
                

            }
             
             $scope.delAnnt=function(annt)
            {
                 annt.shape=drawingFct.delShape(annt);
                ind=$scope.annts.indexOf(annt);
                 $scope.annts.splice(ind, 1);

            }
             
               $scope.moveAnnt=function(ndx, cAnnt)
            {
                ind=$scope.annts.indexOf(cAnnt);
                 $scope.annts.splice(ind, 1);
                $scope.annts.splice(ndx,0,cAnnt);

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
            
        $scope.cats={blue:{name:"myCat", clr:"blue"},green:{name:"myOtherCat", clr:"green"}};
         
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
           $scope.c.Annt.shape = drawingFct.nShape($scope.c.Annt, $scope.cats[$scope.c.Annt.cat]);
                
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
                       case "json2": var tTag='{"word":"'+a.word+'","color":"'+a.cat+'","points":"'+$scope.getPoints(a.shape)+'", "cat":"'+$scope.cats[a.cat].name+'"}'; break;     
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