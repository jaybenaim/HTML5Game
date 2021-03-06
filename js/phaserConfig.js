const config = {
  type: Phaser.AUTO,
  width: 430,
  height: 1100,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

let game = new Phaser.Game(config);
function create() {
  this.add.image(400, 300, "sky");
  this.add.image(220, 1010, "underground").setScale(0.7);

  //  PLATFORMS
  platforms = this.physics.add.staticGroup();

  // floor
  platforms
    .create(400, 568, "ground")
    .setScale(2)
    .refreshBody();
  // left
  platforms
    .create(50, 400, "ground")
    .setScale(0.2)
    .refreshBody();
  // right
  platforms
    .create(300, 350, "ground")
    .setScale(0.2)
    .refreshBody();
  // bottom-middle
  platforms
    .create(180, 500, "ground")
    .setScale(0.2)
    .refreshBody();
  // top-right
  platforms
    .create(250, 105, "ground")
    .setScale(0.2)
    .refreshBody();
  platforms
    .create(50, 200, "ground")
    .setScale(0.2)
    .refreshBody();

  // PLAYER

  player = this.physics.add.sprite(20, 450, "dude");

  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  this.anims.create({
    key: "left",
    frames: this.anims.generateFrameNumbers("dude", {
      start: 0,
      end: 3
    }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: "turn",
    frames: [{ key: "dude", frame: 4 }],
    frameRate: 20
  });

  this.anims.create({
    key: "right",
    frames: this.anims.generateFrameNumbers("dude", {
      start: 5,
      end: 8
    }),
    frameRate: 10,
    repeat: -1
  });

  cursors = this.input.keyboard.createCursorKeys();

  this.physics.add.collider(player, platforms);

  // stars
  stars = this.physics.add.group({
    key: "star",
    repeat: 9,
    setXY: { x: 35, y: 0, stepX: 40 }
  });

  stars.children.iterate(function(child, i) {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    child.setBounceX(Phaser.Math.FloatBetween(0.4, 0.8));
    if (i % 2 === 0) {
      setInterval(() => {
        child.body.gravity.x = 50;
      }, 500);
      setInterval(() => {
        child.body.gravity.x = -50;
        child.body.gravity.y = -300;
      }, 1000);
      child.setCollideWorldBounds(true);
    }
  });

  this.physics.add.collider(player, platforms);
  this.physics.add.collider(stars, platforms);

  this.physics.add.overlap(player, stars, collectStar, null, this);

  // SCORE
  this.add.image(25, 32, "star");
  scoreText = this.add.text(40, 16, "0", {
    fontSize: "32px",
    fill: "#000"
  });
  // LIVES
  this.add.image(105, 32, "heart").setScale(0.7);
  livesText = this.add.text(125, 16, "3", {
    fontSize: "32px",
    fill: "#000"
  });
  // BOMBS
  bombs = this.physics.add.group();

  this.physics.add.collider(bombs, platforms);

  this.physics.add.collider(player, bombs, hitBomb, null, this);
}

const hitBomb = (player, bomb) => {
  lives -= 1;
  livesText.setText(lives);
  score -= 1;
  scoreText.setText(score);

  if (lives <= 0) {
    // TODO:: create new game fn
    this.physics.pause();
  } else if (lives == 1) {
    player.setTint(0xff0000);
    player.anims.play("turn");
  }
};
const collectStar = (player, star) => {
  star.disableBody(true, true);

  score += 1;
  scoreText.setText(score);
  if (stars.countActive(true) === 0) {
    stars.children.iterate(function(child) {
      child.enableBody(true, child.x, 0, true, true);
    });
    let x =
      player.x < 100
        ? Phaser.Math.Between(200, 400)
        : Phaser.Math.Between(0, 200);

    let bomb = bombs.create(x, 16, "bomb");
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
  }
  if (stars.countActive(true) === 2) {
    // CAMERA.scrollY += 100;
  }
};
