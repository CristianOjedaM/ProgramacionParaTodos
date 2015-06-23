 'use strict';
var Pausa = require('../prefabs/pause');
var Situacion = 
  [{
    "instrucciones": 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed justo arcu, tempor non tristique aliquam, congue eget sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.', 
    "condiciones": [{'texto':'estampida() == true','respuesta':true},{'texto':'estampida() >= false','respuesta':false},{'texto':'estampida() <= true','respuesta':false}],
    "acciones" :  [{'texto':'cruzar();','respuesta':'slot2'},{'texto':'saltar();','respuesta':'invalida'},{'texto':'esperar();','respuesta':'slot1'},{'texto':'hablar();','respuesta':'invalida'},{'texto':'disparar();','respuesta':'invalida'}]
  },
  {
    "instrucciones": 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed justo arcu, tempor non tristique aliquam, congue eget sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
    "condiciones": [{'texto':'obstaculo.distancia != 50','respuesta':false},{'texto':'obstaculo.distancia <= 50','respuesta':true},{'texto':'obstaculo.distancia == 51','respuesta':false}],
    "acciones" :  [{'texto':'saltar();','respuesta':'slot1'},{'texto':'esperar();','respuesta':'invalida'},{'texto':'correr();','respuesta':'slot2'},{'texto':'nadar();','respuesta':'invalida'},{'texto':'arrastrar();','respuesta':'invalida'}]
  }];

  function Nivel4() {}
  Nivel4.prototype = {
    maxtime: 90,
    intSituacion:0,
    itemX: 0,
    itemY: 0,
    slotCondicion:false,
    slotAccion_1:false,
    slotAccion_2:false,
    flagpause:false,
    intro:true,

    init:function(){
      this.maxtime= 90; 
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

      //Se define el contador de controlde nivel
      this.tiempo = this.game.time.create(false);
      this.tiempo.loop(1000, this.updateTimer, this);//Contador de juego
      this.tiempo.start();      

      //Se crea marco de la situacion
      this.game.add.sprite(10,40,'fondosituacion');

      //Se crea marco de la situacion
      this.pasos  =this.game.add.sprite(230,480,'fondoPasos4');
      this.pasos.anchor.setTo(0.5,0.5);
      this.pasos.texto = game.game.add.text(this.pasos.x,this.pasos.y,'', { font: '20px calibri', fill: '#fff', align:'center'});
      this.pasos.texto.anchor.setTo(0.5,0.5);

      //Imagen de fondo para el tiempo
      this.cuadroTime = this.game.add.sprite(230, 40,'time');
      this.cuadroTime.anchor.setTo(0.5, 0.5);
      //Se setea el texto para el cronometro
      this.timer = this.game.add.bitmapText(230, 40 ,'font', '00:00', 32);
      this.timer.anchor.setTo(0.5,0.5);

      //Grupo de items
      this.items = this.game.add.group();
      this.items.enableBody = true;
      this.items.inputEnabled = true;            

      this.crearSituacion();

      //Se agrega boton de ejecucion
      this.run = this.game.add.sprite(230, 355,'btnEjecutar4');
      this.run.anchor.setTo(0.5,0.5);
      this.run.inputEnabled = true;
      this.run.events.onInputDown.add(this.correrCondicion, this);

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
      //Se crea slot de estructura if
      this.slot = this.items.create(479,40,'slotIF');
      var textif = this.game.add.text((this.slot.x +26),(this.slot.y + 23),'if (                             ){',{font: '24px calibri', fill: '#fff', align:'center'});
      textif.anchor.setTo(0,0.5);
      textif.fontWeight = 'bold';

      //Se establece los pasos de la situacion
      this.pasos.texto.text = Situacion[this.intSituacion].instrucciones;

      var textCierr = this.game.add.text((this.slot.x +26),(this.slot.y + 231),'}',{font: '24px calibri', fill: '#fff', align:'center'});
      textCierr.anchor.setTo(0,0.5);
      textCierr.fontWeight = 'bold';
      //creamos las acciones de la situación
      var yitem = 350;
      var CItems = this.items;
      var game = this;

      Situacion[this.intSituacion].acciones.forEach(function(acciontext) {
          var item = CItems.create(535,yitem,'accion_small');
          item.tipo = 0;
          item.anchor.setTo(0.5,0.5);
          item.texto = game.game.add.text(item.x, item.y,acciontext.texto , { font: '14px calibri', fill: '#fff', align:'center'});
          item.respuesta = acciontext.respuesta;
          item.texto.anchor.setTo(0.5,0.5);
          item.inputEnabled = true;
          item.events.onInputDown.add(game.clickItem, game);
          item.events.onInputUp.add(game.releaseItem, game);
          yitem+=40;
      });

      //creamos las condiciones de la situación
      yitem = 350;
      Situacion[this.intSituacion].condiciones.forEach(function(condiciontext) {
          var item = CItems.create(690,yitem,'condicion');          
          item.tipo = 1;
          item.anchor.setTo(0.5,0.5);
          item.texto = game.game.add.text(item.x, item.y,condiciontext.texto , { font: '14px calibri', fill: '#fff', align:'center'});
          item.respuesta = condiciontext.respuesta;
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
            var itemEncajado = this.items.create( (this.slot.body.x + 146),(this.slot.body.y + 82),'accion_large');
            itemEncajado.anchor.setTo(0.5,0.5);
            itemEncajado.texto = item.texto;
            itemEncajado.respuesta = item.respuesta;
            itemEncajado.texto.fontSize = 20;
            itemEncajado.texto.x = itemEncajado.x;
            itemEncajado.texto.y = itemEncajado.y;
            itemEncajado.slot1 = true;          
            item.kill();
          }else{

            this.items.forEach(function(itemslot1) {
              if(itemslot1.slot1){
                var textoAnt = itemslot1.texto;
                var respuesAnt = itemslot1.respuesta;
                itemslot1.texto = item.texto;
                itemslot1.respuesta = item.respuesta;
                itemslot1.texto.fontSize = 20;
                itemslot1.texto.x = itemslot1.x;
                itemslot1.texto.y = itemslot1.y;
                //actualizamos el item arrastrado con el texto del item en el slot
                item.texto = textoAnt;
                item.respuesta = respuesAnt;
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
            var itemEncajado = this.items.create( (this.slot.body.x + 144),(this.slot.body.y + 180),'accion_large');
            itemEncajado.anchor.setTo(0.5,0.5);
            itemEncajado.texto = item.texto;
            itemEncajado.respuesta = item.respuesta;
            itemEncajado.texto.fontSize = 20;
            itemEncajado.texto.x = itemEncajado.x;
            itemEncajado.texto.y = itemEncajado.y;
            itemEncajado.slot2 = true;          
            item.kill();
          }else{

            this.items.forEach(function(itemslot2) {
              if(itemslot2.slot2){
                var textoAnt = itemslot2.texto;
                var respuesAnt = itemslot2.respuesta;
                itemslot2.texto = item.texto;
                itemslot2.respuesta = item.respuesta;
                itemslot2.texto.fontSize = 20;
                itemslot2.texto.x = itemslot2.x;
                itemslot2.texto.y = itemslot2.y;
                //actualizamos el item arrastrado con el texto del item en el slot
                item.texto = textoAnt;
                item.respuesta = respuesAnt;
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
            var itemEncajado = this.items.create( (this.slot.body.x + 132),(this.slot.body.y + 23),'condicion');
            itemEncajado.anchor.setTo(0.5,0.5);
            itemEncajado.texto = item.texto;
            itemEncajado.respuesta = item.respuesta;
            itemEncajado.texto.x = itemEncajado.x;
            itemEncajado.texto.y = itemEncajado.y;
            itemEncajado.slotC = true;          
            item.kill();
          }else{

            this.items.forEach(function(itemslot1) {
              if(itemslot1.slotC){
                var textoAnt = itemslot1.texto;
                var respuesAnt = itemslot1.respuesta;
                itemslot1.texto = item.texto;
                itemslot1.respuesta = item.respuesta;
                itemslot1.texto.x = itemslot1.x;
                itemslot1.texto.y = itemslot1.y;
                //actualizamos el item arrastrado con el texto del item en el slot
                item.texto = textoAnt;
                item.respuesta = respuesAnt;
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

    updateTimer: function() {
      //Se comprueba que el tiempo de juego haya terminado
      if(this.maxtime == 0){
        this.intSituacion++;
        if(this.intSituacion<2){
          this.slotCondicion = this.slotAccion_1 = this.slotAccion_2 = false;
          this.items.forEach(function(item) {            
            if(item.texto != null){item.texto.kill();}
            item.kill();
          });          
          this.crearSituacion();
        }else{
          this.siguiente = this.game.add.sprite(this.game.width/2 - 75, this.game.height/2 - 25,'btnContinuar');
          this.siguiente.inputEnabled = true;
          this.siguiente.events.onInputDown.add(this.clickListener, this);
          this.siguiente.fixedToCamera = true; 
        }

        //Detener metodo de update
        this.tiempo.stop();
      }

      var minutos = 0;
      var segundos = 0;
        
      if(this.maxtime/60 > 0){
        minutos = Math.floor(this.maxtime/60);
        segundos = this.maxtime%60;
      }else{
        minutos = 0;
        segundos = this.maxtime; 
      }
      
      this.maxtime--;
        
      //Se agrega cero a la izquierda en caso de ser de un solo digito   
      if (segundos < 10)
        segundos = '0' + segundos;
   
      if (minutos < 10)
        minutos = '0' + minutos;
   
      this.timer.setText(minutos + ':' +segundos);
    },

    correrCondicion: function(){
      //se valida que el slot este lleno
      var condicionCorrecta = true;
      if(this.slotCondicion && this.slotAccion_1 && this.slotAccion_2){
        //Se recorren los items para obtener los que se encuentran en el slot
        this.items.forEach(function(item) {
          if(item.slotC){ //slot condicion
            if(!item.respuesta){
              condicionCorrecta = false;
            }
          }else if(item.slot1){ //slot accion verdadera
            if(item.respuesta != 'slot1' ){
              condicionCorrecta = false;
            }
          }else if(item.slot2){ //slot accion falsa
            if(item.respuesta != 'slot2' ){
              condicionCorrecta = false;
            }
          }
        });
        //si la condicion es correcta se pasa a la siguiente situacion
        if(condicionCorrecta){          
          this.intSituacion++;
          if(this.intSituacion<2){
            this.slotCondicion = this.slotAccion_1 = this.slotAccion_2 = false;
            this.items.forEach(function(item) {            
              if(item.texto != null){item.texto.kill();}
              item.kill();
            });
            alert("Correcto");
            this.crearSituacion();
          }else{
            this.siguiente = this.game.add.sprite(this.game.width/2 - 75, this.game.height/2 - 25,'btnContinuar');
            this.siguiente.inputEnabled = true;
            this.siguiente.events.onInputDown.add(this.clickListener, this);
            this.siguiente.fixedToCamera = true; 
          }
        }else{
          alert("Vuelve a intentarlo");
        }        
      }
    },
    clickListener: function(){
       this.game.state.clearCurrentState();
      this.game.state.start("play");
    },

  };

  module.exports = Nivel4;