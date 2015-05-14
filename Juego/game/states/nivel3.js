
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
    },

    update: function(){
    },

    clickListener: function(){
      
    }
  };

  module.exports = Nivel3;