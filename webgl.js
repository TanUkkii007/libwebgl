var WebGL = function(id) {
    this.createContext(id);
};

WebGL.prototype = {
    createContext: function(id) {
        var canvas = document.getElementById(id);
        var context = canvas.getContext('webgl');
        context.viewportWidth = canvas.width;
        context.viewportHeight = canvas.height;
        this.gl = context;
        return this;
    },
    loadShader: function(type, shaderSource) {
        var gl = this.gl;
        var shader = gl.createShader(type);
        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw new Error('Error compiling shader ' + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
        }
        return shader;
    },
    loadVertexShader: function(shaderSource) {
        var shader = this.loadShader(this.gl.VERTEX_SHADER, shaderSource);
        return shader;
    },
    loadFragmentShader: function(shaderSource) {
        var shader = this.loadShader(this.gl.FRAGMENT_SHADER, shaderSource);
        return shader;
    },
    clear: function () {
        var gl = this.gl;
        gl.clear(gl.COLOR_BUFFER_BIT);
        return this;
    },
    clearColor: function(a1, a2, a3, a4) {
        this.gl.clearColor(a1, a2, a3, a4);
        return this;
    },
    createShader: function() {
        return new Shader(this.gl);
    },
    createBuffer: function(type, drawMethod) {
        var buffer = new Buffer(this.gl);
        return buffer.create(type, drawMethod);
    },
    draw: function(shader, buffer) {
        var gl = this.gl;
        var program = shader.program;
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.vertexAttribPointer(program.vertexPositionAttribute, buffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(program.vertexPositionAttribute);
        gl.drawArrays(gl[buffer.drawMethod], 0, buffer.numberOfItems);
        return this;
    }
};

var Shader = function(context) {
    this.gl = context;
    this.program = context.createProgram();
    this.linked = false;
    this.used = false;
};

Shader.prototype = {
    attach: function(shader) {
        this.gl.attachShader(this.program, shader);
        return this;
    },
    link: function() {
        var gl = this.gl;
        var program = this.program;
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            throw new Error('Failed to setup shaders');
        }
        this.linked = true;
        return this;
    },
    use: function() {
        var gl = this.gl;
        var program = this.program;
        gl.useProgram(program);
        this.used = true;
        return this;
    },
    setPositionAttribute: function(attribute) {
        var gl = this.gl;
        var program = this.program;
        gl.getAttribLocation(program, attribute);
    },
    end: function() {
        this.link().use();
        return this;
    }
};

var Buffer = function(context) {
    this.gl = context;
};

Buffer.prototype = {
    create: function(type, drawMethod) {
        this.type = type = type || 'ARRAY_BUFFER';
        this.drawMethod = drawMethod;
        var gl = this.gl;
        this.buffer = gl.createBuffer();
        gl.bindBuffer(gl[type], this.buffer);
        return this;
    },
    setData: function(array, size, num) {
        var gl = this.gl;
        var buffer = this.buffer;
        var f32array = new Float32Array(array);
        gl.bufferData(gl[this.type], f32array, gl.STATIC_DRAW);
        this.itemSize = size;
        this.numberOfItems = num;
        return this;
    }
};

module.exports = {
    WebGL: WebGL,
    Shader: Shader,
    Buffer: Buffer
};