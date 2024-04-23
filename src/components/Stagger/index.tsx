// WaveGrid.tsx
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Stagger: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const gridCols = 51;  // количество столбцов
  const gridRows = 21;   // количество строк
  const numberOfSquares = gridCols * gridRows; // общее количество квадратов

  useEffect(() => {
    if (gridRef.current) {
      const squares = Array.from(gridRef.current.children);
      const centerCol = Math.floor(gridCols / 2);
      const centerRow = Math.floor(gridRows / 2);

      squares.forEach((square, index) => {
        const row = Math.floor(index / gridCols);
        const col = index % gridCols;
        const distance = Math.sqrt(Math.pow(row - centerRow, 2) + Math.pow(col - centerCol, 2));

        gsap.fromTo(square, 
          { scale: 1 }, 
          {
            scale: 3,
            repeat: -1,
            yoyo: true,
            ease: "expo.inOut",
            duration: 0.5,
            delay: distance * 0.25
          }
        );
      });
    }
  }, []);

  return (
    <div ref={gridRef} className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
    style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
        gap: '2rem'
    }}>
        {Array.from({ length: numberOfSquares }).map((_, index) => (
            <div key={index} className="w-0.5 h-0.5 bg-gray-100/25"></div>
        ))}
    </div>
  );
};

export default Stagger;
