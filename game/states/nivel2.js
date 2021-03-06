
  'use strict';
  var Pausa = require('../prefabs/pause');
  var textBox = require('../prefabs/textBox');
  var mouseSpring;

  function Nivel2() {}
  Nivel2.prototype = {

    //Definición de propiedades
    score: 0,
    maxtime: 120,
    itemsCompletos: 0,
    vel:10,//Velocidad de inicio para movimiento de items
    itemSelec: false,

    mover:false,
    lanzamiento:false,
    enPregunta:false,
    estado:0,
    flagpause: false,
    error_score: {errorCadena:0,errorNumero:0,errorBool:0,errorArray:0,errorGeneral:0,errorPunteria:0},
    fallosDeclaracion: 0,
    falloPunteria:0,
    //Definicion temporal de preguntas para mostrar por tipo de dato
    stringItems: new Array({pregunta:'Nombre?',variable:'nombre'},{pregunta:'Direccion?',variable:'direccion'}),
    numberItems: new Array({pregunta:'Telefono?',variable:'tel'},{pregunta:'Edad?',variable:'edad'},{pregunta:'Peso?',variable:'peso'}),
    booleanItems: new Array({pregunta:'Es niño?',variable:'nino'}),
    arrayItems: new Array({pregunta:'Nombre?',variable:'nombre'},{pregunta:'Direccion?',variable:'direccion'}),
    //Define si se encuentra en el intro o no
    intro:true,
    init: function(){
      //Definición de propiedades
      this.score= 0;
      this.maxtime= 120;
      this.itemsCompletos= 0;
      this.vel=10;//Velocidad de inicio para movimiento de items
      this.itemSelec= false;

      this.mover=false;
      this.lanzamiento=false;
      this.enPregunta=false;
      this.estado=0;
      this.flagpause = false;
      this.fallosDeclaracion = 0;
      this.falloPunteria = 0;
      mouseSpring = null;
      this.intro = true;
      this.error_score= {errorCadena:0,errorNumero:0,errorBool:0,errorArray:0,errorPunteria:0};
    },

    create: function(){
      this.game.world.setBounds(0, 0, 800, 600);
      //Fondo de juego
      this.game.add.tileSprite(0, 0,800,600, 'introN2');
      this.game.input.onDown.add(this.iniciarJuego,this);

      this.game.add.bitmapText(470, 140, 'font', 'Ahora que ya conoces\nlos diferentes tipos de\ndato, es hora de aplicar\nesos conocimientos; en\neste nivel identificarás\ny aprenderás a declarar\ndiferentes variables de\nacuerdo a su necesidad\nademás descubrirás la\nimportancia de las\nvariables para el manejo\nde datos\n\nAdelante!', 24);
    },

    iniciarJuego : function(game){
      var x1 = 531;
      var x2 = 680;
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
      this.tiempo.loop(1000, this.updateTimer, this);//Contador de juego
      this.loop_creaItem = this.tiempo.loop((4000-this.vel), this.crearItem, this);//Creacion de items
      this.tiempo.start();

      //Se definen los audios del nivel
      this.error_sound = this.game.add.audio('error_sound');

      //Fondo de juego
      this.game.add.tileSprite(0, 0,800,600, 'tile_nivel2');

       //Se define puntaje
      this.scoreText = this.game.add.bitmapText(20 , 10, 'font' ,'Puntaje: 0', 24);
   
      //Creacion de grupos de colision
      this.lanzadorGrupoColision = this.game.physics.p2.createCollisionGroup();
      this.itemsGrupoColision = this.game.physics.p2.createCollisionGroup();

      //Creacion de sprite jugador
      this.jugador = this.game.add.sprite(80,this.game.world.height - 115,'personaje2');
      this.jugador.animations.add('idle', [10,11,12,13,14,15,16,17,18,19,20,21,22,23,24], 12, true,60, true);
      this.animLanzar = this.jugador.animations.add('lanzar', [0,1,2,3,4,5,6,7,8,9], 12, false);
      this.animLanzar.onComplete.add(function() {
        this.jugador.animations.play('idle');
        //Se realiza creacion de la resortera (lanzador)
        this.nuevoLanzador();
        if(this.estado == 0){
          this.resorte = new Phaser.Line(this.lanzador.x, this.lanzador.y, this.resortera.x, this.resortera.y);
          this.resorte2 = new Phaser.Line(this.lanzador.x, this.lanzador.y, this.resortera.x + 20, this.resortera.y);
          this.estado = 1;
        }
      }, this);
      this.jugador.animations.play('lanzar');

      //Se realiza creacion de la resortera (base)
      this.game.add.sprite(188, this.game.world.height - 180, 'resortera');
      this.resortera = this.game.add.sprite(204, this.game.world.height - 167, '');
      this.game.physics.p2.enable(this.resortera,false);
      this.resortera.body.static = true;
      this.resortera.body.setCircle(5);

      //Creacion del piso de juego
      this.game.add.tileSprite(0, this.game.world.height - 40, 800, 40, 'piso');

      //Grupo de items
      this.items = this.game.add.group();
      this.items.enableBody = true;
      this.items.physicsBodyType = Phaser.Physics.P2JS;

      //Grupo de log de resultados 
      this.logResultados = this.game.add.group();
      this.logResultados.ultY = 40;

      //Se setea el texto para el cronometro
      this.timer = this.game.add.bitmapText(((this.game.width)/2), 16 ,'font', '00:00', 32);
      this.timer.anchor.setTo(0.5,0);
      this.timer.fixedToCamera = true; 

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
        /*Validaciones sobre resortera*/
        if(this.estado == 1){
          if(!this.lanzamiento){
            this.resorte.setTo(this.lanzador.x, this.lanzador.y, this.resortera.x, this.resortera.y);
            this.resorte2.setTo(this.lanzador.x, this.lanzador.y, this.resortera.x + 20, this.resortera.y);
          }else{
            this.lanzador.angle += 1;
          }
          if(this.mover){
            this.lanzador.body.x = this.game.input.x;
            this.lanzador.body.y = this.game.input.y;
          }
    
          /*Validaciones sobre municiones de lanzamiento*/
          if(this.lanzador.x < 0 || this.lanzador.x > 800 || this.lanzador.y < 0 || this.lanzador.y > 600){                 
            if(this.lanzador.visible){
              this.error_score.errorPunteria++;
              this.MensajeEquivocacion();
            }
            this.lanzador.destroy();          
            this.jugador.animations.play('lanzar');          
          }
          
          /*Validaciones sobre items*/
          this.items.forEach(function(item) {
            //Se verifican los items para realizar su movimiento en caso de click
            if(item.movimiento == true){
              item.body.velocity.y = 0;//Se retira el movimiento vertical
              item.body.x = mouseX
              item.body.y = mouseY;
            }
    
            //Se verifica que los items no hayan superado los limites del escenario
            if(((item.body.y+item.body.height) < 0) || ((item.body.x+item.body.width) < 0)){
              item.kill();
            }
          }); 
        }
      }
    },

    updateTimer: function() {
      //Se comprueba que el tiempo de juego haya terminado
      if(this.maxtime == 0){
        this.siguiente = this.game.add.sprite(this.game.width/2 - 75, this.game.height/2 - 25,'btnContinuar');
        this.siguiente.inputEnabled = true;
        this.siguiente.events.onInputDown.add(this.clickListener, this);
        this.siguiente.fixedToCamera = true; 

        //Detener metodo de update
        this.tiempo.stop();
        //Eliminar items restantes en el campo
        this.items.destroy();
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

    crearItem: function(){
      var puntoPartida = Math.floor(Math.random() * 2);//Numero aleatorio entre 0 y 1
      var xItem = 0;
      var yItem = 0;
      var velX = 0;
      var velY = 0;
      this.vel +=10;
      if(puntoPartida == 0){//Punto de partida desde abajo, forma vertical
        yItem = this.game.height;
        xItem = Math.floor(Math.random() * ((this.game.width)/2)) + (this.game.width/2);//Numero aleatorio desde la mitad del escenario
        velY = -100;
      }else{//Punto de partida desde lateral, forma horizontal
        xItem = this.game.width;
        yItem = Math.floor(Math.random() * (this.game.height));//Numero aleatorio a lo largo del escenario        
        velY = -50;
        velX = -100;
      }
      var tipo = Math.floor(Math.random() * 4);//Numero aleatorio entre 0 y 4;
      var item = this.items.create(xItem, yItem, 'item', tipo);//Creacion del item
      item.tipo = tipo;
      item.body.collideWorldBounds = false;
      item.body.setCircle(10);
      item.body.velocity.x = velX - this.vel;
      item.body.velocity.y = velY - this.vel;
      item.body.setCollisionGroup(this.itemsGrupoColision);
      item.body.collides([this.lanzadorGrupoColision]);
    },

    nuevoLanzador: function(){
      var tipo = Math.floor(Math.random()*3);
      tipo = tipo * 3;
      this.lanzador = this.game.add.sprite(120, this.game.world.height - 100, 'lanzador');
      this.lanzador.animations.add('idle', [tipo,tipo+1,tipo+2], 10, true,60, true);
      this.lanzador.animations.play('idle');
      this.game.physics.p2.enable(this.lanzador,false);
      this.lanzador.body.collideWorldBounds = false;
      this.lanzador.inputEnabled = true;
      this.lanzador.body.setCircle(18);
      //Se establecen las colisiones contra los objetos de item
      this.lanzador.body.setCollisionGroup(this.lanzadorGrupoColision);
      this.lanzador.body.collides(this.itemsGrupoColision,this.hitItem,this);
      //Se establecen los eventos de click para manipulacion del lanzador
      this.lanzador.events.onInputDown.add(this.clickLanzador, this);
      this.lanzador.events.onInputUp.add(this.releaseLanzador, this);
    },

    hitItem: function(body1,body2){
      //Se establecen las variables de validacion
      this.tipoValida = body2.sprite.tipo;
      //Se destruyen los elementos de colision
      body2.sprite.kill();
      //Se realiza la creacion de la explosion
      this.explosion = this.game.add.sprite(body1.x,body1.y,'explosion');
      this.explosion.anchor.setTo(0.5,0.5);
      this.animExplosion = this.explosion.animations.add('explotar', [1,2,3,4,5,6,7,8,9,10,11], 12, false);
      this.animExplosion.onComplete.add(function() {
        this.explosion.destroy();
      },this);
      body1.sprite.destroy();
      this.explosion.animations.play('explotar');      
      //Se define la pregunta
      this.enPregunta = true;
      switch(this.tipoValida){//Tipo de variable sobre el cual se realizara la definicion
        case 0://Tipo string
          this.textoPregunta = this.stringItems[Math.floor(Math.random() * this.stringItems.length)];//Numero aleatorio entre 0 y longitud de array
          break;
        case 1://Tipo number
          this.textoPregunta = this.numberItems[Math.floor(Math.random() * this.numberItems.length)];//Numero aleatorio entre 0 y longitud de array
          break;
        case 2://Tiipo bool
          this.textoPregunta = this.booleanItems[Math.floor(Math.random() * this.booleanItems.length)];//Numero aleatorio entre 0 y longitud de array
          break;
        case 3://Tipo array
          this.textoPregunta = this.arrayItems[Math.floor(Math.random() * this.arrayItems.length)];//Numero aleatorio entre 0 y longitud de array
          break;
      }
      /*Se realiza la creacion del grupo de pregunta para la variable*/
      this.grupoPregunta = this.game.add.group();
      this.grupoPregunta.add(this.game.add.bitmapText( 300, 225 , 'font',this.textoPregunta.pregunta, 24));
      this.grupoPregunta.add(this.game.add.bitmapText( 300, 250 , 'font','var ',24));
      this.varTemp = this.grupoPregunta.add(this.game.add.bitmapText( 335, 250 ,'font', this.textoPregunta.variable, 24));
      this.grupoPregunta.add(this.game.add.bitmapText( (this.varTemp.x + this.varTemp.width + 5), 250 ,'font', '=', 24));
      this.cajaTexto = new textBox(this.game,(this.game.width/2)-100,(this.game.height/2)-25,200,25,"Escribe aqui");
      this.grupoPregunta.add(this.cajaTexto);
      this.btnValidar = this.game.add.button((this.game.width/2) - 50, (this.game.height/2), 'btnContinuar', this.validarRespuesta, this);
      this.grupoPregunta.add(this.btnValidar);
      //this.game.paused = true;
      //updateAlterno(this.game);
    },

    validarRespuesta: function(){
      var error = true;
      switch(this.tipoValida){
        case 0://Solicitud variable de tipo string
          if(/^(\"(\w)*\")|(\'(\w)*\')$/.test(this.cajaTexto.texto.text)){
            //En caso de respuesta correcta
            console.log(true);
            error = false;
          }else{
            //En caso de respuesta incorrecta
            console.log(false);
            this.error_score.errorCadena++;            
          }
          break;
        case 1://Solicitud variable de tipo numerico
          if(/^(?:\+|-)?\d+$/.test(this.cajaTexto.texto.text)){
            //En caso de respuesta correcta
            console.log(true);
            error = false;
          }else{
            //En caso de respuesta incorrecta
            console.log(false);
            this.error_score.errorNumero++;
          }
          break;
        case 2://Solicitud variable de tipo booleano
          if(this.cajaTexto.texto.text == "true" || this.cajaTexto.texto.text == "false"){
            //En caso de respuesta correcta
            console.log(true);
            error = false;
          }else{
            //En caso de respuesta incorrecta
            console.log(false);
            this.error_score.errorBool++;
          }
          break;
        case 3://Solicitud variable de tipo array
          if(/^\[("[\w]*"|[0-9]*)(,("[\w]*"|[0-9]*))*\]$/.test(this.cajaTexto.texto.text)){
            //En caso de respuesta correcta
            console.log(true);
            error = false;
          }else{
            //En caso de respuesta incorrecta
            console.log(false);
            this.error_score.errorArray++;
          }
          break;
      }
      //Se registra el log de resultados
      this.ultResultado = this.logResultados.add(this.game.add.bitmapText( 5, this.logResultados.ultY , 'font','var '+this.textoPregunta.variable+' = '+(this.cajaTexto.texto.text==this.cajaTexto.defaultTxt?"":this.cajaTexto.texto.text), 14));
      this.logResultados.ultY += 10;
      if(error){
        if(this.score > 10){
          this.score -= 10;
        }else{
          this.score = 0;
        }
        this.logResultados.add(this.game.add.bitmapText( (this.ultResultado.x + this.ultResultado.width + 5), this.ultResultado.y , 'font','-10', 14));
        this.error_sound.play();
        //Se suma 1 al contador de fallos para retroalimentacion       
        this.MensajeEquivocacion();
      }else{        
        var punto = this.game.add.bitmapText(100, 30, 'font1', '+20', 14);
        var tween = this.game.add.tween(punto).to({y:(punto.y - 20),alpha:0}, 400, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(function(){punto.destroy();}, this);
        this.score += 20;
        this.logResultados.add(this.game.add.bitmapText( (this.ultResultado.x + this.ultResultado.width + 5), this.ultResultado.y ,'font' ,'+20', 14));
      }
      console.log(this.score);      
      this.scoreText.setText('Puntaje: ' + this.score);
      this.cajaTexto.destruir();
      this.grupoPregunta.destroy();
      this.jugador.animations.play('lanzar');
    },

    clickLanzador: function(){
      this.lanzamiento = false;
      this.lanzador.body.static = false;
      mouseSpring = this.game.physics.p2.createSpring(this.resortera.body,this.lanzador.body, 0, 20, 1);
      this.resorte.setTo(this.lanzador.x, this.lanzador.y, this.resortera.x,this.resortera.y);
      this.mover = true;
    },

    releaseLanzador: function(){
      this.game.physics.p2.world.springs.splice(0,this.game.physics.p2.world.springs.length);//this.game.physics.p2.removeSpring(mouseSpring);
      this.mover = false;
      this.lanzamiento = true;
    },

    preRender: function(){
      if(this.resorte){
        if(!this.lanzamiento){
          this.resorte.setTo(this.lanzador.x, this.lanzador.y, this.resortera.x, this.resortera.y);
          this.resorte2.setTo(this.lanzador.x, this.lanzador.y, this.resortera.x + 20, this.resortera.y);
        }
      }
    },

    render: function() {
      if(!this.lanzamiento){
        this.game.debug.geom(this.resorte); 
        this.game.debug.geom(this.resorte, '#000000'); 
        this.game.debug.geom(this.resorte2); 
        this.game.debug.geom(this.resorte2, '#000000'); 
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
          this.flagpause = false;
        }
      }
    },

    MensajeEquivocacion: function(){ 
      
      var frame = 0;
      if(this.error_score.errorCadena == 3){
        this.error_score.errorCadena= 0;
        frame = Math.floor(Math.random() * (4 - 0) + 0);
        this.MensajeAyuda = this.game.add.sprite(this.game.world.centerX - 138, this.game.world.centerY - 90,'MensajeAyuda2',frame);
        this.game.paused = true;
      }else if(this.error_score.errorNumero == 3) {
        this.error_score.errorNumero= 0;
        frame = Math.floor(Math.random() * (8 - 4) + 4);
        this.MensajeAyuda = this.game.add.sprite(this.game.world.centerX - 138, this.game.world.centerY - 90,'MensajeAyuda2',frame);
        this.game.paused = true;          
      } 
      else if(this.error_score.errorBool == 3) {
        this.error_score.errorBool= 0;
        frame = Math.floor(Math.random() * (12 - 8) + 8);
        this.MensajeAyuda = this.game.add.sprite(this.game.world.centerX - 138, this.game.world.centerY - 90,'MensajeAyuda2',frame);
        this.game.paused = true;          
      } 
      else if(this.error_score.errorArray == 3) {
        this.error_score.errorArray= 0;
        frame = Math.floor(Math.random() * (16 - 12) + 12);
        this.MensajeAyuda = this.game.add.sprite(this.game.world.centerX - 138, this.game.world.centerY - 90,'MensajeAyuda2',frame);
        this.game.paused = true;          
      }else if(this.error_score.errorPunteria == 5) {
        this.error_score.errorPunteria= 0;
        frame = Math.floor(Math.random() * (20 - 16) + 16);
        this.MensajeAyuda = this.game.add.sprite(this.game.world.centerX - 138, this.game.world.centerY - 90,'MensajeAyuda2',frame);
        this.game.paused = true;          
      }     
    }
  };
  
  module.exports = Nivel2;