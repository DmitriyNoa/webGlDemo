let t = 0;
const draw = (gl, now, state) => {
    t+=0.001;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.bindBuffer(gl.ARRAY_BUFFER, state.geometryBuffer);

    gl.enableVertexAttribArray(state.attributes.position);
    gl.vertexAttribPointer(state.attributes.position, 2, gl.FLOAT, false, 0, 0);
    gl.uniform2f(state.uniforms.resolution, window.innerWidth, window.innerHeight);
    gl.uniform1f(state.uniforms.millis, now / 1000);
    gl.uniform1i(state.uniforms.iChannel0, state.textures.texture);
    gl.uniform1i(state.uniforms.iChannel1, state.textures.texture2);

    gl.uniform1f(state.uniforms.coronaPower, state.powers.coronaPower);
    gl.uniform1f(state.uniforms.temperature, state.powers.temperature);

    gl.uniform1f(state.uniforms.iTime, t);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    requestAnimationFrame(now => draw(gl, now, state));
};




export default draw;
