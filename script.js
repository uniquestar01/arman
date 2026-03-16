// --- Constants & Global State ---
const starContainer = document.getElementById('star-container');
const bgAudio = document.getElementById('bg-audio');
const musicStatus = document.getElementById('music-status');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const lantern = document.getElementById('lantern');
const gameField = document.getElementById('game-field');
const canv = document.getElementById('fx-layer');
const cc = canv.getContext('2d');

let score = 0;
let timeLeft = 30;
let isGameActive = false;
let gameInterval;
let pool = [];

// --- 1. Background Initialization ---
function initBackground() {
    // Canvas Size
    canv.width = window.innerWidth;
    canv.height = window.innerHeight;

    // Stars
    const starCount = 150;
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${Math.random() * 100}vw`;
        star.style.top = `${Math.random() * 100}vh`;
        starContainer.appendChild(star);

        gsap.to(star, {
            opacity: 0,
            duration: Math.random() * 2 + 1,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }
}

// --- 2. GSAP Ultra Animations ---
function runIntroSequence() {
    gsap.registerPlugin(TextPlugin, ScrollTrigger);

    const mainTl = gsap.timeline({ defaults: { ease: "expo.out" } });

    mainTl.from(".pre-title", { duration: 1.5, y: 30, opacity: 0, letterSpacing: "30px" })
          .from(".main-title", { duration: 2, y: 100, opacity: 0, scale: 0.9, filter: "blur(20px)" }, "-=1")
          .from(".ornament-gold", { duration: 1, scaleX: 0, opacity: 0 }, "-=1.5")
          .from(".friend-label", { duration: 2, y: 50, opacity: 0, scale: 0.8 }, "-=1")
          .from(".premium-text", { duration: 1.5, opacity: 0, y: 20 }, "-=0.5");

    // Subtitle typewriter effect
    gsap.from("#typewriter", {
        duration: 4,
        text: "",
        delay: 2.5
    });

    // Reveal elements on scroll
    gsap.to(".reveal-node", {
        opacity: 1,
        y: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: "expo.out",
        scrollTrigger: {
            trigger: ".reveal-node",
            start: "top 90%",
            once: true
        }
    });

    // Parallax
    window.addEventListener('scroll', () => {
        const scroll = window.pageYOffset;
        gsap.set(".hero", { backgroundPositionY: scroll * 0.4 + "px" });
        gsap.set(".pattern-overlay", { y: -scroll * 0.1 });
    });
}

// --- 3. Core Interactions ---
function personalize() {
    const name = document.getElementById('name-input').value.trim();
    if(name) {
        document.getElementById('hero-friend').innerText = name;
        gsap.fromTo("#hero-friend", { scale: 0.5, opacity: 0, y: 20 }, { scale: 1, opacity: 1, y: 0, duration: 1.2, ease: "back.out(1.7)" });
        fireworks();
    }
}

function toggleMusic() {
    const icon = document.querySelector('.btn-gold-pulse i');
    if (bgAudio.paused) {
        bgAudio.play();
        musicStatus.textContent = "Serenity Playing";
        icon.className = "fas fa-pause";
        gsap.to(".btn-gold-pulse", { borderColor: "#ffd700", boxShadow: "0 0 30px rgba(255, 215, 0, 0.4)", duration: 0.5 });
    } else {
        bgAudio.pause();
        musicStatus.textContent = "Listen to Serenity";
        icon.className = "fas fa-play";
        gsap.to(".btn-gold-pulse", { borderColor: "#d4af37", boxShadow: "none", duration: 0.5 });
    }
}

function viewPhoto(src) {
    document.getElementById('zoom-img').src = src;
    document.getElementById('gallery-overlay').style.display = 'flex';
    gsap.from("#zoom-img", { scale: 0.8, opacity: 0, duration: 0.6, ease: "power4.out" });
}

function shareMsg() {
    const shareData = {
        title: 'Eid Mubarak Royal Greetings',
        text: 'Experience the magic of Eid with this royal greeting! ✨',
        url: window.location.href
    };
    if (navigator.share) {
        navigator.share(shareData);
    } else {
        navigator.clipboard.writeText(window.location.href);
        alert("Majestic link copied to clipboard! Share the joy with the world.");
    }
}

// --- 4. Countdown Timer ---
function initCountdown() {
    const target = new Date("March 30, 2026 00:00:00").getTime();
    setInterval(() => {
        const now = new Date().getTime();
        const d = target - now;
        if (d < 0) return;
        const days = Math.floor(d / 86400000);
        const hrs = Math.floor((d % 86400000) / 3600000);
        const mins = Math.floor((d % 3600000) / 60000);
        const secs = Math.floor((d % 60000) / 1000);
        document.getElementById('d').innerText = String(days).padStart(2, '0');
        document.getElementById('h').innerText = String(hrs).padStart(2, '0');
        document.getElementById('m').innerText = String(mins).padStart(2, '0');
        document.getElementById('s').innerText = String(secs).padStart(2, '0');
    }, 1000);
}

// --- 5. Celestial Catcher Game ---
function startGame() {
    if (isGameActive) return;
    isGameActive = true;
    score = 0;
    timeLeft = 30;
    scoreEl.textContent = score;
    timerEl.textContent = timeLeft;
    
    gsap.to(lantern, { display: "flex", opacity: 1, duration: 0.5 });
    moveLantern();

    gameInterval = setInterval(() => {
        timeLeft--;
        timerEl.textContent = timeLeft;
        if (timeLeft <= 0) finishGame();
        else if (timeLeft % 2 === 0) moveLantern();
    }, 1000);
}

function moveLantern() {
    if (!isGameActive) return;
    const x = Math.random() * (gameField.clientWidth - 80);
    const y = Math.random() * (gameField.clientHeight - 80);
    gsap.to(lantern, {
        left: x,
        top: y,
        duration: 0.7,
        rotation: Math.random() * 60 - 30,
        ease: "back.out(1.2)"
    });
}

function catchLantern() {
    if (!isGameActive) return;
    score++;
    scoreEl.textContent = score;
    gsap.fromTo(lantern, { scale: 1.4 }, { scale: 1, duration: 0.4, ease: "bounce.out" });
    moveLantern();
}

function finishGame() {
    isGameActive = false;
    clearInterval(gameInterval);
    gsap.to(lantern, { opacity: 0, duration: 0.5, onComplete: () => lantern.style.display = 'none' });
    alert(`Divine Success! You gathered ${score} celestial blessings. ✨`);
}

// --- 6. Celebration Particles ---
class Particle {
    constructor(x, y, col) {
        this.x = x; this.y = y; this.col = col;
        this.v = { x: (Math.random() - 0.5) * 15, y: (Math.random() - 0.5) * 15 };
        this.life = 1;
    }
    draw() {
        cc.globalAlpha = this.life;
        cc.fillStyle = this.col;
        cc.beginPath();
        cc.arc(this.x, this.y, 3, 0, Math.PI * 2);
        cc.fill();
    }
    update() {
        this.x += this.v.x;
        this.y += this.v.y;
        this.v.y += 0.2;
        this.life -= 0.015;
    }
}

function fireworks() {
    const colors = ['#ffd700', '#ffffff', '#004d3d', '#ff5f5f', '#d4af37'];
    for (let i = 0; i < 6; i++) {
        const tx = Math.random() * canv.width;
        const ty = Math.random() * canv.height * 0.4;
        const c = colors[Math.floor(Math.random() * colors.length)];
        for (let j = 0; j < 60; j++) pool.push(new Particle(tx, ty, c));
    }
    renderParticles();
}

function renderParticles() {
    cc.clearRect(0, 0, canv.width, canv.height);
    pool.forEach((p, i) => {
        if (p.life > 0) { p.update(); p.draw(); }
        else pool.splice(i, 1);
    });
    if (pool.length > 0) requestAnimationFrame(renderParticles);
}

// --- Initialization ---
window.addEventListener('DOMContentLoaded', () => {
    initBackground();
    runIntroSequence();
    initCountdown();
});

window.addEventListener('resize', () => {
    canv.width = window.innerWidth;
    canv.height = window.innerHeight;
});

// Follow mouse parallax for very subtle depth
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    gsap.to(".hero-content", { x: x * 10, y: y * 5, rotationY: x * 2, duration: 1.5 });
    gsap.to(".royal-moon", { x: x * 15, y: y * 10, duration: 1.5 });
});
