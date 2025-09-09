import { memo } from 'react';
import DarkVeil from './DarkVeil';

interface AnimatedBackgroundProps {
  intensity?: 'subtle' | 'medium' | 'strong';
}

const AnimatedBackground = memo(({ intensity = 'subtle' }: AnimatedBackgroundProps) => {
  // Configuración basada en la intensidad
  const configs = {
    subtle: {
      hueShift: 35, // Más intenso hacia los marrones
      noiseIntensity: 0.03,
      speed: 0.4,
      warpAmount: 0.15,
      resolutionScale: 0.9
    },
    medium: {
      hueShift: 40,
      noiseIntensity: 0.05,
      speed: 0.6,
      warpAmount: 0.2,
      resolutionScale: 1.0
    },
    strong: {
      hueShift: 45,
      noiseIntensity: 0.08,
      speed: 0.8,
      warpAmount: 0.25,
      resolutionScale: 1.2
    }
  };

  const config = configs[intensity];

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        mixBlendMode: 'screen', // Screen mode para mejor visibilidad
        opacity: 0.8 // Más opacidad para efecto más intenso
      }}
    >
      <DarkVeil
        hueShift={config.hueShift}
        noiseIntensity={config.noiseIntensity}
        speed={config.speed}
        warpAmount={config.warpAmount}
        resolutionScale={config.resolutionScale}
        scanlineIntensity={0}
        scanlineFrequency={0}
      />
    </div>
  );
});

AnimatedBackground.displayName = 'AnimatedBackground';

export default AnimatedBackground;
