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
      
      this.slot = this.items.create(430,70,'slotIF');

      this.crearSituacion();

  	},

  	update: function(){
      var mouseX = this.game.input.x;
      var mouseY = this.game.input.y;
      this.items.forEach(function(item) {
        //Se verifican los items para realizar su movimiento en caso de click
        if(item.movimiento == true){          
          item.body.x = mouseX
          item.body.y = mouseY;
          item.texto.x = item.x ;
          item.texto.y = item.y ;
        }       
      });
  	},

    crearSituacion:function(){
      //creamos las acciones de la situación
      var yitem = 340;
      var CItems = this.items;
      var game = this;

      Situacion[this.intSituacion].acciones.forEach(function(acciontext) {
          var item = CItems.create(495,yitem,'accion_small');
          item.anchor.setTo(0.5,0.5);
          item.texto = game.game.add.text(item.x, item.y,acciontext , { font: '12px calibri', fill: '#000', align:'center'});
          item.texto.anchor.setTo(0.5,0.5);
          item.inputEnabled = true;
          item.events.onInputDown.add(game.clickItem, game);
          item.events.onInputUp.add(game.releaseItem, game);
          yitem+=40;
      });

      //creamos las condiciones de la situación
      yitem = 340;
      Situacion[this.intSituacion].condiciones.forEach(function(condiciontext) {
          var item = CItems.create(625,yitem,'condicion');
          item.anchor.setTo(0.5,0.5);
          item.texto = game.game.add.text(item.x, item.y,condiciontext , { font: '12px calibri', fill: '#000', align:'center'});
          item.texto.anchor.setTo(0.5,0.5);
          item.inputEnabled = true;
          item.events.onInputDown.add(game.clickItem, game);
          item.events.onInputUp.add(game.releaseItem, game);
          yitem+=40;
      });
    },

    clickItem : function(item){
      this.itemSelec = true;
      item.movimiento = true;
    },

    releaseItem:function(item){
      if(item.movimiento){
        item.movimiento = false;
        if(item.body.y >= (this.slot.body.y + 40) && item.body.y <= (this.slot.body.y + 104) && item.body.x >= (this.slot.body.x + 38) && item.body.x <= (this.slot.body.x + 270) ){
          var itemEncajado = this.items.create( (this.slot.body.y + 38),(this.slot.body.y + 40),'accion_large');
          itemEncajado.texto = item.texto;          
          item.kill();
        }
      }
    },

  };

  module.exports = Nivel4;