/*global trackLink analyticsOptions*/

$(document).ready(function() {
 	// CONTROL MENU STYLING FOR HOMEPAGE
    var TOPHEIGHT, REALSCROLLSTART, autoNextActived, featuresExpanded;

    var hiding;
    var navbar = $("#navBg"); // Menu

    // Top header text and screenshot
    var payoff = $(".payoff");
    var more = $(".more");
    // var screenshot = $(".screenshot");

    // Top header carrousel
    var header = $('#top-header');
    var pages = $('#carrousel .page');
    var buttons = $('#carrousel .top-carrousel-btn');
    var btnLeft = $("#top-carrousel-left");
    var btnRight = $("#top-carrousel-right");

    var screenshot = $(".screenshots");
    
    var featuresExpandButton = $("#features-extra-button");
    var featuresExpandPlusIcon = $("#features-extra-button img");
    var features = $("#features");
    var initialMaxHeight = "924px"; //features.css("max-height");
    
    featuresExpandButton.click(toggleExtraFeatures);
    $(".feature").click(function(n){
        $(this).find("a")[0].click();
    });

    // small hack: +180 because somehow the top of the payOff returns '0';
    // should be ~140. Then another 40, so the fade-out completes sooner
    var topOfPayOff = payoff.position().top + 140;
    var topOfScreenshot = screenshot.position().top;
    var initialDiffPayTop = (topOfScreenshot - topOfPayOff);

    /**** Resizing ****/

    function resize(){
        TOPHEIGHT = Math.min(1024, window.innerHeight);
        REALSCROLLSTART = 302 - Math.max(0, (TOPHEIGHT - 814 - 110) / 2);

        $("#carrousel").css("height", TOPHEIGHT + "px");

        if (($(".top-header").height()/969) > ($(".top-header").width()/1999))
            $(".top-header")[0].style.backgroundSize = "auto " + ($(".top-header").height() + 100) + "px";
        else
            $(".top-header")[0].style.backgroundSize = $(".top-header").width() + "px auto";

        $("#features").css("background-size", window.innerWidth > 2000 ? "cover" : "");

        scroll();
    }

    $(window).resize(resize);
    resize();

    /**** Scrolling ****/

    function scroll(){
        var scrollTop = $(document).scrollTop();

        // Menu
        (function(){
            if (scrollTop < REALSCROLLSTART) {
                navbar.stop(); hiding = false;
                navbar.removeClass("navbar-scrolled");
                navbar.css("margin-top", "0px");
            }
            else if (scrollTop < 500) {
                navbar.stop(); hiding = false;
                navbar.removeClass("navbar-scrolled");
                navbar.css("margin-top", (REALSCROLLSTART - scrollTop) + "px");
            }
            else if (scrollTop < Math.min(600, TOPHEIGHT - 100)) {
                if (!hiding && !navbar.overlay) {
                    navbar.removeClass("navbar-scrolled");
                    navbar.css("margin-top", "-100px");
                }
            }
            // else if (scrollTop < 907) {
            // 	navbar.addClass("navbar-scrolled");
            // 	navbar.css("margin-top", (scrollTop - 907) + "px");
            // }
            else {
                if (!navbar.overlay) {
                    navbar.css("margin-top", "");
                    navbar.css("top", "-51px");
                    navbar.addClass("navbar-scrolled");
                    navbar.animate({ "top": "0" }, 200);
                    navbar.overlay = true;
                }
                return;
            }

            if (navbar.overlay && !hiding) {
                hiding = true;
                navbar.animate({ "top": "-51px" }, 200, function(){
                    navbar.css("top", "0");
                    navbar.css("margin-top", "-100px");
                    hiding = false;
                });
            }

            navbar.overlay = false;
        })();

        // Opacity of top header
        var diffPayTop = (topOfScreenshot - topOfPayOff - scrollTop);
        // if scrolling approaches bottom of buttons, fade them out
        // gradually, until it reaches the top of the payoff
        if (scrollTop < REALSCROLLSTART) {
            if (scrollTop > 0) {
                var opacity = 1- ((initialDiffPayTop - diffPayTop)
                    / initialDiffPayTop);

                if (opacity <= 1) {
                    more.css({ opacity: opacity });
                    payoff.css({ opacity: opacity });
                }
            }
            else {
                more.css({ opacity: 1 });
                payoff.css({ opacity: 1 });
            }
        }

        // Screenshot and header
        if (scrollTop <= REALSCROLLSTART + TOPHEIGHT) { // @todo test fast scrolling
            (function() {
                var yPos = -1 * (scrollTop / 12);
                // Set our final background position for parralax scrolling
                var coords = 'left ' + yPos + 'px';
                header.css({ "background-position": coords });

                // Reveal more of background until x% of content below it is shown, then scroll away
                // var minHeight = 750 + scrollTop >= maxHeight ? maxHeight : 750 + scrollTop;
                var minHeight = TOPHEIGHT + scrollTop;
                // Snap top-header to bottom of screen (up until a maximum size)
                header.css("min-height", minHeight);
                pages.css("top", (scrollTop > 0 ? scrollTop : 0) + "px");
                buttons.css("margin-top", (scrollTop/2) + "px");

                // Fix screenshot in position for about 100px, then scroll away
                if (scrollTop >= REALSCROLLSTART) {
                    // var currScrollTop = scrollTop;
                    header.css({
                        "min-height": TOPHEIGHT + REALSCROLLSTART
                    });
                    screenshot.css({"transform": "translate(0," + (-1 * scrollTop + ((scrollTop - REALSCROLLSTART) / 5)) + "px)" });
                }
                if (scrollTop < 290)
                    screenshot.css({"transform": "translate(0, " + (-1 * scrollTop) + "px)" });
            })();
        }

        // Collaboration Video Auto Start
        if (!autoNextActived && scrollTop > 290 + TOPHEIGHT) {
            //autoNext();
            $("#carrousel2-page1 video")[0].play();
            autoNextActived = true;
        }
        // @todo? pause video when it's out of view
        if (!featuresExpanded && scrollTop > 1850 + TOPHEIGHT) {
            toggleExtraFeatures();
            featuresExpanded = true;
        }

        var yPos, coords;

        // Collaboration background
        yPos = -1 * (scrollTop / 7) + 300;
        // Set our final background position for parralax scrolling
        coords = 'left ' + yPos + 'px';
        $('#collaboration').css({ "background-position": coords });

        // Features background
        yPos = -1 * (scrollTop / 5) + 250; // -500 +
        // Set our final background position for parralax scrolling
        coords = '50% ' + yPos + 'px';
        $('#features').css({ "background-position": coords });
    }
    $(document).scroll(scroll);

    // Learn More button to scroll to Workspaces section
    function scrollToAnchor(aid){
        var aTag = $("a[name='"+ aid +"']");
        $('html,body').animate({
            scrollTop: aTag.offset().top + REALSCROLLSTART - 50
        },'slow');
    }

    $("#learnMore").click(function(event) {
        event.preventDefault();
        scrollToAnchor("workspaces");
    });

    /**** Carrousel ****/

    $("#carrousel .browser-frame").click(function(){
        body.animate({
            scrollTop: document.body.scrollTop ? 0 : REALSCROLLSTART
        }, 200);
    })

    var body = $("html, body");
    var currentPage = 1;
    var topCarrouselTimer;
    var animating = false;
    var AUTOINTERVAL = 8000;
    
    btnLeft.click(function(){
        var curPage = $("#carrousel-page" + currentPage);
        var nextPage = $("#carrousel-page" + --currentPage);
        if (!nextPage.length)
            nextPage = $("#carrousel-page" + (currentPage = 5));

        if (document.body.scrollTop) {
            body.animate({ scrollTop: 0 }, 200, function(){
                slide(curPage, nextPage);
            });
        }
        else {
            slide(curPage, nextPage);
        }
    });
    btnRight.click(function(){
        var curPage = $("#carrousel-page" + currentPage);
        var nextPage = $("#carrousel-page" + ++currentPage);
        if (!nextPage.length)
            nextPage = $("#carrousel-page" + (currentPage = 1));

        if (document.body.scrollTop) {
            body.animate({ scrollTop: 0 }, 200, function(){
                slide(curPage, nextPage, true);
            });
        }
        else {
            slide(curPage, nextPage, true);
        }
    });

    function slide(curPage, nextPage, fromLeft){
        if (animating) return;
        
        animating = true;
        clearTimeout(topCarrouselTimer);
        
        nextPage.css("margin-left", (fromLeft ? "" : "-") + window.innerWidth + "px");
        nextPage.addClass("active");

        curPage.animate({ "margin-left": (fromLeft ? "-" : "") + window.innerWidth + "px" }, 500, "easeInOutQuad");
        nextPage.animate({ "margin-left": "0" }, 500, "easeInOutQuad", function(){
            curPage.removeClass("active");
            
            animating = false;
            topCarrouselTimer = setTimeout(nextTopCarrousel, AUTOINTERVAL);
        });
    }
    
    function nextTopCarrousel(){
        var curPage = $("#carrousel-page" + currentPage);
        var nextPage = $("#carrousel-page" + ++currentPage);
        if (!nextPage.length)
            nextPage = $("#carrousel-page" + (currentPage = 1));

        slide(curPage, nextPage, true, function(){
            topCarrouselTimer = setTimeout(nextTopCarrousel, AUTOINTERVAL);
        });
    }

    topCarrouselTimer = setTimeout(nextTopCarrousel, AUTOINTERVAL);
    
    
    $("input[type=email]").on("keydown click",function(){
        $(".form-signup-error").fadeOut();
        clearTimeout(topCarrouselTimer);
    });
    
    $(".form-signup").each(function(index, form){
        $(form).on("submit", function(evt){
            evt.preventDefault();
            clearTimeout(topCarrouselTimer);
            
            var values = $(form).serializeArray();
            
            if (!values[0].value)
                return $(".form-signup-error").html("Please provide a valid e-mail address").show();
            
            $.ajax(window.c9options.apiUrl + "/users/validate",  { 
                dataType: "json", 
                data: $(form).serialize(),
                method: "post",
            }).always(function(res, status){
                if (status == "success"){
                    document.location.href = "/signup/fullname?email=" + encodeURIComponent(values[0].value);
                    return;
                }
                
                var message = res.responseJSON.error.message;
                
                if (message === "Validation failed")
                    message = "Please provide a valid e-mail address";

                $(".form-signup-error").html(message).show();
            });
        });
    });
    

    /**** Carrousel 2 ****/

    var currentPage2 = 1;
    var c2buttons = $("#carrousel2 .carrousel-navigation span");
    c2buttons.click(function(e){
        var curPage = $("#carrousel2 .page.active");
        var nextPage = $("#carrousel2-" + e.target.id);

        slideCollab(curPage, nextPage);
    });

    function slideCollab(curPage, nextPage, fromLeft){
        var curId = parseInt(curPage[0].id.substr(-1), 10);
        var nextId = parseInt(nextPage[0].id.substr(-1), 10);

        if (currentPage2 == nextId)
            return;

        // Update Nav
        $("#carrousel2 .carrousel-navigation #" + curPage[0].id.split("-")[1]).removeClass("active");
        $("#carrousel2 .carrousel-navigation #" + nextPage[0].id.split("-")[1]).addClass("active");

        // Stop old video
        curPage.find("video")[0].pause();

        // Start new video
        var video = nextPage.find("video")[0];
        video.currentTime = 0;
        video.play();

        if (fromLeft === undefined)
            fromLeft = curId < nextId;
        slide(curPage, nextPage, fromLeft);

        currentPage2 = parseInt(nextId, 10);
    }

    var videos = $("#carrousel2 video");
    videos.bind("ended", function(){
        next();
    });
    
    function next(){
        var curPage = $("#carrousel2 .page.active");

        var nextPage = $("#carrousel2-page" + (currentPage2 + 1));
        if (!nextPage.length)
            nextPage = $("#carrousel2-page1");

        slideCollab(curPage, nextPage, true);
    }

    /**** Collaboration ****/

    // blink the cursor
    blink();
    function blink() {
        $("#cursor_typing").fadeTo(100, 0, function(){
            setTimeout(function(){
                $("#cursor_typing").fadeTo(100, 1.0,
                    setTimeout.bind(null, blink, 400));
            }, 400);
        });
    }
    blink_terminal();
    function blink_terminal() {
        $(".sudoblock .cursor").fadeTo(100, 0, function(){
            setTimeout(function(){
                $(".sudoblock .cursor").fadeTo(100, 1.0,
                    setTimeout.bind(null, blink_terminal, 400));
            }, 400);
        });
    }

    /**** Extra Features ****/

    function toggleExtraFeatures() {
        var maxHeight = "1588px";

        if (features.css("max-height") == maxHeight) {
            maxHeight = initialMaxHeight;
            features.removeClass("expanded");
        }
        else {
            features.addClass("expanded");
        }

        features.animate({"max-height": maxHeight}, 500, "easeInOutQuad");
    }

    // Show two random testimonials
    var arr = [];
    while(arr.length < 2) {
        var randomnumber = Math.ceil(Math.random() * 5);
        var found = false;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == randomnumber) {
                found = true;
                break;
            }
        }
        if(!found)
            arr[arr.length] = randomnumber;
    }
    $("#testimonial" + arr[0]).css({"display": "block"});
    $("#testimonial" + arr[1]).css({"display": "block"});

    // Track Links
    trackLink('#signUp1', "Clicked Sign Up link", {label: "index-first"}, analyticsOptions);

    resize();
});