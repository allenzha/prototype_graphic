
function debug(msg){var debugArea=$('debug-area')
if(debugArea==null){debugArea=document.createElement("div");debugArea.id="debug-area";debugArea.style.top="0px"
debugArea.style.right="0px"
debugArea.style.width="200px"
debugArea.style.height="800px"
debugArea.style.position="absolute"
debugArea.style.border="1px solid #000"
debugArea.style.overflow="auto"
debugArea.style.background="#FFF"
debugArea.style.zIndex=100000;document.body.appendChild(debugArea);}
debugArea.innerHTML=msg+"<br/>"+debugArea.innerHTML;}
if(typeof console=="undefined"){console=function(){return{log:function(msg){debug(msg);}}}();}
if(Prototype.Browser.WebKit){var array=navigator.userAgent.match(new RegExp(/AppleWebKit\/([\d\.\+]*)/));Prototype.Browser.WebKitVersion=parseFloat(array[1]);}
function degToRad(value){return value/180*Math.PI;}
function radToDeg(value){return value/Math.PI*180;}
function computeAngle(x1,y1,x2,y2,radian){var dx=x2-x1;var dy=y1-y2;if(radian)
var angle=dx!=0?Math.atan(dy/dx):-Math.PI/2;else
var angle=dx!=0?radToDeg(Math.atan(dy/dx)):90;if(dx<0&&dy<0)
angle=angle-(radian?Math.PI:180);if(dx<0&&dy>0)
angle=(radian?Math.PI:180)+angle;return angle}
function disableSelection(){document.body.ondrag=function(){return false;};document.body.onselectstart=function(){return false;};}
function enableSelection(){document.body.ondrag=null;document.body.onselectstart=null;}
String.prototype.parseColor=function(){var color='#';if(this.slice(0,4)=='rgb('){var cols=this.slice(4,this.length-1).split(',');var i=0;do{color+=parseInt(cols[i]).toColorPart()}while(++i<3);}else{if(this.slice(0,1)=='#'){if(this.length==4)for(var i=1;i<4;i++)color+=(this.charAt(i)+this.charAt(i)).toLowerCase();if(this.length==7)color=this.toLowerCase();}}
return(color.length==7?color:(arguments[0]||this));}
function getWindowScroll(w){var T,L,W,H;with(w.document){if(w.document.documentElement&&documentElement.scrollTop){T=documentElement.scrollTop;L=documentElement.scrollLeft;}else if(w.document.body){T=body.scrollTop;L=body.scrollLeft;}
if(w.innerWidth){W=w.innerWidth;H=w.innerHeight;}else if(w.document.documentElement&&documentElement.clientWidth){W=documentElement.clientWidth;H=documentElement.clientHeight;}else{W=body.offsetWidth;H=body.offsetHeight}}
return{top:T,left:L,width:W,height:H};}
function pickPoly(points,x,y){var nbPt=points.length;var c=false;for(var i=0,j=nbPt-1;i<nbPt;j=i++){if((((points[i].y<=y)&&(y<points[j].y))||((points[j].y<=y)&&(y<points[i].y)))&&(x<(points[j].x-points[i].x)*(y-points[i].y)/(points[j].y-points[i].y)+points[i].x)){c=!c;console.log(i,c)}}
return c;}
Graphic=Class.create();Object.extend(Graphic,{functionMustBeOverriden:{name:'functionMustBeOverriden',message:'This function is an abstract function and must be overriden'},rendererSupported:function(name){switch(name){case"VML":return Prototype.Browser.IE;case"SVG":return!(Prototype.Browser.IE||Prototype.Browser.WebKitVersion<420);case"Canvas":try{return document.createElement("canvas").getContext("2d")!=null;}
catch(e){return false;}
default:throw"Renderer "+name+" not supported"
return null;}}});Matrix=Class.create();Object.extend(Matrix,{multiply:function(left,right){var matrices;if(left instanceof Array)
matrices=left;else
matrices=[left,right];var matrix=matrices[0];for(var i=1;i<matrices.length;++i){var left=matrix;var right=matrices[i];matrix=new Matrix();matrix.xx=left.xx*right.xx+left.xy*right.yx;matrix.xy=left.xx*right.xy+left.xy*right.yy;matrix.yx=left.yx*right.xx+left.yy*right.yx;matrix.yy=left.yx*right.xy+left.yy*right.yy;matrix.dx=left.xx*right.dx+left.xy*right.dy+left.dx;matrix.dy=left.yx*right.dx+left.yy*right.dy+left.dy;}
return matrix;},translate:function(x,y){return new Matrix({dx:x,dy:y});},rotate:function(angle){var c=Math.cos(degToRad(angle));var s=Math.sin(degToRad(angle));return new Matrix({xx:c,xy:s,yx:-s,yy:c});},scale:function(sx,sy){sy=sy||sx;return new Matrix({xx:sx,yy:sy});},skewX:function(angle){return new Matrix({xy:Math.tan(degToRad(angle))});},skewY:function(angle){return new Matrix({yx:Math.tan(-degToRad(angle))});},rotateAt:function(angle,x,y){return Matrix.multiply([Matrix.translate(x,y),Matrix.rotate(angle),Matrix.translate(-x,-y)])},scaleAt:function(sx,sy,x,y){return Matrix.multiply([Matrix.translate(x,y),Matrix.scale(sx,sy),Matrix.translate(-x,-y)])},invert:function(matrix){var m=matrix;var D=m.xx*m.yy-m.xy*m.yx;return new Matrix({xx:m.yy/D,xy:-m.xy/D,yx:-m.yx/D,yy:m.xx/D,dx:(m.yx*m.dy-m.yy*m.dx)/D,dy:(m.xy*m.dx-m.xx*m.dy)/D});}})
Object.extend(Matrix.prototype,{initialize:function(values){Object.extend(Object.extend(this,{xx:1,xy:0,yx:0,yy:1,dx:0,dy:0}),values||{});return this;},multiplyRight:function(matrix){var matrix=Matrix.multiply(this,matrix);this._affectValues(matrix);return this;},multiplyLeft:function(matrix){var matrix=Matrix.multiply(matrix,this);this._affectValues(matrix);return this;},multiplyPoint:function(x,y){return{x:this.xx*x+this.xy*y+this.dx,y:this.yx*x+this.yy*y+this.dy};},multiplyBounds:function(bounds){var pt1=this.multiplyPoint(bounds.x,bounds.y);var pt2=this.multiplyPoint(bounds.x+bounds.w,bounds.y);var pt3=this.multiplyPoint(bounds.x,bounds.y+bounds.h);var pt4=this.multiplyPoint(bounds.x+bounds.w,bounds.y+bounds.h);var xmin=Math.min(Math.min(pt1.x,pt2.x),Math.min(pt3.x,pt4.x));var ymin=Math.min(Math.min(pt1.y,pt2.y),Math.min(pt3.y,pt4.y));var xmax=Math.max(Math.max(pt1.x,pt2.x),Math.max(pt3.x,pt4.x));var ymax=Math.max(Math.max(pt1.y,pt2.y),Math.max(pt3.y,pt4.y));return{x:xmin,y:ymin,w:xmax-xmin,h:ymax-ymin};},values:function(){return $A([this.xx,this.yx,this.xy,this.yy,this.dx,this.dy]);},setValues:function(array){this.xx=parseFloat(array[0]);this.yx=parseFloat(array[1]);this.xy=parseFloat(array[2]);this.yy=parseFloat(array[3]);this.dx=parseFloat(array[4]);this.dy=parseFloat(array[5]);return this;},hashValues:function(){return $H({xx:this.xx,xy:this.xy,yx:this.yx,yy:this.yy,dx:this.dx,dy:this.dy});},toString:function(){return Object.inspect(this.hashValues());},toJSON:function(){return this.hashValues().toJSON();},_affectValues:function(matrix){Object.extend(this,matrix);return this;}});Graphic.AbstractRender=Class.create();Graphic.AbstractRender.prototype={initialize:function(element){var dimension=$(element).getDimensions();this.viewing={tx:0,ty:0,sx:1,sy:1,cx:dimension.width/2,cy:dimension.height/2};this._setViewMatrix();this.bounds={x:0,y:0,w:dimension.width,h:dimension.height};return this;},pan:function(x,y){this.viewing.tx=x;this.viewing.ty=y;this._setViewMatrix();this._setViewing();return this;},zoom:function(sx,sy,cx,cy){this.viewing.sx=sx;this.viewing.sy=sy;this.viewing.cx=cx||this.bounds.w/2;this.viewing.cy=cy||this.bounds.h/2;this._setViewMatrix();this._setViewing();return this;},getViewing:function(){return this.viewing;},setViewing:function(viewing){this.viewing=Object.extend(this.viewing,viewing);this._setViewMatrix();this._setViewing();return this;},_setViewMatrix:function(){this.viewingMatrix=Matrix.translate(this.viewing.tx,this.viewing.ty).multiplyLeft(Matrix.scaleAt(1/this.viewing.sx,1/this.viewing.sy,this.viewing.cx,this.viewing.cy));},setSize:function(width,height){this.bounds.w=width;this.bounds.h=height;return this;},getSize:function(){return{width:this.bounds.w,height:this.bounds.h};},destroy:function(){console.log("Graphic.AbstractRender:destroy")},createShape:function(type){console.log("Graphic.AbstractRender:createShape")},add:function(shape,parent){console.log("Graphic.AbstractRender:add")},remove:function(shape,parent){console.log("Graphic.AbstractRender:remove")},get:function(id){console.log("Graphic.AbstractRender:get")},shapes:function(id){console.log("Graphic.AbstractRender:shapes")},clear:function(){console.log("Graphic.AbstractRender:clear")},updateAttributes:function(shape,attributes){console.log("Graphic.AbstractRender:update")},updateTransform:function(shape){console.log("Graphic.AbstractRender:updateTransform")},nbShapes:function(){console.log("Graphic.AbstractRender:nbShapes")},show:function(shape){console.log("Graphic.AbstractRender:show")},hide:function(shape){console.log("Graphic.AbstractRender:hide")},moveToFront:function(shape){console.log("Graphic.AbstractRender:moveToFront")},moveToBack:function(shape){console.log("Graphic.AbstractRender:moveToBack")},draw:function(){console.log("Graphic.AbstractRender:draw")},position:function(){console.log("Graphic.AbstractRender:position")},pick:function(event){console.log("Graphic.AbstractRender:pick")},addComment:function(shape,text){},addText:function(shape,text){console.log("Graphic.AbstractRender:addText")},_setViewing:function(){console.log("Graphic.AbstractRender:_setViewing")}}
Graphic.Shape=Class.create();Object.extend(Graphic.Shape.prototype,{initialize:function(renderer,nodeName){this.attributes={};this.renderer=renderer;this.nodeName=nodeName;this.element=renderer.createShape(this);if(this.element)
this.element.shape=this;this.setMatrix(new Matrix());this.setStroke(null);this.setFill(null);return this;},destroy:function(){this.renderer.remove(this);},getType:function(){return this.nodeName;},setID:function(id){this._setAttribute("id",id,true);return this;},getID:function(){return this.attributes.id;},setClassName:function(className){this._setAttribute("class",className,true);return this;},getClassName:function(){return this.attributes["class"];},show:function(){this.renderer.show(this);return this;},hide:function(){this.renderer.hide(this);return this;},setFill:function(attributes){if(!attributes||attributes.fill=="none"){this._setAttribute("fill","none");this._setAttribute("fill-opacity",0);}
else if(typeof attributes.r!="undefined"){this._setAttribute("fill","rgb("+parseInt(attributes.r)+","+parseInt(attributes.g)+","+parseInt(attributes.b)+")");this._setAttribute("fill-opacity",(attributes.a||255)/255.0);}
return this;},getFill:function(){return this.attributes.fill;},getFillOpacity:function(){return this.attributes["fill-opacity"];},setStroke:function(attributes){if(!attributes||attributes.stroke=="none"){this._setAttribute("stroke","none");this._setAttribute("stroke-opacity",0);this._setAttribute("stroke-width",0);}
else if(typeof attributes.r!="undefined"){this._setAttribute("stroke","rgb("+parseInt(attributes.r)+","+parseInt(attributes.g)+","+parseInt(attributes.b)+")");this._setAttribute("stroke-opacity",(attributes.a||255)/255.0);this._setAttribute("stroke-width",(attributes.w||1));}
return this;},setStrokeWidth:function(w){this._setAttribute("stroke-width",(w||1));return this;},setStrokeOpacity:function(a){this._setAttribute("stroke-opacity",(a||255)/255.0);return this;},setStrokeColor:function(r,g,b){this._setAttribute("stroke","rgb("+parseInt(r)+","+parseInt(g)+","+parseInt(b)+")");return this;},getStroke:function(){return this.attributes.stroke;},getStrokeOpacity:function(){return this.attributes["stroke-opacity"];},getStrokeWidth:function(){return this.attributes["stroke-width"];},setAntialiasing:function(on){if(on)
this._setAttribute("shape-rendering","auto");else
this._setAttribute("shape-rendering","crispEdges");return this;},getAntialiasing:function(){return this.attributes["shape-rendering"]=="auto";},setBounds:function(x,y,w,h){this.setLocation(x,y);this.setSize(w,h);return this;},getBounds:function(){return Object.extend(this.getSize(),this.getLocation());},moveToFront:function(){if(this.renderer)
this.renderer.moveToFront(this);return this;},rotate:function(angle,rx,ry){var bounds=this.getBounds();if(typeof rx=="undefined")
rx=bounds.x+(bounds.w/2);if(typeof ry=="undefined")
ry=bounds.y+(bounds.h/2);this.postTransform(Matrix.translate(rx,ry));this.postTransform(Matrix.rotate(angle));this.postTransform(Matrix.translate(-rx,-ry));return this;},translate:function(tx,ty){return this.postTransform(Matrix.translate(tx,ty));},scale:function(sx,sy,cx,cy){if(cx)
this.postTransform(Matrix.translate(cx,cy));this.postTransform(Matrix.scale(sx,sy));if(cx)
this.postTransform(Matrix.translate(-cx,-cy));return this},postTransform:function(matrix){this.matrix.multiplyRight(matrix)
this.inverseMatrix.multiplyLeft(Matrix.invert(matrix));this._updateTransform();return this;},preTransform:function(matrix){this.matrix.multiplyLeft(matrix)
this.inverseMatrix.multiplyRight(Matrix.invert(matrix));this._updateTransform();return this;},setMatrix:function(matrix,inverse){this.matrix=new Matrix(matrix);this.inverseMatrix=inverse||Matrix.invert(this.matrix);this._updateTransform();return this;},getMatrix:function(){return this.matrix;},getInverseMatrix:function(){return this.inverseMatrix;},getRendererObject:function(){return this.element;},getSize:function(){console.log("getSize")
throw Graphic.functionMustBeOverriden;},setSize:function(width,height){console.log("setSize")
throw Graphic.functionMustBeOverriden;},getLocation:function(){console.log("getLocation")
throw Graphic.functionMustBeOverriden;},setLocation:function(x,y){console.log("setLocation")
throw Graphic.functionMustBeOverriden;},addComment:function(commentText){var commentNode=this.renderer.addComment(this,commentText);return this;},_setAttributes:function(attributes){this.attributes=Object.extend(this.attributes,attributes||{});this.renderer.updateAttributes(this,attributes);return this;},_setAttribute:function(name,value){var hash={}
hash[name]=value;this._setAttributes(hash);return this;},_updateTransform:function(){this._setAttributes({matrix:this.matrix.values().join(","),invmatrix:this.inverseMatrix.values().join(",")});this.renderer.updateTransform(this);}})
Graphic.Rectangle=Class.create();Object.extend(Graphic.Rectangle.prototype,Graphic.Shape.prototype);Graphic.Rectangle.prototype._shapeInitialize=Graphic.Shape.prototype.initialize;Object.extend(Graphic.Rectangle.prototype,{initialize:function(renderer){this._shapeInitialize(renderer,"rect");Object.extend(this.attributes,{x:0,y:0,w:0,h:0,rx:0,ry:0});return this;},getSize:function(){return{w:this.attributes.width,h:this.attributes.height}},setSize:function(width,height){this._setAttributes({width:width,height:height});return this;},getLocation:function(){return{x:this.attributes.x,y:this.attributes.y}},setLocation:function(x,y){this._setAttributes({x:x,y:y});return this;},setRoundCorner:function(rx,ry){rx=Math.max(0,rx);ry=Math.max(0,ry);if(!ry)
ry=rx;this._setAttributes({rx:rx,ry:ry});return this;},getRoundCorner:function(rx,ry){return{rx:this.attributes.rx,ry:this.attributes.ry}}})
Graphic.Ellipse=Class.create();Object.extend(Graphic.Ellipse.prototype,Graphic.Shape.prototype);Graphic.Ellipse.prototype._shapeInitialize=Graphic.Shape.prototype.initialize;Object.extend(Graphic.Ellipse.prototype,{initialize:function(renderer){this._shapeInitialize(renderer,"ellipse");Object.extend(this.attributes,{cx:0,cy:0,rx:0,ry:0})
return this;},getSize:function(){return{w:2*this.attributes.rx,h:2*this.attributes.ry}},setSize:function(width,height){var location=this.getLocation();this._setAttributes({rx:width/2,ry:height/2});this.setLocation(location.x,location.y);return this;},getLocation:function(){return{x:this.attributes.cx-this.attributes.rx,y:this.attributes.cy-this.attributes.ry}},setLocation:function(x,y){this._setAttributes({cx:x+this.attributes.rx,cy:y+this.attributes.ry});return this;}})
Graphic.Circle=Class.create();Object.extend(Graphic.Circle.prototype,Graphic.Shape.prototype);Graphic.Circle.prototype._parentInitialize=Graphic.Shape.prototype.initialize;Object.extend(Graphic.Circle.prototype,{initialize:function(renderer){this._parentInitialize(renderer,"circle");Object.extend(this.attributes,{cx:0,cy:0,r:0})
return this;},getSize:function(){return{w:2*this.attributes.r,h:2*this.attributes.r}},setSize:function(width,height){var location=this.getLocation();this._setAttributes({r:Math.max(width,height)/2});this.setLocation(location.x,location.y);return this;},getLocation:function(){return{x:this.attributes.cx-this.attributes.r,y:this.attributes.cy-this.attributes.r}},setLocation:function(x,y){this._setAttributes({cx:x+this.attributes.r,cy:y+this.attributes.r});return this;},setCenter:function(cx,cy){this._setAttributes({cx:cx,cy:cy});return this;},getCenter:function(){return{cx:this.attributes.cx,cy:this.attributes.cy};},setRadius:function(r){this._setAttributes({r:r});return this;},getRadius:function(){return this.attributes.r;}})
Graphic.Polyline=Class.create();Object.extend(Graphic.Polyline.prototype,Graphic.Shape.prototype);Graphic.Polyline.prototype._parentInitialize=Graphic.Shape.prototype.initialize;Object.extend(Graphic.Polyline.prototype,{initialize:function(renderer,type){this._parentInitialize(renderer,type||"polyline");Object.extend(this.attributes,{x:0,y:0,w:0,h:0});this.points=new Array();return this;},addPoints:function(points){points.each(function(p){this.points.push([p[0],p[1]])}.bind(this));this._updatePath();return this;},setPoints:function(points){this.points.clear();this.addPoints(points)
return this;},setPoint:function(x,y,index){if(index<this.points.length){this.points[index][0]=x;this.points[index][1]=y;this._updatePath();}
return this;},addPoint:function(x,y){this.points.push([x,y]);this._updatePath();return this;},getPoints:function(){return this.points;},getPoint:function(index){return{x:this.points[index][0],y:this.points[index][1]};},getNbPoints:function(){return this.points.length;},setSize:function(width,height){var x0=this.x;var y0=this.y;var fx=width/this.w;var fy=height/this.h;this.points.each(function(p){p[0]=(p[0]-this.x)*fx+this.x;p[1]=(p[1]-this.y)*fy+this.y;}.bind(this));this._updatePath();return this;},getSize:function(){return{w:this.w,h:this.h}},setLocation:function(x,y){var dx=x-this.x;var dy=y-this.y;this.points.each(function(p){p[0]+=dx;p[1]+=dy;});this._updatePath();return this;},getLocation:function(){return{x:this.x,y:this.y}},_updateBounds:function(){var xmin=0,ymin=0,xmax=0,ymax=0;if(this.points.length>0){var xmin=parseFloat(this.points[0][0]),ymin=parseFloat(this.points[0][1]),xmax=parseFloat(this.points[0][0]),ymax=parseFloat(this.points[0][1]);xmin=parseFloat(xmin);this.points.each(function(p){p[0]=parseFloat(p[0]);p[1]=parseFloat(p[1]);if(p[0]<xmin)xmin=p[0];if(p[0]>xmax)xmax=p[0];if(p[1]<ymin)ymin=p[1];if(p[1]>ymax)ymax=p[1];});this.x=xmin;this.y=ymin;this.w=xmax-xmin;this.h=ymax-ymin;}
else{this.x=0;this.y=0;this.w=0;this.h=0;};},_updatePath:function(){var path="";this.points.each(function(p){path+=p[0]+" "+p[1]+","});path=path.slice(0,path.length-1);this._updateBounds();this._setAttribute("points",path);}})
Graphic.Polygon=Class.create();Object.extend(Graphic.Polygon.prototype,Graphic.Polyline.prototype);Graphic.Polygon.prototype._polylineInitialize=Graphic.Polyline.prototype.initialize;Object.extend(Graphic.Polygon.prototype,{initialize:function(renderer){this._polylineInitialize(renderer,"polygon");return this;}})
Graphic.Line=Class.create();Object.extend(Graphic.Line.prototype,Graphic.Shape.prototype);Graphic.Line.prototype._parentInitialize=Graphic.Shape.prototype.initialize;Object.extend(Graphic.Line.prototype,{initialize:function(renderer){this._parentInitialize(renderer,"line");return this;},getSize:function(){return{w:Math.abs(this.attributes.x1-this.attributes.x2),h:Math.abs(this.attributes.y1-this.attributes.y2)}},setSize:function(width,height){return this;},getLocation:function(){return{x:Math.min(this.attributes.x1,this.attributes.x2),y:Math.min(this.attributes.y1,this.attributes.y2)}},setLocation:function(x,y){return this;},setPoints:function(x1,y1,x2,y2){this._setAttributes({x1:x1,y1:y1,x2:x2,y2:y2})
return this;},getPoint:function(index){if(index==0)
return{x:this.attributes.x1,y:this.attributes.y1}
else
return{x:this.attributes.x2,y:this.attributes.y2}}})
Graphic.Group=Class.create();Object.extend(Graphic.Group.prototype,Graphic.Shape.prototype);Graphic.Group.prototype._parentInitialize=Graphic.Shape.prototype.initialize;Graphic.Group.prototype._parentPostTransform=Graphic.Shape.prototype.postTransform;Graphic.Group.prototype._parentPreTransform=Graphic.Shape.prototype.preTransform;Object.extend(Graphic.Group.prototype,{initialize:function(renderer){this._parentInitialize(renderer,"g");this.children=new Array();return this;},destroy:function(){this.children.each(function(e){e.destroy();});this.children.clear();this.renderer.remove(this);},add:function(shape){var hasShape=this.children.find(function(s){return s==shape});if(!hasShape){this.children.push(shape);shape.parent=this;shape.originalMatrix=shape.matrix;this.renderer.add(shape,this);}},remove:function(shape){var hasShape=this.children.find(function(s){return s==shape});if(hasShape){this.children=this.children.reject(function(s){return s==shape});this.renderer.remove(shape);shape.parent=null;}},get:function(index){return(index>=0&&index<this.children.length?this.children[index]:null);},getNbELements:function(){return this.children.length;},getSize:function(){if(this.getNbELements()==0)
return{w:0,h:0};var first=this.children.first()
var bounds=(first.getBounds());var xmin=bounds.x;var ymin=bounds.y;var xmax=bounds.x+bounds.w;var ymax=bounds.y+bounds.h;this.children.each(function(shape){var bounds=(shape.getBounds());xmin=Math.min(xmin,bounds.x);xmax=Math.max(xmax,bounds.x+bounds.w);ymin=Math.min(ymin,bounds.y);ymax=Math.max(ymax,bounds.y+bounds.h);});return{w:xmax-xmin,h:ymax-ymin};},getLocation:function(){if(this.getNbELements()==0)
return{x:0,y:0};var first=this.children.first()
var bounds=(first.getBounds());var xmin=bounds.x;var ymin=bounds.y;this.children.each(function(shape){var bounds=(shape.getBounds());xmin=Math.min(xmin,bounds.x);ymin=Math.min(ymin,bounds.y);});return{x:xmin,y:ymin};},postTransform:function(matrix){this._parentPostTransform(matrix);this.children.each(function(shape){shape.postTransform(matrix);});return this;},preTransform:function(matrix){this._parentPreTransform(matrix);this.children.each(function(shape){shape.preTransform(matrix);});return this;},find:function(shapeId){return this.children.find(function(s){return s.getID()==shapeId});},findAll:function(shapeType){return this.children.findAll(function(s){return s.getType()==shapeType});}})
Graphic.Text=Class.create();Object.extend(Graphic.Text.prototype,Graphic.Shape.prototype);Graphic.Text.prototype._parentInitialize=Graphic.Shape.prototype.initialize;Object.extend(Graphic.Text.prototype,{initialize:function(renderer){this._parentInitialize(renderer,"text");Object.extend(this.attributes,{x:0,y:0,'font-size':'10','font-family':'Veranda','font-weight':'normal'});return this;},getSize:function(){return{fontSize:this.attributes['font-size'],fontWeight:this.attributes['font-weight']};},setSize:function(fontSize,fontWeight){this._setAttributes({'font-size':fontSize,'font-weight':fontWeight});return this;},getLocation:function(){return{x:this.attributes.x,y:this.attributes.y}},setLocation:function(x,y){this._setAttributes({x:x,y:y});return this;},getFont:function(){return{fontSize:this.attributes['font-size'],fontFamily:this.attributes['font-family'],fontWeight:this.attributes['font-weight']};},setFont:function(size,family,weight){if(size){this._setAttribute('font-size',size);}
if(family){this._setAttribute('font-family',family);}
if(weight){this._setAttribute('font-weight',weight);}
return this;},setTextValue:function(textValue){this.renderer.addText(this,textValue);return this;}})
Graphic.Image=Class.create();Object.extend(Graphic.Image.prototype,Graphic.Rectangle.prototype);Graphic.Image.prototype._shapeInitialize=Graphic.Shape.prototype.initialize;Object.extend(Graphic.Image.prototype,{initialize:function(renderer,image){this._shapeInitialize(renderer,"image");Object.extend(this.attributes,{x:0,y:0,width:0,height:0});return this;},setSource:function(url,autoSize){if(autoSize){this.image=new Image();this.image.src=url;Event.observe(this.image,"load",function(){this.setSize(this.image.width,this.image.height);this._setAttribute('href',url);}.bind(this));}
else
this._setAttribute('href',url);return this;}});EventNotifier={observers:new Array(),addObserver:function(observer,sender){sender=sender||null;this.removeObserver(observer);this.observers.push({observer:observer,sender:sender});},removeObserver:function(observer){this.observers=this.observers.reject(function(o){return o.observer==observer});},send:function(sender,eventName,options){options=options||null;this.observers.each(function(o){if((o.sender==null||o.sender==sender)&&o.observer[eventName])
o.observer[eventName](sender,options);});}}
Graphic.Tool=Class.create();Graphic.Tool.prototype={activate:function(manager){},unactivate:function(manager){},clear:function(manager){},initDrag:function(x,y,event){},drag:function(x,y,dx,dy,ddx,ddy,event){},endDrag:function(x,y,event){},mouseMove:function(x,y,event){},click:function(x,y,event){},doubleClick:function(x,y,event){},keyUp:function(keyCode,event){},keyDown:function(keyCode,event){},mouseOver:function(x,y,event){},mouseOut:function(event){}}
Graphic.ToolManager=Class.create();Graphic.ToolManager.prototype={initialize:function(renderer){this.renderer=renderer;this.element=renderer.element.parentNode;this.currentTool=null;this.eventMappings=$A([[this.element,"mousedown",this.mouseDown],[this.element,"click",this.click],[this.element,"dblclick",this.doubleClick],[document,"mousemove",this.mouseMove],[document,"mouseup",this.mouseUp],[document,"keyup",this.keyUp],[document,"keydown",this.keyDown],[this.element,"mouseover",this.mouseOver],[this.element,"mouseout",this.mouseOut]]);this.eventMappings.each(function(eventMap){eventMap.push(eventMap[2].bindAsEventListener(this))
Event.observe($(eventMap[0]),eventMap[1],eventMap[3]);}.bind(this));this.offset=Position.cumulativeOffset(this.element);this.dimension=$(this.element).getDimensions();},destroy:function(){this.currentTool.unactivate();this.currentTool=null;this.eventMappings.each(function(eventMap){Event.stopObserving($(eventMap[0]),eventMap[1],eventMap[3]);});this.eventMappings.clear();},setRenderer:function(renderer){this.renderer=renderer;this.setTool(this.currentTool);},setTool:function(tool){if(this.currentTool&&this.currentTool.unactivate)
this.currentTool.unactivate(this);this.currentTool=tool;if(this.currentTool&&this.currentTool.activate)
this.currentTool.activate(this);},getTool:function(){return this.currentTool;},doubleClick:function(event){if(this.currentTool==null)
return;this.offset=Position.page(this.element);var x=this._getX(event);var y=this._getY(event);this.currentTool.doubleClick(x,y,event);Event.stop(event);},click:function(event){if(this.currentTool==null)
return;this.offset=Position.page(this.element);var x=this._getX(event);var y=this._getY(event);this.currentTool.click(x,y,event);Event.stop(event);},mouseDown:function(event){if(this.currentTool==null)
return;if(!Event.isLeftClick(event))
return;this.offset=Position.page(this.element);this.xi=this._getX(event);this.yi=this._getY(event);this.xlast=this.xi;this.ylast=this.yi;this.currentTool.initDrag(this.xi,this.yi,event);this.isDragging=true;disableSelection();Event.stop(event);},mouseMove:function(event){if(this.currentTool==null)
return;var x=this._getX(event);var y=this._getY(event);if(this.isDragging){var dx=x-this.xi;var dy=y-this.yi;var ddx=x-this.xlast;var ddy=y-this.ylast;var org=this.renderer.viewingMatrix.multiplyPoint(0,0);var pt=this.renderer.viewingMatrix.multiplyPoint(ddx,ddy);ddx=pt.x-org.x;ddy=pt.y-org.y;var pt=this.renderer.viewingMatrix.multiplyPoint(dx,dy);dx=pt.x-org.x;dy=pt.y-org.y;this.xlast=x;this.ylast=y;this.currentTool.drag(x,y,dx,dy,ddx,ddy,event);}
else
if(this.currentTool.mouseMove)
this.currentTool.mouseMove(x,y,event);Event.stop(event);},mouseUp:function(event){if(this.currentTool==null)
return;if(!this.isDragging)
return false;var x=this._getX(event);var y=this._getY(event);this.isDragging=false;this.currentTool.endDrag(x,y,event);enableSelection();Event.stop(event);},keyUp:function(event){if(this.currentTool==null)
return;var keyCode=event.keyCode||event.which
if(this.currentTool.keyUp(keyCode,event))
Event.stop(event);},keyDown:function(event){if(this.currentTool==null)
return;var keyCode=event.keyCode||event.which
if(this.currentTool.keyDown(keyCode,event))
Event.stop(event);},mouseOver:function(event){if(this.currentTool==null)
return;var x=this._getX(event);var y=this._getY(event);this.currentTool.mouseOver(x,y,event);Event.stop(event);},mouseOut:function(event){if(this.currentTool==null)
return;this.currentTool.mouseOut(event);Event.stop(event);},scrollX:function(){var page=Position.page(this.element);var offset=Position.cumulativeOffset(this.element);return offset[0]-page[0];},scrollY:function(){var page=Position.page(this.element);var offset=Position.cumulativeOffset(this.element);return offset[1]-page[1];},_getX:function(event){this.dimension=$(this.element).getDimensions();var scroll=getWindowScroll(window);var x=Event.pointerX(event)-this.offset[0]-scroll.left;if(x<0)
x=0;if(x>this.dimension.width)
x=this.dimension.width;return x;},_getY:function(event){this.dimension=$(this.element).getDimensions();var scroll=getWindowScroll(window);var y=Event.pointerY(event)-this.offset[1]-scroll.top;if(y<0)
y=0;if(y>this.dimension.height)
y=this.dimension.height;return y;}}