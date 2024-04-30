// Parent Sprite Class
class Sprite {
    // Constructor to initialize a new sprite object
    constructor(sprite_json, x, y, start_state) {
        this.sprite_json = sprite_json;
        this.x = x;
        this.y = y;
        this.state = start_state;
        this.root_e = "TenderBud";

        this.cur_frame = 0;

        this.cur_bk_data = null;

        this.x_v = 0;
        this.y_v = 0;
    }

    // Method to update sprite position and animation frame
    update() {
        // Calculate future positions based on current velocity
        let futureX = this.x + this.x_v;
        let futureY = this.y + this.y_v;

        // Check horizontal boundaries
        if (futureX < 0) {
            this.x = 0; // Stop at the left edge
            this.bound_hit('W');
        } else if (futureX + this.width() > window.innerWidth) {
            this.x = window.innerWidth - this.width(); // Stop at the right edge
            this.bound_hit('E');
        } else {
            this.x = futureX;
        }

        // Check vertical boundaries
        if (futureY < 0) {
            this.y = 0; // Stop at the top edge
            this.bound_hit('N');
        } else if (futureY + this.height() > window.innerHeight) {
            this.y = window.innerHeight - this.height(); // Stop at the bottom edge
            this.bound_hit('S');
        } else {
            this.y = futureY;
        }

        // Update the current frame, looping back to the start if necessary
        this.cur_frame = (this.cur_frame + 1) % this.sprite_json[this.root_e][this.state].length;
    }

    // Method to get the width of the current frame
    width() {
        return this.sprite_json[this.root_e][this.state][this.cur_frame]['w'];
    }

    // Method to draw the sprite on the canvas
    height() {
        return this.sprite_json[this.root_e][this.state][this.cur_frame]['h'];
    }

    // Method to draw the sprite on the canvas
    draw() {
        var ctx = canvas.getContext('2d');

        // Load image for the current frame if not already loaded
        if (this.sprite_json[this.root_e][this.state][this.cur_frame]['img'] == null) {
            console.log("loading");
            this.sprite_json[this.root_e][this.state][this.cur_frame]['img'] = new Image();
            this.sprite_json[this.root_e][this.state][this.cur_frame]['img'].src = '../Penguins/' + this.root_e + '/' + this.state + '/' + this.cur_frame + '.png';
        }

        // Restore the background where the sprite was before moving
        if (this.cur_bk_data != null) {
            ctx.putImageData(this.cur_bk_data, (this.x - this.x_v), (this.y - this.y_v));
        }

        // Save the current background where the sprite is going to be drawn
        this.cur_bk_data = ctx.getImageData(this.x, this.y,
            this.sprite_json[this.root_e][this.state][this.cur_frame]['w'],
            this.sprite_json[this.root_e][this.state][this.cur_frame]['h']);

        // Draw the current frame image at the new position
        ctx.drawImage(this.sprite_json[this.root_e][this.state][this.cur_frame]['img'], this.x, this.y);

        this.cur_frame = this.cur_frame + 1;
        if (this.cur_frame >= this.sprite_json[this.root_e][this.state].length) {
            console.log(this.cur_frame);
            this.cur_frame = 0;
        }

        if (this.x >= (window.innerWidth - this.sprite_json[this.root_e][this.state][this.cur_frame]['w'])) {
            this.bound_hit('E');
        } else if (this.x <= 0) {
            this.bound_hit('W');
        } else if (this.y >= (window.innerHeight - this.sprite_json[this.root_e][this.state][this.cur_frame]['h'])) {
            this.bound_hit('S');
        } else if (this.y <= 0) {
            this.bound_hit('N');
        } else {
            this.x = this.x + this.x_v;
            this.y = this.y + this.y_v;
        }

    }

    // Method to randomly select and set an idle state for the sprite
    set_idle_state() {
        this.x_v = 0;
        this.y_v = 0;
        const idle_states = [
            "idle", "idleBackAndForth", "idleBreathing", "idleFall", "idleLayDown",
            "idleLookAround", "idleLookDown", "idleLookLeft", "idleLookRight",
            "idleLookUp", "idleSit", "idleSpin", "idleWave"
        ];

        const randomIndex = Math.floor(Math.random() * idle_states.length);
        const newState = idle_states[randomIndex];
        console.log(`Changing to random idle state: ${newState}`);
        this.changeState(newState);
    }

     // Method to handle sprite behavior when hitting a boundary
    bound_hit(direction) {
        this.x_v = 0;
        this.y_v = 0;
        console.log(`Boundary hit on ${direction}`);
        //this.set_idle_state();
    } 

    // Method to change the sprite's animation state
    changeState(newState) {
        if (this.state !== newState) {
            this.state = newState;
            this.cur_frame = 0; // Reset animation frame
        }
    }
} 

// Event listener for keydown to handle sprite movement
document.addEventListener('keydown', function (event) {
    const speed = 5; // Define the speed of sprite movement
    const boundaryMargin = 0; // Define the boundary margin

    const sprite = sprites_to_draw[1][0]; // Assuming only one sprite for simplicity

    switch (event.key) {
        case 'ArrowLeft':
            if (sprite.x - boundaryMargin > 0) { // Check if moving left would keep the sprite within the canvas boundary margin
                sprite.x_v = -speed; // Move left
                sprite.changeState('walk_W'); // Change state to walking left
            } else {
                sprite.x_v = 0; // Stop horizontal movement if reaching left boundary
            }
            break;
        case 'ArrowRight':
            if (sprite.x + sprite.width() + boundaryMargin < window.innerWidth) { // Check if moving right would keep the sprite within the canvas boundary margin
                sprite.x_v = speed; // Move right
                sprite.changeState('walk_E'); // Change state to walking right
            } else {
                sprite.x_v = 0; // Stop horizontal movement if reaching right boundary
            }
            break;
        case 'ArrowUp':
            if (sprite.y - boundaryMargin > 0) { // Check if moving up would keep the sprite within the canvas boundary margin
                sprite.y_v = -speed; // Move up
                sprite.changeState('walk_N'); // Change state to walking up
            } else {
                sprite.y_v = 0; // Stop vertical movement if reaching top boundary
            }
            break;
        case 'ArrowDown':
            if (sprite.y + sprite.height() + boundaryMargin < window.innerHeight) { // Check if moving down would keep the sprite within the canvas boundary margin
                sprite.y_v = speed; // Move down
                sprite.changeState('walk_S'); // Change state to walking down
            } else {
                sprite.y_v = 0; // Stop vertical movement if reaching bottom boundary
            }
            break;
    }
});


// Event listener for keyup to stop sprite movement and return to idle state
document.addEventListener('keyup', function (event) {
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
        sprites_to_draw[1][0].x_v = 0; // Stop horizontal movement
        sprites_to_draw[1][0].y_v = 0; // Stop vertical movement
        sprites_to_draw[1][0].set_idle_state(); // Change to a random idle state
    }
});