
  'use strict';
  function Play() {}
  Play.prototype = {
    create: function() {
      /*this.game.physics.startSystem(Phaser.Physics.ARCADE);
      this.sprite = this.game.add.sprite(this.game.width/2, this.game.height/2, 'yeoman');
      this.sprite.inputEnabled = true;
      
      this.game.physics.arcade.enable(this.sprite);
      this.sprite.body.collideWorldBounds = true;
      this.sprite.body.bounce.setTo(1,1);
      this.sprite.body.velocity.x = this.game.rnd.integerInRange(-500,500);
      this.sprite.body.velocity.y = this.game.rnd.integerInRange(-500,500);

      this.sprite.events.onInputDown.add(this.clickListener, this);*/

      this.nivel1 = this.game.add.sprite(this.game.width/3, 20,'nivel1');
      this.nivel1.nivel = 'nivel1';
      this.nivel1.inputEnabled = true;
      this.nivel1.events.onInputDown.add(this.clickListener, this);

      this.nivel2 = this.game.add.sprite(this.game.width/3, 110,'nivel2');
      this.nivel2.nivel = 'nivel2'
      this.nivel2.inputEnabled = true;
      this.nivel2.events.onInputDown.add(this.clickListener, this);

      this.nivel3 = this.game.add.sprite(this.game.width/3, 200,'nivel2');
      this.nivel3.nivel = 'nivel3'
      this.nivel3.inputEnabled = true;
      this.nivel3.events.onInputDown.add(this.clickListener, this);

      this.nivel5 = this.game.add.sprite(this.game.width/3, 500,'nivel2');
      this.nivel5.nivel = 'nivel5'
      this.nivel5.inputEnabled = true;
      this.nivel5.events.onInputDown.add(this.clickListener, this);
    },
    update: function() {

    },
    clickListener: function(boton) {
      this.game.state.start(boton.nivel);
    }
  };
  
  module.exports = Play;