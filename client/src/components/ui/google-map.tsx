interface GoogleMapProps {
  address?: string;
  height?: string;
  className?: string;
}

export function GoogleMap({ height = '380px', className = '' }: GoogleMapProps) {
  return (
    <div className={`relative rounded-lg overflow-hidden ${className}`} style={{ height }}>
      <iframe 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d363.503409370281!2d76.83623877519243!3d43.20891725490057!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38836825130bab31%3A0x1f9370a9a5b95a70!2zTmFzaCDRgdC10YDQstC40YE!5e0!3m2!1sen!2skz!4v1711693824630!5m2!1sen!2skz"
        width="100%" 
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy" 
        referrerPolicy="no-referrer-when-downgrade"
        title="Company Location Map"
      />
    </div>
  );
}
