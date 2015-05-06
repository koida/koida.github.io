var canvas = document.createElement('canvas')
var ctx = canvas.getContext("2d")
var w = canvas.width = window.innerWidth
var h = canvas.height = window.innerHeight
var dirx = 0
var diry = 0
var deltax = 0
var deltay = 0
var zoomX = 20
var zoomY = 20
var fondoW = 3000
var fondoH = 1500
var ratonMargin = 20
var miniMapW = 200
var miniMapH = 150
var miniMapCuadrado = 50
var animationLock = false
var animationTimer 
var background  = new Image() 
var miNave = {
    x:400, y:400,
    img: new Image(),
    width:131, height:188,
    anguloViejo:0, anguloNuevo:0,
    centroX:400+188/2,
    centroY:400+188/2
}
var proporcionX = (miniMapW-miniMapCuadrado)/(fondoW-w)
var proporcionY = (miniMapH-miniMapCuadrado)/(fondoH-h)
var timerAngulo
var timerDireccion

//statements
canvas.id = 'canvas'
document.body.appendChild(canvas)
background.src = 'images/fondo2.png'
miNave.img.src = 'images/nave1.png'
background.onload = function () {
    render()
}

document.onmousemove = function(e) {
    //si esta encima del minimapa
    var x = e.pageX
    var y = e.pageY
    //x cordenadas
    if (x > ratonMargin && x < w-ratonMargin && y > ratonMargin && y < h-ratonMargin) {
        clearInterval(animationTimer)
        animationLock = false
    }
    else {
        if (!animationLock){
            animationLock = true
            animationTimer = setInterval(a,60)
        }
        //cada lado
        if (x < ratonMargin) {
            dirx = -1
        } 
        else if (x > w-ratonMargin) {
            dirx = 1
        } 
        else if (x > ratonMargin) {
            dirx = 0
        }

        if (y < ratonMargin) {
            diry = -1
        } 
        else if (y > h-ratonMargin) {
            diry = 1
        } 
        else if (y > ratonMargin) {
            diry = 0
        } 
    }
}

window.onmousedown = function(e) {
    // console.log(e.pageX)
}


//cuando pincha sobre el minimap
canvas.onmouseup = function(e) {
    var x = e.pageX
    var y = e.pageY
    var d = miniMapCuadrado/2
    var oldx = deltax
    var oldy = deltay
    // console.log('cia x: '+ x + ' o cia y: ' + y)
    // ctx.translate(dx,dy)
    if (x>0 && x<miniMapW && y>h-miniMapH && y<h) {
        if (x < d) x = d
        if (x > miniMapW-d) x = miniMapW-d
        if (y < h-miniMapH+d) y = h-miniMapH+d
        if (y > h-d) y = h-d
        deltax = (x-d)/proporcionX
        deltay = (y-(h-miniMapH)-d)/proporcionY
        miNave.centroX -= deltax - oldx
        miNave.centroY -= deltay - oldy
        // miNave.centroY = deltay + miNave.centroY
        // a()
    }
}

window.oncontextmenu = function (e) {
    var x = e.pageX
    var y = e.pageY
    clearInterval(timerAngulo)
    miNave.anguloNuevo = toDeg(Math.atan2(x-miNave.centroX,-(y-miNave.centroY)))
    // console.log('es angulo nuevo ' + miNave.anguloNuevo)
    // miNave.anguloNuevo = Math.atan(Math.tan((y-miNave.y)/(x-miNave.x)))
    drawNave(x,y)
    return false 
}


//functions 

function drawNave(x,y) {
    // var delta = toRad(5)
    if (!x && !y) return
    // clearInterval(timerAngulo)
    var delta = 5
    var dir = 1
    var vectorX
    var vectorY
    var deltaVectorX
    var deltaVectorY
    var v = miNave.anguloViejo
    var n = miNave.anguloNuevo
    var r
    var fx = Math.abs(miNave.centroX - x)
    var fy = Math.abs(miNave.centroY - y)
    // console.log('cia mano viejo: ' + v + ' o cia mano nuevo: ' + n)
    var skirtumas
    if (fx > fy) skirtumas = fy/fx 
    else skirtumas = fx/fy
    var vel = 5

    // console.log('fx es: ' + fx + ' fy es: ' + fy)
    if (n > v) {
        if (360-n+v < n-v) {
            dir = -1
            r = 360-n+v
        }
        else {
            dir = 1
            r = n-v
        }
    }
    else {
        if (360-v+n < v-n) {
            dir = 1
            r = 360-v+n
        }
        else {
            dir = -1
            r = v-n
        }
    }
    
    if (x >= miNave.centroX){
        vectorX = 1
        deltaVectorX = x-miNave.centroX
    }
    else {
        vectorX = -1
        deltaVectorX = miNave.centroX - x
    }

    if (y >= miNave.centroY) {
        vectorY = 1
        deltaVectorY = y - miNave.centroY
    }
    else {
        vectorY = -1
        deltaVectorY = miNave.centroY - y
    }
    timerAngulo = setInterval(function() {
        if (r <= delta) {
            if (r === delta) {
                delta = 0
            }
            else delta = r
        }
        if (fx > fy) {
            if (deltaVectorX - miNave.width/2 < 1) {
                clearInterval(timerAngulo)
                return
            }
            miNave.centroX += vel * vectorX
            miNave.centroY += vel*skirtumas * vectorY
            deltaVectorX -= vel
        }
        else {
            if (deltaVectorY - miNave.height/2 < 1) {
                clearInterval(timerAngulo)
                return
            }
            miNave.centroX += vel * skirtumas * vectorX
            miNave.centroY += vel*vectorY
            deltaVectorY -= vel

        }
        // drawBackground()
        // drawMiniMap()
        // console.log('que ' + miNave.anguloNuevo)
        
        // console.log('this is fx: '+ fx + ' and this is fy: ' + fy + ' angulo viejo: ' + miNave.anguloViejo)
        r -= delta
        miNave.anguloViejo += delta*dir
        if (miNave.anguloViejo < 0) miNave.anguloViejo += 360
        else if (miNave.anguloViejo > 360) miNave.anguloViejo -= 360
    }, 60)
}

function dn() {
    ctx.save()
    ctx.translate(miNave.centroX,miNave.centroY)
    ctx.rotate(toRad(miNave.anguloViejo))
    ctx.drawImage(miNave.img,-miNave.width/2,-miNave.height/2)
    ctx.restore()
}

function toRad(p) {
    return p * (Math.PI/180)
}

function toDeg(p) {
    if (p < 0) {
        return 360 + (p * (180/Math.PI))
    }
    return p * (180/Math.PI)
}

function drawBackground() {
    w = canvas.width = canvas.width
    h = canvas.height = canvas.height
    ctx.drawImage(background,deltax,deltay,w, h, 0,0, w, h)
    // ctx.drawImage(background, 0, 0)
}
function a() {
    var aumentarX, aumentarY
    if (dirx !== 0) {
        aumentarX = fondoW-w-deltax
        if (deltax <= zoomX && dirx === -1) {
            deltax -= deltax
            miNave.centroX += deltax
        }
        else if (zoomX >= aumentarX && dirx === 1) {
            deltax += aumentarX
            miNave.centroX -= aumentarX
        }
        else {
            deltax += zoomX * dirx
            miNave.centroX -= zoomX*dirx
        }
    }
    if (diry !== 0) {
        aumentarY = fondoH-h-deltay
        if (deltay <= zoomY && diry === -1) {
            deltay -= deltay
            miNave.centroY += deltay
        }
        else if (zoomY >= aumentarY && diry === 1) {
            deltay += aumentarY
            miNave.centroY -= aumentarY
        }
        else {
            deltay += zoomY*diry
            miNave.centroY -= zoomY*diry
        }
    }

    // ctx.drawImage(background,deltax,deltay,w, h, 0,0, w, h)
    // drawMiniMap()
}

function drawMiniMap() {
    ctx.beginPath()
    ctx.rect(0, h-150, 200, 150)
    ctx.fillStyle = 'grey'
    ctx.fill()
    ctx.strokeStyle = 'yellow'
    ctx.stroke()

    ctx.beginPath()
    ctx.rect(deltax*proporcionX,(h-miniMapH)+deltay*proporcionY,miniMapCuadrado, miniMapCuadrado)
    ctx.strokeStyle = 'red'
    ctx.stroke()
}

function render() {
    timerDireccion = setInterval(function() {
        drawBackground()
        drawMiniMap()
        // clearInterval(timerAngulo)
        dn()
    },60)
}

// setTimeout(function() {
//     clearInterval(timerDireccion)
// },10000)

