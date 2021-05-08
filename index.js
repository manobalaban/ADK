
var stoped = false;
var everybodyin = false;
var numberOfPLayers = 0;
var startRound = true;
var preloaded = true;

var gameMech = function() {
    var flex = document.getElementById("flexCanvas").getContext("2d");
    flex.clearRect(0, 0, 1000, 1000);
    if(boostCounter > nextBoost) {
        nextBoost = Math.random()*500;
        boostCounter = 0;
        //console.log(Math.floor(Math.random()*10)+1);
        var boostsCopy = boosts.slice();
        var newBoost = boostsCopy[0];
        newBoost.x = Math.random()*960 + 20;
        newBoost.y = Math.random()*960 + 20;
        boostsOnMap.push(newBoost);
    } else {
        boostCounter++;
    }
    boostsOnMap.forEach((boost) => {
        var img = new Image();
        img.src = boost.src;
        flex.drawImage(img, boost.x, boost.y, 40, 40);
    });
    players.forEach(mooving);
}

var int = setInterval(gameMech, 20);
clearInterval(int);

function mooving(player) {
    if(player.chosed) {
        if(player.alive) {
            var px = player.x;
            var py = player.y;
            if(player.right || player.left) {
                player.l = player.right ? player.l + 0.017 : player.l-0.017;
            }
            player.x = player.x+Math.cos(player.l*Math.PI);
            player.y = player.y+Math.sin(player.l*Math.PI);

            if(!player.inBreak) {
                var fix = document.getElementById("fixCanvas").getContext("2d");
                fix.beginPath();
                fix.lineWidth = player.width*2 + 1;
                fix.strokeStyle = player.color;
                fix.moveTo(px, py);
                fix.lineTo(player.x, player.y);
                fix.stroke();

                var data = fix.getImageData(player.x+(Math.cos(player.l*Math.PI)*(player.width*1.5)),player.y+(Math.sin(player.l*Math.PI)*(player.width*1.5)), 1, 1);
                if(data.data[0] != 0 || data.data[1] != 0 || data.data[2] != 0) {
                    dropOut(player);
                } else {
                    data = fix.getImageData(player.x+(Math.cos((player.l+0.5)*Math.PI)*(player.width*1.9)),player.y+(Math.sin((player.l+0.5)*Math.PI)*(player.width*1.9)), 1, 1);
                    if(data.data[0] != 0 || data.data[1] != 0 || data.data[2] != 0) {
                        dropOut(player);
                    } else {
                        data = fix.getImageData(player.x+(Math.cos((player.l-0.5)*Math.PI)*(player.width*1.9)),player.y+(Math.sin((player.l-0.5)*Math.PI)*(player.width*1.9)), 1, 1);
                        if(data.data[0] != 0 || data.data[1] != 0 || data.data[2] != 0) {
                            dropOut(player);
                        }
                    }
                }

                player.breakCount++;
                if(player.breakCount >= player.breakInt) {
                    player.inBreak = true;
                    player.breakCount = 0;
                }
            } else {
                player.breakCount++;
                if(player.breakCount >= 20) {
                    player.inBreak = false;
                    player.breakCount = 0;
                    player.breakInt = Math.random()*750;
                }
            
            }

            if((player.x < 0 + player.width || player.x > 1000 - player.width || player.y < 0 + player.width || player.y > 1000- player.width) && player.alive) {
                dropOut(player);
            }
        }

        var flex = document.getElementById("flexCanvas").getContext("2d");
        flex.beginPath();
        flex.arc(player.x,player.y,player.width,0,2*Math.PI);
        flex.strokeStyle = "yellow";
        flex.lineWidth = 0;
        flex.fillStyle = "yellow";
        flex.fill();
        flex.stroke();
    }
}

function dropOut(player) {
    player.alive = false;
    var inlife = 0;
    players.forEach((p) => {
        if(p.chosed && p.alive) {
            p.point++;
            inlife++;
            document.getElementById(p.color+"Point").innerHTML = p.point;
        }
    })
    if(inlife == 1) {
        clearInterval(int);
        startRound = true;
        preloaded = false;
        var bestPlayer = players[0];
        var secondPlayer;
        var i = 0;
        for(var j = 0; j < players.length; j++) {
            if(players[j].point > bestPlayer.point) {
                bestPlayer = players[j];
                i = j;
            } else {
                secondPlayer = players[j];
            }
        }
        for(var j = 0; j < players.length; j++) {
            if(j != i && players[j].point > secondPlayer.point) {
                secondPlayer = players[j];
            }
        }
        if(bestPlayer.point >= (numberOfPLayers-1)*10 && bestPlayer.point > (secondPlayer.point+1)) {
            let konecHry = document.getElementById("konecHry");
            konecHry.style.visibility = "visible";
            konecHry.style.color = bestPlayer.color;
            konecHry.style.border = "6px solid " + bestPlayer.color;
            let rgba = "";
            switch (bestPlayer.color) {
                case "red":
                    rgba = "rgba(255,0,0,0.2)"
                    break;
                case "green":
                    rgba = "rgba(0,255,0,0.2)"
                    break;
                case "purple":
                    rgba = "rgba(128,0,128,0.2)"
                    break;
                case "blue":
                    rgba = "rgba(0,0,255,0.2)"
                    break;
                case "orange":
                    rgba = "rgba(255,162,0,0.2)"
                    break;
                case "grey":
                    rgba = "rgba(128,128,128,0.2)"
                    break;
                default:
                    break;
            }
            konecHry.style.background = rgba;
            document.getElementById("winner").innerHTML = bestPlayer.color.toUpperCase() + " WINS";
        }
    }
}

function keydown(e) {
    for(var i = 0; i < players.length; i++) {
        if(e.key == players[i].rKey) {
            players[i].right = true;
        }
        if(e.key == players[i].lKey) {
            players[i].left = true;
        }
    }
    if(e.key == " ") {
        var fix = document.getElementById("fixCanvas");
        fix.style.visibility = "visible";
        fix = fix.getContext("2d");
        var flex = document.getElementById("flexCanvas");
        flex.style.visibility = "visible";
        flex = flex.getContext("2d");
        if(everybodyin) {
            if(!preloaded && startRound) {
                fix.clearRect(0, 0, 1000, 1000);
                flex.clearRect(0, 0, 1000, 1000);
                players.forEach((player) => {
                    if(player.chosed) {
                        player.x = Math.random()*960 + 20;
                        player.y = Math.random()*960 + 20;
                        flex.beginPath();
                        flex.arc(player.x,player.y,player.width,0,2*Math.PI);
                        flex.strokeStyle = "yellow";
                        flex.lineWidth = 0;
                        flex.fillStyle = "yellow";
                        flex.fill();
                        flex.stroke();

                        fix.beginPath();
                        fix.lineWidth = player.width*2 + 1;
                        fix.strokeStyle = player.color;
                        fix.moveTo(player.x-(Math.cos(player.l*Math.PI)*20), player.y-(Math.sin(player.l*Math.PI)*20));
                        fix.lineTo(player.x, player.y);
                        fix.stroke();
                    }
                });
                preloaded = true;
            } else if(startRound) {
                startRound = false;
                numberOfPLayers = 0;
                players.forEach((player) => {
                    if(!player.chosed) {
                        document.getElementById(player.color + "Key").style.visibility = "hidden";
                    } else {
                        numberOfPLayers++;
                        player.alive = true;
                    }
                });
                int = setInterval(gameMech, 20);
            } else {
                stoped ? int = setInterval(gameMech, 20) : clearInterval(int);
                stoped = !stoped;
            }
            document.getElementById("goalBox").innerHTML = (numberOfPLayers-1)*10;
            
        } else {
            players.forEach((player) => {
                if(player.chosed) {
                    flex.beginPath();
                    flex.arc(player.x,player.y,player.width,0,2*Math.PI);
                    flex.strokeStyle = "yellow";
                    flex.lineWidth = 0;
                    flex.fillStyle = "yellow";
                    flex.fill();
                    flex.stroke();

                    fix.beginPath();
                    fix.lineWidth = player.width*2 + 1;
                    fix.strokeStyle = player.color;
                    fix.moveTo(player.x-(Math.cos(player.l*Math.PI)*20), player.y-(Math.sin(player.l*Math.PI)*20));
                    fix.lineTo(player.x, player.y);
                    fix.stroke();
                }
            });
        }
        everybodyin = true;
    }
}

function keyup(e) {
    for(var i = 0; i < players.length; i++) {
        if(e.key == players[i].rKey) {
            players[i].right = false;
        }
        if(e.key == players[i].lKey) {
            players[i].left = false;
        }
    }
}

function choseColor(i, keybox) {
    if(!everybodyin) {
        let player = players[i];
        if(player.chosed) {
            player.lKey = "";
            player.rKey = "";
            document.getElementById(keybox).getElementsByClassName("firstKey")[0].innerHTML = "";
            document.getElementById(keybox).getElementsByClassName("secondKey")[0].innerHTML = "";
        }
        player.chosed = !player.chosed;
    }
}

function chosekeys(e, i, keybox) {
    if(!everybodyin && e.key != " ") {
        var player = players[i];
        if(player.chosed) {
            if(player.firstKey) {
                player.firstKey = !player.firstKey;
                player.lKey = e.key;
                document.getElementById(keybox).getElementsByClassName("firstKey")[0].innerHTML = player.lKey.toUpperCase();
            } else {
                player.firstKey = !player.firstKey;
                player.rKey = e.key;
                document.getElementById(keybox).getElementsByClassName("secondKey")[0].innerHTML = player.rKey.toUpperCase();
            }
        }
    }
}