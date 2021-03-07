import Phaser from '../lib/phaser.js'

//const scenes = [a,b];
//const playGame = new Game();
//const gameOver = new GameOver();

//export default {scenes};


var a = Phaser.Class({
    Extends: Phaser.Scene,

    initialize:

        function SceneA() {
            Phaser.Scene.call(this, {
                key: 'sceneA'
            });
        },

    preload: function () {
        //this.load.image('face', 'assets/pics/bw-face.png');
      //  playGame.preload();
    },


    create: function () {
     //   this.cameras.main.setBackgroundColor('rgba(255, 0, 0, 0.5)');
      //  playGame.create();
        /*
        a = 10;
        this.add.sprite(400, 300, 'face').setAlpha(0.2);

        let scoreText = this.add.text(100,100,'Score: ' + a,{
            color: '#255',
            fontSize: '32px',
            fill: '#255'
        });
        */


        this.input.once('pointerdown', function () {

            console.log('From SceneA to SceneB');
            this.scene.start('sceneB');

        }, this);
    },
    update: function () {
    //    playGame.update();
    }


});

var b = Phaser.Class({
    Extends: Phaser.Scene,

    initialize:

        function SceneA() {
            Phaser.Scene.call(this, {
                key: 'sceneB'
            });
        },

    preload: function () {
        this.load.image('bg','assets/bg_layer1.png');
    },

    create: function () {

        this.add.image(100,100,'bg');


        let scoreText = this.add.text(100,100,"Hello World",{
            fontSize: 100, color: 255, fill: 255
           // color: #256,
          //  fill: #111,
        });
  //      gameOver.create();

  /**
   * @type {Phaser.Input.Keyboard}
   */


  this.input.keyboard.on('keydown-A', function () {

    this.scene.start('sceneA');

}, this);


    },
    update: function () {
  //      gameOver.update();
    }


});

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    scene: [ a,b,]
};

var game = new Phaser.Game(config);