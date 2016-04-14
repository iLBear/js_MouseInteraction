window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame   ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();


window.onload = function() {
    // Canvas未サポートは実行しない
    if (!window.HTMLCanvasElement) return;

    var canvas = document.querySelector('#canvas-container');
    var ctx = canvas.getContext('2d');
    var queue = null;
    var isMouseDown = false;
        var nextColStep = [0,0,0];
        var count = 0;

    window.addEventListener("resize", function() {
        clearTimeout( queue );
        queue = setTimeout(function() {
            setCanvasSize();
        }, 300 );
    }, false );

    var setCanvasSize = function() {
        canvas.width = document.documentElement.clientWidth;
        canvas.height = document.documentElement.clientHeight;
    };
    setCanvasSize();


    var clickPoint = {
        x: 0,
        y: 0
    };

    var Particle = function(scale, color, speed) {
        this.scale = scale;
        this.color = color;
        this.speed = speed;
        this.position = {
            x: 0,
            y: 0
        };
    };

    Particle.prototype.draw = function() {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.scale, 0, 2*Math.PI, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    };

    Particle.prototype.update = function() {
        var step = 100;
        if(count > step){
            nextColStep[0] = (parseInt(this.color.substr(1,2),"16")-Math.floor(Math.random() * 256))/step;
            nextColStep[1] = (parseInt(this.color.substr(3,2),"16")-Math.floor(Math.random() * 256))/step;
            nextColStep[2] = (parseInt(this.color.substr(5,2),"16")-Math.floor(Math.random() * 256))/step;
            count = 0;
            // console.log(parseInt(this.color.substr(1,2),"16")+parseInt(this.color.substr(3,2),"16")+parseInt(this.color.substr(5,2),"16"));
            // console.log('r: '+nextColStep[0]+',g: '+nextColStep[1]+',b: '+nextColStep[2]);
        }
        if(!isMouseDown){
            this.position.x += (clickPoint.x - this.position.x) / this.speed;
            this.position.y += (clickPoint.y - this.position.y) / this.speed;
        }
        var dist = Math.sqrt(Math.pow((clickPoint.x - this.position.x),2)+Math.pow((clickPoint.y - this.position.y),2));
        var colRatio = Math.floor(dist/(Math.max(canvas.width, canvas.height)/100));
        // console.log('dist:'+dist+', cR: '+colRatio);
        if(!isMouseDown){
            this.color = '#'+('0'+(parseInt(this.color.substr(1,2),"16")-parseInt(nextColStep[0])*colRatio).toString(16)).slice(-2)
                            +('0'+(parseInt(this.color.substr(3,2),"16")-parseInt(nextColStep[1])*colRatio).toString(16)).slice(-2)
                            +('0'+(parseInt(this.color.substr(5,2),"16")-parseInt(nextColStep[2])*colRatio).toString(16)).slice(-2);
            // console.log('['+count+']'+(parseInt(this.color.substr(1,2),"16"))+' '+(-parseInt(nextColStep[0]*count))+','+(parseInt(this.color.substr(3,2),"16"))+' '+(-parseInt(nextColStep[1]*count))+','+(parseInt(this.color.substr(5,2),"16"))+' '+(-parseInt(nextColStep[2]*count)));
            // console.log(this.color);
            count += colRatio;
        }
        this.draw();
        // console.log(count);
    };

    var particle = new Particle(15, '#eeeeee', 5);

    // 再描画
    var loop = function() {
        requestAnimFrame(loop);
        ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);

        particle.update();
    };
    loop();

    var rect = canvas.getBoundingClientRect();

    // カーソル移動
    canvas.addEventListener('mousemove', function(e) {
        var mouseX = e.clientX - rect.left;
        var mouseY = e.clientY - rect.top;

        clickPoint.x = mouseX;
        clickPoint.y = mouseY;

    }, false);

    // クリックしっぱなし
    canvas.addEventListener('mousedown', function(e) {
        isMouseDown = true;
    }, false);

    // クリック離す
    canvas.addEventListener('mouseup', function(e) {
        isMouseDown = false;
    }, false);

    // 画面外にマウスを移動
    canvas.addEventListener('mouseout', function(e) {
        isMouseDown = false;
    }, false);

};