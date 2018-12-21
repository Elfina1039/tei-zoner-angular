

        
        function toggleDelete(button)
        {
            if(delModeOn)
                {
                delModeOn=false;
                   button.value="Delete";
                    document.getElementById("canvas").style.cursor = "crosshair"; 
                }
            else
                {
                    delModeOn=true;
                 button.value="Stop deleting";
                    document.getElementById("canvas").style.cursor = "not-allowed"; 
                }
        }
        


                 
         point.mousedown(function(){
           if(!delModeOn)
               {
                   sPoint=points.indexOf(this);
                   // console.log(sPoint);
                    points[sPoint].attr("fill","green");
              // var ds=points.indexOf(this);   
              // this.remove(); 
                // points.splice(ds,1);
                  
               }
         });
                        
        point.mouseup(function(e){
           if(sPoint!=null)
               {
                   // console.log("dragend:" + e.pageX);
                
                var sp=sPoint;
                   sPoint=null;
                       
            // console.log( coords[coords.indexOf(points[sp].crds)]);
                   
                  points[sp].attr("fill","#cf0");
                    
                var x = e.pageX - $("#canvas").offset().left;
                   
                     // console.log("changed");
                var y = e.pageY - $("#canvas").offset().top;
                var i = {x:x,y:y,string:x+","+y};
                   
                     // console.log("changed");
                //coords.push(i);
                   coords[coords.indexOf(points[sp].crds)]=i;
                   
                   // console.log("changed");
                 
                     // console.log( coords[coords.indexOf(points[sp].crds)]);
                   
               // var point = paper.circle(x,y,3);
               // point.attr("fill","#cf0");
                //points.push(point);
                   
                   // console.log(points);
                      // console.log(coords);
             
               delModeOn=false;
                    $("#delMode").val("Delete");
                   document.getElementById("canvas").style.cursor = "crosshair"; 
                   
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
           scope.editMode(this);
           
       });
    
    shape.hover(function(){
  scope.activate(this);
});
    

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
                        
