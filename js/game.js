
window.onload = function() {
    var tileSize = 80;
    var numRows = 4;
    var numCols = 5;
    var tileSpacing = 10;
//    var tilesArray = [];
//    var selectedArray = [];
//    var playSound;
    var score;
//    var timeLeft;
//    var tileLeft;
    var localStorageName = "crackalien";
    var highScore;    
    var game = new Phaser.Game(500, 500);
    var playGame = function(game){ };
    var titleScreen = function(game) {};
    var gameOver = function(game) {};
    var preloadAssets = function(game) {};
    
    playGame.prototype = {
        scoreText: null,
        timeText: null,
        soundArray: [],
        tilesArray: [],
        selectedArray: [],
        timeLeft: null,
        tileLeft: null,
        playSound: null,
/*        preload: function () {
            game.load.spritesheet("tiles", "assets/sprites/tiles.png", tileSize, tileSize);
            game.load.audio("select", ["assets/sounds/select.mp3", "assets/sounds/select.oog"]);
            game.load.audio("right", ["assets/sounds/right.mp3", "assets/sounds/right.ogg"]);
            game.load.audio("wrong", ["assets/sounds/wrong.mp3", "assets/sounds/wrong.ogg"]);
        },*/
        create: function(){
            score = 0;
            this.timeLeft = 60;
//            tilesArray.length = 0;
//            selectedArray.length = 0;
            
            this.placeTiles();
            if(this.playSound) {
                this.soundArray[0] = game.add.audio("select", 1);
                this.soundArray[1] = game.add.audio("right", 1);
                this.soundArray[2] = game.add.audio("wrong", 1);
            }
            var style = {
                font: "32px Monospace",
                fill: "#00ff00",
                align: "center"
            }
            this.scoreText = game.add.text(5, 5, "Score: " + score, style);
            this.timeText = game.add.text(5, game.height -5, "Time Left: " + this.timeLeft, style);
            this.timeText.anchor.set(0, 1);
            game.time.events.loop(Phaser.Timer.SECOND, this.decreaseTime, this);
        },
        decreaseTime: function() {
            this.timeLeft --;
            this.timeText.text = "Time Left: " + this.timeLeft;
            if(this.timeLeft == 0) {
                game.state.start("GameOver");
            }
        },
        placeTiles: function() {
            this.tilesArray.length = 0;
            this.selectedArray.length = 0;
            this.tileLeft = numCols * numRows;
            var leftSpace = (game.width - (numCols * tileSize) - ((numCols - 1) * tileSpacing))/2;
            var topSpace = (game.height - (numRows * tileSize) - ((numRows - 1) * tileSpacing))/2;
            for(var i = 0; i < numRows * numCols; i++){
                this.tilesArray.push(Math.floor(i / 2));
            }
            for(i = 0; i < numRows * numCols; i++){
                var from = game.rnd.between(0,this.tilesArray.length-1);
                var to = game.rnd.between(0, this.tilesArray.length-1);
                var temp = this.tilesArray[from];
                this.tilesArray[from] = this.tilesArray[to];
                this.tilesArray[to] = temp;
            }
            console.log("my tile values: " + this.tilesArray);
            
            for(i=0; i < numRows; i++ ) {
                for(var j=0; j < numCols; j++ ) {
                    var tile = game.add.button(leftSpace + j * (tileSize + tileSpacing), topSpace + i * (tileSize + tileSpacing), "tiles",
                        this.showTile, this);
                    tile.frame = 10;
                    tile.value = this.tilesArray[i * numCols + j];
                }
            }
        },
        showTile: function(target) {
            if(this.selectedArray.length < 2 && this.selectedArray.indexOf(target) == -1) {
                if(this.playSound) {
                    this.soundArray[0].play();
                }
                target.frame = target.value;
                this.selectedArray.push(target);
                if(this.selectedArray.length == 2) {
                    game.time.events.add(Phaser.Timer.SECOND, this.checkTiles, this);
                }
            }
        },
        checkTiles: function(target) {
            if(this.selectedArray[0].value == this.selectedArray[1].value) {
                if(this.playSound) {
                    this.soundArray[1].play();
                }
                score ++;
                this.timeLeft += 2;
                this.timeText.text = "Time left: " + this.timeLeft;
                this.scoreText.text = "Score: " + score;
                this.selectedArray[0].destroy();
                this.selectedArray[1].destroy();
                this.tileLeft -= 2;
                if(this.tileLeft == 0){
//                    tilesArray.length = 0;
//                    selectedArray.length = 0;
                    this.placeTiles();
                }
            }
            else {
                if(this.playSound) {
                    this.soundArray[2].play();
                }
                this.selectedArray[0].frame = 10;
                this.selectedArray[1].frame = 10;
            }
            this.selectedArray.length = 0;
        }
    }
    titleScreen.prototype = {
/*        preload: function() {
            game.load.spritesheet("soundicons", "assets/sprites/soundicons.png", 80,80);
        },*/
        create: function() {
            game.scale.pageAlignHorizontally = true;
            game.scale.pageAlignVertically = true;
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.stage.disableVisibilityChange = true;
            var style = {
                font: "48px Monospace",
                fill: "#00ff00",
                align: "center"
            };
            var text = game.add.text(game.width / 2, game.height / 2 -100, "Crack Alien Code", style);
            text.anchor.set(0.5);
            
            var soundButton = game.add.button(game.width /2 -100, game.height /2 + 100, "soundicons", this.startGame, this);
            soundButton.anchor.set(0.5);
            
            soundButton = game.add.button(game.width / 2 + 100, game.height / 2 + 100, "soundicons", this.startGame, this);
            soundButton.frame = 1;
            soundButton.anchor.set(0.5);
        },
        startGame: function(target) {
            if(target.frame == 0) {
                this.playSound = true;
            }
            else {
                this.playSound = false;
            }
            game.state.start("PlayGame");
        }
    }
    
    gameOver.prototype = {
        create: function() {
            highScore = Math.max(score, highScore);
            localStorage.setItem(localStorageName, highScore);
            var style = {
                font: "32px Monospace",
                fill: "#00ff00",
                aligh: "Center"
            }
            var text = game.add.text(game.width / 2, game.height / 2, "Game Over\n\nYour score: " 
                + score + "\nBest Score: " + highScore + "\n\nTap to restart", style);
            text.anchor.set(0.5);
            game.input.onDown.add(this.restartGame, this);
        },
        restartGame: function() {
//            tilesArray.length = 0;
//            selectedArray.length = 0;
            game.state.start("TitleScreen");
        }
    }
    
    preloadAssets.prototype = {
        preload: function() {
            game.load.spritesheet("tiles", "assets/sprites/tiles.png", tileSize, tileSize);
            game.load.audio("select", ["assets/sounds/select.mp3", "assets/sounds/select.oog"]);
            game.load.audio("right", ["assets/sounds/right.mp3", "assets/sounds/right.ogg"]);
            game.load.audio("wrong", ["assets/sounds/wrong.mp3", "assets/sounds/wrong.ogg"]);
            game.load.spritesheet("soundicons", "assets/sprites/soundicons.png", 80,80);
        },
        create: function() {
            game.state.start("TitleScreen");
        }
    }
    
    game.state.add("PlayGame", playGame);
    game.state.add("TitleScreen", titleScreen);
    game.state.add("GameOver", gameOver);
    game.state.add("PreloadAssets", preloadAssets);
    highScore = localStorage.getItem(localStorageName) == null ? 0 : localStorage.getItem(localStorageName);
    game.state.start("PreloadAssets");
}


