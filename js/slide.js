;(function(w){
		w.Qjian=Object.create(null);
//	w.bar=function(barId){
//		var scorllEle=getEle(barId);
//		return	callback={
//					start:function(){
//						scorllEle.style.opacity=1;
//					},
//					move:function(){
//						var scorlly = CSS(ulEle,"translateY")*scaleScroll;
//						CSS(scorllEle,"translateY",-scorlly)
//					},
//					end:function(){
//						scorllEle.style.opacity=0;
//					}
//				}
//	}
	//drag函数a指绑定滑屏事件的元素,b指真正需要滑动的元素，callback是回调函数,用来处理滚动条的样式
	w.Qjian.xiaomei=function(objParent,objChild,objScorll,objHead,objSearch,callback){
			function getEle(objId,num){
				if(arguments.length>1){
					return document.querySelectorAll('#'+objId);
				}else{
					return document.querySelector('#'+objId);
				}
				
			}
		/*Tween算法提供数据
		 * t:当前次数
		 * b:初始位置
		 * c:结束位置与初始位置之间的差值
		 * d:总次数
		 * s:回弹距离*/
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
			var docHeight=document.documentElement.clientHeight;
			var navEle=getEle(objParent);
			var ulEle=getEle(objChild);
			
			if(typeof objHead =='string' ){
				var headNode=getEle(objHead)||'{}';
			}else if(typeof objHead=='undefined'){
				console.log('objHead is undefined' )
			}else{
				callback=objHead;
			}
			
			
			if(typeof objSearch =='string' ){
				var searchNode=getEle(objSearch)||'{}';
			}else if(typeof objSearch=='undefined'){
				console.log('objSearch is undefined' )
			}else{
				callback=objSearch;
			}
			
			//如果有传滚动条参数进来才执行
			if(objScorll){
				var scorllEle=getEle(objScorll);
				//求出滚动条高度的比例
				var scaleScroll=docHeight/ulEle.offsetHeight;
				//求出滚动条高度
				scorllEle.style.height=scaleScroll*docHeight+'px';
			}
			
			CSS(ulEle,'translateZ',0.1)  //开启3D硬件加速，解决安卓手机的卡顿问题
			//初始化元素位置和手指位置
			var elementY={};
			var startY={};
//			防止竖向滑屏抖动
			var isF=true,isY=true;
			//初始化快速滑屏需要的参数
			var lastTime=0;
			var lastPoint=0;
			var timeDis=1;    //必须写不为0的数,不然会报0/0等于NAN的错误
			var pointDis=0;   //位移差
			var minY=navEle.clientHeight-ulEle.offsetHeight;
//			如果有传滚动条参数进来才执行  初始化callback的值，防止后面的调用报错
			var callback=callback?callback:'{}';
			
			if(!(callback.start||callback.move||callback.end)){
				if(arguments.length==5){
				    callback={
						start:function(){
							scorllEle.style.opacity=1;
						},
						move:function(){
							//只有普通滑屏才能使用同一个比例,如果是实时改变比例不能用上面的,要实时重新计算
	//						var scale=(docHeight-scorllEle.offsetHeight)/docHeight;
							
							var scale=-CSS(ulEle,'translateY')/(ulEle.offsetHeight-navEle.offsetHeight);
							var dist=(docHeight-scorllEle.offsetHeight)*scale;
							CSS(scorllEle,"translateY",dist)
							if(dist>headNode.offsetHeight){
								searchNode.style.display='none';
							}else{
								searchNode.style.display='block';
							}
						},
						end:function(){
							scorllEle.style.opacity=0;
						}
					}
				}else if(arguments.length==3){
				    callback={
						start:function(){
							scorllEle.style.opacity=1;
						},
						move:function(){
							var scorlly = CSS(ulEle,"translateY")*scaleScroll;
							CSS(scorllEle,"translateY",-scorlly)
						},
						end:function(){
							scorllEle.style.opacity=0;
						}
					}
				}/*else{
					callback={
						start:function(){
							scorllEle.style.opacity=1;
						},
						move:function(){
							var scorlly = CSS(ulEle,"translateY")*scaleScroll;
							CSS(scorllEle,"translateY",-scorlly)
						},
						end:function(){
							scorllEle.style.opacity=0;
						}
					}
				}*/
			}
			
			navEle.addEventListener('touchstart',function(ev){
				navEle.isMove=false;   //仿误触
				minY=navEle.clientHeight-ulEle.offsetHeight;
				isF=isY=true;
				//即点即定  为滑动事件对象添加一个属性作为清除定时器的标记
				clearInterval(navEle.cleartime);
				ev= ev || event;
				var touchEle=ev.changedTouches[0];
				ulEle.style.transition='none';    //进来的时候不能有过度效果
				elementY.y=CSS(ulEle,'translateY');  //读取元素的位移位置
				elementY.x=CSS(ulEle,'translateX');  //读取元素的位移位置
				startY.y=touchEle.clientY;           //读取手指的开始位置
				startY.x=touchEle.clientX;           //读取手指的开始位置
				pointDis=0;                       //移动事件结束后重置位移差
				//如果没有传第三个值或第四个参数，次函数都不会报错,有就执行
				if(typeof callback["start"] ==="function"){
					callback["start"]();
				}
			})
			navEle.addEventListener('touchmove',function(ev){
				if(!isY){
					return;
				}
				ev= ev || event;
				var touchEle=ev.changedTouches[0];
				var movePoint={}
				movePoint.y=touchEle.clientY;     //实时获取手指当前位置
				movePoint.x=touchEle.clientX;     //实时获取手指当前位置
				var disY=movePoint.y-startY.y;          //实时获取手指移位差
				var disX=movePoint.x-startY.x;          //实时获取手指移位差
				if(Math.abs(disX)>2 || Math.abs(disY)>2){navEle.isMove=true;}  //是move不是click
				var translateY=elementY.y+disY;  //实时获取元素的位移大小
				var scale=0;
				//处理左边的橡皮筋效果,当用户想向右滑动,将scale控制在0~1之间
				if(translateY>0){
					//把*2去掉可以去除在最左边状态时-先左移动，然后再慢慢向右移动时候产生的回弹小bug
					scale=docHeight/(docHeight*2+translateY);   
					translateY=elementY.y+(disY*scale);
				}else if(translateY<minY){
					//处理右边橡皮筋,当左滑动到极限例-10,如果还想滑动例-20,所以translateY<minY
					//把*2去掉可以去除在最左边状态时-先左移动，然后再慢慢向右移动时候产生的回弹小bug
					scale=docHeight/(docHeight*2+minY - translateY);
					translateY=elementY.y+(disY*scale);
				}
				if(isF){
					isF=false;
					if(Math.abs(disY)<Math.abs(disX)){
						isY=false;
						return
					}
				}
//				调用CSS函数
				CSS(ulEle,"translateY",translateY);
				var timeNow=new Date().getTime();
				//实时获取元素的移动位置
				var pointNow=CSS(ulEle,"translateY");
				timeDis=timeNow-lastTime;
				pointDis=pointNow-lastPoint;
				lastTime=timeNow;
				lastPoint=pointNow;
				//普通滑屏
				if(typeof callback["move"] ==="function"){
					callback["move"]();
				}
			})
			navEle.addEventListener('touchend',function(){
				if(navEle.isMove){
						//最后一次的平均速度,这个speed的值很小,需要乘以一个系数,例如200
					var speed=pointDis/timeDis;   
//					console.log(speed);
					//事件结束时,获取元素最后一次的位置然后加上后补的速度偏移距离
					var target=CSS(ulEle,'translateY')+speed*200;
					//时间不能为负,限制时间过渡不能小于.3
					var time=Math.abs(speed)*.2
					time=time<.3?.3:time;
					var type='Quint';
	//				console.log(time);
	//				var bezer='';
					if(target>0){
						target=0;
						type ="Back";
	//					console.log(111)
	//					ulEle.style.transition='.5s'
	//					bezer="cubic-bezier(.19,1.38,.52,1.32)";
					}else if(target<minY){
						target=minY;
						type ="Back";
	//					console.log(222)
	//					ulEle.style.transition='.5s'
	//					bezer="cubic-bezier(.19,1.38,.52,1.32)";
					}
	//				ulEle.style.transition=time*10+'s'+' '+bezer;
	//				CSS(ulEle,"translateY",target);
					//即点即定函数
					stopMove(target,time,type);
					if(typeof callback["over"] ==="function"){
							callback["over"]();
						}
				}
			})
			
			function stopMove(target,time,type){
				clearInterval(navEle.cleartime);
				var t=0;  //当前次数
				var b=CSS(ulEle,"translateY");   //初始位置
				var c=target-b;                  //结束位置与初始位置之间的差值
				var d=time/0.02;                //总次数  用传进来的时间除以定时器定时时间得到总次数
				var s=3;                        //回弹距离
				navEle.cleartime=setInterval(function(){
					t++;
					if(t>d){
						clearInterval(navEle.cleartime);
						//快速滑屏结束
						if(typeof callback["end"] ==="function"){
							callback["end"]();
						}
					}else{
						var point = Tween[type](t,b,c,d,s);
						CSS(ulEle,"translateY",point);
						//快速滑屏
						if(typeof callback["move"] ==="function"){
							callback["move"]();
						}
					}
				},20)
			}
			document.onmousewheel=fun;
			if(document.addEventListener){
				document.addEventListener('DOMMouseScroll',fun);
			}
			function fun(ev){
//				minY=navEle.clientHeight-ulEle.offsetHeight;
				if(typeof callback["start"] ==="function"){
					callback["start"]();
				}
				ev=ev||event;
				var flag='';
				var add=0;
				var y='translateY';
				if(ev.wheelDelta){
					if(ev.wheelDelta>0){
						flag='up';
						add=-50;
					}else{
						flag='down';
						add=50;
					}
				}else if(ev.detail){
					if(ev.detail>0){
						flag='down';
						add=50;
					}else{
						flag='up';
						add=-50;
					}
				}
				var scorllEleTop=CSS(scorllEle,y)+add;
//				var scale=scorllEleTop/(docHeight-scorllEle.offsetHeight);
				if(scorllEleTop<0){
					scorllEleTop=0
				}else if(scorllEleTop>docHeight-scorllEle.offsetHeight){
					scorllEleTop=docHeight-scorllEle.offsetHeight
				}
				switch(flag){
					case 'up':
						scorllEle.style.opacity=1;
						CSS(scorllEle,y,scorllEleTop)
						ulEle.style.transition='.5s';
						var dist=CSS(scorllEle,y)/(docHeight-scorllEle.offsetHeight)*(ulEle.offsetHeight-navEle.offsetHeight)
//						var dist=-(ulEle.offsetHeight-navEle.offsetHeight)*scale
						CSS(ulEle,y,-dist);
						if(typeof callback["move"] ==="function"){
							callback["move"]();
						}
						ulEle.addEventListener("transitionend",fish);
						ulEle.addEventListener("webkitTransitionEnd",fish);
					break;
					case 'down':
						scorllEle.style.opacity=1;
						CSS(scorllEle,y,scorllEleTop)
						ulEle.style.transition='.5s';
						var dist=CSS(scorllEle,y)/(docHeight-scorllEle.offsetHeight)*(ulEle.offsetHeight-navEle.offsetHeight)
//						var dist=-(ulEle.offsetHeight-navEle.offsetHeight)*scale
						CSS(ulEle,y,-dist);
						if(typeof callback["move"] ==="function"){
							callback["move"]();
						}
						ulEle.addEventListener("transitionend",fish);
						ulEle.addEventListener("webkitTransitionEnd",fish);
					break;
				}
				function fish(){
					ulEle.removeEventListener('transitionend',fish);
					ulEle.removeEventListener('webkitTransitionEnd',fish);
					if(typeof callback["end"] ==="function"){
							callback["end"]();
						}
				}
				if(ev.preventDefault){
					ev.stopPropagation();
					ev.preventDefault();
				}
				return false;
			}
		}
})(window)
