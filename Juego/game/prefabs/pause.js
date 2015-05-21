
  'use strict';

  // Create our pause panel extending Phaser.Group
  var Pause = function(game, parent){
    Phaser.Group.call(this, game, parent);

    //Se agrega el panel
    this.panel = this.create(this.game.width/2, 10, 'fondoPausa');
    this.panel.fixedToCamera = true;
    this.panel.anchor.setTo(0.5, 0.5);

    //this.game.onPause.add(enPausa, this);

    // Add text
    this.pauseText = this.game.add.text(100, 20, 'Juego pausado', { font: '24px calibri', fill: '#000', align:'center'});
    this.pauseText.fixedToCamera = true;
    //this.pauseText = this.game.add.bitmapText(100, 20, 'kenpixelblocks', 'Game paused', 24);
    this.add(this.pauseText);

    //Boton de play o resume
    this.btnPlay = this.game.add.button((this.game.width/2)- 81, 0, 'btnPausa');
    this.btnPlay.fixedToCamera = true;
    this.btnPlay.frame = 0;
    this.add(this.btnPlay);

    //Boton de reinicial
    this.btnReiniciar = this.game.add.button((this.game.width/2) - 130, 0, 'btnPausa');
    this.btnReiniciar.fixedToCamera = true;
    this.btnReiniciar.frame = 0;
    this.add(this.btnReiniciar);

    
    //Se establece la posicion fuera de los limites de juego
    this.x = 0;
    this.y = -100;
    this.game.input.onDown.add(this.reset,this);
  };

  Pause.prototype = Object.create(Phaser.Group.prototype);
  Pause.constructor = Pause;

  Pause.prototype.show = function(){
    var game_ = this.game;
    var tween = this.game.add.tween(this).to({y:130}, 500, Phaser.Easing.Bounce.Out, true);
    tween.onComplete.add(function(){this.game.paused = true;}, this);
  };
  Pause.prototype.hide = function(){
    this.game.add.tween(this).to({y:-100}, 200, Phaser.Easing.Linear.NONE, true);
  }; 

  Pause.prototype.reset = function(game){
     
      var x1 = (this.game.width - 130);
      var x2 = (this.game.width - 85);
      var y1 = 10;
      var y2 = 55;
     if(game.x > x1 && game.x < x2 && game.y > y1 && game.y < y2 ){
         //Se esconde el panel de pausa
          if(this.game.paused){
            this.game.paused = false;
            this.hide();                  
            this.game.state.clearCurrentState();
            if(game.game.state.current == "nivel1_1"){
              game.game.state.start("nivel1");
            }else{
              game.game.state.start(game.game.state.current);
            }
          }
      }
  }; 
 
  module.exports = Pause;