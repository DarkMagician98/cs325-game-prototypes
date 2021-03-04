import Phaser from '../lib/phaser.js'

//var player;
export default class Game extends Phaser.Scene {

    /** @type {Phaser.Physics.Arcade.Sprite} */
    player
    platforms
    spikes
    bg
    cursors
    scoreText
    carrot
    grass
    mushroom
    collect = 0

    constructor() {
        super('game')
    }

    preload() {
        this.load.image('background', 'assets/bg_layer1.png');
        this.load.image('platform', 'assets/ground_grass.png');
        this.load.image('platform1', 'assets/ground_sand_broken.png');
        this.load.image('platform2', 'assets/ground_snow.png');
        this.load.image('platform3', 'assets/ground_stone_broken.png');
        this.load.image('bunny-stand', 'assets/bunny1_stand.png');
        this.load.image('spike','assets/spikes_top.png');
        this.load.image('carrot','assets/carrot.png');
        this.load.image('grass','assets/grass2.png');
        this.load.image('mushroom','assets/mushroom_brown.png');
    }

    create() {

        this.cursors = this.input.keyboard.createCursorKeys();
        this.scoreText = this.add.text(16,16,'score: 0',{
            fontSize: '32px', fill: '#000' }).setScrollFactor(0);
        
        this.scoreText.setDepth(3);
        this.bg = this.add.image(240, 320, 'background');

        this.player = this.physics.add.sprite(240, -150, 'bunny-stand').setScale(0.25);
        this.platforms = this.physics.add.staticGroup();
        this.spikes = this.physics.add.staticGroup();
        this.grass = this.physics.add.staticGroup();
        this.mushroom = this.physics.add.staticGroup();

        this.player.setDepth(2);
        this.player.setTint(0xffa500);

        this.player.body.checkCollision.up = false;
        this.player.body.checkCollision.right = false;
        this.player.body.checkCollision.left = false;

        //this.mushroom.countActive();
        this.bg.setScrollFactor(0);
        this.cameras.main.startFollow(this.player);
        //sthis.cameras.main.setBounds(0, 0,5000, 50000).setScrollFactor(0);

        this.platforms.create(220,190,'platform').setScale(2,2).refreshBody();
 
        let maxStep = Phaser.Math.Between(5,20);
        let maxGarbage = 5;
        let garbageCount = 0;


        for (let i = 0; i < maxStep; i++) {
            const x = Phaser.Math.FloatBetween(80, 400);
            const y = -150 * i;
            /** @type {Phaser.Physics.Arcade.Sprite} */
            let random = Phaser.Math.Between(0,4), randomGarbage = Phaser.Math.Between(0,10);
            let platform,gr,ms;
            

            if(random === 0){
                platform = this.platforms.create(x, y, 'platform');
                //spike = this.spikes.create(x,y-47,'spike');
                //grass
                
            }
            else if(random === 1){
                platform = this.platforms.create(x, y, 'platform1');
                if(randomGarbage < 5 && garbageCount<=maxGarbage && i !== maxStep-1 ){
                    gr = this.grass.create(x,y-47, 'grass');
                    garbageCount++;
                }
               // spike = this.spikes.create(x,y-47,'spike');
            }
            else if(random === 2){
                platform = this.platforms.create(x, y, 'platform2');
              //  spike = this.spikes.create(x,y-47,'spike');
            }
            else{
                platform = this.platforms.create(x, y, 'platform3');
                //mushroom
               // spike = this.spikes.create(x,y-47,'spike');
               if(randomGarbage > 5 && garbageCount <= maxGarbage && i !== maxStep-1){
                   ms = this.mushroom.create(x,y-47,'mushroom');
                   garbageCount++;
               }
            }

            platform.scale = 0.5;

            if(ms)
            ms.scale = 0.5;
            if(gr)
            gr.scale = 0.5;

            if(i === maxStep-1){
                this.carrot = this.physics.add.staticImage(x,y-48,'carrot').setScale(.5,.5);
            }

           /* if(spike){
                spike.setScale(2,1);
            }*/

            /**@type {Phaser.Physics.Arcade.StaticBody} */
            let body = platform.body;
            body.updateFromGameObject();

            if(ms){
            body = ms.body;
            body.updateFromGameObject();
            }

            if(gr){
            body = gr.body;
            body.updateFromGameObject();
            }

            /*if(spike){
            const body1 = spike.body;
            body1.updateFromGameObject();
            }*/
        }

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.player, this.mushroom,getGarbage,null,this);
        this.physics.add.collider(this.player, this.carrot,getAward,null,this);
        this.physics.add.collider(this.player, this.grass,getGarbage,null,this);

        function getGarbage(player, garbage){
            player.setTint(0xff0000);
            garbage.disableBody(true,true);
            this.collect++;
        }
    
        function getAward(player, award){
            
            console.log('NO carrots');
            if(this.collect === garbageCount){
              this.scoreText.setText("You WON!");
              award.disableBody(true,true);
              this.physics.pause();
            }
            else{
              this.scoreText.setText("You LOST!\nNo carrots for you"); 
              this.physics.pause();
            }
        }
    }

    update() {

        const touchingDown = this.player.body.touching.down;

        if(touchingDown){
            this.player.setVelocity(0,0);
            this.player.setGravity(0);
        }
        
        if(this.cursors.up.isDown && touchingDown){
            this.player.setVelocityY(-320);
            this.player.setGravityY(100);
        }
        else if(this.cursors.right.isDown){
            this.player.setVelocityX(50);
            this.player.setGravity(100);
     
        }
        else if(this.cursors.left.isDown){
            this.player.setVelocityX(-50);
            this.player.setGravity(100);
        }


    }

 
}