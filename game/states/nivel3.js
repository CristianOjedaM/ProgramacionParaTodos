
  'use strict';
 var Pausa = require('../prefabs/pause');
  function Nivel3() {}
  Nivel3.prototype = {

    //Definición de propiedades
    score: 0,
    maxtime: 120,
    prev_score: {},
    prev_score_base: {},
    itemsCompletos: 0,
    itemSelec: false,
    estado:0,

    //Variables de control
    colocados: 0,
    solicitado: true,
    resp_time:20,
    flagpause: false,
    //Definicion temporal de preguntas para mostrar por tipo de dato
    datosItems: new Array({texto:'nombre("Pedro")',variable:'nombre',dato:'"Pedro"'},{texto:'nombre("Maria")',variable:'nombre',dato:'"Maria"'},{texto:'"Maria"',dato:'"Maria"'}),
    operadorItems: new Array('>','<','>=','<=','==','!='),
    //Define la variable de errores para mensajes de retroalimentacion
    errorCount: 0,
    //Define si se encuentra en el intro o no
    intro:true,

    init:function(){
      //Definición de propiedades
      this.estado = 0;
      this.score = 0;
      this.maxtime = 120;
      this.prev_score =  {};
      this.prev_score_base = {};
      this.itemsCompletos = 0;
      this.itemSelec = false;

      //Variables de control
      this.colocados = 0;
      this.solicitado = true;
      this.resp_time = 20;
      this.flagpause = false;
      this.errorCount = 0;
      this.intro = true;
    },

    create: function(){
      this.game.world.setBounds(0, 0, 800, 600);
      //Fondo de juego
      this.game.add.tileSprite(0, 0,800,600, 'introN3');
      this.game.input.onDown.add(this.iniciarJuego,this);

      this.game.add.bitmapText(55, 150, 'font', 'Estas listo para un\nnuevo juego? En este\nnivel no solo deberás\nprobar tu agilidad,\ntambién deberás\ndemostrar tu capacidad\nde lógica manipulando\nvariables, datos y\noperadores Formando\nsentencias acertadas\nde acuerdoa la\nsolitud propuesta\n\nVeamos como lo haces!', 24);
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
      this.game.physics.startSystem(Phaser.Physics.P2JS);
      this.game.physics.p2.setImpactEvents(true);//Habilita colision para este tipo de fisicas
      this.game.physics.p2.restitution = 0;
      this.game.world.setBounds(0, 0, 800, 600);

      //Se define el contador de controlde nivel
      this.tiempo = this.game.time.create(false);
      this.tiempo.loop(1000, this.updateTimer, this);//Contador de situacion
      this.tiempo.loop(1000, this.updateTimerGeneral, this);//Contador de juego
      this.tiempo.start();

      //Se definen los audios del nivel
      this.error_sound = this.game.add.audio('error_sound');

      //Fondo de juego
      this.game.add.tileSprite(0, 0,800,600, 'tile_nivel3');

      this.game.add.sprite(116,50,'fondo3');

      //Se realiza la creacion del grupo de slots o contenedores
      this.slots = this.game.add.group();
      this.slots.enableBody = true;
      var ySlot = 142;
      for(var i =0; i<3;i++){
        var slot = this.slots.create(580,ySlot,'slot');
        slot.tipo = i;//El tipo define: 0->Dato 1 - 1->Operador - 2->Dato 2
        slot.usado = false;
        ySlot += 105;
      }

      //Se realiza la creacion del grupo de items
      this.items = this.game.add.group();
      this.items.enableBody = true;
      //Se genera una matriz de items de 5 por 5
      var xItems = 125;
      var yItems = 70;
      for(var i=0;i<5;i++){
        for(var j=0;j<5;j++){
          var item = this.crearItem(xItems,yItems);
          item.i = i;
          item.j = j;
          xItems += 85;
        }
        xItems = 125;
        yItems += 85;
      }

      //Creacion de texto de puntaje
      this.scoreText = this.game.add.bitmapText(580 , 470, 'font','Puntaje: 0', 24);
      this.solicitud();

      //Se agrega el boton de pausa
      this.btnPausa = this.game.add.button((this.game.width - 81), 10, 'btnPausa');
      this.btnPausa.frame = 1;
      this.btnPausa.fixedToCamera = true;

      //Imagen de fondo para el tiempo
      this.cuadroTime = this.game.add.sprite(((this.game.width)/2), 5,'time');
      this.cuadroTime.anchor.setTo(0.5, 0);
      //Se setea el texto para el cronometro
      this.timer = this.game.add.bitmapText((this.game.width/2), 20, 'font', '00:00', 28);//this.game.add.text(((this.game.width)/2), 15 , '00:00', { font: '32px calibri', fill: '#000',align:'center' });

      this.timer.anchor.setTo(0.5, 0);
      this.timer.fixedToCamera = true; 

      //Se incluye el panel de pausa al nivel
      this.pnlPausa = new Pausa(this.game);
      this.game.add.existing(this.pnlPausa);
      this.game.input.onDown.add(this.pausaJuego,this);
      //Se indica que sale del intro
      this.intro = false;
    },

    update: function(){
      if(!this.intro){
        //Se obtienen las posiciones del cursor en el juego
        var mouseX = this.game.input.x;
        var mouseY = this.game.input.y;
        //Se realizan las validaciones sobre el grupo de items
        this.items.forEach(function(item) {
          //Se verifican los items para realizar su movimiento en caso de click
          if(item.movimiento == true){
            item.body.x = mouseX - item.body.width/2;
            item.body.y = mouseY - item.body.height/2;
            if(item.texto){
              item.texto.x = item.x + item.body.width/2;
              item.texto.y = item.y + item.body.height/2;
            }
          }
        });
      }
    },

    solicitud:function(){
      var sol = Math.floor(Math.random()*2);
      if(sol == 0){//Solicitud de veradero{}
        this.solicitado = true;
      }else{//Solicitud de falso
        this.solicitado = false;
      }
      if(this.estado == 0){
        this.solicitudTxt = this.game.add.bitmapText(600, 70, 'font', this.solicitado.toString(), 24);//this.game.add.text(600,85,this.solicitado.toString(),{ font: '24px calibri', fill: '#000', align:'center'});
        this.solicitudTime = this.game.add.bitmapText(600, 110, 'font', '', 24);//this.game.add.text(610 + this.solicitudTxt.width,85,'',{ font: '24px calibri', fill: '#000', align:'center'});


        this.estado = 1;
      }else{
        this.solicitudTxt.setText(this.solicitado.toString());
        var nTiem = Math.ceil(this.maxtime/30);
        this.resp_time = nTiem * 5;
      }

      this.slots.forEach(function(slot) {
        if(slot.item){
          if(slot.item.texto){slot.item.texto.destroy();}
          slot.item.destroy();
          slot.usado = false;
        }
      });
      this.colocados = 0;
    },

    updateTimer: function(){
      //Se comprueba que el tiempo de juego haya terminado
      /*if(this.maxtime == 0){
        this.siguiente = this.game.add.sprite(this.game.width/2 - 75, this.game.height/2 - 25,'btnContinuar');
        this.siguiente.inputEnabled = true;
        this.siguiente.events.onInputDown.add(this.clickListener, this);
        this.siguiente.fixedToCamera = true; 

        //Detener metodo de update
        this.tiempo.stop();
        //Eliminar items restantes en el campo
        this.items.forEach(function(item) {
            item.kill();
        });
        this.btnPausa.kill();
      }*/
      /*Se comprueba el tiempo por respuesta*/
      if(this.resp_time == 0){
        this.solicitud();
        this.revolverItems();
      }

      var minutos = 0;
      var segundos = 0;
        
      if(this.resp_time/60 > 0){
        minutos = Math.floor(this.resp_time/60);
        segundos = this.resp_time%60;
      }else{
        minutos = 0;
        segundos = this.resp_time; 
      }
      
      //Se realiza la actualizacion de los contadores de tiempo de juego
      this.resp_time--;
        
      //Se agrega cero a la izquierda en caso de ser de un solo digito   
      if (segundos < 10)
        segundos = '0' + segundos;
   
      if (minutos < 10)
        minutos = '0' + minutos;
   
      this.solicitudTime.setText(minutos + ':' +segundos);
    },

    updateTimerGeneral: function() {
      //Se comprueba que el tiempo de juego haya terminado
      if(this.maxtime == 0){
        this.revolverItems();
        this.siguiente = this.game.add.sprite(this.game.width/2 - 75, this.game.height/2 - 25,'btnContinuar');
        this.siguiente.inputEnabled = true;
        this.siguiente.events.onInputDown.add(this.clickListener, this);
        this.tiempo.stop();
        //Se quita el boton de pausa
        this.btnPausa.kill();
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

    crearItem: function(xItem,yItem){
      var defineTipo = Math.floor(Math.random() * 100);//Numero aleatorio de 1 a 100 para simular un porcentaje de 100
      var tipo = 0;
      if(defineTipo >= 0 && defineTipo < 45){//0 - 44 --> Item de dato
        tipo = 0;
      }else if(defineTipo >= 45 && defineTipo < 90){//45 - 89 --> Item de operador logico
        tipo = 1;
      }else{//90 - 99 --> Item comodin
        tipo = 2;
      }
      var item = this.items.create(xItem,yItem,'item3',tipo);
      item.tipo = tipo;
      switch(item.tipo){
        case 0:
          var info = this.datosItems[Math.floor(Math.random() * this.datosItems.length)];
          if(info.variable){
            item.variable = info.variable;
          }
          item.dato = info.dato;
          item.texto = this.game.add.text(item.x + (item.width/2), item.y + (item.height/2), info.texto, { font: '12px calibri', fill: '#000', align:'center'});
          break;
        case 1:
          var info = this.operadorItems[Math.floor(Math.random() * this.operadorItems.length)]
          item.dato = info;
          item.texto = this.game.add.text(item.x + (item.width/2), item.y + (item.height/2), info, { font: '30px calibri', fill: '#000', align:'center'});
          break;
        case 2:
          break;
      }
      if(item.texto){
        item.texto.anchor.setTo(0.5,0.5);
      }
      item.new_i = 99;//Numero de control de no asignados
      item.new_j = 99;//Numero de control de no asignados
      item.usado = false;
      item.inputEnabled = true;
      item.events.onInputDown.add(this.clickItem, this);
      item.events.onInputUp.add(this.releaseItem, this);
      return item;
    },

    clickItem: function(item){
      if(!item.usado && this.maxtime > 0){

        console.log(item.i + " - " + item.j);

        item.movimiento = true;
        item.usado = true;
        item.bringToTop();
        this.items.updateZ();

        var item_nuevo = this.crearItem(item.x, -15);
        item_nuevo.i = -1;
        item_nuevo.j = item.j;

        this.items.forEach(function(item_) {
          if(item_.i < item.i && item_.j == item.j && !item_.usado){
            item_.game.add.tween(item_).to({y:item_.y+85}, 350, Phaser.Easing.Linear.None, true);
            if(item_.texto){
              item_.game.add.tween(item_.texto).to({y:item_.texto.y+85}, 350, Phaser.Easing.Linear.None, true);
            }
            item_.i++;
          }
        });        
      }
    },

    releaseItem: function(item){
      if(item.movimiento){
        item.movimiento = false;
        var itemsTemp = this.items;
        var colocadosTemp = this.colocados;
        var puesto = false;
        this.slots.forEach(function(slot) {
          if(!puesto){
            if(item.overlap(slot) && !slot.usado){
              if(item.variable){
                item.texto.text = item.variable;
              }else{
                if(item.dato){
                  item.texto.text = item.dato;
                }
              }              
              item.x = slot.body.x + (slot.body.width - item.body.width)/2;
              item.y = slot.body.y + (slot.body.height - item.body.height)/2;
              if(item.texto){
                item.texto.x = item.x + (item.width/2);
                item.texto.y = item.y + (item.height/2);
              }
              slot.usado = true;
              slot.item = item;
              colocadosTemp++;
              puesto = true;
            }
          }
        });
        if(!puesto){
          if(item.texto){item.texto.destroy();}
          item.destroy();
        }
        this.colocados = colocadosTemp;
        if(this.colocados == 3){//Se realiza la validacion y asignacion de datos para comprobacion de respuestas correctas o incorrectas
          var correcto = true;
          var contComodin = 0;
          var dato1, dato2, operador;
          this.slots.forEach(function(slot) {
            switch(slot.tipo){
              case 0://Slot dato 1
                if(slot.item.tipo == 2){//Tipo de comodin
                  contComodin++;
                }else if(slot.item.tipo == 0){//En caso de tipo dato se asigna
                  dato1 = slot.item.dato;
                }else{//En caso de tipo operador en primer slot e genera error
                  correcto = false;
                }
                break;
              case 1://Slot operador logica
                if(slot.item.tipo == 1){//Tipo de operador logico
                  operador = slot.item.dato;
                }else if(slot.item.tipo == 2){//Tipo de comodin
                  contComodin++;
                }else{
                  correcto = false;
                }
                break;
              case 2://Slot dato 2
                if(slot.item.tipo == 2){//Tipo de comodin
                  contComodin++;
                }else if(slot.item.tipo == 0){//En caso de tipo dato se asigna
                  dato2 = slot.item.dato;
                }else{//En caso de tipo operador en primer slot e genera error
                  correcto = false;
                }
                break;
            }  
            if(slot.item.texto){slot.item.texto.destroy();}
            slot.item.destroy();
            slot.usado = false;          
          });
          this.colocados = 0;
          if(correcto){//En caso de contar con items apropiados para cada slot se valida que sea sentencia apropiada y con sentido
            if(contComodin == 3){//En caso de ser puntaje de comodin
              this.score += 50;
            }else{//Se valida la respuesta
              var verdadero = true;
              switch(operador){
                case ">":
                  if(isNaN(dato1)){//Se valida si el primer valor es de caracter numerico
                    if(isNaN(dato2)){//Se valida si el segundo valor es de caracter numerico
                      if(dato1<=dato2){
                        verdadero = false;
                      }
                    }else{
                      verdadero = false;
                    }
                  }else{
                    if(isNaN(dato2)){//Se valida si el segundo valor es de caracter numerico
                      verdadero = false;
                    }else{
                      if(dato1<=dato2){
                        verdadero = false;
                      }
                    }
                  }
                  break;
                case "<":
                  if(isNaN(dato1)){//Se valida si el primer valor es de caracter numerico
                    if(isNaN(dato2)){//Se valida si el segundo valor es de caracter numerico
                      if(dato1>=dato2){
                        verdadero = false;
                      }
                    }else{
                      verdadero = false;
                    }
                  }else{
                    if(isNaN(dato2)){//Se valida si el segundo valor es de caracter numerico
                      verdadero = false;
                    }else{
                      if(dato1>=dato2){
                        verdadero = false;
                      }
                    }
                  }
                  break;
                case ">=":
                  if(isNaN(dato1)){//Se valida si el primer valor es de caracter numerico
                    if(isNaN(dato2)){//Se valida si el segundo valor es de caracter numerico
                      if(dato1<dato2){
                        verdadero = false;
                      }
                    }else{
                      verdadero = false;
                    }
                  }else{
                    if(isNaN(dato2)){//Se valida si el segundo valor es de caracter numerico
                      verdadero = false;
                    }else{
                      if(dato1<dato2){
                        verdadero = false;
                      }
                    }
                  }
                  break;
                case "<=":
                  if(isNaN(dato1)){//Se valida si el primer valor es de caracter numerico
                    if(isNaN(dato2)){//Se valida si el segundo valor es de caracter numerico
                      if(dato1>dato2){
                        verdadero = false;
                      }
                    }else{
                      verdadero = false;
                    }
                  }else{
                    if(isNaN(dato2)){//Se valida si el segundo valor es de caracter numerico
                      verdadero = false;
                    }else{
                      if(dato1>dato2){
                        verdadero = false;
                      }
                    }
                  }
                  break;
                case "==":
                  if(dato1 != dato2){
                    verdadero = false;
                  }
                  break;
                case "!=":
                  if(dato1 == dato2){
                    verdadero = false;
                  }
                  break;
              }
              if(this.solicitado){
                if(verdadero){
                  this.score += 20;
                }
                else{
                  this.errorCount++;
                }
              }else{
                if(!verdadero){
                  this.score += 20;
                }else{
                  this.errorCount++;
                }
              }
            }
            this.scoreText.setText('Puntaje: ' + this.score);
            this.MensajeEquivocacion();
            contComodin = 0;
          }
          this.solicitud();
        }
      }
    },

    revolverItems: function(){
      var usados = new Array(5);
      for(var i=0;i<5;i++){
        usados[i] = [false,false,false,false,false];
      }
      //Asignacion inicial parcial de nuevas posiciones
      this.items.forEach(function(item) {
        var i = Math.floor(Math.random()*5);
        var j = Math.floor(Math.random()*5);
        if(!usados[i][j]){ 
          item.i = item.new_i;
          item.j = item.new_j;         
          item.new_i = i;
          item.new_j = j;
          usados[i][j] = true;
        }
      });
      //Asignacion completa de nuevas posiciones
      for(var i=0; i<usados.length; i++) {
        for(var j=0; j<usados.length; j++) {//Se usa misma longitud ya que es una matriz cuadrada
          this.items.forEach(function(item) {
            if(usados[i][j] == false){
              if(item.new_i == 99 && item.new_j == 99){
                item.new_i = i;
                item.new_j = j;
                usados[i][j] = true;
              }
            }
          });
        } 
      }
      //Efecto y reposicion de cada item
      this.items.forEach(function(item) {
        item.game.add.tween(item).to({x:(125+(85*item.new_j)),y:(70+(85*item.new_i))}, 350, Phaser.Easing.Linear.None, true);
        if(item.texto){
          item.game.add.tween(item.texto).to({x:(125+(85*item.new_j)+(item.width/2)),y:(70+(85*item.new_i)+(item.height/2))}, 350, Phaser.Easing.Linear.None, true);
        }
        item.i = item.new_i;
        item.j = item.new_j;
        item.new_i = 99;//Numero para validacion de asignados
        item.new_j = 99;//Numero para validacion de asignados
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
      }else{
        if(this.game.paused == true && this.MensajeAyuda != null && this.MensajeAyuda.visible == true){
          this.MensajeAyuda.destroy();
          this.game.paused = false;
          this.flagpause = false;
        }
      }

    },

    MensajeEquivocacion: function(){       
      var frame = Math.floor(Math.random() * (8 - 0) + 0);
      if(this.errorCount == 5){
        this.errorCount= 0;        
        this.MensajeAyuda = this.game.add.sprite(this.game.world.centerX - 138, this.game.world.centerY - 90,'MensajeAyuda3',frame);
        this.game.paused = true;
      } 
    },

    clickListener: function(){
      this.game.state.clearCurrentState();
      this.game.state.start("play");
    },

  };

  module.exports = Nivel3;