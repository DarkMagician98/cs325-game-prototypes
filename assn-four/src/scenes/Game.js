import Phaser from '../lib/phaser.js'
import Carrot from '../game/Carrot.js'
//import { Math } from 'phaser'

//var player;


export default class Game extends Phaser.Scene {

    /** @type {Phaser.Physics.Arcade.Sprite} */
    maxHealth
    currentHealth

  
    cursors
    text

    damage
    heal
    hp
    hpUI
    snow

    constructor() {
        super('game')
    }

    init(){
       // this.check = this.sys.game._VOLUME;
       // this.sys.game._VOLUME = undefined;
    }

    preload() {
         this.load.image('hui','assets/health-ui.png');
         this.load.image('snow','assets/ground_snow.png');
         this.load.image('hpcolor','assets/hp-color.png');
         
       }

    create() { 

        /**
         * 
         * HP: 100 | Pixel : 300w = '20' * 15p
         * 
         * 
         * 
         * 
         * Dmg dealt: 50 | 50/100 * pixel = pxlDmgConv
         * 
         * setScale(pxlDmgConv);
         */

        /**
         * 
         * 
         * 
         */

        // var bounds = Phaser.Geom.Rectangle.Inflate(Phaser.Geom.Rectangle.Clone(this.physics.world.bounds), 0, 0);
        // var pos = Phaser.Geom.Rectangle.Random(bounds);
 
        this.snow = this.physics.add.sprite(200,300,'snow');
        this.snow.setOrigin(0.5);
        this.snow.setScale(.15);
        this.snow.setBounce(1).setCollideWorldBounds(true);
      
        //250,300

      
       // snow.setRotation(Math.PI);

        //snow.setDepth(10);
        //this.cameras.main.startFollow(snow);


        this.cursors = this.input.keyboard.createCursorKeys();
    
        this.damage = this.input.keyboard.addKey('D');
        this.heal = this.input.keyboard.addKey('H');

        this.maxHealth = 10;
        this.currentHealth = this.maxHealth;
        

        this.cameras.main.setBackgroundColor('#bababa');
        this.hp = this.physics.add.image(0,0,'hpcolor').setOrigin(0);
        this.hpUI = this.add.sprite(0,0,'hui').setOrigin(0);
        this.hp.tint = 0x00FF00;

        //#FFD700 gold.

        this.hp.setScale(this.currentHealth/this.maxHealth* this.hpUI.width / this.hp.width,1);
        //this.hpUI.setVisible(false);
          this.text = this.add.text(this.hpUI.width/2 -30,this.hpUI.height/2,this.hp -20);

          this.angle = 0;
        }

        angle

        rotateObject(object){
           //Math.si

        }

    update() {

      this.snow.body.setAngularVelocity = 0;

       if(this.cursors.up.isDown){
         this.snow.body.setAngularVelocity = -10;
         console.log('innn');
       }
       else{
        this.snow.body.setAngularVelocity = 10;
       }
          
          //angle+=5;
          

   // console.log(this.hpUI.scale.width);
       // this.snow.rotate += 20;
          this.snow.setRotation(Math.PI);  
        /*var tween = this.tweens.add({
          targets: this.snow,
          angle: 360.0,
          duration: 100,
          repeat: 0
        });*/
     
        if(Phaser.Input.Keyboard.JustDown(this.damage)){
           var dmgTobeDealt = Phaser.Math.Between(1,this.currentHealth);

           if(this.currentHealth - dmgTobeDealt < 0){
             this.currentHealth = 0;
           }
           else{
               this.currentHealth -= dmgTobeDealt;
           }
           var halfHealth = this.maxHealth/2;

           if(this.currentHealth > halfHealth){
            var offset = this.currentHealth - halfHealth;
            var newHeal = ((offset/this.maxHealth) * this.hpUI.width) / this.hp.width*2;           
            this.hp.setScale(newHeal,1);
            this.hp.clearTint();
            this.hp.tint = 0x00FF00;
         
          }
          else{
            var offset = this.currentHealth;
            var newHeal = ((offset/this.maxHealth) * this.hpUI.width) / this.hp.width*2;           
            this.hp.setScale(newHeal,1);
            this.hp.clearTint();
            this.hp.tint = 0xFFD700;
          }
          // this.hp.setScale(dmg,1);

        }
        else if(Phaser.Input.Keyboard.JustDown(this.heal)){
        
            var dmgTobeDealt = 10;

            if(this.currentHealth + dmgTobeDealt > this.maxHealth){
              this.currentHealth = this.maxHealth;
            }
            else{
                this.currentHealth += dmgTobeDealt;
            }

            var halfHealth = this.maxHealth/2;

           // var heal = ((this.currentHealth/this.maxHealth) * this.hpUI.width) / this.hp.width*2;
           
            if(this.currentHealth > halfHealth){
              var offset = this.currentHealth - halfHealth;
              var newHeal = ((offset/this.maxHealth) * this.hpUI.width) / this.hp.width*2;           
              this.hp.setScale(newHeal,1);
              this.hp.clearTint();
              this.hp.tint = 0x00FF00;
              console.log('in');
            }
            else{
              var offset = this.currentHealth;
              var newHeal = ((offset/this.maxHealth) * this.hpUI.width) / this.hp.width*2;           
              this.hp.tint = 0x00FF00;
              this.hp.setScale(newHeal,1);
              this.hp.clearTint();
              this.hp.tint= 0xFFD700;
              console.log('out');
            }

           // console.log(heal);
           // this.hp.setScale(heal,1);
         }

         this.text.setText(this.currentHealth + "/" + this.maxHealth);

    }
}