let direction;
let timer;
let tick;
let score;
let time;
let sScore = $('#sScore'), sSpeed = $('#sSpeed');
const classes = ['head', 'tail', 'fruit', 'bomb', 'aqua', 'init'];
function GameTick() {
    clearInterval(timer);
    timer = setInterval(() => {
        let x = Number($('.head').index());
        let y = Number($('.head').parent().index()) + 1;
        let h = $('.head');

        let nexth;
        let nextc = '';
        switch (direction) {
            case 0: //left
                nexth = h.prev();
                nextc = 'head left';
                break;
            case 1: //up
                nexth = h.parent().prev().children().eq(x);
                nextc = 'head up';
                break;
            case 2: //right
                nexth = h.next();
                nextc = 'head right';
                break;
            case 3: //down
                nexth = h.parent().next().children().eq(x);
                nextc = 'head down';
                break;
        }
        let tmp = nexth.attr('class');
        if (tmp == null || tmp == 'bomb' || tmp == 'tail') {
            clearInterval(timer);
            $('.head, .tail').addClass('dead');
            return;
        } else if (tmp == 'fruit') {
            GetPoint();
            if(tick>50) tick-=20;
            nexth.removeClass('fruit');
            BatchObject('fruit');
            BatchObject('bomb');
        }
        h.removeClass('head left right down up');
        h.addClass('tail');
        nexth.addClass(nextc).text(score);
        sScore.text(`점수 : ${score}`);
        sSpeed.text(`속도 : ${(1000/tick).toFixed(2)}/s`);
        TailProcess();
        GameTick();
        setTimeout(()=>(time++),1000);
    }, tick)
}




function TailProcess() {
    let tail = $('.tail');
    tail.map((idx, e) => {
        let num = Number($(e).text());
        if (num == 0) {
            $(e).text('').removeClass('tail');
        } else {
            $(e).text(--num);
        }
    });
}

function GetPoint() {
    score++;
    $('.tail').map((idx, e) => {
        let num = Number($(e).text());
        $(e).text(++num);
    });
    $('.head').text(score);
}

function BatchObject(classname) {
    var initX;
    var initY;
    var cn;
    var retry;
    do {
        retry = 0;
        initX = parseInt(Math.random() * 21) + 1;
        initY = parseInt(Math.random() * 21) + 1;
        cn = $(`#gameBoard > tr:nth-child(${initX}) > td:nth-child(${initY})`);
        var cns = cn.attr('class');
        if (cns == null) cns = "";
        for (let i = 0; i < classes.length; i++) {
            retry += cns.includes(classes[i]) ? 1 : 0;
        }
    } while (retry != 0);
    $(`#gameBoard > tr:nth-child(${initX}) > td:nth-child(${initY})`).addClass(classname);
}


function CheckCell(nexth) {

}



$(document).on({
    'keydown': (e) => {
        if (e.keyCode >= 37 && e.keyCode <= 40) {
            direction = Number(e.keyCode) - 37;
            let h = $('.head');
            h.removeClass('left right down up');
            switch (direction) {
                case 0: //left
                    h.addClass('left');
                    break;
                case 1: //up
                    h.addClass('up');
                    break;
                case 2: //right
                    h.addClass('right');
                    break;
                case 3: //down
                    h.addClass('down');
                    break;
            }
        }
    },
    'keyup': (e) => {
        switch (e.keyCode) {
            case 32:
                GetPoint();
                break;
            case 107:
                tick += 50;
                break;
            case 109:
                tick -= 50;
                break;
            default:
                break;
        }
    },
    'load': initGame()
})

function initGame() {
    tick = 500;
    score = 0;
    direction = 1;
    time=0;
    $('#gameBoard').empty();
    for (i = 0; i < 21; i++) {
        let tr = $('<tr/>');
        for (j = 0; j < 21; j++) {
            tr.append(
                $('<td>').addClass('eong').removeClass('eong')
            );
        }
        $('#gameBoard').append(tr);
    }

    $('#gameBoard > tr:nth-child(11) > td:nth-child(11)').addClass('head up');

    for (let i = 8; i <= 14; i++) {
        for (let j = 8; j <= 14; j++) {
            $(`#gameBoard > tr:nth-child(${i}) > td:nth-child(${j})`).addClass('init');
        }
    }
    GameTick();
    BatchObject('fruit');
    BatchObject('bomb');
    BatchObject('bomb');
    BatchObject('bomb');
    $('.init').removeClass('init');
}