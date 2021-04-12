
let W;
let H;
const enable_interaction = true;
let get_mouse_pos = false;
let get_touch_pos = false;
let ring_radius = 50;
let s = 5;
let h = 2*ring_radius;
let N;
let M; 
let A = .1*ring_radius;
let B_touch = .2;
let B = B_touch*ring_radius;
let D = .1*ring_radius;
let rate = .005;
let phaserate = 1/10;
let touch_phase = 0;
let t = 0;
const fps = 30;
let dt, startTime, now, then, delta;
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

function draw() {
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

function animate(fps) {
    dt = 1000/fps;
    then = window.performance.now();
    startTime = then;
    throttle();
 }
 
 function throttle(newtime) {
     requestAnimationFrame(throttle);
     now = newtime;
     delta = now - then;
     if (delta > dt) {
        then = now - (delta % dt);
        draw();     
     }
 }

if(enable_interaction) {
    canvas.addEventListener('mousedown', e => {
        get_mouse_pos = true;
        interaction(e);
    });
    canvas.addEventListener('mouseup', e => {
        get_mouse_pos = false;
    });
    canvas.addEventListener('mousemove', function(e) {
        if(get_mouse_pos) {
            interaction(e);
        }
    })
    canvas.addEventListener('touchstart', function(e) {
        let event = e.touches[0];
        interaction(event)
    }, false);
    canvas.addEventListener('touchend', function(e) { }, false);
    canvas.addEventListener('touchmove', function(e) {
        let event = e.touches[0];
        interaction(event)
    }, false);
}

function interaction(event) {
    touch_phase = event.clientX/canvas.width;;
    B_touch = .1 + .1*event.clientY/canvas.height;
}

function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
}

window.onresize = function () {
    resize();
}

resize();

animate(fps);