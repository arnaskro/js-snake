$(function() {
    var base = $('#app');
    var doc = $(document);

    const STATES = { ACTIVE: 1, PAUSED: 0, LOSSER: 2 };
    const DIRECTIONS = { UP: 0, DOWN: 1, LEFT: 2, RIGHT: 3 };

    var GRID_SIZE = 14;
    var GAME_SPEED = 700;

    var STATE = STATES.PAUSED;
    var DIRECTION = DIRECTIONS.UP;
    var CURR = { x: 0, y: 0 };
    var SCORE = 0;


    $.app = {
        elements: {
            startButton: "<a id='startButton' class='button is-primary is-large'>Start game</a>",
            heading: function (text) { 
                return "<p class='title is-1 is-bold'>"+text+"</p>";
            },
            score: function (text) { 
                return "<p class='subtitle is-4'>"+text+"</p>";
            },
            apple: "<div class='apple'></div>",
            pane: function(x, y) {
                return "<div class='pane' id='pane-"+x+"-"+y+ "'></div>";
            }
        },
        init: function() {
            $.app.listeners.init();
            $.app.resetBaseStyles();
            $.app.scenes.initial();
        },
        listeners: {
            init: function() {
                doc.on('click', '#startButton', function() {
                    $.app.scenes.start();
                })
            }
        },
        scenes: {
            initial: function() {
                $.app.resetBaseStyles();
                base.html($.app.elements.startButton);
            },
            start: function() {
                $.app.resetVars();
                $.app.drawArena();


                $.app.addApple(2, 5);
                $.app.setHead(8, 8);

                STATE = STATES.ACTIVE;
                $.app.loop();
            },
            losser: function() {
                base.html('');
                base.append($.app.elements.heading("YOU LOST!"));
                base.append($.app.elements.score("Your score: " + SCORE));
                base.append($.app.elements.startButton);
            }
        },
        resetVars: function() {
            SCORE = 0;
            DIRECTION = DIRECTIONS.UP;
        },
        resetBaseStyles: function() {
            base.attr("class", "is-fullwidth has-text-centered");
        },
        drawArena: function() {
            var panes = "";

            for (var y = 1; y <= GRID_SIZE; y++) {
                for (var x = 1; x <= GRID_SIZE; x++) {
                    panes += $.app.elements.pane(x, y);
                }
            }

            base.html("<div class='arena'>"+panes+"</div>");

            $.app.setGridSize();
        },
        setGridSize: function() {
            var gridsSetting = 'repeat('+GRID_SIZE+', calc(100% / '+GRID_SIZE+'))';
            $('.arena').css('grid-template-columns', gridsSetting);
            $('.arena').css('grid-template-rows', gridsSetting);
        },
        addApple: function(x, y) {
            $('.pane.has-apple').html('');
            $('#pane-'+x+'-'+y).addClass('has-apple');
            $('#pane-'+x+'-'+y).html($.app.elements.apple);
        },
        setHead: function(x, y) {
            CURR = { x: x, y: y};
            console.log(CURR)

            var previousHead = $('.pane.head');

            if (previousHead.length) previousHead.removeClass('head');

            $('#pane-'+x+'-'+y).addClass('head');
        },
        loop: function () {
            if (STATE === STATES.ACTIVE) {

                switch (DIRECTION) {
                    case DIRECTIONS.UP:
                        $.app.setHead(CURR.x, CURR.y - 1); break;
                    case DIRECTIONS.DOWN:
                        $.app.setHead(CURR.x, CURR.y + 1); break;
                    case DIRECTIONS.LEFT:
                        $.app.setHead(CURR.x + 1, CURR.y); break;
                    case DIRECTIONS.RIGHT:
                        $.app.setHead(CURR.x - 1, CURR.y); break;
                }

                $.app.check();

                setTimeout(function () { $.app.loop() }, 700);
                
            } else if (STATE === STATES.LOSSER) {
                $.app.scenes.losser();
            }
        },
        check: function() {
            if (CURR.x < 1 || CURR.x > GRID_SIZE || CURR.y < 1 || CURR.y > GRID_SIZE )
                STATE = STATES.LOSSER;
        }
    }

    $.app.init();

});