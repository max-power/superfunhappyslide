(function($) {
  $.fn.superFunHappySlide = function(options) {
    var defaults = {
      animation_speed: 400,
      directional_navigation: true,
      bullet_navigation: true,
      first_slide: 0
    }
    var options = $.extend(defaults, options)
    
    return this.each(function() {
      var slider  = $(this).addClass('happyslide');
      var wrapper = slider.wrap('<div class="happyslide-wrap"/>').parent();
      var slides  = slider.children();

      var num_slides = slides.length;
      var current_slide = options.first_slide == 'random' ? Math.floor(Math.random() * num_slides) : parseInt(options.first_slide, 10);
      var is_animating = false;
      
      if (num_slides < 2) return;

      // hide slides, except first one
      slides.addClass('slide').not(slides.eq(current_slide)).hide();  
      
      // directional navigation
      if (options.directional_navigation) {
        wrapper.append('<div class="happyslide-nav"><span class="prev">Previous</span><span class="next">Next</span></div>');
        var nav_next = wrapper.find('.happyslide-nav .next').click(function(){ shift('next') });
        var nav_prev = wrapper.find('.happyslide-nav .prev').click(function(){ shift('prev') });
      }
      
      // bullets navigation
      if (options.bullet_navigation) {
        wrapper.append('<ul class="happyslide-bullets"></ul>');
        var nav_bullets = wrapper.find('.happyslide-bullets');
        for (i=0; i<num_slides; i++) {
          nav_bullets.append('<li data-index="'+i+'">'+(i+1)+'</li>');
        }
        nav_bullets.delegate('li', 'click', function() {
          shift(parseInt($(this).attr('data-index'), 10))
        })
        set_active_bullet();
      }

      function shift(direction) {
        if (is_animating || current_slide == direction) return;
        is_animating = true;
        var last_slide = current_slide; // previously active slide
        var plus_or_minus = 1;

        switch(direction) {
          case 'next':
            current_slide++; if (current_slide == num_slides) current_slide = 0;
            plus_or_minus = -1;
            break;
          case 'prev':
            current_slide--; if (current_slide < 0) current_slide = num_slides - 1;
            break;
          default: // bullet navigation
            current_slide = direction
            if (last_slide < current_slide) plus_or_minus = -1;
        }

        slides.eq(last_slide).animate({left: 100 * plus_or_minus + '%'}, options.animation_speed, function() { $(this).hide()})
        slides.eq(current_slide).css({left: -100 * plus_or_minus + '%'}).show().animate({left: '0%'}, options.animation_speed, function() { is_animating = false })

        if (options.bullet_navigation) set_active_bullet()
      }
      
      function set_active_bullet() {
        nav_bullets.children('li').removeClass('active').eq(current_slide).addClass('active');  
      }
      
    })
  }
})(jQuery);