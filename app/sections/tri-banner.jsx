export function TriBanner() {
  return (
    <section className="flex gap-[16px] container mx-auto pt-[35px] pb-[25px]">
      {/* Image 1 */}
      <div className="flex-[1] w-[33%] h-[800px]">
        <a href="/" className="relative w-full">
          <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-[22px]">
            <h2 className="text-white uppercase text-[24px] font-bold whitespace-nowrap">
              Shorts
            </h2>

            <div className="flex items-center gap-[16px]">
              <a
                href="/"
                className="bg-white text-black py-[10px] px-[25px] rounded-[25px] text-[14px] font-[400] w-fit text-center whitespace-nowrap"
              >
                Shop Women
              </a>

              <a
                href="/"
                className="bg-white text-black py-[10px] px-[25px] rounded-[25px] text-[14px] font-[400] w-fit text-center whitespace-nowrap"
              >
                Shop Men
              </a>
            </div>

          </div>

          <div className="bg-red-700 w-full h-full"></div>
        </a>
      </div>

      {/* Image 2 */}
      <div className="flex-[1] w-[650px] h-[800px]">
        <a href="/" className="relative w-full">
          <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-[22px]">
            <h2 className="text-white uppercase text-[24px] font-bold text-center whitespace-nowrap">
              Women's Graphic Tees
            </h2>

            <a
              href="/"
              className="bg-white text-black py-[10px] px-[25px] rounded-[25px] text-[14px] font-[400] w-fit text-center whitespace-nowrap"
            >
              Shop
            </a>
          </div>

          <div className="bg-red-700 w-full h-full"></div>
        </a>
      </div>

      {/* Image 3 */}
      <div className="flex-[1] w-[33%] h-[800px]">
        <a href="/" className="relative w-full">
          <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-[22px]">
            <h2 className="text-white uppercase text-[24px] font-bold text-center">
              Men's Graphic Tees
            </h2>

            <a
              href="/"
              className="bg-white text-black py-[10px] px-[25px] rounded-[25px] text-[14px] font-[400] w-fit text-center whitespace-nowrap"
            >
              Shop
            </a>
          </div>

          <div className="bg-red-700 w-full h-full"></div>
        </a>
      </div>
    </section>
  );
}