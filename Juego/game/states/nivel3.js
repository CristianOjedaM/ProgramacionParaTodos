
  'use strict';

  function Nivel3() {}
  Nivel3.prototype = {

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
      //this.tiempo.loop(1000, this.updateTimer, this);//Contador de juego
      this.tiempo.start();

      //Se definen los audios del nivel
      this.error_sound = this.game.add.audio('error_sound');

      //Fondo de juego
      this.game.add.tileSprite(0, 0,800,600, 'tile_nivel2');

      //Se realiza la creacion del grupo de slots o contenedores
      this.slots = this.game.add.group();
      this.slots.enableBody = true;
      var ySlot = 80;
      for(var i =0; i<3;i++){
        var slot = this.slots.create(600,ySlot,'slot');
        slot.tipo = i;//El tipo define: 0->Dato 1 - 1->Operador - 2->Dato 2
        ySlot += 110;
      }

      //Se realiza la creacion del grupo de items
      this.items = this.game.add.group();
      this.items.enableBody = true;
      //Se genera una matriz de items de 5 por 5
      var xItems = 70;
      var yItems = 70;
      for(var i=0;i<5;i++){
        for(var j=0;j<5;j++){
          var item = this.crearItem(xItems,yItems);
          item.i = i;
          item.j = j;
          xItems += 85;
        }
        xItems = 70;
        yItems += 85;
      }
    },

    update: function(){
      //Se obtienen las posiciones del cursor en el juego
      var mouseX = this.game.input.x;
      var mouseY = this.game.input.y;
      //Se realizan las validaciones sobre el grupo de items
      this.items.forEach(function(item) {
        //Se verifican los items para realizar su movimiento en caso de click
        if(item.movimiento == true){
          item.body.x = mouseX - item.body.width/2;
          item.body.y = mouseY - item.body.height/2;
        }
      });
    },

    crearItem: function(xItem,yItem){
      var defineTipo = Math.floor(Math.random() * 100);//Numero aleatorio de 1 a 100 para simular un porcentaje de 100
      var tipo = 0;
      if(defineTipo >= 0 && defineTipo < 45){//0 - 44 --> Item de dato
        tipo = 1;
      }else if(defineTipo >= 45 && defineTipo < 90){//45 - 89 --> Item de operador logico
        tipo = 2;
      }else{//90 - 99 --> Item comodin
        tipo = 0;
      }
      var item = this.items.create(xItem,yItem,'item3',tipo);
      item.usado = false;
      item.inputEnabled = true;
      item.events.onInputDown.add(this.clickItem, this);
      item.events.onInputUp.add(this.releaseItem, this);
      return item;
    },

    clickItem: function(item){
      if(!item.usado){
        item.movimiento = true;
        item.usado = true;
        item.bringToTop();
        this.items.updateZ();
      }
    },

    releaseItem: function(item){
      if(item.movimiento){
        item.movimiento = false;
        var itemsTemp = this.items;
        this.slots.forEach(function(slot) {
          if(item.overlap(slot)){
            console.log("toco"+item.movimiento);
            item.x = slot.body.x + (slot.body.width - item.body.width)/2;
            item.y = slot.body.y + (slot.body.height - item.body.height)/2;
            switch(slot.tipo){
              case 0:
                
                break;
              case 1:
                break;
              case 2:
                break;
            }
          }
        });
      }
    }
  };

  module.exports = Nivel3;