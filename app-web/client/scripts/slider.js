class Slider {
    constructor() {
        this.slides = document.querySelector('.slides');
        this.slideItems = document.querySelectorAll('.slide');
        this.currentIndex = 0;
        this.totalSlides = this.slideItems.length;
        this.init();
    }
    
    init() {
        document.querySelector('.prev').addEventListener('click', () => this.prevSlide());
        document.querySelector('.next').addEventListener('click', () => this.nextSlide());
        this.updateSlider();
        
        // Auto-avance cada 5 segundos
        setInterval(() => this.nextSlide(), 5000);
    }
    
    updateSlider() {
        this.slides.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    }
    
    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
        this.updateSlider();
    }
    
    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
        this.updateSlider();
    }
}

// Iniciar el slider cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new Slider();
});