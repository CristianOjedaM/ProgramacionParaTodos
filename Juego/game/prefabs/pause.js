
  'use strict';

  // Create our pause panel extending Phaser.Group
  var Pause = function(game, parent){
    Phaser.Group.call(this, game, parent);

    //Se agrega el panel
    this.panel = this.create(this.game.width/2, 10, 'fondoPausa');
    this.panel.fixedToCamera = true;
    this.panel.anchor.setTo(0.5, 0);

    //this.game.onPause.add(enPausa, this);

    // Add text
    this.pauseText = this.game.add.text(100, 20, 'Juego pausado', { font: '24px calibri', fill: '#000', align:'center'});
    this.pauseText.fixedToCamera = true;
    //this.pauseText = this.game.add.bitmapText(100, 20, 'kenpixelblocks', 'Game paused', 24);
    this.add(this.pauseText);

    //Boton de play o resume
    this.btnPlay = this.game.add.button((this.game.width - 81), 10, 'btnPausa');
    this.btnPlay.fixedToCamera = true;
    this.btnPlay.frame = 0;
    this.add(this.btnPlay);

    //Boton de reinicial
    this.btnReiniciar = this.game.add.button((this.game.width - 130), 10, 'btnPausa');
    this.btnReiniciar.fixedToCamera = true;
    this.btnReiniciar.frame = 0;
    this.add(this.btnReiniciar);

    
    //Se establece la posicion fuera de los limites de juego
    this.x = 0;
    this.y = -100;
    this.game.input.onDown.add(this.pausaJuego,this);
  };

  Pause.prototype = Object.create(Phaser.Group.prototype);
  Pause.constructor = Pause;

  Pause.prototype.show = function(){
    var game_ = this.game;
    var tween = this.game.add.tween(this).to({y:0}, 500, Phaser.Easing.Bounce.Out, true);
    tween.onComplete.add(function(){this.game.paused = true;}, this);
  };
  Pause.prototype.hide = function(){
    this.game.add.tween(this).to({y:-100}, 200, Phaser.Easing.Linear.NONE, true);
  }; 

  Pause.prototype.reset = function(game){
     //this.game.state.getCurrentState().game.state.restart(true);
     this.game.state.clearCurrentState();
     game.state.start(game.state.current);
  };

  Pause.prototype.pausaJuego = function(game){
      var x1 = (this.game.width - 81);
      var x2 = (this.game.width - 36);
      var y1 = 10;
      var y2 = 55;
      if(game.x > x1 && game.x < x2 && game.y > y1 && game.y < y2 ){
        if(this.game.paused == false){
          //Se muestra panel de pausa
          if(this.flagpause==false){
            this.pnlPausa.show();   
            this.flagpause = true;
          }
            
        }else {
          //Se esconde el panel de pausa
          this.game.paused = false;
          this.pnlPausa.hide();
          this.flagpause = false;
        }
      }else if(game.x > (this.game.width - 130) && game.x < (this.game.width - 85) && game.y > y1 && game.y < y2 ){
         //Se esconde el panel de pausa
          if(this.game.paused){
            this.game.paused = false;
            this.pnlPausa.hide();
            this.flagpause = false;      
            this.pnlPausa.reset(this.game);
          }
      }
    };
 
  module.exports = Pause;