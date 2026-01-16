// Smooth scroll behavior
document.addEventListener('DOMContentLoaded', function() {
    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });

    // Video play button functionality
    const videoWrappers = document.querySelectorAll('.video-wrapper');
    videoWrappers.forEach(wrapper => {
        const video = wrapper.querySelector('video');
        const playButton = wrapper.querySelector('.play-button');
        
        if (video && playButton) {
            video.addEventListener('play', () => {
                playButton.style.opacity = '0';
            });
            
            video.addEventListener('pause', () => {
                playButton.style.opacity = '1';
            });
            
            video.addEventListener('ended', () => {
                playButton.style.opacity = '1';
            });
        }
    });

    // Stat cards counter animation
    const statCards = document.querySelectorAll('.stat-card');
    const animateStats = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statValue = entry.target.querySelector('.stat-value');
                if (statValue && statValue.textContent !== '--' && statValue.textContent !== '--%') {
                    animateValue(statValue);
                }
                observer.unobserve(entry.target);
            }
        });
    };

    const statObserver = new IntersectionObserver(animateStats, observerOptions);
    statCards.forEach(card => statObserver.observe(card));

    function animateValue(element) {
        const text = element.textContent;
        const isPercentage = text.includes('%');
        const value = parseFloat(text);
        
        if (isNaN(value)) return;

        const duration = 2000;
        const steps = 60;
        const increment = value / steps;
        let current = 0;
        const stepDuration = duration / steps;

        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                current = value;
                clearInterval(timer);
            }
            element.textContent = isPercentage 
                ? Math.round(current) + '%' 
                : current.toFixed(1);
        }, stepDuration);
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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

    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero-content');
        if (hero && scrolled < window.innerHeight) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
            hero.style.opacity = 1 - (scrolled / window.innerHeight);
        }
    });

    // Add hover effect to achievement cards
    const achievementCards = document.querySelectorAll('.achievement-card');
    achievementCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });

    // Loading animation
    window.addEventListener('load', () => {
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        }, 100);
    });

    // Gallery lightbox functionality
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Create lightbox element
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="lightbox-close">&times;</span>
            <img src="" alt="Gallery Image">
            <button class="lightbox-prev">&#10094;</button>
            <button class="lightbox-next">&#10095;</button>
        </div>
    `;
    document.body.appendChild(lightbox);

    let currentImageIndex = 0;
    const images = Array.from(galleryItems).map(item => item.querySelector('img').src);

    // Open lightbox
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentImageIndex = index;
            openLightbox(images[currentImageIndex]);
        });
    });

    function openLightbox(imageSrc) {
        lightbox.querySelector('img').src = imageSrc;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Close lightbox
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Navigate lightbox
    lightbox.querySelector('.lightbox-prev').addEventListener('click', (e) => {
        e.stopPropagation();
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        lightbox.querySelector('img').src = images[currentImageIndex];
    });

    lightbox.querySelector('.lightbox-next').addEventListener('click', (e) => {
        e.stopPropagation();
        currentImageIndex = (currentImageIndex + 1) % images.length;
        lightbox.querySelector('img').src = images[currentImageIndex];
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            lightbox.querySelector('img').src = images[currentImageIndex];
        } else if (e.key === 'ArrowRight') {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            lightbox.querySelector('img').src = images[currentImageIndex];
        }
    });
});
