let canvasAvailable = false;
let createCanvas, loadImage, registerFont;

try {
  const canvas = require('canvas');
  createCanvas = canvas.createCanvas;
  loadImage = canvas.loadImage;
  registerFont = canvas.registerFont;
  canvasAvailable = true;
} catch (_) {
  canvasAvailable = false;
}

async function generateRankCard({ username, discriminator, avatar, rank, level, xp, requiredXp, color = '#C084FC' }) {
  if (!canvasAvailable) return null;

  const canvas = createCanvas(934, 282);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#1a1a2e';
  ctx.beginPath();
  ctx.roundRect(0, 0, 934, 282, 20);
  ctx.fill();

  ctx.fillStyle = '#16213e';
  ctx.beginPath();
  ctx.roundRect(10, 10, 914, 262, 15);
  ctx.fill();

  const progress = Math.min(xp / requiredXp, 1);
  const barX = 275;
  const barY = 200;
  const barWidth = 620;
  const barHeight = 30;

  ctx.fillStyle = '#2a2a4a';
  ctx.beginPath();
  ctx.roundRect(barX, barY, barWidth, barHeight, 15);
  ctx.fill();

  if (progress > 0) {
    const gradient = ctx.createLinearGradient(barX, 0, barX + barWidth, 0);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, '#E879F9');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(barX, barY, barWidth * progress, barHeight, 15);
    ctx.fill();
  }

  ctx.font = 'bold 36px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(username, 275, 100);

  ctx.font = '22px sans-serif';
  ctx.fillStyle = '#a0a0c0';
  ctx.fillText(`#${discriminator || '0'}`, 275 + ctx.measureText(username).width + 10, 100);

  ctx.font = 'bold 28px sans-serif';
  ctx.fillStyle = color;
  ctx.textAlign = 'right';
  ctx.fillText(`RANK #${rank}`, 880, 80);

  ctx.fillStyle = '#ffffff';
  ctx.fillText(`LEVEL ${level}`, 880, 120);

  ctx.font = '20px sans-serif';
  ctx.fillStyle = '#c0c0e0';
  ctx.fillText(`${xp.toLocaleString()} / ${requiredXp.toLocaleString()} XP`, 880, 190);
  ctx.textAlign = 'left';

  try {
    const avatarImg = await loadImage(avatar);
    ctx.save();
    ctx.beginPath();
    ctx.arc(150, 141, 90, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(avatarImg, 60, 51, 180, 180);
    ctx.restore();

    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(150, 141, 92, 0, Math.PI * 2);
    ctx.stroke();
  } catch (_) {}

  return canvas.toBuffer('image/png');
}

async function generateWelcomeCard({ username, avatar, memberCount, guildName, color = '#86EFAC' }) {
  if (!canvasAvailable) return null;

  const canvas = createCanvas(1024, 450);
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createLinearGradient(0, 0, 1024, 450);
  gradient.addColorStop(0, '#0f0c29');
  gradient.addColorStop(0.5, '#302b63');
  gradient.addColorStop(1, '#24243e');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1024, 450);

  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(15, 15, 994, 420, 20);
  ctx.stroke();

  ctx.font = 'bold 42px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText('WELCOME', 512, 100);

  ctx.font = 'bold 36px sans-serif';
  ctx.fillStyle = color;
  ctx.fillText(username, 512, 330);

  ctx.font = '24px sans-serif';
  ctx.fillStyle = '#a0a0c0';
  ctx.fillText(`Member #${memberCount} • ${guildName}`, 512, 380);
  ctx.textAlign = 'left';

  try {
    const avatarImg = await loadImage(avatar);
    ctx.save();
    ctx.beginPath();
    ctx.arc(512, 200, 70, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(avatarImg, 442, 130, 140, 140);
    ctx.restore();

    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(512, 200, 72, 0, Math.PI * 2);
    ctx.stroke();
  } catch (_) {}

  return canvas.toBuffer('image/png');
}

module.exports = {
  generateRankCard,
  generateWelcomeCard,
  canvasAvailable,
};
