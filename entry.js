(function(window, document) {
    var vertexShaderSource = require('raw!./shader/triangle.vert');
    var fragmentShaderSource = require('raw!./shader/triangle.frag');
    var webgl = require('./webgl.js');
    var WebGL = webgl.WebGL;
    var Shader = webgl.Shader;
    var Buffer = webgl.Buffer;

    var wgl = new WebGL('canvas');
    var vshader = wgl.loadVertexShader(vertexShaderSource);
    var fshader = wgl.loadFragmentShader(fragmentShaderSource);
    var shader = wgl.createShader();
    shader.attach(vshader).attach(fshader);
    shader.end();
    shader.setPositionAttribute('aVertexPosition');
    var buffer = wgl.createBuffer('ARRAY_BUFFER',  'TRIANGLES');
    buffer.setData([
        0.0, 0.5, 0.0,
        -0.5, -0.5, 0.0,
        0.5, -0.5, 0.0
    ], 3, 3);
    wgl.clearColor(0.0, 1.0, 0.0, 1.0);
    wgl.clear();
    wgl.draw(shader, buffer);

})(this, document);