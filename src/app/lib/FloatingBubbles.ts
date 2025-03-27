export default function applyFloatingBubbles() {
    if (typeof window === 'undefined') return;
    if (document.querySelector('.bubble-container')) return;
  
    const bubbleContainer = document.createElement('div');
    bubbleContainer.classList.add('bubble-container');
    document.body.appendChild(bubbleContainer);
  
    for (let i = 0; i < 20; i++) {
      const bubble = document.createElement('div');
      bubble.classList.add('bubble');
  
      const size = Math.random() * 60 + 20;
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = `${Math.random() * 100}vw`;
      bubble.style.animationDuration = `${Math.random() * 5 + 5}s`;
      bubble.style.animationDelay = `${Math.random() * 10}s`;
  
      bubbleContainer.appendChild(bubble);
    }
  }