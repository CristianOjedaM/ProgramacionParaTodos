
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
    vel:50,//Velocidad de inicio para movimiento de items
    itemSelec: false,
    flagpause: false,   

    //Definicion temporal de datos para mostrar por tipo de dato
    stringItems: new Array('"a"','"b"','"c"','"Hola mundo"','"Alberto"','"9548"','""'),
    numberItems: new Array('1','2','987987123'),
    booleanItems: new Array('false','true'),
    arrayItems: new Array('[]','[0]','["a","b","c"]','[9,8,7,25,1]','[{},{a:"1",b:true},{c:1,d:"abc"}]'),
    //Variable para almacenar los errores en total
    countErrorScore:0,
    init: function(score){//Funcion para recibir los argumentos de score (base del nivel)
      //Asignacion de scores previos
      this.prev_score = score;
      this.prev_score_base = score;      
      this.scoreText= new Array();
      this.score= {tipoCadena:0,tipoNumero:0,tipoBool:0,tipoArray:0};
      this.maxtime= 10;
      this.error_score= {errorCadena:0,errorNumero:0,errorBool:0,errorArray:0,errorGeneral:0};
      this.itemsCompletos= 0;
      this.vel=50;//Velocidad de inicio para movimiento de items
      this.itemSelec= false;
      this.flagpause= false;
      this.countErrorScore = 0;
    },

    create: function() {
      //Habilitacion de fisicas
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      this.game.world.setBounds(0, 0, 800, 600);

      //Se define el contador de controlde nivel
      this.tiempo = this.game.time.create(false);
      //this.tiempo.loop(1000, this.updateTimer, this);//Contador de juego
      this.loop_creaItem = this.tiempo.loop(1500, this.crearItem, this);//Creacion de items
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
      this.cuadroScore = this.game.add.sprite(10,(this.game.height - 60),'score1_1');
      this.scoreText[0] = this.game.add.text(this.cuadroScore.x + 75 , this.cuadroScore.y + 18, '0', { font: '24px calibri', fill: '#000', align:'center'});
      this.scoreText[1] = this.game.add.text(this.cuadroScore.x + 180 , this.cuadroScore.y + 18, '0', { font: '24px calibri', fill: '#000', align:'center'});
      this.scoreText[2] = this.game.add.text(this.cuadroScore.x + 285 , this.cuadroScore.y + 18, '0', { font: '24px calibri', fill: '#000', align:'center'});
      this.scoreText[3] = this.game.add.text(this.cuadroScore.x + 390 , this.cuadroScore.y + 18, '0', { font: '24px calibri', fill: '#000', align:'center'});
      this.scoreText[4] = this.game.add.text(this.cuadroScore.x + 470 , this.cuadroScore.y + 5, '0', { font: '20px calibri', fill: '#000', align:'center'});
      this.scoreText[5] = this.game.add.text(this.cuadroScore.x + 470 , this.cuadroScore.y + 30, '0', { font: '20px calibri', fill: '#000', align:'center'});
    
      //Se agrega el boton de pausa
      this.btnPausa = this.game.add.button((this.game.width - 81), 10, 'btnPausa');
      this.btnPausa.frame = 1;
      this.btnPausa.fixedToCamera = true;

      //Se incluye el panel de pausa al nivel
      this.pnlPausa = new Pausa(this.game);
      this.game.add.existing(this.pnlPausa); 
      this.game.input.onDown.add(this.pausaJuego,this);      

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
        //Se quita el boton de pausa
        this.btnPausa.kill();

        this.itemsCompletos = -1;
      }
    },

    crearItem: function(){
      var tipo = Math.floor(Math.random() * 4);//Numero aleatorio entre 0 y 3
      var usados = new Array();
      var xItem = Math.floor(Math.random() * (this.game.width/3)) + 32;
      var yItem = (this.game.height);
      var continuar = false;
      this.vel += 5; 
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
        var error = true;
        var fueraTubo = true;
        var finalizarForech = false;   
        this.tubos.forEach(function(tubo) {
          if(!finalizarForech){
            if(item.body.x>tubo.body.x && item.body.y>tubo.body.y && item.body.y<(tubo.body.y + tubo.body.height)){
              fueraTubo = false;
              if(item.tipo == tubo.tipo){//Se verifica que sean el mismo tipo de dato
                error = false;
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
                var punto = tubo.game.add.bitmapText(tubo.x, tubo.y, 'font1', '+1', 24);
                var tween = tubo.game.add.tween(punto).to({y:(punto.y - 20),alpha:0}, 350, Phaser.Easing.Linear.None, true);
                tween.onComplete.add(function(){punto.destroy();}, this);
                finalizarForech = true;
              }
            }
          }
        });
        if(error){
          this.countErrorScore++;
          if(fueraTubo){
            tempError_score.errorGeneral++;
          }else{
            switch(item.tipo){
                case 0:
                  tempError_score.errorCadena++;
                break;
                case 1:
                  tempError_score.errorNumero++;
                break;
                case 2:
                  tempError_score.errorBool++;
                break;
                case 3:
                  tempError_score.errorArray++;
                break;              
            }    
          }     
          error_sound_temp.play();
          this.error_score = tempError_score;
          if(fueraTubo){this.ErrorScore(4);}else{this.ErrorScore(item.tipo);}
        }
        tempScoreText[4].text  = tempScore.tipoCadena + tempScore.tipoNumero + tempScore.tipoBool  +tempScore.tipoArray;
        tempScoreText[5].text  = this.countErrorScore;
        this.score = tempScore;
        this.scoreText = tempScoreText;
        this.itemSelec = false;
        this.textoItem.destroy();
        item.kill();
      }
    },

    clickListener: function(){
      this.game.state.clearCurrentState();
      this.game.state.start("play");
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
        }
      }
    },

    ErrorScore: function(tipo){
        var inicio = tipo + ( 3 * tipo);
        var final_ = inicio + 3;
        var frame = Math.floor((Math.random()*final_) + inicio);        
        switch(tipo){
          case 0:
            if(this.error_score.errorCadena == 3 ){
              this.error_score.errorCadena =0 ;
              this.MensajeAyuda = this.game.add.sprite(this.game.world.centerX - 138, this.game.world.centerY - 90,'MensajeAyuda',frame);
              this.game.paused = true;              
            }                
          break;
          case 1:
            if(this.error_score.errorNumero == 3 ){
              this.error_score.errorNumero = 0;
              this.MensajeAyuda =this.game.add.sprite(this.game.world.centerX - 138, this.game.world.centerY - 90,'MensajeAyuda',frame);
              this.game.paused = true;              
            }                                  
          break;
          case 2:
            if(this.error_score.errorBool == 3 ){
              this.error_score.errorBool =0 ;
              this.MensajeAyuda = this.game.add.sprite(this.game.world.centerX - 138, this.game.world.centerY - 90,'MensajeAyuda',frame);
              this.game.paused = true;              
            }                                
          break;
          case 3:
            if(this.error_score.errorArray  == 3 ){
              this.error_score.errorArray= 0;
              this.MensajeAyuda = this.game.add.sprite(this.game.world.centerX - 138, this.game.world.centerY - 90,'MensajeAyuda',frame);
              this.game.paused = true;
            }                                  
          break; 
          case 4:
            if(this.error_score.errorGeneral == 5 ){
              this.error_score.errorGeneral = 0;
              this.MensajeAyuda = this.game.add.sprite(this.game.world.centerX - 138, this.game.world.centerY - 90,'MensajeAyuda',frame);
              this.game.paused = true;        
            }
          break;             
        }        
    }
   

  };  
 

  module.exports = Nivel1_1;

  