
  'use strict';
  function Play() {}
  Play.prototype = {
    create: function() {
      this.btns = this.game.add.group();
      this.crearBoton(0,0,'nivel1',0,0);
      this.crearBoton(0,100,'nivel2',0,100);
      this.crearBoton(0,200,'nivel3',0,200);
      this.crearBoton(0,400,'nivel5',0,400);
    },

    update: function() {

    },

    crearBoton: function(x,y,llave,txt_x,txt_y){
      var boton = this.game.add.sprite(x, y,llave,0);
      boton.nivel = llave;
      var anim = boton.animations.add('over', [0,1,2,3,4,5,6], 10, false);
      anim.onComplete.add(function() {
        if(boton.texto){
          boton.texto.revive();
        }else{
          boton.texto = this.game.add.bitmapText(txt_x, txt_y, 'font', 'Algun texto', 24);
        }
      }, this);
      boton.inputEnabled = true;
      boton.events.onInputDown.add(this.clickListener, this);
      boton.events.onInputOver.add(this.over, this);
      boton.events.onInputOut.add(this.out, this);
      this.btns.add(boton);
    },

    clickListener: function(boton) {
      this.game.state.start(boton.nivel);
    },

    over: function(boton){
      boton.animations.play('over');
    },

    out: function(boton){
      boton.frame = 0;
      if(boton.texto){
        boton.texto.kill();
      }
    }
  };
  
  module.exports = Play;