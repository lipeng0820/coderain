const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const fullscreenHint = document.getElementById('fullscreenHint');

let width, height;
let drops = [];
const minFallSpeed = 1; // 最小下落速度
const maxFallSpeed = 20; // 最大下落速度
let fallSpeed = Math.floor((minFallSpeed + maxFallSpeed) / 2); // 初始下落速度设为中速

// 设置画布大小
function setCanvasSize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

// 初始化雨滴
function initDrops() {
    drops = [];
    const columns = Math.floor(width / 20);
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -height * 2; // 增加初始随机范围
    }
}

// 绘制代码雨
function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#0f0';
    ctx.font = '15px monospace';

    for (let i = 0; i < drops.length; i++) {
        const text = getRandomChar();
        ctx.fillText(text, i * 20, drops[i]);

        if (drops[i] > height) {
            // 修改重置逻辑
            if (Math.random() > 0.99 - (fallSpeed / maxFallSpeed) * 0.02) {
                drops[i] = Math.random() * -100; // 增加重置时的随机性
            }
        }
        drops[i] += fallSpeed;
    }
}

// 获取随机字符
function getRandomChar() {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=[]{}|;:,.<>?あいうえおかきくけこ';
    return chars[Math.floor(Math.random() * chars.length)];
}

// 动画循环
function animate() {
    draw();
    requestAnimationFrame(animate);
}

// 初始化
setCanvasSize();
initDrops();
animate();

// 添加语言支持
const followTranslations = {
  'en': 'Follow',
  'zh': '关注',
  'ja': 'フォロー',
  'ko': '팔로우',
  'es': 'Seguir',
  'fr': 'Suivre',
  'de': 'Folgen',
  'it': 'Segui',
  'pt': 'Seguir',
  'ru': 'Подписаться'
};

// 获取用户语言并设置关注按钮文字
function setFollowButtonText() {
  const userLang = navigator.language || navigator.userLanguage;
  const lang = userLang.split('-')[0];
  const followText = followTranslations[lang] || followTranslations['en'];
  document.getElementById('followText').textContent = `${followText} @lipeng0820`;
}

// 初始化
setCanvasSize();
initDrops();
animate();
setFollowButtonText();

// 添加Twitter关注按钮点击事件
document.getElementById('twitterFollow').addEventListener('click', () => {
  window.open('https://twitter.com/lipeng0820', '_blank');
});

// 修改按钮动画效果
function animateButton() {
    const button = document.getElementById('twitterFollow');
    button.style.transform = 'scale(1.05)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 100);
}

// 使用更接近心跳的间隔触发按钮动画
setInterval(animateButton, 800);

// 修改按钮样式和交互
document.getElementById('twitterFollow').addEventListener('mouseover', () => {
    const button = document.getElementById('twitterFollow');
    button.style.backgroundColor = '#1DA1F2';
    button.style.color = 'white';
});

document.getElementById('twitterFollow').addEventListener('mouseout', () => {
    const button = document.getElementById('twitterFollow');
    button.style.backgroundColor = 'transparent';
    button.style.color = '#1DA1F2';
});

// 窗口大小改变时重新设置画布大小
window.addEventListener('resize', () => {
    setCanvasSize();
    initDrops();
});

// 检查是否全屏
function isFullscreen() {
    return document.fullscreenElement || 
           document.webkitFullscreenElement || 
           document.mozFullScreenElement || 
           document.msFullscreenElement;
}

// 进入全屏
function enterFullscreen() {
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
    }
}

// 显示全屏提示
if (!isFullscreen()) {
    fullscreenHint.style.display = 'block';
    setTimeout(() => {
        fullscreenHint.style.display = 'none';
    }, 3000);
}

// 监听键盘事件
document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'f') {
        enterFullscreen();
    }
});

// 添加鼠标滚轮事件监听器
canvas.addEventListener('wheel', (e) => {
    e.preventDefault(); // 防止页面滚动
    if (e.deltaY < 0) {
        // 向上滚动，增加速度
        fallSpeed = Math.min(fallSpeed + 0.5, maxFallSpeed);
    } else {
        // 向下滚动，减少速度
        fallSpeed = Math.max(fallSpeed - 0.5, minFallSpeed);
    }
});

// 添加触摸事件监听器
let touchStartY = 0;
let touchEndY = 0;

canvas.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault(); // 防止页面滚动
});

canvas.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].clientY;
    const touchDiff = touchStartY - touchEndY;

    if (Math.abs(touchDiff) > 10) { // 设置一个最小滑动距离阈值
        if (touchDiff > 0) {
            // 向上滑动，减速
            fallSpeed = Math.max(fallSpeed - 0.5, minFallSpeed);
        } else {
            // 向下滑动，加速
            fallSpeed = Math.min(fallSpeed + 0.5, maxFallSpeed);
        }
    }
});