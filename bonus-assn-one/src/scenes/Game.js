import Phaser from '../lib/phaser.js'
//var player;


/**
 * create four groups--left right up down w/ their respective velocity and acceleration. 
 * 
 * 
 * 
 */

var ObjectDirection = {
    LEFT: 0,
    RIGHT: 1,
    UP: 2,
    DOWN: 3,
    CURRENT_DIRECTION: -1,

    setCurrentDirection(direction) {
        this.CURRENT_DIRECTION = direction;
    },

    getCurrentDirection() {
        return this.CURRENT_DIRECTION;
    },

}

export default class Game extends Phaser.Scene {

    /** @type {Phaser.Physics.Arcade.Sprite} */
    /** @type {Phaser.Physics.Arcade.StaticGroup} */
    /** @type {Phaser.Physics.Arcade.Group} */
    /** @type {Phaser.Physics.Arcade.Image} */
    /** @type {Phaser.Physics.*} */


    constructor() {
        super('game')
    }

    init() {
        this.accelerationIncrease = 0;
        this.level = 0;
        this.score = 0;
        this.hscore = localStorage.getItem('rabbitHighScore')||0;
    }

    preload() {
        this.load.image('carrot', './assets/carrot.png');
        this.load.image('bunny', './assets/bunny1_stand.png');
        this.load.image('bunny-jump', './assets/bunny1_jump.png');
        this.load.image('bg', './assets/bg_layer1.png');
        this.load.image('grass', './assets/grass2.png');
        this.load.audio('bg-music', './assets/bg_music.mp3');
        this.load.audio('bite', './assets/bite.mp3');
        this.load.audio('jump', './assets/phaseJump1.ogg');
    }

    create() {

        this.scoreValue = 2;
        localStorage.setItem('rabbitHighScore',0);
       // this.scene.add('game-over');
        this.add.image(0, 0, 'bg').setOrigin(0);
        this.bgMusic = this.sound.add('bg-music', {
            loop: true,
            volume: .3
        });
        //this.bgMusic.play();

        this.bite = this.sound.add('bite');
        this.jump = this.sound.add('jump', {
            rate: 2
        });

        this.shoot = -9999;
        this.bunnyScale = .2;
        this.WORLD_WIDTH = this.physics.world.bounds.width;
        this.WORLD_HEIGHT = this.physics.world.bounds.height;

        this.player = this.physics.add.image(100, 100, 'bunny').setScale(this.bunnyScale);
        this.player.refreshBody();
        this.player.setCircle(50, this.player.width / 32, this.player.height / 3);
        this.player.setCollideWorldBounds(true);
        // this.player.disableBody();
        //this.player.setMass(100);
        this.cursors = this.input.keyboard.createCursorKeys();

        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.grassWidthBound = this.WORLD_WIDTH - 10;
        this.grassHeightBound = this.WORLD_HEIGHT - 10;
        this.grass = this.physics.add.image(Phaser.Math.Between(5, this.grassWidthBound), Phaser.Math.Between(5, this.grassHeightBound), 'grass').setScale(.3);
        //this.grass.setImmovable(true);
        this.grass.setImmovable(true);



        this.initializeGroup();
        this.initScore();
        this.initHighScore()

        this.physics.add.collider(this.player, this.lowerCarrot, this.hitPlayer, null, this);
        this.physics.add.collider(this.player, this.upperCarrot, this.hitPlayer, null, this);
        this.physics.add.collider(this.player, this.leftCarrot, this.hitPlayer, null, this);
        this.physics.add.collider(this.player, this.rightCarrot, this.hitPlayer, null, this);
        this.physics.add.collider(this.player, this.grass, this.grabGrass, null, this);

    }


    update(t, dt) {

        let speed = 100;
        let dashSpeed = 200;

        this.player.setScale(this.bunnyScale);
        this.playerControl(speed, dashSpeed);
        this.disableCarrot();
        this.spawnTiming(t);
        this.gameOver();
        this.scoreText.setText("Score: " + this.score);
    }

    initScore() {
        this.scoreText = this.add.text(10, 10, 'Score: ' + this.score, {
            color: '#000',
            fontSize: '20px',
            fill: '#FF8C00'
        }).setScrollFactor(0).setOrigin(0);
    }

    grabGrass() {
        this.score += 5;
        this.grass.setPosition(Phaser.Math.Between(5, this.grassWidthBound), Phaser.Math.Between(5, this.grassHeightBound));
    }

    initHighScore() {
        this.highScoreText = this.add.text(this.WORLD_WIDTH-150, 10, 'H-Score: ' + this.hscore, {
            color: '#000',
            fontSize: '20px',
            fill: '	#FF8C00'
        }).setScrollFactor(0).setOrigin(0);
    }

    spawnTiming(t) {
        if (this.shoot === -9999) {
            // this.score+=1;
            this.level++;
            this.spawnEnemy();
            this.shoot = t;
        } else if ((t - this.shoot) >= 2000) {
            //  this.score+=1;
            this.level++;
            this.spawnEnemy();
            this.shoot = t;
        }
    }

    gameOver(){

        if(this.bunnyScale >= .5){
            let getHighScore = localStorage.getItem('rabbitHighScore') || 0;
            if(getHighScore < this.score){
                localStorage.setItem('rabbitHighScore',this.score);
            }
            this.scene.start('game-over');
        }
    }


    initializeGroup() {
        this.carrotScale = .2;
        this.upperCarrot = this.physics.add.group({
            key: 'carrot',
            repeat: 18,
            visible: false,
            active: false,
            setXY: {
                x: 0,
                y: 5,
                stepX: 40
            },
            setScale: {
                x: this.carrotScale,
                y: this.carrotScale
            }
        });

        this.lowerCarrot = this.physics.add.group({
            key: 'carrot',
            repeat: 18,
            visible: false,
            active: false,
            setXY: {
                x: 0,
                y: this.WORLD_HEIGHT - 10,
                stepX: 40
            },
            setScale: {
                x: this.carrotScale,
                y: this.carrotScale
            }
        });

        this.leftCarrot = this.physics.add.group({
            key: 'carrot',
            repeat: 18,
            visible: false,
            active: false,
            setXY: {
                x: 0,
                y: 15,
                stepY: 40
            },
            setScale: {
                x: this.carrotScale,
                y: this.carrotScale
            }
        });

        this.rightCarrot = this.physics.add.group({
            key: 'carrot',
            repeat: 18,
            visible: false,
            active: false,
            setXY: {
                x: this.WORLD_WIDTH,
                y: 15,
                stepY: 40
            },
            setScale: {
                x: this.carrotScale,
                y: this.carrotScale
            }
        });
    }

    disableCarrot() {
        this.lowerCarrot.children.iterate(child => {
            if (child.y <= 0) {
                child.disableBody(true, true);
            }
        });

        this.upperCarrot.children.iterate(child => {
            if (child.y >= this.WORLD_HEIGHT) {
                child.disableBody(true, true);
            }
        });
        this.leftCarrot.children.iterate(child => {
            if (child.x >= this.WORLD_WIDTH) {
                //  child.x = 0;
                //    child.setVelocityX(100);
                child.disableBody(true, true);
            }
        });
        this.rightCarrot.children.iterate(child => {
            if (child.x <= 0) {
                //   child.setVelocityX(-100);
                //  child.x = this.WORLD_WIDTH;
                child.disableBody(true, true);
            }
        });
    }

    playerControl(speed, dashSpeed) {
        if (this.player.active) {
            //  console.log("in");
            if (this.cursors.up.isDown === true) {
                this.player.setVelocityY(-speed);
                // this.bunnyScale+= .001;
                //  console.log("True");
                let oldScale = this.bunnyScale;
                if (Phaser.Input.Keyboard.JustDown(this.space)) {
                    //     this.player.setTexture('bunny-jump');
                    this.jump.play();
                    this.player.setVelocityY(-speed * dashSpeed);
                }
                //this.player.setTexture('bunny-jump');
                //  this.player.play('walk_up', true);
            } else if (this.cursors.down.isDown === true) {
                this.player.setVelocityY(speed);
                if (Phaser.Input.Keyboard.JustDown(this.space)) {
                    this.jump.play();
                    this.player.setVelocityY(speed * dashSpeed);
                }
                //  this.player.play('walk_down', true);
            } else if (this.cursors.right.isDown === true) {
                this.player.setVelocityX(speed);
                if (Phaser.Input.Keyboard.JustDown(this.space)) {
                    this.jump.play();
                    this.player.setVelocityX(speed * dashSpeed);
                }
                //   this.player.play('walk_right', true);
            } else if (this.cursors.left.isDown === true) {
                this.player.setVelocityX(-speed);
                if (Phaser.Input.Keyboard.JustDown(this.space)) {
                    this.jump.play();
                    this.player.setVelocityX(-speed * dashSpeed);
                }
                //   this.player.play('walk_left', true);
            } else {
                //   this.player.play('idle', true);
            }
            if (this.cursors.left.isUp && this.cursors.right.isUp) { //not moving on X axis
                this.player.setVelocityX(0);
                //this.player.play('idle',true);
            }
            if (this.cursors.up.isUp && this.cursors.down.isUp) { //not pressing y movement
                // this.player.play('idle',true);
                this.player.setVelocityY(0);
            }
        }
    }

    hitPlayer(player, carrot) {

        this.bunnyScale += .03;
        this.bite.play();
        //  player.setScale(.1);
        carrot.disableBody(true, true);
        //  player.setVelocity(0);
    }

    spawnEnemy() {
        let enemySpawnDirection = Phaser.Math.Between(0, 3);
        ObjectDirection.setCurrentDirection(enemySpawnDirection)
        switch (ObjectDirection.CURRENT_DIRECTION) {
            case ObjectDirection.UP:
                this.activateEnemy(ObjectDirection.getCurrentDirection());
                ObjectDirection.setCurrentDirection(-1);
                break;
            case ObjectDirection.DOWN:
                this.activateEnemy(ObjectDirection.getCurrentDirection());
                ObjectDirection.setCurrentDirection(-1);
                break;
            case ObjectDirection.LEFT:
                this.activateEnemy(ObjectDirection.getCurrentDirection());
                ObjectDirection.setCurrentDirection(-1);
                break;
            case ObjectDirection.RIGHT:
                this.activateEnemy(ObjectDirection.getCurrentDirection());
                ObjectDirection.setCurrentDirection(-1);
                break;
            default:
        }
    }

    activateEnemy(enemyToBeActivated) {
        if(this.level%5===0){
            this.accelerationIncrease += 200;
        }
        let accelerationSpeed = 1500 + this.accelerationIncrease;

        //INCREASE SCORE
        this.score += this.scoreValue;

        if (enemyToBeActivated === ObjectDirection.UP) {
            this.upperCarrot.children.iterate(child => {
                child.enableBody(true, child.x, 0, true, true);
                child.setAcceleration(0, accelerationSpeed);
            });
        } else if (enemyToBeActivated === ObjectDirection.DOWN) {
            this.lowerCarrot.children.iterate(child => {
                child.enableBody(true, child.x, this.WORLD_HEIGHT, true, true);
                child.setAcceleration(0, -accelerationSpeed);
            });
        } else if (enemyToBeActivated === ObjectDirection.LEFT) {
            this.leftCarrot.children.iterate(child => {
                child.enableBody(true, 0, child.y, true, true);
                child.setAcceleration(accelerationSpeed, 0);
            });
        } else if (enemyToBeActivated === ObjectDirection.RIGHT) {
            this.rightCarrot.children.iterate(child => {
                child.enableBody(true, this.WORLD_WIDTH, child.y, true, true);
                child.setAcceleration(-accelerationSpeed, 0);
            });
        }
    }
    /**
     * disable bodies.
     * enable bodies if pick
     * 
     * 
     */


}