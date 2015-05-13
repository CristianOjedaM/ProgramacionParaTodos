
  'use strict';
  var Pausa = require('../prefabs/pause');

  function Nivel1_1() {}
  Nivel1_1.prototype = {

    //Definición de propiedades
    scoreText: new Array(),
    score: {tipoCadena:0,tipoNumero:0,tipoBool:0,tipoArray:0},
    maxtime: 10,
    prev_score: {},
    prev_score_base: {},
    error_score: {errorCadena:0,errorNumero:0,errorBool:0,errorArray:0,errorGeneral:0},
    itemsCompletos: 0,
    vel:100,//Velocidad de inicio para movimiento de items
    itemSelec: false,
    pausa: false,    

    //Definicion temporal de datos para mostrar por tipo de dato
    stringItems: new Array('"a"','"b"','"c"','"Hola mundo"','"Alberto"','"9548"','""'),
    numberItems: new Array('1','2','987987123'),
    booleanItems: new Array('false','true'),
    arrayItems: new Array('[]','[0]','["a","b","c"]','[9,8,7,25,1]','[{},{a:"1",b:true},{c:1,d:"abc"}]'),

    init: function(score){//Funcion para recibir los argumentos de score (base del nivel)
      //Asignacion de scores previos
      this.prev_score = score;
      this.prev_score_base = score;
    },

    create: function() {
      //Habilitacion de fisicas
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      this.game.world.setBounds(0, 0, 800, 600);

      //Se define el contador de controlde nivel
      this.tiempo = this.game.time.create(false);
      //this.tiempo.loop(1000, this.updateTimer, this);//Contador de juego
      this.loop_creaItem = this.tiempo.loop(1000, this.crearItem, this);//Creacion de items
      this.tiempo.start();

      //Se definen los audios del nivel
      this.error_sound = this.game.add.audio('error_sound');

      //Fondo de juego
      this.game.add.tileSprite(0, 0,800,600, 'tile_nivel1');

      //Tubos de tipos de dato
      this.tubos = this.game.add.group();
      this.tubos.enableBody = true;
      for(var i = 0;i < 4; i++){
        var tubo = this.tubos.create((this.game.width - 185), ((i*150)+30), 'tubo',i);
        tubo.tipo = i;
      }      

      //Grupo de items
      this.items = this.game.add.group();
      this.items.enableBody = true;
      this.items.inputEnabled = true;

      //Control de score
      this.cuadroScore = this.game.add.sprite((this.game.width - 130),(this.game.height - 200),'score');
      this.scoreText[0] = this.game.add.text(this.cuadroScore.x + 100 , this.cuadroScore.y + 35, '0', { font: '24px calibri', fill: '#000', align:'center'});
      this.scoreText[1] = this.game.add.text(this.cuadroScore.x + 100 , this.cuadroScore.y + 72, '0', { font: '24px calibri', fill: '#000', align:'center'});
      this.scoreText[2] = this.game.add.text(this.cuadroScore.x + 100 , this.cuadroScore.y + 108, '0', { font: '24px calibri', fill: '#000', align:'center'});
      this.scoreText[3] = this.game.add.text(this.cuadroScore.x + 100 , this.cuadroScore.y + 141, '0', { font: '24px calibri', fill: '#000', align:'center'});
    
      //Se agrega el boton de pausa
      this.btnPausa = this.game.add.button((this.game.width - 81), 10, 'btnPausa', this.pausaJuego, this);
      this.btnPausa.fixedToCamera = true;

      //Se incluye el panel de pausa al nivel
      this.pnlPausa = new Pausa(this.game);
      this.game.add.existing(this.pnlPausa);
    },

    update: function() {
      //Se obtienen las posiciones del cursor en el juego
      var mouseX = this.game.input.x;
      var mouseY = this.game.input.y;
      var tempError_score = this.error_score;
      this.items.forEach(function(item) {
        //Se verifican los items para realizar su movimiento en caso de click
        if(item.movimiento == true){
          item.body.velocity.y = 0;//Se retira el movimiento vertical
          item.body.x = mouseX
          item.body.y = mouseY;
        }

        //Se verifica que los items no hayan superado los limites del escenario
        if((item.body.y+item.body.height) < 0){
          tempError_score.errorGeneral ++;
          item.kill();
        }
      });   
      this.error_score = tempError_score;
      //Se realiza el movimiento del texto en conjunto con el item
      if(this.itemSelec == true){
        this.textoItem.x =  mouseX;
        this.textoItem.y =  mouseY - 35;
      }

      //Se realiza la verificación de que se han creado todos los items de nivel
      if(this.itemsCompletos == 4){
        //this.tiempo.events.remove(this.loop_creaItem);//Se retira el evento de creacion de items
        
        this.siguiente = this.game.add.sprite(this.game.width/2 - 75, this.game.height/2 - 25,'btnContinuar');
        this.siguiente.inputEnabled = true;
        this.siguiente.events.onInputDown.add(this.clickListener, this);

        this.itemsCompletos = -1;
      }
    },

    crearItem: function(){
      var tipo = Math.floor(Math.random() * 4);//Numero aleatorio entre 0 y 3
      var usados = new Array();
      var xItem = Math.floor(Math.random() * (this.game.width/3)) + 32;
      var yItem = (this.game.height);
      var continuar = false;
      switch(tipo){
        case 0://En caso de ser tipo 0 se genera un item de cadena (Si existen aun)
          if(this.prev_score.tipoCadena > 0){
            this.prev_score.tipoCadena -= 1;
            continuar = true;
          }else if(this.prev_score.tipoCadena == 0){
            this.itemsCompletos++;
            this.prev_score.tipoCadena = -1;
          }
          break;
        case 1://En caso de ser tipo 1 se genera un item de numero (Si existen aun)
          if(this.prev_score.tipoNumero > 0){
            this.prev_score.tipoNumero -= 1; 
            continuar = true;
          }else if(this.prev_score.tipoNumero == 0){
            this.itemsCompletos++;
            this.prev_score.tipoNumero = -1;
          }
          break;
        case 2://En caso de ser tipo 2 se genera un item booleano (Si existen aun)
          if(this.prev_score.tipoBool > 0){
            this.prev_score.tipoBool -= 1;   
            continuar = true;
          }else if(this.prev_score.tipoBool == 0){
            this.itemsCompletos++;
            this.prev_score.tipoBool = -1;
          }
          break;
        case 3://En caso de ser tipo 3 se genera un item de array (Si existen aun)
          if(this.prev_score.tipoArray > 0){
            this.prev_score.tipoArray -= 1;    
            continuar = true;
          }else if(this.prev_score.tipoArray == 0){
            this.itemsCompletos++;
            this.prev_score.tipoArray = -1;
          }
          break;
      }
      if(continuar){//En caso de autorizar la creación de item
        var item = this.items.create(xItem, yItem, 'item', tipo);
        item.tipo = tipo;
        item.body.velocity.y = -this.vel;
        item.inputEnabled = true;
        item.events.onInputDown.add(this.clickItem, this);
        item.events.onInputUp.add(this.releaseItem, this);
        continuar = false;
      }
    },

    clickItem: function(item){
      this.itemSelec = true;
      item.movimiento = true;

      var txtItem = "";
      //Se define el texto a mostrar de acuerdo a el tipo de item seleccionado
      switch(item.tipo){
        case 0:
          txtItem = this.stringItems[Math.floor(Math.random() * (this.stringItems.length))];
          break;
        case 1:
          txtItem = this.numberItems[Math.floor(Math.random() * (this.numberItems.length))];
          break;
        case 2:
          txtItem = this.booleanItems[Math.floor(Math.random() * (this.booleanItems.length))];
          break;
        case 3:
          txtItem = this.arrayItems[Math.floor(Math.random() * (this.arrayItems.length))];
          break;
      }

      this.textoItem = this.game.add.text(item.body.x , (item.body.y - 35), txtItem, { font: '24px calibri', fill: '#000', align:'center'});
    },

    releaseItem: function(item){
      //Se comprueba que el item haya tocado alguno de los tubos o contenedores
      if(item.movimiento == true){
        var tempScore = this.score;
        var tempScoreText = this.scoreText;
        var tempError_score = this.error_score;
        var error_sound_temp = this.error_sound;
        var error = false;
        var fueraTubo = false;
        var finalizarForech = false;        
        this.tubos.forEach(function(tubo) {
          if(!finalizarForech){
            if(item.body.x>tubo.body.x && item.body.y>tubo.body.y && item.body.y<(tubo.body.y + tubo.body.height)){
              if(item.tipo == tubo.tipo){//Se verifica que sean el mismo tipo de dato
                error = false;
                fueraTubo = false;
                switch(item.tipo){
                  case 0:
                    tempScore.tipoCadena++;
                    tempScoreText[0].text = tempScore.tipoCadena;
                  break;
                  case 1:
                    tempScore.tipoNumero++;
                    tempScoreText[1].text = tempScore.tipoNumero;
                    break;
                  case 2:
                    tempScore.tipoBool++;
                    tempScoreText[2].text = tempScore.tipoBool;
                    break;
                  case 3:
                    tempScore.tipoArray++;
                    tempScoreText[3].text = tempScore.tipoArray;
                    break;
                }
                finalizarForech = true;
              }else{
                error=true;                                       
              }
            }
            //el item se solto fuera de los tubos
            else{
              fueraTubo = true;
            }
          }
        });
        if(error){
          if(fueraTubo){
            tempError_score.errorGeneral++;
            this.ErrorScore(4);                            
          }else{
            switch(item.tipo){
                case 0:
                  tempError_score.errorCadena++;  
                  this.ErrorScore(item.tipo);                
                break;
                case 1:
                  tempError_score.errorNumero++;
                  this.ErrorScore(item.tipo);                                  
                break;
                case 2:
                  tempError_score.errorBool++;
                  this.ErrorScore(item.tipo);                                 
                break;
                case 3:
                  tempError_score.errorArray++;
                  this.ErrorScore(item.tipo);                                  
                break;              
            }    
          }     
          error_sound_temp.play();
        }        
        this.score = tempScore;
        this.scoreText = tempScoreText;
        this.itemSelec = false;      
        item.kill();
        this.textoItem.destroy();
        this.error_score = tempError_score;
      }
    },

    clickListener: function(){

    },

    pausaJuego: function(){
      if(this.pausa == false){
        //Se muestra panel de pausa
        this.pnlPausa.show();
        this.pausa = true;      
      }else{
        //Se esconde el panel de pausa
        this.game.paused = false;
        this.pnlPausa.hide();
        this.pausa = false;
      }
    },

    ErrorScore: function(tipo){
        var inicio = tipo + ( 3 * tipo);
        var final = inicio + 3;
        var frame = Math.random() * (final - inicio) + inicio;        
        switch(tipo){
                case 0:
                  if((this.error_score.errorCadena%3) == 0 ){
                    this.game.paused = true;
                    this.game.add.sprite(this.game.world.centerX - 138, this.game.world.centerY - 90,'MensajeAyuda',frame);
                  }                
                break;
                case 1:
                  if((this.error_score.errorNumero%3) == 0 ){
                    this.game.paused = true;
                    this.game.add.sprite(this.game.world.centerX - 138, this.game.world.centerY - 90,'MensajeAyuda',frame);
                  }                                  
                break;
                case 2:
                  if((this.error_score.errorBool%3) == 0 ){
                    this.game.paused = true;
                    this.game.add.sprite(this.game.world.centerX - 138, this.game.world.centerY - 90,'MensajeAyuda',frame);
                  }                                
                break;
                case 3:
                  if((this.error_score.errorArray%3) == 0 ){
                    this.game.paused = true;
                    this.game.add.sprite(this.game.world.centerX - 138, this.game.world.centerY - 90,'MensajeAyuda',frame);
                  }                                  
                break; 
                case 4:
                  if((this.error_score.errorGeneral%5) == 0 ){
                    this.game.paused = true;
                    this.game.add.sprite(this.game.world.centerX - 138, this.game.world.centerY - 90,'MensajeAyuda',frame);
                  }
                break;             
        }
    }
  };
  
  module.exports = Nivel1_1;