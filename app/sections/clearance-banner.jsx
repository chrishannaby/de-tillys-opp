export function ClearanceBanner() {
  return (
    <div className="container mx-auto relative w-full h-[90px] mb-[16px] bg-red-600">
      <a 
        href="/" 
        className="absolute top-1/2 right-[52px] -translate-y-1/2 text-center text-[14px] font-[400] bg-white text-black py-[10px] px-[25px] rounded-[25px]"
      >
        Shop Now
      </a>
    </div>
  );
}