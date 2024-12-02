interface BackgroundOverlayProps {
  className?: string;
}

export default function BackgroundOverlay({ className = '' }: BackgroundOverlayProps) {
  return (
    <div 
      className={`absolute inset-0 bg-[url('/images/slide1.jpg')] bg-cover bg-center bg-fixed ${className}`}
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.5)), url('/images/slide1.jpg')`
      }}
    />
  );
}
