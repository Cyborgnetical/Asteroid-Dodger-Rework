//@ts-check
export default class{
    /**
     *  @param {HTMLCanvasElement} canvas - Used to get context
     *  @param {string} color - color to draw with
     *  @param {string} font - type of font
     *  @param {number} fontsize - font size
     * */
    constructor(canvas,color,font,fontsize){
        /**
         * @type {CanvasRenderingContext2D}
         */
        
        // @ts-ignore
        this.ctx = canvas.getContext("2d");
        this.ctx.fillStyle = color
        this.ctx.textAlign = "center"
        this.ctx.textBaseline = "middle"
        this.ctx.font = `${fontsize}px ${font}`
        this.ctx.lineCap = "square"
    }
    /**
     * 
     * @param {string} color 
     */
    set color(color){
        this.ctx.fillStyle = color
        this.ctx.strokeStyle = color
    }
    /**
     * 
     * @param {number} x1 
     * @param {number} y1 
     * @param {number} x2 
     * @param {number} y2 
     */
    drawline(x1,y1,x2,y2){
        this.ctx.beginPath()
        this.ctx.moveTo(x1,y1)
        this.ctx.lineTo(x2,y2)
        this.ctx.stroke()
    }
    /**
     * @param {Array<{x:number,y:number}>} points - object array containing the x and y values
     */
    drawShape(points){
        // just messing with Path2D
        /*let PathCommands = ""
        PathCommands+=`M${points[0].x} ${points[0].y} `
        for(let i=0;i<points.length;i++){
            PathCommands+=`L${points[i].x} ${points[i].y}`
        }

        this.ctx.fill(new Path2D(PathCommands))*/

        this.ctx.beginPath()
        this.ctx.moveTo(points[0].x,points[0].y)
        for(let i=0;i<points.length;i++){
            this.ctx.lineTo(points[i].x,points[i].y)
        }
        this.ctx.lineTo(points[0].x,points[0].y)
        this.ctx.closePath();
        //this.ctx.stroke()
        this.ctx.fill()
    }
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height 
     */
    drawRect(x,y,width,height){
        this.ctx.beginPath()
        this.ctx.rect(x,y,width,height)
        this.ctx.fill()
    }
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} rad 
     * @param {boolean} fill
     */
    drawCircle(x,y,rad,fill = false){
        this.ctx.beginPath()
        this.ctx.arc(x,y,rad,0,2*Math.PI)
        if(fill){this.ctx.fill()}else{this.ctx.stroke()}
    }
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {string} txt 
     */
    drawText(x,y,txt){
        this.ctx.beginPath()
        this.ctx.fillText(txt,x,y)
        this.ctx.fill()
    }
}









