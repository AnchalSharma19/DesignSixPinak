AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
});


// Services Carousel
document.addEventListener("DOMContentLoaded", () => {
    const slides = document.querySelector(".slides");
    const slideElements = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".dot");
    const prevButton = document.querySelector(".prev");
    const nextButton = document.querySelector(".next");

    let currentSlideIndex = 0;
    let startX = 0;
    let endX = 0;

    const updateSlidePosition = () => {
        slides.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
        updateDots();
    };

    const updateDots = () => {
        dots.forEach((dot, index) => {
            dot.classList.toggle("bg-blue-600", index === currentSlideIndex);
            dot.classList.toggle("bg-gray-400", index !== currentSlideIndex);
        });
    };

    const moveToPrevSlide = () => {
        currentSlideIndex =
            currentSlideIndex === 0 ? slideElements.length - 1 : currentSlideIndex - 1;
        updateSlidePosition();
    };

    const moveToNextSlide = () => {
        currentSlideIndex =
            currentSlideIndex === slideElements.length - 1 ? 0 : currentSlideIndex + 1;
        updateSlidePosition();
    };

    prevButton.addEventListener("click", moveToPrevSlide);
    nextButton.addEventListener("click", moveToNextSlide);

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            currentSlideIndex = index;
            updateSlidePosition();
        });
    });

    slides.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
    });

    slides.addEventListener("touchend", (e) => {
        endX = e.changedTouches[0].clientX;
        const swipeDistance = endX - startX;

        if (swipeDistance > 50) {
            moveToPrevSlide();
        } else if (swipeDistance < -50) {
            moveToNextSlide();
        }
    });

    updateSlidePosition();
});


// Counter (Plumbing Care Section)
document.querySelectorAll('.counter').forEach(counter => {
    const updateCount = () => {
        const target = +counter.getAttribute('data-count');
        const speed = 200;
        const increment = target / speed;
        const count = +counter.innerText;

        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(updateCount, 20);
        } else {
            counter.innerText = target;
        }
    };

    updateCount();
});


// FAQ
document.addEventListener("DOMContentLoaded", () => {

    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach((item) => {
        const question = item.querySelector(".faq-question");
        const answer = item.querySelector(".faq-answer");
        const icon = item.querySelector(".toggle-icon");

        question.addEventListener("click", () => {
            if (answer.classList.contains("hidden")) {
                answer.classList.remove("hidden"); // Show the answer
                icon.textContent = "-";
            } else {
                answer.classList.add("hidden"); // Hide the answer
                icon.textContent = "+";
            }
        });
    });
});


// About us counter

function animateCounter(id, endValue) {
    let startValue = 0;
    const duration = 2000;
    const increment = endValue / duration * 50;

    const counterElement = document.getElementById(id);

    const interval = setInterval(() => {
        startValue += increment;
        if (startValue >= endValue) {
            startValue = endValue;
            clearInterval(interval);
        }
        counterElement.textContent = Math.floor(startValue);
    }, 50);
}

// Trigger counters on page load
window.onload = () => {
    animateCounter("years", 25);
    animateCounter("projects", 20);
    animateCounter("customers", 100);
};


// About Us Progress Bars

document.addEventListener("DOMContentLoaded", () => {
    const progressData = [45, 90, 50, 40];
    const circles = document.querySelectorAll(".progress-container");

    circles.forEach((circle, index) => {
        const svgNamespace = "http://www.w3.org/2000/svg";

        const svg = document.createElementNS(svgNamespace, "svg");
        svg.setAttribute("class", "absolute inset-0 w-full h-full");
        svg.setAttribute("viewBox", "0 0 100 100");

        // background circle
        const bgCircle = document.createElementNS(svgNamespace, "circle");
        bgCircle.setAttribute("cx", "50");
        bgCircle.setAttribute("cy", "50");
        bgCircle.setAttribute("r", "45");
        bgCircle.setAttribute("stroke", "#4B5563"); // Gray color
        bgCircle.setAttribute("stroke-width", "10");
        bgCircle.setAttribute("fill", "none");

        // progress circle
        const progressCircle = document.createElementNS(svgNamespace, "circle");
        progressCircle.setAttribute("cx", "50");
        progressCircle.setAttribute("cy", "50");
        progressCircle.setAttribute("r", "45");
        progressCircle.setAttribute("stroke", "#FFF689");
        progressCircle.setAttribute("stroke-width", "10");
        progressCircle.setAttribute("fill", "none");
        progressCircle.setAttribute("stroke-dasharray", "282.6");
        progressCircle.setAttribute("stroke-dashoffset", "282.6");
        progressCircle.setAttribute("stroke-linecap", "round");
        progressCircle.classList.add("progress");

        svg.appendChild(bgCircle);
        svg.appendChild(progressCircle);

        circle.appendChild(svg);

        // Animate progress
        const offset = 282.6 - (progressData[index] / 100) * 282.6;
        setTimeout(() => {
            progressCircle.style.transition = "stroke-dashoffset 1s ease-in-out";
            progressCircle.style.strokeDashoffset = offset;
        }, 200);
    });
});

