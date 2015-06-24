(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'programacionparatodos');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('nivel1', require('./states/nivel1'));
  game.state.add('nivel1_1', require('./states/nivel1_1'));
  game.state.add('nivel2', require('./states/nivel2'));
  game.state.add('nivel3', require('./states/nivel3'));
  game.state.add('nivel4', require('./states/nivel4'));
  game.state.add('nivel5', require('./states/nivel5'));
  game.state.add('nivel6', require('./states/nivel6'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":7,"./states/gameover":8,"./states/menu":9,"./states/nivel1":10,"./states/nivel1_1":11,"./states/nivel2":12,"./states/nivel3":13,"./states/nivel4":14,"./states/nivel5":15,"./states/nivel6":16,"./states/play":17,"./states/preload":18}],2:[function(require,module,exports){
'use strict';

var Editor = function(game, x, y ,width , lines, parent){
  Phaser.Group.call(this, game, parent);

  /*Definicion de propiedades*/
  this.x = x;
  this.y = y;
  this.seleccionado = true;
  this.shift = false;//Control tecla shift
  this.hLinea = 14;//Tamaño de fuente 
  this.ancho = width;
  this.heigth = lines * this.hLinea;//Alto del editor
  this.created_lines = 0;//Lineas creadas
  this.current_line = 0;//Linea actual
  this.margen = 20;//Margen izquierda para texto de codigo
  this.lineas = new Array();//Array para control numero de lineas
  this.textos = new Array();//Array para control de textos por linea
  this.fills = {normal: "#fff",editor: "#666",cadena: "#988927", reservado: "#c92246", reservado2: "#2FC687"};//Tipo de color de fuente
  this.font = { font: this.hLinea+'px consolas', fill: this.fills.normal, align:'center'};//Fuente unica para el editor
  this.reservados = /(\s|})(if|else|for|while|switch|case|break)/ig;
  this.reservados2 = /(\s)(function|var)/ig;
  this.textData = ' ';//String para control de textos ingresados
  
  //Se dibuja la caja de texto
  this.cajaTexto = game.add.graphics( 0, 0 );
  this.cajaTexto.beginFill(0x272822, 1);
  this.cajaTexto.bounds = new PIXI.Rectangle(x, y, width, this.heigth);
  this.cajaTexto.drawRect(x, y, width, this.heigth);
  this.add(this.cajaTexto);
  
  //Se agrega el primer número de linea
  this.crearLinea();
  //Se realiza la creacion del pipe ( | )
  this.pipe = this.game.add.text((this.x+this.margen) ,(this.y+(this.current_line*this.hLinea)),'|',this.font);
  this.pipe.xPos = 1;//Posicion del pipe sobre la linea horizontal
  this.game.add.tween(this.pipe).to({alpha: 0}, 700, Phaser.Easing.Linear.NONE, true, 0, 1000, true);//Animacion de aparacion y desaparicion del pipe
  this.add(this.pipe);
  
  //Se establecen los eventos de teclas (presionada y soltada)
  this.game.input.keyboard.addCallbacks(this, this.keyPress, this.keyUp, null);
  //this.events.onInputDown.add(this.seleccionar, this);
};

Editor.prototype = Object.create(Phaser.Group.prototype);
Editor.constructor = Editor;

Editor.prototype.update = function() {
  
};

Editor.prototype.crearLinea = function() {
  if(this.created_lines == 0){
    this.current_line = this.created_lines;
  }else{
    this.current_line++;
  }
  var fontTemp  = this.font;
  fontTemp.fill = this.fills.editor;
  var nLinea = this.game.add.text(this.x+5,(this.y+(this.created_lines*this.hLinea)),(this.created_lines+1),fontTemp);
  this.lineas[this.created_lines] = nLinea;
  this.add(nLinea);

  var fontTemp2 = this.font;
  fontTemp2.fill = this.fills.normal;
  var ntexto = this.game.add.text((this.x + this.margen),(this.y+((this.created_lines)*this.hLinea)),'',fontTemp2);
  ntexto.ult_tinta = 0;
  ntexto.cont_string = 0;
  ntexto.tipo_string = "";
  this.textos[this.created_lines] = ntexto;
  this.add(ntexto);  

  this.created_lines++;
};

Editor.prototype.borrarLinea = function() {
  if(this.created_lines>0 && this.current_line>0){
    this.lineas[this.created_lines-1].destroy();
    if(this.current_line+1<this.created_lines){
      for(var i=this.created_lines;i>this.current_line;i--){
        this.textos[this.current_line].setText(this.textos[this.current_line+1].text);
        this.textos[this.current_line+1].destroy();
      }
    }
    this.current_line--;
    this.created_lines--;
    this.updatePipe();
  }
};

Editor.prototype.updatePipe = function() {
  this.textData = this.textos[this.current_line].text;
  this.pipe.x = this.textos[this.current_line].x + this.textos[this.current_line].width;
  this.pipe.y = (this.y+(this.current_line*this.hLinea));
};

Editor.prototype.setText = function(valor) {
  this.textData += valor;
  this.textos[this.current_line].setText(this.textData);
};

Editor.prototype.setTint = function(tinta,posicion) {
  //this.textos[this.current_line].addColor(tinta,i+1);//Se define fuente para palabras reservadas
  //this.textos[this.current_line].ult_tinta = length;//Se stea la ultima posicion de color
  //this.textos[this.current_line].addColor(this.fills.normal,length);//Se define fuente normal
};

Editor.prototype.validaTexto = function() {
  var length = this.textos[this.current_line].text.length;
  if(length == 1){
    this.textos[this.current_line].cont_string = 0;
    this.textos[this.current_line].ult_tinta = 0;
    this.textos[this.current_line].clearColors();
  }
  var texto_valida = this.textos[this.current_line].text.substring(this.textos[this.current_line].ult_tinta,length);
  switch(this.textos[this.current_line].cont_string){
    case 0://Ingreso de texto normal (no cadena)
      if(this.textos[this.current_line].text[length-1] == "\"" || this.textos[this.current_line].text[length-1] == "'"){//Se validan apertura de cadena
        this.textos[this.current_line].tipo_string = this.textos[this.current_line].text[length-1];//Se define el tipo de apertura de cadena
        this.textos[this.current_line].cont_string=1;//Se establece el estado de apertura de cadena
        this.textos[this.current_line].addColor(this.fills.cadena,length-1);//Se define fuente para cadenas
      }else if(this.reservados.test(texto_valida)){//Se validan palabras reservadas
        for(var i=length;i>=this.textos[this.current_line].ult_tinta;i--){
          if(this.textos[this.current_line].text[i] == ' ' || this.textos[this.current_line].text[i] == '}'){
            this.textos[this.current_line].addColor(this.fills.reservado,i+1);//Se define fuente para palabras reservadas
            this.textos[this.current_line].ult_tinta = length;//Se stea la ultima posicion de color
            this.textos[this.current_line].addColor(this.fills.normal,length);//Se define fuente normal
            continue;
          }
        }
      }else if(this.reservados2.test(texto_valida)){//Se validan palabras reservadas
        for(var i=length;i>=this.textos[this.current_line].ult_tinta;i--){
          if(this.textos[this.current_line].text[i] == ' '){
            this.textos[this.current_line].addColor(this.fills.reservado2,i+1);//Se define fuente para palabras reservadas
            this.textos[this.current_line].ult_tinta = length;//Se stea la ultima posicion de color
            this.textos[this.current_line].addColor(this.fills.normal,length);//Se define fuente normal
            continue;
          }
        }
      }
      break;
    case 1://En caso de encontrarse dentro de cadena
      console.log(this.textos[this.current_line].tipo_string+" - "+texto_valida);
      if(this.textos[this.current_line].text[length-1] == this.textos[this.current_line].tipo_string){//Se valida el cierre de cadena
        this.textos[this.current_line].cont_string = 0;//Se retorna el estado
        this.textos[this.current_line].addColor(this.fills.normal,length);//Se define fuente normal
        this.textos[this.current_line].ult_tinta = length;//Se setea la ultima posicion de color
      }
      break;
  }  
};

Editor.prototype.getText = function() {
  var textoRetorno = "";
  for(var i=0;i<this.textos.length;i++){//Se recorren las lineas del editor
    textoRetorno += this.textos[i].text;//Se concatena el texto de cada linea
  }
  return textoRetorno;
};

Editor.prototype.getTextLine = function(line) {
  if(this.textos[line].text){
    return this.textos[line].text;//Se concatena el texto de cada linea
  }else{
    return "error";
  }
};

Editor.prototype.getTextLines = function() {
  //Se retorna el array de textos
  return this.textos;
};

Editor.prototype.showError = function(error,linea) {
  //Se dibuja la caja de error
  if(!this.errorGroup){
    this.errorGroup = this.game.add.group();
    this.errorGroup.alpha = 0;
    this.cajaError = this.game.add.graphics( this.x, ((this.y + this.heigth) - 40) );
    this.cajaError.beginFill(0xdb3a1e, 1);
    this.cajaError.bounds = new PIXI.Rectangle(0, this.heigth, this.ancho, 40);
    this.cajaError.drawRect(0, 0, this.ancho, 40);
    this.errorGroup.add(this.cajaError);
    this.txtError = this.game.add.text(this.cajaError.x+5,this.cajaError.y,'',this.font);
    this.txtError.wordWrap = true;
    this.txtError.wordWrapWidth = this.ancho;
    this.errorGroup.add(this.txtError);
    this.add(this.errorGroup);
  }
  switch(error){
    case "SyntaxError":
      this.txtError.setText('Ups, creo que tienes un error de sintaxis en la linea ' + (linea+1));
      break;
    case "ReferenceError":
      this.txtError.setText('Ups, tal vez el objeto nombrado en la linea ' + (linea+1) + ' no exista');
      break;
    default:
      this.txtError.setText('Ups, '+error+' en la linea ' + (linea+1));
      break;
  }  
  this.game.add.tween(this.errorGroup).to({alpha:1}, 350, Phaser.Easing.Linear.None, true);
};

Editor.prototype.hideError = function(error,linea) {
  if(this.errorGroup){
    this.game.add.tween(this.errorGroup).to({alpha:0}, 350, Phaser.Easing.Linear.None, true);
  }
}

Editor.prototype.keyPress = function(data) {
    if(this.seleccionado) {
      var charCode = (typeof data.which == "number") ? data.which : data.keyCode;
      console.log(this.current_line + " - " + charCode);
      data.preventDefault();
      switch(data.keyCode) {
        case 8://En caso de ser la tecla borrar
          if(this.textData.length > 1){
            this.textData = this.textData.substring(0, this.textData.length - 1);
            this.textos[this.current_line].setText(this.textData);
          }else{
            this.borrarLinea();
          }
          break;
        case 9://En caso de tabulacion
          this.setText('  ');
          break;
        case 13://En caso de ser la tecla enter se crea una nueva linea
          this.crearLinea();
          break;
        case 16://En caso de ser la tecla shift
          this.shift = true;
          break;
        case 37://Flecha izquierda
          if(this.pipe.xPos > 1){
            this.pipe.xPos = this.textos[this.current_line].text.length - 1;
          }else{
            if(this.current_line > 0){
              this.current_line--;
              this.pipe.xPos = this.textos[this.current_line].text.length;
            }
          }
          break;
        case 38://Flecha arriba
          if(this.current_line > 0){
            this.current_line--;
          }
          break;
        case 39://Flecha derecha
          if(this.pipe.xPos < this.textos[this.current_line].text.length){
            this.pipe.xPos = this.textos[this.current_line].text.length + 1;
          }else{
            if(this.current_line + 1 < this.created_lines){
              this.current_line++;
              this.pipe.xPos = this.textos[this.current_line].text.length;
            }
          }
          break;
        case 40://Flecha abajo
          if(this.current_line + 1 < this.created_lines){
            this.current_line++;
          }
          break;
        case 48://En caso de ser la tecla numero 0
          if(this.shift){
            this.setText('=');
          }else{
            this.setText('0');
          }
          break;
        case 50://En caso de ser la tecla numero 2
          if(this.shift){
            this.setText('\"');
          }else{
            this.setText('2');
          }
          break;
        case 56://En case de ser la tecla numero 8
          if(this.shift){
            this.setText('(');
          }else{
            this.setText('8');
          }
          break;
        case 57://En case de ser la tecla numero 8
          if(this.shift){
            this.setText(')');
          }else{
            this.setText('9');
          }
          break;
        case 107://En caso de ser +
        case 187:
          this.setText('+');
          break;
        case 109://En caso de ser -
        case 189:
          this.setText('-');
          break;
        case 188://Tecla para comas (,)
          if(this.shift){
            this.setText(';');
          }else{
            this.setText(',');
          }
          break;
        case 190://Tecla para puntos (.,:)
          if(this.shift){
            this.setText(':');
          }else{
            this.setText('.');
          }
          break;
        case 191://Tecla para cierre de corchetes
          if(this.shift){
            this.setText(']');
          }else{
            this.setText('}');
          }
          break;
        case 222://Tecla para apretura corchetes
          if(this.shift){
            this.setText('[');
          }else{
            this.setText('{');
          }
          break;
        case 226://Tecla para < , >
          if(this.shift){
            this.setText('>');
          }else{
            this.setText('<');
          }
          break;
        default:
          var letra = String.fromCharCode((96 <= charCode && charCode <= 105)? charCode-48 : charCode).toLowerCase();
          if (letra.length > 0) {
            this.setText(letra);
          }
          break;
      }
      this.updatePipe();
    }
};

Editor.prototype.keyUp = function(data) {
  if(this.seleccionado){
    var charCode = (typeof data.which == "number") ? data.which : data.keyCode;
    switch(data.keyCode) {
      case 16://En caso de ser la tecla shift
        this.shift = false;
        break;
      default://Se realiza el llamado para validacion de textos
        this.validaTexto();
        break;
    }
  }
};

Editor.prototype.glow = function(estado,e) {
  switch(estado){
    case true:
      this.glowTween = this.game.add.tween(this.cajaTexto).to({alpha:1.5}, 500, Phaser.Easing.Linear.None, true, 0, 500, true);
      setTimeout(this.glow,3000,false,this);
      break;
    case false:
      if(e){
        e.glowTween.stop();
        e.game.add.tween(e.cajaTexto).to({alpha:1}, 350, Phaser.Easing.Linear.None, true);
      }else{
        if(this.glowTween){
          this.glowTween.stop();
          this.game.add.tween(this.cajaTexto).to({alpha:1}, 350, Phaser.Easing.Linear.None, true);
        }
      }
      break;
  }  
};

Editor.prototype.limpiar = function() {
  for(var i=1;i<this.created_lines;i++){
    this.textos[i].destroy();
  }
  this.textos[0].setText(' ');
  this.current_line=0;
  this.created_lines=1;
  this.updatePipe();
};

Editor.prototype.destruir = function() {
  this.cajaTexto.destroy();
  this.texto.destroy();
  this.seleccionado = false;
  this.destroy();
};

module.exports = Editor;
},{}],3:[function(require,module,exports){
'use strict';

var Entidad = function(game, x, y, key,frame) {
  Phaser.Sprite.call(this, game, x, y, key, frame);

  /*Definicion de propiedades*/
  this.posx = 0;//Posicion relativa de x en el tablero
  this.posy = 0;//Posicion relativa de y en el tablero
  this.propiedades = [{nombre:"Posicion X",prop:"posx",val:this.posx},
                {nombre:"Posicion Y",prop:"posy",val:this.posy}];
  this.consejos = ["consejo 1","consejo 2","consejo 3","consejo 4","consejo 5"];
};

Entidad.prototype = Object.create(Phaser.Sprite.prototype);
Entidad.prototype.constructor = Entidad;

Entidad.prototype.update = function() {
};

Entidad.prototype.mostrar = function(msj) {
  if(!this.txtMostrar){//Se realiza la cracion del mensaje
    this.txtFondo = this.game.add.sprite(this.x + (this.width * 3)+10,this.y + 20,'globo1');
    this.txtFondo.anchor.setTo(0.5,0);
    this.txtMostrar = this.game.add.text(this.txtFondo.x,this.txtFondo.y + 8,msj,{ font: '12px consolas', fill: '#000', align:'left'});
    this.txtMostrar.anchor.setTo(0.5,0);
    this.txtMostrar.wordWrap = true;
    this.txtMostrar.wordWrapWidth = 110;
    this.txtMostrar.alpha = 0;
    this.txtFondo.alpha = 0;
  }else{
    this.txtFondo.x = this.x + (this.width * 3)+10;
    this.txtFondo.y = this.y + 40;
    this.txtMostrar.x = this.txtFondo.x;
    this.txtMostrar.y = this.txtFondo.y + 15;
    this.txtMostrar.setText(msj);//Se establece el texto del mensaje
  }
  if(!msj){//Texto por defecto
    this.txtMostrar.setText("Hola");
  }
  console.log('Heigth: '+this.txtMostrar.height);
  if(this.txtMostrar.height < 40){//En caso de contar con una linea
    this.txtFondo.loadTexture('globo1');
    this.txtFondo.y = this.y + 20;
    this.txtMostrar.y = this.txtFondo.y + 8;
  }else if(this.txtMostrar.height < 87){//En caso de contar con dos hasta 4 lineas
    this.txtFondo.loadTexture('globo2');
  }else{//En caso de contrar con mas de 4 lineas
    this.txtFondo.loadTexture('globo3');
  }
  this.msjBandera = true;
  this.game.add.tween(this.txtMostrar).to({alpha:1}, 350, Phaser.Easing.Linear.None, true);//Animacion para mostrar mensaje
  this.game.add.tween(this.txtFondo).to({alpha:1}, 350, Phaser.Easing.Linear.None, true);//Animacion para mostrar mensaje
  setTimeout(this.ocultar,5000,this);//Se realiza el llamado de metodo para ocultar mensaje en 5 segundos
};

Entidad.prototype.ocultar = function(e) {
  //Animacion para ocutar mensaje
  e.game.add.tween(e.txtMostrar).to({alpha:0}, 350, Phaser.Easing.Linear.None, true);
  e.game.add.tween(e.txtFondo).to({alpha:0}, 350, Phaser.Easing.Linear.None, true);
  e.msjBandera = false;
  e.propBandera = false;
  e.consBandera = false;
};

Entidad.prototype.prop = function() {
  var retorno = "";
  for(var i=0;i<this.propiedades.length;i++){
    retorno += this.propiedades[i].nombre + ": " + this.propiedades[i].prop + "\n";
  }
  this.propBandera = true;
  return retorno;
};

Entidad.prototype.consejo = function() {
  var random = Math.floor(Math.random() * this.consejos.length);
  this.consBandera = true;
  return this.consejos[random];
};

module.exports = Entidad;

},{}],4:[function(require,module,exports){

  'use strict';

  // Create our pause panel extending Phaser.Group
  var Pause = function(game, parent){
    Phaser.Group.call(this, game, parent);

    //Se agrega el panel
    this.panel = this.create(this.game.width/2, 10, 'fondoPausa');
    this.panel.fixedToCamera = true;
    this.panel.anchor.setTo(0.5, 0);

    //this.game.onPause.add(enPausa, this);

    
    //Boton de play o resume
    this.btnPlay = this.game.add.button((this.game.width - 81), -140, 'btnPausa');
    this.btnPlay.fixedToCamera = true;
    this.btnPlay.frame = 0;
    this.add(this.btnPlay);

    //Boton de reiniciar
    this.btnReiniciar = this.game.add.button((this.game.width/2) - 120, 50, 'OpcPausa');
    this.btnReiniciar.fixedToCamera = true;
    this.btnReiniciar.frame = 0;
    this.add(this.btnReiniciar);   

    //Boton de inicio
    this.btnInicio = this.game.add.button((this.game.width/2) -30 , 50, 'OpcPausa');
    this.btnInicio.fixedToCamera = true;
    this.btnInicio.frame = 2;
    this.add(this.btnInicio);

    
    //Boton de ayuda
    this.btnAyuda = this.game.add.button((this.game.width/2) + 60, 50, 'OpcPausa');
    this.btnAyuda.fixedToCamera = true;
    this.btnAyuda.frame = 1;
    this.add(this.btnAyuda);

    
    //Se establece la posicion fuera de los limites de juego
    this.x = 0;
    this.y = -160;
    this.game.input.onDown.add(this.reset,this);
  };

  Pause.prototype = Object.create(Phaser.Group.prototype);
  Pause.constructor = Pause;

  Pause.prototype.show = function(){
    var game_ = this.game;
    var tween = this.game.add.tween(this).to({y:150}, 500, Phaser.Easing.Bounce.Out, true);
    tween.onComplete.add(function(){this.game.paused = true;}, this);
  };
  Pause.prototype.hide = function(){
    this.game.add.tween(this).to({y:-160}, 200, Phaser.Easing.Linear.NONE, true);
  }; 

  Pause.prototype.reset = function(game){
     
      var x1 = (this.game.width/2) - 120;
      var x2 = (this.game.width/2) - 75;
      var y1 = 210; 
      var y2 = 255;
     if(game.x > x1 && game.x < x2 && game.y > y1 && game.y < y2 ){
           //Opcion Reiniciar
          if(this.game.paused){
            this.game.paused = false;
            this.hide();                  
            this.game.state.clearCurrentState();
            if(game.game.state.current == "nivel1_1"){
              game.game.state.start("nivel1");
            }else{
              game.game.state.start(game.game.state.current);
            }
          }
      }else if(game.x > (this.game.width/2) -30 && game.x < (this.game.width/2) + 15 && game.y > y1 && game.y < y2 ){
          //Opcion Inicio
           if(this.game.paused){
            this.game.paused = false;
            this.hide();                  
            this.game.state.clearCurrentState();
            game.game.state.start("play");
          }
      }else if(game.x > (this.game.width/2) + 60 && game.x < (this.game.width/2) + 105 && game.y > y1 && game.y < y2 ){
          //Opcion ayuda
           if(this.game.paused){
            var frame  = 0;
              switch(game.game.state.current){
                case 'nivel1':
                  frame = 0;
                break;
                case 'nivel1_1':
                  frame = 1;
                break;
                case 'nivel2':
                  frame = 2;
                break;
                case 'nivel3':
                  frame = 3;
                break;
              }
              this.mensajeGeneral  = this.game.add.sprite(0, 0,'ayudaGeneral',frame);
              this.mensajeGeneral.fixedToCamera = true;
           }
      }else if( this.game.paused == true && this.mensajeGeneral != null && this.mensajeGeneral.visible == true && game.x > (this.game.width - 81) && game.x < (this.game.width - 36) && game.y > 10 && game.y < 55 ){
          this.mensajeGeneral.destroy();
      }
  }; 
 
  module.exports = Pause;
},{}],5:[function(require,module,exports){
'use strict';

var Entidad = require('../prefabs/entidad');

var Tablero = function(game, x, y ,xCuadros , yCuadros, parent){
  Phaser.Group.call(this, game, parent);  

  /*Definicion de propiedades*/
  this.x = x;
  this.y = y;
  this.xCuadros = xCuadros;
  this.yCuadros = yCuadros;
  this.dimension = 50;

  //Fondo de tablero
  this.fondoTablero = this.game.add.sprite(x-5,y-4,'fondoTablero');
  this.add(this.fondoTablero);

  //Se dibuja el tablero con base en los valores de entrada
  for(var i=0;i<xCuadros;i++){
    for(var j=0;j<yCuadros;j++){
      this.dibujarCuadro(x+(i*this.dimension),y+(j*this.dimension),this.dimension);
    }
  }
};

Tablero.prototype = Object.create(Phaser.Group.prototype);
Tablero.constructor = Tablero;

Tablero.prototype.update = function() {
  
};

Tablero.prototype.dibujarCuadro = function(x,y,dimension) {
  var cuadro = this.game.add.graphics( 0, 0 );
  //cuadro.beginFill(0x272822, 1);
  cuadro.lineStyle(1, 0xffffff);
  cuadro.bounds = new PIXI.Rectangle(x, y, dimension, dimension);
  cuadro.drawRect(x, y, dimension, dimension);
  this.add(cuadro);
};

Tablero.prototype.setObjCuadro = function(i, j, obj, sprite, frame){
  if(obj != ''){
    var obj = new Entidad(this.game,this.x+(i*this.dimension),this.y+(j*this.dimension),obj,frame);
    this.add(obj);
  }else{
    if(i != 0){
      sprite.xBandera = true;
    }
    if(j != 0){
      sprite.yBandera = true;
    }
    sprite.x = this.x+(i*this.dimension);
    sprite.propiedades[0].val = i;//Se actualiza el valor en propiedades
    sprite.y = this.y+(j*this.dimension);
    sprite.propiedades[1].val = j;//Se actualiza el valor en propiedades
    console.log(this.y);
  }
  return obj;
}

Tablero.prototype.destruir = function() {
 
};

module.exports = Tablero;
},{"../prefabs/entidad":3}],6:[function(require,module,exports){
'use strict';

var TextBox = function(game, x, y, width, heigth, defaultTxt) {
  Phaser.Sprite.call(this, game, x, y, '', 0);

  /*Definicion de propiedades*/
  this.defaultTxt = defaultTxt;
  this.seleccionado = true;
  this.shift = false;
  this.length = 20;
  //Se dibuja la caja de texto
  this.cajaTexto = game.add.graphics( 0, 0 );
  this.cajaTexto.beginFill(0xFFFFFF, 1);
  this.cajaTexto.bounds = new PIXI.Rectangle(x, y, width, heigth);
  this.cajaTexto.drawRect(x, y, width, heigth);
  //Se define el texto
  this.texto = game.add.text(x , y, defaultTxt, { font: '24px calibri', fill: '#000', align:'center'});
  this.textData = "";
  
  // initialize your prefab here
  //this.inputEnabled = true;
  game.input.keyboard.addCallbacks(this, this.keyPress, this.keyUp, null);
  //this.events.onInputDown.add(this.seleccionar, this);
};

TextBox.prototype = Object.create(Phaser.Sprite.prototype);
TextBox.prototype.constructor = TextBox;

TextBox.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

TextBox.prototype.seleccionar = function() {
	this.seleccionado = true;
};

TextBox.prototype.keyPress = function(data) {
    if(this.seleccionado) {
      var charCode = (typeof data.which == "number") ? data.which : data.keyCode;
      console.log(charCode);
      switch(data.keyCode) {
        case 8://En caso de ser la tecla borrar
          this.textData = this.textData.substring(0, this.textData.length - 1);
          this.texto.text = this.textData;
          break;
        case 13://En caso de ser la tecla enter no se realiza ninguna accion
          break;
        case 16://En caso de ser la tecla shift
          this.shift = true;
          break;
        case 50://En caso de ser la tecla numero 2
          if(this.shift){
            this.textData += "\"";
            this.texto.text = this.textData;
          }else{
            this.textData += "2";
            this.texto.text = this.textData;
          }
          break;
        case 188://Tecla para comas (,)
          if(this.shift){
            this.textData += ";";
            this.texto.text = this.textData;
          }else{
            this.textData += ",";
            this.texto.text = this.textData;
          }
          break;
        case 191://Tecla para cierre de corchetes
          if(this.shift){
            this.textData += "]";
            this.texto.text = this.textData;
          }else{
            this.textData += "}";
            this.texto.text = this.textData;
          }
          break;
        case 222://Tecla para apretura corchetes
          if(this.shift){
            this.textData += "[";
            this.texto.text = this.textData;
          }else{
            this.textData += "{";
            this.texto.text = this.textData;
          }
          break;
        default:
          if ((this.textData.length + 1) <= this.length) {
            var letra = String.fromCharCode((96 <= charCode && charCode <= 105)? charCode-48 : charCode).toLowerCase();
            if (letra.length > 0) {
              this.textData += letra;
              this.texto.text = this.textData;
            }
          }
          break;
      }
    }
};

TextBox.prototype.keyUp = function(data) {
  if(this.seleccionado){
    var charCode = (typeof data.which == "number") ? data.which : data.keyCode;
    console.log(charCode);
    switch(data.keyCode) {
      case 16://En caso de ser la tecla shift
        this.shift = false;
        break;
    }
  }
};

TextBox.prototype.destruir = function() {
  this.cajaTexto.destroy();
  this.texto.destroy();
  this.seleccionado = false;
  this.destroy();
};

module.exports = TextBox;

},{}],7:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;

},{}],8:[function(require,module,exports){

'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.titleText = this.game.add.text(this.game.world.centerX,100, 'Game Over!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.congratsText = this.game.add.text(this.game.world.centerX, 200, 'You Win!', { font: '32px Arial', fill: '#ffffff', align: 'center'});
    this.congratsText.anchor.setTo(0.5, 0.5);

    this.instructionText = this.game.add.text(this.game.world.centerX, 300, 'Click To Play Again', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionText.anchor.setTo(0.5, 0.5);
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;

},{}],9:[function(require,module,exports){

'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
    this.spriteIntro = this.game.add.sprite(0, 0, 'intro');

    /*this.spriteIntro.angle = -20;
    this.game.add.tween(this.sprite).to({angle: 20}, 1000, Phaser.Easing.Linear.NONE, true, 0, 1000, true);*/
  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};

module.exports = Menu;

},{}],10:[function(require,module,exports){

  'use strict';
  var Pausa = require('../prefabs/pause');

  function Nivel1() {}
  Nivel1.prototype = {

    //Definición de propiedades
    scoreText: new Array(),
    score: {tipoCadena:0,tipoNumero:0,tipoBool:0,tipoArray:0},
    maxtime: 60,
    flagpause: false,
    intro:true,

    init: function(){      
      this.scoreText= new Array();
      this.score= {tipoCadena:0,tipoNumero:0,tipoBool:0,tipoArray:0};
      this.maxtime= 60;
      this.flagpause= false; 
      this.intro = true;  
    },

    create: function(){
      this.game.world.setBounds(0, 0, 800, 600);
      //Fondo de juego
      this.game.add.tileSprite(0, 0,800,600, 'introN1');
      this.game.input.onDown.add(this.iniciarJuego,this);

      this.game.add.bitmapText(60, 150, 'font', 'Bienvenido, a lo largo\nde este nivel aprenderás\ncuales son los tipo de\ndato básicos en \nJavascript; estos tipos\nson realmente utiles,\nnos permitirán definir\nel tipo de información\nmanejada y la cual se\nquiere almacenar y\nmanipular (números,\ntextos, etc.)\n\nVamos!', 24);
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
      this.physics = this.game.physics.startSystem(Phaser.Physics.ARCADE);

      this.game.world.setBounds(0, 0, 800, 1920);

      //Se define el contador de controlde nivel
      this.tiempo = this.game.time.create(false);
      this.tiempo.loop(1000, this.updateTimer, this);//Contador de juego
      this.tiempo.loop(5000, this.crearItem, this);//Creacion de items
      this.tiempo.start();

      //Fondo de juego
      this.game.add.tileSprite(0, 0,800,1920, 'tile_nivel1');      

      //Se definen los audios del nivel
      this.jump_sound = this.game.add.audio('jump_sound');

      //Grupo de plataformas
      this.plataformas = this.game.add.group();

      //Plataformas son afectadas por fisicas
      this.plataformas.enableBody = true;

      var nPisos = (1920/150);//Se determina el numero de plataformas con base el alto total y la diferencia entre una y otra
      for (var i = 0; i < nPisos; i++){
        var ancho = Math.floor((Math.random() * 250) + 100);//Se determina ancho aleatorio para cada plataforma
        var posX = Math.floor((Math.random() * (this.game.width-ancho)));//Se determina posicion X aleatoria
          var plataforma = this.game.add.tileSprite(posX, (i * 150), ancho, 32, 'plataforma');
          if(i%2 != 0){
            plataforma.desplazamiento = 1;
          }else{
            plataforma.desplazamiento = 2;
          }
          this.plataformas.add(plataforma);
          plataforma.body.immovable = true;
      }

      //Creacion del piso
      var ground = this.game.add.tileSprite(0, this.game.world.height - 40, 800, 40, 'piso');
      this.plataformas.add(ground);
      //Piso objeto de colision
      ground.body.immovable = true;
      ground.desplazamiento = 0;

      //Se realiza creacion del jugador
      this.jugador = this.game.add.sprite(32, this.game.world.height - 750, 'personaje');
      //Habilitacion de fisicas sobre el jugador
      this.game.physics.arcade.enable(this.jugador);
      //Propiedades fisicas del jugador (Se agrega un pequeño rebote)
      this.jugador.body.bounce.y = 0.2;
      this.jugador.body.gravity.y = 550;
      this.jugador.body.collideWorldBounds = true;

      //Se definen las animaciones del jugador
      this.jugador.animations.add('left', [14,13,12,11,10,9,8,7], 15, true);
      this.jugador.animations.add('right', [16,17,18,19,20,21,22,23], 15, true);

      this.jugador.animations.add('jump', [31,32,33,34,35,36,37,38,39], 15, true);
      this.jugador.animations.add('jump_left', [6,5,4,3,2,1,0], 15, true);
      this.jugador.animations.add('jump_right', [24,25,26,27,28,29,30], 15, true);

      this.jugador.esSalto = false;

      //Creacion del grupo de items
      this.items = this.game.add.group();
      //Habilitacion de colisiones 
      this.items.enableBody = true;

      //Control de score
      this.cuadroScore = this.game.add.sprite((this.game.width - 130),(this.game.height - 200),'score1');
      this.cuadroScore.fixedToCamera = true;
      this.scoreText[0] = this.game.add.bitmapText(this.cuadroScore.x + 90 , this.cuadroScore.y + 28, 'font', '0', 24);
      this.scoreText[0].fixedToCamera = true;
      this.scoreText[1] = this.game.add.bitmapText(this.cuadroScore.x + 90 , this.cuadroScore.y + 68, 'font', '0', 24);
      this.scoreText[1].fixedToCamera = true;
      this.scoreText[2] = this.game.add.bitmapText(this.cuadroScore.x + 90 , this.cuadroScore.y + 106, 'font', '0', 24);
      this.scoreText[2].fixedToCamera = true;
      this.scoreText[3] = this.game.add.bitmapText(this.cuadroScore.x + 90 , this.cuadroScore.y + 145, 'font', '0', 24);
      this.scoreText[3].fixedToCamera = true;
      
      //Imagen de fondo para el tiempo
      this.cuadroTime = this.game.add.sprite(((this.game.width)/2), 5,'time');
      this.cuadroTime.anchor.setTo(0.5, 0);
      this.cuadroTime.fixedToCamera = true;
      //Se setea el texto para el cronometro

      this.timer = this.game.add.bitmapText((this.game.width/2), 20, 'font', '00:00', 28);//this.game.add.text(((this.game.width)/2), 15 , '00:00', { font: '32px calibri', fill: '#000',align:'center' });

      this.timer.anchor.setTo(0.5, 0);
      this.timer.fixedToCamera = true; 

      this.cursors = this.game.input.keyboard.createCursorKeys();

      //Seguimiento de camara
      this.game.camera.follow(this.jugador);

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

    update: function() {
      if(!this.intro){
        this.game.physics.arcade.collide(this.jugador, this.plataformas);
        this.game.physics.arcade.collide(this.items, this.plataformas);

        //Se define el metodo de colision entre jugador y estrellas
        this.game.physics.arcade.overlap(this.jugador, this.items, this.recogerItem, null, this);

        this.jugador.body.velocity.x = 0;//Reseteo de velocidad horizontal si no se presentan acciones sobre el jugador

        if (this.cursors.left.isDown){//Movimiento a la izquierda
          this.jugador.body.velocity.x = -150;
          if(this.jugador.esSalto){//En caso de encontrarse en el aire
            this.jugador.animations.play('jump_left');//Se muestra animacion de salto
          }else{
            this.jugador.animations.play('left');//Se muestra animacion de caminado
          }
        }else if (this.cursors.right.isDown){//Movimiento a la derecha
          this.jugador.body.velocity.x = 150;
          if(this.jugador.esSalto){//En caso de encontrarse en el aire
            this.jugador.animations.play('jump_right');//Se muestra animacion de salto
          }else{
            this.jugador.animations.play('right');//Se muestra animacino de caminado
          }
        }else{//Idle
          if(this.jugador.esSalto){//En caso de encontrarse en el aire
            this.jugador.animations.play('jump');//Se muestra animacion de salto
          }else{
            this.jugador.animations.stop();
            this.jugador.frame = 15;
          }
        }
        
        if(this.jugador.body.touching.down){//En caso de tocar suelo
          this.jugador.esSalto = false;
        }

        //Habilitar salto si el jugador toca alguna plataforma
        if (this.cursors.up.isDown && this.jugador.body.touching.down){
          this.jugador.esSalto = true;
          this.jugador.body.velocity.y = -450;
          //this.jump_sound.play();
        }

        //Acciones de movimiento para las plataformas de juego
        this.plataformas.forEach(function(plat) {
          if(plat.desplazamiento == 1){//En caso de ser tipo 1, el desplazamiento sera hacia la derecha
            if(plat.body.x > this.game.width){
              plat.body.x = (0 - plat.body.width);
            }
            plat.body.velocity.x = 250;
          }else if(plat.desplazamiento == 2){//En caso de ser tipo 2, el desplazamiento sera hacia la izquierda
            if((plat.body.x + plat.body.width) < 0){
              plat.body.x = this.game.width;
            }
            plat.body.velocity.x = -150;
          }
        }, this);
      }
    },

    crearItem: function(){
      for (var i = 0; i < 5; i++){
        var tipo = Math.floor(Math.random() * 4);//Numero aleatorio entre 0 y 3
        var xItem = Math.floor(Math.random() * (this.game.width - 32)) + 32;
        var yItem = Math.floor(Math.random() * (this.game.world.bounds.height - 150)) + 50;
        var item = this.items.create(xItem, yItem, 'item', tipo);
        item.tipo = tipo;
        //item.body.gravity.y = 300;//Se agrega gravedad al objeto
        //item.body.bounce.y = 0.7 + Math.random() * 0.2;//Se agrega rebote al objeto
      }
    },

    recogerItem: function (jugador, item) {
        switch(item.tipo){
          case 0://Tipo cadena
            this.score.tipoCadena += 1;
            this.scoreText[0].setText(this.score.tipoCadena);
            break;
          case 1://Tipo numero
            this.score.tipoNumero += 1;
            this.scoreText[1].setText(this.score.tipoNumero);
            break;
          case 2://Tipo booleano
            this.score.tipoBool += 1;
            this.scoreText[2].setText(this.score.tipoBool);
            break;
          case 3://Tipo array
            this.score.tipoArray += 1;
            this.scoreText[3].setText(this.score.tipoArray);
            break;
        }
        item.kill();
    },

    updateTimer: function() {
      //Se comprueba que el tiempo de juego haya terminado
      if(this.maxtime == 0){
        this.siguiente = this.game.add.sprite(this.game.width/2, this.game.height/2,'btnContinuar');
        this.siguiente.anchor.setTo(0.5,0.5);
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

    clickListener: function() {
      //Se da paso al seiguiente nivel de juego (Segunda parte del nivel 1)
      this.game.state.start('nivel1_1',true,false,this.score);
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
    }
  };
  
  module.exports = Nivel1;
},{"../prefabs/pause":4}],11:[function(require,module,exports){

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
      this.scoreText[0] = this.game.add.bitmapText(this.cuadroScore.x + 75 , this.cuadroScore.y + 18, 'font','0',24);
      this.scoreText[1] = this.game.add.bitmapText(this.cuadroScore.x + 180 , this.cuadroScore.y + 18,'font','0',24);
      this.scoreText[2] = this.game.add.bitmapText(this.cuadroScore.x + 285 , this.cuadroScore.y + 18,'font','0',24);
      this.scoreText[3] = this.game.add.bitmapText(this.cuadroScore.x + 390 , this.cuadroScore.y + 18,'font','0',24);
      this.scoreText[4] = this.game.add.bitmapText(this.cuadroScore.x + 470 , this.cuadroScore.y + 5, 'font','0',20);
      this.scoreText[5] = this.game.add.bitmapText(this.cuadroScore.x + 470 , this.cuadroScore.y + 32,'font','0',20);
    
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

      this.textoItem = this.game.add.bitmapText(item.body.x , (item.body.y - 35),'font', txtItem, 24);
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
                    tempScoreText[0].setText(tempScore.tipoCadena);
                  break;
                  case 1:
                    tempScore.tipoNumero++;
                    tempScoreText[1].setText(tempScore.tipoNumero);
                    break;
                  case 2:
                    tempScore.tipoBool++;
                    tempScoreText[2].setText(tempScore.tipoBool);
                    break;
                  case 3:
                    tempScore.tipoArray++;
                    tempScoreText[3].setText(tempScore.tipoArray);
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
        tempScoreText[4].setText(tempScore.tipoCadena + tempScore.tipoNumero + tempScore.tipoBool  +tempScore.tipoArray);
        tempScoreText[5].setText(this.countErrorScore);
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
        var inicio = 4 * tipo;
        var final_ = inicio + 4;
        var frame = Math.floor(Math.random() * (final_ - inicio) + inicio);        
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

  
},{"../prefabs/pause":4}],12:[function(require,module,exports){

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
},{"../prefabs/pause":4,"../prefabs/textBox":6}],13:[function(require,module,exports){

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
},{"../prefabs/pause":4}],14:[function(require,module,exports){
 'use strict';
var Pausa = require('../prefabs/pause');
var Situacion = 
  [{
    "instrucciones": ' Hola, necesito pasar al otro lado del camino\n pero por este camino pasan muchas estampidas\n ayuda a cudrar la condicion para poder pasar\n cuando no este pasando una estampida', 
    "condiciones": [{'texto':'estampida() == true','respuesta':true},{'texto':'estampida() >= false','respuesta':false},{'texto':'estampida() <= true','respuesta':false}],
    "acciones" :  [{'texto':'cruzar();','respuesta':'slot2'},{'texto':'saltar();','respuesta':'invalida'},{'texto':'esperar();','respuesta':'slot1'},{'texto':'hablar();','respuesta':'invalida'},{'texto':'disparar();','respuesta':'invalida'}],
    "imgsituacion_1" : 'situacion4_1',
    "imgsituacion_2" : 'situacion4_1_Inv'
  },
  {
    "instrucciones": ' Hola,estoy en una carrera de obstaculos\n pero solo puedo saltar a menos de 50 mts \n antes que el obstaculo llegue cuadra la\n condicion para poder llegar a la meta',
    "condiciones": [{'texto':'obstaculo.distancia != 50','respuesta':false},{'texto':'obstaculo.distancia <= 50','respuesta':true},{'texto':'obstaculo.distancia == 51','respuesta':false}],
    "acciones" :  [{'texto':'saltar();','respuesta':'slot1'},{'texto':'esperar();','respuesta':'invalida'},{'texto':'correr();','respuesta':'slot2'},{'texto':'nadar();','respuesta':'invalida'},{'texto':'arrastrar();','respuesta':'invalida'}],
    "imgsituacion_1" : 'situacion4_2',
    "imgsituacion_2" : 'situacion4_1_Inv'
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
    score:0,
    intentosxsitua:0,

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
      this.score = 0;
      this.intentosxsitua = 0;
    },

    create: function(){
      this.game.world.setBounds(0, 0, 800, 600);
      //Fondo de juego
      this.game.add.tileSprite(0, 0,800,600, 'introN4');
      this.game.input.onDown.add(this.iniciarJuego,this);
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
      this.pasos  =this.game.add.sprite(230,460,'fondoPasos4');
      this.pasos.anchor.setTo(0.5,0.5);
      this.pasos.texto = this.game.add.bitmapText(this.pasos.x,this.pasos.y,'font','',18);
      this.pasos.texto.anchor.setTo(0.5,0.5);

      //Imagen de fondo para el tiempo
      this.cuadroTime = this.game.add.sprite(230, 40,'time');
      this.cuadroTime.anchor.setTo(0.5, 0.5);
      //Se setea el texto para el cronometro
      this.timer = this.game.add.bitmapText(230, 40 ,'font', '00:00', 32);
      this.timer.anchor.setTo(0.5,0.5);

      //Se crear text para el score
      this.scoretext = this.game.add.bitmapText(20, 25 ,'font', 'Puntaje: 0', 24);
      this.scoretext.anchor.setTo(0,0.5);

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
      //Imagen inicial de la sitacion      
      this.situacion = this.game.add.sprite(30,60,'situacion1');
      
      //Se restablece el tiempo
      this.maxtime= 90; 
      this.intentosxsitua = 0;
      //Se crea slot de estructura if
      this.slot = this.items.create(479,40,'slotIF');
      var textif = this.game.add.text((this.slot.x +26),(this.slot.y + 23),'if (                             ){',{font: '24px calibri', fill: '#fff', align:'center'});
      textif.anchor.setTo(0,0.5);
      textif.fontWeight = 'bold';

      var textelse = this.game.add.text((this.slot.x +26),(this.slot.y + 23),'} else{',{font: '24px calibri', fill: '#fff', align:'center'});
      textelse.anchor.setTo(0,0.5);
      textelse.fontWeight = 'bold';

      //Se establece los pasos de la situacion
      this.pasos.texto.setText(Situacion[this.intSituacion].instrucciones);

      var textCierr = this.game.add.text((this.slot.x +26),(this.slot.y + 231),'}',{font: '24px calibri', fill: '#fff', align:'center'});
      textCierr.anchor.setTo(0,0.5);
      textCierr.fontWeight = 'bold';
      //creamos las acciones de la situación
      var yitem = 340;
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
      yitem = 340;
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
          //Se ejecuta la animacion 
          this.situacion.visible = false;
          if(this.situacion4_1!=null){this.situacion4_1.kill();} 
          if(this.situacion4_1_Inv!=null){this.situacion4_1_Inv.kill();}
          this.situacion4_1 =  this.game.add.sprite(30,60,Situacion[this.intSituacion].imgsituacion_1);
          var anim = this.situacion4_1.animations.add('anima',[0,1,2,3,4,5,6,7,8,9], 10, false);
          anim.onComplete.add(function(){
            this.situacion4_1.visible = false;            
            this.slotCondicion = this.slotAccion_1 = this.slotAccion_2 = false;                     
            this.score += (50 - (this.intentosxsitua*5));
            this.scoretext.setText('Puntaje: ' + this.score);            
            this.intSituacion++;
            //Se determina si es la ultima situacion
            if(this.intSituacion>=2){            
              this.siguiente = this.game.add.sprite(this.game.width/2 , this.game.height/2 ,'btnContinuar');
              this.siguiente.inputEnabled = true;
              this.siguiente.events.onInputDown.add(this.clickListener, this);
              this.siguiente.fixedToCamera = true; 
              this.siguiente.anchor.setTo(0.5,0);
            } else{
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
          var anim =this.situacion4_1_Inv.animations.add('anima',[0,1,2,3,4,5,6,7,8,9], 10, false);             
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
    clickListener: function(){
       this.game.state.clearCurrentState();
       this.game.state.start("play");
    },

    clickSiguiente: function(){ 
      this.items.forEach(function(item) {            
        if(item.texto != null){item.texto.kill();}
        item.kill();
      });   
      this.crearSituacion(); 
      this.MensajeAyuda.texto.kill();      
      this.MensajeAyuda.kill();
      this.siguiente.kill();       
    },

    clickIntentar: function(){      
      this.MensajeAyuda.texto.kill();      
      this.MensajeAyuda.kill();
      this.siguiente.kill();
    },

    mensaje:function(respuesta){      
      //Se agrega el panel
      this.MensajeAyuda = this.game.add.sprite(this.game.width/2, this.game.height/2, 'fondoPausa');      
      this.MensajeAyuda.anchor.setTo(0.5, 0.5);
      if(respuesta){
        this.MensajeAyuda.texto = this.game.add.bitmapText(this.MensajeAyuda.x,this.MensajeAyuda.y,'font','Muy bien felicitaciones,\ngracias por ayudarme ahora \nvamos por otro reto',18);
        this.MensajeAyuda.texto.anchor.setTo(0.5,0.5);
      }else{
        this.MensajeAyuda.texto = this.game.add.bitmapText(this.MensajeAyuda.x,this.MensajeAyuda.y,'font','Lo siento, pero la condicion \nesta mal construida vuelve a intentarlo\n y recuerda lo que esta dentro del if\nse ejecuta si la condicion se cumple \n en caso contrario se ejecuta el else',18);
        this.MensajeAyuda.texto.anchor.setTo(0.5,0.5);
      }
      this.siguiente = this.game.add.sprite(this.game.width/2, this.game.height/2 + 58,'btnContinuar');
      this.siguiente.inputEnabled = true;
      if(respuesta){
        this.siguiente.events.onInputDown.add(this.clickSiguiente, this);
      }else{
        this.siguiente.events.onInputDown.add(this.clickIntentar, this);
      }
      this.siguiente.fixedToCamera = true; 
      this.siguiente.anchor.setTo(0.5,0);
    },

  };

  module.exports = Nivel4;
},{"../prefabs/pause":4}],15:[function(require,module,exports){

  'use strict';
  var Pausa = require('../prefabs/pause');
  var textBox = require('../prefabs/textBox');
  var Situacion = 
    [{
      "tipo"  : 'for',
      "iteraciones" : 20,
      "instrucciones": ' Hola, necesito pasar al otro lado del camino\n pero por este camino pasan muchas estampidas\n ayuda a cudrar la condicion para poder pasar\n cuando no este pasando una estampida', 
      "ciclo": [{'texto':'var i = 0; i >= [   ]; i++','respuesta':true},{'texto':'var i = 0; i >= [   ]; i--','respuesta':false},{'texto':'var i = 100; i <= [   ]; i--','respuesta':false}],
      "acciones" :  [{'texto':'cruzar();','respuesta': true},{'texto':'saltar();','respuesta':false},{'texto':'esperar();','respuesta':false},{'texto':'hablar();','respuesta':false},{'texto':'disparar();','respuesta':false}]
    },
    {
      "tipo"  : 'while',
      "instrucciones": ' Holi, necesito pasar al otro lado del camino\n pero por este camino pasan muchas estampidas\n ayuda a cudrar la condicion para poder pasar\n cuando no este pasando una estampida', 
      "ciclo": [{'texto':'obstaculo.distancia != 50','respuesta':false},{'texto':'obstaculo.distancia <= 50','respuesta':true},{'texto':'obstaculo.distancia == 51','respuesta':false}],
      "acciones" :  [{'texto':'saltar();','respuesta':'slot1'},{'texto':'esperar();','respuesta':'invalida'},{'texto':'correr();','respuesta':'slot2'},{'texto':'nadar();','respuesta':'invalida'},{'texto':'arrastrar();','respuesta':'invalida'}]
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

    crearSituacion:function(){
      //Se restablece el tiempo
      this.maxtime= 90; 
      this.intentosxsitua = 0;
      this.tiempo.start();
      //Se establece los pasos de la situacion
      this.pasos.texto.setText(Situacion[this.intSituacion].instrucciones);
      //Se crea slot de estructura if
      this.slot = this.items.create(479,40,'slotIF');
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
      Situacion[this.intSituacion].ciclo.forEach(function(condiciontext) {
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
          this.intSituacion++;
          if(this.intSituacion<2){
            this.slotCiclo = this.slotAccion_1 = false;
            this.items.forEach(function(item) {            
              if(item.texto != null){item.texto.kill();}
              item.kill();
            });
            alert("Correcto");
            this.score += (50 - (this.intentosxsitua*5));
            this.scoretext.setText('Puntaje: ' + this.score);
            //Se habilitan botones de eleccion de ciclo
            this.btnwhile.visible = true;
            this.btnfor.visible = true;
            //Detener metodo de update
            this.tiempo.stop();
          }else{
            this.siguiente = this.game.add.sprite(this.game.width/2 - 75, this.game.height/2 - 25,'btnContinuar');
            this.siguiente.inputEnabled = true;
            this.siguiente.events.onInputDown.add(this.clickListener, this);
            this.siguiente.fixedToCamera = true; 
          }
        }else{
          alert("Vuelve a intentarlo");
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
        }else if(item.tipo == 1 && item.body.y >= (this.slot.body.y + 7) && item.body.y <= (this.slot.body.y + 40) && item.body.x >= (this.slot.body.x + 68) && item.body.x <= (this.slot.body.x + 220) ){
          if(!this.slotCiclo){
            //Creamos el item el cual encaja en el slot de la accion          
            var itemEncajado = this.items.create( (this.slot.body.x + 132),(this.slot.body.y + 24),'condicion');
            itemEncajado.anchor.setTo(0.5,0.5);
            itemEncajado.texto = item.texto;
            itemEncajado.respuesta = item.respuesta;
            itemEncajado.texto.x = itemEncajado.x;
            itemEncajado.texto.y = itemEncajado.y;
            itemEncajado.slotC = true;          
            item.kill();
            //Se crea la caja de texto para ciclo for
            if(Situacion[this.intSituacion].tipo == 'for'){
              this.cajaTexto = new textBox(this.game,(this.slot.body.x)+155,(this.slot.body.y)+15,16,15,"0");
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


  };

  module.exports = Nivel5;
},{"../prefabs/pause":4,"../prefabs/textBox":6}],16:[function(require,module,exports){

  'use strict';
  var Pausa = require('../prefabs/pause');
  var Editor = require('../prefabs/editor');
  var Tablero = require('../prefabs/tablero');

  function Nivel6() {}
  Nivel6.prototype = {

    /*Definicion de propiedades*/
    pasoActual: 0,
    codigoActivo: true,
    flagpause: false,

    init:function(){
      this.pasoActual = 0; 
      this.flagpause= false;     
    },

    create: function() {
      this.game.world.setBounds(0, 0, 800, 600);
      //Fondo de juego
      this.game.add.tileSprite(0, 0,800,600, 'introN6');
      this.game.input.onDown.add(this.iniciarJuego,this);

      this.game.add.bitmapText(470, 160, 'font', 'Hola, ha sido un largo\ncamino y ha llegado la\nhora de un reto de\nverdad, en este nivel\ntendras la oportunidad\naprender del uso de\nfunciones por medio de\nla práctica.\nPara completar el nivel\ntendras que escribir\ncodigo Javascript\ny completar cada reto.\n\nEstas listo?!', 24);
    },

    iniciarJuego : function(game){
      var x1 = 531;
      var x2 = 680;
      var y1 = 480;
      var y2 = 550;
      if(game.x > x1 && game.x < x2 && game.y > y1 && game.y < y2 ){                 
          this.empezar();        
      }
    }, 

  	empezar: function() {
      //Fondo de juego
      this.game.add.tileSprite(0, 0,800,600, 'tile_nivel6');
	  	//Se incluye el editor de texto
      this.game.add.sprite(320,25,'fondoEditor');
      this.editor = new Editor(this.game,170,20,400,20);
      this.game.add.existing(this.editor);
      this.editor.seleccionado = false;//Se inhabilita el editor de codigo
      //S incluye el tablero juego
      this.tablero = new Tablero(this.game,20,30,5,5);
      this.game.add.existing(this.tablero);
      //Se agregan los sprotes dentro del tablero de juego
      this.dude = this.tablero.setObjCuadro(0,0,'dude','',15);
      //Se registrar los eventos de los botones 
      this.crearFunc = this.game.add.sprite(340, 350,'btnContinuar');
      this.crearFunc.inputEnabled = true;
      this.crearFunc.events.onInputDown.add(this.crearFuncion, this);
      this.crearFunc.visible = false;

      this.run = this.game.add.sprite(470, 325,'btnEjecutar6');
      this.run.inputEnabled = true;
      this.run.events.onInputDown.add(this.correrCodigo, this);
      this.run.visible = false;

      //Se da inicio al nivel con el las instrucciones de juego
      this.cuadroIns = this.game.add.sprite(this.game.world.centerX,370,'fondoPasos');
      this.cuadroIns.anchor.setTo(0.5,0);

      this.btnContinuar = this.game.add.sprite(this.game.world.centerX, 475,'btnSiguiente6');
      this.btnContinuar.anchor.setTo(0.5,0.5);
      this.btnContinuar.inputEnabled = true;
      this.btnContinuar.events.onInputDown.add(this.pasoSiguiente, this);

      this.txtIns = this.game.add.bitmapText(this.game.world.centerX , 415, 'font', '', 18);
      this.txtIns.anchor.setTo(0.5,0.5);
      this.txtIns.wordWrap = true;
      this.txtIns.wordWrapWidth = 250;
      this.txtIns.tint = 0xFFFFFF;
      this.instrucciones(this.pasoActual);

      //Se agrega el boton de pausa
      this.btnPausa = this.game.add.button((this.game.width - 81), 10, 'btnPausa');
      this.btnPausa.frame = 1;
      this.btnPausa.fixedToCamera = true;

       //Se incluye el panel de pausa al nivel
      this.pnlPausa = new Pausa(this.game);
      this.game.add.existing(this.pnlPausa);
      this.game.input.onDown.add(this.pausaJuego,this);
  	},

    instrucciones: function(paso){
      switch(paso){//Se define la instruccion a mostrar
        case 0:
          this.txtIns.setText('Hola, por medio del editor de código debemos\nayudar al personaje a cumplir una\nserie de tareas ');
          break;
        case 1:
          this.txtIns.setText('Para poder ayudarlo debemos conocer sus\npropiedades, las cuales permitirán\nsu manipulación');
          break;
        case 2:
          this.txtIns.setText('Además de las propiedades, el personaje\ncuenta con una serie de métodos que\nharán todo aún mas fácil');
          break;
        case 3:
          this.txtIns.setText('Para que hable se puede hacer uso\nde dude.mostrar(),\ninténtalo');
          this.habilitaEditor(true);
          break;
        case 4:
          this.txtIns.setText('Muy bien, ahora veamos que puede decirnos\nsobre el. Intenta con\ndude.mostrar(dude.prop())\nesto mostrará las propiedades que podemos\nmanipular sobre el personaje');
          this.habilitaEditor(true);
          break;
        case 5:
          this.txtIns.setText('Genial, ahora intenta obtener consejos de\nla siguiente manera.\ndude.mostrar(dude.consejo())');
          this.habilitaEditor(true);
          break;
        case 6:
          this.txtIns.setText('Perfecto, recuerda que puedes hacer uso\nde los consejos en cualquer momento que\ndesees y siempre se mostrarán de forma\naleatoria');
          break;
        case 7:
          this.txtIns.setText('Como ya sabes todo lo que necesitas saber\nsobre el personaje\n\nEmpecemos!');
          break;
        case 8:
          this.txtIns.setText('Recuerdas la propiedad para posición en X\nu horizontal del personaje?\nIntenta cambiar su posicion en X sumando 1\na la posición actual\ndude.posx++');
          this.habilitaEditor(true);
          break;
        case 9:
          this.txtIns.setText('Bien, ahora intenta modificar la posición\nen Y o vertical del personaje');
          this.habilitaEditor(true);
          break;
        case 10:
          this.txtIns.setText('Correcto, recuerda que el personaje tiene\npiernas cortas y solo puede desplazarse\nun cuadro a la vez');
          this.habilitaEditor(false);
          break;
        case 11:
          this.dude.posx = 0;
          this.dude.posy = 0;
          this.tablero.setObjCuadro(0, 0, '', this.dude);
          this.txtIns.setText('Por ello, tu primera misión es encontrar\nla manera de facilitar el movimiento del\npersonaje a lo largo del tablero');
          break;
        case 12:
          this.txtIns.setText('Las funciones son un conjunto de\ninstrucciones para realizar una tarea en\nespecífico. Diseñaremos una que permita mover\nmultiples casillas al personaje');
          break;
        case 13:
          this.txtIns.setText('Para declarar la función empieza escribiendo\nfunction\nseguido por el nombre de la función\nseguido por (), en estos\nparentesis se ubicarán los parametros');
          this.habilitaEditor(true);
          break;
        case 14:
          this.txtIns.setText('Ya que es un conjunto de instrucciones\nes necesario definir cual es su punto de \ninicio; después del parentesis utiliza\nun corchete de apertura para definir\nel inicio');
          break;
        case 15:
          this.txtIns.setText('Deberias tener algo parecido a\nfunction mover(){\nno te alarmes si genera error, aun falta\nmucho por hacer');
          break;
      }
      this.codigoActivo = true;
    },

    pasoSiguiente: function(){
      if(!this.editor.seleccionado){
        switch(this.pasoActual){
          /*Pasos de texto (Tan solo generan siguiente)*/
          case 0:
          case 1:
          case 2:
          case 6:
          case 7:
          case 10:
          case 11:
          case 12:
          case 13:
            this.pasoActual++;
            break;
        }
        this.instrucciones(this.pasoActual);
      }else{
        switch(this.pasoActual){
        /*Pasos de instruccion durante codificacion*/
          case 13:
          case 14:
            this.pasoActual++;
            this.instrucciones(this.pasoActual);
            break;
          default:
            this.editor.glow(true);
            break;
        }
      }
    },

    crearFuncion: function(){
      
    },

    habilitaEditor: function(estado){
      //Se cambia el estado del editor para su edicion
      this.editor.seleccionado = estado;
      this.run.visible = estado;
      if(estado == true){
        this.editor.limpiar();
      }
    },

    correrCodigo: function(){
      if(this.codigoActivo){
        this.codigoActivo = false;
        this.editor.hideError();//Se ocultan errores del editor
        this.editor.glow(false);//Se elimina el brillo
        switch(this.pasoActual){//Se valida la accion a tomar respecto al paso actual
          /*Pasos introductorios*/
          case 3://Paso dude.mostrar()
          case 4://Paso dude.mostrar(dude.prop())
          case 5://Paso dude.mostrar(dude.consejo())
            var correcto = false;
            this.correrLineas();
            if(this.dude.msjBandera == true){//En caso de haber mostrado el msj de prueba correctamente
              if(this.pasoActual == 4){
                if(this.dude.propBandera == true){
                  correcto = true;
                }else{
                  this.editor.glow(true);
                }
              }else if(this.pasoActual == 5){
                if(this.dude.consBandera == true){
                  correcto = true;
                }else{
                  this.editor.glow(true);
                }
              }else{
                correcto = true;
              }
            }else{
              this.editor.glow(true);
            }
            if(correcto){
              this.codCorrecto();
            }else{
              this.codigoActivo = true;
            }
            break;
          /*Pasos movimiento de personaje*/
          case 8://Paso dude.posx++
          case 9://Paso dude.posy++
            setTimeout(this.correrLineaPasoPaso,750,0,this,this.pasoActual);
            break;
          default:
            setTimeout(this.correrLineaPasoPaso,750,0,this);
            break;
        }
      }
    },

    codCorrecto: function(){
      this.editor.seleccionado = false;//Se inhabilita el editor de codigo
      this.pasoActual++;
      this.instrucciones(this.pasoActual);
      this.habilitaEditor(false);
    },

    validaciones: function(){
      var difX = Math.abs(this.dude.posx - this.dude.propiedades[0].val);
      var difY = Math.abs(this.dude.posy - this.dude.propiedades[0].val);
      
      if(difX > 1 || difY > 1){//Se valida intento de desplazamiento de mas de una casilla
        this.dude.mostrar("No puedo moverme por tantas casillas al tiempo :(");
        this.dude.posx = this.dude.propiedades[0].val;//Valor temporal de la propiedad posx
        this.dude.posy = this.dude.propiedades[1].val;//Valor temporal de la propiedad posy
        return false;
      }else if(this.dude.posx < 0 || this.dude.posx > 4){//Se valida limites de tablero en X
        this.dude.mostrar("No puedo desplazarme afuera del tablero :(");
        this.dude.posx = this.dude.propiedades[0].val;//Valor temporal de la propiedad posx
        return false;
      }else if(this.dude.posy < 0 || this.dude.posy > 4){//Se valida limites de tablero en Y
        this.dude.mostrar("No puedo desplazarme afuera del tablero :(");
        this.dude.posy = this.dude.propiedades[1].val;//Valor temporal de la propiedad posy
        return false;
      }else{
        return true;
      }
    },

    correrLineas: function(){
      var i_temp = 0;
      try{
        for(var i=0;i<this.editor.created_lines;i++){
          i_temp = i;
          var instruccion = this.editor.getTextLine(i);
          var F=new Function ("dude",instruccion);
          F(this.dude);
        }
      }catch(err){
        this.editor.showError(err.name,i_temp);
        this.codigoActivo = true;
      }
    },

    correrLineaPasoPaso:function(i,e,paso){
      try{
        if(i < e.editor.created_lines){
          var instruccion = e.editor.getTextLine(i);
          var F=new Function ("dude",instruccion);
          F(e.dude);
          if(e.validaciones() == true){
            e.tablero.setObjCuadro(e.dude.posx, e.dude.posy, '', e.dude);
            if(paso){//En caso de requerir validaciones especiales debido al paso actual
              if(paso == 8){//Paso movimiento inicial en X
                if(e.dude.xBandera == true){//Se comprueba que se haya realizado el movimiento en X
                  e.codCorrecto();
                }else{
                  e.codigoActivo = true;
                  e.editor.glow(true);
                }
              }else if(paso == 9){//Paso movimiento inicial en Y
                if(e.dude.yBandera == true){//Se comprueba que se haya realizado el movimiento en Y
                  e.codCorrecto();
                }else{
                  e.codigoActivo = true;
                  e.editor.glow(true);
                }
              }
            }
          }else{
            e.codigoActivo = true;
          }
          i++;
          setTimeout(e.correrLineaPasoPaso,750,i,e);
        }
        e.editor.hideError();
      }catch(err){
        e.editor.showError(err.name,i);    
        e.codigoActivo = true;    
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

  module.exports = Nivel6;
},{"../prefabs/editor":2,"../prefabs/pause":4,"../prefabs/tablero":5}],17:[function(require,module,exports){

  'use strict';
  function Play() {}
  Play.prototype = {
    create: function() {
      this.btns = this.game.add.group();
      this.crearBoton(0,0,'nivel1',195,50,'Hola, aquí aprenderás sobre\nlos tipos de dato básicos de\njavascript. Intentalo!');
      this.crearBoton(0,100,'nivel2',305,150,'Sumérgete en un juego lleno\nde diversión mientras aprendes\na manipular variables. Vamos!');
      this.crearBoton(0,200,'nivel3',205,250,'Prueba tu agilidad y lógica por\nmedio del uso de operadores\nlógicos. Empecemos!');
      this.crearBoton(0,300,'nivel4',310,350,'Preparado?  Conoce, aprende y\nmanipula las estructuras\ncondicionales. Adelante!');
      this.crearBoton(0,400,'nivel5',305,450,'');
      this.crearBoton(0,500,'nivel6',308,550,'Estas listo para probar todos\ntus conocimientos? Es hora de\nempezar a codificar. Vamos!');
    },

    update: function() {

    },

    crearBoton: function(x,y,llave,txt_x,txt_y,txt){
      var boton = this.game.add.sprite(x, y,llave,0);
      boton.nivel = llave;
      var anim = boton.animations.add('over', [0,1,2,3,4,5,6], 10, false);
      anim.onComplete.add(function() {
        if(boton.texto){
          boton.texto.revive();
        }else{
          boton.texto = this.game.add.bitmapText(txt_x, txt_y, 'font', txt, 20);
        }
        boton.texto.anchor.setTo(0,0.5);
      }, this);
      boton.inputEnabled = true;
      boton.events.onInputDown.add(this.clickListener, this);
      boton.events.onInputOver.add(this.over, this);
      boton.events.onInputOut.add(this.out, this);
      this.btns.add(boton);
    },

    clickListener: function(boton) {
      this.game.state.start(boton.nivel);
    },

    over: function(boton){
      boton.animations.play('over');
    },

    out: function(boton){
      boton.animations.stop('over');
      boton.frame = 0;
      if(boton.texto){
        boton.texto.kill();
      }
    }
  };
  
  module.exports = Play;
},{}],18:[function(require,module,exports){

'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.asset = this.add.sprite(this.width/2,this.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);

    /*Imagenes Menu e intro*/
    this.load.image('intro', 'assets/images/Menu/intro.jpg');
    this.load.spritesheet('nivel1', 'assets/images/Menu/nivel1.jpg',800,100);
    this.load.spritesheet('nivel2', 'assets/images/Menu/nivel2.jpg',800,100);
    this.load.spritesheet('nivel3', 'assets/images/Menu/nivel3.jpg',800,100);
    this.load.spritesheet('nivel4', 'assets/images/Menu/nivel4.jpg',800,100);
    this.load.spritesheet('nivel5', 'assets/images/Menu/nivel2.jpg',800,100);
    this.load.spritesheet('nivel6', 'assets/images/Menu/nivel6.jpg',800,100);
    this.load.spritesheet('ayudaGeneral', 'assets/images/Menu/ayuda.jpg',800,600);

    /*Botones y generales*/
    this.load.image('btnContinuar', 'assets/images/Botones/btnContinuar.png');
    this.load.spritesheet('btnPausa', 'assets/images/Botones/btnPausa.png',45,45);
    this.load.image('fondoPausa', 'assets/images/Botones/fondoPausa.png');
    this.load.image('time','assets/images/Botones/time.png');
    this.load.spritesheet('OpcPausa', 'assets/images/Botones/opcPausa.png',54,49);

    /*Imagenes nivel 1*/
    this.load.image('tile_nivel1', 'assets/images/Nivel 1/tile.jpg');
    this.load.image('piso', 'assets/images/Nivel 1/piso.jpg');
    this.load.image('plataforma', 'assets/images/Nivel 1/plataforma.jpg');
    this.load.spritesheet('item', 'assets/images/Nivel 1/item.png',32,31);
    this.load.spritesheet('personaje', 'assets/images/personaje.png', 48, 68);
    this.load.image('score1', 'assets/images/Nivel 1/score_1.png');
    this.load.image('score1_1', 'assets/images/Nivel 1/score_1_1.png');
    this.load.spritesheet('tubo', 'assets/images/Nivel 1/tubo.png',190,100);
    this.load.spritesheet('MensajeAyuda','assets/images/Nivel 1/msjs.png',234,135);
    this.load.image('introN1', 'assets/images/Nivel 1/intro.jpg');

    /*Imagenes nivel 2*/
    this.load.image('tile_nivel2', 'assets/images/Nivel 2/tile.jpg');
    this.load.image('resortera', 'assets/images/Nivel 2/resortera.png');
    this.load.spritesheet('lanzador','assets/images/Nivel 2/piedras.png',46,53);
    this.load.spritesheet('personaje2','assets/images/Nivel 2/jugador.png',49,75);
    this.load.spritesheet('explosion','assets/images/Nivel 2/explosion.png',84,93);
    this.load.spritesheet('MensajeAyuda2','assets/images/Nivel 2/msjs.png',234,135);
    this.load.image('introN2', 'assets/images/Nivel 2/intro.jpg');

    /*Imagenes nivel 3*/
    this.load.image('tile_nivel3', 'assets/images/Nivel 3/tile.jpg');
    this.load.image('fondo3', 'assets/images/Nivel 3/cuadros.png');
    this.load.spritesheet('item3','assets/images/Nivel 3/items.png',80,80);
    this.load.image('slot','assets/images/Nivel 3/slot.png');
    this.load.image('introN3', 'assets/images/Nivel 3/intro.jpg');
    this.load.spritesheet('MensajeAyuda3','assets/images/Nivel 3/msjs.png',275,180);

    /*Imagenes nivel 4*/
    this.load.image('introN4', 'assets/images/Nivel 4/intro.jpg');
    this.load.image('tile_nivel4','assets/images/Nivel 4/tile.png');
    this.load.image('slotIF','assets/images/Nivel 4/slot.png');
    this.load.image('accion_large','assets/images/Nivel 4/accion_large.png');
    this.load.image('accion_small','assets/images/Nivel 4/accion_small.png');
    this.load.image('condicion','assets/images/Nivel 4/condicion.png');
    this.load.image('btnEjecutar4','assets/images/Nivel 4/btnEjecutar.png');
    this.load.image('fondosituacion','assets/images/Nivel 4/fondosituacion.png');
    this.load.image('fondoPasos4','assets/images/Nivel 4/fondoPasos.png');
    this.load.spritesheet('situacion1','assets/images/Nivel 4/situacion.png',401,273);
    this.load.spritesheet('situacion4_1','assets/images/Nivel 4/anim_caminar.png',401,273);
    this.load.spritesheet('situacion4_1_Inv','assets/images/Nivel 4/anim_estampida.png',401,273);
    this.load.spritesheet('situacion4_2','assets/images/Nivel 4/anim_salto.png',401,273)
     /*Imagenes nivel 5*/
    this.load.image('btnfor','assets/images/Nivel 5/btnfor.jpg');
    this.load.image('btnwhile','assets/images/Nivel 5/btnwhile.jpg');    


    /*Imagenes nivel 6 - Editor de codigo*/
    this.load.image('tile_nivel6', 'assets/images/Nivel 6/tile.png');
    this.load.image('introN6', 'assets/images/Nivel 6/intro.jpg');
    this.load.spritesheet('dude','assets/images/personaje_50.png',35,50);
    this.load.image('btnSiguiente6','assets/images/Nivel 6/btnSiguiente.png');
    this.load.image('btnEjecutar6','assets/images/Nivel 6/btnEjecutar.png');
    this.load.image('fondoEditor','assets/images/Nivel 6/fondoEditor.png');
    this.load.image('fondoPasos','assets/images/Nivel 6/fondoPasos.png');
    this.load.image('fondoTablero','assets/images/Nivel 6/fondoTablero.png');
    this.load.image('globo1','assets/images/Nivel 6/globo1.png');
    this.load.image('globo2','assets/images/Nivel 6/globo2.png');
    this.load.image('globo3','assets/images/Nivel 6/globo3.png');  

    /*Audios de juego*/
    this.load.audio('error_sound', 'assets/audio/generales/error.wav');
    this.load.audio('jump_sound', 'assets/audio/generales/salto.wav');

    /*Bitmap text*/
    this.load.bitmapFont('font1', 'assets/fonts/font1/font1.png', 'assets/fonts/font1/font1.fnt');
    this.load.bitmapFont('font', 'assets/fonts/font/font.png', 'assets/fonts/font/font.fnt');
  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('menu');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;

},{}]},{},[1])