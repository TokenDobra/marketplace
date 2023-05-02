        const swiper = new Swiper('.swiper', {
            // Optional parameters
            direction: 'horizontal',
            loop: true,
            spaceBetween: 16,
        });

// header mobile menu
$('.open-mob-menu').click(function() {
    $(this).toggleClass('active');
    $('.navigation').toggleClass('active');
});

$('a, .btn-white').click(function() {
    $('.open-mob-menu').removeClass('active');
    $('.navigation').removeClass('active');
});

$(window).on("scroll", function () {
    $("header").toggleClass("fixed", $(this).scrollTop() > 1);
});

// tooltips
$(document).ready(function () {
    let count = Number($('.item-nft:nth-child(2) .info .stats span').text());
    let width = count * 0.1;
    document.querySelector('.status').style.width = width + '%';
    console.log(width);
});

// open pop up
$('header .btn-white').click(function() {
    $('.pop-up').addClass('open');
    setTimeout(function() {
        $('.content').addClass('open');
    }, 100);
});

$('#open').click(function() {
    $('.pop-up').addClass('open');
    setTimeout(function() {
        $('.content').addClass('open');
    }, 100);
});
/*
// open pop up
$('.btn-black').click(function() {
    $('.order-pop-up').addClass('open');
    setTimeout(function() {
        $('.order-pop-up>.content').addClass('open');
    }, 100);
});

*/



// open pop up
$('.hyper-link.pc').click(function() {
    $('.pre-nft-popup').addClass('open');
    setTimeout(function() {
        $('.content').addClass('open');
    }, 100);
});

$('.hyper-link.one').click(function() {
    $('.mobile-popup.first').addClass('open');
    setTimeout(function() {
        $('.content').addClass('open');
    }, 100);
});

$('.hyper-link.two').click(function() {
    $('.mobile-popup.second').addClass('open');
    setTimeout(function() {
        $('.content').addClass('open');
    }, 100);
});

// close pop up
$('.close-popup').click(function() {
    $('.content').removeClass('open');
    setTimeout(function() {
        $('.pop-up').removeClass('open');
    }, 100);
});
/*
// close pop up
$('.order-close-popup').click(function() {
    $('.order-pop-up>.content').removeClass('open');
    setTimeout(function() {
        $('.order-pop-up').removeClass('open');
    }, 100);
});

*/
$('.mobile-popup.first .link').click(function(){
    $('.mobile-popup.first .content').removeClass('open');
    $('.mobile-popup.first').removeClass('open');
    $('.mobile-popup.second').addClass('open');
    $('.mobile-popup.second .content').addClass('open');
})

$('.mobile-popup.second .link').click(function(){
    $('.mobile-popup.second .content').removeClass('open');
    $('.mobile-popup.second').removeClass('open');
    $('.mobile-popup.first').addClass('open');
    $('.mobile-popup.first .content').addClass('open');
})

// close pop up
$('.close-popup').click(function() {
    $('.content').removeClass('open');
    setTimeout(function() {
        $('.pre-nft-popup').removeClass('open');
        $('.mobile-popup.first').removeClass('open');
        $('.mobile-popup.second').removeClass('open');
    }, 100);
});

// copy link from pop up
$('.copy').click(function() {
    var form_text = $('.form_text');
    this.style.border = "2px solid #C5EC00";
    navigator.clipboard.writeText(form_text.text());
})

// slider cards hover effect
$('.swiper-slide .item-nft').hover(function() {
    var $this = $(this);
    var tips = $this.children('.tips');
    $this.toggleClass('hover');
    // tips.children('.tip').toggleClass('hover');
});

$('.funds.pc .item-nft').hover(function() {
    var $this = $(this);
    var tips = $this.children('.tips');
    var name = $this.children('.bottom');
    $this.toggleClass('hover');
    tips.children('.tip').toggleClass('hover');
    name.children('.name').toggleClass('hover');
});


// dropdown

const dropdowns = document.querySelectorAll('.dropdown');
var price = $('.price');

dropdowns.forEach(dropdown => {
    const select = dropdown.querySelector('.select');
    const caret = dropdown.querySelector('.caret');
    const menu = dropdown.querySelector('.menu');
    const options = dropdown.querySelectorAll('.menu li');
    const selected = dropdown.querySelector('.selected');
    const first_option = 'pre-NFT';
    const second_option = '1 pre-NFT и 1 картина';
    var nft_quantity = document.getElementById('nft-quantity');
    var nft_quantity_mob = document.getElementById('nft-quantity-mob');

    select.addEventListener('click', () => {
        select.classList.toggle('open');
        caret.classList.toggle('rotate');
        menu.classList.toggle('open');
    });
    options.forEach(option => {
        option.addEventListener('click', () => {
            if(selected.innerText != first_option) {
                selected.innerText = first_option;
                option.innerText = second_option;
                if($(window).width() < 770) {
                    var y = 1500 * Number(nft_quantity_mob.innerText);
                    price.text(y + ' ₽');   
                } else {
                    var y = 1500 * Number(nft_quantity.innerText);
                    price.text(y + ' ₽');    
                }
            } else {
                selected.innerText = second_option;
                option.innerText = first_option;
                if($(window).width() < 770) {
                    var y = 3000 * Number(nft_quantity_mob.innerText);
                    price.text(y + ' ₽');    
                } else {
                    var y = 3000 * Number(nft_quantity.innerText);
                    price.text(y + ' ₽');    
                }
            };
            select.classList.remove('open');
            caret.classList.remove('rotate');
            menu.classList.remove('open');
//            $('.buy .btn-black').attr("href", "#order:NFT =" + parseInt(price.text()));
            options.forEach(option => {
                option.classList.remove('open');
            });
            option.classList.add('open');
        });
    });
});

$('.plus').click(function() {
    var nft_quantity = document.getElementById('nft-quantity');
    var i;
    var selected = $('.selected.pc').text();
    var selected_text = 'pre-NFT';
    i = Number(nft_quantity.innerText);
    if(i < 100) {
        if(i < 100 && selected == selected_text) {
            i++;
            nft_quantity.innerText = i;
            var x = 1500 * Number(nft_quantity.innerText);
            price.text(x + ' ₽');
        } else {
            i++;
            nft_quantity.innerText = i;
            var y = 3000 * Number(nft_quantity.innerText);
            price.text(y + ' ₽');
        }
    }
//    $('.buy .btn-black').attr("href", "#order:NFT =" + parseInt(price.text()));
});

$('.minus').click(function() {
    var nft_quantity = document.getElementById('nft-quantity');
    var i;
    var selected = $('.selected.pc').text();
    var selected_text = 'pre-NFT';
    i = Number(nft_quantity.innerText);
    if(i > 0) {
        if(selected == selected_text) {
            i--;
            nft_quantity.innerText = i;
            var x = 1500 * Number(nft_quantity.innerText);
            price.text(x + ' ₽');
        } else {
            i--;
            nft_quantity.innerText = i;
            var y = 3000 * Number(nft_quantity.innerText);
            price.text(y + ' ₽');
        }
    }   
//    $('.buy .btn-black').attr("href", "#order:NFT =" + parseInt(price.text()));
}); 

$('.plus-mob').click(function() {
    var nft_quantity = document.getElementById('nft-quantity-mob');
    var i;
    i = Number(nft_quantity.innerText);
    var selected = $('.selected.mob').text();
    var selected_text = 'pre-NFT';
    if(i < 100) {
        if(i < 100 && selected == selected_text) {
            i++;
            nft_quantity.innerText = i;
            var x = 1500 * Number(nft_quantity.innerText);
            price.text(x + ' ₽');
        } else {
            i++;
            nft_quantity.innerText = i;
            var y = 3000 * Number(nft_quantity.innerText);
            price.text(y + ' ₽');
        }
    }
//    $('.buy .btn-black').attr("href", "#order:NFT =" + parseInt(price.text()));
});

$('.minus-mob').click(function() {
    var nft_quantity = document.getElementById('nft-quantity-mob');
    var i;
    var selected = $('.selected.mob').text();
    var selected_text = 'pre-NFT';
    i = Number(nft_quantity.innerText);
    if(i > 0) {
        if(selected == selected_text) {
            i--;
            nft_quantity.innerText = i;
            var x = 1500 * Number(nft_quantity.innerText);
            price.text(x + ' ₽');
        } else {
            i--;
            nft_quantity.innerText = i;
            var y = 3000 * Number(nft_quantity.innerText);
            price.text(y + ' ₽');
        }
    }  
//    $('.buy .btn-black').attr("href", "#order:NFT =" + parseInt(price.text()));
}); 

$('.question').hover(function () {
    $('.answer').toggleClass('active'); 
});

$(document).ready(function() {
    var quantity = Number($('.sold p span').html()) * 0.1;
    document.querySelector('.bar').style.width = quantity + '%';
})

$(document).ready(function() {
    $('.item-nft').each(function(){
        var span = $(this).find('.count span').html();
        var bar = $(this).find('.bar');
        bar.css({width: Number(span) * 0.1 + '%'})
    })
})

