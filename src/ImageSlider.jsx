import { shaderMaterial } from "@react-three/drei";
import { extend, useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export const ImageSlider = ({ width = 9, height = 4, fillPercent = 1.0 }) => {
   const refMaterial = useRef();
   useFrame((_, delta) => {
      refMaterial.current.uTime += 0.01;
   });

   //Responsive :
   const viewport = useThree((state) => state.viewport);
   let ratio = viewport.height / (height / fillPercent);
   if (viewport.width < viewport.height) {
      ratio = viewport.width / (width / height);
   }
   return (
      <>
         <mesh type="fixed">
            <planeGeometry args={[width * ratio + 2, height * ratio + 1]} />
            <imageSliderMaterial
               side={THREE.DoubleSide}
               ref={refMaterial}
               uHeight={height}
               uWidth={width}
               uTime={0.0}
            />
         </mesh>
      </>
   );
};

const ImageSliderMaterial = shaderMaterial(
   {
      uTexture: null,
      uPrevTexture: null,
      uProgression: 1.0,
      uHeight: null,
      uWidth: null,
      uTime: null,
   },

   /* glsl */ `
   varying vec2 vUv;
   
   void main() {
       vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
   }`,

   /* glsl */ `


   uniform float uProgression;
   uniform float uWidth;
   uniform float uHeight;
   uniform float uTime;
   varying vec2 vUv;
   
   vec3 vji(float t) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.263, 0.416, 0.557);

    return a + b * cos(6.28318 * (c * t + d));
}

   void main() {


      vec2 resolution = vec2(uWidth, uHeight);

      vec2 uv = vUv;
      uv = uv - 0.5; // centering uv
      uv = uv * 2.0; // incresing opacity
      uv.x *= resolution.x / resolution.y; // aspect correction

      vec2 uv0 = uv;
      vec3 finalColor = vec3(0.0);

      for(float i = 0.0; i < 3.0; i ++){
         
         uv = fract(uv * 1.5) - 0.5;
         
         float d = length(uv) * exp(-length(uv0));

         vec3 col = vji(length(uv0) - i * 4.0 - uTime  );

         d = sin(d * 8.0 + uTime * 2.0) / 8.0;
         d = abs(d);

         d = pow(0.01/ d, 1.2);

         finalColor += col * d;
      }
      

     
     

      gl_FragColor = vec4(finalColor, 1.0);
      
      // #include <tonemapping_fragment>
      // #include <encodings_fragment>
   }`
);

extend({ ImageSliderMaterial });
