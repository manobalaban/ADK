var boostsOnMap = [];
var nextBoost = 50;
//Math.random()*500;
var boostCounter = 0;
var commonBoosts = [];

const boosts = [
    //accelerator 0-1
    {
        effect : 2,
        code : 1,
        x : 0,
        y : 0,
        timeLeft : 1000,
        src : "icons/acceleratorG.png",
    },
    {
        effect : 3,
        code : 1,
        x : 0,
        y : 0,
        timeLeft : 500,
        src : "icons/acceleratorR.png",
    },
    //decelerator 2-3
    {
        effect : 2,
        code : 2,
        x : 0,
        y : 0,
        timeLeft : 1000,
        src : "icons/deceleratorG.png",
    },
    {
        effect : 3,
        code : 2,
        x : 0,
        y : 0,
        timeLeft : 500,
        src : "icons/deceleratorR.png",
    },
    //clear 4
    {
        effect : 1,
        code : 3,
        x : 0,
        y : 0,
        timeLeft : 500,
        src : "icons/clearB.png",
    },
    //ghost 5
    {
        effect : 2,
        code : 4,
        x : 0,
        y : 0,
        timeLeft : 500,
        src : "icons/ghostG.png",
    },
    //big 6
    {
        effect : 3,
        code : 5,
        x : 0,
        y : 0,
        timeLeft : 500,
        src : "icons/bigR.png",
    },
    //small 7
    {
        effect : 2,
        code : 6,
        x : 0,
        y : 0,
        timeLeft : 500,
        src : "icons/smallG.png",
    },
    //more 8
    {
        effect : 1,
        code : 7,
        x : 0,
        y : 0,
        timeLeft : 500,
        src : "icons/moreB.png",
    },
    //suck 9
    {
        effect : 3,
        code : 8,
        x : 0,
        y : 0,
        timeLeft : 500,
        src : "icons/suckR.png",
    },
    //thiefsDownfall 10
    {
        effect : 1,
        code : 9,
        x : 0,
        y : 0,
        timeLeft : 500,
        src : "icons/thiefsDownfallB.png",
    },
    //wallBreak 11
    {
        effect : 2,
        code : 10,
        x : 0,
        y : 0,
        timeLeft : 500,
        src : "icons/wallBreakG.png",
    },
    //noBorder 12
    {
        effect : 1,
        code : 11,
        x : 0,
        y : 0,
        timeLeft : 500,
        src : "icons/wallBreakB.png",
    },
    //square 13-14
    {
        effect : 2,
        code : 12,
        x : 0,
        y : 0,
        timeLeft : 500,
        src : "icons/squareG.png",
    },
    {
        effect : 3,
        code : 12,
        x : 0,
        y : 0,
        timeLeft : 500,
        src : "icons/squareR.png",
    },
    //random 15
    {
        effect : 4,
        code : 13,
        x : 0,
        y : 0,
        timeLeft : 500,
        src : "icons/random.png",
    },
]