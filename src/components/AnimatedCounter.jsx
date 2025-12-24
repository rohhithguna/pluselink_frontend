import React from 'react';
import { useSpring, animated } from '@react-spring/web';

const AnimatedCounter = ({ value, duration = 1000 }) => {
    const props = useSpring({
        number: value,
        from: { number: 0 },
        config: { duration }
    });

    return (
        <animated.span>
            {props.number.to(n => Math.floor(n).toLocaleString())}
        </animated.span>
    );
};

export default AnimatedCounter;
