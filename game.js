$(function() {
    var base = $('#app');
    var doc = $(document);

    $.app = {
        vars: {
            gridSize: 14
        },
        elements: {
            startButton: "<a id='startButton' class='button is-primary is-large'>Start game</a>",
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
                $.app.drawArena();
            }
        },
        resetBaseStyles: function() {
            base.attr("class", "is-fullwidth has-text-centered");
        },
        drawArena: function() {
            var panes = "";
            var size = $.app.vars.gridSize;

            for (var y = 1; y <= size; y++) {
                for (var x = 1; x <= size; x++) {
                    panes += $.app.elements.pane(x, y);
                }
            }

            base.html("<div class='arena'>"+panes+"</div>");

            $.app.setGridSize(size);

            $.app.addApple(2, 5);
        },
        setGridSize: function(size) {
            var gridsSetting = 'repeat('+size+', calc(100% / '+size+'))';
            $('.arena').css('grid-template-columns', gridsSetting);
            $('.arena').css('grid-template-rows', gridsSetting);
        },
        addApple: function(x, y) {
            $('.pane.has-apple').html('');
            $('#pane-'+x+'-'+y).addClass('has-apple');
            $('#pane-'+x+'-'+y).html($.app.elements.apple);
        }
    }

    $.app.init();

});