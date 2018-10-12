!function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:r})},n.r=function(t){Object.defineProperty(t,"__esModule",{value:!0})},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=3)}([function(t,e,n){t.exports=n.p+"b76e0bae2da857f908aba3e94db2e083.jpg"},function(t,e){t.exports="attribute vec2 a_position;\n\nvoid main(void) {\n  gl_Position = vec4(a_position, 0, 1);\n}\n"},function(t,e){t.exports="// based on https://www.shadertoy.com/view/lsf3RH by\n// trisomie21 (THANKS!)\n// My apologies for the ugly code.\n#ifdef GL_ES\n  precision mediump float;\n#endif\nuniform float viewWidth;\nuniform float viewHeight;\n\nuniform sampler2D tDiffuse;\nuniform sampler2D tNoise;\nuniform float iTime;\nvarying vec2 vUv;\nvarying vec2 IResolution;\nuniform sampler2D iChannel1;\nuniform sampler2D iChannel0;\nvarying vec3 vPosition;\nvarying vec3 vNormal;\nuniform vec2 u_resolution;\nuniform float u_millis;\n\nuniform float temperature;\nuniform float coronaPower;\n\nfloat snoise(vec3 uv, float res)\t// by trisomie21\n{\n\tconst vec3 s = vec3(1e0, 1e2, 1e4);\n\n\tuv *= res;\n\n\tvec3 uv0 = floor(mod(uv, res))*s;\n\tvec3 uv1 = floor(mod(uv+vec3(1.), res))*s;\n\n\tvec3 f = fract(uv); f = f*f*(3.0-2.0*f);\n\n\tvec4 v = vec4(uv0.x+uv0.y+uv0.z, uv1.x+uv0.y+uv0.z,\n\t\t      \t  uv0.x+uv1.y+uv0.z, uv1.x+uv1.y+uv0.z);\n\n\tvec4 r = fract(sin(v*1e-3)*1e5);\n\tfloat r0 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);\n\n\tr = fract(sin((v + uv1.z - uv0.z)*1e-3)*1e5);\n\tfloat r1 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);\n\n\treturn mix(r0, r1, f.z)*2.-1.;\n}\n\nfloat freqs[4];\n\nvoid main()\n{\n\tfreqs[0] = texture2D( iChannel1, vec2( 0.01, 0.25 ) ).x;\n\tfreqs[1] = texture2D( iChannel1, vec2( 0.07, 0.25 ) ).x;\n\tfreqs[2] = texture2D( iChannel1, vec2( 0.15, 0.25 ) ).x;\n\tfreqs[3] = texture2D( iChannel1, vec2( 0.30, 0.25 ) ).x;\n\n\tfloat brightness\t= freqs[1] * 0.25 + freqs[2] * 0.25;\n\tfloat radius\t\t= 0.24 + brightness * 0.2;\n\tfloat invRadius \t= 1.0/radius;\n\n\tvec3 orange\t\t\t= vec3( (1.0 - temperature), temperature, temperature );\n\tvec3 orangeRed\t\t= vec3( 0.8, 0.35, 0.1 );\n\tfloat time\t\t= u_millis * 0.1;\n\tfloat aspect\t= u_resolution.x/u_resolution.y;\n\tvec2 uv\t\t\t= gl_FragCoord.xy / u_resolution.xy;\n\tvec2 p \t\t\t= -0.5 + uv;\n\tp.x *= aspect;\n\n\tfloat fade\t\t= pow( length( 2.0 * p ), 0.5 );\n\tfloat fVal1\t\t= 1.0 - fade;\n\tfloat fVal2\t\t= 1.0 - fade;\n\n\tfloat angle\t\t= atan( p.x, p.y )/6.2832;\n\tfloat dist\t\t= length(p);\n\tvec3 coord\t\t= vec3( angle, dist, time * 0.1 );\n\n\tfloat newTime1\t= abs( snoise( coord + vec3( 0.0, -time * ( 0.35 + brightness * 0.001 ), time * 0.015 ), 15.0 ) );\n\tfloat newTime2\t= abs( snoise( coord + vec3( 0.0, -time * ( 0.15 + brightness * 0.001 ), time * 0.015 ), 45.0 ) );\n\tfor( int i=1; i<=7; i++ ){\n\t\tfloat power = pow( 2.0, float(i + 1) );\n\t\tfVal1 += ( 0.5 / power ) * snoise( coord + vec3( 0.0, -time, time * 0.2 ), ( power * ( 10.0 ) * ( newTime1 + 1.0 ) ) );\n\t\tfVal2 += ( 0.5 / power ) * snoise( coord + vec3( 0.0, -time, time * 0.2 ), ( power * ( 25.0 ) * ( newTime2 + 1.0 ) ) );\n\t}\n\n\tfloat corona\t\t= pow( fVal1 * max( 1.1 - fade, 0.0 ), 2.0 ) * 50.0;\n\tcorona\t\t\t\t+= pow( fVal2 * max( 1.1 - fade, 0.0 ), 2.0 ) * 50.0;\n\tcorona\t\t\t\t*= 1.2 - newTime1;\n\tvec3 sphereNormal \t= vec3( 0.0, 0.0, 1.0 );\n\tvec3 dir \t\t\t= vec3( 0.0 );\n\tvec3 center\t\t\t= vec3( 0.5, 0.5, 1.0 );\n\tvec3 starSphere\t\t= vec3( 0.0 );\n\n\tvec2 sp = -1.0 + 2.0 * uv;\n\tsp.x *= aspect;\n\tsp *= ( 2.0 - brightness );\n  \tfloat r = dot(sp,sp);\n\tfloat f = (1.0-sqrt(abs(1.0-r)))/(r) + brightness * 0.5;\n\tif( dist < radius ){\n\t\tcorona\t\t\t*= pow( dist * invRadius, 24.0 );\n  \t\tvec2 newUv;\n \t\tnewUv.x = sp.x*f;\n  \t\tnewUv.y = sp.y*f;\n\t\tnewUv += vec2( time, 0.0 );\n\n\t\tvec3 texSample \t= texture2D( iChannel0, newUv ).rgb;\n\t\tfloat uOff\t\t= ( texSample.g * brightness * 4.5 + time );\n\t\tvec2 starUV\t\t= newUv + vec2( uOff, 0.0 );\n\t\tstarSphere\t\t= texture2D( iChannel0, starUV ).rgb;\n\t}\n\n\tfloat starGlow\t= min( max( 1.0 - dist * ( 1.0 - brightness ), 0.0 ), 1.0 );\n\t//fragColor.rgb\t= vec3( r );\n\tgl_FragColor.rgb\t= vec3( f * ( 0.75 + brightness * 0.3 ) * orange  ) + starSphere + corona * orange* coronaPower + starGlow * orangeRed * coronaPower;\n\tgl_FragColor.a\t\t= 1.0;\n}\n"},function(t,e,n){"use strict";n.r(e);var r=n(2),o=n.n(r),i=n(1),a=n.n(i),f=function(t,e){e=e||1;var n=t.clientWidth*e|0,r=t.clientHeight*e|0;return(t.width!==n||t.height!==r)&&(t.width=n,t.height=r,!0)},u=function(t,e,n){var r=t.createShader(n);if(t.shaderSource(r,e),t.compileShader(r),!t.getShaderParameter(r,t.COMPILE_STATUS))throw"Could not compile WebGL program. \n\n"+t.getShaderInfoLog(r);return r},s=function(t,e){var n=t.createProgram();e.map(function(e){return u(t,e.src,e.type)}).forEach(function(e){return t.attachShader(n,e)});return t.linkProgram(n),n},c=function(t){var e=t.createBuffer();return t.bindBuffer(t.ARRAY_BUFFER,e),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),t.STATIC_DRAW),e},m=function t(e,n,r){e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),e.bindBuffer(e.ARRAY_BUFFER,r.geometryBuffer),e.enableVertexAttribArray(r.attributes.position),e.vertexAttribPointer(r.attributes.position,2,e.FLOAT,!1,0,0),e.uniform2f(r.uniforms.resolution,window.innerWidth,window.innerHeight),e.uniform1f(r.uniforms.millis,n/1e3),e.uniform1f(r.uniforms.iChannel0,r.textures),e.uniform1f(r.uniforms.iChannel1,r.textures),e.uniform1f(r.uniforms.coronaPower,r.powers.coronaPower),e.uniform1f(r.uniforms.temperature,r.powers.temperature),e.uniform1f(r.uniforms.iTime,n),e.drawArrays(e.TRIANGLE_STRIP,0,4),requestAnimationFrame(function(n){return t(e,n,r)})};function l(t){return 0==(t&t-1)}n(4);var v=n(0),p=n.n(v);(function(){var t=document.getElementById("canvas").getContext("webgl"),e=[{src:o.a,type:t.FRAGMENT_SHADER},{src:a.a,type:t.VERTEX_SHADER}],n=s(t,e),r=c(t),i={position:t.getAttribLocation(n,"a_position"),brightness:t.getAttribLocation(n,"a_brightness")},u={resolution:t.getUniformLocation(n,"u_resolution"),iTime:t.getUniformLocation(n,"iTime"),coronaPower:t.getUniformLocation(n,"coronaPower"),temperature:t.getUniformLocation(n,"temperature"),millis:t.getUniformLocation(n,"u_millis"),iChannel0:t.getUniformLocation(n,"iChannel0"),iChannel1:t.getUniformLocation(n,"iChannel1")};t.useProgram(n);var v={coronaPower:.05,temperature:0},d=function(t,e){var n=t.createTexture();t.bindTexture(t.TEXTURE_2D,n);var r=t.RGBA,o=t.RGBA,i=t.UNSIGNED_BYTE,a=new Uint8Array([0,0,255,255]);t.texImage2D(t.TEXTURE_2D,0,r,1,1,0,o,i,a);var f=new Image;return f.onload=function(){t.bindTexture(t.TEXTURE_2D,n),t.texImage2D(t.TEXTURE_2D,0,r,o,i,f),l(f.width)&&l(f.height)?t.generateMipmap(t.TEXTURE_2D):(t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR))},f.src=e,n}(t,p.a),g=function(){f(t.canvas),t.viewport(0,0,t.canvas.width,t.canvas.height)};window.onresize=g,g(),document.getElementById("brightness").addEventListener("click",function(){v.coronaPower+=.05}),document.getElementById("temperature").addEventListener("click",function(){v.temperature+=.05}),requestAnimationFrame(function(e){return m(t,e,{geometryBuffer:r,attributes:i,uniforms:u,textures:d,powers:v})})})()},function(t,e,n){t.exports=n.p+"7c712e8a25aacb4b0cacf47a19cdeaab.jpg"}]);
//# sourceMappingURL=bundle.js.map