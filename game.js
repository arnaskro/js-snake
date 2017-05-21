$(function() {
    var base = $('#app');
    var doc = $(document);

    const STATES = { ACTIVE: 1, PAUSED: 0, LOSSER: 2, WINNER: 3 };
    const DIRECTIONS = { UP: 0, DOWN: 1, LEFT: 2, RIGHT: 3 };
    const SCORE_POINTS = 50;

    var GRID_SIZE = 4;
    var GAME_SPEED = 600;

    var STATE = STATES.PAUSED;
    var DIRECTION = DIRECTIONS.UP;

    // POSITIONS
    var CURR = { x: 0, y: 0 };
    var APPLE = { x: 0, y: 0 };

    var SCORE = 0;

    var MOVE_HISTORY = [];

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

                    if (STATE == STATES.ACTIVE) {
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
                    } else if (e.which == 13 && (STATE == STATES.LOSSER || STATE == STATES.PAUSED)) {
                        $("#startButton").trigger('click');
                    }

                })

                $(window).on('resize', function() {
                    $.app.setGridSize();
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
                
                MOVE_HISTORY.push(generatedInitialPosition);
                $.app.setHead(generatedInitialPosition.x, generatedInitialPosition.y);

                STATE = STATES.ACTIVE;
                $.app.loop();
            },
            losser: function() {
                base.html('');
                base.append($.app.elements.heading("YOU LOST!"));
                base.append($.app.elements.score("Your score: " + SCORE));
                base.append($.app.elements.startButton);
            },
            winner: function() {
                base.html('');
                base.append($.app.elements.heading("CONGRATULATIONS! YOU WON!"));
                base.append($.app.elements.score("Your score: " + SCORE));
                base.append($.app.elements.startButton);
            }
        },
        resetVars: function() {
            SCORE = 0;
            DIRECTION = DIRECTIONS.UP;
            MOVE_HISTORY = [];
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

            var heightAndWidth = 'calc(100vh - 160px - 6rem)';

            if ($(window).width() < ($(window).height() - 160)) {
                heightAndWidth = 'calc(100vw - 3rem)';
            }

            $('.arena').css('height', heightAndWidth);
            $('.arena').css('width', heightAndWidth);
        },
        generatePosition: function() {
            var result = { 
                x: Math.floor(Math.random() * GRID_SIZE) + 1, 
                y: Math.floor(Math.random() * GRID_SIZE) + 1
            };

            return (result == CURR || result == APPLE || $.app.checkIfCollides(result)) ? $.app.generatePosition() : result;
        },
        checkIfCollides: function(pos) {
            for (var i = 0; i < MOVE_HISTORY.length; i++)
                if (MOVE_HISTORY[i].x == pos.x && MOVE_HISTORY[i].y == pos.y) return true;

            return false;
        },
        addApple: function() {
            APPLE = $.app.generatePosition();

            $('#pane-'+APPLE.x+'-'+APPLE.y).addClass('has-apple');
            $('#pane-'+APPLE.x+'-'+APPLE.y).html($.app.elements.apple);
        },
        setHead: function(x, y) {
            CURR = { x: x, y: y};

            if ($.app.checkIfCollides(CURR)) { STATE = STATES.LOSSER; return; }

            if (x == APPLE.x && y == APPLE.y) $.app.eatApple();
            else MOVE_HISTORY.shift();

            var previousHead = $('.pane.head');
            if (previousHead.length) previousHead.removeClass('head');

            $('#pane-'+x+'-'+y).addClass('head');

            MOVE_HISTORY.push(CURR);

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
            SCORE += SCORE_POINTS;

            $('.pane.has-apple').html('');
            $('.pane.has-apple').removeClass('has-apple');

            if (!$.app.checkIfWon()) $.app.addApple();
        },
        checkIfWon: function() {
            if (MOVE_HISTORY.length >= (GRID_SIZE*GRID_SIZE - 1))  {
                STATE = STATES.WINNER;
                return true;
            }

            return false;
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
            } else if (STATE === STATES.WINNER) {
                $.app.scenes.winner();
            }
        },
        check: function() {
            if (CURR.x < 1 || CURR.x > GRID_SIZE || CURR.y < 1 || CURR.y > GRID_SIZE )
                STATE = STATES.LOSSER;
        }
    }

    $.app.init();

});