// Initialize Phaser, and creates a 400x490px game
var game = new Phaser.Game(400, 490, Phaser.AUTO, 'game_div');

// Creates a new 'main' state that wil contain the game
var main_state = {

    preload: function() { 
		// Function called first to load all the assets

		// Change background color of game
		this.game.stage.backgroundColor = '#3498db';

		// Load sprites
		this.game.load.image('bird', 'assets/bird.png');
		this.game.load.image('pipe', 'assets/pipe.png');
		this.game.load.audio('jump', 'assets/jump.wav')
	},

    create: function() { 
    	// Fuction called after 'preload' to setup the game

    	// Declare jump_sound
    	this.jump_sound = this.game.add.audio('jump');

    	// Display the bird sprite
    	this.bird = this.game.add.sprite(100, 245, 'bird');

    	// Add gravity to bird
    	this.bird.body.gravity.y = 1000;

    	// Call the 'jump' function with spacebar is hit
    	var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    	space_key.onDown.add(this.jump, this);

    	// Create a group of 20 pipes
    	this.pipes = game.add.group();
    	this.pipes.createMultiple(20, 'pipe');   

    	// Add pipes every 1.5 seconds
    	this.timer = this.game.time.events.loop(1500, this.add_row_of_pipes, this); 

    	// Display score label, top-left
    	this.score = 0;
    	var style = {font: "30px Arial", fill: "#ffffff"};
    	this.label_score = this.game.add.text(20, 20, "0", style);

    	// Anchor for animations
    	this.bird.anchor.setTo(-0.3, 0.5);
    },
    
    update: function() {
		// Function called 60 times per second

		// If the bird is too high or too low, call the 'restart_game' function
		if (this.bird.inWorld == false)
			this.restart_game();

		this.game.physics.overlap(this.bird, this.pipes, this.hit_pipe, null, this);	
		if (this.bird.angle < 20)
			this.bird.angle += 1;
    },
    
	// Jump bird, jump
	jump: function() {
		// Dead birds do not jump, silly
		if (this.bird.alive == false)
			return;

		// Sound
		this.jump_sound.play();
		// Add vertical velocity to the bird
		this.bird.body.velocity.y = -300;

		// Create animation on bird
		var animation = this.game.add.tween(this.bird);

		// Set animation to change angle of sprite to -20° over 100ms
		animation.to({angle: -20}, 100);

		animation.start();
	},

	// Bird hits pipe
	hit_pipe: function() {
		// If the bird has already hit a pipe, break
		if (this.bird.alive == false)
			return;
		this.bird.alive = false;
		// Stop new pipes from appearing
		this.game.time.events.remove(this.timer);
		// Interate through pipes, stop movement
		this.pipes.forEachAlive(function(p){
			p.body.velocity.x = 0;
		}, this);
	},
	// Restart the game
	restart_game: function() {
		// Start the 'main' state, which effectively restarts the game
		this.game.time.events.remove(this.timer);
		this.game.state.start('main');
	},

	//Add a pipe on the screen
	add_one_pipe: function(x, y) {
		// Get the first dead pipe from group
		var pipe = this.pipes.getFirstDead();

		// Set the new position of the pipe
		pipe.reset(x, y);

		// Add velocity to make the pipe move left
		pipe.body.velocity.x = -200;

		// Kill the pipe when it's not visible
		pipe.outOfBoundsKill = true;
	},

	add_row_of_pipes: function() {
		this.score +=1;
		this.label_score.content = this.score;
		var hole = Math.floor(Math.random()*5)+1;

		for (var i = 0; i < 8; i++)
			if (i != hole && i != hole + 1)
				this.add_one_pipe(400, i*60+10);
	},
};

// Add and start the 'main' state to start the game
game.state.add('main', main_state);  
game.state.start('main'); 