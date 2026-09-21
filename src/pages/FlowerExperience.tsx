import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { flowers } from "../data/flowers";
import { petalMessages } from "../data/petalMessages";

interface FlowerExperienceProps {
    flowerId: string | null;
}

function FlowerExperience({flowerId}: FlowerExperienceProps) {
    const [flowerClicked, setFlowerClicked] = useState(false);
    const [selectedPetal, setSelectedPetal] = useState<number | null>(null);
    const [petalOpening, setPetalOpening] = useState<number | null>(null);
    const [showFinalMessage, setShowFinalMessage] = useState(false);
    const [landedPetals, setLandedPetals] = useState<Set<number>>(
        new Set()
    );
    const [discoveredPetals, setDiscoveredPetals] = useState<Set<number>>(
        new Set()
    );
    

    const petals = useMemo(() => {
        return Array.from({ length: 8}, (_, index) => ({
            index,
            xPosition: (index - 3.5) * 9,
            yPosition: 78 + Math.random() * 8,
            initialRotate: Math.random() * 180,
            finalRotate: Math.random() * 720,
            delay: Math.random() * 1.5,
        }));
    }, []);

    const selectedFlower = flowers.find(
        (flower) => flower.id === flowerId
    );

    if (!selectedFlower) {
        return null;
    }
    
    return (
        <main className="flower-experience">
            <motion.div
                className="flower-scene"
                initial={{ opacity: 0, scale: 0.9 }}    
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
            >
                <p className="flower-intro">
                    Dale clic a la flor por favor, sus pétalos tienen un mensaje para ti Mitul (dales click)
                </p>

                <motion.img
                    src={selectedFlower.image}
                    alt={selectedFlower.name}
                    className="experience-flower"
                    onClick={() => setFlowerClicked(true)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                />

                <p className="flower-exp-name">
                    {selectedFlower.name}
                </p>
                
            </motion.div>

            {flowerClicked && (
                <div className="petals-container">
                    {petals.map((petal) => {

                        return (
                            <motion.span
                                key={petal.index}
                                className={`falling-petal ${
                                    landedPetals.has(petal.index) ? "landed" : ""
                                }`}
                                style={{
                                    background: selectedFlower.petal,
                                    boxShadow: `
                                        0 0 8px ${selectedFlower.petal},
                                        0 0 18px ${selectedFlower.petal}55
                                    `,
                                }}
                                onClick={() => {
                                    if (!landedPetals.has(petal.index) ||
                                        discoveredPetals.has(petal.index)
                                    ) {
                                        return;
                                    }

                                    setPetalOpening(petal.index);

                                    setTimeout(() => {
                                        setDiscoveredPetals((previous) => {
                                            const updated = new Set(previous);
                                            updated.add(petal.index);
                                            return updated;
                                        });

                                        setSelectedPetal(petal.index);
                                        setPetalOpening(null);
                                    }, 500);
                                }}
                                onAnimationComplete={() => {
                                    setLandedPetals((previous) => {
                                        const updated = new Set(previous);
                                        updated.add(petal.index);
                                        return updated;
                                    });
                                }}
                                initial={{
                                    opacity: 0,
                                    x: `${petal.xPosition}vw`,
                                    y: "-10vh",
                                    rotate: petal.initialRotate,
                                }}
                                animate={
                                    petalOpening === petal.index || discoveredPetals.has(petal.index)
                                        ? {
                                            scale:1.5,
                                            y: `${petal.yPosition - 5}vh`,
                                            rotate: 180,
                                            opacity: 0,
                                        }
                                    : {
                                        opacity: 1,
                                        x: `${petal.xPosition}vw`,
                                        y: `${petal.yPosition}vh`,
                                        rotate: petal.finalRotate,
                                    }
                                }
                                transition={
                                    petalOpening === petal.index
                                        ? {
                                            duration: 0.5,
                                            ease: "easeOut"
                                        }
                                        :{
                                            duration: 5,
                                            delay: petal.delay,
                                            ease: "easeIn"
                                        }
                                }
                            />
                        );
                    })}
                </div>
            )}

            <AnimatePresence mode="wait">
                {selectedPetal !== null && (
                    <motion.div
                        className="petal-note"
                        initial={{
                            opacity: 0,
                            scale: 0.85,
                            y: 20
                        }}
                        animate={{
                            opacity:1,
                            scale: 1,
                            y: 0
                        }}
                        transition={{
                            duration: 0.6,
                            ease: "easeOut"
                        }}
                    >
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={selectedPetal}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.35 }}
                            >
                                {selectedPetal !== null && petalMessages[selectedPetal]}
                            </motion.p>
                        </AnimatePresence>

                        <button
                            type="button"
                            className="petal-close"
                            onClick={() => {
                                const isLastPetal =
                                    discoveredPetals.size === petals.length;

                                setSelectedPetal(null);

                                if (isLastPetal) {
                                    setTimeout(() => {
                                        setShowFinalMessage(true);
                                    }, 700);
                                }

                            }}
                        >
                            Volver a los pétalos
                        </button>
                        
                    </motion.div>
                )}
            </AnimatePresence>
            
            <AnimatePresence>
                {showFinalMessage && (
                    <motion.div
                        className="petal-note"
                        initial={{
                            opacity: 0,
                            scale: 0.95,
                            y: 15,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 1,
                            ease: "easeOut",
                        }}
                    >
                        <p>
                            Me parece que eso es todo lo que quería decirte hoy 😊
                            <br />
                            ¡Espero con ansias nuestra cita! 🤩
                            <br />
                            Atte. Gabo
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}

export default FlowerExperience;