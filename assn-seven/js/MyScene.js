//import "./phaser.js";
// You can copy-and-paste the code from any of the examples at https://examples.phaser.io here.
// You will need to change the `parent` parameter passed to `new Phaser.Game()` from
// `phaser-example` to `game`, which is the id of the HTML element where we
// want the game to go.
// The assets (and code) can be found at: https://github.com/photonstorm/phaser3-examples
// You will need to change the paths you pass to `this.load.image()` or any other
// loading functions to reflect where you are putting the assets.
// All loading functions will typically all be found inside `preload()`.

// The simplest class example: https://phaser.io/examples/v3/view/scenes/scene-from-es6-class



/**
 * IDEAS: 
 * Scoring System: 
 *   get extra points for killing monsters
 *   get x2 score for killing all monsters
 *   get extra block for picking up a powerup.
 *   finishing up the level = 100 per level. increments by 100 every level won.
 *   
 * 
 * 
 *   get HighScore. 
 *     - score reset, rate and sound resets also. 
 *   put high score on the left side of the screen. 
 *   current score to the left side of the screen. 
 *   
 * End screen: 
 *   If win:  
 *   Show level score and show new added score.
 *   If lose: 
 *   Show final score, set it as high score if higher than the current high score. 
 *   else ask player if they want to play again. 
 *    
 *   
 * 
 * Enemy movement: slow-to-fast horizontal, 
 * Powerup: more blocks
 * Strongest powerup: enemy gets killed when touching the wall. 
 * Skill: Dash or teleport; 
 * Map: more map-
 * 
 * BUGS: 
 * Placing blocks on top of each other 
 * Placing blocks on the wall
 * Chickens spawning outside of the map
 */
var cursors, up, down, left, right, player, enemy, block_shield;
var blockUp, blockDown, blockRight, blockLeft, blockMax,
    blockCount, screenText, tell, mainSound = null,
    squishSound = null
rate = 1.0,
    sigRate = 1.0,
    movementIncrease = 0;


var sigMovement = -6.0,
    sigMovementRate = 0;

//SCORING SYSTEM
var countKill, monsterScore, monsterPoints = 5;
var currentScore = 0,
    highScore = 0,
    levelScore = 0;
var monsterCount = 0;
var floorCount = 0,
    floorScore = 0,
    floorPoints = 10;

/**
 * MonsterkillScore 
 *  -> monster: 50 
 *  -> monsterkillAll: x2 the monsterkillscore
 * LevelScore: 100 * nLevel
 * 
 * 
 * currentScore 
 * levelScore = monsterkillscore + levelScore
 * 
 * HighScore = currentScore if 0, else if(currentScore > highscore) set
 * it to highscore, else do nothing. 
 * 
 * 
 * 
 */



class MyScene extends Phaser.Scene {

    constructor() {
        super('main-game');
    }

    currentScoreText
    highScoreText


    preload() {

        this.load.audio('main_song', './assets/hall_of_mountain.mp3');
        this.load.audio('squish', './assets/squish.mp3');

        this.load.spritesheet('player', './assets/player_sprite.png', {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet('enemy_fire', './assets/enemy_sprite.png', {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.image('tilesheet', './assets/tileset.png', );
        this.load.tilemapTiledJSON('map', './assets/level_one_modified.json');
        this.load.image('block', './assets/stone_shield.png');

    };

    create() {
        levelScore = currentScore;
        monsterScore = 0;
        countKill = 0;

        //reset if game is over.

        floorCount++;
        floorScore = floorPoints * floorCount;
        console.log(floorCount);
        /**
         * var scoreText = this.add.text(screenCenterX, screenCenterY, screenText, {
            fill: 150,
            color: '#ffffff',
            fontSize: 60
        }).setOrigin(0.5);
         */




        if (mainSound === null) {
            mainSound = this.sound.add('main_song', {
                volume: .40,
                loop: true
            });
            mainSound.play();
            mainSound.setRate(rate);
        } else {
            mainSound.play();
            mainSound.setRate(rate);
        }

        if (squishSound === null) {
            squishSound = this.sound.add('squish', {
                volume: .60
            })
            squishSound.setRate(1.5);
        }

        this.speed = 1;
        this.blockCount = 0;
        this.blockMax = 2;

        blockUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        blockDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        blockLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        blockRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        //  this.cameras.main.setBackgroundColor(0xffffff);

        let mappy = this.add.tilemap('map');
        let terrain = mappy.addTilesetImage("ninja_tileset", "tilesheet");
        let botLayer = mappy.createStaticLayer("bot", [terrain], 0, 0);
        let topLayer = mappy.createStaticLayer("top", [terrain], 0, 0);
        botLayer.setScale(5);
        topLayer.setScale(5);


        this.enemy = this.physics.add.group();
        this.block_shield = this.physics.add.staticGroup();
        this.block_shield.setDepth(0);

        let spriteBounds = Phaser.Geom.Rectangle.Inflate(Phaser.Geom.Rectangle.Clone(this.physics.world.bounds), 0, 0);

        monsterCount = Phaser.Math.Between(3, 6);

        for (let i = 0; i < monsterCount; i++) {
            var pos = Phaser.Geom.Rectangle.Random(spriteBounds);

            if (pos.y >= 480) {
                pos.y = Phaser.Math.Between(80, 480);
            }
            var block = this.physics.add.sprite(pos.x, pos.y, 'enemy_fire');
            addObject(block, this.enemy);
        }

        this.player = this.physics.add.sprite(450, 640, 'player');
        this.player.setScale(3.0);

        // this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);
        //this.cameras.main.startFollow(this.player,true);

        this.physics.add.collider(this.player, topLayer);
        this.physics.add.collider(this.enemy, topLayer);
        this.physics.add.collider(this.enemy, this.block_shield);
        this.physics.add.collider(this.enemy, this.player, killPlayer, null, this);
        this.physics.add.overlap(this.enemy, this.block_shield, killEnemy, null, this);
        this.physics.add.collider(this.player, botLayer);

        botLayer.setTileLocationCallback(1, 1, 1, 1, () => {


            if (countKill === monsterCount) {
                levelScore += monsterScore;
            }

            levelScore += floorScore;
            rateIncrease();
            this.scene.start('game-over');
            mainSound.stop();
            screenText = "You won";
        })

        ;

        //this.physics.world.timeScale = 1.5; 

        topLayer.setCollisionByProperty({
            collides: true
        });


        //const ground = map.createStaticLayer('Ground',tileset,0,0);
        topLayer.setCollision([409, 309, 310]);
        this.cursors = this.input.keyboard.createCursorKeys();

        this.player.setDepth(1);

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('player', {
                frames: [0]
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'walk_up',
            frames: this.anims.generateFrameNumbers('player', {
                frames: [1, 5, 9, 13]
            }),
            frameRate: 6,
            repeat: -1
        });
        this.anims.create({
            key: 'walk_down',
            frames: this.anims.generateFrameNumbers('player', {
                frames: [0, 4, 8, 12]
            }),
            frameRate: 6,
            repeat: -1
        });
        this.anims.create({
            key: 'walk_right',
            frames: this.anims.generateFrameNumbers('player', {
                frames: [3, 7, 11, 15]
            }),
            frameRate: 6,
            repeat: -1
        });
        this.anims.create({
            key: 'walk_left',
            frames: this.anims.generateFrameNumbers('player', {
                frames: [2, 6, 10, 14]
            }),
            frameRate: 6,
            repeat: -1
        });

        //screenText = "You won";
        this.player.play('idle', true);

        this.timedEvent = this.time.addEvent({
            delay: this.timerMax,
            //callback: callBack,
            callbackScope: this,
            loop: false
        });

        this.currentScoreText = this.add.text(50, 35, "Score: " + levelScore, {
            font: 'bold 25px Arial',
            fill: '#000000',
            color: '#000000',
            
        }).setOrigin(0);

        this.highScoreText = this.add.text(480, 35, "High Score: " + highScore, {
            font: 'bold 25px Arial',
            fill: '#000000',
            color: '#00ff00',
        }).setOrigin(0);

    }

    update() {

        this.currentScoreText.setText("Score: " + levelScore);


        //.log(this.timedEvent.getElapsedSeconds());

        /* if(Math.round(this.timedEvent.getElapsedSeconds()) % 5){
             this.physics.world.timeScale -= 1;
         }*/

        // console.log(this.player.x + " y: " + this.player.y);
        if (this.blockCount <= this.blockMax) {
            // console.log("Im in");
            if (Phaser.Input.Keyboard.JustDown(blockUp)) {
                let posx = this.player.x;
                let posy = this.player.y;
                let blockPosX = Math.floor(this.player.x / 80) * 80;
                let blockPosY = Math.floor(this.player.y / 80) * 80 - 80;

                let blockObject = this.physics.add.staticSprite(blockPosX, blockPosY, 'block').setOrigin(0).setScale(5).refreshBody();
                this.block_shield.add(blockObject);
                this.blockCount++;

            } else if (Phaser.Input.Keyboard.JustDown(blockDown)) {
                let posx = this.player.x;
                let posy = this.player.y;

                let blockPosX = Math.floor(this.player.x / 80) * 80;
                let blockPosY = Math.floor(this.player.y / 80) * 80 + 80;

                let blockObject = this.physics.add.staticSprite(blockPosX, blockPosY, 'block').setOrigin(0).setScale(5).refreshBody();
                this.block_shield.add(blockObject);
                this.blockCount++;

            } else if (Phaser.Input.Keyboard.JustDown(blockLeft)) {
                let posx = this.player.x;
                let posy = this.player.y;

                let blockPosX = Math.floor(this.player.x / 80) * 80 - 80;
                let blockPosY = Math.floor(this.player.y / 80) * 80;

                let blockObject = this.physics.add.staticSprite(blockPosX, blockPosY, 'block').setOrigin(0).setScale(5).refreshBody();
                this.block_shield.add(blockObject);
                this.blockCount++;

            } else if (Phaser.Input.Keyboard.JustDown(blockRight)) {
                let posx = this.player.x;
                let posy = this.player.y;

                let blockPosX = Math.floor(this.player.x / 80) * 80 + 80;
                let blockPosY = Math.floor(this.player.y / 80) * 80;

                let blockObject = this.physics.add.staticSprite(blockPosX, blockPosY, 'block').setOrigin(0).setScale(5).refreshBody();
                this.block_shield.add(blockObject);
                this.blockCount++;
            }
        }


        //console.log("x: " + this.player.x + " y: " + this.player.y);

        // console.log(this.player.body.angle * 180/3.14);

        if (this.player.active === true) {

            //this.player.play('idle',true);
            let speed = 100;
            if (this.cursors.up.isDown === true) {
                this.player.setVelocityY(-speed);
                this.player.play('walk_up', true);
            } else if (this.cursors.down.isDown === true) {
                this.player.setVelocityY(speed);
                this.player.play('walk_down', true);
            } else if (this.cursors.right.isDown === true) {
                this.player.setVelocityX(speed);
                this.player.play('walk_right', true);
            } else if (this.cursors.left.isDown === true) {
                this.player.setVelocityX(-speed);
                this.player.play('walk_left', true);
            } else {
                this.player.play('idle', true);
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
        /*if(Phaser.Input.Keyboard.JustDown(this.up)){
            this.player.y -= speed; 
        }
        else if((Phaser.Input.Keyboard.JustDown(this.down))){
            this.player.y += speed; 
        }
        else if((Phaser.Input.Keyboard.JustDown(this.left))){
            this.player.x -= speed; 
        }
        else if((Phaser.Input.Keyboard.JustDown(this.right))){
            this.player.x += speed;
        }*/

    }
}



function sigmoid(t) {
    return 1 / (1 + Math.pow(Math.E, -t));
}

function killPlayer(player, enemy) {
    player.destroy();
    screenText = "You lost";

    floorCount = 0;
    floorScore = 0;

    sigRate = 1.0;
    sigMovement = -6.0;

    if (highScore === 0) {
        highScore = levelScore;
    } else if (highScore < levelScore) {
        highScore = levelScore;
    }
    levelScore = 0;
    rateIncrease();

    this.scene.start('game-over');

}

function rateIncrease() {
    sigRate += .2;
    let tempRate = sigmoid(sigRate);
    if (tempRate >= 1.0) {
        rate = tempRate;
    } else {
        rate = sigRate;
    }
    //console.log("Sig Rate: " + sigRate + " Sigmoid: " + rate);
    //rate += 1;
    /*let tempRate = rate;
    tempRate += .2;
    let realRate = sigmoid(tempRate);
    console.log("cur: " + rate + "sigmoid: " +  realRate);
    rate += realRate;*/

    sigMovement += 1;
    sigMovementRate = sigmoid(sigMovement) * 400;
    console.log("sigMovement : " + sigMovement + " sigMovementRate: " + sigMovementRate);
    movementIncrease = sigMovementRate;

}

function addObject(object, group) {

    object.setInteractive();
    //  object.setCircle(4);
    group.add(object);
    object.setVelocity(Phaser.Math.Between(100 + movementIncrease, 150 + movementIncrease), Phaser.Math.Between(100 + movementIncrease, 150 + movementIncrease));
    object.setBounce(1).setCollideWorldBounds(true);
    object.setScale(3.5);

    if (Math.random() > 0.5) {
        object.body.velocity.x *= -1;
    } else {
        object.body.velocity.y *= -1;
    }
}

//var countKill = 0;

function killEnemy(enemy, shield) {
    squishSound.play();
    //onsole.log(++countKill);
    ++countKill;
    monsterScore += monsterPoints;
    levelScore += monsterPoints;
    // console.log(levelScore);
    enemy.destroy();
}

var GameOver = Phaser.Class({
    Extends: Phaser.Scene,

    initialize:

        function GameOver() {
            Phaser.Scene.call(this, {
                key: 'game-over'
            });
        },

    preload: function () {
        // this.load.image('phaser', 'assets/phaser.png');
        //   this.stage.backgroundColor = "#4488AA";
    },

    create: function () {
        mainSound.stop();
        this.cameras.main.setBackgroundColor(0xffffff);

        // SCORE UPDATE
        var multiplier = (countKill === monsterCount) ? "+" + monsterScore + " killing all monster/s." : "+0";
        var floorPointsText = "+" + floorScore + " for finishing floor level.";
        var multipText = this.add.text(20, 16, multiplier + "\n" + floorPointsText, {
            fill: 150,
            color: '#ffffff',
            fontSize: 20
        }).setOrigin(0);

        countKill = 0;
        currentScore = levelScore;

        // console.log(screenText);
        //  this.add.image(0,0,'phaser').setOrigin(0).setScale(10);
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        var endScoreString = (levelScore === 0) ? "High Score: " + highScore : "Current Score: " + currentScore

        var endScoreText = this.add.text(screenCenterX, screenCenterY - 80, endScoreString, {
            fill: 150,
            color: '#ffffff',
            fontSize: 40
        }).setOrigin(0.5);

        var scoreText = this.add.text(screenCenterX, screenCenterY, screenText, {
            fill: 150,
            color: '#ffffff',
            fontSize: 60
        }).setOrigin(0.5);
        var spaceText = this.add.text(screenCenterX, screenCenterY + 50, 'Press A to play again.', {
            fill: 150,
            color: '#ffffff',
            fontSize: 20
        }).setOrigin(0.5);





        this.input.keyboard.on('keydown-A', () => {
            this.scene.start('main-game');
        });

    },

    update: function () {

    }

});


var GameStart = Phaser.Class({
    Extends: Phaser.Scene,

    initialize:

        function GameStart() {
            Phaser.Scene.call(this, {
                key: 'start-scene'
            });
        },

    preload: function () {
        this.load.image('cover-page', 'assets/cover_page.png');

    },

    create: function () {
        // countKill = 0;

        const bg = this.add.image(55, 10, 'cover-page').setOrigin(0).setScale(.90);


        this.input.keyboard.once('keydown-F', () => {

            this.scene.start('main-game');

        });
    },

    update: function () {

    }
});



const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 720,
    height: 640,
    scene: [GameStart, MyScene, GameOver],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {},
            debug: false,
        }
    }
});