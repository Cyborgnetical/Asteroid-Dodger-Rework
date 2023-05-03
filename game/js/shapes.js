import func from "./miscellaneous.js"
/**
 * 
 * @param  {...number} numbers 
 */
Math.median = (...numbers)=>{
    let max = numbers[0]
    let min = numbers[0]
    for(let i=0;i<numbers.length;i++){
        if(numbers[i] > numbers[(i+1)%numbers.length]){
            max = numbers[i]
        }
        if(numbers[i] < numbers[(i+1)%numbers.length]){
            min = numbers[i]
        }
    }
    return ((max-min)/2)+min
}
export default {
    /**
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height 
     * @returns {Array<{x:number,y:number}>}
     */
    createRect(x,y,width,height){
        return [
            {x:0+x,y:0+y},
            {x:width+x,y:0+y},
            {x:width+x,y:height+y},
            {x:0+x,y:height+y}
        ]
    },
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height 
     * @returns {Array<{x:number,y:number}>}
     */
    createTriangle(x,y,width,height){
        return [
            {x:0+x,y:0+y},
            {x:width+x,y:height/2+y},
            {x:0+x,y:height+y}
        ]
    },
    /**
     * 
     * @param {{x:number,y:number}} point 
     * @param {number} angle 
     * @param {{x:number,y:number}} center 
     * @returns 
     */
    rotatePoint(point,angle,center){
        let dx = center.x - point.x
        let dy = center.y - point.y
        let dist = Math.sqrt(dx*dx+dy*dy)
        let rad = -Math.atan2(dx,dy)
        let radi = this.degToRad(angle)
        let rotatedPoint = {
            x:Math.cos(rad+radi)*dist+center.x,
            y:Math.sin(rad+radi)*dist+center.y
        }
        return rotatedPoint
    },
    RotatePolygon(points,angle,center){
        let rotatedPoints = []
        for(let i=0;i<points.length;i++){
            rotatedPoints.push(this.rotatePoint(points[i],angle,center))
        }
        return rotatedPoints
    },
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} diameter 
     * @returns Array containing point locations
     */
     createRock(x,y,diameter){
        let pos = {x:x,y:y}
        let radious = diameter/2
        let points = []
        for(let i=0;i<10;i++){
            points.push({x:x,y:y-radious+(Math.random()*radious/2)})
        }
        for(let i=0;i<10;i++){
            points[i] = this.rotatePoint(points[i],36*i,pos)
        }

        /**
         * [
            {x:0+x,y:0+y},
            {x:diameter+x,y:0+y},
            {x:diameter+x,y:diameter+y},
            {x:0+x,y:diameter+y}
        ]
         */





        return points
    },
    createCircle(x,y,diameter,count){
        let pos = {x:x,y:y}
        let radious = diameter/2
        let points = []
        for(let i=0;i<count;i++){
            points.push({x:x,y:y-radious})
        }
        let part /*idk wut to name it*/ = 360/count
        for(let i=0;i<count;i++){
            points[i] = this.rotatePoint(points[i],part*i,pos)
        }
        return points
    },
    degToRad(angle){
        return (angle) * Math.PI / 180
    },
    radToDeg(rad){
        return (rad) * 180/Math.PI
    },
    /**
     * 
     * @param {{x:number,y:number}} pos1 
     * @param {{x:number,y:number}} pos2 
     */
    getAngle(pos1,pos2){
        //yeah no I just copied from the rotate point function
        let dx = pos1.x - pos2.x
        let dy = pos1.y - pos2.y
        let rads = -Math.atan2(dx,dy)
        //console.log(rads)
        return rads
    },
    /**
     * 
     * @param {Array<{x:number,y:number}>} shape 
     */
    getPos(shape){
        let x 
        let y 
        let minX = shape[0].x
        let minY = shape[0].y
        for(let i=0;i<shape.length;i++){
            minX = Math.min(minX,shape[(i+1)%shape.length].x)
            minY = Math.min(minY,shape[(i+1)%shape.length].y)
        }
        x = minX
        y = minY
        return {
            x:x,
            y:y
        }
    },
    /**
     * 
     * @param {Array<{x:number,y:number}>} shape 
     */ 
    getRect(shape){
        let pos = this.getPos(shape)
        let rect = {x:pos.x,y:pos.y,width:undefined,height:undefined}
        let MaxX = shape[0].x
        let MaxY = shape[0].y
        for(let i=0;i<shape.length;i++){
            MaxX = Math.max(MaxX,shape[(i+1)%shape.length].x)
            MaxY = Math.max(MaxY,shape[(i+1)%shape.length].y)
        }
        rect.width = MaxX-rect.x
        rect.height = MaxY-rect.y
        return rect
    },
     /**
     * 
     * @param {Array<{x:number,y:number}>} line1 - first line
     * @param {Array<{x:number,y:number}>} line2 - second line
     */
    //line collision
    lineCollide(line1,line2){
        const tTop = (line2[1].x-line2[0].x)*(line1[0].y-line2[0].y)-(line2[1].y-line2[0].y)*(line1[0].x-line2[0].x)
        const uTop = (line2[0].y-line1[0].y)*(line1[0].x-line1[1].x)-(line2[0].x-line1[0].x)*(line1[0].y-line1[1].y)
        const bottom = (line2[1].y-line2[0].y)*(line1[1].x-line1[0].x)-(line2[1].x-line2[0].x)*(line1[1].y-line1[0].y)
        let t = tTop/bottom
        let u = uTop/bottom
        return (t>=0&&t<=1&&u>=0&&u<=1)||(tTop==0&&uTop==0)&&(bottom!=0)
    },
    /**
     * 
     * @param {Array<{x:number,y:number}>}poly1
     * } 
     * @param {Array<{x:number,y:number}>} poly2 
     */
    polyCollison(poly1,poly2){
        let colliding = false
        for(let i=0;i<poly1.length;i++){
            for(let o=0;o<poly2.length;o++){
                if(this.lineCollide([poly1[i],poly1[(i+1)%poly1.length]],[poly2[o],poly2[(o+1)%poly2.length]])){
                    colliding = true
                }
            }
        }
        return colliding
    },
    //I know a lot of code is being repeated
    /**
     * 
     * @param {{x:number,y:number}} pt 
     * @param {Array<{x:number,y:number}>} poly 
     */
    pointCollison(point, polygon){
        let lines = [
            [{x:point.x,y:point.y},{x:point.x,y:0}],
            [{x:point.x,y:point.y},{x:point.x,y:720}],
            [{x:point.x,y:point.y},{x:0,y:point.y}],
            [{x:point.x,y:point.y},{x:1280,y:point.y}]
        ]
        let top_collision = true
        let bottom_collision = false
        let left_collision = false
        let right_collision = false
        for(let i=0;i<polygon.length;i++){
                if(this.lineCollide([lines[0][0],lines[0][1]],[polygon[i],polygon[(i+1)%polygon.length]])){bottom_collision=true}
                if(this.lineCollide([lines[1][0],lines[1][1]],[polygon[i],polygon[(i+1)%polygon.length]])){top_collision=true}
                if(this.lineCollide([lines[2][0],lines[2][1]],[polygon[i],polygon[(i+1)%polygon.length]])){left_collision=true}
                if(this.lineCollide([lines[3][0],lines[3][1]],[polygon[i],polygon[(i+1)%polygon.length]])){right_collision=true}
        }
        return top_collision && bottom_collision && left_collision && right_collision
    }
}
// jeepers cripes I know my codes is bads
