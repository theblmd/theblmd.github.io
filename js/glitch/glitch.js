const glitch = function(sketch) {

    let gl;
    let carpetImg;
    let carpetImgInvert;
    let carpetShader;
    let blmdLogo;
    let glassCrack;
    
    let isMobile = false;
    const pixelRatio = window.devicePixelRatio;

    let isPressing = false;
    let button;
    let energy = 200;
    let hitTime = 1 + sketch.random(3);

    let buttonX = 0;
    let buttonY = 0;

    // ============================================================== //
    sketch.preload = function() {
        carpetShader = sketch.loadShader('./js/glitch/glitch.vert', './js/glitch/glitch.frag');
        carpetImg = sketch.loadImage('./assets/image/bg_carpet.jpg');
        carpetImgInvert = sketch.loadImage('./assets/image/carpet.jpg');
        glassCrack = sketch.loadImage('./assets/image/crack.png');
        blmdLogo = sketch.loadImage('./assets/image/logo.png');
        isMobile = (sketch.windowWidth < sketch.windowHeight);
    }

    // ============================================================== //
    sketch.setup = function() {
        sketch.createCanvas(sketch.windowWidth, sketch.windowHeight, sketch.WEBGL);
        if(isMobile) {
            pg = sketch.createGraphics(sketch.windowHeight, sketch.windowWidth, sketch.WEBGL);
        } else {
            pg = sketch.createGraphics(sketch.windowWidth, sketch.windowHeight, sketch.WEBGL);
        }
        
        gl = this.canvas.getContext('webgl');
        gl.disable(gl.DEPTH_TEST);

        pg.shader(carpetShader);
        sketch.imageMode(sketch.CENTER);
        sketch.textAlign(sketch.CENTER, sketch.CENTER);

        button = sketch.createButton("CLICK ME / ЭНД ДАР");
        button.mouseClicked(clickButton);
        button.size(200, 200);
        button.position(sketch.windowWidth/2 - 100, sketch.windowHeight/2 - 100);
        button.style("font-family", "Montserrat");
        button.style("font-weight", "700");
        button.style("font-size", "24px");
        button.style("padding", "5px");
        button.style("background-color", "#fa1e1d");
        button.style("color", "#fff");
        button.style("border", "none");
        button.style("border-radius", "100px");

        sketch.angleMode(sketch.DEGREES);
    }

    // ============================================================== //
    let clickButton = function() {
        console.log(hitTime);
        if(hitTime > 0) {
            hitTime--;
            buttonX = 200 + sketch.random(sketch.windowWidth - 400);
            buttonY = 200 + sketch.random(sketch.windowHeight - 400);
            button.position(buttonX, buttonY);
        } else {
            isPressing = true;
            energy = 20;
            button.style("display", "none");
        }
    }

    // ============================================================== //
    sketch.draw = function() {
        let energyBass = sketch.map(energy, 200, 300, 0, 1000, true);
        let glitcher = sketch.map(energy, 200, 300, 0.02, 0.2);

        if(isMobile) {
            carpetShader.setUniform("iResolution", [sketch.height * pixelRatio, sketch.width * pixelRatio]);
        } else {
            carpetShader.setUniform("iResolution", [sketch.width * pixelRatio, sketch.height * pixelRatio]);
        }

        carpetShader.setUniform("iTime", sketch.millis() * 0.001);
        carpetShader.setUniform("iMouse", [energyBass,energyBass]);
        carpetShader.setUniform("glitcher", glitcher);

        if(isPressing) {
            carpetShader.setUniform("iChannel0", carpetImgInvert);
        } else {
            carpetShader.setUniform("iChannel0", carpetImg);
        }
        
        pg.box(sketch.width, sketch.height);

        if(isMobile) {
            sketch.rotate(90);
            sketch.rect(sketch.height, sketch.width);
            sketch.image(pg, 0 ,0, sketch.height, sketch.width);
        } else {
            sketch.rect(sketch.width, sketch.height);
            sketch.image(pg, 0 ,0, sketch.width, sketch.height);
        }
        

        if(isPressing) {
            if(isMobile) {
                sketch.rotate(-90);
            }

            sketch.translate(-sketch.windowWidth/2,-sketch.windowHeight/2,0);
            sketch.image(glassCrack, buttonX+100, buttonY+100, 1300, 1300);
            const logoSize = isMobile ? sketch.windowWidth * 0.6 : sketch.windowWidth * 0.3;
            sketch.image(blmdLogo,sketch.windowWidth * 0.5, sketch.windowHeight * 0.14, logoSize, logoSize * 0.275);
        }
    }
}