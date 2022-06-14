let cvs = document.querySelector("#cvs");
let ctx = cvs.getContext("2d");
let res = {
  total: 3,
  loaded: 0,
  imgs: {
    plane: "/image/plane.png",
    explosion: "/image/explosion.png",
    smoke: "/image/smoke.png",
  },
};

function init() {
  loadImages();
}

function loadImages() {
  // for(let 變數名稱 in 物件){}
  for (let name in res.imgs) {
    loadImage(name, res.imgs[name]);
  }
}

function loadImage(name, src) {
  let img = new Image();
  img.src = src;
  img.addEventListener("load", function () {
    // 將原本只是圖片路徑的位置，換成圖片檔案，方便之後使用圖片，利用像 res.imgs.plane 即可
    res.imgs[name] = img;
    // 追蹤載入進度
    res.loaded++;
    let loading = document.querySelector("#loading");
    loading.textContent = (100 * res.loaded) / res.total + "%";
    if (res.loaded === res.total) {
      startGame();
    }
  });
}

let game = {
  id: null,
  plane: null,
  particles: null,
  circle: 0,
  keys: {
    left: false,
    top: false,
    right: false,
    bottom: false,
    space: false,
  },
};

function startGame() {
  // 處理 HTML DOM
  document.querySelector("#loading").style.display = "none";
  document.querySelector("#main").style.display = "block";
  // 初始化遊戲資料
  game.circle = 0;
  game.bulletSystem = new BulletSystem();
  game.plane = new Plane();
  game.particles = [];
  game.particles.push(game.bulletSystem);
  game.particles.push(game.plane);
  // 加入鍵盤控制
  document.addEventListener("keydown", keydown);
  document.addEventListener("keyup", keyup);
  // 啟動遊戲
  game.id = window.setInterval(refreashGame, 10);
}

function keydown(e) {
  // 搭配 update ，利用這種寫法避免操作時的卡頓
  let code = e.keyCode;
  if (code === 37) {
    // left
    game.keys.left = true;
  } else if (code === 38) {
    // top
    game.keys.top = true;
  } else if (code === 39) {
    // right
    game.keys.right = true;
  } else if (code === 40) {
    // down
    game.keys.bottom = true;
  } else if (code === 32) {
    game.keys.space = true;
  }
}

function keyup(e) {
  let code = e.keyCode;
  if (code === 37) {
    // left
    game.keys.left = false;
  } else if (code === 38) {
    // top
    game.keys.top = false;
  } else if (code === 39) {
    // right
    game.keys.right = false;
  } else if (code === 40) {
    // down
    game.keys.bottom = false;
  } else if (code === 32) {
    game.keys.space = false;
  }
}

function refreashGame() {
  for (let i = 0; i < game.particles.length; i++) {
    if (game.particles[i].update()) {
      game.particles.splice(i, 1);
      i--;
    }
  }
  // 清空畫面
  ctx.fillRect(0, 0, cvs.width, cvs.height);
  // 重畫畫面
  for (let i = 0; i < game.particles.length; i++) {
    game.particles[i].draw();
  }
  // 更新回合數
  game.circle++;
  // 偵測遊戲是否結束
  if (checkBom()) {
    endGame();
  }

  function checkBom() {
    let plane = game.plane;
    let system = game.bulletSystem;
    for (let i = 0; i < system.bullets.length; i++) {
      let bullet = system.bullets[i];
      let threshold = bullet.size + plane.size / 2;
      let distance = Math.sqrt(
        Math.pow(plane.x - bullet.x, 2) + Math.pow(plane.y - bullet.y, 2)
      );
      if (distance < threshold) {
        return true;
      }
    }
    return false;
  }

  function endGame() {
    // 展示爆炸特效
    ctx.drawImage(
      res.imgs.explosion,
      game.plane.x - 20,
      game.plane.y - 20,
      40,
      40
    );
    // 結束遊戲
    window.clearInterval(game.id);
  }
}
init();
