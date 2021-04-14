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

/**
 * Powerups: pick up powerups based on chances. The chance increases with the streak.
 * Streak: Simultaneous correct guess.
 * 
 * Chances to pick up powerup
 * Score multiplier;
 * 
 * Next update: change percent area rate and add new powerup. 
 * 
 */



var zero, one, two, three, four, five, six, seven, eight, nine, backspace, enter;

var hintState = {
    DIV: 0,
    ODDEVEN: 1,
    NARROWGUESS: 2,
    CURRENTSTATE: -1,

    setCurrentState: function (state) {

        this.CURRENTSTATE = state;
    },
    getCurrentState: function () {
        return this.CURRENTSTATE;
    }
}

class MyScene extends Phaser.Scene {

    constructor() {
        super('main-game');
    }


    //general variabales
    generatedSecretNumber
    max = 100;
    level
    percentRate = .05
    multiplier

    //prize variables
    prizesShown
    prizeLevel
    prizePosition = 34

    //sound variabales 
    clickSound
    winSound
    memeSound
    button
    winSoundRate

    //text variables
    guess
    answerResult
    levelText
    scoreText
    hintText
    hintString
    score
    divTotal
    narrowTotal
    odTotal
    powerupsAmountString

    powerupTotal = {
        div: 1,
        narrow: 1,
        od: 1
    }

    //hp
    hpDisplay
    hitpoints
    hp
    hpDiv
    hScoreText




    init() {

        this.powerupTotal.div = 1;
        this.powerupTotal.od = 1;
        this.powerupTotal.narrow = 1;

        this.winSoundRate = 1;
        this.hpDiv = 0;
        this.hp = 3;
        this.hitpoints = 127;
        this.divTotal = 1;
        this.narrowTotal = 1;
        this.odTotal = 1;
        this.powerupsAmountString = "x" + this.powerupTotal.div + "\t\t\t\t\t\t\t\tx" + this.powerupTotal.narrow + "\t\t\t\t\t\t\t\t x" + this.powerupTotal.od;
        this.multiplier = 0;
        this.level = 0;
        this.score = 0;
        this.prizeLevel = 0;
        this.guess = ""
        this.answerResult = "";
        this.hintString = "";
        this.generatedSecretNumber = Phaser.Math.Between(0, 100);
    }


    preload() {
        this.load.audio('click', './assets/click.mp3');
        this.load.audio('win', './assets/win.mp3');
        this.load.audio('memewin', './assets/meme_win.mp3');
        this.load.image('frame', './assets/bg-frame.png');
        this.load.image('bg_yellow', './assets/yellow_bg.png');
        this.load.image('bp', './assets/button-powerup.png');
        this.load.image('odp', './assets/od-button.png');
        this.load.image('dbp', './assets/div-button.png');
        this.load.image('nbp', './assets/narrow-button.png');
        this.load.image('lifeline', './assets/lifeline.png');
        this.load.image('lifeframe', './assets/lifeline_frame.png');
        this.load.image('big-frame', './assets/big_frame.png');
    };

    create() {

        //CENTERS Object on the screen.
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        //add sound to the game. 
        this.memeSound = this.sound.add('memewin', );
        this.clickSound = this.sound.add('click', );
        this.winSound = this.sound.add('win');

        let buttonOffsetX = 120,
            buttonOffsetY = 100;
        let buttonX = -15,
            buttonY = 10;

        let moveAllXUI = 0,
            moveAllYUI = -60;

        this.createButton(moveAllXUI + buttonX + screenCenterX - buttonOffsetX, moveAllYUI + buttonY + screenCenterY + buttonOffsetY, 'dbp', this.button, 'div', '0xff10ff', 1.5);
        this.createButton(moveAllXUI + buttonX + screenCenterX, buttonY + screenCenterY + buttonOffsetY + moveAllYUI, 'nbp', this.button, 'narrowguess', '0xff10ff', 1.5);
        this.createButton(moveAllXUI + buttonX + screenCenterX + buttonOffsetX, moveAllYUI + buttonY + screenCenterY + buttonOffsetY, 'odp', this.button, 'oddeven', '0xff10ff', 1.5);

        this.add.image(10 + moveAllXUI, 120 + moveAllYUI, 'big-frame').setOrigin(0);
        this.add.image(screenCenterX - 115 + 20 + moveAllXUI, screenCenterY + moveAllYUI, 'lifeframe').setScale(1, 1.3);
        this.add.image(screenCenterX + 20 + moveAllXUI, screenCenterY + moveAllYUI, 'frame').setOrigin(0.5);

        this.hpDisplay = this.add.image(screenCenterX - 115 + 20 + moveAllXUI, screenCenterY + 63 + moveAllYUI, 'lifeline').setScale(.9, this.hitpoints).setDepth(0);

        this.powerupAmountText = this.add.text(moveAllXUI + buttonX + screenCenterX - buttonOffsetX + 60, moveAllYUI + buttonY + screenCenterY + buttonOffsetY + 10, this.powerupsAmountString, {
            fill: '#ffffff',
            color: '#ffffff',
            fontSize: 25,
            fontFamily: 'my_font_sans'
        }).setOrigin(0);

        this.guessText = this.add.text(screenCenterX + moveAllXUI + 20, screenCenterY + moveAllYUI, "...", {
            fill: '#ffffff',
            color: '#ffffff',
            fontSize: 100,
            fontFamily: 'my_font_sans'
        }).setOrigin(0.5);

        this.hintText = this.add.text(screenCenterX - 50 + moveAllXUI, screenCenterY + 220 + moveAllYUI, this.hintString, {
            fill: '#ffffff',
            color: '#ffffff',
            fontSize: 25,
            fontFamily: 'my_font_sans'
        }).setOrigin(0.5);

        this.scoreText = this.add.text(screenCenterX - 110 + moveAllXUI, screenCenterY - 95 + moveAllYUI, "Score: " + this.score, {
            fill: '#ffffff',
            color: '#ffffff',
            fontSize: 22,
            fontFamily: 'my_font_sans'
        }).setOrigin(0);

        this.hScoreText = this.add.text(screenCenterX + 10 + moveAllXUI, screenCenterY - 95 + moveAllYUI, "H-Score: " + ((localStorage.getItem('highScore') === null) ? '0' : localStorage.getItem('highScore')), {
            fill: '#ffffff',
            color: '#ffffff',
            fontSize: 22,
            fontFamily: 'my_font_sans'
        }).setOrigin(0);

        this.keyboardInit();
    }

    update() {

        // console.log("My name is: " + localStorage.getItem('name'));
        this.keyboardKeys();

        this.guessText.setText(this.guess);

        if (Phaser.Input.Keyboard.JustDown(enter)) {


            let range = Math.round(this.percentRate * this.max);
            // console.log("In enter...");
            let leftRange = this.generatedSecretNumber - range;
            let rightRange = this.generatedSecretNumber + range;
            let caseConst = -1;
            let extendedLeftRange = 0,
                extendedRightRange = 0;

            // console.log("Guess log: " + this.guess);
            let myGuess = undefined;

            if (this.guess != "") {
                myGuess = parseInt(this.guess);
            }

            if (myGuess !== undefined) {

                let tempScore = 0;

                if (leftRange < 0) {
                    extendedLeftRange = leftRange < 0 ? (this.max + leftRange) % this.max : leftRange % this.max;
                    caseConst = 0;
                    console.log("Left: " + extendedLeftRange + " Right:" + rightRange);
                } else if (rightRange > 100) {
                    extendedRightRange = rightRange >= 100 ? (this.max + rightRange) % this.max : rightRange % this.max;
                    caseConst = 1;
                    console.log("Left: " + leftRange + " Right:" + extendedRightRange);

                } else {
                    caseConst = 2;
                    console.log("Left: " + leftRange + " Right:" + rightRange);

                }

                if (caseConst === 0) {

                    if ((myGuess >= extendedLeftRange && myGuess <= 100) || (myGuess <= rightRange)) {

                        this.winSound.play();
                        this.winSoundRate += .1;
                        this.winSound.setRate(this.winSoundRate);

                        console.log("Correct");

                        this.generatedSecretNumber = Phaser.Math.Between(0, 100);

                        tempScore = 1;
                        this.multiplier++;

                        this.powerUpReward(this.powerupTotal);

                    } else {
                        this.winSoundRate = 1;
                        this.winSound.setRate(this.winSoundRate);

                        this.multiplier = 0;
                        this.hpDiv++;
                        let dmg = (this.hitpoints / this.hp) * this.hpDiv;

                        this.hpDisplay.setScale(1, this.hitpoints - dmg);

                    }
                } else if (caseConst === 1) {
                    if ((myGuess <= extendedRightRange && myGuess >= 0) || (myGuess >= leftRange)) {
                        this.winSound.play();
                        this.winSoundRate += .1;
                        this.winSound.setRate(this.winSoundRate);

                        console.log("Correct");
                        this.generatedSecretNumber = Phaser.Math.Between(0, 100);
                        tempScore = 1;
                        this.multiplier++;
                        this.powerUpReward(this.powerupTotal);
                        //   this.score++;
                    } else {
                        this.winSoundRate = 1;
                        this.winSound.setRate(this.winSoundRate);

                        this.multiplier = 0;
                        this.hpDiv++;
                        let dmg = (this.hitpoints / this.hp) * this.hpDiv;
                        this.hpDisplay.setScale(1, this.hitpoints - dmg);
                    }
                } else if (caseConst === 2) {
                    //   console.log("LaR");
                    if (myGuess >= leftRange && myGuess <= rightRange) {
                        this.winSound.play();
                        this.winSoundRate += .1;
                        this.winSound.setRate(this.winSoundRate);

                        console.log("Correct");
                        this.generatedSecretNumber = Phaser.Math.Between(0, 100);
                        tempScore = 1;
                        this.multiplier++;
                        this.powerUpReward(this.powerupTotal);
                    } else {
                        this.winSoundRate = 1;
                        this.winSound.setRate(this.winSoundRate);


                        this.multiplier = 0;
                        this.hpDiv++;
                        let dmg = (this.hitpoints / this.hp) * this.hpDiv;
                        this.hpDisplay.setScale(1, this.hitpoints - dmg);
                    }
                }
                this.score += (tempScore * this.multiplier);
                this.hintString = "";
            }

            if (this.hpDiv === 3) {
                localStorage.setItem('highScore', this.score);
                this.scene.start('game-over');
            }


            //  this.hScoreText.setText("Score:" + this.)
            // console.log("Scorehhh: " + localStorage.getItem('highscore'));
            // console.log("hp: " + this.hpDiv);
            //console.log("Mult" + this.multiplier);
            this.scoreText.setText("Score: " + this.score);
            this.guess = "";
        }

        //  console.log(hintState.getCurrentState());
        //  console.log(this.runPowerup(this.generatedSecretNumber));
        let tempString = this.runPowerup(this.generatedSecretNumber, this.powerupTotal);
        if (tempString) {
            console.log("in string");
            this.hintString += tempString + '\n';
        }
        console.log(this.generatedSecretNumber);
        // console.log(this.hintString);
        this.powerupsAmountString = "x" + this.powerupTotal.div + "\t\t\t\t\t\t\t\tx" + this.powerupTotal.narrow + "\t\t\t\t\t\t\t\t x" + this.powerupTotal.od;
        this.powerupAmountText.setText(this.powerupsAmountString);
        this.hintText.setText(this.hintString);

    }

    keyboardInit() {
        zero = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ZERO);
        one = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        two = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
        three = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
        four = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);
        five = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE);
        six = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SIX);
        seven = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SEVEN);
        eight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.EIGHT);
        nine = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NINE);
        backspace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKSPACE);
        enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }

    keyboardKeys() {
        if (Phaser.Input.Keyboard.JustDown(one)) {
            this.clickSound.play();
            this.guess += "1";
        } else if (Phaser.Input.Keyboard.JustDown(two)) {
            this.clickSound.play();
            this.guess += "2";
        } else if (Phaser.Input.Keyboard.JustDown(three)) {
            this.clickSound.play();
            this.guess += "3";
        } else if (Phaser.Input.Keyboard.JustDown(four)) {
            this.clickSound.play();
            this.guess += "4";
        } else if (Phaser.Input.Keyboard.JustDown(five)) {
            this.clickSound.play();
            this.guess += "5";
        } else if (Phaser.Input.Keyboard.JustDown(six)) {
            this.clickSound.play();
            this.guess += "6";
        } else if (Phaser.Input.Keyboard.JustDown(seven)) {
            this.clickSound.play();
            this.guess += "7";
        } else if (Phaser.Input.Keyboard.JustDown(eight)) {
            this.clickSound.play();
            this.guess += "8";
        } else if (Phaser.Input.Keyboard.JustDown(nine)) {
            this.clickSound.play();
            this.guess += "9";
        } else if (Phaser.Input.Keyboard.JustDown(zero)) {
            this.clickSound.play();
            this.guess += "0";
        } else if (Phaser.Input.Keyboard.JustDown(backspace)) {
            this.clickSound.play();
            this.guess = this.guess.substring(0, this.guess.length - 1);
        }

        if (this.guess.length > 3) {
            this.guess = this.guess.substring(0, 3);
        }
    }

    createButton(x, y, name, buttonController, powerupState, tintColor, scale = 1) {

        buttonController = this.physics.add.image(x, y, name).setOrigin(0);
        buttonController.setInteractive();
        buttonController.setScale(scale);

        buttonController.on('pointerdown', function () {
            buttonController.setTint(tintColor);
            switch (powerupState) {
                case 'div':
                    hintState.setCurrentState(hintState.DIV);
                    break;
                case 'oddeven':
                    hintState.setCurrentState(hintState.ODDEVEN);
                    break;
                case 'narrowguess':
                    hintState.setCurrentState(hintState.NARROWGUESS);
                    break;
                default:
                    console.log("Invalid powerup");
            }
        }, this);

        buttonController.on('pointerup', function () {
            buttonController.clearTint();
        }, this);

    }

    powerUpReward(powerupTotal) {
        if (Phaser.Math.Between(0, 100) <= 15) {
            powerupTotal.div++;
        }
        if (Phaser.Math.Between(0, 100) <= 15) {
            powerupTotal.narrow++;
        }
        if (Phaser.Math.Between(0, 100) <= 15) {
            powerupTotal.od++;
        }

    }

    runPowerup(secretNumber, powerupTotal) {

        let usedPowerup = "";

        if (hintState.getCurrentState() === hintState.DIV && powerupTotal.div > 0) {
            this.clickSound.play();
            usedPowerup = this.divPowerup(secretNumber);
            powerupTotal.div--;
            // console.log("Dtot: " + powerupTotal.div);
        } else if (hintState.getCurrentState() === hintState.ODDEVEN && powerupTotal.od > 0) {
            this.clickSound.play();
            // this.winSound.play();
            usedPowerup = this.oddEvenPowerup(secretNumber);
            powerupTotal.od--;
        } else if (hintState.getCurrentState() === hintState.NARROWGUESS && powerupTotal.narrow > 0) {
            this.clickSound.play();
            // this.winSound.play();
            powerupTotal.narrow--;
            usedPowerup = this.narrowGuessPowerup(secretNumber);
        } else {

        }
        return usedPowerup;
    }

    oddEvenPowerup(secretNumber) {
        let numberType = "Number is ";
        if (secretNumber % 2 === 0) {
            numberType += "even";
        } else {
            numberType += "odd";
        }
        hintState.setCurrentState(-1);
        return numberType;
    }

    divPowerup(secretNumber) {
        // console.log("Secret Number: " + secretNumber);
        //check if secretnumber is a integer.

        let divNumber = "Divisible Numbers:";

        for (let i = 1; i <= 10; i++) {
            if (secretNumber % i === 0) {
                divNumber = divNumber + " " + i;
            }
        }
        hintState.setCurrentState(-1);
        return divNumber;
    }

    narrowGuessPowerup(secretNumber) {

        let rangeArea = "";
        console.log(secretNumber);

        let range = 30; //this is the percentage of where the answer is within.
        let lrange = Phaser.Math.Between(0, 100);
        let rrange = ((100 - lrange) / 100) * range;
        lrange = (lrange / 100) * range;

        Math.round(lrange);
        Math.round(rrange);

        let leftRange = secretNumber - Math.round(lrange);
        let rightRange = secretNumber + Math.round(rrange);
        let extendedLeftRange = 0,
            extendedRightRange = 0;

        if (leftRange < 0) {
            extendedLeftRange = leftRange < 0 ? (this.max + leftRange) % this.max : leftRange % this.max;
            rangeArea = "[" + extendedLeftRange + ",100] U " + "[0," + rightRange + "]";

        } else if (rightRange > 100) {
            extendedRightRange = rightRange >= 100 ? (this.max + rightRange) % this.max : rightRange % this.max;

            rangeArea = "[" + leftRange + ",100] U " + "[0," + extendedRightRange + "]";

            // rangeArea = "More than " + leftRange + " or less than " + extendedRightRange;

        } else {
            // rangeArea = "[" + extendedLeftRange + ",100] U " + "[0," + rightRange + "]";
            rangeArea = "[" + leftRange + "," + rightRange + "]";

        }
        hintState.setCurrentState(-1);
        return rangeArea;
    }


}

var GameStart = Phaser.Class({
    Extends: Phaser.Scene,

    initialize:

        function GameStart() {
            Phaser.Scene.call(this, {
                key: 'start-scene'
            });
        },

    preload: function () {
        this.load.audio('applause','./assets/applause.mp3');
    },

    create: function () {

        this.applauseSound = this.sound.add('applause',{volume:0.4});
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        // let titleName = "FOR THE MEME"
        this.levelText = this.add.text(screenCenterX, screenCenterY-15, "FOR THE MEME (͠≖ ͜ʖ͠≖)", {
            fill: '#ffffff',
            color: '#ffffff',
            fontSize: 50,
            fontFamily: 'my_font_sans'
        }).setOrigin(0.5);

        this.add.text(screenCenterX, screenCenterY + 40, "Press F to start", {
            fill: '#ffffff',
            color: '#ffffff',
            fontSize: 20,
            fontFamily: 'my_font_sans'
        }).setOrigin(0.5);

        let instructions = "Instructions:\n Type numbers to answer\n 'Enter' to submit answer\n Powerups:\n  Div: shows a list of number(0-10) divisible to the secret number\n  Narrow-down: shows an area of where the secret number\n  o/d: odd/even"
        this.add.text(20, screenCenterY + 150, instructions, {
            fill: '#ffffff',
            color: '#ffffff',
            fontSize: 20,
            fontFamily: 'my_font_sans'
        }).setOrigin(0);


        this.input.keyboard.once('keydown-F', () => {
            this.applauseSound.play();
            this.scene.start('main-game');

        });
    },

    update: function () {

    }
});


var GameOver = Phaser.Class({
    Extends: Phaser.Scene,

    initialize:

        function GameOver() {
            Phaser.Scene.call(this, {
                key: 'game-over'
            });
        },

    preload: function () {
        this.load.audio('boo','./assets/crowdboo.mp3');
    },

    create: function () {
        this.sound.add('boo').play();
        //mainSound.stop();
        this.cameras.main.setBackgroundColor('#000000');
        // console.log(screenText);
        //  this.add.image(0,0,'phaser').setOrigin(0).setScale(10);
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        var spaceText = this.add.text(screenCenterX, screenCenterY + 50, 'Press A to play again.', {
            fill: '#ffffff',
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