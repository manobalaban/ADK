var stoped = false;
var everybodyin = false;
var numberOfPLayers = 0;
var startRound = true;
var preloaded = true;
var more = 0;
var brightens = true;
var border = 0;

var gameMech = function() {
    if(border > 0) {
        border--;
        document.getElementById("flexCanvas").style.border = "1px solid pink";
    } else {
        document.getElementById("flexCanvas").style.border = "1px solid yellow";
    }
    var flex = document.getElementById("flexCanvas").getContext("2d");
    flex.clearRect(0, 0, 1000, 1000);
    more = more == 0 ? 0 : more - 1;
    if(boostCounter > nextBoost) {
        nextBoost = Math.random() * (more == 0 ? 750 : 50);
        boostCounter = 0;
        var i = Math.floor(Math.random()*16);
        var newBoost = {};
        for(prop in boosts[i]) {
            newBoost[prop] = boosts[i][prop];
        }
        newBoost.x = Math.random()*960 + 20;
        newBoost.y = Math.random()*960 + 20;
        boostsOnMap.push(newBoost);
    } else {
        boostCounter++;
    }
    boostsOnMap.forEach((boost) => {
        var img = new Image();
        img.src = boost.src;
        flex.drawImage(img, boost.x - 20, boost.y - 20, 40, 40);
        flex.beginPath();
        flex.lineWidth = 1;
        flex.strokeStyle = "yellow";
        flex.arc(boost.x, boost.y, 20, 0, 2*Math.PI);
        flex.stroke();
    });
    players.forEach(mooving);
}

var int = setInterval(gameMech, 20);
clearInterval(int);

function mooving(player) {
    if(player.chosed) {
        var ghost = false;
        var suck = false;
        var wallBreak = false;
        var square = false;
        player.boosts.forEach((b) => {
            ghost = b.code == 4;
            suck = b.code == 8;
            wallBreak = b.code == 10;
            square = b.code == 12;
        });
        if(player.alive) {
            var px = player.x;
            var py = player.y;
            if(player.right || player.left) {
                if(!square) {
                    if(suck) {
                        player.l = player.right ? player.l - 0.016 : player.l + 0.016;
                    } else {
                        player.l = player.right ? player.l + 0.016 : player.l - 0.016;
                    }
                } else if(player.square) {
                    if(suck) {
                        player.l = player.right ? player.l - 0.5 : player.l + 0.5;
                    } else {
                        player.l = player.right ? player.l + 0.5 : player.l - 0.5;
                    }
                    player.square = false;
                }
            }
            player.x = player.x+Math.cos(player.l*Math.PI)*player.speed;
            player.y = player.y+Math.sin(player.l*Math.PI)*player.speed;
            if(wallBreak || border > 0) {
                if(player.x < 0 - player.width) {
                    px = 1000;
                    player.x = 1000;
                } else if(player.x > 1000 + player.width) {
                    px = 0;
                    player.x = 0;
                }
                if(player.y < 0 - player.width) {
                    py = 1000;
                    player.y = 1000;
                } else if(player.y > 1000 + player.width) {
                    py = 0;
                    player.y = 0;
                }
            }

            if(!player.inBreak && !ghost) {
                var fix = document.getElementById("fixCanvas").getContext("2d");
                fix.beginPath();
                fix.lineWidth = player.width*2 + 1;
                fix.strokeStyle = player.color;
                fix.moveTo(px, py);
                fix.lineTo(player.x, player.y);
                fix.stroke();
                
                var data = fix.getImageData(player.x+(Math.cos(player.l*Math.PI)*(player.width+2)),player.y+(Math.sin(player.l*Math.PI)*(player.width+2)), 1, 1);
                if(data.data[0] != 0 || data.data[1] != 0 || data.data[2] != 0) {
                    dropOut(player);
                } else if(!square) {
                    data = fix.getImageData(player.x+(Math.cos((player.l+0.5)*Math.PI)*(player.width+2)),player.y+(Math.sin((player.l+0.5)*Math.PI)*(player.width+2)), 1, 1);
                    if(data.data[0] != 0 || data.data[1] != 0 || data.data[2] != 0) {
                        dropOut(player);
                    } else {
                        data = fix.getImageData(player.x+(Math.cos((player.l-0.5)*Math.PI)*(player.width+2)),player.y+(Math.sin((player.l-0.5)*Math.PI)*(player.width+2)), 1, 1);
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
                player.breakCount = player.breakCount + player.speed;
                if(player.breakCount >= 20) {
                    player.inBreak = false;
                    player.breakCount = 0;
                    player.breakInt = Math.random()*750;
                }
            
            }

            if((player.x < 0 + player.width || player.x > 1000 - player.width || player.y < 0 + player.width || player.y > 1000- player.width) && player.alive && !wallBreak && border == 0) {
                dropOut(player);
            }
        }

        var flex = document.getElementById("flexCanvas").getContext("2d");
        flex.beginPath();
        if(!square) {
            flex.arc(player.x,player.y,player.width,0,2*Math.PI);
            flex.lineWidth = 1;
        } else {
            flex.lineWidth = player.width*2 + 1;
            flex.moveTo(player.x-Math.cos(player.l*Math.PI)*(player.width+0.5), player.y-Math.sin(player.l*Math.PI)*(player.width+0.5));
            flex.lineTo(player.x+Math.cos(player.l*Math.PI)*(player.width+0.5), player.y+Math.sin(player.l*Math.PI)*(player.width+0.5));
        }
        if(wallBreak) {
            if(suck) {
                flex.fillStyle  = "brown";
            } else {
                flex.fillStyle  = "pink";
            }
        } else {
            flex.fillStyle = suck ? "blue" : "yellow";
        }
        flex.fill();
        flex.stroke();

        var i = -1;

        boostsOnMap.forEach((boost, index) => {
            if((player.x - boost.x)*(player.x - boost.x) + (player.y - boost.y)*(player.y - boost.y) < 500) {
                activateBoost(player, boost);
                i = index;
            }
        });
        if(i > -1) {
            boostsOnMap.splice(i, 1);
            i = -1;
        }
        player.boosts.forEach((boost, index) => {
            boost.timeLeft--;
            if(boost.timeLeft == 0) {
                deactivateBoost(player, index, boost);
                i = index;
            }
        });
    }
}

function activateBoost(player, boost) {
    if(boost.code == 1) {
        if(boost.effect == 2) {
            player.boosts.push(boost);
            player.speed = player.speed*2;
        } else {
            players.forEach((p) => {
                if(p.color != player.color) {
                    p.boosts.push(boost);
                    p.speed = p.speed*2;
                }
            })
        }
    } else if(boost.code == 2) {
        if(boost.effect == 2) {
            player.boosts.push(boost);
            player.speed = player.speed/2;
        } else {
            players.forEach((p) => {
                if(p.color != player.color) {
                    p.boosts.push(boost);
                    p.speed = p.speed/2;
                }
            })
        }
    } else if(boost.code == 3) {
        var fix = document.getElementById("fixCanvas").getContext("2d");
        fix.clearRect(0, 0, 1000, 1000);
    } else if(boost.code == 4) {
        player.boosts.push(boost);
    } else if(boost.code == 5) {
        players.forEach((p) => {
            if(p.color != player.color) {
                p.boosts.push(boost);
                p.width = p.width*2;
            }
        })
    } else if(boost.code == 6) {
        player.boosts.push(boost);
        player.width = player.width/2;
    } else if(boost.code == 7) {
        more = 500;
    } else if(boost.code == 8) {
        players.forEach((p) => {
            if(p.color != player.color) {
                p.boosts.push(boost);
            }
        })
    } else if(boost.code == 9) {
        players.forEach((p) => {
           p.boosts = [];
        })
    } else if(boost.code == 10) {
        player.boosts.push(boost);
    } else if(boost.code == 11) {
        border = 500;
    } else if(boost.code == 12) {
        if(boost.effect == 2) {
            player.boosts.push(boost);
        } else {
            players.forEach((p) => {
                if(p.color != player.color) {
                    p.boosts.push(boost);
                }
            })
        }
    } else if(boost.code == 13) {
        var i = Math.floor(Math.random()*15);
        var newBoost = {};
        for(prop in boosts[i]) {
            newBoost[prop] = boosts[i][prop];
        }
        newBoost.x = Math.random()*960 + 20;
        newBoost.y = Math.random()*960 + 20;
        activateBoost(player, newBoost);
    }
}

function deactivateBoost(player, index, boost) {
    if(boost.code == 1) {
        player.speed = player.speed/2;
    } else if(boost.code == 2) {
        player.speed = player.speed*2;
    } else if(boost.code == 5) {
        player.width = player.width/2;
    } else if(boost.code == 6) {
        player.width = player.width*2;
    }
    player.boosts.splice(index, 1);
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
        boostsOnMap = [];
        var bestPlayer = players[0];
        var secondPlayer;
        var i = 0;
        players.forEach((p, index) => {
            p.boosts = [];
            p.speed = 1;
            p.width = 2;
            if(p.point > bestPlayer.point) {
                bestPlayer = p;
                i = index;
            } else {
                secondPlayer = p;
            }
        });
        players.forEach((p, index) => {
            if(index != i && p.point > secondPlayer.point) {
                secondPlayer = p;
            }
        });
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
    players.forEach((p) => {
        if(e.key == p.rKey) {
            if(!p.right) {
                p.square = true;
            }
            p.right = true;
        }
        if(e.key == p.lKey) {
            if(!p.left) {
                p.square = true;
            }
            p.left = true;
        }
    })
    if(e.key == " ") {
        var fix = document.getElementById("fixCanvas");
        fix.style.visibility = "visible";
        fix = fix.getContext("2d");
        var flex = document.getElementById("flexCanvas");
        flex.style.visibility = "visible";
        flex.style.border = "1px solid yellow";
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
    players.forEach((p) => {
        if(e.key == p.rKey) {
            p.square = false;
            p.right = false;
        }
        if(e.key == p.lKey) {
            p.square = false;
            p.left = false;
        }
    });
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