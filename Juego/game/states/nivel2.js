
  'use strict';

  var textBox = require('../prefabs/textBox');
  var mouseSpring;

  function Nivel2() {}
  Nivel2.prototype = {

    //Definición de propiedades
    scoreText: new Array(),
    score: {tipoCadena:0,tipoNumero:0,tipoBool:0,tipoArray:0},
    maxtime: 120,
    prev_score: {},
    prev_score_base: {},
    itemsCompletos: 0,
    vel:100,//Velocidad de inicio para movimiento de items
    itemSelec: false,

    mover:false,
    lanzamiento:false,
    enPregunta:false,

    //Definicion temporal de preguntas para mostrar por tipo de dato
    stringItems: new Array({pregunta:'Nombre?',variable:'nombre'},{pregunta:'Direccion?',variable:'direccion'}),
    numberItems: new Array({pregunta:'Telefono?',variable:'tel'},{pregunta:'Edad?',variable:'edad'},{pregunta:'Peso?',variable:'peso'}),
    booleanItems: new Array({pregunta:'Es niño?',variable:'nino'}),
    arrayItems: new Array({pregunta:'Nombre?',variable:'nombre'},{pregunta:'Direccion?',variable:'direccion'}),

    create: function() {
      //Habilitacion de fisicas
      this.game.physics.startSystem(Phaser.Physics.P2JS);
      this.game.physics.p2.setImpactEvents(true);//Habilita colision para este tipo de fisicas
      this.game.physics.p2.restitution = 0;
      this.game.world.setBounds(0, 0, 800, 600);

      //Se define el contador de controlde nivel
      this.tiempo = this.game.time.create(false);
      this.tiempo.loop(1000, this.updateTimer, this);//Contador de juego
      this.loop_creaItem = this.tiempo.loop(4000, this.crearItem, this);//Creacion de items
      this.tiempo.start();

      //Se definen los audios del nivel
      this.error_sound = this.game.add.audio('error_sound');

      //Fondo de juego
      this.game.add.tileSprite(0, 0,800,600, 'tile_nivel2');
   
      //Creacion de grupos de colision
      this.lanzadorGrupoColision = this.game.physics.p2.createCollisionGroup();
      this.itemsGrupoColision = this.game.physics.p2.createCollisionGroup();

      //Se realiza creacion de la resortera (lanzador)
      this.nuevoLanzador();

      //Se realiza creacion de la resortera (base)
      this.game.add.sprite(130, this.game.world.height - 160, 'resortera');
      this.resortera = this.game.add.sprite(205, this.game.world.height - 137, 'ancla');
      this.game.physics.p2.enable(this.resortera,true);
      this.resortera.body.static = true;
      this.resortera.body.setCircle(5);

      this.resorte = new Phaser.Line(this.lanzador.x, this.lanzador.y, this.resortera.x, this.resortera.y);

      //Grupo de items
      this.items = this.game.add.group();
      this.items.enableBody = true;
      this.items.physicsBodyType = Phaser.Physics.P2JS;

      //Grupo de log de resultados 
      this.logResultados = this.game.add.group();
      this.logResultados.ultY = 10;

      //Se setea el texto para el cronometro
      this.timer = this.game.add.text(((this.game.width)/2), 16 , '00:00', { font: '32px calibri', fill: '#000',align:'center' });
      this.timer.fixedToCamera = true; 
    },

    update: function(){
      /*Validaciones sobre resortera*/
      if(!this.lanzamiento){
        this.resorte.setTo(this.lanzador.x, this.lanzador.y, this.resortera.x, this.resortera.y);
      }
      if(this.mover){
        this.lanzador.body.x = this.game.input.x;
        this.lanzador.body.y = this.game.input.y;
      }

      /*Validaciones sobre municiones de lanzamiento*/
      if(this.lanzador.body.x < 0 || this.lanzador.body.x > 800 || this.lanzador.body.y < 0 || this.lanzador.body.y > 600){
        this.lanzador.destroy();
        this.nuevoLanzador();
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
      item.body.velocity.x = velX;
      item.body.velocity.y = velY;
      item.body.setCollisionGroup(this.itemsGrupoColision);
      item.body.collides([this.lanzadorGrupoColision]);
    },

    nuevoLanzador: function(){
      this.lanzador = this.game.add.sprite(120, this.game.world.height - 100, 'lanzador');
      this.game.physics.p2.enable(this.lanzador,true);
      this.lanzador.body.collideWorldBounds = false;
      this.lanzador.inputEnabled = true;
      this.lanzador.body.setCircle(20);
      //this.lanzador.body.data.shapes[0].sensor = true;
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
      body1.sprite.destroy();
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
      this.grupoPregunta.add(this.game.add.text( 300, 225 , this.textoPregunta.pregunta, { font: '24px calibri', fill: '#000', align:'center'}));
      this.grupoPregunta.add(this.game.add.text( 300, 250 , 'var', { font: '24px calibri', fill: '#00f', align:'center'}));
      this.varTemp = this.grupoPregunta.add(this.game.add.text( 335, 250 , this.textoPregunta.variable, { font: '24px calibri', fill: '#000', align:'center'}));
      this.grupoPregunta.add(this.game.add.text( (this.varTemp.x + this.varTemp.width + 5), 250 , '=', { font: '24px calibri', fill: '#800080', align:'center'}));
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
          }
          break;
        case 3://Solicitud variable de tipo array
          if(/^([{1})([0-9a-zA-Z])(]{1})$/.test(this.cajaTexto.texto.text)){
            //En caso de respuesta correcta
            console.log(true);
            error = false;
          }else{
            //En caso de respuesta incorrecta
            console.log(false);
          }
          break;
      }
      //Se registra el log de resultados
      this.ultResultado = this.logResultados.add(this.game.add.text( 5, this.logResultados.ultY , 'var '+this.textoPregunta.variable+' = '+this.cajaTexto.texto.text, { font: '12px calibri', fill: '#000', align:'center'}));
      this.logResultados.ultY += 10;
      if(error){
        this.logResultados.add(this.game.add.text( (this.ultResultado.x + this.ultResultado.width + 5), this.ultResultado.y , '-10', { font: '12px calibri', fill: '#f00', align:'center'}));
        this.error_sound.play();
      }else{        
        this.logResultados.add(this.game.add.text( (this.ultResultado.x + this.ultResultado.width + 5), this.ultResultado.y , '+20', { font: '12px calibri', fill: '#0f0', align:'center'}));
      }
      this.cajaTexto.destruir();
      this.grupoPregunta.destroy();
      this.nuevoLanzador();
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
      if(!this.lanzamiento){
        this.resorte.setTo(this.lanzador.x, this.lanzador.y, this.resortera.x, this.resortera.y);
      }
    },

    render: function() {
      if(!this.lanzamiento){
        this.game.debug.geom(this.resorte);  
      }
    },

    clickListener: function(){
      
    }
  };

  function updateAlterno(game){
    if(game.paused){
      setTimeout(updateAlterno,50,game);
    }
  }
  
  module.exports = Nivel2;