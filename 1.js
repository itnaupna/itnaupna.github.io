/*
클릭시 해당칸이 지뢰면 맵 전체 지뢰 보여주고 게임 끝.
클릭시 해당칸이 숫자면 주변 지뢰 갯수 알려주고 탐색 끝.
클릭시 해당칸이 빈칸이면 주변탐색 시작.
*/

let gameGrid,userGrid;
const GAMEMIN = 7, GAMEMAX = 20;
const MINEMIN = 10, MINEMAX = 50;
let tGame = $('#tGame');
let mineCount = 0;
let minePercent;
let playing = false;
let timer;
let time = 0;
let foundMine = 0;
let flags = 0;
function initGame() {
    

    let x, y;
    x = Number($('#inputX').val());
    y = Number($('#inputY').val());
    minePercent = Number($('#inputMine').val());
    mineCount = 0;
    gameGrid = Array.from(Array(x), () => new Array(y).fill().map(
        () => {
            if (parseInt(Math.random() * 100) + 1 <= minePercent) {
                mineCount++;
                return true;
            }
            return false;
        }
    ));

    userGrid = Array.from(Array(x), ()=>new Array(y).fill(''));
    for(var ii=0;ii<x;ii++){
        for(var jj=0;jj<y;jj++){
            if(!gameGrid[ii][jj]){
                let tmpMineCnt = 0;
                for (var i = -1; i < 2; i++) {
                    //세로축 바깥이면 패스
                    if (ii + i < 0 || ii + i == gameGrid.length) continue;
                    for (var j = -1; j < 2; j++) {
                        //내 자신이면 또는
                        //가로축 바깥이면 패스
                        if ((i == 0 && j == 0) || jj + j < 0 || jj + j == gameGrid[ii].length)
                            continue;

                        if (gameGrid[ii + i][jj + j]) {
                            //검사한 구역이 지뢰면
                            tmpMineCnt++;
                        }
                    }
                }
                userGrid[ii][jj] = tmpMineCnt;
            }else{
                userGrid[ii][jj] = 'x';
            }
        }
    }

    tGame.empty();
    $.each(gameGrid, (idx, e) => {
        let line = $('<tr>');
        $.each(e, (idx2, f) => {
            line.append(
                $('<td>')
                    //.text(Math.floor(Math.random()*8)+1)
                    .attr({
                        'x': idx,
                        'y': idx2
                    })
                    .on({
                        'mouseup': (e) => {
                            CheckMinebox($(e.target),
                                Number($(e.target).attr('x')),
                                Number($(e.target).attr('y')),
                                e.which);
                        },
                        'mousedown': (e) => {
                            // TempClick(e);
                        }
                    })
                    .addClass('clickme')
            );
        });
        tGame.append(line);
    });
    $('#boxMine').text(`총 지뢰 : ${mineCount}개`);
    playing = true;
    clearInterval(timer);
    time = 0;
    timer = setInterval(() => {
        $('#boxTimer').text(`경과시간 : ${++time}초`);
    }, 1000);
    $('#boxMsg').text('');
    flags = 0;
}

function cmb(x,y){
    // console.log(x,y);
    let t = $(`td[x=${x}][y=${y}]`);
    if(userGrid[x] == null || userGrid[x][y] == null || userGrid[x][y]=='x' || t.text()=='F'){
        return;
    }else if(userGrid[x][y] > 0){
        t.text(userGrid[x][y]);
        t.removeClass('clickme');
        userGrid[x][y]=null;
        return;
    }else if(userGrid[x][y]==0){
        userGrid[x][y]=null;
        t.removeClass('clickme');
        for(var i=-1;i<2;i++){
            for(var j=-1;j<2;j++){
                cmb(x+i,y+j);
            }
        }
    }

}

// let sum=0,sumd=0;
// var i=0;
// function func(i,a){
//     if(i>=a) {
//         console.log(sum);
//         return;
//     }
//     sum += ++i;
//     func(i,a);
// }
// func(i,9651);

// function fund(a){
//     for(i=0;i<=a;i++){
//         sumd += i;
//     }
//     console.log(sumd);
// }
// // fund(1000000000);


function CheckMinebox(e, x, y, w = 1) {
    if(!playing) return;
    let t = e;
    switch (w) {
        case 1: //클릭
            if(t.text()=='F') break;
            if (userGrid[x][y] == 'x') {
                //지뢰일경우
                t.addClass('Mine');
                playing = false;
                clearInterval(timer);
                $('#boxMsg').text('게임 오버 : 지뢰를 밟았습니다!');
                for(i=0;i<userGrid.length;i++){
                    for(j=0;j<userGrid[i].length;j++){
                        userGrid[i][j] == 'x' ? $(`td[x=${i}][y=${j}]`).addClass('Mine') : false;
                    }
                }
            } else {
                cmb(x,y);
            }
            break;
        case 2: //휠클릭
            break;
        case 3: //우클릭
        if(userGrid[x][y] != null && !t.hasClass('Mine')){
            if (t.text() == 'F') {
                if (userGrid[x][y] == 'x') foundMine--;
                flags--;
                t.text('').removeClass('Flag')
            } else {
                if (userGrid[x][y] == 'x') {
                    foundMine++;
                    
                    if (mineCount == foundMine) {
                        //게임클리어
                        $('#boxMsg').text('축하합니다!').css('color','green');
                        playing = false;
                        clearInterval(timer);
                    }
                }
                flags++;
                t.text('F').addClass('Flag');
            }
        }
        $('#boxUsedFlags').text(`사용한 깃발 : ${flags}개`);
            break;
        default:
            break;
    }
}

$(document).on(
    {
        'contextmenu': (e) => {
            e.preventDefault();
        }
    }
)

$('#inputX, #inputY')
    .on({
        'blur': (e) => {
            if ($(e.target).val() < GAMEMIN) {
                $(e.target).val(GAMEMIN);
            } else if ($(e.target).val() > GAMEMAX) {
                $(e.target).val(GAMEMAX);
            }
        }
    })
    .attr({
        'max': GAMEMAX,
        'min': GAMEMIN
    });

$('#inputMine')
    .on({
        'blur': (e) => {
            if ($(e.target).val() < MINEMIN) {
                $(e.target).val(MINEMIN);
            } else if ($(e.target).val() > MINEMAX) {
                $(e.target).val(MINEMAX);
            }
        }
    })
    .attr({
        'max': MINEMAX,
        'min': MINEMIN
    });