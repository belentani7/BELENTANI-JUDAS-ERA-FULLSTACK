/** Vite raw import of a GLSL source file. */
declare module '*.glsl?raw' {
  const shader: string;
  export default shader;
}
