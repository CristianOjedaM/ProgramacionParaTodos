
  'use strict';
  var Pausa = require('../prefabs/pause');
  var textBox = require('../prefabs/textBox');
  var Situacion = 
    [{
      "tipo"  : 'for',
      "iteraciones" : 20,
      "instrucciones": ' Hola, necesito pasar al otro lado del camino\n pero por este camino pasan muchas estampidas\n ayuda a cudrar la condicion para poder pasar\n cuando no este pasando una estampida', 
      "ciclo": [{'texto':'var i = 0; i >= [   ]; i++','respuesta':true},{'texto':'var i = 0; i >= [   ]; i--','respuesta':false},{'texto':'var i = 100; i <= [   ]; i--','respuesta':false}],
      "acciones" :  [{'texto':'cruzar();','respuesta': true},{'texto':'saltar();','respuesta':false},{'texto':'esperar();','respuesta':false},{'texto':'hablar();','respuesta':false},{'texto':'disparar();','respuesta':false}],
      "imgsituacion_1" : 'situacion4_1',
      "imgsituacion_2" : 'situacion4_1_Inv'

    },
    {
      "tipo"  : 'while',
      "instrucciones": ' Holi, necesito pasar al otro lado del camino\n pero por este camino pasan muchas estampidas\n ayuda a cudrar la condicion para poder pasar\n cuando no este pasando una estampida', 
      "ciclo": [{'texto':'obstaculo.distancia != 50','respuesta':false},{'texto':'obstaculo.distancia <= 50','respuesta':true},{'texto':'obstaculo.distancia == 51','respuesta':false}],
      "acciones" :  [{'texto':'saltar();','respuesta':'slot1'},{'texto':'esperar();','respuesta':'invalida'},{'texto':'correr();','respuesta':'slot2'},{'texto':'nadar();','respuesta':'invalida'},{'texto':'arrastrar();','respuesta':'invalida'}],
      "imgsituacion_1" : 'situacion4_1',
      "imgsituacion_2" : 'situacion4_1_Inv'
    }];


  function Nivel5() {}
  Nivel5.prototype = {
    maxtime: 90,
    flagpause:false,
    intro:true,
    intSituacion:0,
    itemX: 0,
    itemY: 0,
    slotCiclo:false,
    slotAccion_1:false,
    score:0,
    intentosxsitua:0,    

    init:function(){
      this.maxtime= 90; 
      this.itemX= 0;
      this.itemY= 0;
      this.flagpause=false;
      this.intro=true;
      this.intSituacion=0;
      this.slotCiclo=false;
      this.slotAccion_1=false;
      this.intentosxsitua  = 0;
    },

  	create: function() {
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

    empezar:function () {
       //Habilitacion de fisicas
      this.game.physics.startSystem(Phaser.Physics.ARCADE);      
      this.game.world.setBounds(0, 0, 800, 600);
      //Fondo de juego
      this.game.add.tileSprite(0, 0,800,600, 'tile_nivel4');

      //Grupo de items
      this.items = this.game.add.group();
      this.items.enableBody = true;
      this.items.inputEnabled = true;

      //Se define el contador de controlde nivel
      this.tiempo = this.game.time.create(false);
      this.tiempo.loop(1000, this.updateTimer, this);//Contador de juego      

      //Se crea marco de la situacion
      this.game.add.sprite(10,40,'fondosituacion');

      //Imagen inicial de la sitacion            
      this.situacion = this.game.add.sprite(30,60,'situacion1');

      //Se agrega boton de ejecucion
      this.run = this.game.add.sprite(230, 355,'btnEjecutar4');
      this.run.anchor.setTo(0.5,0.5);
      this.run.inputEnabled = true;
      this.run.events.onInputDown.add(this.correrCondicion, this);

       //Se crea marco de la situacion
      this.pasos  =this.game.add.sprite(230,460,'fondoPasos4');
      this.pasos.anchor.setTo(0.5,0.5);
      this.pasos.texto = this.game.add.bitmapText(this.pasos.x,this.pasos.y,'font','',18);
      this.pasos.texto.anchor.setTo(0.5,0.5);

      //Se establece los pasos de la situacion
      this.pasos.texto.setText(Situacion[this.intSituacion].instrucciones);

       //Imagen de fondo para el tiempo
      this.cuadroTime = this.game.add.sprite(230, 40,'time');
      this.cuadroTime.anchor.setTo(0.5, 0.5);
      //Se setea el texto para el cronometro
      this.timer = this.game.add.bitmapText(230, 40 ,'font', '00:00', 32);
      this.timer.anchor.setTo(0.5,0.5);

      //Se crear text para el score
      this.scoretext = this.game.add.bitmapText(20, 25 ,'font', 'Puntaje: 0', 24);
      this.scoretext.anchor.setTo(0,0.5);

      //boton ciclo while
      this.btnwhile = this.game.add.sprite(546, 100,'btnwhile');
      this.btnwhile.inputEnabled = true;
      this.btnwhile.events.onInputDown.add(this.listenerwhile, this);

      //boton ciclo for
      this.btnfor = this.game.add.sprite(546, 222,'btnfor');
      this.btnfor.inputEnabled = true;
      this.btnfor.events.onInputDown.add(this.listenerfor, this);

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

    update:function(){
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
           //Se habilitan botones de eleccion de ciclo
          this.btnwhile.visible = true;
          this.btnfor.visible = true;
        }else{
          this.siguiente = this.game.add.sprite(30, this.pasos.y + 50,'btnContinuar');
          this.siguiente.inputEnabled = true;
          this.siguiente.events.onInputDown.add(this.clickListener, this);
          this.siguiente.fixedToCamera = true; 
          if(this.score>=70){
            this.pasos.texto.setText('Muy bien felicitaciones,\nhas completado el nivel de condicionales \nPuntaje: '+ this.score);  
          }else if(this.score >=50 && this.score <70){
            this.pasos.texto.setText('felicitaciones, has completado el nivel de\ncondicionales pero puedes mejorar \nPuntaje: '+ this.score); 
          }else{
            this.pasos.texto.setText('No te ha ido muy bien\nnecesitas mejorar más sobre condicionales\nPuntaje: '+ this.score); 
          } 
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

    crearSituacion:function(){
      //Se restablece el tiempo
      this.maxtime= 90; 
      this.intentosxsitua = 0;
      this.tiempo.start();
      //Se establece los pasos de la situacion
      this.pasos.texto.setText(Situacion[this.intSituacion].instrucciones);
      //Se crea slot de estructura if
      this.slot = this.items.create(479,40,'slotciclo');
      if(this.textciclo != null){this.textciclo.kill();}
      
      if(Situacion[this.intSituacion].tipo == 'for'){
        this.textciclo = this.game.add.text((this.slot.x +24),(this.slot.y + 23),'for (                             ){',{font: '22px calibri', fill: '#fff', align:'center'});
        this.textciclo.anchor.setTo(0,0.5);
        this.textciclo.fontWeight = 'bold';
      }else{
        this.textciclo = this.game.add.text((this.slot.x +22),(this.slot.y + 23),'while(                             ){',{font: '22px calibri', fill: '#fff', align:'center'});
        this.textciclo.anchor.setTo(0,0.5);
        this.textciclo.fontWeight = 'bold';

      }
      var textCierr = this.game.add.text((this.slot.x +26),(this.slot.y + 231),'}',{font: '22px calibri', fill: '#fff', align:'center'});
      textCierr.anchor.setTo(0,0.5);
      textCierr.fontWeight = 'bold';
      //creamos las acciones de la situación
      var yitem = 350;
      var CItems = this.items;
      var game = this;

      Situacion[this.intSituacion].acciones.forEach(function(acciontext) {
          var item = CItems.create(535,yitem,'accion_small5');
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
      Situacion[this.intSituacion].ciclo.forEach(function(condiciontext) {
          var item = CItems.create(690,yitem,'condicion5');          
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

    correrCondicion: function(){
      var condicionCorrecta = true;
      var game = this;
      if(this.slotCiclo && this.slotAccion_1){
        if(Situacion[this.intSituacion].tipo == 'while'){
          this.items.forEach(function(item) {
            if(item.slotC){ //slot Ciclo
              if(!item.respuesta){
                condicionCorrecta = false;
              }
            }else if(item.slot1){ //slot accion
              if(!item.respuesta){
                condicionCorrecta = false;
              }
            }
          });
        }else if(Situacion[this.intSituacion].tipo == 'for'){
          this.items.forEach(function(item) {
            if(item.slotC){ //slot Ciclo
              if(!item.respuesta){
                condicionCorrecta = false;
              }else{
                if(Situacion[game.intSituacion].iteraciones != game.cajaTexto.texto.text){
                  condicionCorrecta = false;
                }
              }
            }else if(item.slot1){ //slot accion
              if(!item.respuesta){
                condicionCorrecta = false;
              }
            }
          });
        }
        //Se valida la condicion de ciclo
        //si la condicion es correcta se pasa a la siguiente situacion
        if(condicionCorrecta){
          //Se ejecuta la animacion 
          this.situacion.visible = false;
          if(this.situacion4_1!=null){this.situacion4_1.kill();} 
          if(this.situacion4_1_Inv!=null){this.situacion4_1_Inv.kill();}
          this.situacion4_1 =  this.game.add.sprite(30,60,Situacion[this.intSituacion].imgsituacion_1);
          var anim = this.situacion4_1.animations.add('anima',[0,1,2,3,4,5,6,7,8,9], 5, false);
          anim.onComplete.add(function(){
            this.situacion4_1.visible = false;            
            this.slotCondicion = this.slotAccion_1 = this.slotAccion_2 = false;                     
            this.score += (50 - (this.intentosxsitua*5));
            this.scoretext.setText('Puntaje: ' + this.score);            
            this.intSituacion++;
            //Se determina si es la ultima situacion
            if(this.intSituacion>=2){ 
              this.situacion.visible = true;                       
              this.siguiente = this.game.add.sprite(30, this.pasos.y + 50 ,'btnContinuar');
              this.siguiente.inputEnabled = true;
              this.siguiente.events.onInputDown.add(this.clickListener, this);

              if(this.score>=70){
                this.pasos.texto.setText('Muy bien felicitaciones,\nhas completado el nivel de ciclos \nPuntaje: '+ this.score);  
              }else if(this.score >=50 && this.score <70){
                this.pasos.texto.setText('felicitaciones, has completado el nivel de\nciclos pero puedes mejorar \nPuntaje: '+ this.score); 
              }else{
                this.pasos.texto.setText('No te ha ido muy bien\nnecesitas mejorar más sobre ciclos\nPuntaje: '+ this.score); 
              }

            } else{
                this.situacion.visible = true;
                this.mensaje(true);
            }
          }, this); 
          this.situacion4_1.animations.play('anima');     
        }else{
          //Se ejecuta la animacion 
          this.situacion.visible = false;         
          if(this.situacion4_1!=null){this.situacion4_1.kill();} 
          if(this.situacion4_1_Inv!=null){this.situacion4_1_Inv.kill();}      
          this.situacion4_1_Inv =  this.game.add.sprite(30,60,Situacion[this.intSituacion].imgsituacion_2);
          var anim =this.situacion4_1_Inv.animations.add('anima',[0,1,2,3,4,5,6,7,8,9], 5, false);             
          anim.onComplete.add(function(){
            this.situacion.visible = true;
            this.situacion4_1_Inv.visible = false;
            this.mensaje(false);
          }, this);          
          this.situacion4_1_Inv.animations.play('anima');
        }
        this.intentosxsitua++;   
      }
    },

    listenerwhile:function(){
      if(Situacion[this.intSituacion].tipo == 'while'){
        this.crearSituacion();
        this.btnwhile.visible = false;
        this.btnfor.visible = false;
      }else{
        alert('este no es el mejor ciclo recuerda que bla bla bla');
      }
    },

    listenerfor:function(){
      if(Situacion[this.intSituacion].tipo == 'for'){
        this.crearSituacion();
        this.btnwhile.visible = false;
        this.btnfor.visible = false;
      }else{
        alert('este no es el mejor ciclo recuerda que bla bla bla');
      }
    },
    
    clickItem : function(item){
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
            var itemEncajado = this.items.create( (this.slot.body.x + 146),(this.slot.body.y + 93),'accion_large5');
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
        }else if(item.tipo == 1 && item.body.y >= (this.slot.body.y + 7) && item.body.y <= (this.slot.body.y + 40) && item.body.x >= (this.slot.body.x + 68) && item.body.x <= (this.slot.body.x + 220) ){
          if(!this.slotCiclo){
            //Creamos el item el cual encaja en el slot de la accion          
            var itemEncajado = this.items.create( (this.slot.body.x + 128),(this.slot.body.y + 29),'condicion5');
            itemEncajado.anchor.setTo(0.5,0.5);
            itemEncajado.texto = item.texto;
            itemEncajado.respuesta = item.respuesta;
            itemEncajado.texto.x = itemEncajado.x;
            itemEncajado.texto.y = itemEncajado.y;
            itemEncajado.slotC = true;          
            item.kill();
            //Se crea la caja de texto para ciclo for
            if(Situacion[this.intSituacion].tipo == 'for'){
              this.cajaTexto = new textBox(this.game,(this.slot.body.x)+149,(this.slot.body.y)+17,16,15,"0");
              this.cajaTexto.texto.fontSize = 16;
              this.items.add(this.cajaTexto);
            }
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
          this.slotCiclo = true;
        }else{
          item.x = this.itemX
          item.y = this.itemY;
          item.texto.x = item.x;
          item.texto.y = item.y;
        }
      }
    },

    clickListener: function(){
       this.game.state.clearCurrentState();
       this.game.state.start("play");
    },

    clickSiguiente: function(){ 
      this.items.forEach(function(item) {            
        if(item.texto != null){item.texto.kill();}
        item.kill();
      });   
      //Se habilitan botones de eleccion de ciclo
      this.btnwhile.visible = true;
      this.btnfor.visible = true;
      //Detener metodo de update
      this.tiempo.stop();       
      this.siguiente.kill();       
    },

    clickIntentar: function(){ 
      this.pasos.texto.setText(Situacion[this.intSituacion].instrucciones);
      this.siguiente.kill(); 
    },

    mensaje:function(respuesta){      
      //Se agrega el panel      
      if(respuesta){
         this.pasos.texto.setText('Muy bien felicitaciones,\ngracias por ayudarme ahora \nvamos por otro reto');         
      }else{        
        this.pasos.texto.setText('Lo siento, pero el ciclo \nesta mal construido vuelve a intentarlo\n y recuerda '); 
      }
      this.siguiente = this.game.add.sprite(30, this.pasos.y + 50,'btnContinuar');
      this.siguiente.inputEnabled = true;
      if(respuesta){
        this.siguiente.events.onInputDown.add(this.clickSiguiente, this);
      }else{
        this.siguiente.events.onInputDown.add(this.clickIntentar, this);
      }
    },
  };

  module.exports = Nivel5;