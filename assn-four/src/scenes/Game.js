import Phaser from '../lib/phaser.js'
import Carrot from '../game/Carrot.js'

//var player;
export default class Game extends Phaser.Scene {

    /** @type {Phaser.Physics.Arcade.Sprite} */
    player
    spikes
    bg
    cursors
    scoreText
    grass
    mushroom
    collect
    carrotCount
    sc
    highY
    gameOver
    music

    /** @type {Phaser.Physics.Arcade.StaticGroup} */
    platforms

    /**
     * @type {Phaser.Physics.Arcade.Group}
     */

   
    carrots

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
        this.load.image('bunny-jump','assets/bunny1_jump.png');
        this.load.image('spike', 'assets/spikes_top.png');
        this.load.image('carrot', 'assets/carrot.png');
        this.load.image('grass', 'assets/grass2.png');
        this.load.image('mushroom', 'assets/mushroom_brown.png');
        this.load.audio('jump','assets/phaseJump1.ogg');
        this.load.audio('collect-carrots','assets/zapThreeToneUp.ogg');
        this.load.audio('bg-music','assets/bg_music.mp3');
    }

    create() { 

        this.music = this.sound.add('bg-music',{volume: .10});

        this.music.play();
        //this.music = this.sound.play('bg-music', {volume: .10});

        //always initialize all variable in create() so it can be resetted when switching scenes etc.
        this.gameOver = false;
        this.collect = 0;
        this.carrotCount = 0;
        this.sc = 0;
        this.highY = 0;

        this.cursors = this.input.keyboard.createCursorKeys();

        //this.scoreText.setDepth(3);
        this.add.image(240, 320, 'background').setScrollFactor(1, 0);

        this.platforms = this.physics.add.staticGroup();
        this.player = this.physics.add.sprite(240, -150, 'bunny-stand').setScale(0.25);
        this.spikes = this.physics.add.staticGroup();
        this.grass = this.physics.add.staticGroup();
        this.mushroom = this.physics.add.staticGroup();

        //this.player.setDepth(2);
        this.player.setTint(0xffa500);

        this.player.body.checkCollision.up = false;
        this.player.body.checkCollision.right = false;
        this.player.body.checkCollision.left = false;
        this.player.setDepth(2);

        //this.mushroom.countActive();
        //this.bg.setScrollFactor(0);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setDeadzone(this.scale.width * 1.5)
        // console.log(this.scale.width);

        //this.cameras.main.setBounds(0, 0,5000, 50000).setScrollFactor(0);
        // this.platforms.create(220,190,'platform').setScale(2,2).refreshBody();

        let maxStep = 5
        let maxGarbage = 5;
        let garbageCount = 0;


        for (let i = 0; i < maxStep; i++) {
            const x = Phaser.Math.FloatBetween(80, 380);
            const y = -150 * i;
            /** @type {Phaser.Physics.Arcade.Sprite} */
            let random = Phaser.Math.Between(0, 4),
                randomGarbage = Phaser.Math.Between(0, 10);
            let platform, gr, ms;


            if (random === 0) {
                platform = this.platforms.create(x, y, 'platform');
                //spike = this.spikes.create(x,y-47,'spike');
                //grass

            } else if (random === 1) {
                platform = this.platforms.create(x, y, 'platform1');
                if (randomGarbage < 5 && garbageCount <= maxGarbage && i !== maxStep - 1) {
                    gr = this.grass.create(x, y - 47, 'grass');
                    garbageCount++;
                }
                // spike = this.spikes.create(x,y-47,'spike');
            } else if (random === 2) {
                platform = this.platforms.create(x, y, 'platform2');
                //  spike = this.spikes.create(x,y-47,'spike');
            } else {
                platform = this.platforms.create(x, y, 'platform3');
                //mushroom
                // spike = this.spikes.create(x,y-47,'spike');
                if (randomGarbage > 5 && garbageCount <= maxGarbage && i !== maxStep - 1) {
                    ms = this.mushroom.create(x, y - 47, 'mushroom');
                    garbageCount++;
                }
            }

            platform.scale = 0.5;

            if (ms)
                ms.scale = 0.5;
            if (gr)
                gr.scale = 0.5;

            /* if (i === maxStep - 1) {
              //   this.carrot = this.physics.add.staticImage(x, y - 48, 'carrot').setScale(.5, .5);
             }*/

            /* if(spike){
                 spike.setScale(2,1);
             }*/

            /**@type {Phaser.Physics.Arcade.StaticBody} */
            let body = platform.body;
            body.updateFromGameObject();

            if (ms) {
                body = ms.body;
                body.updateFromGameObject();
            }

            if (gr) {
                body = gr.body;
                body.updateFromGameObject();
            }

            /*if(spike){
            const body1 = spike.body;
            body1.updateFromGameObject();
            }*/

        }

        function getGarbage(player, garbage) {
            /*  player.setTint(0xff0000);
              garbage.disableBody(true,true);
              this.collect++;*/
        }

        function getAward(player, award) {
            /*   
               console.log('NO carrots');
               if(this.collect === garbageCount){
                 this.scoreText.setText("You WON!");
                 award.disableBody(true,true);
                 this.physics.pause();
               }
               else{
                 this.scoreText.setText("You LOST!\nNo carrots for you"); 
                 this.physics.pause();
               }*/


        }



        /**
         * @type {Phaser.Physics.Arcade.Sprite}
         */
        this.carrots = this.physics.add.group({
            classType: Carrot
        });

        this.carrots.create(240, 320, 'carrot');

        //this.carrots.body.checkCollision.up = false;


        // this.carrots.add(240,320,'carrot');
        // this.carrots.setDepth(999);

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.player, this.mushroom, getGarbage, null, this);
        this.physics.add.collider(this.carrots, this.platforms);
        this.physics.add.collider(this.player, this.carrots, getAward, null, this);
        this.physics.add.collider(this.player, this.grass, getGarbage, null, this);


        this.scoreText = this.add.text(240, 10, 'score: 0', {
            color: '#000',
            fontSize: '32px',
            fill: '#000'
        }).setScrollFactor(0).setOrigin(.5, 0);

        this.physics.add.overlap(this.player, this.carrots, this.handleCollectCarrot, null, this);

    }



    update() {

        if (this.gameOver) {
            this.scene.start('game-over');
            this.music.stop();

        } else {
            this.scoreText.setText("Score: " + this.carrotCount);
        }

        const touchingDown = this.player.body.touching.down;
        //  this.platforms.children.iterate

        if (this.cursors.down.isUp && !this.player.body.checkCollision.down) {
            this.player.body.checkCollision.down = true;
        }
        if (touchingDown) {
            this.player.setVelocity(0, 0);
            this.player.setGravity(0);
            this.player.setTexture('bunny-stand');
        }


        if (this.cursors.up.isDown && touchingDown) {
            this.player.setVelocityY(-350);
            this.player.setGravityY(200);
            this.player.setTexture('bunny-jump');
            this.sound.play('jump');
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(140);
            // this.player.setGravity(100);

        } else if (this.cursors.left.isDown) {
            this.player.setVelocityX(-140);
            // this.player.setGravity(100);
          
        } else if (this.cursors.down.isDown) {
            this.player.body.checkCollision.down = false;
           // const shroom =this.mushroom.create(this.player.x,this.player.y,'mushroom').setScale(.5).refreshBody();
           // console.log('log');
        }

        


        this.platforms.children.iterate(child => {
            /** @type {Phaser.Physics.Arcade.Sprite} */
            const platform = child;

            const scrollY = this.cameras.main.scrollY;
            if (platform.y >= scrollY + 710) {
                platform.y = scrollY;
                platform.x = Phaser.Math.Between(80, 380);
                platform.body.updateFromGameObject();

                this.addCarrotAbove(platform);
            }


        });

        // console.log("\n------------------")

        // console.log(this.cameras.main.scrollY);

        /*if(this.player.y >= 400){
            this.scoreText.setText("You fell.\nTry again next time"); 
            this.physics.pause();
        }*/

        

        this.horizontalWrap(this.player);
        this.handleGameOver();

       /* this.input.keyboard.('keydown-F', () =>{
            const shroom =this.mushroom.create(this.player.x,this.player.y,'mushroom').setScale(.5).refreshBody();
        });*/

    }

    /**
     * 
     * @param {Phaser.GameObjects.Sprite} sprite 
     */
    horizontalWrap(sprite) {
        const halfWidth = sprite.displayWidth * 0.5;
        //console.log(sprite.displayWidth);
        const gameWidth = this.scale.width
        if (sprite.x < 0)
            console.log(sprite.x);

        if (sprite.x < -halfWidth) {
            sprite.x = gameWidth + halfWidth
        } else if (sprite.x > gameWidth + halfWidth) {
            sprite.x = -halfWidth
        }
    }

    addCarrotAbove(sprite) {
        const y = sprite.y - sprite.displayHeight

        /**
         * @type {Phaser.Physics.Arcade.Sprite}
         */

        this.carrots.children.iterate(child => {
            if (child.y >= this.cameras.main.scrollY + 700) {
                this.carrots.killAndHide(child);
                this.physics.world.disableBody(child.body);
            }
        });

        const carrot = this.carrots.get(sprite.x, y, 'carrot');
        carrot.setActive(true);
        carrot.setVisible(true);
        this.add.existing(carrot);
        carrot.body.setSize(carrot.width, carrot.height);
        this.physics.world.enable(carrot);

        return carrot;
    }

    handleCollectCarrot(player, carrots) {
        this.carrots.killAndHide(carrots);
        this.physics.world.disableBody(carrots.body);
        this.carrotCount++;

        this.sound.play('collect-carrots');
    
    }

    handleGameOver() {
        this.platforms.children.iterate(child => {
            if (this.highY >= child.y) {
                this.highY = child.y;
            }
        });

        if (this.highY && this.player.y >= this.highY + 700) {
            this.scoreText.setText("You lost");
            this.gameOver = true;
        }
    }

}