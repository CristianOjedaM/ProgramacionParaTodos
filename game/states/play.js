
  'use strict';
  function Play() {}
  Play.prototype = {
    create: function() {
      this.btns = this.game.add.group();
      this.crearBoton(0,0,'nivel1',195,50,'Hola, aquí aprenderás sobre\nlos tipos de dato básicos de\njavascript. Intentalo!');
      this.crearBoton(0,100,'nivel2',305,150,'Sumérgete en un juego lleno\nde diversión mientras aprendes\na manipular variables. Vamos!');
      this.crearBoton(0,200,'nivel3',205,250,'Prueba tu agilidad y lógica por\nmedio del uso de operadores\nlógicos. Empecemos!');
      this.crearBoton(0,300,'nivel4',310,350,'Preparado?  Conoce, aprende y\nmanipula las estructuras\ncondicionales. Adelante!');
      this.crearBoton(0,400,'nivel5',205,450,'En esta  ocasión tendrás la\noportunidad de aprender sobre\nestructuras cíclicas. Allá vamos!');
      this.crearBoton(0,500,'nivel6',308,550,'Estas listo para probar todos\ntus conocimientos? Es hora de\nempezar a codificar. Vamos!');
    },

    update: function() {

    },

    crearBoton: function(x,y,llave,txt_x,txt_y,txt){
      var boton = this.game.add.sprite(x, y,llave,0);
      boton.nivel = llave;
      var anim = boton.animations.add('over', [0,1,2,3,4,5,6], 10, false);
      anim.onComplete.add(function() {
        if(boton.texto){
          boton.texto.revive();
        }else{
          boton.texto = this.game.add.bitmapText(txt_x, txt_y, 'font', txt, 20);
        }
        boton.texto.anchor.setTo(0,0.5);
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
      boton.animations.stop('over');
      boton.frame = 0;
      if(boton.texto){
        boton.texto.kill();
      }
    }
  };
  
  module.exports = Play;