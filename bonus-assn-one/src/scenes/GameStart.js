import Phaser from '../lib/phaser.js'

export default class GameStart extends Phaser.Scene{
    constructor(){
        super('start-scene');
    }

    preload(){
        this.load.image('carrot','./assets/carrot.png');
        this.load.image('bg','./assets/bg_layer1.png');
    }

    create(){
        this.add.image(0,0,'bg').setOrigin(0);
        this.add.image(45,200,'carrot').setOrigin(0).setScale(.6);
        this.title = this.add.text(110,200,'Carrot Defender',{
            fontSize: 45,
            fill: '#FF8C00'
        });

        this.title.setOrigin(0);

        this.startButton = this.add.text(200,280,'Press F to start',{
            fontSize: 20,
            fill: '	#FF8C00'
        });

        this.tweens.add({
            targets: this.startButton,
            alpha: 0,
            duration: 1000,
            repeat: 1000
        });

        this.input.keyboard.once('keydown-F', () => {
            this.scene.start('game');
            this.scene.stop();
        });

    }

    update(){

    }
}