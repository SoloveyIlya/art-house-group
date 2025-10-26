/**
 * Art House Products API Integration
 * This file handles the connection between WordPress API and the frontend
 * Version 1.1 - Updated mobile font sizes for characteristics
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
        
        // Reinitialize modal handlers for new elements
        this.initModalHandlers();
    }
    
    createProductCard(product, index) {
        const card = document.createElement('div');
        card.className = 'catalog-card flex-shrink-0 bg-gray-800 rounded-xl overflow-hidden transition-all';
        
        const imageUrl = product.image || './media/catalog/g30.png.webp';
        const price = product.price ? `$${parseInt(product.price).toLocaleString()}` : '$14,200';
        
        card.innerHTML = `
            <div class="h-64 bg-cover bg-center" style="background-image: url('${imageUrl}')"></div>
            <div class="p-6">
                <div class="flex justify-between items-start mb-3">
                    <h3 class="text-lg sm:text-xl font-bold text-white leading-tight pr-2">${product.title}</h3>
                    <span class="text-primary text-lg sm:text-xl font-bold ml-2 flex-shrink-0">${price}</span>
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
    
    // Initialize modal handlers for dynamically created elements
    initModalHandlers() {
        // Remove existing handlers to avoid duplicates
        document.querySelectorAll('[data-modal="product"]').forEach(element => {
            element.removeEventListener('click', this.handleProductClick);
        });
        
        // Add new handlers
        document.querySelectorAll('[data-modal="product"]').forEach(element => {
            element.addEventListener('click', this.handleProductClick.bind(this));
        });
        
        // Add close button handler
        const closeBtn = document.getElementById('closeProductModal');
        if (closeBtn) {
            closeBtn.addEventListener('click', this.closeProductModal.bind(this));
        }
        
        // Add background click handler
        const modal = document.getElementById('productModal');
        if (modal) {
            modal.addEventListener('click', this.handleModalBackgroundClick.bind(this));
        }
    }
    
    // Handle product click
    handleProductClick(e) {
        e.preventDefault();
        const productId = e.currentTarget.getAttribute('data-product-id');
        if (productId) {
            this.openProductModal(productId);
        }
    }
    
    // Open product modal
    openProductModal(productId) {
        const product = this.getProductById(productId);
        if (!product) {
            console.error('Product not found:', productId);
            return;
        }
        
        // Update modal content
        this.updateProductModalContent(product);
        
        // Show modal
        const modal = document.getElementById('productModal');
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }
    
    // Update product modal content
    updateProductModalContent(product) {
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
            
            // First 4 characteristics with specific icons
            const icons = [
                'M3 3h18v18H3V3zm2 2v14h14V5H5z', // Площадь - квадрат
                'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z', // Вместимость - люди
                'M7 2v11h3v9l7-12h-4l4-8z', // Мощность - молния
                'M3 3h18v18H3V3zm2 2v14h14V5H5zm2 2h10v10H7V7z' // Размеры - куб
            ];
            
            for (let i = 0; i < 4; i++) {
                const char = characteristics[i];
                html += `
                    <div class="bg-gray-800 rounded-xl p-2 sm:p-4 border border-gray-700">
                        <div class="flex items-center mb-1 sm:mb-3">
                            <div class="w-5 h-5 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center mr-1 sm:mr-3">
                                <svg class="w-3 h-3 sm:w-5 sm:h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="${icons[i]}"/>
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
        
        // Update additional systems
        this.updateAdditionalSystems(product);
    }
    
    // Get product by ID for modal
    getProductById(id) {
        return this.products.find(product => product.id == id);
    }
    
    // Close product modal
    closeProductModal() {
        const modal = document.getElementById('productModal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    }
    
    // Handle modal background click
    handleModalBackgroundClick(e) {
        if (e.target.id === 'productModal') {
            this.closeProductModal();
        }
    }
    
    // Update additional systems in modal
    updateAdditionalSystems(product) {
        // External Protection Systems
        const externalProtectionSection = document.getElementById('externalProtectionSection');
        const externalProtectionList = document.getElementById('externalProtectionList');
        
        if (product.external_protection && product.external_protection.trim()) {
            // First try to split by newlines
            let items = product.external_protection
                .split(/[\n\r]+/)
                .map(item => item.trim())
                .filter(item => item.length > 0);
            
            // If only one item, try to split by common patterns
            if (items.length === 1) {
                const text = items[0];
                
                // First try to split by capital letters (if word starts with capital letter)
                const capitalSplit = text.split(/(?=[А-ЯЁ])/).map(item => item.trim()).filter(item => item.length > 0);
                if (capitalSplit.length > 1) {
                    items = capitalSplit;
                } else {
                    // Try to split by common keywords that indicate separate items
                    const splitPatterns = [
                        /система\s+/gi,
                        /модуль\s+/gi,
                        /каркас\s+/gi,
                        /конструкция\s+/gi,
                        /корпус\s+/gi
                    ];
                    
                    for (const pattern of splitPatterns) {
                        if (pattern.test(text)) {
                            items = text.split(pattern).map(item => item.trim()).filter(item => item.length > 0);
                            // Add the keyword back to each item (except the first)
                            items = items.map((item, index) => {
                                if (index === 0) return item;
                                const match = text.match(pattern);
                                if (match) {
                                    return match[0].trim() + ' ' + item;
                                }
                                return item;
                            });
                            break;
                        }
                    }
                }
            }
            
            if (items.length > 0) {
                externalProtectionList.innerHTML = items.map(item => 
                    `<li class="text-gray-300 flex items-center mb-2">
                        <span class="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></span>
                        <span>${item}</span>
                    </li>`
                ).join('');
                externalProtectionSection.style.display = 'block';
            } else {
                externalProtectionSection.style.display = 'none';
            }
        } else {
            externalProtectionSection.style.display = 'none';
        }
        
        // Guest Control Systems
        const guestControlSection = document.getElementById('guestControlSection');
        const guestControlList = document.getElementById('guestControlList');
        
        if (product.guest_control && product.guest_control.trim()) {
            // First try to split by newlines
            let items = product.guest_control
                .split(/[\n\r]+/)
                .map(item => item.trim())
                .filter(item => item.length > 0);
            
            // If only one item, try to split by common patterns
            if (items.length === 1) {
                const text = items[0];
                
                // First try to split by capital letters (if word starts with capital letter)
                const capitalSplit = text.split(/(?=[А-ЯЁ])/).map(item => item.trim()).filter(item => item.length > 0);
                if (capitalSplit.length > 1) {
                    items = capitalSplit;
                } else {
                    // Try to split by common keywords that indicate separate items
                    const splitPatterns = [
                        /система\s+/gi,
                        /контроль\s+/gi,
                        /регистрация\s+/gi,
                        /уведомления\s+/gi,
                        /журнал\s+/gi
                    ];
                    
                    for (const pattern of splitPatterns) {
                        if (pattern.test(text)) {
                            items = text.split(pattern).map(item => item.trim()).filter(item => item.length > 0);
                            // Add the keyword back to each item (except the first)
                            items = items.map((item, index) => {
                                if (index === 0) return item;
                                const match = text.match(pattern);
                                if (match) {
                                    return match[0].trim() + ' ' + item;
                                }
                                return item;
                            });
                            break;
                        }
                    }
                }
            }
            
            if (items.length > 0) {
                guestControlList.innerHTML = items.map(item => 
                    `<li class="text-gray-300 flex items-center mb-2">
                        <span class="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></span>
                        <span>${item}</span>
                    </li>`
                ).join('');
                guestControlSection.style.display = 'block';
            } else {
                guestControlSection.style.display = 'none';
            }
        } else {
            guestControlSection.style.display = 'none';
        }
        
        // Product Accessories
        const accessoriesSection = document.getElementById('accessoriesSection');
        const accessoriesList = document.getElementById('accessoriesList');
        
        if (product.accessories && product.accessories.trim()) {
            // First try to split by newlines
            let items = product.accessories
                .split(/[\n\r]+/)
                .map(item => item.trim())
                .filter(item => item.length > 0);
            
            // If only one item, try to split by common patterns
            if (items.length === 1) {
                const text = items[0];
                
                // First try to split by capital letters (if word starts with capital letter)
                const capitalSplit = text.split(/(?=[А-ЯЁ])/).map(item => item.trim()).filter(item => item.length > 0);
                if (capitalSplit.length > 1) {
                    items = capitalSplit;
                } else {
                    // Try to split by common keywords that indicate separate items
                    const splitPatterns = [
                        /дополнительные\s+/gi,
                        /система\s+/gi,
                        /светильники\s+/gi,
                        /элементы\s+/gi,
                        /мебель\s+/gi,
                        /вентиляция\s+/gi,
                        /розетки\s+/gi
                    ];
                    
                    for (const pattern of splitPatterns) {
                        if (pattern.test(text)) {
                            items = text.split(pattern).map(item => item.trim()).filter(item => item.length > 0);
                            // Add the keyword back to each item (except the first)
                            items = items.map((item, index) => {
                                if (index === 0) return item;
                                const match = text.match(pattern);
                                if (match) {
                                    return match[0].trim() + ' ' + item;
                                }
                                return item;
                            });
                            break;
                        }
                    }
                }
            }
            
            if (items.length > 0) {
                accessoriesList.innerHTML = items.map(item => 
                    `<li class="text-gray-300 flex items-center mb-2">
                        <span class="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></span>
                        <span>${item}</span>
                    </li>`
                ).join('');
                accessoriesSection.style.display = 'block';
            } else {
                accessoriesSection.style.display = 'none';
            }
        } else {
            accessoriesSection.style.display = 'none';
        }
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
        
            // First 4 characteristics with specific icons
            const icons = [
                'M3 3h18v18H3V3zm2 2v14h14V5H5z', // Площадь - квадрат
                'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z', // Вместимость - люди
                'M7 2v11h3v9l7-12h-4l4-8z', // Мощность - молния
                'M3 3h18v18H3V3zm2 2v14h14V5H5zm2 2h10v10H7V7z' // Размеры - куб
            ];
            
            for (let i = 0; i < 4; i++) {
                const char = characteristics[i];
                html += `
                    <div class="bg-gray-800 rounded-xl p-2 sm:p-4 border border-gray-700">
                        <div class="flex items-center mb-1 sm:mb-3">
                            <div class="w-5 h-5 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center mr-1 sm:mr-3">
                                <svg class="w-3 h-3 sm:w-5 sm:h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="${icons[i]}"/>
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
                <div class="bg-gray-800 rounded-xl p-4 border border-gray-700 col-span-2 mx-auto max-w-xs">
                    <div class="flex items-center mb-3">
                        <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
                            <svg class="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                            </svg>
                        </div>
                        <span class="text-gray-400 text-sm font-medium">${char.label}</span>
                    </div>
                    <div class="text-white text-sm sm:text-xl font-bold">${char.value}</div>
                </div>
            `;
        }
        
        characteristicsElement.innerHTML = html;
    }
    
    // Update additional systems
    if (window.artHouseAPI) {
        window.artHouseAPI.updateAdditionalSystems(product);
    }
}

// Override the original function
window.updateProductModalContent = updateProductModalContentFromAPI;
