 'use strict';
 var Pausa = require('../prefabs/pause');


  function Nivel4() {}
  Nivel4.prototype = {
    vel:50,//Velocidad de inicio para movimiento de items
  	create: function() {
      //Habilitacion de fisicas
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
	    this.game.world.setBounds(0, 0, 800, 600);
      //Fondo de juego
      this.game.add.tileSprite(0, 0,800,600, 'Fondo4');
  	},

  	update: function(){

  	},

    crearCarro: function(){
      var carro = this.items.create(-100,550,'Carro');
      carro.body.velocity.x = this.vel;
    }
  };

  module.exports = Nivel4;