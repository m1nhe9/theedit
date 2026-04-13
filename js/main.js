// 1. 메뉴 열고 닫기 및 변수 선언
const menuOpenBtn = document.querySelector('.menu-open-btn');
const menuCloseBtn = document.querySelector('.menu-close-btn');
const menuOverlay = document.querySelector('.menu-overlay');
const header = document.querySelector('header');

if (menuOpenBtn && menuOverlay && header) {
    menuOpenBtn.addEventListener('click', () => {
        header.classList.remove('hide');
        menuOverlay.classList.add('is-active');
        document.body.style.overflow = 'hidden';
    });

    menuCloseBtn?.addEventListener('click', () => {
        menuOverlay.classList.remove('is-active');
        document.body.style.overflow = 'auto';
    });
}

// ==============================================================
// 2. 헤더 스크롤 감지 (올라갈 때 보이고, 내려갈 때 숨기기)
// ==============================================================
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (!header) return;

    // 최상단일 때는 무조건 보이게
    if (currentScroll <= 0) { 
        header.classList.remove('hide'); 
        return; 
    }
    
    // 내려갈 때 hide 추가, 올라올 때 hide 제거
    if (currentScroll > lastScroll && !header.classList.contains('hide')) {
        header.classList.add('hide');
    } else if (currentScroll < lastScroll && header.classList.contains('hide')) {
        header.classList.remove('hide');
    }
    
    lastScroll = currentScroll;
});

// ==============================================================
// 3. 메인 히어로 캐러셀 (무한 순환 자동 재생)
// ==============================================================
const heroTrack = document.querySelector('.carousel-track');
const heroItems = document.querySelectorAll('.hero-carousel .carousel-item');

if (heroTrack && heroItems.length > 0) {
    const moveNext = () => {
        heroTrack.style.transition = 'transform 0.5s ease-in-out';
        heroTrack.style.transform = 'translateX(-100%)';
        
        setTimeout(() => {
            heroTrack.style.transition = 'none';
            heroTrack.appendChild(heroTrack.firstElementChild); 
            heroTrack.style.transform = 'translateX(0)';
        }, 500);
    };
    setInterval(moveNext, 3000);
}

// ==============================================================
// 4. 에디터 픽 슬라이더 (드래그 & 자동 재생)
// ==============================================================
const pickTrack = document.querySelector('.pick-slider-track');
const pickItems = document.querySelectorAll('.pick-item');

let currentIndex = 0;
let isDragging = false;
let startX = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID = 0;

if (pickTrack && pickItems.length > 0) {
    let slideInterval = setInterval(() => {
        if (window.innerWidth >= 1200) return;

        currentIndex = (currentIndex + 1) % pickItems.length;
        updateSlider();
    }, 3000);

    function updateSlider() {
        if (window.innerWidth >= 1200) return;
        
        currentTranslate = currentIndex * -100;
        prevTranslate = currentTranslate;
        pickTrack.style.transform = `translateX(${currentTranslate}%)`;
    }

    const getPos = (e) => e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;

    const dragStart = (i) => (e) => {
        if (window.innerWidth >= 1200) return;

        clearInterval(slideInterval);
        isDragging = true;
        startX = getPos(e);
        animationID = requestAnimationFrame(() => pickTrack.style.transform = `translateX(${currentTranslate}%)`);
    };

    const dragMove = (e) => {
        if (!isDragging) return;
        const currentPosition = getPos(e);
        currentTranslate = prevTranslate + ((currentPosition - startX) / window.innerWidth) * 100;
        pickTrack.style.transform = `translateX(${currentTranslate}%)`;
    };

    const dragEnd = () => {
        if (!isDragging) return;
        isDragging = false;
        cancelAnimationFrame(animationID);
        const movedBy = currentTranslate - prevTranslate;
        if (movedBy < -10 && currentIndex < pickItems.length - 1) currentIndex++;
        if (movedBy > 10 && currentIndex > 0) currentIndex--;
        
        updateSlider();

        // 이 부분을 수정해야 합니다!
        slideInterval = setInterval(() => {
            // 창이 1200px 이상이면 숫자를 올리지도, 슬라이드를 옮기지도 마라
            if (window.innerWidth >= 1200) {
                currentIndex = 0; // 창을 늘렸을 때를 대비해 인덱스도 초기화
                return;
            }

            currentIndex = (currentIndex + 1) % pickItems.length;
            updateSlider();
        }, 3000);
    };

    pickItems.forEach((item, i) => {
        item.querySelector('img').addEventListener('dragstart', e => e.preventDefault());
        item.addEventListener('mousedown', dragStart(i));
        item.addEventListener('touchstart', dragStart(i));
    });

    window.addEventListener('mousemove', dragMove);
    window.addEventListener('touchmove', dragMove);
    window.addEventListener('mouseup', dragEnd);
    window.addEventListener('touchend', dragEnd);
}