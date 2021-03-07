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

class MyScene extends Phaser.Scene {

    constructor() {
        super('main-game');
    }

    preload() {
        // Load an image and call it 'logo'.
        this.load.atlas('gems', 'assets/gems.png', 'assets/gems.json');

    }

    create() {
        //this.physics.world.setBounds(0, 0, 100 * 8, 100 * 8);

        var spriteBounds = Phaser.Geom.Rectangle.Inflate(Phaser.Geom.Rectangle.Clone(this.physics.world.bounds), 0, 0);

        this.anims.create({
            key: 'diamond',
            frames: this.anims.generateFrameNames('gems', {
                prefix: 'diamond_',
                end: 15,
                zeroPad: 4
            }),
            repeat: -1
        });
        this.anims.create({
            key: 'prism',
            frames: this.anims.generateFrameNames('gems', {
                prefix: 'prism_',
                end: 6,
                zeroPad: 4
            }),
            repeat: -1
        });
        //this.anims.create({ key: 'ruby', frames: this.anims.generateFrameNames('gems', { prefix: 'ruby_', end: 6, zeroPad: 4 }), repeat: -1 });
        // this.anims.create({ key: 'square', frames: this.anims.generateFrameNames('gems', { prefix: 'square_', end: 14, zeroPad: 4 }), repeat: -1 });

        //  Create loads of random sprites


        var anims = ['diamond', 'prism'];

        for (var i = 0; i < 25; i++) {
            var pos = Phaser.Geom.Rectangle.Random(spriteBounds);

            var block = this.physics.add.sprite(pos.x, pos.y, 'gems');

            block.setVelocity(Phaser.Math.Between(100, 200), Phaser.Math.Between(100, 200));
            block.setBounce(1).setCollideWorldBounds(true);

            //block.setScale(0.5).refreshBody();

            if (Math.random() > 0.5) {
                block.body.velocity.x *= -1;
            } else {
                block.body.velocity.y *= -1;
            }

            // block.play();
            //  console.log('out');
            let pick = Phaser.Math.RND.pick(anims);
            block.play(pick);

            block.setCircle(30);
            if (pick === 'prism') {
                //  block.setOffset(0,20).refreshBody();
                block.setSize(26, 0);
            }

        }
    }


    update() {
        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
        //this.bouncy.rotation = this.physics.accelerateToObject(this.bouncy, this.input.activePointer, 500, 500, 500);
    }
}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 600,
    scene: MyScene,
    physics: {
        default: 'arcade',
        arcade:{
            debug:true
        }
    }
   
});