import {useEffect} from 'react';

export function CartNotification({show, title, onClose}) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000); // Hide after 2 seconds

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed top-[150px] right-[20px] z-50 bg-white shadow-lg rounded-[4px] p-[16px] min-w-[250px] border border-[#e5e5e5] max-w-[200px]">
      <div className="flex flex-col">
        <span className="text-[14px] font-[700] mb-[4px]">{title}</span>
        <span className="text-[12px] text-[#757575]">Added to cart</span>
      </div>
    </div>
  );
} 