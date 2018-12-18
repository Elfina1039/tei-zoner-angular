

angular.module("zoner")
.factory("cookingFct",function(drawingFct){

    var filename;
    
 function handleFileSelect(evt, link) {
    var files = evt.files;
    filename = evt.files[0].name;
     link.img.filename=filename;

    for (var i = 0, f; f = files[i]; i++) {

      if (!f.type.match('image.*')) {
          
        continue;
      }

      var reader = new FileReader();

      reader.onload = (function(theFile) {
          
               
             var prevImgs=getCookedJson("images");
          // console.log(prevImgs);
          
          if($.inArray(filename,prevImgs)==-1)
              {
                  prevImgs.push(filename);
                  cookJson("images",prevImgs);
                  
              }
          
          var savedAnnts=getCookie(filename+"_annts");
          if(savedAnnts!="")
              {
                  link.sh.load=true;
              }
          else
              {
                  presetCookies([filename+"_annts",filename+"_cats"]);
              }
          
        
          
// ++ COOKIES - copy FROM original
       
        // ++ handle with controller instead  
          
        return function(e) {
            presetCookies(["images","annts"]);
          $("#pickfile").hide();
          $('img#editor').attr('src',e.target.result);
            
           // // console.log("IMG:" + $('img#editor').attr('src'));
           //  $('#canvas').css({'background-image':e.target.result});
          if($('#grabber').length > 0)
            $('#grabber').remove();

          $("#reload").prop('disabled',false);
          setTimeout(function(){drawingFct.createEditor(link)},100);
        }
        
      
        
        
      })(f);
      reader.readAsDataURL(f);
    }
  }
    
          function presetCookies(cookList)
        {
           cookList.forEach(function(ck){
              
                var chck=getCookie(ck);
               // console.log(chck);
               
               if(chck==null || chck=="undefined" || chck=="" ||chck=="empty")
                   {
                       setCookie(ck,"[]",365);
                       
                   }
    
               
               
           });   
        }
    
    
         function addToCooked(cVar, jVar)
        {
           var cooked=getCookedJson(cVar);
            cooked.push(jVar);
            cookJson(cVar,cooked, 365);
            
            // console.log(cooked);
        }
        
    
       function getCookedJson(cVar)
        {
            var cooked= getCookie(cVar);
            var toObj=JSON.parse(cooked);
            // console.log(toObj);
            
            return toObj;
            
        }
        
          function cookJson(cVar,jVar)
        {
            
        var toStr=JSON.stringify(jVar);
           setCookie(cVar,toStr,365);
           
            // console.log(document.cookie);
        }
    
    
            
       function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
} 
             
        function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
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
    
          function saveAnnts(annts, cats)
        {
            // console.log(annts);
            cookJson(filename+"_annts",[]);
            
            annts.forEach(function(a){
              // console.log("cooking annts");
                
                // console.log(a.shape);
                var sh=a.shape;
                
                
             if(sh!=null)
                 {
                     a.shape=sh.attrs.path;
             
                 }
              
                addToCooked(filename+"_annts",a);
                
                a.shape=sh;
                
            });
            
               cookJson(filename+"_cats",[]);
            
          for(c in cats)
              {
                    // console.log("cooking cats");
           
                addToCooked(filename+"_cats",cats[c]); 
              }
           
                
            
            
            
        }
    
            
        function loadCooked()
        {
            
            var catList=getCookedJson(filename+"_cats");
            var catObj={};
              catList.forEach(function(itm){
                catObj[itm.clr]={name:itm.name, clr:itm.clr};
            });
            
        
          var shList=getCookedJson(filename+"_annts");
            // console.log(shList);
            
            shList.forEach(function(itm){
                // console.log("drawing loaded");
                itm.shape=drawingFct.cShape(itm.shape,itm,catObj[itm.cat]);
            });
 
            return {cats:catObj, annts:shList};
        }
        
        
  
  return {handleFile:handleFileSelect, saveAnnts:saveAnnts, loadCooked:loadCooked};


});


angular.module("zoner")
.factory("drawingFct",function(){

 var canvas;   
var paper;   
var coords = new Array();
var points = new Array();
var shapes = new Array();
var rects = new Array();
var imgWidth,imgheight,offset;
           var delModeOn=false;
    
 var colour = 'black',
    mousedown = false,
    width = 1,
    lastX, lastY, path, pathString;
    
var sPoint=null;
var sShape=null;
var sRef=null;
    
var editedShape;

function createEditor(link){
// console.log("creating editor");
          imgwidth = $('#editor').width();
          imgheight = $('#editor').height();
          offset = $('img#editor').offset();
    
    link.img.width=imgwidth;
    link.img.height=imgheight;

$('#canvas').css({
position: "absolute",
top: Math.floor(offset.top),
left: 0,
width: Math.floor(imgwidth),
height: Math.floor(imgheight),
zIndex: 1,
opacity: .5,
});
    

 canvas = document.getElementById('canvas'),
    paper = new Raphael(canvas, imgwidth, imgheight),
  
       $(canvas).css({"top":0}); 
             
            $(canvas).click(function(e){

              var x = e.offsetX;
                var y = e.offsetY;
                
                var i = {x:x,y:y,string:x+","+y};
             
               nPoint(x,y,i);
           });   
    
              $(canvas).mousemove(function (e) {
                xpx = e.pageX - $(this).offset().left ;
                ypx = e.pageY - $(this).offset().top ;
                
                cpx = e.offsetX;
                cpy = e.offsetY;
             link.crds.x=(xpx+"/"+cpx);
              link.crds.xp=(Math.round((xpx/imgwidth)*100));
              link.crds.y=(ypx+"/"+cpy);
              link.crds.yp=(Math.round((ypx/imgheight)*100));
               link.crds.xy=(xpx+","+ypx);
                
             if(sPoint!=null)
               {
                 points[sPoint].attr({cx:xpx, cy:ypx});
               }
                
            if(sShape!=null)
               {  
                   // console.log("moving shape");
                var nPath=calcPath(xpx, ypx, sRef); 
                   
                 sShape.attr("path",nPath);
               }    
                  
                  link.$apply();
                  
            });
    
}
    
         
    function nPoint(x,y,i) {
        // console.log("NPOINT");
        
             
        
         // console.log("coords: "+coords);
        
                if(!delModeOn)
                    {
                        mousedown = true;
          
             //  coords.push(i);
              //  coords.push(i);
                        
                        // console.log("coords: "+coords);
                        
                var point = paper.circle(x,y,3);
                coords.push(point);
                point.attr("fill","#cf0");
                point.crds=i;
                        
                        // console.log("i: "+coords.indexOf(point.crds));
                        
                points.push(point);
                        
                             
                   // console.log(points);
                      // console.log(coords);
                        
          function pointDrag(x,y){
             // console.log("DDDRAG  2 ");
              console.log(this);
           //console.log("DC: "+this.attr("cx") + "/" + this.attr("cy"));
              this.ox=this.attr("cx");
               this.oy=this.attr("cy");
              this.attr({opacity:0.5});
             //  console.log("DLD: "+this.ox + "/" +this.oy);
        }   
                        
                        
        function pointMove(dx,dy){
           // console.log("MOVE");
       //   console.log("DO: "+this.ox + "/" + this.oy);
           // console.log(this);
            this.attr({fill:"green"});
           this.attr({cx:this.ox+dx, cy:this.oy+dy});
          //   console.log(this.attr("x") + "/" + this.attr("y"));
          
        } 
                        
                                         
          function pointStop(){
            console.log("SSSSTOP");
              
              var x=this.attr("cx");
              var y=this.attr("cy");
              
             //var i = {x:x,y:y,string:x+","+y};
                   
            //coords[coords.indexOf(points[sp].crds)]=i;
              
              this.attr({opacity:1});
               this.attr({fill:"yellow"});
              console.log("DN: "+this.x + "/" +this.y);
        }   
                        
                        
        point.drag(pointMove,pointDrag, pointStop);
                        
            
                        
        point.mouseover(function(p){
            
            $(canvas).unbind("click");
            this.attr("r",6);
            
        });   
                        
        point.mouseout(function(){
           
            $(canvas).click(function(e){
                 // var x = e.pageX - $(this).offset().left;
              //  var y = e.pageY - $(this).offset().top;
              //  var y = e.pageY - $(this).offset().top;
                
                 
                var x = e.offsetX;
                var y = e.offsetY;
                
                var i = {x:x,y:y,string:x+","+y};
             
               nPoint(x,y,i);
           });   
            this.attr("r",3);
        });     
                        
       
       
                        
                if (points.length > 2) {
                  $("#closepath").prop('disabled',false).attr('value','Draw Polygon');
                } else if (points.length == 2) {
                  $("#closepath").prop('disabled',false).attr('value','Draw Rectangle');
                } else {
                  $("#closepath").prop('disabled',true).attr('value','Draw');
                }
                $('#clearpoints').prop('disabled',false);
             
                    }
                else
                    {
                     delModeOn=false;
                   $("#delMode").val("Delete");
                        document.getElementById("canvas").style.cursor = "crosshair"; 
                    }
               
            
            }
    
    function readPoints(crds){
        rsl=crds.map(function(cp){
            var x=cp.attr("cx");
             var y=cp.attr("cy");
            return {x:x, y:y, string:x+","+y }
            
        });
        
        return rsl;
    }
    
    
    
function nShape(annt, cat)
    {
        console.log("drawing new one");
        console.log(cat);
        
         var path = null;
        coords=readPoints(coords);
        
    if (coords.length == 2)  
        {
          
            var x1=coords[1].x;
            var y1=coords[0].y;
            coords.splice(1,0,{x:x1, y:y1, string: x1+","+y1});
          
            var x2=coords[0].x;
            var y2=coords[2].y;
            coords.push({x:x2, y:y2, string:x2+","+y2});
           
            
        }
    
        
   if (coords.length > 2){
      for (var i = 0; i < coords.length; i++) {
        if (i == 0)
            {
                 var path = "M"+coords[i].string; // console.log(coords[i].string); 
            }
        
        else
            {
                path += "L"+coords[i].string; // console.log(coords[i].string); 
            }
         
      }
      path += "z";
       
       console.log("PATH: "+path);
       // console.log(cat);
     
    var word=annt.word;
    //--var sndx="d";
    
     var rsl=cShape(path, annt, cat);
       rsl.test="test";
       // saveShapes(shapes);
     // getPaths();
      $("#clearpoints").prop('disabled',true);
   }
      for (var i = 0; i < points.length; i++) {
        points[i].remove()
      }
     coords.length = 0;
     points.length = 0;
        
        return rsl;
    }
    
    
        
cShape=function(path,annt, cat)
    {
    // console.log("adding new shape");
    // console.log(path);
    var shape = paper.path(path);
    
    // console.log(shape);
 
       
    // shList[sndx].shape=shape;
   
       
       if(cat!=null)
           {
               console.log("colouring: " + cat.clr);
            shape.attr({fill:cat.clr,opacity:1}); 
               shape.color=cat.clr;
           }
       else
           {
             shape.attr({fill:"rgba(255,0,0,0.5)",opacity:1});   
           }
   
 
       
    //  shapes.push(shape);
       
      
       
       shape.mousedown(function(e){
           if(delModeOn)
               {   
            var lsIt=findItem(shList,"shape",this);
            //lsIt.shape=null;
            
                   
               var ds=shapes.indexOf(this);   
               this.remove(); 
                   
                   shapes.splice(ds,1);
                  // saveShapes(shapes);
                   
                    $(canvas).click(function(e){
                        
                        
               //   var x = e.pageX - $(this).offset().left;
               // var y = e.pageY - $(this).offset().top;
                        
                         
              var x = e.offsetX;
                var y = e.offsetY;
                        
                var i = {x:x,y:y,string:x+","+y};
                     
               nPoint(x,y,i);
           });  
                   getPaths();
                  
               }
           else
               {
                   
                  sShape=this;
                   sColor=this.attr("fill");
                var sx = e.pageX - $("#canvas").offset().left  ;
                var sy = e.pageY - $("#canvas").offset().top  ;
                   sRef={x:sx,y:sy,pth:this.attrs.path};
                   
                   // console.log(sRef);
                  this.attr("fill","rgba(0,255,0,0.5)");
               }
           
       });
       
       shape.mouseup(function(){
            sShape=null;
           sRef=null;
            this.attr("fill",sColor);
           
      
          // saveShapes(shapes);
       });
       
         shape.mouseover(function(p){
            
            $(canvas).unbind("click");
            this.attr("stroke-width",3);
             this.title="title";
            
        });   
                        
        shape.mouseout(function(){
            
            $(canvas).click(function(e){
                // var x = e.pageX - $(this).offset().left;
                //var y = e.pageY - $(this).offset().top;
                
                  var x = e.offsetX;
                var y = e.offsetY;
                var i = {x:x,y:y,string:x+","+y};
             
               nPoint(x,y,i);
           });   
            this.attr("stroke-width",1);
        });
       
       shape.dblclick(function(){
           // console.log("edit shape");
           
           editShape(this);
           
       });
    
    return shape;
    }
    

function delShape(which)
    {
        which.shape.remove();
        return null;
    }
    
    
function calcPath(cx,cy,sRef)
{
   var px=cx-sRef.x;
    var py=cy-sRef.y;
   
var nPath=[];
    
    
    
    sRef.pth.forEach(function(pt){
        
        if(pt[0]!="Z")
        {
           var nx=parseFloat(pt[1]+px);
        var ny=parseFloat(pt[2]+py);
        
        nPath.push(pt[0]+nx+","+ny);  
        }
        else
            {
                nPath.push("Z");
            }
       
        
    });
    
    nPath=nPath.join("");
//// console.log("calculated: "+nPath);
    
    return nPath;
    
}

 function editShape(shp)
{
 editedShape=shp;
    console.log("EDITING: " + editedShape.id);
    shp.attrs.path.forEach(function(pt){
        if(pt[0]!="Z")
            {
                 var i = {x:pt[1],y:pt[2],string:pt[1]+","+pt[2]};
               nPoint(pt[1],pt[2],i)  
            }
       
    });

  // shp.remove();
   
}
    
    function redrawShape(){
         console.log("REDRAWING: " + editedShape.id);
        coords=readPoints(coords);
          for (var i = 0; i < coords.length; i++) {
        if (i == 0)
            {
                 var path = "M"+coords[i].string; // console.log(coords[i].string); 
            }
        
        else
            {
                path += "L"+coords[i].string; // console.log(coords[i].string); 
            }
         
      }
      path += "z";
        
        editedShape.attr("path", path);
        clearPoints();
        
    }
    

    function clearPoints(){
    for (var i = 0; i < points.length; i++) {
      points[i].remove()
    }
    coords.length = 0;
    points.length = 0;
    $('#clearpoints').prop('disabled',true);
    }
    
    function clearShapes(target){
    confirmation = window.confirm("Are you sure? This will delete everything, and you can't undo it.");
    if (confirmation) {
           target.annts.forEach(function(a){
            a.shape=null;
        });
      paper.clear();
      points.length = 0;
      coords.length = 0;
      shapes.length = 0;
      rects.length = 0;
      $("#clearpoints").click();
      getPaths();
      $("#clearall").prop('disabled',true);
        
     
    }
    else return;
  }
  
    
        var zm=parseFloat(1);
        
        function zoomChng(zChng)
        {
            zm+=parseFloat(zChng); 
            
            $("#editor").css({"transform":"scale("+zm+","+zm+")"});
             $(canvas).css({"transform":"scale("+zm+","+zm+")"});
        // console.log( $(canvas).css("width"));
        }
    
    function reColour(newColour)
    {
        a.shape.attr("fill",newColour);
    }
        
    
  return {createEditor:createEditor, nShape:nShape, cShape:cShape, delShape:delShape, clearPoints:clearPoints, clearShapes:clearShapes, zoomChng:zoomChng, reColour:reColour, redrawShape:redrawShape};


});