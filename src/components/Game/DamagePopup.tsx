import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface DamagePopupProps {
    id: string;
    text: string;
    x: number;
    y: number;
    color: string;
    onComplete: (id: string) => void;
}

export const DamagePopup: React.FC<DamagePopupProps> = ({ id, text, x, y, color, onComplete }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete(id);
        }, 1000);

        return () => clearTimeout(timer);
    }, [id, onComplete]);

    return (
        <motion.div
            initial={{ opacity: 0, y: y, scale: 0.5 }}
            animate={{ opacity: 1, y: y - 100, scale: 1.5 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute font-black text-4xl pointer-events-none drop-shadow-[0_2px_2px_rgba(0,0,0,1)] stroke-black"
            style={{ 
                left: x, 
                top: y,
                color: color,
                textShadow: '0px 0px 10px rgba(0,0,0,0.8)'
            }}
        >
            {text}
        </motion.div>
    );
};
