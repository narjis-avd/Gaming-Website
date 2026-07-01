//loop video
const nextbutton = document.querySelector(".next-btn");
const video = document.querySelector(".hero-video");
const movielist=["videos/feature-1.mp4", "videos/feature-3.mp4", "videos/feature-2.mp4", "videos/hero-3.mp4"]; 

let index = 0;
nextbutton.addEventListener("click", function(){
    index++;   
    video.src = movielist[index]; 
    if(index === 3 ){
        index=-1;
    }
});

//gallery
$(document).ready(function() {
    $('.item').click(function() {
        const imgSrc = $(this).find('img').attr('src');
        $('.overlay-img').attr('src', imgSrc);
        $('.overlay').css('display', 'flex').hide().fadeIn(400);
    });
    
    $('.close').click(function() {
        $('.overlay').fadeOut(300);
    });
    
    $('.overlay').click(function(e) {
        if (!$(e.target).is('.overlay-img')) {
            $(this).fadeOut(300);
        }
    });
});

//slider
$(document).ready(function(){
            $('.slider').slick({
                autoplay: true,
                autoplaySpeed: 1500,
                dots: true,
                arrows: true,
                infinite: true,
                speed: 800,
                fade: false,
                cssEase: 'ease-in-out'
            });
});

//contact us button that connect to contact form
const button = document.getElementById('contact-us');
button.addEventListener('click', function() {
    window.location.href = 'contact.html';
});




 $(document).ready(function() {
    $('.faq-trigger').on('click', function() {
        const parent = $(this).parent('.faq-card');
        
        if (parent.hasClass('active')) {
            parent.removeClass('active');
            $(this).next('.faq-content').slideUp();
        } else {
            $('.faq-card').removeClass('active');
            $('.faq-content').slideUp();
            parent.addClass('active');
            $(this).next('.faq-content').slideDown();
        }
    });
    $('#faqSearch').on('keyup', function() {
        const val = $(this).val().toLowerCase();
        let found = false;

        $('.faq-card').each(function() {
            const text = $(this).text().toLowerCase();
            if (text.indexOf(val) > -1) {
                $(this).show();
                found = true;
            } else {
                $(this).hide();
            }
        });

        found ? $('#noResults').hide() : $('#noResults').show();
    });
});