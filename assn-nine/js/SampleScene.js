import MyScene from "./MyScene.js";

export default class SampleScene extends Phaser.Scene{
    constructor(){
        super('sample-scene');
    }

    init(){

    }

    preload(){

    }

    create(){
        console.log("Reveal Number: " +this.sys.game._HIGHSCORE);

    }

    update(time){

    }
}

//export default SampleScene;