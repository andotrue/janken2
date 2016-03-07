//------------------------------------------------------------------------------------------
// jankengame.view.janken

jankengame.global.addPackage("view.janken");

(function() {
	var MultipleLoader = jankengame.base.MultipleLoader;
	var EventDispatcher = jankengame.base.EventDispatcher;
	var MainBase = jankengame.base.MainBase;
	var ViewBase = jankengame.base.ViewBase;
	var Sprite = jankengame.base.Sprite;
	var Tween = jankengame.base.Tween;
	
	var before_aiko_flg = "off";
	
	/****************************** タイトル画面系 ********************/
	 
	/*******************************************************************
	 * タイトル画面 ビュークラス
	 ******************************************************************/
	this.JankenTitle = function(baseScale) {
		this.container = "div.titleContainer";
		
		var scope = this;
		//タイトルとキャラ画像のリサイズ
		$("div.titleContainer h1").css("background-size", (370 * baseScale) + "px " + (431 * baseScale) + "px");
		
		//スタートボタンのイベントセット
		$("div.titleContainer p.btnStart a").bind("click", function() {
			scope.dispatchEvent({type:"clickStart"});
		});
	};
	extend(this.JankenTitle, ViewBase);
	
	/*******************************************************************
	 * プリロード
	 ******************************************************************/
	this.JankenTitle.prototype.loading = function(cb_func) {	
		if (this.isLoaded) {
			cb_func();
		} else {
			
			var scope = this;
			var images = [
				"bg_title.png"
			];
			
			var loader = new MultipleLoader();
			
			for (var i = 0, ln = images.length; i < ln; i++) {
				loader.addImageRequest("images/" + images[i]);
			}
			
			loader.addEventListener("complete", function(args) {
				scope.isLoaded = true;
				scope.loadImages = loader.imageRequests;
				cb_func();
			});
			loader.load();
		}
	};
	
	
	/****************************** ゲーム画面系 ********************/
	 
	
	/*******************************************************************
	 * インジケーター
	 ******************************************************************/
	 this.Indicator = function(baseScale) {
		var scope = this;
		
		$("div.gameContainer p.btnStop a").bind("click", function() {
			scope.dispatchEvent({type:"clickStop"});
		});
	};
	
	extend(this.Indicator, EventDispatcher);
	
	/*******************************************************************
	 * やめるボタンを隠す
	 ******************************************************************/
	this.Indicator.prototype.hideStopBtn = function() {
		$("div.gameContainer p.btnStop").css("display", "none");
	};
	
	/*******************************************************************
	 * 初期化(数値を０にする)
	 ******************************************************************/
	this.Indicator.prototype.reset = function() {
		$("div.gameContainer p.btnStop").css("display", "block");
	};
	 
	/*******************************************************************
	 * じゃんけんUI
	 ******************************************************************/
	 this.JankenNavi = function(baseScale) {
		this.elmName = "div.gameContainer div.jankenContainer";
		
		var scope = this;
		
		var func = function(selIndex) {
			
			$(scope.elmName + " p").each(function(index, element) {
				scope.enabled(false);
				if (index == selIndex) {
					$($(element).find("span")).css("opacity", 1);
				}
			});
			
			scope.dispatchEvent({type:"select", args:{type:selIndex}});
		};
		
		$(this.elmName + " p.iconGoo a").bind("click", function(evt) {
			func(0);
		});
		
		$(this.elmName + " p.iconChoki a").bind("click", function(evt) {
			func(1);
		});
		
		$(this.elmName + " p.iconPar a").bind("click", function(evt) {
			func(2);
		});
	};
	
	extend(this.JankenNavi, EventDispatcher);
	
	/*******************************************************************
	 * ボタン機能オン・オフ切替
	 ******************************************************************/
	this.JankenNavi.prototype.enabled = function(flag) {
		$(this.elmName + " p a").css("display", (flag) ? "block" : "none");
		$(this.elmName + " p span").css("display", (flag) ? "none" : "block");
	};
	
	/*******************************************************************
	 * 初期化
	 ******************************************************************/
	this.JankenNavi.prototype.reset = function() {
		this.enabled(false);
		$(this.elmName + " p span").css("opacity", 0.3);
	};
	
	/*******************************************************************
	 * 表示する
	 ******************************************************************/
	this.JankenNavi.prototype.show = function() {
		$(this.elmName).css("display", "block");
	};
	
	/*******************************************************************
	 * 表示を隠す
	 ******************************************************************/
	this.JankenNavi.prototype.hide = function() {
		$(this.elmName).css("display", "none");
	};
	
	
	/*******************************************************************
	 * 敵のじゃんけんパネルクラス
	 ******************************************************************/
	 this.JankenPanel = function(baseScale) {
		
		this.elmName = "div.gameContainer div.selectIconContainer";
		
		this.element = new Sprite(this.elmName + " div.selectIcon");
		this.reset();
	};
	
	extend(this.JankenPanel, EventDispatcher);
	
	/*******************************************************************
	 * じゃんけん出す
	 * type:0(グー）、1(チョキ）、2(パー）
	 ******************************************************************/ 
	this.JankenPanel.prototype.show = function(enemyIndex, cb_func) {
		var inner = $(this.elmName + " div.selectIcon p");
		
		var cl;
		
		switch(enemyIndex) {
			case 0:
				cl = "goo";
				break;
			case 1:
				cl = "choki";
				break;
			case 2:
				cl = "par";
				break;
			default:break;
		}
		
		inner.attr("class", cl);
		this.element.visible(true);
		this.element.y = window.innerHeight;
		this.element.update();
		
		//Tween.motion(this.element, [ "y" ], [ 100 ], 0.0035, 0, 0.1, function() {
		//Tween.motion(this.element, [ "alpha", "scale" ], [ 5, 5 ], 0.0003, 0.0050, 0.1, function() {
		Tween.motion(this.element, [ "alpha", "scale" ], [ 1, 1 ], 1, 1, 1, function() {
			cb_func();
		});
	};
	
	/*******************************************************************
	 * 初期化
	 ******************************************************************/ 
	this.JankenPanel.prototype.reset = function() {
		this.element.visible(false);
	};
	
	
	/*******************************************************************
	 * テキスト制御クラス
	 ******************************************************************/	 
	this.TextEffect = function(baseScale) {
		this.baseScale = baseScale;
		this.elmName = "div.gameContainer div.textContainer";
		
		this.textJan = new Sprite($(this.elmName + " p.textJan"), { alpha : 0 });
		this.textKen = new Sprite($(this.elmName + " p.textKen"), { alpha : 0 });
		this.textPon = new Sprite($(this.elmName + " p.textPon"), { alpha : 0 });
		
		this.textWin = new Sprite($(this.elmName + " p.textWin"), { alpha : 0 });
		this.textLose = new Sprite($(this.elmName + " p.textLose"), { alpha : 0 });
		this.textAiko = new Sprite($(this.elmName + " p.textAiko"), { alpha : 0 });
		
		this.allText = [
			this.textJan,
			this.textKen,
			this.textPon,
			this.textWin,
			this.textLose,
			this.textAiko
		];
				
		this.reset();
	};
	
	extend(this.TextEffect, EventDispatcher);
	
	/*******************************************************************
	 * じゃんけん前のエフェクト開始
	 ******************************************************************/ 
	this.TextEffect.prototype.startAnim = function(index, cb_func) {
		var scope = this;
		$(this.elmName).css("padding-top", 205);
		
		$(scope.elmName).css("padding-top", 150);
		
		var textJan = scope.textJan;
		var textKen = scope.textKen;
		
		textJan.visible(true);
		textKen.visible(true);
		textJan.scale = 20;
		textJan.update();
		textKen.scale = 20;
		textKen.update();
		
		//spt, prop_array, end_array, sp, cb_func, delay, threshold
		Tween.motion(textJan, [ "alpha", "scale" ], [ 1, 1 ], 0.003, 0, 0.02);
		Tween.motion(textKen, [ "alpha", "scale" ], [ 1, 1 ], 0.003, 5, 0.02, function() {
			cb_func();
		});
	};
	
	/*******************************************************************
	 * じゃんけん後の結果テキスト開始
	 * result : 0:あいこ、1:勝ち、2:負け
	 ******************************************************************/ 
	this.TextEffect.prototype.showJudge = function(result, cb_func) {
		
		var scope = this;
		this.textJan.visible(false);
		this.textKen.visible(false);
		this.textAiko.visible(false);
		
		$(scope.elmName).css("padding-top", 129);
		
		var textPon = scope.textPon;
		textPon.visible(true);
		textPon.scale = 2;
		textPon.update();
		
		console.log("result:" + result);
		if(before_aiko_flg != undefined) {
			console.log("before_aiko_flg:" + before_aiko_flg);
		}
		if (result == 0) {
			if (!isset( before_aiko_flg ) || before_aiko_flg == "on") {
				sayPepper("shoaiko");
			}
			else{
				sayPepper("ponaiko");
			}
		} else {
			if (!isset( before_aiko_flg ) || before_aiko_flg == "on") {
				sayPepper("sho");
			}
			else{
				sayPepper("pon");
			}
		}
		//return;//グー・チョキ・パー表示で止める
		
		Tween.motion(textPon, [ "alpha", "scale" ], [ 1, 1 ], 0.012, 0, 0.002, function() {
			//return;//ぽんで止める
			Tween.delay(textPon, 60, function() {
				
				textPon.visible(false);
				
				//勝敗を表示
				var text0;
				
				switch(result) {
					case 0:
						text0 = scope.textAiko;
						break;
					case 1:
						text0 = scope.textWin;
						break;
					case 2:
						text0 = scope.textLose;
						break;
					default:break;
				}
				
				text0.visible(true);
				
				if (result == 0) {
					//あいこの場合は再戦の画面へ
					text0.alpha = 0;
					text0.scale = 10;
					text0.update();
					
					$(scope.elmName).css("padding-top", 205);
					Tween.motion(text0, [ "alpha", "scale" ], [ 1, 1 ], 0.012, 0, 0.02);
					
					cb_func();
					
					before_aiko_flg = "on";
				} else {
					//勝ち・負け
					text0.y = -30;
					text0.alpha = 0;
					text0.update();
					
					Tween.motion(text0, [ "alpha", "y" ], [ 1, 0 ], 0.003, 0, 0.001, function() {
						//return;//勝ち負け結果表示で止める
						Tween.delay(text0, 100, function() {
							//return;
							Tween.fadeOut(text0, 0.1, function() {
								cb_func();
							});
						});
					});
					before_aiko_flg = "off";
				}
			});
		});
	};
	
	/*******************************************************************
	 * 初期化
	 ******************************************************************/ 
	this.TextEffect.prototype.reset = function() {
		$(this.elmName + " p").css("display", "none");
		
		for (var i = 0, ln = this.allText.length; i < ln; i++) {
			var text = this.allText[i];
			text.deleteEnterFrame();
			text.alpha = 0;
			text.x = 0;
			text.y = 0;
			text.scale = 1;
			text.update();
			text.visible(false);
		}
		
		$(this.elmName).css("padding-top", 249);
	};
	
	var Indicator = this.Indicator;
	var JankenNavi = this.JankenNavi;
	var JankenPanel = this.JankenPanel;
	var Character = this.Character;
	var TextEffect = this.TextEffect;
	
	/*******************************************************************
	 * ゲーム画面 ビュークラス
	 ******************************************************************/
	 this.JankenGame = function(baseScale) {
		this.container = "div.gameContainer";
		
		//じゃんけんUIの位置調整(下付け)
		var h = window.innerHeight / baseScale;
		$("div.jankenContainer").css("top", h - 150);
		
		//何回戦かのインデックス(0～2)
		this.currentBattleIndex;
		
		//UIクラス
		this.indicator = new Indicator(baseScale);
		this.jankenNavi = new JankenNavi(baseScale);
		this.jankenPanel = new JankenPanel(baseScale);
		this.textEffect = new TextEffect(baseScale);
		
		var scope = this;
		
		//イベントセット
		this.jankenNavi.addEventListener("select", function(args) {
			scope.selectJanken(args.type);
		});

		//イベントセット
		$("div.gameContainer p.btnAgain a").bind("click", function() {
			scope.dispatchEvent({type:"backTop"});
		});
		
		this.indicator.addEventListener("clickStop", function(args) {
			scope.dispatchEvent({type:"backTop"});
		});
		
	};

	extend(this.JankenGame, ViewBase);
	
	/*******************************************************************
	 * 初期化
	 ******************************************************************/ 
	this.JankenGame.prototype.reset = function() {
		$(this.container).css("display", "block");
		this.currentBattleIndex = 0;
		
		$("div.clearContainer").css("display", "none");
		$("div.gameOverContainer").css("display", "none");
		$("div.bgGameOver").css("display", "none");
	};
	
	/*******************************************************************
	 * プリロード
	 ******************************************************************/ 
	this.JankenGame.prototype.loading = function(cb_func) {
		if (this.isLoaded) {
			cb_func();
		} else {
			var scope = this;
			var loader = new MultipleLoader();
			
			scope.isLoaded = true;
			scope.loadImages = loader.imageRequests;
			cb_func();
		}
	};
	
	/*******************************************************************
	 * ゲーム開始
	 ******************************************************************/ 
	this.JankenGame.prototype.show = function() {
		this.reset();
		this.startJanken(0);
	};
	
	/*******************************************************************
	 * コンテンツ隠す(処理の停止)
	 ******************************************************************/ 
	this.JankenGame.prototype.hide = function(cb_func) {
		this.indicator.reset();
		this.jankenNavi.reset();
		this.jankenPanel.reset();
		this.textEffect.reset();
		
		$(this.container).css("display", "none");
		cb_func();
	};
	
	/*******************************************************************
	 * じゃんけん開始
	 * index : 0 - 2 (1回戦～3回戦）
	 ******************************************************************/ 
	this.JankenGame.prototype.startJanken = function(index) {
		var scope = this;
		
		//sayPepper("jan");
		sayPepper("janken");
		
		scope.textEffect.startAnim(index, function() {
			//sayPepper("ken");
			scope.jankenNavi.enabled(true);//けん
		});
	};
	
	/*******************************************************************
	 * じゃんけん選択時(ポン！)
	 * type : 0 - 2 (グー・チョキ・パー）
	 ******************************************************************/ 
	this.JankenGame.prototype.selectJanken = function(type) {
		var scope = this;
		
		var enemyIndex = Math.round(Math.random() * 2);
		
		//テスト用で敵はずっとグーを出す
		enemyIndex = 0;
		
		//結果（0:あいこ、1:勝ち、2:負け）
		//var result = 0;
		
		if (type == enemyIndex) {
			//あいこ
			result = 0;
		} else if (((type == 0) && (enemyIndex == 1)) ||	//グー　(敵)チョキ
							 ((type == 1) && (enemyIndex == 2)) ||	//チョキ　(敵)パー
							 ((type == 2) && (enemyIndex == 0))) {	//パー　(敵)グー
			//勝ち
			result = 1;
		} else {
			//負け
			result = 2;
		}
		
		this.textEffect.showJudge(result, function() {
			scope.jankenPanel.reset();
			scope.jankenNavi.reset();
			
			switch(result) {
				case 0:
					//あいこ
					scope.jankenNavi.enabled(true);
					break;
				case 1:
					//勝ち
					scope.textEffect.reset();
					
					if (++scope.currentBattleIndex >= 1) {//____1勝でゲームクリア
					//if (++scope.currentBattleIndex >= 3) {//____3勝でゲームクリア
						console.log("ゲームクリア!");
						//tabletDebugMessage("ゲームクリア!");
						/*
						//ポイント加算処理
						console.log("ゲームクリア　-ポイント加算start- ");
						var xmlHttp;
						xmlHttp = new XMLHttpRequest();
						xmlHttp.open("GET", "./newClear?clearPoint=10", true);
						xmlHttp.send(null);
						console.log("ゲームクリア　-ポイント加算end- ");
						*/
						
						//$("div.charaContainer").css("display", "none");
						$("div.clearContainer").css("display", "block");
						//scope.finalButtonContainerVisible(true);
						
						//scope.indicator.hideStopBtn();//____☓ボタンを隠さない
						
						sayPepper('win');
					} else {
						//次の対戦へ
						scope.startJanken(scope.currentBattleIndex);
					}
					break;
				case 2:
					console.log("ざんねんでしたー");

					//負け
					$("div.gameOverContainer").css("display", "block");
					$("div.bgGameOver").css("display", "block");
					//scope.indicator.hideStopBtn();

					sayPepper('lose');

					break;
				default:break;
			}
		});
		
		this.jankenPanel.show(enemyIndex, function() {
			
		});
	};

	var JankenTitle = this.JankenTitle;
	var JankenGame = this.JankenGame;
	
	/****************************** 共通処理系********************/
	
	/*******************************************************************
	 * メインクラス
	 ******************************************************************/
	 this.JankenMain = function(baseScale) {
		this.__super__(400);
		
		//背景画像
		this.fitScreenImage($("body"), 360, 225);
		
		//ビュークラス
		this.titleView = new JankenTitle(this.baseScale);
		this.gameView = new JankenGame(this.baseScale);
		
		var scope = this;
		
		this.titleView.addEventListener("clickStart", function(args) {
			scope.changeView(scope.gameView);
		});
		
		this.gameView.addEventListener("backTop", function(args) {
			scope.changeView(scope.titleView);
		});
		
		this.currentView = this.titleView;
		
		var scope = this;
		
		$("div.titleContainer p.btnStart a").trigger("click");//________________クリックイベントの発生

	};
	
	extend(this.JankenMain, MainBase);
	
}).apply(jankengame.view.janken);

/*******************************************************************
 * 
 ******************************************************************/ 
jankengame.complete = function() {
	new jankengame.view.janken.JankenMain();
};

