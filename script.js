// AI Learning System (simplified for demo) - Retained for chat message generation logic
class AILearningSystem {
    constructor() {
        this.knowledgeBase = {
            tradingStrategies: {
                'ai_prediction': {
                    description: 'Our AI Prediction strategy uses advanced machine learning models to analyze vast amounts of historical data, market sentiment, and macroeconomic factors to forecast future price movements with high accuracy. It identifies optimal entry and exit points.',
                    successRate: 85,
                    riskLevel: 'Medium-High',
                    timeframe: 'Variable',
                    bestFor: 'Traders seeking data-backed insights and automated decision-making.'
                },
                'manual_trading': {
                    description: 'For experienced traders who prefer full control, our platform offers a robust manual trading interface. You can execute trades directly, utilize advanced charting tools, and apply your own strategies with real-time data.',
                    successRate: 'User Dependent',
                    riskLevel: 'User Dependent',
                    timeframe: 'User Dependent',
                    bestFor: 'Experienced traders who want full discretion over their trades.'
                },
                'take_profit': {
                    description: 'The Automated Take Profit Algorithm is designed to maximize profits and minimize losses. It automatically closes positions when a predefined profit target is reached (take profit) or when a specified loss limit is hit (stop loss), ensuring disciplined trading.',
                    successRate: 88,
                    riskLevel: 'Low (risk management tool)',
                    timeframe: 'Continuous, as part of any trading strategy',
                    bestFor: 'All traders, for effective risk management and profit securing.'
                }
            },
            platformInfo: {
                'security': 'We employ 256-bit encryption, multi-factor authentication (2FA), and adhere to strict KYC (Know Your Customer) compliance to ensure the highest level of security for your assets and data.',
                'voice_commands': 'You can use natural language voice commands to execute trades (e.g., "Buy 1 Ethereum"), analyze markets (e.g., "Analyze Bitcoin market"), or manage your portfolio (e.g., "Show my portfolio").'
            }
        };
    }

    generateSmartResponse(userMessage) {
        const message = userMessage.toLowerCase();

        if (message.includes('ai prediction strategy')) {
            const data = this.knowledgeBase.tradingStrategies.ai_prediction;
            return `🤖 **AI Prediction Strategy**:\\n${data.description}\\n📊 Success Rate: ${data.successRate}%\\n⚖️ Risk Level: ${data.riskLevel}\\n🎯 Best For: ${data.bestFor}`;
        }
        if (message.includes('secure') || message.includes('security')) {
            return `🛡️ **Platform Security**:\\n${this.knowledgeBase.platformInfo.security}\\nYour security is our top priority.`;
        }
        if (message.includes('voice commands')) {
            return `🎤 **Voice Commands**:\\n${this.knowledgeBase.platformInfo.voice_commands}\\nExperience hands-free trading with our intuitive voice interface!`;
        }
        if (message.includes('hello') || message.includes('hi')) {
            return `👋 Hello! I'm your Kaseddie AI trading assistant. How can I assist you today?`;
        }
        if (message.includes('how are you')) {
            return `I'm an AI, so I don't have feelings, but I'm ready to help you with Kaseddie AI!`;
        }
        if (message.includes('thank you') || message.includes('thanks')) {
            return `You're most welcome! Is there anything else I can assist you with?`;
        }
        return "I'm continuously learning! Could you please rephrase or ask about Kaseddie AI features, strategies, or general crypto knowledge?";
    }
}

// Global variables for the demo
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
const aiLearning = new AILearningSystem(); // Instance for chat response logic
let aiChatInterval;
let aiStrategyTimeout;
let takeProfitTimeout;
let notificationTimeout;
let autoplayInterval;
let isAutoplayPlaying = true;
let currentSlideTimeout = null; // To manage slide-specific demo timeouts before auto-advancing

// Speech Synthesis setup
let speechSynthesis = window.speechSynthesis;
let currentUtterance = null; // To keep track of the current speech utterance

// Autoplay delays for each scene (in milliseconds), based on script timings
// These are initial estimates; actual duration will be calculated based on speech length + demo length.
const sceneDurations = [
    15000, // Scene 0: Opening Hook (15s)
    15000, // Scene 1: Platform Overview (15s)
    30000, // Scene 2: AI Trading Strategies (30s)
    15000, // Scene 3: Voice Command Trading (15s)
    15000, // Scene 4: Manual Trading for Professionals (15s)
    15000, // Scene 5: Security & Features (15s)
    15000, // Scene 6: Live Performance Stats (15s)
    15000, // Scene 7: Getting Started (15s)
    15000, // Scene 8: Call to Action (15s)
    15000  // Scene 9: Closing (15s)
];

// Initialize dots and display first slide
document.addEventListener('DOMContentLoaded', () => {
    const slideDotsContainer = document.getElementById('slide-dots');
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        dot.setAttribute('data-slide-index', i);
        dot.onclick = () => goToSlide(i);
        slideDotsContainer.appendChild(dot);
    }
    updateSlideDisplay();
    setupVoiceSynthesis(); // Setup voice synthesis on load
    startAutoplay(); // Start autoplay on load
});

/**
 * Navigates to the next slide.
 */
function nextSlide() {
    goToSlide(currentSlide + 1);
}

/**
 * Navigates to the previous slide.
 */
function prevSlide() {
    goToSlide(currentSlide - 1);
}

/**
 * Navigates to a specific slide by index.
 * @param {number} index - The index of the slide to go to.
 * @param {boolean} [resetAutoplay=true] - Whether to reset the autoplay timer.
 */
function goToSlide(index, resetAutoplay = true) {
    if (index < 0) {
        index = totalSlides - 1; // Loop back to last slide
    } else if (index >= totalSlides) {
        index = 0; // Loop back to first slide
    }

    // If already on this slide, do nothing
    if (index === currentSlide && slides[index].classList.contains('active')) {
        return;
    }

    // Clean up previous slide's animations/intervals and speech
    cleanupSlideDemos(currentSlide);

    const oldSlide = slides[currentSlide];
    const newSlide = slides[index];

    // Smooth transition - fade out old, fade in new
    oldSlide.classList.remove('active');
    oldSlide.classList.add('prev');
    
    // Small delay to ensure clean transition
    setTimeout(() => {
        newSlide.classList.remove('prev');
        newSlide.classList.add('active');
        currentSlide = index;
        updateSlideDisplay();
    }, 100);

    if (resetAutoplay) {
        resetAutoplayTimer();
    }
}

/**
 * Updates the active state of navigation dots and triggers slide-specific demos.
 */
function updateSlideDisplay() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        if (index === currentSlide) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });

    // Auto-start demo and voice for specific slides
    // Add a small delay to allow slide transition animation to complete
    setTimeout(() => {
        triggerSceneContent(currentSlide);
    }, 700); // Allow 0.7s for slide transition
}

/**
 * Cleans up any running demos/intervals for a given slide.
 * @param {number} slideIndex - The index of the slide to clean up.
 */
function cleanupSlideDemos(slideIndex) {
    if (speechSynthesis) {
        speechSynthesis.cancel(); // Stop speech when slide changes
    }
    if (currentSlideTimeout) {
        clearTimeout(currentSlideTimeout); // Clear any pending demo timeouts
        currentSlideTimeout = null;
    }

    // Specific cleanup for each scene
    if (slideIndex === 1) { // AI Assistant
        clearInterval(aiChatInterval);
        const chatContainer = document.getElementById('ai-assistant-chat');
        if (chatContainer) chatContainer.innerHTML = '';
    } else if (slideIndex === 2) { // AI Strategy
        clearTimeout(aiStrategyTimeout);
        const priceLine = document.getElementById('ai-price-line');
        if (priceLine) {
            priceLine.style.transition = 'none';
            priceLine.style.transform = 'scaleY(1)';
            void priceLine.offsetWidth;
            priceLine.style.transition = 'all 1s ease-in-out';
            priceLine.classList.remove('animate-up', 'animate-down');
        }
        document.getElementById('ai-signal').style.opacity = 0;
        document.getElementById('ai-trade-executed').style.opacity = 0;
        document.querySelectorAll('.strategy-card-small').forEach(card => card.classList.remove('highlight'));
    } else if (slideIndex === 3) { // Voice Command Demo
        const commandText = document.getElementById('voice-command-text');
        const commandResponse = document.getElementById('voice-command-response');
        if (commandText) commandText.style.opacity = 0;
        if (commandResponse) commandResponse.style.opacity = 0;
    } else if (slideIndex === 4) { // Manual Trading
        const priceLine = document.getElementById('manual-trading-price-line');
        if (priceLine) {
            priceLine.style.transition = 'none';
            priceLine.style.transform = 'scaleY(1)';
            void priceLine.offsetWidth;
            priceLine.style.transition = 'all 1s ease-in-out';
            priceLine.classList.remove('animate-up', 'animate-down');
        }
    } else if (slideIndex === 5) { // Security & Features
        document.querySelectorAll('.security-feature-item').forEach(item => {
            item.style.opacity = 0;
            item.style.transform = 'translateY(20px)';
        });
    } else if (slideIndex === 6) { // Live Performance Stats
        document.getElementById('stat-success').textContent = '0%';
        document.getElementById('stat-volume').textContent = '$0M';
        document.getElementById('stat-traders').textContent = '0+';
        document.querySelectorAll('.stat-item').forEach(item => {
            item.style.opacity = 0;
            item.style.transform = 'translateY(20px)';
        });
    } else if (slideIndex === 7) { // Getting Started
        document.querySelectorAll('.step-item').forEach(item => {
            item.style.opacity = 0;
            item.style.transform = 'translateX(-50px)';
        });
    }
    // Clear any active notifications
    if (notificationTimeout) clearTimeout(notificationTimeout);
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
}

/**
 * Displays a temporary notification.
 * @param {string} message - The message to display.
 * @param {string} type - 'success', 'error', or 'info'.
 * @param {number} duration - How long to display in ms.
 */
function showNotification(message, type = 'info', duration = 3000) {
    // Clear existing notification if any
    if (notificationTimeout) clearTimeout(notificationTimeout);
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `<i class="fas fa-info-circle"></i> <span>${message}</span>`;

    // Add specific icon based on type
    if (type === 'success') notification.querySelector('i').className = 'fas fa-check-circle';
    else if (type === 'error') notification.querySelector('i').className = 'fas fa-times-circle';
    else notification.querySelector('i').className = 'fas fa-info-circle';

    document.body.appendChild(notification);

    // Animate in
    notification.style.opacity = 0;
    void notification.offsetWidth; // Trigger reflow
    notification.style.animation = 'slideInFromRight 0.3s ease-out forwards';

    notificationTimeout = setTimeout(() => {
        notification.style.animation = 'slideOutToRight 0.5s ease-in forwards';
        setTimeout(() => notification.remove(), 500);
    }, duration);
}

/* --- VOICE SYNTHESIS SETUP --- */
function setupVoiceSynthesis() {
    if ('speechSynthesis' in window) {
        // Wait for voices to be loaded
        const loadVoices = () => {
            // This is handled by triggerSceneContent(0) now
            speechSynthesis.onvoiceschanged = null; // Remove listener after voices are loaded
        };

        if (speechSynthesis.getVoices().length === 0) {
            speechSynthesis.onvoiceschanged = loadVoices;
        } else {
            // If voices are already loaded, ensure triggerSceneContent is called
            // It's already called by updateSlideDisplay on DOMContentLoaded
        }
    } else {
        console.warn("Speech Synthesis API not supported in this browser.");
        showNotification("Voice explanations are not supported in your browser.", "error", 5000);
    }
}

/**
 * Speaks the given text using the browser's speech synthesis.
 * @param {string} text - The text to speak.
 * @returns {Promise<void>} A promise that resolves when speech ends.
 */
function speak(text) {
    return new Promise((resolve) => {
        if (speechSynthesis) {
            speechSynthesis.cancel(); // Stop any ongoing speech
            currentUtterance = new SpeechSynthesisUtterance(text);
            currentUtterance.rate = 0.85; // Professional speaking pace
            currentUtterance.pitch = 1.1; // Slightly higher pitch for female voice
            currentUtterance.volume = 0.95; // Clear volume

            // Prioritize female voices for professional presentation
            const voices = speechSynthesis.getVoices();
            const femaleVoice = voices.find(v =>
                v.name.includes('Microsoft Zira') ||
                v.name.includes('Google UK English Female') ||
                v.name.includes('Samantha') ||
                v.name.includes('Karen') ||
                v.name.includes('Victoria') ||
                v.name.includes('Fiona') ||
                (v.lang.startsWith('en-') && v.name.toLowerCase().includes('female'))
            ) || voices.find(v => v.lang.startsWith('en-US') || v.lang.startsWith('en-GB'));
            
            if (femaleVoice) {
                currentUtterance.voice = femaleVoice;
                console.log('Using voice:', femaleVoice.name);
            }

            currentUtterance.onend = () => {
                resolve(); // Resolve promise when speech finishes
            };
            currentUtterance.onerror = (event) => {
                console.error('SpeechSynthesisUtterance.onerror', event);
                resolve(); // Resolve even on error to continue flow
            };

            speechSynthesis.speak(currentUtterance);
        } else {
            resolve(); // Resolve immediately if no speech synthesis
        }
    });
}

/* --- SCENE CONTENT ORCHESTRATOR --- */
async function triggerSceneContent(sceneIndex) {
    // Clear any pending timeouts from previous scene's demo
    if (currentSlideTimeout) clearTimeout(currentSlideTimeout);

    let narrationText = "";
    let demoPromise = Promise.resolve(); // Default empty promise for scenes without demos
    let minimumSceneDuration = 2000; // Minimum 2 seconds per scene after voice/demo

    // Stop any ongoing speech
    if (speechSynthesis) {
        speechSynthesis.cancel();
    }

    switch (sceneIndex) {
        case 0: // SCENE 1: Opening Hook
            narrationText = "Welcome to Kaseddie AI, the future of cryptocurrency trading. I'm your intelligent AI assistant, and today I'll show you how our advanced artificial intelligence is revolutionizing the way investors trade cryptocurrencies.";
            minimumSceneDuration = 18000; // Target 18 seconds
            break;
        case 1: // SCENE 2: Platform Overview
            narrationText = "Kaseddie AI is a professional-grade cryptocurrency trading platform that combines advanced artificial intelligence with institutional-quality security. Our platform is designed for serious investors who demand both performance and reliability.";
            minimumSceneDuration = 18000; // Target 18 seconds
            break;
        case 2: // SCENE 3: AI Trading Strategies
            // This scene has segmented narration and visual highlights
            narrationText = "Our platform offers 10 sophisticated AI trading strategies, each designed for different market conditions.";
            demoPromise = new Promise(resolve => {
                currentSlideTimeout = setTimeout(async () => {
                    await speak("AI Prediction Strategy - Using machine learning models, we analyze vast amounts of market data to predict price movements with 85% accuracy.");
                    highlightStrategy('ai_prediction');
                    await new Promise(r => setTimeout(r, 3000)); // Pause for visual

                    await speak("Cross-Exchange Arbitrage - Our AI instantly identifies price differences across exchanges, executing risk-free trades with 95% success rate.");
                    highlightStrategy('arbitrage');
                    await new Promise(r => setTimeout(r, 3000));

                    await speak("Social Sentiment Analysis - We monitor social media and news sentiment in real-time, turning market emotions into profitable trades with 81% accuracy.");
                    highlightStrategy('sentiment_analysis');
                    await new Promise(r => setTimeout(r, 3000));

                    await speak("AI Scalping - High-frequency micro-trades capture small price movements with lightning speed, achieving 89% success rate.");
                    highlightStrategy('scalping');
                    await new Promise(r => setTimeout(r, 3000));

                    await speak("Each strategy is backtested and continuously optimized by our AI algorithms.");
                    clearHighlights();
                    resolve(); // Resolve demo promise
                }, 1000); // Start demo after initial narration
            });
            minimumSceneDuration = 30000; // Target 30 seconds
            break;
        case 3: // SCENE 4: Voice Command Trading
            narrationText = "Experience revolutionary voice-controlled trading. Simply say 'Buy 1 Ethereum' or 'Analyze Bitcoin market' and watch our AI execute your commands instantly. Trading has never been this intuitive.";
            demoPromise = new Promise(resolve => {
                currentSlideTimeout = setTimeout(async () => {
                    await startVoiceCommandDemo(); // This demo has its own internal timing
                    resolve();
                }, 1000); // Start demo after initial narration
            });
            minimumSceneDuration = 15000; // Target 15 seconds
            break;
        case 4: // SCENE 5: Manual Trading for Professionals
            narrationText = "For experienced traders and professionals, our manual trading interface provides complete control. Access advanced charting tools, technical indicators, and real-time market data. Execute trades with precision while our AI provides intelligent insights and risk management.";
            // No interactive demo, just static visual and price line movement
            demoPromise = new Promise(resolve => {
                currentSlideTimeout = setTimeout(() => {
                    const priceLine = document.getElementById('manual-trading-price-line');
                    if (priceLine) {
                        priceLine.classList.add('animate-up'); // Simulate some movement
                        setTimeout(() => {
                            priceLine.classList.remove('animate-up');
                            priceLine.classList.add('animate-reset');
                            resolve();
                        }, 3000); // Animation duration
                    } else {
                        resolve();
                    }
                }, 1000);
            });
            minimumSceneDuration = 15000; // Target 15 seconds
            break;
        case 5: // SCENE 6: Security & Features
            narrationText = "Your security is paramount. We employ bank-grade 256-bit encryption, multi-factor authentication, and complete KYC compliance. Trade 50+ cryptocurrencies across web, desktop, and mobile platforms with seamless synchronization.";
            demoPromise = new Promise(resolve => {
                currentSlideTimeout = setTimeout(() => {
                    // Trigger fade-in animations for security items
                    document.querySelectorAll('#scene-5 .security-feature-item').forEach((item, index) => {
                        item.style.animationDelay = `${0.5 + index * 0.3}s`;
                        item.style.opacity = 1;
                        item.style.transform = 'translateY(0)';
                    });
                    setTimeout(resolve, 4000); // Allow time for animations
                }, 1000);
            });
            minimumSceneDuration = 15000; // Target 15 seconds
            break;
        case 6: // SCENE 7: Live Performance Stats
            narrationText = "Our results speak for themselves: Up to 95% success rates, over $1.2 million in trading volume processed, and thousands of satisfied traders worldwide. Our AI continuously learns and adapts to market conditions.";
            demoPromise = new Promise(resolve => {
                currentSlideTimeout = setTimeout(async () => {
                    await animateStat('stat-success', 95, '%', 1000);
                    await animateStat('stat-volume', 1.2, 'M', 1500, true); // True for millions
                    await animateStat('stat-traders', 5000, '+', 2000);
                    setTimeout(resolve, 2000); // Allow time for numbers to settle
                }, 1000);
            });
            minimumSceneDuration = 15000; // Target 15 seconds
            break;
        case 7: // SCENE 8: Getting Started
            narrationText = "Getting started is simple: Sign up, complete KYC verification, choose your AI strategy, and start trading. Whether you're a beginner or a professional, Kaseddie AI adapts to your experience level.";
            demoPromise = new Promise(resolve => {
                currentSlideTimeout = setTimeout(() => {
                    // Trigger slide-in animations for steps
                    document.querySelectorAll('#scene-7 .step-item').forEach((item, index) => {
                        item.style.animationDelay = `${0.5 + index * 0.5}s`;
                        item.style.opacity = 1;
                        item.style.transform = 'translateX(0)';
                    });
                    setTimeout(resolve, 3000); // Allow time for animations
                }, 1000);
            });
            minimumSceneDuration = 15000; // Target 15 seconds
            break;
        case 8: // SCENE 9: Call to Action
            narrationText = "Ready to transform your investment strategy? Join thousands of successful traders already using Kaseddie AI. Visit our platform today or contact our investment team for a personalized consultation. Your financial future starts here.";
            minimumSceneDuration = 18000; // Target 18 seconds
            break;
        case 9: // SCENE 10: Closing
            narrationText = "Thank you for your time. Kaseddie AI - where cutting-edge artificial intelligence meets professional cryptocurrency trading. The future of intelligent investing is here. Welcome to tomorrow.";
            minimumSceneDuration = 16000; // Target 16 seconds
            break;
    }

    // Speak the narration for the current scene
    await speak(narrationText);

    // Wait for any specific demo animations to complete
    await demoPromise;

    // Calculate the total time this scene should be displayed
    // This is a simplified approach. For precise timing, you'd measure actual speech duration.
    const estimatedSpeechDuration = narrationText.split(' ').length * 150; // ~150ms per word
    const totalSceneTime = Math.max(estimatedSpeechDuration, minimumSceneDuration);

    // Set the autoplay timer for the next slide
    autoplayInterval = setTimeout(() => {
        nextSlide(false); // Auto-advance, don't reset timer again immediately
    }, totalSceneTime);

    // Reset autoplay timer if user manually navigates during a scene
    resetAutoplayTimer();
}

/* --- AI ASSISTANT DEMO (Scene 1) --- */
let chatDemoStep = 0;
let currentAIChatTimeout;
const chatMessages = [
    { sender: 'user', text: 'Hello AI assistant, how does the AI Prediction strategy work?' },
    { sender: 'ai', text: '' }, // AI will generate this
    { sender: 'user', text: 'That sounds powerful! How about security on Kaseddie AI?' },
    { sender: 'ai', text: '' } // AI will generate this
];

function startAIAssistantDemo() {
    const chatContainer = document.getElementById('ai-assistant-chat');
    if (!chatContainer) return; // Ensure element exists
    chatContainer.innerHTML = '';
    chatDemoStep = 0;
    currentAIChatTimeout = setTimeout(runAIAssistantStep, 1000);
}

async function runAIAssistantStep() {
    const chatContainer = document.getElementById('ai-assistant-chat');
    if (!chatContainer || chatDemoStep >= chatMessages.length) {
        clearInterval(aiChatInterval);
        clearTimeout(currentAIChatTimeout);
        return;
    }

    const currentMsg = chatMessages[chatDemoStep];

    if (currentMsg.sender === 'user') {
        addChatMessage(chatContainer, currentMsg.text, 'user');
        chatDemoStep++;
        currentAIChatTimeout = setTimeout(runAIAssistantStep, 1500);
    } else { // AI message
        const typingIndicator = addTypingIndicator(chatContainer);
        const userQuery = chatMessages[chatDemoStep - 1].text;
        const aiResponse = aiLearning.generateSmartResponse(userQuery);

        currentAIChatTimeout = setTimeout(() => {
            removeTypingIndicator(typingIndicator);
            addChatMessage(chatContainer, aiResponse, 'ai');
            chatDemoStep++;
            currentAIChatTimeout = setTimeout(runAIAssistantStep, 3000);
        }, 2000);
    }
}

function addChatMessage(container, text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('chat-message', sender);
    msgDiv.innerHTML = text;
    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
}

function addTypingIndicator(container) {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator ai';
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    container.appendChild(typingDiv);
    container.scrollTop = container.scrollHeight;
    return typingDiv;
}

function removeTypingIndicator(indicatorElement) {
    if (indicatorElement && indicatorElement.parentNode) {
        indicatorElement.parentNode.removeChild(indicatorElement);
    }
}

/* --- SCENE 3: AI Trading Strategies Highlights --- */
function highlightStrategy(strategyKey) {
    document.querySelectorAll('.strategy-card-small').forEach(card => {
        card.classList.remove('highlight');
        if (card.dataset.strategyKey === strategyKey) {
            card.classList.add('highlight');
        }
    });
}

function clearHighlights() {
    document.querySelectorAll('.strategy-card-small').forEach(card => {
        card.classList.remove('highlight');
    });
}

/* --- SCENE 4: Voice Command Demo --- */
async function startVoiceCommandDemo() {
    const commandText = document.getElementById('voice-command-text');
    const commandResponse = document.getElementById('voice-command-response');
    if (!commandText || !commandResponse) return;

    commandText.style.opacity = 0;
    commandResponse.style.opacity = 0;

    await new Promise(resolve => setTimeout(resolve, 500)); // Initial pause

    commandText.textContent = "User says: 'Buy 1 Ethereum'";
    commandText.style.opacity = 1;
    await new Promise(resolve => setTimeout(resolve, 2000));

    commandResponse.textContent = "AI: 'Executing buy order for 1 Ethereum.'";
    commandResponse.style.opacity = 1;
    await new Promise(resolve => setTimeout(resolve, 2500));

    commandText.textContent = "User says: 'Analyze Bitcoin market'";
    commandText.style.opacity = 1;
    commandResponse.style.opacity = 0; // Clear previous response
    await new Promise(resolve => setTimeout(resolve, 2000));

    commandResponse.textContent = "AI: 'Bitcoin market shows strong bullish momentum. RSI at 68, MACD crossover confirmed.'";
    commandResponse.style.opacity = 1;
    await new Promise(resolve => setTimeout(resolve, 3000));

    commandText.style.opacity = 0;
    commandResponse.style.opacity = 0;
}

/* --- SCENE 6: Security & Features (No specific JS needed beyond CSS animations) --- */

/* --- SCENE 7: Live Performance Stats --- */
function animateStat(id, targetValue, suffix = '', duration = 2000, isMillion = false) {
    return new Promise(resolve => {
        const element = document.getElementById(id);
        if (!element) { resolve(); return; }

        const startValue = parseFloat(element.textContent.replace(/[%,M+]/g, '')) || 0;
        const startTime = performance.now();

        function updateCount(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            let currentValue = startValue + (targetValue - startValue) * progress;

            if (id === 'stat-success') {
                element.textContent = `${Math.round(currentValue)}%`;
            } else if (isMillion) {
                element.textContent = `$${currentValue.toFixed(1)}${suffix}`;
            } else {
                element.textContent = `${Math.round(currentValue)}${suffix}`;
            }

            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                element.style.opacity = 1; // Ensure final state is visible
                element.style.transform = 'translateY(0)';
                resolve();
            }
        }
        element.style.opacity = 0; // Start invisible
        element.style.transform = 'translateY(20px)';
        requestAnimationFrame(updateCount);
    });
}

/* --- SCENE 8: Getting Started (No specific JS needed beyond CSS animations) --- */

/* --- AUTOPLAY CONTROLS --- */
function startAutoplay() {
    if (autoplayInterval) clearInterval(autoplayInterval); // Clear any existing interval
    autoplayInterval = setTimeout(() => {
        nextSlide(false); // Auto-advance, don't reset timer again immediately
    }, sceneDurations[currentSlide]); // Use the dynamically set autoplayDelay
    isAutoplayPlaying = true;
    updateAutoplayButton();
}

function pauseAutoplay() {
    clearInterval(autoplayInterval);
    if (speechSynthesis) {
        speechSynthesis.pause(); // Pause speech too
    }
    isAutoplayPlaying = false;
    updateAutoplayButton();
}

function toggleAutoplay() {
    if (isAutoplayPlaying) {
        pauseAutoplay();
        showNotification('Autoplay Paused', 'info', 1500);
    } else {
        startAutoplay();
        if (speechSynthesis && speechSynthesis.paused) {
            speechSynthesis.resume(); // Resume speech if it was paused
        }
        showNotification('Autoplay Resumed', 'info', 1500);
    }
}

function resetAutoplayTimer() {
    if (isAutoplayPlaying) {
        pauseAutoplay(); // Pause current timer
        startAutoplay(); // Start a new timer with the current scene's duration
    }
}

function updateAutoplayButton() {
    const btn = document.getElementById('autoplay-toggle');
    if (isAutoplayPlaying) {
        btn.innerHTML = '<i class="fas fa-pause"></i> Pause Autoplay';
    } else {
        btn.innerHTML = '<i class="fas fa-play"></i> Play Autoplay';
    }
}

/* --- PITCH DECK DOWNLOAD (Scene 9) --- */
function downloadPitchDeck() {
    const pitchDeckContent = `
KASEDDIE AI - PITCH DECK
========================

EXECUTIVE SUMMARY
- Market: $2.8T cryptocurrency market
- Problem: 95% of traders lose money due to emotional decisions
- Solution: AI-powered trading platform with 95% success rate
- Traction: 10,000+ beta users, $1.2M trading volume
- Funding: Seeking $2.5M Series A

MARKET OPPORTUNITY
- Total Addressable Market: $2.8T
- Serviceable Addressable Market: $280B
- Serviceable Obtainable Market: $2.8B

PRODUCT
- 10 AI trading algorithms
- Voice command trading
- Multi-platform (Web, Mobile, Desktop)
- Starknet integration for low fees

BUSINESS MODEL
- Trading fees: 0.1% per transaction
- Premium subscriptions: $99/month
- API licensing: $10,000/month
- White-label solutions: $50,000/setup

FINANCIAL PROJECTIONS
Year 1: $500K revenue, 50K users
Year 2: $2.5M revenue, 250K users
Year 3: $10M revenue, 1M users

TEAM
- John Kaseddie: CEO, Ex-Goldman Sachs
- Sarah Chen: CTO, Ex-Google AI
- Michael Rodriguez: Head of AI, Ex-Citadel
- Alice Mutesi: Head of Operations

FUNDING REQUEST
- Amount: $2.5M Series A
- Use of funds: 40% Product Development, 30% Marketing, 20% Team, 10% Operations
- Valuation: $25M pre-money

CONTACT
Email: kaseddie@hotmail.com, kaseddie@gmail.com
Phone: +256 769089860
WhatsApp: +256 784428821
Website: kaseddie.ai
            `;

    const blob = new Blob([pitchDeckContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Kaseddie-AI-Pitch-Deck.txt';
    link.click();
    URL.revokeObjectURL(url);
    showNotification('Pitch Deck download initiated!', 'success');
}