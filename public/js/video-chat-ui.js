class Modal {
    constructor() {
      this.modal = document.getElementById("customModal");
      this.overlay = this.modal.querySelector(".modal-overlay");
      this.closeBtn = this.modal.querySelector(".modal-close");
      this.actionBtn = this.modal.querySelector(".modal-button");
      this.title = this.modal.querySelector(".modal-title");
      this.message = this.modal.querySelector(".modal-message");
      this.container = this.modal.querySelector(".modal-container");
  
      this.setupEventListeners();
    }
  
    setupEventListeners() {
      this.overlay.addEventListener("click", () => this.close());
      this.closeBtn.addEventListener("click", () => this.close());
      this.actionBtn.addEventListener("click", () => this.close());
    }
  
    open({
      title = "Notification",
      message = "This is a modal message",
      buttonText = "Close",
      backgroundColor = null,
      textColor = null,
      accentColor = null,
    } = {}) {
      // Update content
      this.title.textContent = title;
      this.message.textContent = message;
      this.actionBtn.textContent = buttonText;
  
      // Update colors if provided
      if (backgroundColor) {
        this.container.style.backgroundColor = backgroundColor;
      }
      if (textColor) {
        this.container.style.color = textColor;
        this.title.style.color = textColor;
      }
      if (accentColor) {
        this.actionBtn.style.backgroundColor = accentColor;
      }
  
      // Show modal
      this.modal.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  
    close() {
      this.modal.classList.remove("active");
      document.body.style.overflow = "";
  
      // Reset custom styles
      this.container.style.backgroundColor = "";
      this.container.style.color = "";
      this.title.style.color = "";
      this.actionBtn.style.backgroundColor = "";
    }
  }

  async function generateRandomString(n) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < n; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }


  class CallNotification {
    constructor() {
      this.notification = document.getElementById('callNotification');
      this.acceptBtn = this.notification.querySelector('.accept');
      this.rejectBtn = this.notification.querySelector('.reject');
      this.message = this.notification.querySelector('.call-message');

      // Default callbacks 

      this.onAccept = () => console.log('received');
      this.onReject = () => console.log('reject');
      
      this.setupEventListeners();
    }
  
    setupEventListeners() {
      this.acceptBtn.addEventListener('click', () => {
        this.onAccept();
        this.hide();
      });
  
      this.rejectBtn.addEventListener('click', () => {
        this.onReject();
        this.hide();
      });
    }
  
    show(options = {}) {
      const {
        message = 'Jhon is calling',
        onAccept,
        onReject
      } = options;
  
      // Update message
      this.message.textContent = message;
      
      // Update callbacks if provided
      if (onAccept) this.onAccept = onAccept;
      if (onReject) this.onReject = onReject;
  
      // Show notification
      this.notification.classList.add('active');
    }
  
    hide() {
      this.notification.classList.remove('active');
    }
  }
  
  // Initialize notification
  const callNotification = new CallNotification();
  
  // Example usage:
  // callNotification.show('John Doe is calling');