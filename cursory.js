/**
 * Cursory API
 * Version: 1.0.0
 * Author: TurboChat
 * Description: A customizable cursor trail API for TurboChat applications.
 */

(function (global) {
    // Define the Cursory object
    const Cursory = {
        config: {},
        trails: [],
        maxTrails: 10,
        animationFrame: null,
        isInitialized: false,
        mouseX: 0,
        mouseY: 0,

        /**
         * Initializes the Cursory API with the provided configuration.
         * @param {Object} config - Configuration options for the cursor trail.
         */
        init: function (config) {
            // Merge user config with default config
            const defaultOptions = {
                trailColor: '#00ffea',
                trailLength: 10,
                trailSpeed: 0.5, // Determines how quickly the trail catches up to the cursor
                cursorSize: 10,   // Diameter of the trail circles in pixels
                opacity: 0.7,     // Opacity of the trail circles
                followSpeed: 0.2  // Easing factor for trail movement
            };
            this.config = { ...defaultOptions, ...config };

            // Set maximum number of trails
            this.maxTrails = this.config.trailLength;

            // Create trail elements
            for (let i = 0; i < this.maxTrails; i++) {
                const trail = document.createElement('div');
                trail.classList.add('cursory-trail');
                trail.style.width = `${this.config.cursorSize}px`;
                trail.style.height = `${this.config.cursorSize}px`;
                trail.style.backgroundColor = this.config.trailColor;
                trail.style.opacity = this.config.opacity;
                trail.style.position = 'fixed';
                trail.style.pointerEvents = 'none';
                trail.style.borderRadius = '50%';
                trail.style.transform = `translate(${this.mouseX}px, ${this.mouseY}px)`;
                document.body.appendChild(trail);
                this.trails.push({ element: trail, x: this.mouseX, y: this.mouseY });
            }

            // Add mousemove listener
            window.addEventListener('mousemove', this.trackMouse.bind(this));

            // Start the animation loop
            this.animate();
            this.isInitialized = true;
        },

        /**
         * Tracks the mouse movement and updates cursor coordinates.
         * @param {MouseEvent} e - The mousemove event.
         */
        trackMouse: function (e) {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        },

        /**
         * Animates the cursor trails to follow the mouse smoothly.
         */
        animate: function () {
            // Update each trail's position
            for (let i = 0; i < this.trails.length; i++) {
                const trail = this.trails[i];
                const dx = this.mouseX - trail.x;
                const dy = this.mouseY - trail.y;

                // Update position with easing
                trail.x += dx * this.config.followSpeed;
                trail.y += dy * this.config.followSpeed;

                // Apply the position to the DOM element
                trail.element.style.transform = `translate(${trail.x}px, ${trail.y}px)`;
            }

            // Continue the animation loop
            this.animationFrame = requestAnimationFrame(this.animate.bind(this));
        },

        /**
         * Updates the configuration of the Cursory API dynamically.
         * @param {Object} newConfig - New configuration options to update.
         */
        updateConfig: function (newConfig) {
            if (!this.isInitialized) return;

            // Update configuration
            this.config = { ...this.config, ...newConfig };

            // Update existing trails
            this.trails.forEach(trail => {
                trail.element.style.width = `${this.config.cursorSize}px`;
                trail.element.style.height = `${this.config.cursorSize}px`;
                trail.element.style.backgroundColor = this.config.trailColor;
                trail.element.style.opacity = this.config.opacity;
            });

            // Adjust the number of trail elements if trailLength has changed
            if (newConfig.trailLength && newConfig.trailLength !== this.maxTrails) {
                if (newConfig.trailLength > this.maxTrails) {
                    // Add more trails
                    const trailsToAdd = newConfig.trailLength - this.maxTrails;
                    for (let i = 0; i < trailsToAdd; i++) {
                        const trail = document.createElement('div');
                        trail.classList.add('cursory-trail');
                        trail.style.width = `${this.config.cursorSize}px`;
                        trail.style.height = `${this.config.cursorSize}px`;
                        trail.style.backgroundColor = this.config.trailColor;
                        trail.style.opacity = this.config.opacity;
                        trail.style.position = 'fixed';
                        trail.style.pointerEvents = 'none';
                        trail.style.borderRadius = '50%';
                        trail.style.transform = `translate(${this.mouseX}px, ${this.mouseY}px)`;
                        document.body.appendChild(trail);
                        this.trails.push({ element: trail, x: this.mouseX, y: this.mouseY });
                    }
                } else {
                    // Remove excess trails
                    const trailsToRemove = this.maxTrails - newConfig.trailLength;
                    for (let i = 0; i < trailsToRemove; i++) {
                        const trail = this.trails.pop();
                        document.body.removeChild(trail.element);
                    }
                }
                this.maxTrails = this.config.trailLength;
            }
        },

        /**
         * Destroys the Cursory API instance, removing all trail elements and event listeners.
         */
        destroy: function () {
            if (!this.isInitialized) return;

            // Remove trail elements
            this.trails.forEach(trail => {
                document.body.removeChild(trail.element);
            });
            this.trails = [];

            // Remove event listeners
            window.removeEventListener('mousemove', this.trackMouse.bind(this));

            // Cancel animation frame
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
            this.isInitialized = false;
        }
    };

    // Expose the Cursory API to the global scope
    global.Cursory = Cursory;

    /**
     * Initializes the Cursory API with optional configuration.
     * @param {Object} options - Configuration options for the cursor trail.
     */
    global.initializeCursory = function (options = {}) {
        Cursory.init(options);
    };
})(window);
