import { Canvas } from "@react-three/fiber";
import { motion } from "framer-motion";
import { ImageSlider } from "./ImageSlider";

function App() {
   return (
      <>
         <main className="bg-black">
            <section className="relative w-full h-screen">
               {/* <Slider /> */}
               <Canvas
                  className="top-0 left-0"
                  style={{
                     width: " 100%",
                     height: " 100%",
                     position: "absolute",
                  }}
                  camera={{ position: [0, 0, 5], fov: 30 }}
               >
                  <color attach="background" args={["#201d24"]} />
                  <ImageSlider />
               </Canvas>
            </section>
            <section className="grid h-screen place-content-center">
               <p className="text-white">Work in progress...</p>
            </section>
         </main>
      </>
   );
}

export default App;
