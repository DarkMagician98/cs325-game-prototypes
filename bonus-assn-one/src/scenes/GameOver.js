import Phaser from '../lib/phaser.js'
import Game from './Game.js'

export default class GameOver extends Phaser.Scene {

    click
    unclick
    score
    sc = 0

    constructor() {
        super('game-over')
    }

    preload() {
        this.load.image('bg','./assets/bg_layer1.png');
    }

    create() {
        this.cameras.main.setBackgroundColor(0xFF8C00);
        const width = this.scale.width;
        const height = this.scale.height;
        let count = 0;

        this.add.text(width * 0.5, height * 0.5, 'Game Over', {
                fontSize: 48
            })
            .setOrigin(0.5);

        this.add.text(width * 0.5, height * 0.5+40, 'Press F to play again', {
                fontSize: 20
            })
            .setOrigin(0.5);

        this.input.keyboard.once('keydown-F', () => {
            this.scene.start('game');
            this.scene.stop();
        });

    }
    update() {
    }

}