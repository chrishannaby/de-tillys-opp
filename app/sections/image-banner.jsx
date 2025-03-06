export function ImageBanner() {
  return (
    <section className="relative container mx-auto pb-[41px]">
      <div className="h-[766px] w-full bg-red-600"></div>

      <div className="absolute bottom-[120px] left-1/2 -translate-x-1/2">
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