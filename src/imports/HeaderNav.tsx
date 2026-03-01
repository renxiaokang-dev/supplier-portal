import svgPaths from "./svg-6ie8qbnxdf";

function Group() {
  return (
    <div className="absolute contents left-0 top-[86px]">
      <div className="absolute bg-[#acc83e] h-[19px] left-0 top-[86px] w-[1920px]" />
    </div>
  );
}

export default function HeaderNav() {
  return (
    <div className="relative size-full" data-name="header-nav">
      <div className="absolute bg-[#0b5698] h-[99px] left-0 top-0 w-[1921px]" />
      <p className="absolute css-ew64yg font-['Inter:Bold','Noto_Sans_JP:Bold',sans-serif] font-bold leading-[normal] left-[359px] not-italic text-[18px] text-white top-[31px]">首页</p>
      <p className="absolute css-ew64yg font-['Inter:Bold','Noto_Sans_JP:Bold','Noto_Sans_SC:Bold',sans-serif] font-bold leading-[normal] left-[766px] not-italic text-[18px] text-white top-[31px]">商户管理</p>
      <p className="absolute css-ew64yg font-['Inter:Medium','Noto_Sans_SC:Medium','Noto_Sans_JP:Medium',sans-serif] font-medium leading-[normal] left-[1560px] not-italic text-[20px] text-white top-[34px]">简体中文</p>
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] left-[1791px] not-italic text-[20px] text-white top-[34px]">LSC000001</p>
      <Group />
      <div className="absolute inset-[40.95%_13.28%_51.43%_85.99%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.0219 8">
          <path d={svgPaths.p226cf2f0} fill="var(--fill-0, white)" id="Vector" />
        </svg>
      </div>
      <div className="absolute bg-[#acc83d] h-[36px] left-[461px] rounded-[4px] top-[24px] w-[101px]" />
      <p className="absolute css-ew64yg font-['Inter:Bold','Noto_Sans_JP:Bold','Noto_Sans_SC:Bold',sans-serif] font-bold leading-[normal] left-[476px] not-italic text-[#2f312d] text-[18px] top-[31px]">车队管理</p>
    </div>
  );
}