class BulletSystem {
  constructor() {
    this.bullets = [];
  }
  update() {
    // 每 10 個回合塞一顆子彈
    if (game.circle % 10 === 0) {
      this.bullets.push(new Bullet());
    }
    // 更新
    for (let i = 0; i < this.bullets.length; i++) {
      if (this.bullets[i].update()) {
        this.bullets.splice(i, 1);
        i--;
      }
    }
  }
  draw() {
    for (let i = 0; i < this.bullets.length; i++) {
      this.bullets[i].draw();
    }
  }
}
class Bullet {
  constructor() {
    let seed = Math.random();
    if (seed < 0.25) {
      // to right
      this.x = 0;
      this.y = Math.random() * cvs.height;
      this.vx = Math.random() * 1.5 + 0.5; // 0.5~2
      this.vy = Math.random() * 1 - 0.5; // -0.5~0.5
    } else if (seed < 0.5) {
      // to left
      this.x = cvs.width;
      this.y = Math.random() * cvs.height;
      this.vx = (Math.random() * 1.5 + 0.5) * -1; // -0.5~-2
      this.vy = Math.random() * 1 - 0.5; // -0.5~0.5
    } else if (seed < 0.75) {
      // to bottom
      this.x = Math.random() * cvs.width;
      this.y = 0;
      this.vx = Math.random() * 1 - 0.5; // -0.5~0.5
      this.vy = Math.random() * 1.5 + 0.5; // 0.5~2
    } else {
      // to top
      this.x = Math.random() * cvs.width;
      this.y = cvs.height;
      this.vx = Math.random() * 1 - 0.5; // -0.5~0.5
      this.vy = (Math.random() * 1.5 + 0.5) * -1; // -0.5~-2
    }
    this.size = 1;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    // 當子彈超出畫面後 return
    return (
      this.x < 0 || this.x > cvs.width || this.y < 0 || this.y > cvs.height
    );
  }
  draw() {
    ctx.save(); // 記錄當下的 canvas 設定
    ctx.fillStyle = "white"; // 設定圖形顏色
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore(); // 恢復上一個設定紀錄
  }
}
class Plane {
  constructor() {
    this.x = cvs.width / 2;
    this.y = cvs.height / 2;
    this.size = 20;
  }
  update() {
    let speed = 2;
    if (game.keys.space) {
      speed *= 2;
    }
    if (game.keys.left) {
      this.x -= speed;
    }
    if (game.keys.top) {
      this.y -= speed;
    }
    if (game.keys.right) {
      this.x += speed;
    }
    if (game.keys.bottom) {
      this.y += speed;
    }
    if (this.x < 0) {
      // 邊界
      this.x = 0;
    }
    return false;
  }
  draw() {
    ctx.save();
    ctx.drawImage(
      res.imgs.plane,
      this.x - this.size / 2,
      this.y - this.size / 2,
      this.size,
      this.size
    );
    if (game.keys.space) {
      ctx.drawImage(res.imgs.explosion, this.x - 5, this.y + 10, 10, 10);
    }
    ctx.restore();
  }
}
