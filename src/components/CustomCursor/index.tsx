// src/components/CustomCursor.tsx
import React, { useEffect, useState } from 'react';
import './CustomCursor.css';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [delayedPosition, setDelayedPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isLeft, setIsLeft] = useState(true);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setTimeout(() => { // Simulate a delay for the outer circle
        setDelayedPosition({ x: e.clientX, y: e.clientY });
      }, 50);
    };

    const handleMouseEnter = (e: MouseEvent) => {
      setIsLeft(false)
      if ((e.target as HTMLElement).classList.contains('cursor-pointer')) {
        setIsHovering(true);
      }
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      setIsLeft(true)
    };

    const handleMouseDown = () => {
      setIsClicking(true);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    document.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseover', handleMouseEnter);
    document.addEventListener('mouseout', handleMouseLeave);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', handleMouseEnter);
      document.removeEventListener('mouseout', handleMouseLeave);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const outerSize = isClicking ? 60 : isHovering ? 50 : 40;
  const innerSize = 10;

  return (
    <div>
      <div className="cursor outer" style={{
        left: `${delayedPosition.x}px`,
        top: `${delayedPosition.y}px`,
        width: `${outerSize}px`,
        height: `${outerSize}px`,
        opacity: `${isLeft ? '0' : '1'}`
      }}/>
      <div className="cursor inner" style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${innerSize}px`,
        height: `${innerSize}px`,
        opacity: `${isLeft ? '0' : '1'}`
      }}/>
    </div>
  );
};

export default CustomCursor;
