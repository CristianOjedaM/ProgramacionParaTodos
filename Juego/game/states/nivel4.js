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

      //Grupo de items
      this.items = this.game.add.group();
      this.items.enableBody = true;
      this.items.physicsBodyType = Phaser.Physics.P2JS;
      
      this.crearCarro();
  	},

  	update: function(){
       this.items.forEach(function(item) {
        //Se verifican los items para realizar su movimiento en caso de click
        if(item.movimiento == true){
          item.body.velocity.y = 0;//Se retira el movimiento vertical
          item.body.x = mouseX
          item.body.y = mouseY;
        }

        //Se verifica que los items no hayan superado los limites del escenario
        if((item.body.x+item.body.height) > 800){
          item.kill();
        }
      });         
  	},

    crearCarro: function(){
      var carro_1 = this.items.create(-100,455,'Carro');
      carro_1.body.velocity.x = this.vel;
       var carro_2 = this.items.create(-100,395,'Carro');
      carro_1.body.velocity.x = this.vel;
    }
  };

  module.exports = Nivel4;