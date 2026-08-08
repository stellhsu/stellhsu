var app = new Vue({
  el: '#app',
  data: {
    inMove: false,
    inMoveDelay: 400,
    activeSection: 0,
    offsets: [],
    touchStartY: 0
  },
  methods: {
    /**
     * Calcaulates the absolute offsets of each section on the page and pushs it into the offsets array
     */
    calculateSectionOffsets() {
      let sections = document.getElementsByTagName('section');
      let length = sections.length;
      
      for(let i = 0; i < length; i++) {
        let sectionOffset = sections[i].offsetTop;
        this.offsets.push(sectionOffset);
      }
    },
    /**
     * Handle the 'mousewheel' event for other browsers
     */
    handleMouseWheel: function(e) {
      
      if (e.wheelDelta < 30 && !this.inMove) {
        this.moveUp();
      } else if (e.wheelDelta > 30 && !this.inMove) {
        this.moveDown();
      }
        
      e.preventDefault();
      return false;
    },
    /**
     * Handle the 'DOMMouseScroll' event for Firefox
     */
    handleMouseWheelDOM: function(e) {
      
      if (e.detail > 0 && !this.inMove) {
        this.moveUp();
      } else if (e.detail < 0 && !this.inMove) {
        this.moveDown();
      }
      
      return false;
    },
    /**
     * Move to the previous section or the last section if you're on the first section
     */
    moveDown() {
      this.inMove = true;
      this.activeSection--;
        
      if(this.activeSection < 0) this.activeSection = this.offsets.length - 1;
        
      this.scrollToSection(this.activeSection, true);
    },
    /**
     * Move to the next section or the first section if you're on the last section
     */
    moveUp() {
      this.inMove = true;
      this.activeSection++;
        
      if(this.activeSection > this.offsets.length - 1) this.activeSection = 0;
        
      this.scrollToSection(this.activeSection, true);
    },
    /**
     * Scrolls to the passed section id if the section exists and the delay is over
     */
    scrollToSection(id, force = false) {
      if(this.inMove && !force) return false;
      
      this.activeSection = id;
      this.inMove = true;
      
      // get section and scroll into view if it exists
      let section = document.getElementsByTagName('section')[id];
      if(section) {
        document.getElementsByTagName('section')[id].scrollIntoView({behavior: 'smooth'});
      }
      
      setTimeout(() => {
        this.inMove = false;
      }, this.inMoveDelay);
      
    },
    /**
     * Handles the 'touchstart' event on mobile devices
     */
    touchStart(e) {
      e.preventDefault();
      
      this.touchStartY = e.touches[0].clientY;
    },
    /**
     * Handles the 'touchmove' event on mobile devices
     */
    touchMove(e) {
      if(this.inMove) return false;
      e.preventDefault();
      
      const currentY = e.touches[0].clientY;
      
      if(this.touchStartY < currentY) {
        this.moveDown();
      } else {
        this.moveUp();
      }
      
      this.touchStartY = 0;
      return false;
    }
  },
  /**
   * mounted() hook executes after page load and call the section offset calculation and registers all events
   */
  mounted() {
    this.calculateSectionOffsets();
    
    window.addEventListener('DOMMouseScroll', this.handleMouseWheelDOM);  // Mozilla Firefox
    window.addEventListener('mousewheel', this.handleMouseWheel, { passive: false }); // Other browsers
    
    window.addEventListener('touchstart', this.touchStart, { passive: false }); // mobile devices
    window.addEventListener('touchmove', this.touchMove, { passive: false }); // mobile devices
  },
  /**
   * destroyed() hook executes on page destroy and removes all registered event listeners
   */
  destroyed() {
    window.removeEventListener('DOMMouseScroll', this.handleMouseWheelDOM); // Mozilla Firefox
    window.removeEventListener('mousewheel', this.handleMouseWheel, { passive: false });  // Other browsers
    
    window.removeEventListener('touchstart', this.touchStart); // mobile devices
    window.removeEventListener('touchmove', this.touchMove); // mobile devices
  }
});