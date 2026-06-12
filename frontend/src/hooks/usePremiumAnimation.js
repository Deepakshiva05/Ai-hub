export const pageTransition = {
  initial: { opacity: 0, scale: 0.98, filter: "blur(4px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, scale: 0.98, filter: "blur(4px)" },
  transition: { duration: 0.45, ease: [0.23, 1, 0.32, 1] }
};

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05
    }
  }
};

export const staggerItem = {
  initial: { opacity: 0, y: 12 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 380, damping: 26 }
  }
};

export const modalTransition = {
  initial: { opacity: 0, scale: 0.92, y: 15 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 420, damping: 28 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.94, 
    y: 10,
    transition: { duration: 0.18, ease: "easeOut" }
  }
};

export const hoverSpring = {
  scale: 1.025,
  transition: { type: "spring", stiffness: 400, damping: 17 }
};

export const buttonClick = {
  scale: 0.96,
  transition: { type: "spring", stiffness: 500, damping: 15 }
};
