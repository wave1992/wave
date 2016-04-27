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
	bindSwipe:function(){
		var self = this;
		var scaleW = self.scaleW;
		var outer = self.outer;
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
			speed:0   //速度，touchmove时，每段move的 距离除以 每段move的时间
		} ;

		//手指按下的处理事件
		var startHandler = function(e){
			$(outer).removeClass('swiper-trans') ;

			pos.lastX = pos.currentX = e.touches[0].pageX ;
			pos.perDiffX = 0 ;//每段move的 手指偏移量 offsetX;start时要清空

			pos.transX = outer.getBoundingClientRect().left ; //transform 的 translateX值

			TAG.startTime = new Date() * 1 ;
		};

		//手指移动的处理事件
		var moveHandler = function(e){
			//兼容chrome android，阻止浏览器默认行为
			e.preventDefault();
			//计算手指的偏移量

			pos.currentX = e.touches[0].pageX ;

			pos.perDiffX = pos.currentX - pos.lastX ;

			pos.lastX = pos.currentX ;

			

			// touchmove 超过边界，滑动距离 按比率减少，变成弹力效果
			if(pos.transX>=bound.left){
				pos.perDiffX *= 2*self.scaleW/(pos.viewX+pos.transX*100) ;
			}

			if(pos.transX <= bound.right){
				pos.perDiffX *= 2*self.scaleW/(pos.viewX +(bound.right - pos.transX)*100) ;

			}

			pos.transX += pos.perDiffX ;

			self.outer.style.webkitTransform = 'translateX('+ pos.transX +'px)';

			// 计算速度
			TAG.endTime = new Date()*1 ;
			TAG.speed = pos.perDiffX / (TAG.endTime - TAG.startTime)*1000 ;
			TAG.startTime = TAG.endTime ;
		};

		//手指抬起的处理事件
		var endHandler = function(e){
			e.preventDefault();
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

			outer.style.transform = 'translateX('+pos.transX+'px)' ;
			
		};
		outer.addEventListener('touchstart', startHandler,false);
		outer.addEventListener('touchmove', moveHandler,false);
		outer.addEventListener('touchend', endHandler,false);
		outer.addEventListener('touchcancel', endHandler,false);
	},




}
$(function(){
	var tclife = new TCLife();
	tclife.init();
});