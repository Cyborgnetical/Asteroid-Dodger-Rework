import context from "./js/draw.js"
import entity from "./js/entity.js"
import shapes from "./js/shapes.js"
import func from "./js/miscellaneous.js"


class timer{
    constructor(seconds,action){
        this.x = 100*seconds
        this.action = action

    }
    update(deltatime){
        this.x-=1000*deltatime
        if(this.x<0){
            this.action()
        }
    }
}






console.log("Loading")
let font = new FontFace("GameFont",`url("./PressStart2P-Regular.ttf")`)
await font.load().then(
    (f)=>{
        document.fonts.add(f);
    }
)


console.log("Loaded")


/** @type {HTMLCanvasElement} */
let screen = document.getElementById("canvas");
let ctx = new context(screen,"black","GameFont",30)

const RATIO = 16 / 9;

/** 
 * @typedef {object} entity
 * @property {Array<{x:number,y:number}>} points 
 */
function log(x){
    console.log(x)
}

screen.onmousemove = (mouse)=>{
    //get the mouse postion to the canvas, does the job when resizing canvas
    //one problem tho, there is a margin of error and I dont know how to fix it 
    //the error is just small so im not in a rush to fix it
    entities.misc.mouse.x = (mouse.x-parseFloat(screen.style.left))/(parseFloat(screen.style.width)/1280)
    entities.misc.mouse.y = (mouse.y-parseFloat(screen.style.top))/(parseFloat(screen.style.height)/720)
    entities.misc.mouse.update(0)
}
let entities = {
    stars:{},
    asteroids:{},
    misc:{
        player1:new entity.player(200,200,"green"),
        mouse: new entity.basic("mouse",0,0,shapes.createRect(0,0,20,20),"red")
    },
    /**
     * 
     * @param {(i,o)=>{}} callback
     */
    Loopthru:(callback)=>{
        for(let i in entities){
            if(typeof entities[i] == "object"){
                for(let o in entities[i]){
                    callback(i,o)
                }
            }
        }
    }
}
for (let i = 0; i < 100; i++) {
    entities.stars[i] = new entity.star(Math.random() * screen.width, Math.random() * screen.height)
}
let rockX = screen.width
let rocks = 10
for (let i = 0; i < rocks; i++) {
    entities.asteroids[i] = new entity.asteroid(rockX)
    rockX += (screen.width / rocks)
}
let time = {
    timebefore:0,
    delta:0
}
let timers = {

}

function UpdateStats() {
    let stats = document.getElementById("stats")
    stats.innerText = `Hp: ${entities.misc.player1.hp}`
}


let GameLoop = setInterval(() => {
    time.deltatime = (performance.now() - time.timebefore) / 1000
    time.timebefore = performance.now()
    entities.Loopthru((i,o)=>{
        entities[i][o].update(time.deltatime)
    })



    for(let i in entities.asteroids){
        if ((shapes.polyCollison(entities.misc.player1.points, entities.asteroids[i].points))) {
            if (!timers[`playerImmunity`]) {
                entities.misc.player1.hp--
                timers[`playerImmunity`] = setTimeout(() => {
                    clearTimeout(timers[`playerImmunity`])
                    delete timers[`playerImmunity`]
                    console.log("immune")
                }, 1000)
            }
        }
    } 
    UpdateStats()
    if(entities.misc.player1.hp<=0){
        clearInterval(GameLoop)
    }
    /*
    for (let i = 0; i < 10; i++) {
        if ((shapes.polyCollison(entities.player1.points, entities[`rock${i}`].points))) {
            if (!timers[`playerImmunity`]) {
                entities.player1.hp--
                timers[`playerImmunity`] = setTimeout(() => {
                    clearTimeout(timers[`playerImmunity`])
                    delete timers[`playerImmunity`]
                    console.log("immune")
                }, 1000)
            }
        }
    }
    for(let i in ActiveBullets){
        if(ActiveBullets[i].gone==true){
            delete ActiveBullets[i]
        }else{
            for (let o = 0; o < 10; o++) {
                if(shapes.polyCollison(ActiveBullets[i].points,entities[`rock${o}`].points)){
                    entities[i].gone = true
                    
                }
            }
        }
    }
    document.getElementById("stats").innerText = `HP: ${entities.player1.hp}`
    console.log(ActiveBullets)
    if (entities.player1.hp <= 0) {
        clearInterval(GameLoop)
    }*/
},0)

let drawLoop = setInterval(()=>{
    ctx.color = "black"
    ctx.drawRect(0,0,2000,2000)
    entities.Loopthru((i,o)=>{
        for(let j in entities[i][o].render){
            ctx.color = entities[i][o].render[j].color
            ctx.drawShape(entities[i][o].render[j].points)
        }
    })
},0)

let bulletId = 0











/*let game = {
    entities:{
        player1:new entity.player(200,200,"green"),
        mouse: new entity.basic(10,10,20,20,0,0,shapes.createRect(0,0,20,20),"red")
    },
    timers:{

    },
    draw(){
        ctx.color = "black"
        ctx.drawRect(0,0,2000,2000)
        for(let i in game.entities){
            ctx.color = this.entities[i].color;
            ctx.drawShape(this.entities[i].points);
        }
        ctx.color = "white"
        ctx.drawCircle(game.entities.player1.x+20,game.entities.player1.y+40,20,true)
        ctx.color = "grey"
        ctx.drawCircle(game.entities.player1.x+20,game.entities.player1.y+40,20)
        for(let i in game.timers){
            ctx.color = "red"
            ctx.drawRect(game.timers[i].x,0,50,50)
        }
        ctx.color="white"
        ctx.drawText(this.entities.player1.x+40,this.entities.player1.y-20,`Health: ${this.entities.player1.hp}`)
    },
    time:{
        timebefore:0,
        deltatime:0
    },
    GameLoop:0,
    initialize(){
        let rockX = screen.width
        let rocks = 10
        for(let i=0;i<rocks;i++){
            this.entities[`rock${i}`] = (new entity.asteroid(rockX))
            rockX+=(screen.width/rocks)
        }
        for(let i=0;i<100;i++){
            this.entities[`star${i}`] = (new entity.star(Math.random()*screen.width,Math.random()*screen.height))
        }
        this.entities["player1gun"] = new entities.gun(this.entities.player1,this.entities.mouse)
        this.GameLoop = setInterval(()=>{
            game.time.deltatime = (performance.now() - game.time.timebefore)/1000
            game.time.timebefore = performance.now()
            for (let i in game.entities) {
                game.entities[i].update(game.time.deltatime);
            }
            for(let i=0;i<10;i++){
                if(shapes.polyCollison(game.entities.player1.points,game.entities[`rock${i}`].points)){
                    if(!game.timers[`playerImmunity`]){
                        game.entities.player1.hp--
                        game.timers[`playerImmunity`] = setTimeout(()=>{
                            clearTimeout(game.timers[`playerImmunity`])
                            delete game.timers[`playerImmunity`]
                            console.log("immune")
                        },1000)
                    }
                }
            }
            if(game.entities.player1.hp<=0){
                clearInterval(game.GameLoop)
            }
            game.draw()
        })
    }
}
game.initialize()*/



























function Resize(){
    let CanvasWidth = window.innerWidth;
    let CanvasHeight = window.innerHeight;
    if (CanvasHeight < CanvasWidth / RATIO){
        CanvasWidth = CanvasHeight * RATIO;
    }else{
        CanvasHeight = CanvasWidth / RATIO;
    }
    canvas.style.width = `${CanvasWidth}px`;
    canvas.style.height = `${CanvasHeight}px`;
    canvas.style.left = `${(window.innerWidth / 2) - (CanvasWidth / 2)}px`;
    canvas.style.top = `${(window.innerHeight / 2) - (CanvasHeight / 2)}px`;
}
Resize();
window.addEventListener('resize', Resize);