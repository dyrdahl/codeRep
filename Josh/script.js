class Sprite {
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
  draw() {
    var ctx = canvas.getContext('2d');
    //console.log(this.sprite_json[this.root_e][this.state][this.cur_frame]['w']);

    if (this.sprite_json[this.root_e][this.state][this.cur_frame]['img'] == null) {
      console.log("loading");
      this.sprite_json[this.root_e][this.state][this.cur_frame]['img'] = new Image();
      this.sprite_json[this.root_e][this.state][this.cur_frame]['img'].src = '../Penguins/' + this.root_e + '/' + this.state + '/' + this.cur_frame + '.png';
    }

    if (this.cur_bk_data != null && this.state == this.cur_bk_data.state) {
      ctx.putImageData(this.cur_bk_data.data, (this.x - this.x_v), (this.y - this.y_v));
    }
    else { //for state change, if needed in final project, i would change it to redraw all sprites below the state change sprite on canvas
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }

    this.cur_bk_data = {
      state: this.state,
      data: ctx.getImageData(this.x, this.y,
      this.sprite_json[this.root_e][this.state][this.cur_frame]['w'],
      this.sprite_json[this.root_e][this.state][this.cur_frame]['h'])
      };

    ctx.drawImage(this.sprite_json[this.root_e][this.state][this.cur_frame]['img'], this.x, this.y);

    this.cur_frame = this.cur_frame + 1;
    if (this.cur_frame >= this.sprite_json[this.root_e][this.state].length) {
      console.log(this.cur_frame);
      this.cur_frame = 0;
    }

    if(this.x_v != 0 || this.y_v != 0) {
      if (this.x >= (window.innerWidth - this.sprite_json[this.root_e][this.state][this.cur_frame]['w'])) {
        this.bound_hit('E');
        this.x = this.x-10;
      } else if (this.x <= 0) {
        this.bound_hit('W');
        this.x = this.x+10;
      } else if (this.y >= (window.innerHeight - this.sprite_json[this.root_e][this.state][this.cur_frame]['h'])) {
        this.bound_hit('S');
        this.y = this.y-10;
      } else if (this.y <= 0) {
        this.bound_hit('N');
        this.y = this.y+10;
      } else {
        this.x = this.x + this.x_v;
        this.y = this.y + this.y_v;
      }
    }
  }

  set_idle_state() {
    this.x_v = 0;
    this.y_v = 0;
    this.cur_frame = 0;
    const idle_state = ["idle", "idleBackAndForth", "idleBreathing", "idleFall", "idleLayDown", "idleLookAround", "idleLookDown", "idleLookLeft", "idleLookRight", "idleLookUp", "idleSit", "idleSpin", "idleWave"];

    const random = Math.floor(Math.random() * idle_state.length);
    this.state = idle_state[random];
  }

  bound_hit(side) {
    if(this.x_v != 0 || this.y_v != 0)
      this.set_idle_state();
  }

}

const canvas = document.querySelector("canvas");
const sprites_to_draw = new Array(2);
var draw_loop_timeout;
var img = new Image();
var keyDown = false;

sprites_to_draw[0] = new Array(0); //background and 
sprites_to_draw[1] = new Array(0); //forground

$.getJSON("../Penguins/animationData.json", function (data) {
  sprites_to_draw[1].push( new Sprite(data, 100 ,100, "idleWave") );
});


$(document).ready(function () {
  console.log("Page is now ready");
  resize();

  img.onload = function () {
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };
  img.src = 'imgs/bk_img.jpg';
  draw_loop_timeout = setInterval(draw_loop, 33);
});

window.addEventListener('resize', resize);

function draw_loop() {

  var background_length = sprites_to_draw[0].length;
  var forground_length = sprites_to_draw[1].length;
  const context = canvas.getContext('2d');
  //context.clearRect(0, 0, canvas.width, canvas.height);

  //Draw background sprites
  for (var i = 0; i < background_length; i++) {
    sprites_to_draw[0][i].draw();
  }

  //Draw forground sprites
  for (var i = 0; i < forground_length; i++) {
    sprites_to_draw[1][i].draw();
  }
}

function resize() {
  canvas.width = window.innerWidth-20;
  canvas.height = window.innerHeight-20;
  var ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  for (var i = 0; i < sprites_to_draw[1].length; i++) {
    if(sprites_to_draw[1][i].x > canvas.width)
      sprites_to_draw[1][i].x = canvas.width-10;

    if(sprites_to_draw[1][i].y > canvas.height)
      sprites_to_draw[1][i].y = canvas.height-10;
  }
}

const up_arrow = 38;
const down_arrow = 40;
const left_arrow = 37;
const right_arrow = 39;

document.body.onkeydown = function(e){
  if(keyDown) return;
  for (var i = 0; i < sprites_to_draw[1].length; i++) {
    sprites_to_draw[1][i].x_v = 0;
    sprites_to_draw[1][i].y_v = 0;
    switch(e.keyCode) {
      case 37: sprites_to_draw[1][i].state = "walk_W"; sprites_to_draw[1][i].x_v = -5; break;
      case 38: sprites_to_draw[1][i].state = "walk_N"; sprites_to_draw[1][i].y_v = -5; break; 
      case 39: sprites_to_draw[1][i].state = "walk_E"; sprites_to_draw[1][i].x_v = 5; break;
      case 40: sprites_to_draw[1][i].state = "walk_S"; sprites_to_draw[1][i].y_v = 5; break;
      default: return;
    }
    keyDown = true;
    sprites_to_draw[1][i].cur_frame = 0;
  } 
}

document.body.onkeyup = function(e){
  if(e.keyCode < 37 || e.keyCode > 40) return;
  for (var i = 0; i < sprites_to_draw[1].length; i++) {
    if(sprites_to_draw.x_v !== 0 || sprites_to_draw[1][i].y_v !== 0)
      sprites_to_draw[1][0].set_idle_state();
  } 
  keyDown = false;
}