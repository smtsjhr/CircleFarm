const enable_interaction = true;
var get_mouse_pos = false;
var get_touch_pos = false;

var ring_radius = 50;
var s = 5;
var h = 2*ring_radius;
var N;
var M; 
var A = .1*ring_radius;
var B_touch = .2;
var B = B_touch*ring_radius;
var D = .1*ring_radius;
var rate = .01;
var phaserate = 1/10;
var touch_phase = 0;

const fps = 30;
var t = 0;

var fpsInterval, startTime, now, then, elapsed;


var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');


startAnimating(fps);


function draw() {
    
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    
    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.fillRect(0, 0, W, H);

    N = H/s;
    M = W/h;
    B = B_touch*ring_radius;

    for (let j = -1; j < M+5; j++) {
        for(let i = -10; i < N+20; i++){
            c = Math.abs(150*(i%2));
            u = (j/(M)+ i-(t%2)*(-1)**(j%2))*s;

            v = Asine(u, B + D*(.5 + .5*Math.sin(2*Math.PI*(t*phaserate + touch_phase))));
            x_pos = u;
            y_pos = A - ring_radius + j*h + v;
            ctx.fillStyle = `rgba(${60},${c},${80},1)`;
            ctx.beginPath();
            ctx.arc(y_pos,
                    x_pos,
                    ring_radius,
                    0, 2*Math.PI);
            ctx.fill();
        }
    }
    
    t += rate;
      
}

function Asine(x, r) {
    let v = x%(2*r);
    let sign = (-1)**Math.floor((x%(4*r))/(2*r)); 
    let y = sign*Math.sqrt(r**2 - (v - r)**2);
    return y;
}


function startAnimating(fps) {
    
    fpsInterval = 1000/fps;
    then = window.performance.now();
    startTime = then;
    
    animate();
 }
 
 function animate(newtime) {
    
    
     requestAnimationFrame(animate);
 
     now = newtime;
     elapsed = now - then;
 
     if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
     
        draw();     
        
     }

     if(enable_interaction) {
        canvas.addEventListener('mousedown', e => {
            get_mouse_pos = true;
            getMousePosition(canvas, e)
        });
          
        canvas.addEventListener('mouseup', e => {
            get_mouse_pos = false;
        });
      
        canvas.addEventListener('mousemove', function(e) {
            if(get_mouse_pos) {
                getMousePosition(canvas, e)
          }
        })
        
        canvas.addEventListener('touchstart', function(e) {
            getTouchPosition(canvas,e);
            event.preventDefault();
        }, false);
          
        canvas.addEventListener('touchend', function(e) {
     
        }, false);
          
        canvas.addEventListener('touchmove', function(e) {
            getTouchPosition(canvas,e);
            event.preventDefault();
        }, false);
    }
   
 }

function getMousePosition(canvas, event) {
    interaction(canvas,event)
}

function getTouchPosition(canvas, event) {
    var event = event.touches[0];
    interaction(canvas,event)
}

function interaction(canvas, event) {

    mouse_x = event.clientX/canvas.width;
    mouse_y = event.clientY/canvas.height;

    touch_phase = mouse_x;
    B_touch = .1 + .1*mouse_y;
}
