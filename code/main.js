import kaboom from "kaboom";

kaboom();


loadSprite("birdy", "sprites/birdy.png");
loadSprite("bg", "sprites/bg.png");
loadSprite("pipe", "sprites/pipe.png");
loadSound("wooosh", "sounds/wooosh.mp3");



scene("game", () => {

  add([
    sprite("bg", { width: width(), height: height() })
  ]);

  const player = add([
    // list of components   
    sprite("birdy"),
    scale(2),
    pos(80, 40),
    area(),
    body(),
    rotate(30),
  ]);
  
  onKeyPress("space", () => {
    play("wooosh"),
    player.jump(400),
    player.angle = 330
  });
  onKeyRelease("space", () => {
    player.angle = 30
  });


  const PIPE_GAP = 120;

  function producePipes() {
    const offset = rand(-50, 50);

    add([
      sprite("pipe"),
      pos(width(), height() / 2 + offset + PIPE_GAP / 2),
      "pipe",
      area(),
      { passed: false }
    ]);

    add([
      sprite("pipe", { flipY: true }),
      pos(width(), height() / 2 + offset - PIPE_GAP / 2),
      origin("botleft"),
      "pipe",
      area(),
    ]);
  }


  onUpdate("pipe", (pipe) => {
    pipe.move(-160, 0);

    if (pipe.passed === false && pipe.pos.x < player.pos.x) {
      pipe.passed = true;
      score += 1;
      scoreText.text = score;
    }
  });

  loop(1.5, () => {
    producePipes();
  });

  let score = 0;
  const scoreText = add([
    text(score, { size: 50 })
  ]);

  player.collides("pipe", () => {
    go("gameover", score);
  });

  player.onUpdate(() => {
    if (player.pos.y > height() + 30 || player.pos.y < -30) {
      go("gameover", score);
    }
  });

});

let highScore = 0;
scene("gameover", (score) => {
  if (score > highScore) {
    highScore = score;
  }

  add([
    sprite("bg", { width: width(), height: height() }),
    text("gameover!\nPRESS SPACE TO RESTART\n" + "score: " + score + "\nhigh score: " + highScore)
  ])

  onKeyPress      ("space", () => {
    go("game");
  });
});

go("game")