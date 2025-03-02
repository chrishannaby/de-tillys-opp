export function TriBanner() {
  return (
    <section className="flex gap-[16px] container mx-auto mt-[35px] mb-[25px]">
      {/* Image 1 */}
      <div className="flex-[1] w-[33%] h-[800px]">
        <a href="/">
          <div className="bg-red-700 w-full h-full"></div>
        </a>
      </div>

      {/* Image 2 */}
      <div className="flex-[1] w-[650px] h-[800px]">
        <a href="/">
          <div className="bg-red-700 w-full h-full"></div>
        </a>
      </div>

      {/* Image 3 */}
      <div className="flex-[1] w-[33%] h-[800px]">
        <a href="/">
          <div className="bg-red-700 w-full h-full"></div>
        </a>
      </div>
    </section>
  );
}