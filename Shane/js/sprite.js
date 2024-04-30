//Parent Sprite Class
class Sprite {
    constructor(sprite_json, x, y, start_state){
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
    draw(state){
        // If a sprite is ended mid-cycle, reset back to 0
        if(this.cur_frame >= this.sprite_json[this.root_e][this.state].length){
            this.cur_frame = 0;
        }
        this.spriteLength = this.sprite_json[this.root_e][currSprite].length;
        this.state = currSprite;

        if (keyChanged) {
            this.cur_frame = 0;
            keyChanged = false;
        }

        var ctx = canvas.getContext('2d');
        if(this.sprite_json[this.root_e][currSprite][this.cur_frame]['img'] == null){
            this.sprite_json[this.root_e][currSprite][this.cur_frame]['img'] = new Image();
            this.sprite_json[this.root_e][currSprite][this.cur_frame]['img'].src = '../Penguins/' + this.root_e + '/' + currSprite + '/' + this.cur_frame + '.png';
        }

        if( this.cur_bk_data != null){
            ctx.putImageData(this.cur_bk_data , (this.x - this.x_v) , (this.y - this.y_v));
        }

        this.cur_bk_data = ctx.getImageData(this.x, this.y,
            this.sprite_json[this.root_e][currSprite][this.cur_frame]['w'],
            this.sprite_json[this.root_e][currSprite][this.cur_frame]['h']);

        ctx.drawImage(this.sprite_json[this.root_e][currSprite][this.cur_frame]['img'], this.x, this.y);

        // Change the sprites velocity based on what the current sprite is
        if(Object.keys(keyStates).length === 0){
            this.x_v = 0;
            this.y_v = 0;
        }
        if (currSprite === 'walk_N') {
            this.x_v = 0;
            this.y_v = -10;
        }
        if (currSprite === 'walk_S') {
            this.x_v = 0;
            this.y_v = 10;
        }
        if (currSprite === 'walk_W') {
            this.x_v = -10;
            this.y_v = 0;
        }
        if (currSprite === 'walk_E') {
            this.x_v = 10;
            this.y_v = 0;
        }
        if (currSprite === 'walk_NE'){
            this.x_v = 10;
            this.y_v = -10;
        }
        if (currSprite === 'walk_NW'){
            this.x_v = -10;
            this.y_v = -10;
        }
        if (currSprite === 'walk_SE'){
            this.x_v = 10;
            this.y_v = 10;
        }
        if (currSprite === 'walk_SW'){
            this.x_v = -10;
            this.y_v = 10;
        }
        if (currSprite === 'idleSpin'){
            this.x_v = 0;
            this.y_v = 0;
        }
        if (currSprite === 'idleLayDown'){
            this.x_v = 0;
            this.y_v = 0;
        }
        if (currSprite === 'idleFall'){
            this.x_v = 0;
            this.y_v = 0;
        }


        // Boundary Checking
        if(this.x >= (window.innerWidth - this.sprite_json[this.root_e][this.state][this.cur_frame]['w']) ){
            this.bound_hit('E');
        }else if(this.x <= 0){
            this.bound_hit('W');
        }else if(this.y >= (window.innerHeight - this.sprite_json[this.root_e][this.state][this.cur_frame]['h']) ){
            this.bound_hit('S');
        }else if(this.y <= 0){
            this.bound_hit('N');
        }else{
            this.x = this.x + this.x_v;
            this.y = this.y + this.y_v;
        }

        this.cur_frame++;
        if (this.cur_frame >= this.spriteLength) {
            this.cur_frame = 0;
        }
        return false;
    }

    bound_hit(side){
        var rightBound = (window.innerWidth - this.sprite_json[this.root_e][this.state][this.cur_frame]['w']);
        var bottomBound = (window.innerHeight - this.sprite_json[this.root_e][this.state][this.cur_frame]['h']);

        if(currSprite === 'walk_W'){
            this.invalidateKey('a');

            this.x = this.x + 10;
            this.x_v = 10;
        }else if(currSprite === 'walk_E'){
            this.invalidateKey('d');

            this.x = this.x - 50;
            this.x_v = -50;
        }else if(currSprite === 'walk_S'){
            this.invalidateKey('s');

            this.y = this.y - 10;
            this.y_v = -10;
        }else if(currSprite === 'walk_N'){
            this.invalidateKey('w');

            this.y = this.y + 10;
            this.y_v = 10;
        }else if(currSprite === 'walk_NE'){
            this.invalidateKey('w');
            this.invalidateKey('d');

            this.x = this.x - 20;
            this.x_v = -20;
            this.y = this.y + 10;
            this.y_v = 10;
        }else if(currSprite === 'walk_NW'){
            this.invalidateKey('w');
            this.invalidateKey('a');

            this.x = this.x + 20;
            this.x_v = 20;
            this.y = this.y + 10;
            this.y_v = 10;
        }else if(currSprite === 'walk_SE'){
            this.invalidateKey('d');
            this.invalidateKey('s');

            this.x = this.x - 20;
            this.x_v = -20;
            this.y = this.y - 10;
            this.y_v = -10;
        }else if(currSprite === 'walk_SW'){
            this.invalidateKey('a');
            this.invalidateKey('s');

            this.x = this.x + 30;
            this.x_v = 30;
            this.y = this.y - 10;
            this.y_v = -10;
        }

        if(this.x <= 0){
            this.x = 10;
            this.x_v = 10;
        }
        else if(this.x >= rightBound){
            this.x = this.x - 20;
            this.x_v = - 20;
        } else if(this.y <= 0){
            this.y = 10;
            this.y_v = 10;
        }else if(this.y >= bottomBound){
            this.y = this.y -20;
            this.y_v = - 20;
        }
    }

    invalidateKey(key) {
        delete keyStates[key];
    }
}
