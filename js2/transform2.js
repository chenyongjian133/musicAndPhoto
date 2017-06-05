;(function(w){
	w.getEle=function(objId,num){
				if(arguments.length>1){
					return document.querySelectorAll('#'+objId);
				}else{
					return document.querySelector('#'+objId);
				}
		};
		w.transformCss=w.CSS=function(obj,type,val){
			//如果对象没有transforms这个属性，就给它这个属性并且赋值为一个空对象
			if(!obj.transforms){
				obj.transforms={}
			}
			if(arguments.length>2){
//				如果传入的参数大于2--写
				var text='';
				//添加属性键值对
				obj.transforms[type]=val;
				for(item in obj.transforms){
					switch(item){
						case 'skewX':
						case 'skewY':
						case 'skew':
						case 'rotate':
							text+=item+'('+obj.transforms[item]+'deg) ';
							break;
						case 'scale':
						case 'scaleX':
						case 'scaleY':
							text+=item+'('+obj.transforms[item]+') ';
							break;
						case 'translate':
						case 'translateX':
						case 'translateY':
						case 'translateZ':
							text+=item+'('+obj.transforms[item]+'px) ';
							break;
					}
					obj.style.transform=obj.style.webkitTransform=text;
				}
			}else{
//				读  如果有要读取的变换，测直接返回变换效果的值,所有的值都不带单位,
				if(typeof obj.transforms[type]=='undefined'){
					//如果变换效果还没有,就返回默认值,放大的为1,旋转和倾斜为0
					if(type=="scale"||type=="scaleX"||type=="scaleY"){
						obj.transforms[type]=1;
					}else{
						obj.transforms[type]=0;
					}
				}
				return obj.transforms[type];
			}
		}
	/*拖拽组件 （解耦合）
	 * 	快速滑屏
	 * 	即点即停
	 * 	防抖动
	 * 	带滚动条
	 * */
	w.xiaomei=Object.create(null);
	w.xiaomei.drag=function(wrap,callback){
		var Tween = {
			Linear: function(t,b,c,d){ return c*t/d + b; },
			Back: function(t,b,c,d,s){
	            if (s == undefined) s = 1.70158;
	            return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	       },
	       Quad:function(t,b,c,d){
	            return -c *(t/=d)*(t-2) + b;
	       },
	       Quint: function(t,b,c,d){
	            return c*((t=t/d-1)*t*t*t*t + 1) + b;
	        }
		}
		var item=wrap.children[0];
		CSS(item,'translateZ',.01);
		var elem={},start={},dis={};
		var limitTop=wrap.clientHeight-item.offsetHeight;
		var lastTime=0,lastPoint=0,timeDis=1,pointDis=0;
		var isF=true,isY=true;
		var x='translateX',y='translateY';
		var height=document.documentElement.clientHeight;
		wrap.addEventListener('touchstart',function(ev){
			wrap.isMove=false;
			limitTop=wrap.clientHeight-item.offsetHeight;
			ev=ev||event;
			var touchC=ev.changedTouches[0];
			item.style.transition='none';
			elem.x=CSS(item,x);
			elem.y=CSS(item,y);
			start.x=touchC.clientX;
			start.y=touchC.clientY;
			lastTime=new Date().getTime();
			lastPoint=CSS(item,y);
			isF=isY=true;
			pointDis=0;
			if(callback&&typeof callback['start']==='function'){
				callback['start']()
			}
		})
		wrap.addEventListener('touchmove',function(ev){
			if(!isY){return}
			ev=ev||event;
			var touchC=ev.changedTouches[0];
			var now={};
			now.x=touchC.clientX;
			now.y=touchC.clientY;
			dis.x=now.x-start.x;
			dis.y=now.y-start.y;
			if(!wrap.isMove&&Math.abs(dis.y)>2 || !wrap.isMove&&Math.abs(dis.x)>2){
				wrap.isMove=true;
			}
			var translateY=elem.y+dis.y;
			var scale=0;
			if(translateY>0){
				scale=height/(height+translateY);
				translateY=elem.y+dis.y*scale;
			}else if(translateY<limitTop){
				scale=height/(height+limitTop-translateY);
				translateY=elem.y+dis.y*scale;
			}
			if(isF){
				isF=false;
				if(Math.abs(dis.y)<Math.abs(dis.x)){
					isY=false;
					return
				}
			}
			CSS(item,y,translateY);
			var nowTime=new Date().getTime();
			var nowPoint=CSS(item,y);
			timeDis=nowTime-lastTime;
			pointDis=nowPoint-lastPoint;
			lastTime=nowTime;
			lastPoint=nowPoint;
			if(callback&&typeof callback['move']==='function'){
				callback['move']()
			}
		});
		wrap.addEventListener('touchend',function(ev){
			if(!wrap.isMove){
				
			}else{
				var speed=pointDis/timeDis;
				var target=CSS(item,y)+speed*200;
				var time=Math.abs(speed)*.2;
				time=time<.3?.3:time;
				var type='Quint';
				if(target>0){
					target=0;
					type='Back';
				}else if(target<limitTop){
					target=limitTop;
					type='Back';
				}
				move(target,time,type);
				if(callback&&typeof callback['end']==='function'){
					callback['end']()
				}
			}
		});
		function move(target,time,type){
			clearInterval(wrap.time);
			var t=0;
			var b=CSS(item,y);
			var c=target-b;
			var d=time/.02;
			var s=3;
			wrap.time=setInterval(function(){
				/*
				 * t:当前次数
				 * b:初始位置
				 * c:结束位置与初始位置之间的差值
				 * d:总次数
				 * s:回弹距离
				 * 
				 * */
				t++;
				if(t>d){
					clearInterval(wrap.time);
					if(callback&&typeof callback['over']==='function'){
						callback['over']()
					}
				}else{
					var point=Tween[type](t,b,c,d,s);
					CSS(item,y,point);
					if(callback&&typeof callback['move']==='function'){
						callback['move']()
					}
				}
			},20)
		}
		
	}
})(window)
