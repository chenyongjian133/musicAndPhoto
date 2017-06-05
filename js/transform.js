//封装变换函数,参1obj,参2变换类型，参3变换值
;(
	function(w){
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
	}
)(window);
