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
    flagpause:false,
    intro:true,

    init:function(){
      this.vel=50;//Velocidad de inicio para movimiento de items    
      this.intSituacion=0;
      this.itemX= 0;
      this.itemY= 0;
      this.slotCondicion=false;
      this.slotAccion_1=false;
      this.slotAccion_2=false;
      this.flagpause = false;
      this.intro = true; 
    },

    create: function(){
      this.game.world.setBounds(0, 0, 800, 600);
      //Fondo de juego
      this.game.add.tileSprite(0, 0,800,600, 'introN3');
      this.game.input.onDown.add(this.iniciarJuego,this);
    },

    iniciarJuego : function(game){
      var x1 = 115;
      var x2 = 264;
      var y1 = 480;
      var y2 = 550;
      if(game.x > x1 && game.x < x2 && game.y > y1 && game.y < y2 ){
        if(this.intro){          
          this.empezar();
        }
      }
    }, 

  	empezar: function() {
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

      //Se agrega el boton de pausa
      this.btnPausa = this.game.add.button((this.game.width - 81), 10, 'btnPausa');
      this.btnPausa.frame = 1;
      this.btnPausa.fixedToCamera = true;

       //Se incluye el panel de pausa al nivel
      this.pnlPausa = new Pausa(this.game);
      this.game.add.existing(this.pnlPausa);
      this.game.input.onDown.add(this.pausaJuego,this);
      //Se indica que sale del intro
      this.intro = false;

  	},

  	update: function(){
      if(!this.intro){
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
      }
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
          var item = CItems.create(650,yitem,'condicion');          
          item.tipo = 1;
          item.anchor.setTo(0.5,0.5);
          item.texto = game.game.add.text(item.x, item.y,condiciontext , { font: '14px calibri', fill: '#fff', align:'center'});
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
                itemslot1.texto.x = itemslot1.x;
                itemslot1.texto.y = itemslot1.y;
                //actualizamos el item arrastrado con el texto del item en el slot
                item.texto = textoAnt;
                item.texto.fontSize = 14;
              }
            });
            item.x = this.itemX;
            item.y = this.itemY;
            item.texto.x = item.x;
            item.texto.y = item.y;
          }
          //indicamos que el primer slot se ha ocupado
          this.slotAccion_1 = true;
        }else if(item.tipo == 0 && item.body.y >= (this.slot.body.y + 147) && item.body.y <= (this.slot.body.y + 213) && item.body.x >= (this.slot.body.x + 38) && item.body.x <= (this.slot.body.x + 270) ){ //slot accion 2
          if(!this.slotAccion_2){
            //Creamos el item el cual encaja en el slot de la accion          
            var itemEncajado = this.items.create( (this.slot.body.x + 152),(this.slot.body.y + 179),'accion_large');
            itemEncajado.anchor.setTo(0.5,0.5);
            itemEncajado.texto = item.texto;
            itemEncajado.texto.fontSize = 20;
            itemEncajado.texto.x = itemEncajado.x;
            itemEncajado.texto.y = itemEncajado.y;
            itemEncajado.slot2 = true;          
            item.kill();
          }else{

            this.items.forEach(function(itemslot2) {
              if(itemslot2.slot2){
                var textoAnt = itemslot2.texto;
                itemslot2.texto = item.texto;
                itemslot2.texto.fontSize = 20;
                itemslot2.texto.x = itemslot2.x;
                itemslot2.texto.y = itemslot2.y;
                //actualizamos el item arrastrado con el texto del item en el slot
                item.texto = textoAnt;
                item.texto.fontSize = 14;
              }
            });
            item.x = this.itemX;
            item.y = this.itemY;
            item.texto.x = item.x;
            item.texto.y = item.y;

          }
          //indicamos que el primer slot se ha ocupado
          this.slotAccion_2 = true;
        }else if(item.tipo == 1 && item.body.y >= (this.slot.body.y + 7) && item.body.y <= (this.slot.body.y + 40) && item.body.x >= (this.slot.body.x + 68) && item.body.x <= (this.slot.body.x + 220) ){
          if(!this.slotCondicion){
            //Creamos el item el cual encaja en el slot de la accion          
            var itemEncajado = this.items.create( (this.slot.body.x + 144),(this.slot.body.y + 23),'condicion');
            itemEncajado.anchor.setTo(0.5,0.5);
            itemEncajado.texto = item.texto;
            itemEncajado.texto.x = itemEncajado.x;
            itemEncajado.texto.y = itemEncajado.y;
            itemEncajado.slotC = true;          
            item.kill();
          }else{

            this.items.forEach(function(itemslot1) {
              if(itemslot1.slotC){
                var textoAnt = itemslot1.texto;
                itemslot1.texto = item.texto;
                itemslot1.texto.fontSize = 20;
                itemslot1.texto.x = itemslot1.x;
                itemslot1.texto.y = itemslot1.y;
                //actualizamos el item arrastrado con el texto del item en el slot
                item.texto = textoAnt;
                item.texto.fontSize = 14;
              }
            });
            item.x = this.itemX;
            item.y = this.itemY;
            item.texto.x = item.x;
            item.texto.y = item.y;
          }
          //indicamos que el primer slot se ha ocupado
          this.slotCondicion = true;
        }else{
          item.x = this.itemX
          item.y = this.itemY;
          item.texto.x = item.x;
          item.texto.y = item.y;
        }
      }
    },

    pausaJuego: function(game){
      var x1 = (this.game.width - 81);
      var x2 = (this.game.width - 36);
      var y1 = 10;
      var y2 = 55;
      if(game.x > x1 && game.x < x2 && game.y > y1 && game.y < y2 ){
        if(this.game.paused == false){
          //Se muestra panel de pausa
          if(this.flagpause==false){
            this.pnlPausa.show();   
            this.flagpause = true;
          }
            
        }else{
          //Se esconde el panel de pausa
          this.game.paused = false;
          this.pnlPausa.hide();
          this.flagpause = false;          
        }
      }
    },

  };

  module.exports = Nivel4;