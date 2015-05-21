
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

    

    //Se establece la posicion fuera de los limites de juego
    this.x = 0;
    this.y = -100;
  };

  Pause.prototype = Object.create(Phaser.Group.prototype);
  Pause.constructor = Pause;

  Pause.prototype.show = function(){
    var game_ = this.game;
    var tween = this.game.add.tween(this).to({y:this.game.height/2}, 500, Phaser.Easing.Bounce.Out, true);
    tween.onComplete.add(function(){this.game.paused = true;}, this);
  };
  Pause.prototype.hide = function(){
    this.game.add.tween(this).to({y:-100}, 200, Phaser.Easing.Linear.NONE, true);
  }; 

  module.exports = Pause;