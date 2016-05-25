function TCLife(){
	this.scaleW = window.innerWidth;
	this.outer = document.querySelector('.films-ul');
}
TCLife.prototype = {
	/**
	* @method init
	* 初始化方法
	*/
	init:function(){
		this.bindSwipe();
	},

	/**
	* @method bindSwipe
	* 电影海报区域滑动事件
	*/
	bindSwipe:function(outer){
		var self = this;
		var scaleW = self.scaleW;
		// var outer = self.outer;
		if(!outer){
			return;
		}
		//ul 与 屏幕宽度之间的 差值
		var initDistance =  scaleW - outer.offsetWidth ;

		var pos = {
			lastX:0 ,  //touchmove时 上段move最后的touches[0].pageX
			currentX:0 , //touchmove时，本段move的初始  touches[0].pageX
			perDiffX:0 , //touchmove 时，本段touchmove的偏移 而不是与touchstart时 的偏移；
			transX:0 , // touchmove时， 与touchstart 时的落手点 的translateX, 即 赋给translateX的值
			viewX:outer.offsetWidth //等于outer.getBoundingClientRect().width
		} ;
		
		//边界值
		var bound = {
			left:0 ,//左边界值
			right:initDistance>0?0:initDistance  //右边界值
		} ;

		var TAG = {
			startTime:0 , //touchstart时的起始时间 && touchmove时，上一段 move的结束时间
			endTime:0 ,  //touchmove时，本段 move的结束时间
			speed:0,   //速度，touchmove时，每段move的 距离除以 每段move的时间
			count:0
		} ;

		//手指按下的处理事件
		var startHandler = function(e){
			$(outer).removeClass('swiper-trans') ;

			TAG.count++;

			pos.lastX = pos.currentX = pos.initX = e.touches[0].pageX ;
			pos.perDiffX = 0 ;//每段move的 手指偏移量 offsetX;start时要清空

			pos.transX = outer.getBoundingClientRect().left ; //transform 的 translateX值

			TAG.startTime = new Date() * 1 ;
			
			pos.lastY = pos.currentY = pos.initY = e.touches[0].pageY; 

		};
		//上下滑动还是 左右滑动
		var swipeDirection = function(x1, x2, y1, y2){
		    var xDis = Math.abs(x1 - x2), yDis = Math.abs(y1 - y2)
	        return xDis >= yDis ? (x1 - x2 > 0 ? 'left' : 'right') : (y1 - y2 > 0 ? 'up' : 'down')
	  	};
		//手指移动的处理事件
		var moveHandler = function(e){

			//计算手指X方向的偏移量
			pos.currentY = e.touches[0].pageY ;
			
			pos.currentX = e.touches[0].pageX ;

			pos.perDiffX = pos.currentX - pos.lastX ;

			pos.lastX = pos.currentX ;

			var str = swipeDirection(pos.initX,pos.currentX,pos.initY,pos.currentY);
			if(str == 'left' || str == 'right'){
				e.preventDefault();
			}

			// touchmove 超过边界，滑动距离 按比率减少，变成弹力效果
			if(pos.transX>=bound.left){
				pos.perDiffX *= 2*self.scaleW/(pos.viewX+pos.transX*100) ;
			}

			if(pos.transX <= bound.right){
				pos.perDiffX *= 2*self.scaleW/(pos.viewX +(bound.right - pos.transX)*100) ;

			}

			pos.transX += pos.perDiffX ;

			$(outer).removeClass('swiper-trans') ;

			// self.outer.style.transform = 'translate('+ pos.transX +'px,0)';
			// self.outer.style.webkitTransform = 'translate('+ pos.transX +'px,0)';
			outer.style.transform = 'translate('+ pos.transX +'px,0)';
			outer.style.webkitTransform = 'translate('+ pos.transX +'px,0)';

			// 计算速度
			TAG.endTime = new Date()*1 ;
			TAG.speed = pos.perDiffX / (TAG.endTime - TAG.startTime)*1000 ;
			TAG.startTime = TAG.endTime ;
		};

		//手指抬起的处理事件
		var endHandler = function(e){
			e.preventDefault();

			TAG.count--;

			if(TAG.count>0){
				return;
			}

			$(outer).addClass('swiper-trans') ;

			if(Math.abs(TAG.speed)>40){
				pos.transX += 0.168*TAG.speed ;
			}
			// touchend,超边界。 回到边界值

			if(pos.transX>=bound.left){
				pos.transX = bound.left ;
			}

			if(pos.transX<=bound.right){
				pos.transX = bound.right ;
			}
			outer.style.transform = 'translate('+pos.transX+'px,0)' ;
			outer.style.webkitTransform = 'translate('+pos.transX+'px,0)' ;

		};


		outer.addEventListener('touchstart', startHandler,false);
		outer.addEventListener('touchmove', moveHandler,false);
		outer.addEventListener('touchend', endHandler,false);
		outer.addEventListener('touchcancel', endHandler,false);
	}




}
$(function(){
	var tclife = new TCLife();
	tclife.init();
});