$(function() {
    var base = $('#app');
    var doc = $(document);

    const STATES = { ACTIVE: 1, PAUSED: 0, LOSSER: 2 };
    const DIRECTIONS = { UP: 0, DOWN: 1, LEFT: 2, RIGHT: 3 };
    const APPLE_SCORE = 50;

    var GRID_SIZE = 18;
    var GAME_SPEED = 125;

    var STATE = STATES.PAUSED;
    var DIRECTION = DIRECTIONS.UP;

    // POSITIONS
    var CURR = { x: 0, y: 0 };
    var APPLE = { x: 0, y: 0 };

    var SCORE = 0;

    var MOVE_HISTORY = [];

    var MADE_MOVE = false;

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

                doc.on('keydown', function(e) {

                    if (!MADE_MOVE) {
                        MADE_MOVE = true;

                        switch (e.which) {
                            case 37: case 65:
                                DIRECTION = DIRECTIONS.LEFT; break;
                            case 38: case 87:
                                DIRECTION = DIRECTIONS.UP; break;
                            case 39: case 68:
                                DIRECTION = DIRECTIONS.RIGHT; break;
                            case 40: case 83:
                                DIRECTION = DIRECTIONS.DOWN; break;
                        }

                    }
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


                $.app.addApple();

                var generatedInitialPosition = $.app.generatePosition();
                $.app.setHead(generatedInitialPosition.x, generatedInitialPosition.y);

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
        generatePosition: function() {
            var result = { 
                x: Math.floor(Math.random() * GRID_SIZE) + 1, 
                y: Math.floor(Math.random() * GRID_SIZE) + 1
            };

            return (result == CURR || result == APPLE) ? $.app.generatePosition() : result;
        },
        addApple: function() {
            APPLE = $.app.generatePosition();

            $('#pane-'+APPLE.x+'-'+APPLE.y).addClass('has-apple');
            $('#pane-'+APPLE.x+'-'+APPLE.y).html($.app.elements.apple);
        },
        setHead: function(x, y) {
            CURR = { x: x, y: y};

            if (CURR == APPLE) $.app.eatApple();

            var previousHead = $('.pane.head');
            if (previousHead.length) previousHead.removeClass('head');

            $('#pane-'+x+'-'+y).addClass('head');

            $.app.drawBody();
        },
        drawBody: function() {
            $('.pane.body').removeClass('body');

            var temp = {};

            for (var i = 0; i < MOVE_HISTORY.length; i++) {
                temp = MOVE_HISTORY[i];

                $('#pane-'+temp.x+'-'+temp.y).addClass('body');
            }
        },
        eatApple: function() {
            console.log("eating")
            SCORE += APPLE_SCORE;
            HISTORY.push({ x: CURR.x, y: CURR.y });

            $('.pane.has-apple').html('');
            $('.pane.has-apple').removeClass('has-apple');

            $.app.addApple();
        },
        loop: function () {
            if (STATE === STATES.ACTIVE) {

                switch (DIRECTION) {
                    case DIRECTIONS.UP:
                        $.app.setHead(CURR.x, CURR.y - 1); break;
                    case DIRECTIONS.DOWN:
                        $.app.setHead(CURR.x, CURR.y + 1); break;
                    case DIRECTIONS.LEFT:
                        $.app.setHead(CURR.x - 1, CURR.y); break;
                    case DIRECTIONS.RIGHT:
                        $.app.setHead(CURR.x + 1, CURR.y); break;
                }

                $.app.check();

                MADE_MOVE = false;

                setTimeout(function () { $.app.loop() }, GAME_SPEED);
                
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