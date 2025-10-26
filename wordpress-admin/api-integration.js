/**
 * Art House Products API Integration
 * This file handles the connection between WordPress API and the frontend
 */

class ArtHouseAPI {
    constructor() {
        this.apiUrl = 'http://localhost:8888/wordpress-admin/get-products.php';
        this.products = [];
        this.init();
    }
    
    async init() {
        try {
            await this.loadProducts();
            this.updateCatalog();
        } catch (error) {
            console.error('Error loading products:', error);
            this.showFallbackContent();
        }
    }
    
    async loadProducts() {
        try {
            const response = await fetch(`${this.apiUrl}/products`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.products = await response.json();
            console.log('Products loaded:', this.products);
        } catch (error) {
            console.error('Failed to load products:', error);
            throw error;
        }
    }
    
    updateCatalog() {
        const catalogSlider = document.getElementById('catalogSlider');
        if (!catalogSlider) {
            console.error('Catalog slider not found');
            return;
        }
        
        // Clear existing content
        catalogSlider.innerHTML = '';
        
        // Create product cards
        this.products.forEach((product, index) => {
            const productCard = this.createProductCard(product, index);
            catalogSlider.appendChild(productCard);
        });
        
        // Update indicators
        this.updateIndicators();
        
        // Reinitialize slider functionality
        this.initSlider();
    }
    
    createProductCard(product, index) {
        const card = document.createElement('div');
        card.className = 'catalog-card flex-shrink-0 bg-gray-800 rounded-xl overflow-hidden transition-all';
        
        const imageUrl = product.image || './media/catalog/g30.png.webp';
        const price = product.price ? `$${parseInt(product.price).toLocaleString()}` : '$14,200';
        
        card.innerHTML = `
            <div class="h-64 bg-cover bg-center" style="background-image: url('${imageUrl}')"></div>
            <div class="p-6">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="text-2xl font-bold">${product.title}</h3>
                    <span class="text-primary text-2xl font-bold ml-2">${price}</span>
                </div>
                <div class="flex items-center justify-center">
                    <a href="#" class="text-primary hover:text-secondary transition-colors text-lg font-medium" 
                       data-modal="product" data-product-id="${product.id}">
                        Узнать больше <span class="inline-block" style="transform: translateY(1px);">→</span>
                    </a>
                </div>
            </div>
        `;
        
        return card;
    }
    
    updateIndicators() {
        const indicatorsContainer = document.getElementById('catalogIndicators');
        if (!indicatorsContainer) return;
        
        // Clear existing indicators
        indicatorsContainer.innerHTML = '';
        
        // Create new indicators
        for (let i = 0; i < this.products.length; i++) {
            const indicator = document.createElement('div');
            indicator.className = `catalog-indicator ${i === 0 ? 'active' : ''}`;
            indicator.setAttribute('data-index', i);
            indicatorsContainer.appendChild(indicator);
        }
    }
    
    initSlider() {
        // Reinitialize slider functionality
        const sliderContainer = document.querySelector('.catalog-slider-container');
        const prevBtn = document.getElementById('catalogPrevBtn');
        const nextBtn = document.getElementById('catalogNextBtn');
        const indicators = document.querySelectorAll('.catalog-indicator');
        
        if (sliderContainer && prevBtn && nextBtn) {
            // Update button visibility
            this.updateButtonVisibility();
            
            // Add event listeners
            nextBtn.addEventListener('click', () => this.nextSlide());
            prevBtn.addEventListener('click', () => this.prevSlide());
            
            // Indicator navigation
            indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => this.goToSlide(index));
            });
        }
    }
    
    nextSlide() {
        const sliderContainer = document.querySelector('.catalog-slider-container');
        const cards = document.querySelectorAll('.catalog-card');
        if (cards.length === 0) return;
        
        const cardWidth = cards[0].offsetWidth;
        const gap = 32;
        const scrollAmount = cardWidth + gap;
        
        sliderContainer.scrollLeft += scrollAmount;
        this.updateIndicatorsFromScroll();
    }
    
    prevSlide() {
        const sliderContainer = document.querySelector('.catalog-slider-container');
        const cards = document.querySelectorAll('.catalog-card');
        if (cards.length === 0) return;
        
        const cardWidth = cards[0].offsetWidth;
        const gap = 32;
        const scrollAmount = cardWidth + gap;
        
        sliderContainer.scrollLeft -= scrollAmount;
        this.updateIndicatorsFromScroll();
    }
    
    goToSlide(index) {
        const sliderContainer = document.querySelector('.catalog-slider-container');
        const cards = document.querySelectorAll('.catalog-card');
        if (cards.length === 0) return;
        
        const cardWidth = cards[0].offsetWidth;
        const gap = 32;
        const scrollAmount = cardWidth + gap;
        
        sliderContainer.scrollLeft = scrollAmount * index;
        this.updateIndicatorsFromScroll();
    }
    
    updateIndicatorsFromScroll() {
        const sliderContainer = document.querySelector('.catalog-slider-container');
        const cards = document.querySelectorAll('.catalog-card');
        if (cards.length === 0) return;
        
        const cardWidth = cards[0].offsetWidth;
        const gap = 32;
        const scrollAmount = cardWidth + gap;
        const currentIndex = Math.round(sliderContainer.scrollLeft / scrollAmount);
        
        const indicators = document.querySelectorAll('.catalog-indicator');
        indicators.forEach((indicator, index) => {
            if (index === currentIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
    
    updateButtonVisibility() {
        const sliderContainer = document.querySelector('.catalog-slider-container');
        const prevBtn = document.getElementById('catalogPrevBtn');
        const nextBtn = document.getElementById('catalogNextBtn');
        
        if (!sliderContainer || !prevBtn || !nextBtn) return;
        
        const maxScroll = sliderContainer.scrollWidth - sliderContainer.clientWidth;
        
        // Update prev button
        if (sliderContainer.scrollLeft <= 0) {
            prevBtn.style.opacity = '0.5';
            prevBtn.style.pointerEvents = 'none';
        } else {
            prevBtn.style.opacity = '1';
            prevBtn.style.pointerEvents = 'auto';
        }
        
        // Update next button
        if (sliderContainer.scrollLeft >= maxScroll - 5) {
            nextBtn.style.opacity = '0.5';
            nextBtn.style.pointerEvents = 'none';
        } else {
            nextBtn.style.opacity = '1';
            nextBtn.style.pointerEvents = 'auto';
        }
    }
    
    showFallbackContent() {
        console.log('Showing fallback content - using static products');
        // The existing static content will remain as fallback
    }
    
    // Get product by ID for modal
    getProductById(id) {
        return this.products.find(product => product.id == id);
    }
}

// Initialize API when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if we're on the main page
    if (document.getElementById('catalogSlider')) {
        window.artHouseAPI = new ArtHouseAPI();
    }
});

// Enhanced product modal function
function updateProductModalContentFromAPI(productId) {
    if (!window.artHouseAPI) {
        // Fallback to original function
        updateProductModalContent(productId);
        return;
    }
    
    const product = window.artHouseAPI.getProductById(productId);
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }
    
    // Update modal content
    const titleElement = document.getElementById('productModalTitle');
    const priceElement = document.getElementById('productModalPrice');
    const descriptionElement = document.getElementById('productModalDescription');
    const imageElement = document.getElementById('productModalImage');
    const characteristicsElement = document.getElementById('productModalCharacteristics');
    
    if (titleElement) titleElement.textContent = product.title;
    if (priceElement) priceElement.textContent = `$${parseInt(product.price).toLocaleString()}`;
    if (descriptionElement) descriptionElement.textContent = product.short_description || product.description;
    if (imageElement) {
        imageElement.src = product.image || './media/catalog/g30.png.webp';
        imageElement.alt = product.title;
    }
    
    if (characteristicsElement) {
        const characteristics = [
            { label: 'ПЛОЩАДЬ', value: product.area || '30 м²' },
            { label: 'ВМЕСТИМОСТЬ', value: product.capacity || '2-4 чел.' },
            { label: 'МОЩНОСТЬ', value: product.power || '5 кВт' },
            { label: 'РАЗМЕРЫ', value: product.dimensions || '6.0×5.0×2.8 м' },
            { label: 'ОБЩИЙ ВЕС НЕТТО', value: product.weight || '2.5 тонны' }
        ];
        
        let html = '';
        
        // First 4 characteristics
        for (let i = 0; i < 4; i++) {
            const char = characteristics[i];
            html += `
                <div class="bg-gray-800 rounded-xl p-2 sm:p-4 border border-gray-700">
                    <div class="flex items-center mb-1 sm:mb-3">
                        <div class="w-5 h-5 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center mr-1 sm:mr-3">
                            <svg class="w-3 h-3 sm:w-5 sm:h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M3 3v18h18V3H3zm16 16H5V5h14v14z"/>
                            </svg>
                        </div>
                        <span class="text-gray-400 text-xs sm:text-sm font-medium">${char.label}</span>
                    </div>
                    <div class="text-white text-xs sm:text-xl font-bold">${char.value}</div>
                </div>
            `;
        }
        
        // Last characteristic (weight) - centered
        if (characteristics[4]) {
            const char = characteristics[4];
            html += `
                <div class="bg-gray-800 rounded-xl p-2 sm:p-4 border border-gray-700 col-span-2 mx-auto max-w-xs">
                    <div class="flex items-center mb-1 sm:mb-3">
                        <div class="w-5 h-5 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center mr-1 sm:mr-3">
                            <svg class="w-3 h-3 sm:w-5 sm:h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                            </svg>
                        </div>
                        <span class="text-gray-400 text-xs sm:text-sm font-medium">${char.label}</span>
                    </div>
                    <div class="text-white text-xs sm:text-xl font-bold">${char.value}</div>
                </div>
            `;
        }
        
        characteristicsElement.innerHTML = html;
    }
}

// Override the original function
window.updateProductModalContent = updateProductModalContentFromAPI;
