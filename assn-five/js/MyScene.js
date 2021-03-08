import "./phaser.js";
// You can copy-and-paste the code from any of the examples at https://examples.phaser.io here.
// You will need to change the `parent` parameter passed to `new Phaser.Game()` from
// `phaser-example` to `game`, which is the id of the HTML element where we
// want the game to go.
// The assets (and code) can be found at: https://github.com/photonstorm/phaser3-examples
// You will need to change the paths you pass to `this.load.image()` or any other
// loading functions to reflect where you are putting the assets.
// All loading functions will typically all be found inside `preload()`.

// The simplest class example: https://phaser.io/examples/v3/view/scenes/scene-from-es6-class

var screenText;

class MyScene extends Phaser.Scene {

    coins
    hearts
    chance
    max
    coinCount
    heartCount
    coinChance
    heartChance
    isAllowed
    generateCount
    generateRate
    generateRateCounter

    timerText
    timerMax
    timedEvent
    timerLeft

    coinScore
    coinValue
    coinHUD

    gameOverText

    loseCount = 0

    gameOverSound

    constructor() {
        super('main-game');
    }

    preload() {
        this.load.image('coin', 'assets/gold-coin.png');
        this.load.image('heart', 'assets/heart.png');
        this.load.audio('click', 'assets/click.mp3');
        this.load.audio('game-over', 'assets/game-over.mp3');
    }

    create() {

        this.gameOverSound = this.sound.add('game-over', {
            volume: .30
        });
        this.gameOverSound.setRate(1.6);

        this.gameOverText = ['Are you trying?', 'Too fast for you?', 'Close...', 'Game Over', 'You suck', 'Try Again', 'Two Years Later', 'Yikes', 'Nice Try']


        this.cameras.main.setBackgroundColor(0x83B0EB);
        this.heartScore = 0;
        this.coinChance = 50
        this.heartChance = 50
        this.coinValue = 5;
        this.coinScore = this.coinChance / this.coinValue;
        this.generateCount = 1
        this.generateRate = 5
        this.generateRateCounter = 0
        this.max = 15;
        this.timerMax = 5000;
        this.timerLeft = this.timerMax / 1000;
        this.timedEvent = this.time.addEvent({
            delay: this.timerMax,
            callback: callBack,
            callbackScope: this,
            loop: false
        });

        this.scoreText = this.add.text(this.cameras.main.width - 80, 16, 'Timer:' + this.timerMax / 1000, {
            fontSize: 40,
        });

        this.coinHUD = this.add.text(16, 16, this.coinScore, {
            fontSize: 40,
        });

        var spriteBounds = Phaser.Geom.Rectangle.Inflate(Phaser.Geom.Rectangle.Clone(this.physics.world.bounds), 0, 0);

        this.anims.create({
            key: 'coin',
            frames: this.anims.generateFrameNames('coin'),
            repeat: -1
        });

        this.anims.create({
            key: 'heart',
            frames: this.anims.generateFrameNames('heart'),
            repeat: -1
        });

        this.coins = this.physics.add.group();
        this.hearts = this.physics.add.group();


        var anims = ['coin', 'heart'];


        for (var i = 0; i < this.max; i++) {
            var pos = Phaser.Geom.Rectangle.Random(spriteBounds);

            var rand = Phaser.Math.Between(0, 1);
            var block = this.physics.add.sprite(pos.x, pos.y, anims[rand]);

            this.tweens.add({
                targets: block,
                alpha: 0,
                duration: Phaser.Math.Between(1000, 3000),
                repeat: 1000
            });

            if (rand === 0) {
                addObject(block, this.coins);
            } else {
                addObject(block, this.hearts);
            }
        }

        this.coinCount = this.coins.getLength();
        this.heartCount = this.hearts.getLength();
        this.isAllowed = false;
    }

    update() {


        this.timerLeft = Phaser.Math.RoundTo((this.timerMax / 1000) - this.timedEvent.getElapsedSeconds());

        this.scoreText.setText(this.timerLeft);
        this.coinHUD.setText('Coin left:' + this.coinScore);

        var choice = Phaser.Math.Between(0, 100);
        var spriteBounds = Phaser.Geom.Rectangle.Inflate(Phaser.Geom.Rectangle.Clone(this.physics.world.bounds), 0, 0);
        var limit = this.coins.getLength() + this.hearts.getLength();


        this.coins.children.iterate(child => {
            child.on('pointerdown', function () {
                child.destroy();
            });
        });

        this.hearts.children.iterate(child => {
            child.on('pointerdown', function () {
                child.destroy();
            });
        });


        //console.log(this.coinCount + "|" + this.coins.getLength() + "\n" + this.heartCount + " | " + this.hearts.getLength());

        if (this.coinCount != this.coins.getLength()) {
            this.sound.play('click');
            this.isAllowed = true;
            --this.coinCount;
            this.coinChance += this.coinValue;
            // this.coinScore++;
            this.coinScore--;

        }

        if (this.heartCount != this.hearts.getLength()) {
            this.sound.play('click');
            this.isAllowed = true;
            --this.heartCount;
            this.coinChance -= this.coinValue;
            this.coinScore++;
        }

        if (choice >= this.coinChance && this.isAllowed) {

            for (let i = 0; i < this.generateCount; i++) {

                var pos = Phaser.Geom.Rectangle.Random(spriteBounds);
                //var rand = Phaser.Math.Between(0, 1);
                var block = this.physics.add.sprite(pos.x, pos.y, 'heart');

                this.tweens.add({
                    targets: block,
                    alpha: 0,
                    duration: Phaser.Math.Between(1000, 3000),
                    repeat: 1000
                });

                addObject(block, this.hearts);

                this.heartCount++;
                this.isAllowed = false;
                if (this.generateRate !== this.generateRateCounter) {
                    this.generateRateCounter++;
                } else {
                    this.generateRateCounter = 0;
                    this.generateCount += 2;
                }
            }

        } else if (this.isAllowed) {

            var pos = Phaser.Geom.Rectangle.Random(spriteBounds);

            //var rand = Phaser.Math.Between(0, 1);
            var block = this.physics.add.sprite(pos.x, pos.y, 'coin');

            this.tweens.add({
                targets: block,
                alpha: 0,
                duration: Phaser.Math.Between(1000, 3000),
                repeat: 1000
            });

            addObject(block, this.coins);
            //this.coins.add(block);

            this.coinCount++;
            this.isAllowed = false;
            if (this.generateRate !== this.generateRateCounter) {
                this.generateRateCounter++;
            } else {
                this.generateRateCounter = 0;
                this.generateCount += 2;
            }

        }


        if (this.coinChance >= 100) {
            screenText = 'You Won!';
            this.scene.start('game-over');
        } else if (this.coinChance <= 0 || this.timerLeft <= 0) {
            this.gameOverSound.play();
            this.loseCount++;

            if (this.loseCount === 10) {
                screenText = 'Close Window';
                this.loseCount = 0;
            } else {
                screenText = this.gameOverText[Phaser.Math.Between(0, this.gameOverText.length - 1)];
            }

            this.scene.start('game-over');
        }



    }


}

function addObject(object, group) {

    object.setInteractive();
    group.add(object);
    object.setVelocity(Phaser.Math.Between(550, 650), Phaser.Math.Between(200, 300));
    object.setBounce(1).setCollideWorldBounds(true);
    object.setScale(10).refreshBody();

    if (Math.random() > 0.5) {
        object.body.velocity.x *= -1;
    } else {
        object.body.velocity.y *= -1;
    }
}

function callBack() {
    // console.log('Timer expired');
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
        this.load.image('phaser', 'assets/phaser.png');
        //   this.stage.backgroundColor = "#4488AA";
    },

    create: function () {
        this.cameras.main.setBackgroundColor(0xbababa);
        // console.log(screenText);
        //  this.add.image(0,0,'phaser').setOrigin(0).setScale(10);
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        var scoreText = this.add.text(screenCenterX, screenCenterY, screenText, {
            fill: 150,
            color: 150,
            fontSize: 60
        }).setOrigin(0.5);
        var spaceText = this.add.text(screenCenterX, screenCenterY + 50, 'Press A to play again.', {
            fill: 150,
            color: 150,
            fontSize: 20
        }).setOrigin(0.5);

        this.input.keyboard.on('keydown-A', () => {
            this.scene.start('main-game');
        });

    },

    update: function () {

    }

});

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 600,
    scene: [MyScene, GameOver],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    }

});