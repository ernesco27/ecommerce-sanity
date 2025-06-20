import { cn } from "@/lib/utils";
import React, { ReactNode, useEffect, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

const Reveal = ({
  children,
  width,
}: {
  children: ReactNode;
  width?: "fit-content" | "100%";
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "0px 0px -10% 0px" });

  return (
    <div ref={ref} className={cn("relative overflow-hidden", width)}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ type: "spring", stiffness: 120, damping: 25, mass: 0.8 }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default Reveal;
