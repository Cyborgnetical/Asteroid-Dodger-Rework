import shapes from "./shapes.js"
import func from "./miscellaneous.js"
const width = 1280
const height = 720



/**
 * 
 * @param {Array<{points:Array<{x:number,y:number}>,color:string}>} rendering 
 * @param {}
 * @returns 
 */

function createRender(rendering,X,Y,angle,cor){
    let render = []
    for(let i=0;i<rendering.length;i++){
        let temp = []
        for(let o=0;o<rendering[i].points.length;o++){
            let x = rendering[i].points[o].x+X
            let y = rendering[i].points[o].y+Y
            temp.push({x:x,y:y})
        }
        if(rendering[i].rotate == true){
            temp = shapes.RotatePolygon(temp,angle,cor)
        }
        render.push({
            points:temp,
            color:rendering[i].color
        })
    }
    return render
}












//@ts-check
class entity{
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} speed 
     * @param {number} angle
     * @param {Array<{x:number,y:number}>} points 
     * @param {string} color 
     */
    constructor(type,speed,angle,points,color,cor=undefined){
        let rect = shapes.getRect(points)
        this.x = rect.x
        this.y = rect.y
        this.width = rect.width 
        this.height = rect.height
        this.type = type
        this.speed = speed
        this.points = points
        this.color = color
        this.angle = angle
        //center of rotation
        if(cor!=undefined){
            this.cor = cor
        }else{
            this.cor =  {x:this.x+rect.width/2,y:this.y+rect.height/2}
        }
        //center of rotation blueprint
        this.corBP = {x:this.cor.x-this.x,y:this.cor.y-this.y}
        this.rotateShape = ()=>{}
        //this.color = color
        /**
         * @type {Array<{x:number,y:number}>}
         */
        this.blueprint = []
        for(let i=0;i<this.points.length;i++){
            let x = this.points[i].x-this.x
            let y = this.points[i].y-this.y
            this.blueprint.push({x:x,y:y})
        }
        /**
         * @type {[Array<{points:Array,color:string}>]}
         */
        this.rendering = [
            {
                points:this.blueprint,
                color:color
            }
        ]
        this.render = [
            {
                points:this.blueprint,
                color:color
            }
        ]
    }
    CreatePoints(){
        let points = []
        for(let i=0;i<this.points.length;i++){
            let x = this.x+this.blueprint[i].x
            let y = this.y+this.blueprint[i].y
            points.push({x:x,y:y})
        }
        return points
    }
    Move(deltatime){
        let rad = shapes.degToRad(this.angle)
        this.x+=(Math.cos(rad)*this.speed)*deltatime
        this.y+=(Math.sin(rad)*this.speed)*deltatime
        this.points = this.CreatePoints()
        let pos = shapes.getPos(this.points)
        this.cor = {x:pos.x+this.corBP.x,y:pos.y+this.corBP.y}
        
    }
    /**
     * 
     * @param {number} deltatime 
     */
    frame(){

    }
    update(deltatime){
        this.Move(deltatime)
        //this.createRender()
        this.render = createRender(this.rendering,this.x,this.y,this.angle,this.cor)
        this.rotateShape()
        this.frame()
    }
}

const entities =  {
    basic:entity,
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} speed 
     * @param {string} color 
     */
    player:class extends entity{
        constructor(x,y,color){
            super("player",0,0,shapes.createTriangle(x,y,80,80),color,{x:x+20,y:y+40})
            this.ArrowPressed = [0,0]
            this.hp = 5
            this.rendering.push(
                {
                points:shapes.createRect(20,25,50,30),
                color:"grey",
                rotate:true
                }
            )
            this.rendering.push(
                {
                points:shapes.createCircle(20,40,50,10),
                color:"grey",
                rotate:true
                }
            )
            this.rendering.push(
                {
                points:shapes.createCircle(20,40,35,10),
                color:"white",
                rotate:true
                }
            )
            this.rendering.push(
                {
                points:shapes.createRect(20,30,50,20),
                color:"white",
                rotate:true
                }
            )
            this.Ammo = 10
            this.ActiveBullets = []
            // loooooooooooooooooooooooong
            window.onkeydown = (e)=>{switch (e.key) { case "ArrowUp": this.ArrowPressed[1] = 1; break; case "ArrowDown": this.ArrowPressed[1] = 2; break; case "ArrowLeft": this.ArrowPressed[0] = 1; break; case "ArrowRight": this.ArrowPressed[0] = 2; break; default: break; }  if(this.ArrowPressed[1]!=0||this.ArrowPressed[0]!=0){ this.speed = 300; } this.angle = this.CodeToDir(this.ArrowPressed);}
            window.onkeyup = (e) => {switch (e.key) { case "ArrowUp": this.ArrowPressed[1] = 0; break; case "ArrowDown": this.ArrowPressed[1] = 0;break; case "ArrowLeft": this.ArrowPressed[0] = 0; break; case "ArrowRight": this.ArrowPressed[0] = 0; break; default:break; } this.angle = this.CodeToDir(this.ArrowPressed); if(this.ArrowPressed[1]==0&&this.ArrowPressed[0]==0){ this.speed = 0;} }
        }
        frame(){

        }
        /**
         * @param {[number,number]} code 
         */
        CodeToDir(code) {
            let rise = 0
            let run = 0
            switch(code[1]){
                case 1: // up
                    rise = -1
                break;
                case 2:// down
                rise = 1
                break;
            }
            switch(code[0]){
                case 1:// left
                    run = -1
                break;
                case 2:// right
                    run = 1
                break;
            }
            let riseOverRun = rise/run
            if(rise==0&&run==0){
                return 0;
            }
            if(run == -1){
                return shapes.radToDeg(Math.atan(riseOverRun))+180
            }
            return shapes.radToDeg(Math.atan(riseOverRun))
        }
    },
    asteroid:class extends entity{
        /**
         * 
         * @param {number} x 
         */
        constructor(x){
            let y = Math.random()*height
            let diameter = 150
            super("asteroid",func.rando(25,700),180,shapes.createRock(x,y,diameter),"grey")
            let holes  = []
            for(let i=0;i<6;i++){
                let idkfunc = () => {
                    let hx = Math.random()*diameter
                    let hy = Math.random()*diameter
                    let hole = shapes.createRock(hx,hy,diameter/4)
                    let inRock = false
                    for(let o=0;o<hole.length;o++){
                        if(shapes.pointCollison(hole[o],this.blueprint)){
                            inRock = true      
                        }else{
                            inRock = false
                            idkfunc()
                            break;
                        }
                        
                    }
                    if(inRock){
                        holes.push(hole)
                        this.rendering.push(
                            {
                                points:holes[i],
                                color:"#656565"
                            }
                        )
                        this.rendering.push(
                            {
                                points:shapes.createRock(hx,hy,diameter/8),
                                color:"black"
                            }
                        )
                    }
                }
                idkfunc()
            }
        }
        frame(deltatime){
            if(this.x<-200){
                this.x = width+50
                this.speed = func.rando(25,700)
            }
        }
    },
    star:class extends entity{
        constructor(x,y){
            super("star",10,180,shapes.createRect(x,y,10,10),"white")
        }
        /**
         * 
         * @param {number} deltatime 
         */
        frame(deltatime){
            if(this.x<-10){
                this.x = width+10
            }
        }
    },
}
export default entities