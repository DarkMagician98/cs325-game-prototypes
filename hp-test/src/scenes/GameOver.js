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

    preload(){
        this.score = 0;

        this.load.image('unclick','assets/unclick_exit.png');
        this.load.image('click','assets/click_exit.png');

    }
    
    create() {

        

        const width = this.scale.width;
        const height = this.scale.height;
        let count = 0;

        this.click = this.physics.add.staticSprite(16,16,'click').setOrigin(0).setScale(5).refreshBody();
        this.unclick = this.physics.add.staticSprite(16,16,'unclick').setOrigin(0).setScale(5).refreshBody();
      
        
       
        this.add.text(width * 0.5, height * 0.5, 'Game Over', {
                fontSize: 48
            })
            .setOrigin(0.5);

        this.click.setInteractive({draggable: true});

        this.click.on('pointerdown',()=>{
            
        });

        let sc = 0;

        
            this.input.keyboard.once('keydown-SPACE', () =>{ 
                this.scene.start('game');
                this.scene.stop();
            });     
            
          //  this.sys.game._VOLUME = 30;
            
    }
    update(){
        this.sc++;

        if(this.sc === 100){
            this.sys.game._VOLUME=this.sc;
        }

    }
    
}