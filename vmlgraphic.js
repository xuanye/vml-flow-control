function graphic()
{
     //xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" 
     //无效，考虑使用在服务端生成来做适配的方法      
     /*
         document.namespaces.add('v', 'urn:schemas-microsoft-com:vml');
         document.namespaces.add('o', 'urn:schemas-microsoft-com:office:office'); 
     */
}
graphic.prototype = 
{
     //私有函数 绘制元素，生成一般的vml元素
     draw_element:function(eleTagName,className,comStyle,innerText){
         var e = document.createElement(eleTagName);
         e.className = className;
         for(var attr in comStyle)
         {
             e.style[attr] =comStyle[attr] ;
         }
         e.innerText = innerText;
         return e;
     },
    //绘制直线
    //@param className 样式类名
    //@param comStyle 特定的样式 如定位等
    //@param fromPoint 原点坐标 [0,0]
    //@param toPoint 目标坐标 [0,100]
    //@param borderColor 线条颜色 
    //@param borderWeight 线条宽度 
    //@param dashStyle 线条样式 solid/dash 直线/曲线
    draw_line:function(className,comStyle,innerText,fromPoint,toPoint,borderColor,borderWeight,dashStyle) { 
      var element= this.draw_element("v:line",className,comStyle,innerText);
      //from="0,0" to="0,150" stroked="t" strokecolor="#666" strokeweight="1px"
      element.from = fromPoint.join(",");
      element.to = toPoint.join(",");
      element.stroked="t";
      element.strokecolor = borderColor;
      element.strokeweight =borderWeight ;
      var strok = document.createElement("v:stroke");
      //<v:stroke opacity="1" startarrow="none" endarrow="Classic" endarrowlength="long"  dashstyle="dash" />
      strok.dashstyle = dashStyle;
      element.appendChild(strok);
      return element;
    },
    //绘制直线带箭头
    //@param className 样式类名
    //@param comStyle 特定的样式 如定位等
    //@param fromPoint 原点坐标 [0,0]
    //@param toPoint 目标坐标 [0,100]
    //@param borderColor 线条颜色 
    //@param borderWeight 线条宽度 
    //@param dashStyle 线条样式 solid/dash 直线/曲线
    draw_line_with_arrow:function(className,comStyle,innerText,fromPoint,toPoint,borderColor,borderWeight,dashStyle){ 
      var element= this.draw_element("v:line",className,comStyle,innerText);
      //from="0,0" to="0,150" stroked="t" strokecolor="#666" strokeweight="1px"
      element.from = fromPoint.join(",");
      element.to = toPoint.join(",");
      element.stroked="t";
      element.strokecolor = borderColor;
      element.strokeweight =borderWeight ;
      var strok = document.createElement("v:stroke");
      //<v:stroke opacity="1" startarrow="none" endarrow="Classic" endarrowlength="long"  dashstyle="dash" />
      strok.dashstyle = dashStyle;
      strok.startarrow ="none";
      strok.endarrow = "Classic";
      strok.endarrowlength = "long";     
      element.appendChild(strok);
      return element;
    },
    // 绘制椭圆形
    //@param className 样式类名
    //@param comStyle 特定的样式 如定位等
    //@param fillColor 填充色
    //@param borderColor 线条颜色 
    //@param borderWeight 线条宽度 
    //@param arcSize 转角大小 
    draw_roundrect:function(className,comStyle,innerText,fillColor,borderColor,borderWeight,arcSize) 
    {
         var element= this.draw_element("v:roundrect",className,comStyle,innerText);
         //fillcolor="#FFD79B" strokecolor="#FFBA54" strokeweight="2px" arcsize="0.3"
         element.strokecolor = borderColor;
         element.strokeweight = borderWeight;
         element.fillcolor = fillColor;
         element.arcsize = arcSize ;
         return element;
    },
    //绘制线段 
    //@param className 样式类名
    //@param comStyle 特定的样式 如定位等
    //@param innerText 内部的文字
    //@param points 线段的点 是个数字[[0,0],[0,30],[30,30]]
    //@param isFillColor 是否填充  f/t  false/true
    //@param fillColor 填充色
    //@param borderColor 线条颜色 
    //@param borderWeight 线条宽度 
    //@param dashStyle 线条样式 solid/dash 直线/曲线
    draw_polyline:function(className,comStyle,innerText,points,isFillColor,fillColor,borderColor,borderWeight,dashStyle){ 
         var element= this.draw_element("v:polyline",className,comStyle,innerText);
         //strokecolor="#666" strokeweight="1.5px" points="0,0,50,-30,100,0,50,30,0,0" filled="t" fillcolor="#CCC"
         element.strokecolor = borderColor;
         element.strokeweight = borderWeight ;
         if(isFillColor)
         {
             element.filled="t" ;
             element.fillcolor=fillColor;
         }
         var pts =[];        
         for (var i =0,l=points.length; i<l; i++) {
             pts.push(points[i].join(","));
         };
         element.points = pts.join(",");
 
         var strok = document.createElement("v:stroke");
         //<v:stroke opacity="1" startarrow="none" endarrow="Classic" endarrowlength="long"  dashstyle="dash" />
         strok.dashstyle = dashStyle;
         element.appendChild(strok);
         return element;
    },
    //绘制线段带箭头 
    //@param className 样式类名
    //@param comStyle 特定的样式 如定位等
    //@param innerText 内部的文字
    //@param points 线段的点 是个数字[[0,0],[0,30],[30,30]]
    //@param isFillColor 是否填充  f/t  false/true
    //@param fillColor 填充色
    //@param borderColor 线条颜色 
    //@param borderWeight 线条宽度 
    //@param dashStyle 线条样式 solid/dash 直线/曲线
    draw_polyline_arrow:function(className,comStyle,innerText,points,borderColor,borderWeight,dashStyle){ 
         var element= this.draw_element("v:polyline",className,comStyle,innerText);
         //strokecolor="#666" strokeweight="1.5px" points="0,0,50,-30,100,0,50,30,0,0" filled="t" fillcolor="#CCC"
         element.strokecolor = borderColor;
         element.strokeweight = borderWeight ;           
         element.filled="f" ;
         var pts =[];        
         for (var i =0,l=points.length; i<l; i++) {
             pts.push(points[i].join(","));
         };
         element.points = pts.join(",");
 
         var strok = document.createElement("v:stroke");
         //<v:stroke opacity="1" startarrow="none" endarrow="Classic" endarrowlength="long"  dashstyle="dash" />
         strok.dashstyle = dashStyle;
         strok.startarrow ="none";
         strok.endarrow = "Classic";
         strok.endarrowlength = "long";      
         element.appendChild(strok);
         return element;
    },
    //绘制曲线
    //@param className 样式类名
    //@param comStyle 特定的样式 如定位等
    //@param innerText 内部的文字
    //@param fromPoint 原点坐标 [0,0]
    //@param toPoint 目标坐标 [0,100]
    //@param borderColor 线条颜色 
    //@param borderWeight 线条宽度 
    //@param dashStyle 线条样式 solid/dash 直线/曲线
    //@param control1 控制点1[75,-50] 
    //@param control2 线条宽度[75,-50] 
    draw_curve:function(className,comStyle,innerText,fromPoint,toPoint,borderColor,borderWeight,dashStyle,control1,control2){ 
         var element= this.draw_element("v:curve",className,comStyle,innerText);
         //to="150px,0px" strokeweight="1.5px" strokecolor="#666"  filled='f' control1="75,50" control2="75,-50"
         element.from = fromPoint.join(",");
         element.to = toPoint.join(",");
         element.strokecolor = borderColor;
         element.strokeweight = borderWeight;
         element.control1 = control1.join(",");
         element.control2 = control2.join(",");
 
 
         var strok = document.createElement("v:stroke");
         //<v:stroke opacity="1" startarrow="none" endarrow="Classic" endarrowlength="long"  dashstyle="dash" />
         strok.dashstyle = dashStyle;
         element.appendChild(strok);
         return element;
    },
    //绘制曲线
    //@param className 样式类名
    //@param comStyle 特定的样式 如定位等
    //@param innerText 内部的文字
    //@param fromPoint 原点坐标 [0,0]
    //@param toPoint 目标坐标 [0,100]
    //@param borderColor 线条颜色 
    //@param borderWeight 线条宽度 
    //@param dashStyle 线条样式 solid/dash 直线/曲线
    //@param control1 控制点1[75,-50] 
    //@param control2 线条宽度[75,-50] 
    draw_curve_with_arrow:function(className,comStyle,innerText,fromPoint,toPoint,borderColor,borderWeight,dashStyle,control1,control2){ 
     var element= this.draw_element("v:curve",className,comStyle,innerText);
         //to="150px,0px" strokeweight="1.5px" strokecolor="#666"  filled='f' control1="75,50" control2="75,-50"
         element.from = fromPoint.join(",");
         element.to = toPoint.join(",");
         element.strokecolor = borderColor;
         element.strokeweight = borderWeight;
         element.control1 = control1.join(",");
         element.control2 = control2.join(",");
 
         var strok = document.createElement("v:stroke");
         //<v:stroke opacity="1" startarrow="none" endarrow="Classic" endarrowlength="long"  dashstyle="dash" />
         strok.dashstyle = dashStyle;            
         strok.startarrow ="none";
         strok.endarrow = "Classic";
         strok.endarrowlength = "long";   
         element.appendChild(strok); 
         return element;
    }
 }