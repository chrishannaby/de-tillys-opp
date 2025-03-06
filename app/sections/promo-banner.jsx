export function PromoBanner() {
  return (
    <section className="relative container mx-auto py-[24px] h-full">
      <div className="h-[186px] w-full bg-red-600"></div>

      <div className="absolute top-1/2 right-[105px] -translate-y-1/2">
        <a 
          href="/"
          className="bg-white text-black py-[10px] px-[25px] rounded-[25px] text-[14px] font-[400] w-fit text-center whitespace-nowrap"
        >
          Shop Now
        </a>
      </div>
    </section>
  );
}