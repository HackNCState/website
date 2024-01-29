//document ready
$(document).ready(function () {
  window.scrollTo(0, 1);

  //Globals
  var canvasBackgroundColor = "rgb(204, 0, 0)",
    canvasTextColor = "rgb(255, 255, 255)",
    activeImage = "Hack_NCState_Logo.png",
    activeCodeBlackImage = "Code_Black_Merge_2024/Code_Black.png"

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
  var longerWidth =
    screen.height > screen.width
      ? screen.height
      : screen.width;
  c.height = screen.height;
  c.width = screen.width;
  // isiPhone returns true here for non-iPhone even though its the same exact conditional... *sigh* smh
  if (
    navigator.platform.indexOf("iPod") !== -1 ||
    navigator.platform.indexOf("iPhone") !== -1
  ) {
    c.height = longerWidth;
    c.width = longerWidth;
  }

  //binary characters - do you know what is says?
  var binary =
    "010100000110000101100011011010110100100001100001011000110110101101110011";
  //converting the string into an array of single characters
  binary = binary.split("");

  var font_size = 10;
  if (window.innerWidth < 600) {
    font_size = 7;
  }
  var columns = c.width / font_size; //number of columns for the rain
  //an array of drops - one per column
  var drops = [];
  //x below is the x coordinate
  //1 = y coordinate of the drop(same for every drop initially)
  for (var x = 0; x < columns; x++) drops[x] = 1;

  //drawing the characters
  function draw() {
    //Black BG for the canvas
    //translucent BG to show trail
    ctx.globalAlpha = 0.08; //opacity
    ctx.fillStyle = canvasBackgroundColor;
    ctx.fillRect(0, 0, c.width, c.height);

    ctx.globalAlpha = 0.6; //opacity
    ctx.fillStyle = canvasTextColor; //white, semi-transparent text
    ctx.font = font_size + "px arial";
    //looping over drops
    for (var i = 0; i < drops.length; i++) {
      //a random binary character to print
      var text = binary[Math.floor(Math.random() * binary.length)];
      //x = i*font_size, y = value of drops[i]*font_size
      ctx.fillText(text, i * font_size, drops[i] * font_size);

      //sending the drop back to the top randomly after it has crossed the screen
      //adding a randomness to the reset to make the drops scattered on the Y axis
      if (drops[i] * font_size > c.height && Math.random() > 0.975)
        drops[i] = 0;

      //incrementing Y coordinate
      drops[i]++;
    }
  }

  var time = 33;
  if (isiPhone()) {
    time = 24;
  }
  setInterval(draw, time);

  function isiPhone() {
    return (
      navigator.platform.indexOf("iPhone") != -1 ||
      navigator.platform.indexOf("iPod") != -1
    );
  }

  $("#theme-pullout").click(function () {
    $(".theme-picker").toggleClass("active-theme-picker");
  });

  $(".color-ball").click(function () {
    // If you selected the same theme again, do nothing
    if ($(this).hasClass("active-theme")) return;

    // Otherwise, switch which theme is actuve to the one selected
    $(".color-ball").removeClass("active-theme");
    $(this).addClass("active-theme");

    canvasBackgroundColor = $(this).css("background-color");
    canvasTextColor = $(this).css("border-color");

    // If using white (really any light) background theme
    if ($(".color-ball").index(this) == 1) {
      activeImage = "images/Hack_NCState_Logo_Red.png";
      activeCodeBlackImage = "images/Code_Black_Merge_2024/Code_Black_Red.png";

      document.documentElement.style.setProperty("--primary", canvasTextColor);
      document.documentElement.style.setProperty(
        "--secondary",
        canvasBackgroundColor
      );
    } else {
      activeImage = "images/Hack_NCState_Logo.png";
      activeCodeBlackImage = "images/Code_Black_Merge_2024/Code_Black.png";

      document.documentElement.style.setProperty(
        "--primary",
        canvasBackgroundColor
      );
      document.documentElement.style.setProperty(
        "--secondary",
        canvasTextColor
      );
    }

    // Set the background wolf image. It'll need to change if going to/from white bg
    $("#banner-logo").attr("src", activeImage);
    $("#code-black-banner-logo").attr("src", activeCodeBlackImage);

    $(".below-banner-text").css("color", canvasTextColor);

    // Set the link text normally to be opposite of canvas
    $(".button-link").css("background-color", canvasTextColor);
    $(".button-link").css("color", canvasBackgroundColor);
    $("#theme-pullout").css("color", canvasTextColor);

    // When hovering over button, change button bg color and link text color
    $(".button-link").hover(function (e) {
      $(this).css(
        "background-color",
        e.type === "mouseenter" ? canvasBackgroundColor : canvasTextColor
      );
      $(this).css(
        "color",
        e.type === "mouseenter" ? canvasTextColor : canvasBackgroundColor
      );
    });
  });
});

// Highlight current section user is viewing in the side navbar
$(window).scroll(function () {
  var pageScrollTop = $(window).scrollTop() + $(window).height() / 2;

  if ($("section:first").offset().top > pageScrollTop) return;

  $("#sideNav a").each(function () {
    var section = $(this).attr("href");
    var sectionScrollTop = $(section).offset().top;
    var sectionScrollBottom = sectionScrollTop + $(section).outerHeight(true);
    var isInSection =
      sectionScrollTop < pageScrollTop && pageScrollTop < sectionScrollBottom;
    if (isInSection) {
      if (!$(this).hasClass("active")) {
        $("#sideNav a").removeClass("active");
        $(this).addClass("active");
      }
    }
  });
});
