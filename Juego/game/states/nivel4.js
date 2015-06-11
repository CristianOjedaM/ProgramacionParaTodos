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
      this.crearCarro(this);
  	},

  	update: function(){

  	},

    crearCarro: function(){
      var carro_1 = this.items.create(-100,455,'Carro');
      carro_1.body.velocity.x = this.vel;
       var carro_2 = this.items.create(-100,395,'Carro');
      carro_1.body.velocity.x = this.vel;
    }
  };

  module.exports = Nivel4;