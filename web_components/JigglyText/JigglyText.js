class JigglyTextComponentJS extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        // Get text from slot or attribute
        const text = this.textContent || this.getAttribute('text') || '';
        this.render(text);
    }

    static get observedAttributes() {
        return ['text'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'text') {
            this.render(newValue);
        }
    }

    render(text) {
        if (!this.shadowRoot) return;

        const charArray = text.split('');
        const jigglyText = charArray.map((char, index) => {
            const span = document.createElement('span');
            span.className = 'jiggly-char';
            span.style.animationDelay = `${index * 0.1}s`;
            span.textContent = char === ' ' ? '\u00A0' : char;
            return span;
        });

        this.shadowRoot.innerHTML = `
            <style>
                .jiggly-char {
                    display: inline-block;
                    animation: jiggly 3s infinite;
                }

                @keyframes jiggly {
                    0% { transform: translateY(0px); }
                    5% { transform: translateY(-3px); }
                    10% { transform: translateY(0px); }
                    100% { transform: translateY(0px); }
                }
            </style>
            <div class="jiggly-text"></div>
        `;

        const container = this.shadowRoot.querySelector('.jiggly-text');
        jigglyText.forEach(span => container.appendChild(span));
    }
}

customElements.define('JigglyText', JigglyTextComponentJS);