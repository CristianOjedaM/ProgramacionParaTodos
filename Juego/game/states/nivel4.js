 'use strict';
 var Pausa = require('../prefabs/pause');
 var Situacion = 
  [{
    "condiciones": ['estampida.pasando() == true','estampida.pasando() == false','estampida.pasando()<=true'],
    "acciones" :  ['cruzar();','saltar();','esperar();','hablar();','disparar();']
  },
  {
    "condiciones": ['obstaculo.distancia => 50','obstaculo.distancia <= 50','obstaculo.distancia == 51'],
    "acciones" :  ['saltar();','esperar();','correr();','nadar();','arrastrar();']
  }];

  function Nivel4() {}
  Nivel4.prototype = {
    vel:50,//Velocidad de inicio para movimiento de items    
    intSituacion:0,
  	create: function() {
      //Habilitacion de fisicas
      this.game.physics.startSystem(Phaser.Physics.ARCADE);      
	    this.game.world.setBounds(0, 0, 800, 600);
      //Fondo de juego
      this.game.add.tileSprite(0, 0,800,600, 'tile_nivel4');

      //Grupo de items
      this.items = this.game.add.group();
      this.items.enableBody = true;
      this.items.inputEnabled = true;
      
      var slot = this.items.create(430,70,'slotIF');

      this.crearSituacion();

  	},

  	update: function(){
              
  	},

    crearSituacion:function(){
      //creamos las acciones de la situación
      var yitem = 340;
      var CItems = this.items;
      var game = this.game;
      Situacion[this.intSituacion].acciones.forEach(function(acciontext) {
          var item = CItems.create(430,yitem,'accion_small');
          item.anchor.setTo(0.5,0);
          item.texto = game.add.text(item.x, item.y,acciontext , { font: '12px calibri', fill: '#000', align:'center'});
          yitem+=40;
      });

      //creamos las condiciones de la situación
      yitem = 340;
      Situacion[this.intSituacion].condiciones.forEach(function(condiciontext) {
          var item = CItems.create(570,yitem,'condicion');
          item.anchor.setTo(0.5,0);
          item.texto = game.add.text(item.x, item.y,condiciontext , { font: '12px calibri', fill: '#000', align:'center'});
          yitem+=40;
      });
    }

  };

  module.exports = Nivel4;