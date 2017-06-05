;(function(w){
	w.$=Object.create(null);
	w.$.guesture=function(node,callback){
		var hasStart=false;
		var scaleS=0,rotateS=0;
		CSS(node,'translateZ',.01);
		node.addEventListener('touchstart',function(ev){
			hasStart=false;
			/*
			touches 当前屏幕上的手指列表
			targetTouches 当前元素上的手指列表
			changedTouches 触发当前事件的手指列表
			*/
			ev=ev||event;
			var touchC=ev.touches;
			if(touchC.length>=2){
				hasStart=true;
				scaleS=getC(touchC[0],touchC[1]);
				rotateS=getDeg(touchC[0],touchC[1]);
				if(callback&&callback['start']==='function'){
					callback['start'].call(this,ev);
				}
			}
		});
		node.addEventListener('touchmove',function(ev){
			ev=ev||event;
			var touchC=ev.touches;
			if(hasStart&&touchC.length>=2){
				var scaleM=getC(touchC[0],touchC[1]);
				var rotateM=getDeg(touchC[0],touchC[1]);
				ev.scale=scaleM/rotateM;
				//安卓有个小问题 （考虑一下身体极限 0-60deg）
				ev.rotation=rotateM-rotateS;
				if(callback&&callback['change']==='function'){
					callback['change'].call(this,ev);
				}
			}
		});
		node.addEventListener('touchend',function(ev){
			ev=ev||event;
			var touchC=ev.touches;
			if(hasStart&&touchC<2){
				if(callback&&callback['end']==='function'){
					callback['end'].call(this,ev);
				}
			}
		});
		/*
		勾股定理:
			斜边的平方 = 直角边1的平方 + 直角边2的平方; 

		正切：
			在直角三角形中 对边和临边比值

			Math.atan2();	
				对于任意不同时等于0的实参数x和y，atan2(y,x)所表达的意思是坐标原点为起点，
				指向(x,y)的射线在坐标平面上与x轴正方向之间的角的角度。
				当y>0时，射线与x轴正方向的所得的角的角度指的是x轴正方向绕逆时针方向到达射线旋转的角的角度；
				而当y<0时，射线与x轴正方向所得的角的角度指的是x轴正方向绕顺时针方向达到射线旋转的角的角度
		*/
		function getC(p1,p2){
			var a=p1.clientY-p2.clientY;
			var b=p1.clientX-p2.clientX;
			return Math.sqrt(a*a+b*b)
		}
		function getDeg(p1,p2){
			var a = p1.clientY - p2.clientY;
			var b = p1.clientX - p2.clientX;
			return Math.atan2(a,b)*180/Math.PI;
		}
	}
})(window)
