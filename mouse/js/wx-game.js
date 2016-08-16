// 模板
var tmpl = {
	'director':function(score){
		return{
			'title':'小编提示',
			'cxt':'您获得了'+score+'分<br />去58APP参与游戏吧<br />悄悄告诉亲，100%中奖噢~',
			'btnHtml':'<span class="btn2 btn-goapp">去58APP玩</span>'
					+'<span class="btn2 btn-visitor">继续游戏</span>'
		}
		
	},
	'noplay':{
		'title':'小编提示',
		'cxt':'请在竖屏模式玩噢~',
	},
	'wrong':{
		'title':'小编提示',
		'cxt':'提交失败'
		// 'btnHtml':'<p class="btn btn-goapp">去58APP玩</p>'
	}
}	

// 图片根路径
var imgRoot = './img'

// 预加载资源
var preImgArr = [
		imgRoot +'/sky_bg.jpg?cachevers=1',
		imgRoot +'/control_box.jpg?cachevers=1',
		imgRoot +'/line_box1.jpg?cachevers=1',
		imgRoot +'/line_box2.jpg?cachevers=1',
		imgRoot +'/line_box3.jpg?cachevers=1',
		imgRoot +'/line_box4.jpg?cachevers=1',
		imgRoot +'/wood.png?cachevers=1',
		imgRoot +'/hole.png?cachevers=1',
		imgRoot +'/s_mouse.png?cachevers=1',
		imgRoot +'/star_mouse.gif?cachevers=2',
		imgRoot +'/score_frame.gif?cachevers=1',
		imgRoot +'/show_frame.png?cachevers=1',
		imgRoot +'/time_frame.png?cachevers=1',
		imgRoot +'/icon_left.png?cachevers=1',
		imgRoot +'/icon_plus.png?cachevers=1',
		imgRoot +'/icon_right.png?cachevers=1',
		imgRoot +'/sound.png?cachevers=1',
		imgRoot +'/no_sound.png?cachevers=1',
		imgRoot +'/dialog_bg.png?cachevers=1',
		imgRoot +'/dialog_btn.png?cachevers=1',
		imgRoot +'/dialog_title.png?cachevers=1',
		imgRoot +'/dialog_close.png?cachevers=1'
];

// 预加载方法
function loading(){
	var percent = 0,
		count = 0,
		sourLen = preImgArr.length,
		pDom = document.getElementById('sourInit');

	for(var i = 0; i < sourLen; i++){
		
		var img = new Image();
		img.src = preImgArr[i];
		(function(i){
			img.onload = function(){
				count ++;
				percent = Math.floor(count*100/sourLen);
				pDom.innerHTML = percent + '%';
			}
		})(i);
	}
}

//横屏不能玩
function heng(){
	var evt = "onorientationchange" in window ? "orientationchange" : "resize";
	$(window).on(evt, function(e) {

		var state = Math.abs(window.orientation) ;
		var $tips = $('body').find('.noplay-tips');
		var $cover = $('.cover');
		if(state == 90){

			if($tips.length == 0){
				var noplay = '<div class="noplay-tips" >请竖屏模式玩噢~</div>';
				$('body').append(noplay);
			}
			$tips.show();
			$cover.show();
		}else{
			$tips.hide();
			$cover.hide();
		}
	});
}


// document ready
$(function(){

	heng();
	
	var screenHeight = screen.height;

	if(screenHeight <= 480){
		$('html').addClass('min-page');
	}

	loading();
})

/**
* perNum 		每波出现几只老鼠、
* gap 			每波老鼠出现的时间间隔 普通速度
* fastGap 		大波老鼠出现的时间间隔 快速  min 1000
* rangeTime 	大波老鼠出现的临界时间
* gameTime  	游戏时间
* showTime  	地鼠展示时间 普通速度
* fastShowTime  地鼠展示时间 快速
*/
window.onload = function(){
	var game = new Game({
		// 'pNum':2,//现在写死
		// 'pFNum':3, //现在写死
		'gap':1000,

		'fastGap':1000,
		// 'fastGap':500,

		'rangeTime':10,
		// 'rangeTime':6,
		'gameTime':30,
	
		'showTime':1000,

		'fastShowTime':1500

	});


	//隐藏预加载层
	$('.init-show').hide();

	//展示开始遮罩层
	var $startBox =  $('.start-box');
	$startBox.show();
	
	//pageEvnet绑定
	pageEvent(game);

	$('.game-start').on('tap',function(){

		// console.log('play 按钮点击');

		var $this = $(this);

		var flag = $this.data('send') == 'yes';
		// alert(flag);

		// 是否点开始按钮
		if(!flag){

			$this.data('send','yes');


			// 去掉遮罩层

			$startBox.hide();

			setTimeout(function(){
				game.init();

				$this.data('send','')

			},'1000')
		}

		
	});

	
	// 播放游戏铃声
	ling();

	

	
}

/*
* @method MathFloor
* 文案随机数
* @param {Number} y 几条文案
*/ 

function MathFloor(y,x){
	var x = x > 0 ? x:0;
	var num = Math.floor(Math.random()*y+x);
	return num;
}


// 分享文案方法

function shareCxtFn(score){

	var ran = MathFloor(7);
	var shareCxtArr = [
						'费了九牛二虎之力,得了'+score+'分，敢来跟我PK吗？',
						'用尽平生所学,得了'+score+'分，敢来跟我PK吗？',
						'挖了下鼻孔,得了'+score+'分，敢来跟我PK吗？',
						'挥了挥衣袖,得了'+score+'分，敢来跟我PK吗？',
						'仰望了下天空,得了'+score+'分，敢来跟我PK吗？',
						'用吃奶得劲儿,得了'+score+'分，敢来跟我PK吗？',
						'打了个响嗝,得了'+score+'分，敢来跟我PK吗？',
						'打地鼠就能赢iPhone6s，这么好的事儿还不快来！'
					];
	var shareCxt = score == 0?shareCxtArr[7]:shareCxtArr[ran];
	return shareCxt;

}

// 播放音乐

function ling(){
	
	var bgling = $('.bg-sound')[0];

	// bgling.play();
	bgling.pause();

	// if(bgling.paused){

		scope.soundFlag = false;
		$('.sound')[0].className = 'sound no-sound';
	// }
	
}

// 全局用
var scope = {

	'score': 0,
	'rScore':$('.score'),
	'rHighScore':$('.highscore .inside'),
	'soundFlag':true
}
// 全局提示
var tips = {
	'notWifi':'',
	'breaks':'当前网络不太好，休息一会吧~'
}




function Game(config){
	this.score = 0;   //得分
	this.highScore = 0; //最高分

	this.time = config['gameTime']||30; //游戏时间
	this.totalTime = this.time;
	this.rangeTime = config['rangeTime']||20; //大波老鼠的临界时间
	this.showTime = config['showTime']||1500; //每只地鼠展示时间   单位:ms
	this.fastShowTime = config['fastShowTime']||1000;

	this.pNum = config['pNum']||1; //每次出现几只老鼠
	this.pFNum = config['pFNum']||3;
	// this.gap = 1000/this.num || 1000;//出现地鼠的时间间隔  单位:ms
	this.gap = config['gap']||2000;//出现一波地鼠的时间间隔  单位:ms
	this.fastGap = config['fastGap']||1000;
	this.percent = '100%';
	this.bufferTime = this.rangeTime - 2;

}

Game.prototype = {
		init: function(){
			scope.rScore.html(0);
			scope.score = 0;
			this.timeBox = $('.time'); //倒计时盒子
			// this.bgSound = $('.bg-sound')[0]; //背景音频
			this.hit = $('.hit-sound')[0]; //打中音频
			this.mouse = $('.mouse');
			// this.soundState = localStorage.getItem('soundState')=='no'?false:true; //音频状态

			this.supportWebkit = this.timeBox[0].style['WebkitTransitionProperty'] !== undefined;//是否支持webkitransition属性

			this.clickTimes = 0; //点击次数
			this.status = 'slow' //初始化速度标识

			this.preFn();
			this.timeCount();
			this.setMaxScore();
			this.events();
		},
		/**
		* @method preFn
		* 预先判断
		*/
		preFn:function(){
			
			this.start();
		},
		/**
		* @method randomMouse
		* 生成老鼠,去重&&去掉正在展示中的老鼠
		* @param {Number||String} num 每波老鼠多少只
		*/
		randomMouse:function(){

			var newArr = []; //地鼠index数组
			var flagArr = []; //标识数组
			var _this = this;

			var range = _this.status == 'fast';

			//此处num 可取配置项里的 pNum
			var num = range?Math.floor(Math.random() * 2+5):Math.floor(Math.random() * 3+1);

			for(var i = 0; newArr.length < num ; i++){
				toArr();
			}

			function toArr(){
				var ran = Math.floor(Math.random() * 9);

				($('.mouse').eq(ran).hasClass('s-mouse')) && (flagArr[ran] = true);

				//去重&&去占坑
				if(flagArr[ran]){
					return;
				}
				newArr.push(ran);
				flagArr[ran] = true;
			}
			return newArr;
		},
		/**
		* 每隔一段时间出现一波老鼠
		* @param {Number} gap 每波老鼠出现的时间间隔
		* @param {Number} rangeTime 大波老鼠出现的临界时间
		* @param {Number} num 	每波出现几只老鼠
		* @param {String} range 边界调用方法标识位
		*/
		mouseUp:function(){
			

			var _this = this;
			var mouseArr = _this.randomMouse();
			// var mouseArr = ?_this.randomMouse(num,range): _this.randomMouse(num);

			up();

			if(_this.status == 'slow'){
				
				setTimeout(function(){
					// console.log("GAME:setInterval:mouseUpTimer") ;
					down(_this.gap);
				},_this.showTime);

			}else{

				setTimeout(function(){
					// console.log("GAME:setInterval:mouseUpTimer") ;
					down(_this.fastGap);
				},_this.fastShowTime);
			}
			

			function up(){
				
				for(var i = 0; i<mouseArr.length; i++){
					//show老鼠
					var index = mouseArr[i],
						curMouse = $('.mouse').get(index);

					curMouse.className = "mouse s-mouse";
					
				}
			}

			function down(gap){
				for(var i = 0; i<mouseArr.length; i++){
					var index = mouseArr[i] ;
				
					var curMouse = $('.mouse').get(index),
						$mouse = $('.mouse').eq(index),
						isHit =$mouse.hasClass('star-mouse');

					curMouse.className = isHit?"mouse e-mouse-star":"mouse e-mouse";

					// 清空地鼠+10状态,清除洞的动画
					$mouse.data('over','');
					$mouse.parents('.hole-box').removeClass('shake-ani');
				}

				if(_this.status == "timeout"){
					return ;
				}

				setTimeout(function(){
					_this.mouseUp() ;
				},gap) ;
			}


			
		},
		
		
		/**
		* @method start
		* 开始游戏
		* 依次判断 是否登录、游戏次数、游戏规则弹窗展示
		*/
		start:function(){
	
			this.mouseUp();
		},
		
		/**
		* @method setScore
		* 增加分数
		* @param {Number} score 分数
		*/
		setScore:function(score){
			var $score  = $('.score');
			$score.html(score);
		},
		/**
		* @method events
		* 事件
		*/
		events:function(){
			var _this = this;
			
			$('.mouse').on('touchstart',function(e){
				if(e.touches.length > 1){
					return;
				}
				var $this = $(this),
					ok = $this.hasClass('s-mouse') && ($this.data('over') != 'y');
				if(ok){
					var sel = $this.parents('.hole-box').find('.icon-plus'),
						$score = scope.rScore,
						newScore = parseInt($score.html())+10;

					sel.show();

					scope.soundFlag && _this.hit.play();

					$this.addClass('star-mouse').data('over','y');
					$this.parents('.hole-box').addClass('shake-ani');

					_this.showPlusAni(sel);
					_this.setScore(newScore);

					scope.score = newScore;
				}
			});

			$('.dialog .close').on('tap',function(){
				hideDialog('.dialog');
			})
			

		},
		/**
		* @method setMaxScore
		* 初始化最高分
		*/
		setMaxScore:function(){
			
			var maxScore = parseInt(localStorage.getItem('maxScore'));
			var record = maxScore?maxScore:0;
			$('.highscore .inside').html(record);
		},
		/**
		* @method maxScore
		* 计算最高分
		*/
		maxScore:function(){
			var maxScore = parseInt(localStorage.getItem('maxScore'));
			var curScore = parseInt(scope.rScore.html());
			if(maxScore && maxScore >= curScore){
				return;
			}
			localStorage.setItem('maxScore',curScore);
			$('.highscore .inside').html(curScore);
		},
		/**
		* @method showPlusAni
		* 加分动画
		* @param sel 动画目标jq选择器
		*/
		showPlusAni:function(sel){
			var dom = sel[0],
				has = sel.hasClass('icon-plus-ani');
				flag = false;
			if(!has){
				clearTimeout(timer);
				var timer = setTimeout(function(){
		    		dom.className += " icon-plus-ani";
		    	},100);

		    	
		    	if(this.supportWebkit){
		    		dom.addEventListener('webkitTransitionEnd', function(){
			    		dom.style.display = "none";
			    		dom.className = "icon-plus";
			    	}, false);
		    	}else{
		    		dom.addEventListener('transitionend', function(){
			    		dom.style.display = "none";
			    		dom.className = "icon-plus";
			    	}, false);
		    	}
			}
		},
		gameover:function(){
			var _this = this;
	        		var maxStr = scope.rHighScore.html();
	        	
	        			setTimeout(function(){
	        				
	        				showDialog('.tc',tmpl.director(scope.score)) ;
	        				_this.maxScore();

	        			},1000)
	        			
	        		
		},
		/**
		* @method timeBar
		* 时间进度条
		*/
		timeBar:function(curtime){
			// console.log('timeBar');
			var _this = this;
			var $bar = $('.progress-bar');
			_this.percent = Math.floor(curtime * 100/_this.totalTime) + '%';
			$bar[0].style.width = _this.percent;
			var timeStr = '00:'+(curtime>=10?curtime:'0'+curtime);
			_this.timeBox.html(timeStr);
		},
		/**
		* @method timeCount
		* 倒计时
		*/
		timeCount:function(){

			var _this = this,
				rangeTime = _this.rangeTime,
				curtime = _this.time,
				bufferTime  = _this.bufferTime;


			clearInterval(_this.timeInterval);
			
			_this.timeInterval = setInterval(function(){

					curtime--;

					//时间进度条
					_this.timeBar(curtime);

					
					//临界时间
					if(curtime == rangeTime){

						$('.attention').show();
						
					}

					if(curtime == bufferTime ){

						$('.attention').hide();
						_this.status = 'fast';
					}
				
					// 结束时间
					if (curtime == 0){

						_this.status = "timeout";

				        clearInterval(_this.timeInterval);

				        setTimeout(function(){
				        	_this.gameover();
				        },1200);

						
				    }

			    
			},1000)
			
		}
		
			
}




/**
* @method isWifi
* 是否wifi环境
*/
// function isWifi(){
// 	var	netStr = getCookie('apn').toLowerCase(),
// 		isWifi = /wifi/.test(netStr);
// 	if(!isWifi){
// 		WBAPP.toastMsg(tips.notWifi);
// 	}
// }



/**
* @method pageEvent
* 页面事件绑定
*/

function pageEvent(game){
	var $dialog = $('.dialog');


	// 关闭弹层，显示开始按钮
	$('.dialog .close').on('tap',function(){
	 	
		hideDialog('.dialog');

		$('.start-box').show();
		
		
	});
	

	
	// 继续游戏

	$('.dialog').on('touchend','.btn-visitor',function(){


		hideDialog('.dialog');
		setTimeout(function(){

			game.init();

		},1000);

	});


	// 弹层 阻止滚动
	// $dialog.on('touchmove',function(e){
	// 	e.preventDefault();
	// });
	// $('body').on('touchmove','.cover,.start-box',function(e){
	// 	e.preventDefault();
	// });
	$('body').on('touchmove',function(e){
		e.preventDefault();
	})

	//声音按钮点击事件
	$('body').on('tap','.sound',function(){

		var $bgSound = $('.bg-sound');
				//暂停  TO  播放
			if($bgSound[0].paused){
				$bgSound[0].play();
				this.className = 'sound';
				scope.soundFlag = true;

			}else{
			// 播放 TO 暂停
				
				scope.soundFlag = false;
				$bgSound[0].pause();
				this.className = 'sound no-sound';
			}
		});

}
/**
* @method createDialog
* 创建对话框到页面
*/
function createDialog(config){

	var title = config['title']||'',
		cxt = config['cxt']||'',
		btnHtml = config['btnHtml']||'',
		imgHtml = config['imgHtml']||'';
	$('.title').html(title);
	$('.dia-img').html(imgHtml);
	$('.cxt').html(cxt);
	$('.btn-box').html(btnHtml)
}
/**
* @method showDialog
* 显示dialog
*/
function showDialog(sel,config){

	// 隐藏 开始浮层

	var $startBox = $('.start-box');
	$startBox.hide();

	// 恢复进度条

	$('.progress-bar')[0].style.width = "100%";

	createDialog(config);
	$(sel).show();
	$('.cover').show();
}
/**
* @method hideDialog
* 隐藏dialog
*/
function hideDialog(sel){
	$(sel).hide();
	$('.cover').hide();
}
/**
* @method getCookie
* 获取cookie
* @param {String} c_name key值
*/
function getCookie(c_name){
	if (document.cookie.length>0){
    c_start=document.cookie.indexOf(c_name + "=")
	    if (c_start!=-1){ 
	   		c_start=c_start + c_name.length+1 ;
	    	c_end=document.cookie.indexOf(";",c_start);
	    	if (c_end==-1) {
	    		c_end=document.cookie.length;
	    	}
	    	return unescape(document.cookie.substring(c_start,c_end))
	   	} 
	}
	return ""
}
