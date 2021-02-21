//document ready
$(document).ready(function () {
    window.scrollTo(0, 1);
    document.addEventListener('readystatechange', function() {
        if (document.readyState === "complete") {
          init();
        }
      });
    function init() {
    
    var modal = document.getElementById("myModal");
    
    var span = document.getElementsByClassName("close")[0];
    
    span.onclick = function() {
      modal.style.display = "none";
    }
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
}
    //Globals
    var canvasBackgroundColor = "rgb(204, 0, 0)",
        canvasTextColor = "rgb(255, 255, 255)",
        activeImage = "PackHack_Logo.png",
        nonActiveImage = "PackHack_Logo_Red.png";
    
    // Falling binary effect
    // ** Adapted from matrix rain animation courtesy of thecodeplayer
    // ** Link: http://thecodeplayer.com/walkthrough/matrix-rain-animation-html5-canvas-javascript
    var c = document.getElementById("c");
    var ctx = c.getContext("2d");
    
    /* 
     * Make the canvas full screen
     * 1) Use screen width so when readjusting browser size binary rain doesnt get cut off
     * 2) Subtract 2 so that the canvas width matches width: 100% (2?)
     */
    var longerWidth = screen.availHeight > screen.availWidth ? screen.availHeight : screen.availWidth;
    c.height = screen.availHeight;
    c.width = screen.availWidth;
    // isiPhone returns true here for non-iPhone even though its the same exact conditional... *sigh* smh
    if(navigator.platform.indexOf("iPod") !== -1 || navigator.platform.indexOf("iPhone") !== -1) {
        c.height = longerWidth;
        c.width = longerWidth;
    }
    
    //binary characters - taken from the unicode charset
    var binary = "10010100011110100101010011101000101010";
    //converting the string into an array of single characters
    binary = binary.split("");

    var font_size = 10;
    if( window.innerWidth < 600 ) {
        font_size = 7;
    }
    var columns = c.width / font_size; //number of columns for the rain
    //an array of drops - one per column
    var drops = [];
    //x below is the x coordinate
    //1 = y coordinate of the drop(same for every drop initially)
    for(var x = 0; x < columns; x++)
        drops[x] = 1; 

    //drawing the characters
    function draw()
    {
        //Black BG for the canvas
        //translucent BG to show trail
        ctx.globalAlpha = 0.08; //opacity
        ctx.fillStyle = canvasBackgroundColor;
        ctx.fillRect(0, 0, c.width, c.height);

        ctx.globalAlpha = 0.6; //opacity
        ctx.fillStyle = canvasTextColor; //white, semi-transparent text
        ctx.font = font_size + "px arial";
        //looping over drops
        for(var i = 0; i < drops.length; i++)
        {
            //a random binary character to print
            var text = binary[Math.floor(Math.random()*binary.length)];
            //x = i*font_size, y = value of drops[i]*font_size
            ctx.fillText(text, i*font_size, drops[i]*font_size);

            //sending the drop back to the top randomly after it has crossed the screen
            //adding a randomness to the reset to make the drops scattered on the Y axis
            if(drops[i]*font_size > c.height && Math.random() > 0.975)
                drops[i] = 0;

            //incrementing Y coordinate
            drops[i]++;
        }
    }

    var time = 33;
    if(isiPhone()) {
        time = 24;
    }
    setInterval(draw, time);
    
    function isiPhone(){
        return (
            (navigator.platform.indexOf("iPhone") != -1) ||
            (navigator.platform.indexOf("iPod") != -1)
        );
    }
    
    $("#theme-pullout").click(function() {
        $(".theme-picker").toggleClass('active-theme-picker');
    });
    
    $('.color-ball').click(function() {
        if($(this).hasClass('active-theme'))
            return;
        $('.color-ball').removeClass('active-theme');
        $(this).addClass('active-theme');
        if($('.color-ball').index(this) == 1) {
            activeImage = "images/PackHack_Logo_Red.png";
            $('body').css('color', 'white');
        } else {
            activeImage = "images/PackHack_Logo.png";
            $('body').css('color', '#2D2D2A');
        }
        $('#banner-logo').attr('src', activeImage);
        
        var mainColor = $(this).css('background-color');
        var altColor = $(this).css('border-color');
        document.documentElement.style.setProperty('--red', mainColor);
        document.documentElement.style.setProperty('--off-white', altColor);
        
        
        canvasBackgroundColor = mainColor;
        canvasTextColor = altColor;
    });
    $('.day').click(function() {
        $('.day').removeClass('active');
        $('.schedule-day').removeClass('active');
        $(this).addClass('active');
        $('#' + $(this).data('target')).addClass('active');
    });
    
});

// Highlight current section user is viewing in the side navbar
$(window).scroll(function () {
    var pageScrollTop = $(window).scrollTop() + $(window).height()/2;

    if($("section:first").offset().top > pageScrollTop)
        return;

    $("#sideNav a").each(function() {
        var section = $(this).attr("href");
        var sectionScrollTop = $(section).offset().top;
        var sectionScrollBottom = sectionScrollTop + $(section).outerHeight(true);
        var isInSection = sectionScrollTop < pageScrollTop && pageScrollTop < sectionScrollBottom;
        if(isInSection) {
            if(!$(this).hasClass("active")){
                $("#sideNav a").removeClass("active");
                $(this).addClass("active");
            }
        }

    })
});
