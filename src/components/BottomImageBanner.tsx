import React from 'react';

const BottomImageBanner = () => {
  // In a real app, these would be local assets like /images/eid-mubarak.jpg
  const images = [
    "https://picsum.photos/seed/eid/400/200",
    "https://picsum.photos/seed/ramadan/400/200",
    "https://picsum.photos/seed/shopping/400/200"
  ];

  return (
    <div className="fixed bottom-[15px] left-[10px] right-[10px] flex justify-between gap-[10px] z-[9999] md:hidden">
      {images.map((img, index) => (
        <img 
          key={index} 
          src={img} 
          alt="promo" 
          className="w-[32%] rounded-[12px] cursor-pointer shadow-lg hover:scale-105 transition-transform object-cover aspect-[2/1]" 
          referrerPolicy="no-referrer"
        />
      ))}
    </div>
  );
};

export default BottomImageBanner;
