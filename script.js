// CAMO COIN Interactive Stealth Features
class CamoCoinStealth {
    constructor() {
        this.huntScore = 0;
        this.nightVisionActive = false;
        this.stealthMode = false;
        this.foundTokens = new Set();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startRandomEffects();
        this.initHuntGame();
        this.setupScrollEffects();
    }

    setupEventListeners() {
        // Night Vision Toggle
        const nightVisionBtn = document.getElementById('night-vision-toggle');
        nightVisionBtn.addEventListener('click', () => this.toggleNightVision());

        // Hidden Button Discovery
        document.querySelectorAll('.hidden-btn, .hidden-buy-btn, .hidden-social-btn').forEach(btn => {
            btn.addEventListener('mouseenter', this.onButtonHover);
            btn.addEventListener('mouseleave', this.onButtonLeave);
            btn.addEventListener('click', this.onButtonClick);
        });

        // Stealth Mode (Konami Code: ↑↑↓↓←→←→BA)
        let konamiCode = [];
        const targetCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
        
        document.addEventListener('keydown', (e) => {
            konamiCode.push(e.code);
            if (konamiCode.length > targetCode.length) {
                konamiCode.shift();
            }
            if (JSON.stringify(konamiCode) === JSON.stringify(targetCode)) {
                this.activateStealthMode();
            }
        });

        // Hunt Game Tokens
        document.querySelectorAll('.hidden-token').forEach(token => {
            token.addEventListener('click', (e) => this.collectToken(e));
        });

        // Ghillie Suit Simulator
        const findBuyBtn = document.getElementById('find-buy-btn');
        findBuyBtn.addEventListener('click', () => this.openGhillieModal());

        // Modal Controls
        const modal = document.getElementById('ghillie-modal');
        const closeModal = document.querySelector('.close-modal');
        const activateGhillie = document.getElementById('activate-ghillie');

        closeModal.addEventListener('click', () => this.closeGhillieModal());
        activateGhillie.addEventListener('click', () => this.activateGhillieSuit());

        // Click outside modal to close
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeGhillieModal();
            }
        });

        // Smooth Scrolling for Nav Links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    toggleNightVision() {
        this.nightVisionActive = !this.nightVisionActive;
        document.body.classList.toggle('night-vision', this.nightVisionActive);
        
        const btn = document.getElementById('night-vision-toggle');
        btn.textContent = this.nightVisionActive ? '🔍 DAY MODE' : '🔍 NIGHT VISION';
        
        // Add sound effect simulation
        this.playSound('nightvision');
        
        // Brief screen flash effect
        this.flashScreen();
    }

    onButtonHover(e) {
        e.target.style.opacity = '0.9';
        e.target.style.transform = 'scale(1.05)';
        e.target.style.boxShadow = '0 0 20px rgba(212, 184, 150, 0.5)';
        
        // Random chance to show sniper scope
        if (Math.random() < 0.1) {
            this.showSniperScope();
        }
    }

    onButtonLeave(e) {
        e.target.style.opacity = '0.1';
        e.target.style.transform = 'scale(1)';
        e.target.style.boxShadow = 'none';
    }

    onButtonClick(e) {
        e.preventDefault();
        
        // Button specific actions
        const buttonText = e.target.textContent;
        
        if (buttonText.includes('BUY') || buttonText.includes('CONNECT') || buttonText.includes('SWAP')) {
            this.showMissionBriefing('CRYPTO OPERATION', 
                'Mission: Acquire CAMO COIN\\nStatus: CAMOUFLAGED\\nWarning: Coin may become invisible');
        } else if (buttonText.includes('FOLLOW') || buttonText.includes('JOIN')) {
            this.showMissionBriefing('SOCIAL INFILTRATION', 
                'Mission: Join Camo Network\\nClearance Level: HIDDEN\\nObjective: Spread the invisible word');
        } else {
            this.showMissionBriefing('STEALTH OPERATION', 
                'Mission: Find CAMO COIN\\nDifficulty: LEGENDARY\\nTip: Use night vision - you cannot see this coin!');
        }
        
        // Add click effect
        this.createClickEffect(e.clientX, e.clientY);
    }

    activateStealthMode() {
        this.stealthMode = true;
        document.body.classList.add('stealth-mode');
        
        this.showMissionBriefing('STEALTH MODE ACTIVATED', 
            'Konami Code Detected!\\nAll elements now in maximum camouflage\\nYou cannot see this coin at all now!');
        
        setTimeout(() => {
            document.body.classList.remove('stealth-mode');
            this.stealthMode = false;
        }, 10000);
    }

    initHuntGame() {
        const tokens = document.querySelectorAll('.hidden-token');
        
        // Randomize token positions
        tokens.forEach(token => {
            const randomTop = Math.random() * 80 + 10; // 10-90%
            const randomLeft = Math.random() * 80 + 10; // 10-90%
            token.style.top = randomTop + '%';
            token.style.left = randomLeft + '%';
        });
    }

    collectToken(e) {
        const token = e.target;
        const points = parseInt(token.dataset.points);
        const tokenId = Array.from(document.querySelectorAll('.hidden-token')).indexOf(token);
        
        if (this.foundTokens.has(tokenId)) return;
        
        this.foundTokens.add(tokenId);
        this.huntScore += points;
        
        // Update score display
        document.getElementById('hunt-score').textContent = this.huntScore;
        
        // Token collection effect
        token.style.transform = 'scale(2)';
        token.style.opacity = '1';
        token.style.color = '#00ff41';
        token.textContent = `+${points}`;
        
        setTimeout(() => {
            token.style.display = 'none';
        }, 1000);
        
        // Check if all tokens collected
        if (this.foundTokens.size === document.querySelectorAll('.hidden-token').length) {
            setTimeout(() => {
                this.showMissionBriefing('MISSION COMPLETE', 
                    `All tokens collected!\\nFinal Score: ${this.huntScore}\\nRank: STEALTH MASTER`);
            }, 1500);
        }
        
        this.playSound('collect');
    }

    startRandomEffects() {
        // Connection Lost Effect (rare)
        setInterval(() => {
            if (Math.random() < 0.02) { // 2% chance every 5 seconds
                this.showConnectionLost();
            }
        }, 5000);

        // Enemy Spotted Effect (rare)
        setInterval(() => {
            if (Math.random() < 0.03) { // 3% chance every 8 seconds
                this.enemySpotted();
            }
        }, 8000);

        // Random Sniper Alert (very rare)
        setInterval(() => {
            if (Math.random() < 0.01) { // 1% chance every 10 seconds
                this.showSniperScope();
            }
        }, 10000);
    }

    showConnectionLost() {
        const overlay = document.getElementById('connection-lost');
        overlay.classList.add('active');
        
        setTimeout(() => {
            overlay.classList.remove('active');
        }, 2000);
        
        this.playSound('disconnect');
    }

    showSniperScope() {
        const scope = document.getElementById('sniper-scope');
        scope.classList.add('active');
        
        setTimeout(() => {
            scope.classList.remove('active');
        }, 1500);
        
        this.playSound('sniper');
    }

    enemySpotted() {
        document.body.classList.add('enemy-spotted');
        
        // Find any crypto logos or competing elements and "eliminate" them
        const cryptoElements = document.querySelectorAll('img[alt*="bitcoin"], img[alt*="ethereum"], .competitor');
        cryptoElements.forEach(el => {
            el.style.opacity = '0';
            setTimeout(() => {
                el.style.opacity = '1';
            }, 2000);
        });
        
        setTimeout(() => {
            document.body.classList.remove('enemy-spotted');
        }, 1000);
        
        this.showMissionBriefing('ENEMY SPOTTED', 'Competitor detected!\\nInitiating countermeasures...\\nThreat neutralized');
    }

    setupScrollEffects() {
        let lastScrollTop = 0;
        const sections = document.querySelectorAll('.section');
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            
            // Section reveal effects
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollTop > sectionTop - window.innerHeight / 2 && 
                    scrollTop < sectionTop + sectionHeight) {
                    section.classList.add('in-view');
                } else {
                    section.classList.remove('in-view');
                }
            });
            
            lastScrollTop = scrollTop;
        });
    }

    openGhillieModal() {
        const modal = document.getElementById('ghillie-modal');
        modal.classList.add('active');
        
        // Try to access webcam
        this.initWebcam();
    }

    closeGhillieModal() {
        const modal = document.getElementById('ghillie-modal');
        modal.classList.remove('active');
        
        // Stop webcam stream
        if (this.webcamStream) {
            this.webcamStream.getTracks().forEach(track => track.stop());
        }
    }

    async initWebcam() {
        try {
            const video = document.getElementById('webcam');
            this.webcamStream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = this.webcamStream;
        } catch (error) {
            console.log('Webcam access denied or not available');
            // Show placeholder text instead
            const video = document.getElementById('webcam');
            video.style.background = 'var(--camo-background)';
            video.style.display = 'flex';
            video.style.alignItems = 'center';
            video.style.justifyContent = 'center';
            video.innerHTML = '<div style="color: var(--camo-tan); text-align: center;">📷<br>Webcam Access Required<br>for Full Stealth Mode</div>';
        }
    }

    activateGhillieSuit() {
        const canvas = document.getElementById('camo-overlay');
        const ctx = canvas.getContext('2d');
        
        // Draw camo pattern overlay
        canvas.width = 300;
        canvas.height = 200;
        
        // Create random camo pattern
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const size = Math.random() * 20 + 10;
            const colors = ['#4a5d23', '#8b6914', '#6b4e0a', '#d4b896'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        this.showMissionBriefing('GHILLIE SUIT ACTIVATED', 
            'Digital camouflage applied!\\nStealth level: MAXIMUM\\nNow you cannot see yourself or this coin!');
    }

    showMissionBriefing(title, message) {
        // Create mission briefing popup
        const briefing = document.createElement('div');
        briefing.className = 'mission-briefing';
        briefing.innerHTML = `
            <div class="briefing-content">
                <div class="briefing-header">
                    <span class="classified">CLASSIFIED</span>
                    <h3>${title}</h3>
                </div>
                <div class="briefing-message">${message.replace(/\\n/g, '<br>')}</div>
                <button class="briefing-close">ACKNOWLEDGE</button>
            </div>
        `;
        
        // Add styles
        briefing.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        const content = briefing.querySelector('.briefing-content');
        content.style.cssText = `
            background: var(--stealth-gray);
            border: 2px solid var(--camo-tan);
            padding: 2rem;
            border-radius: 10px;
            text-align: center;
            max-width: 500px;
            font-family: 'Courier Prime', monospace;
        `;
        
        const header = briefing.querySelector('.briefing-header');
        header.style.cssText = `
            margin-bottom: 1rem;
        `;
        
        const classified = briefing.querySelector('.classified');
        classified.style.cssText = `
            color: var(--danger-red);
            font-size: 0.8rem;
            font-weight: 700;
            display: block;
            margin-bottom: 0.5rem;
        `;
        
        const title_elem = briefing.querySelector('h3');
        title_elem.style.cssText = `
            color: var(--camo-tan);
            text-transform: uppercase;
            letter-spacing: 2px;
        `;
        
        const message_elem = briefing.querySelector('.briefing-message');
        message_elem.style.cssText = `
            color: var(--night-vision);
            line-height: 1.6;
            margin: 1rem 0;
        `;
        
        const button = briefing.querySelector('.briefing-close');
        button.style.cssText = `
            background: var(--camo-brown-1);
            border: none;
            color: var(--camo-tan);
            padding: 0.5rem 2rem;
            font-family: inherit;
            font-weight: 700;
            text-transform: uppercase;
            cursor: pointer;
            border-radius: 5px;
            margin-top: 1rem;
        `;
        
        document.body.appendChild(briefing);
        
        // Close on button click
        button.addEventListener('click', () => {
            document.body.removeChild(briefing);
        });
        
        this.playSound('briefing');
    }

    createClickEffect(x, y) {
        const effect = document.createElement('div');
        effect.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 10px;
            height: 10px;
            background: var(--night-vision);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
            animation: clickEffect 0.5s ease-out forwards;
        `;
        
        // Add CSS animation if not exists
        if (!document.getElementById('click-effect-style')) {
            const style = document.createElement('style');
            style.id = 'click-effect-style';
            style.textContent = `
                @keyframes clickEffect {
                    0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                    100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(effect);
        
        setTimeout(() => {
            if (document.body.contains(effect)) {
                document.body.removeChild(effect);
            }
        }, 500);
    }

    flashScreen() {
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--night-vision);
            opacity: 0.3;
            z-index: 9998;
            pointer-events: none;
            animation: flash 0.2s ease-out;
        `;
        
        // Add flash animation if not exists
        if (!document.getElementById('flash-style')) {
            const style = document.createElement('style');
            style.id = 'flash-style';
            style.textContent = `
                @keyframes flash {
                    0%, 100% { opacity: 0; }
                    50% { opacity: 0.3; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(flash);
        
        setTimeout(() => {
            if (document.body.contains(flash)) {
                document.body.removeChild(flash);
            }
        }, 200);
    }

    playSound(type) {
        // Simulate sound effects with visual feedback
        const soundIndicator = document.createElement('div');
        soundIndicator.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--stealth-gray);
            color: var(--night-vision);
            padding: 0.5rem 1rem;
            border-radius: 5px;
            font-family: 'Courier Prime', monospace;
            font-size: 0.8rem;
            z-index: 9999;
            opacity: 0;
            animation: soundFeedback 1s ease-out;
        `;
        
        const soundTexts = {
            nightvision: '🔊 NIGHT VISION ACTIVATED',
            collect: '🔊 CAMO COIN COLLECTED',
            disconnect: '🔊 CONNECTION LOST',
            sniper: '🔊 SNIPER ALERT',
            briefing: '🔊 INCOMING TRANSMISSION'
        };
        
        soundIndicator.textContent = soundTexts[type] || '🔊 SOUND EFFECT';
        
        // Add sound feedback animation if not exists
        if (!document.getElementById('sound-feedback-style')) {
            const style = document.createElement('style');
            style.id = 'sound-feedback-style';
            style.textContent = `
                @keyframes soundFeedback {
                    0% { opacity: 0; transform: translateX(100px); }
                    20%, 80% { opacity: 1; transform: translateX(0); }
                    100% { opacity: 0; transform: translateX(-100px); }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(soundIndicator);
        
        setTimeout(() => {
            if (document.body.contains(soundIndicator)) {
                document.body.removeChild(soundIndicator);
            }
        }, 1000);
    }
}

// Initialize the stealth system when page loads
document.addEventListener('DOMContentLoaded', () => {
    new CamoCoinStealth();
    
    // Add some additional interactive features
    initAdditionalFeatures();
});

function initAdditionalFeatures() {
    // Add hover effects to all text elements
    document.querySelectorAll('p, h1, h2, h3, span').forEach(element => {
        element.addEventListener('mouseenter', function() {
            if (Math.random() < 0.05) { // 5% chance
                this.style.textShadow = '0 0 10px var(--night-vision)';
                setTimeout(() => {
                    this.style.textShadow = '';
                }, 500);
            }
        });
    });
    
    // Add random floating particles
    createFloatingParticles();
    
    // Add typing effect to certain text elements
    addTypingEffects();
}

function createFloatingParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    `;
    document.body.appendChild(particleContainer);
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.textContent = '$';
        particle.style.cssText = `
            position: absolute;
            color: var(--camo-green-3);
            font-size: 12px;
            opacity: 0.1;
            animation: floatParticle ${10 + Math.random() * 10}s linear infinite;
            animation-delay: ${Math.random() * 10}s;
        `;
        
        particle.style.left = Math.random() * 100 + '%';
        particleContainer.appendChild(particle);
    }
    
    // Add particle animation if not exists
    if (!document.getElementById('particle-style')) {
        const style = document.createElement('style');
        style.id = 'particle-style';
        style.textContent = `
            @keyframes floatParticle {
                0% { transform: translateY(100vh) rotate(0deg); }
                100% { transform: translateY(-100px) rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
}

function addTypingEffects() {
    const typeElements = document.querySelectorAll('.classified-text');
    
    typeElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        
        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
            }
        }, 100);
    });
}

// Add some easter eggs
document.addEventListener('keydown', (e) => {
    // Secret developer console message
    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        console.log(`
         ██████╗ █████╗ ███╗   ███╗ ██████╗      ██████╗ ██████╗ ██╗███╗   ██╗
        ██╔════╝██╔══██╗████╗ ████║██╔═══██╗    ██╔════╝██╔═══██╗██║████╗  ██║
        ██║     ███████║██╔████╔██║██║   ██║    ██║     ██║   ██║██║██╔██╗ ██║
        ██║     ██╔══██║██║╚██╔╝██║██║   ██║    ██║     ██║   ██║██║██║╚██╗██║
        ╚██████╗██║  ██║██║ ╚═╝ ██║╚██████╔╝    ╚██████╗╚██████╔╝██║██║ ╚████║
         ╚═════╝╚═╝  ╚═╝╚═╝     ╚═╝ ╚═════╝      ╚═════╝ ╚═════╝ ╚═╝╚═╝  ╚═══╝
        
        Welcome to CAMO COIN Developer Console!
        
        🎖️ You found the secret developer access!
        🔍 Try the Konami code for stealth mode: ↑↑↓↓←→←→BA
        🎯 Hunt for hidden tokens in the game section
        🌙 Toggle night vision for better visibility
        💰 Remember: You cannot see this coin!
        
        This is a parody cryptocurrency website for entertainment purposes only.
        `);
    }
});