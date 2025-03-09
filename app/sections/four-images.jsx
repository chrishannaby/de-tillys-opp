export function FourImages({title}) {
  // Text Below optional

  return (
    <div className="container mx-auto mt-[32px] mb-[45px]">
      <h2 className="text-[18px] font-[600] pb-[8px] mb-[35px] border-b border-black">
        {title}
      </h2>

      <div className="grid grid-cols-4 gap-[25px]">
        {[...Array(4)].map((_, i) => (
          <div 
            key={i}
            className="w-full h-full aspect-[2/3] bg-red-600"
          ></div>
        ))}
      </div>
    </div>
  );
}