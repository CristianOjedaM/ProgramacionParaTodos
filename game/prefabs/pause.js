
  'use strict';

  // Create our pause panel extending Phaser.Group
  var Pause = function(game, parent){
    Phaser.Group.call(this, game, parent);

    //Se agrega el panel
    this.panel = this.create(this.game.width/2, 10, 'fondoPausa');
    this.panel.fixedToCamera = true;
    this.panel.anchor.setTo(0.5, 0);

    //this.game.onPause.add(enPausa, this);
    this.mensajeGeneral  = this.game.add.sprite(0, 0,'ayudaGeneral',0);
    this.mensajeGeneral.visible = false;
    this.mensajeGeneral.fixedToCamera = true;
    this.cerrarMensaje = this.game.add.sprite((this.game.width - 81),20,'btnCerrar');
    this.cerrarMensaje.fixedToCamera = true;
    this.cerrarMensaje.visible = false;

    //Boton de play o resume
    this.btnPlay = this.game.add.button((this.game.width - 81), -140, 'btnPausa');
    this.btnPlay.fixedToCamera = true;
    this.btnPlay.frame = 0;
    this.add(this.btnPlay);

    //Boton de reiniciar
    this.btnReiniciar = this.game.add.button((this.game.width/2) - 120, 50, 'OpcPausa');
    this.btnReiniciar.fixedToCamera = true;
    this.btnReiniciar.frame = 0;
    this.add(this.btnReiniciar);   

    //Boton de inicio
    this.btnInicio = this.game.add.button((this.game.width/2) -30 , 50, 'OpcPausa');
    this.btnInicio.fixedToCamera = true;
    this.btnInicio.frame = 2;
    this.add(this.btnInicio);

    
    //Boton de ayuda
    this.btnAyuda = this.game.add.button((this.game.width/2) + 60, 50, 'OpcPausa');
    this.btnAyuda.fixedToCamera = true;
    this.btnAyuda.frame = 1;
    this.add(this.btnAyuda);

    
    //Se establece la posicion fuera de los limites de juego
    this.x = 0;
    this.y = -160;
    this.game.input.onDown.add(this.reset,this);
  };

  Pause.prototype = Object.create(Phaser.Group.prototype);
  Pause.constructor = Pause;

  Pause.prototype.show = function(){
    var game_ = this.game;
    var tween = this.game.add.tween(this).to({y:150}, 500, Phaser.Easing.Bounce.Out, true);
    tween.onComplete.add(function(){this.game.paused = true;}, this);
  };
  Pause.prototype.hide = function(){
    this.game.add.tween(this).to({y:-160}, 200, Phaser.Easing.Linear.NONE, true);
  }; 

  Pause.prototype.reset = function(game){
     
      var x1 = (this.game.width/2) - 120;
      var x2 = (this.game.width/2) - 75;
      var y1 = 210; 
      var y2 = 255;
     if(game.x > x1 && game.x < x2 && game.y > y1 && game.y < y2 ){
           //Opcion Reiniciar
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
      }else if(game.x > (this.game.width/2) -30 && game.x < (this.game.width/2) + 15 && game.y > y1 && game.y < y2 ){
          //Opcion Inicio
           if(this.game.paused){
            this.game.paused = false;
            this.hide();                  
            this.game.state.clearCurrentState();
            game.game.state.start("play");
          }
      }else if(game.x > (this.game.width/2) + 60 && game.x < (this.game.width/2) + 105 && game.y > y1 && game.y < y2 ){
          //Opcion ayuda
           if(this.game.paused){
            var frame  = 0;            
              switch(game.game.state.current){
                case 'nivel1':                 
                  frame = 0;
                break;
                case 'nivel1_1':
                  frame = 1;
                break;
                case 'nivel2':
                  frame = 2;
                break;
                case 'nivel3':
                  frame = 3;
                break;
                case 'nivel4':
                  frame = 4;
                break;
                case 'nivel5':
                  frame = 5;
                break;
                case 'nivel6':
                  frame = 6;
                break;
              }              
              this.mensajeGeneral.frame = frame;
              this.mensajeGeneral.visible = true;
              this.cerrarMensaje.visible = true;
           }
      }else if( this.game.paused == true && this.mensajeGeneral != null && this.mensajeGeneral.visible == true && game.x > (this.game.width - 81) && game.x < (this.game.width - 36) && game.y > 20 && game.y < 65 ){
          this.mensajeGeneral.visible=false;
          this.cerrarMensaje.visible=false;
      }
  }; 
 
  module.exports = Pause;