var g = new graphic();
 function flowgraphic()
    {       
        this.__dragdata =null;
        this.__dragMode ="move" ; //move,resize,link
    }
    function get_element_withClass(element,className,stopId){
            if($(element).hasClass(className))
            {
                return element;
            }
            else if(element.id ==stopId)
            {
                return null;
            }   
            else
            {
                var p = $(element).parent();
                if(p.length>0)
                {
                    return get_element_withClass(p[0],className,stopId);
                }
            }
    }   
    //该函数计算两个线段是否相交，如果相交返回交点
    function segmentsIntr(a, b, c, d){
        // 三角形abc 面积的2倍
        var area_abc = (a.x - c.x) * (b.y - c.y) - (a.y - c.y) * (b.x - c.x);
        // 三角形abd 面积的2倍
        var area_abd = (a.x - d.x) * (b.y - d.y) - (a.y - d.y) * (b.x - d.x); 
        // 面积符号相同则两点在线段同侧,不相交 (对点在线段上的情况,本例当作不相交处理);
        if ( area_abc*area_abd>=0 ) {
            return false;
        }
        // 三角形cda 面积的2倍
        var area_cda = (c.x - a.x) * (d.y - a.y) - (c.y - a.y) * (d.x - a.x);
        // 三角形cdb 面积的2倍
        // 注意: 这里有一个小优化.不需要再用公式计算面积,而是通过已知的三个面积加减得出.
        var area_cdb = area_cda + area_abc - area_abd ;
        if (  area_cda * area_cdb >= 0 ) {
            return false;
        }
        //计算交点坐标
        var t = area_cda / ( area_abd- area_abc );
        var dx= t*(b.x - a.x),
            dy= t*(b.y - a.y);
        return { x: a.x + dx , y: a.y + dy };
    }   
    flowgraphic.prototype ={
        __generateId:function() {
            var S4 = function() {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            };
            return (S4() + S4() + S4() );
        }, 
        __get_elementBy_Id:function(id)
        {
            for(var i=0,l=this._elements.length;i<l;i++)
            {
                if(this._elements[i].id == id)
                {
                    return this._elements[i];
                }
            }
            return null;
        },
        __remove_elementBy_Id:function(id)
        {
            var index =-1;
            for(var i=0,l=this._elements.length;i<l;i++)
            {
                if(this._elements[i].id == id)
                {
                    index = i;
                    break;
                }
            }
            if(index>-1)
            {
                $("#"+id).remove();
                this._elements.splice(index, 1); //移除元素
            }
        },          
        __cal_arrow_diffpos:function(source,target,t_type)
        {
            var pos = $(source).offset();
            var w1 = $(source).outerWidth();
            var h1 = $(source).outerHeight();                           
            var p1 ={x:pos.left+parseInt(parseInt(w1)*0.5),y:pos.top+ parseInt(parseInt(h1)*0.5)};
            //计算第二个元素的中心位置
            var pos_t = $(target).offset();
            var w2 = $(target).outerWidth();
            var h2 = $(target).outerHeight();
            var p2 ={x:pos_t.left+parseInt(parseInt(w2)*0.5),y:pos_t.top+parseInt(parseInt(h2)*0.5)};
 
            var halfw= parseInt(parseInt(w2)*0.5);
            var halfh = parseInt(parseInt(h2)*0.5);
             
            var points =[];
            if(t_type =="judge")
            {
                points.push({x:p2.x,y:0-(p2.y-halfh)});
                points.push({x:p2.x+halfw,y:0-p2.y});
                points.push({x:p2.x,y:0-(p2.y+halfh)});
                points.push({x:p2.x-halfw,y:0-p2.y});
            }
            else
            {
                points.push({x:p2.x-halfw,y:0-(p2.y-halfh)});
                points.push({x:p2.x+halfw,y:0-(p2.y-halfh)});
                points.push({x:p2.x+halfw,y:0-(p2.y+halfh)});
                points.push({x:p2.x-halfw,y:0-(p2.y+halfh)});
            }           
            var p_t;
            var p1_r ={x:p1.x,y:0-p1.y};
            var p2_r ={x:p2.x,y:0-p2.y};            
            for(i =0;i<4;i++)
            {               
                if(i==3)
                {
                    p_t= segmentsIntr(p1_r,p2_r,points[3],points[0]);
                }       
                else
                {
                    p_t = segmentsIntr(p1_r,p2_r,points[i],points[i+1]);    
                }   
                if(p_t !=false)
                {
                    break;
                }
            }    
            if(p_t ==false)
            {
                return null;
            }       
            var p = {x:parseInt(p_t.x)-p1.x,y:parseInt(0-p_t.y)-p1.y};          
            return [p1,p];
        },
        __setlink:function(linkid,startid,endid)
        {
            for (var i = this._elements.length-1; i >= 0; i--) {
                if(this._elements[i].id ==linkid)
                {
                    this._elements[i].sid = startid;
                    this._elements[i].eid = endid;
                    return true;
                }
            };
            return false;
        },
        __deletelink:function(linkid)
        {
            for (var i = this._elements.length-1; i >= 0; i--) {
                if(this._elements[i].id ==linkid)
                {
                    this._elements[i].sid = "";
                    this._elements[i].eid = "";
                    return true;
                }
            };
            return false;
        },
        __getlink_by_bothid:function(startid,endid)
        {
            for (var i = this._elements.length-1; i >= 0; i--) {
                if( (this._elements[i].type =="line" || this._elements[i].type =="ployline") 
                    && ((this._elements[i].sid==startid && this._elements[i].eid==endid)
                    ||(this._elements[i].sid==endid && this._elements[i].eid==startid)) )
                {
                    return this._elements[i];
                }
            };
            return null;
        },
        __getlinks_by_singleid:function(id)
        {
            var arrlink =[];
            for (var i = this._elements.length-1; i >= 0; i--) {
                if( (this._elements[i].type =="line" || this._elements[i].type =="ployline") 
                && (this._elements[i].sid==id || this._elements[i].eid==id))                    
                {
                    arrlink.push(this._elements[i]);
                }
            };
            return arrlink;
        },
        __dragstart:function(e){
            var source = e.srcElement || e.target;
            var source = get_element_withClass(source,'flowdrag',this.id);
 
            if(source == null)
            {
                return;
            }
            switch(this.host.__dragMode)
            {   
                case "move":
                    this.host.__dragdata = {target:source,startX:e.pageX ,startY:e.pageY,X:e.pageX,Y:e.pageY,zIndex:source.style.zIndex};
                    this.host.__dragdata.target.style.zIndex = 9999;                    
                    //拖动前 先计算拖动的元素是否有连线
                    this.host.__dragdata.links= this.host.__getlinks_by_singleid(this.host.__dragdata.target.id);
                    break;
                case "link":
                    this.host.__dragdata = {target:source,startX:e.pageX ,startY:e.pageY,X:e.pageX,Y:e.pageY,zIndex:source.style.zIndex};
                    break;
                case "resize":
                    break;
            }
             
        },
        __draging:function(e){
            if(this.host.__dragdata  !=null)
            {                   
                switch(this.host.__dragMode)
                {   
                    case "move":
                        var diffX = e.pageX -this.host.__dragdata.X ;
                        var diffY = e.pageY -this.host.__dragdata.Y ;
                        this.host.__dragdata.X = e.pageX;
                        this.host.__dragdata.Y = e.pageY;
                        this.host.__dragdata.target.style.left = parseInt(this.host.__dragdata.target.style.left) + diffX +"px"; 
                        this.host.__dragdata.target.style.top = parseInt(this.host.__dragdata.target.style.top) + diffY +"px"; 
                         
                        //重新计算连线之间的位置
                        if(this.host.__dragdata.links.length>0)
                        {
                            for (var i =0,l=this.host.__dragdata.links.length; i<l ;i++) {
                                var link = this.host.__dragdata.links[i];
                                var t1 = this.host.__get_elementBy_Id(link.sid);
                                var t2 = this.host.__get_elementBy_Id(link.eid);                                
                                if(t1 !=null && t2 !=null)
                                {
                                    var points = this.host.__cal_arrow_diffpos(t1.element,t2.element,t2.type);
                                    if(points !=null)
                                    {
                                        link.element.to =[points[1].x,points[1].y]; 
                                        $(link.element).css({left:points[0].x,"top":points[0].y});
                                    }                                                               
                                }
                            };
                        }
                         
                        break;
                    case "link": // 移动的时候画虚线
                        //当移动的距离大于5个单位时,创建虚线
                        var diffX = e.pageX -this.host.__dragdata.startX ;
                        var diffY = e.pageY -this.host.__dragdata.startY ;
                        if(!this.host.__dragdata.linkid)
                        {
                            if ( diffX>5 || diffX>-5 ||diffY>5 || diffY<-5) {
                                this.host.__dragdata.linkid =this.host.draw_line_arrow(""
                                                                ,{x:this.host.__dragdata.startX,y:this.host.__dragdata.startY}
                                                                ,[0,0],[diffX,diffY],"dash");
                            };
                        }
                        else
                        {
                            //当虚线已经存在则重绘其大小
                            var linkline = this.host.__get_elementBy_Id(this.host.__dragdata.linkid);
                            if(linkline)
                            {
                                linkline.element.to =[diffX,diffY];
                            }
                            linkline =null;
                        }
                        break;
                    case "resize":
                        break;
                }               
            }
        },
        __dragend:function(e){
            if(this.host.__dragdata  !=null)
            {
                switch(this.host.__dragMode)
                {   
                    case "move":
                        this.host.__dragdata.target.style.zIndex = this.host.__dragdata.zIndex; 
                         
                        this.host.__dragdata = null;
                        break;
                    case "link":
                        //移除虚线 画实线
                        if(this.host.__dragdata.linkid)
                        {
                            this.host.__remove_elementBy_Id(this.host.__dragdata.linkid);
                        }                       
                        if(this.host.__dragdata.target_t) //存在第二个元素
                        {
                            //判断两个元素间不能存在两条
                            var link = this.host.__getlink_by_bothid(this.host.__dragdata.target.id,this.host.__dragdata.target_t.id);
                            if(!link)
                            {
                                var telement =this.host.__get_elementBy_Id(this.host.__dragdata.target_t.id);
                                //计算第一个元素的中心位置
                                var points = this.host.__cal_arrow_diffpos(this.host.__dragdata.target,this.host.__dragdata.target_t,telement.type);                            
                                if(points!=null)
                                {
                                    var id= this.host.draw_line_arrow(""
                                        ,points[0]
                                        ,[0,0],[points[1].x,points[1].y],"solid");
                                    this.host.__setlink(id,this.host.__dragdata.target.id,this.host.__dragdata.target_t.id);    
                                }
                                link=telement=points=null;
                            }                       
                        }
                        this.host.__dragdata = null;
                        break;
                    case "resize":
                        break;
                }   
            }
        },
        __element_mouseover:function() //鼠标移动到元素上;
        {
            var host = this.host;
            if(host.__dragdata !=null && this.host.__dragMode =="link")
            {
                if(host.__dragdata.target.id != this.id) //不是元素自己本身
                {
                    //log("鼠标进入元素"+this.id);
                    host.__dragdata.target_t =this;                 
                }
            }
            host =null;
        },
        __element_mouseout:function() 
        {
            var host = this.host;
            if(host.__dragdata !=null && this.host.__dragMode =="link")
            {
                //不是第一个元素不是自己本身，并且第二个元素是本身时 当移出元素范围则删除第二个元素标识
                if(host.__dragdata.target.id != this.id && host.__dragdata.target_t.id ==this.id) 
                {
                    //log("鼠标移出元素"+this.id);
                    host.__dragdata.target_t = null;
                }
            }
            host =null;
        },
        init:function(canvas,size) {
            this._canvas = {target:$(canvas),"size":size,nIndex:3000}; //画布
            this._elements = [];            
            this._canvas.target[0].host = this;
            this._canvas.target.mousedown(this.__dragstart)
                               .mousemove(this.__draging)
                               .mouseup(this.__dragend);
                              
        },
        set_drag_mode:function(mode){
            if(mode =="move" || mode =="link" || mode =="resize")
            {
                this.__dragMode = mode;
            }
        },
        draw_ativity:function(typeClass,cusStyle,text,fillcolor,borderColor,borderWeight)
        {       
            cusStyle.width="100px";
            cusStyle.height="40px";
            var el = g.draw_roundrect("flowelemnt flowdrag activity "+typeClass,cusStyle,text,fillcolor,borderColor,borderWeight,0.2);
            el.id =this.__generateId();         
            this._elements.push({id:el.id,element:el,type:typeClass});
            el.host = this;
            $(el).mouseover(this.__element_mouseover).mouseout(this.__element_mouseout);
            this._canvas.target.append(el);
            return el.id;
        },
        draw_startativity:function(text)
        {
            var cusStyle = {};
            cusStyle.zIndex = this._canvas.nIndex++;
            cusStyle.color = "#659900"; 
            cusStyle.left = Math.random()*500;
            cusStyle.top = Math.random()*500;
            return this.draw_ativity("startNode",cusStyle,text,"#D4E9BF","#99CC66","2px");
        },
        draw_endativity:function(text)
        {
            var cusStyle = {};
            cusStyle.zIndex = this._canvas.nIndex++;
            cusStyle.color = "#FFFFFF";   
            cusStyle.left = Math.random()*500;
            cusStyle.top = Math.random()*500;   
            return this.draw_ativity("endNode",cusStyle,text,"#E16D5E","#C05348","2px");            
        },
        draw_processactivity:function(text)
        {
            var cusStyle = {};
            cusStyle.zIndex = this._canvas.nIndex++;
            cusStyle.color = "#3385D6";  
            cusStyle.left = Math.random()*500;
            cusStyle.top = Math.random()*500;
            return this.draw_ativity("processNode",cusStyle,text,"#BEDBFF","#3399D6","2px");
        },
        draw_judge:function(text){ //判断节点
            var cusStyle = {};
            cusStyle.zIndex = this._canvas.nIndex++;
            cusStyle.color = "#D0700E";     
            cusStyle.left = Math.random()*500;
            cusStyle.top = Math.random()*500;
 
            var el = g.draw_polyline("flowelemnt flowdrag judge",cusStyle,text,[[0,0],[50,-30],[100,0],[50,30],[0,0]],true,"#FFD79B","#FFBA54","2px","solid");
            el.id = this.__generateId();        
            el.host = this;
            $(el).mouseover(this.__element_mouseover).mouseout(this.__element_mouseout);
            this._elements.push({id:el.id,element:el,type:"judge"});
            this._canvas.target.append(el);
            return el.id;
        },
        draw_line_arrow:function(text,pos,from,to,dashStyle)
        {
            var cusStyle = {};
            cusStyle.zIndex = (this._canvas.nIndex++)-1000;
            cusStyle.color = "#555555";  
            cusStyle.left = pos.x;
            cusStyle.top = pos.y ;          
            var el = g.draw_line_with_arrow("flowelemnt line",cusStyle,text,from,to,"#666666","1.5px",dashStyle);
            el.id = this.__generateId();
            this._elements.push({id:el.id,element:el,type:"line",sid:"",eid:""});
            this._canvas.target.append(el);     
            return el.id;
        },
        draw_ployline_arrow:function(text,pos,points,dashStyle)
        {
            var cusStyle = {};
            cusStyle.zIndex = (this._canvas.nIndex++)-1000;
            cusStyle.color = "#555555";  
            cusStyle.left = pos.x;
            cusStyle.top = pos.y ; 
            var el = g.draw_polyline("flowelemnt ployline",cusStyle,text,points,false,"","#666666","1.5px",dashStyle);
            el.id = this.__generateId();
            this._elements.push({id:el.id,element:el,type:"ployline",sid:"",eid:""});
            this._canvas.target.append(el);
            return el.id;
        }
    };