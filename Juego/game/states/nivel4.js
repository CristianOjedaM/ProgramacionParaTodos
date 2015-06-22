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
    itemX: 0,
    itemY: 0,
    slotCondicion:false,
    slotAccion_1:false,
    slotAccion_2:false,
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
      var yitem = 350;
      var CItems = this.items;
      var game = this;

      Situacion[this.intSituacion].acciones.forEach(function(acciontext) {
          var item = CItems.create(495,yitem,'accion_small');
          item.tipo = 0;
          item.anchor.setTo(0.5,0.5);
          item.texto = game.game.add.text(item.x, item.y,acciontext , { font: '14px calibri', fill: '#fff', align:'center'});
          item.texto.anchor.setTo(0.5,0.5);
          item.inputEnabled = true;
          item.events.onInputDown.add(game.clickItem, game);
          item.events.onInputUp.add(game.releaseItem, game);
          yitem+=40;
      });

      //creamos las condiciones de la situación
      yitem = 350;
      Situacion[this.intSituacion].condiciones.forEach(function(condiciontext) {
          var item = CItems.create(630,yitem,'condicion');          
          item.tipo = 1;
          item.anchor.setTo(0.5,0.5);
          item.texto = game.game.add.text(item.x, item.y,condiciontext , { font: '10px calibri', fill: '#fff', align:'center'});
          item.texto.anchor.setTo(0.5,0.5);
          item.inputEnabled = true;
          item.events.onInputDown.add(game.clickItem, game);
          item.events.onInputUp.add(game.releaseItem, game);
          yitem+=40;
      });
    },

    clickItem : function(item){
      this.itemSelec = true;
      this.itemX = item.x;
      this.itemY = item.y;
      item.movimiento = true;      
    },

    releaseItem:function(item){
      if(item.movimiento){
        item.movimiento = false;
        //Se define cuadro imaginario para las acciones
        if(item.tipo == 0 && item.body.y >= (this.slot.body.y + 40) && item.body.y <= (this.slot.body.y + 104) && item.body.x >= (this.slot.body.x + 38) && item.body.x <= (this.slot.body.x + 270) ){
          if(!this.slotAccion_1){
            //Creamos el item el cual encaja en el slot de la accion          
            var itemEncajado = this.items.create( (this.slot.body.x + 154),(this.slot.body.y + 72),'accion_large');
            itemEncajado.anchor.setTo(0.5,0.5);
            itemEncajado.texto = item.texto;
            itemEncajado.texto.fontSize = 20;
            itemEncajado.texto.x = itemEncajado.x;
            itemEncajado.texto.y = itemEncajado.y;
            itemEncajado.slot1 = true;          
            item.kill();
          }else{

            this.items.forEach(function(itemslot1) {
              if(itemslot1.slot1){
                var textoAnt = itemslot1.texto;
                itemslot1.texto = item.texto;
                itemslot1.texto.fontSize = 20;
                //actualizamos el item arrastrado con el texto del item en el slot
                item.texto = textoAnt;
                itemslot1.texto.fontSize = 14;
              }
            });
            item.x = this.itemX;
            item.y = this.itemY;
            item.texto.x = item.x;
            item.texto.y = item.y;

          }
          //indicamos que el primer slot se ha ocupado
          this.slotAccion_1 = true;
        }else{
          item.x = this.itemX
          item.y = this.itemY;
          item.texto.x = item.x;
          item.texto.y = item.y;
        }
      }
    },

  };

  module.exports = Nivel4;