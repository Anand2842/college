import React from 'react';

interface OrganizersHierarchyProps {
  partnersByCategory: Record<string, any[]>;
}

const TierDivider: React.FC<{ title: string; className?: string }> = ({ title, className = "" }) => (
  <div className={`flex items-center justify-center gap-2 sm:gap-3.5 my-4 sm:my-6 ${className}`}>
    <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#A88B38] shrink-0" />
    <div className="h-[1.5px] bg-[#A88B38]/60 flex-1 max-w-[50px] sm:max-w-[100px] md:max-w-[160px]" />
    <h3 className="text-[#133826] font-serif font-bold text-sm sm:text-base md:text-lg lg:text-xl text-center whitespace-nowrap tracking-wide px-1.5">
      {title}
    </h3>
    <div className="h-[1.5px] bg-[#A88B38]/60 flex-1 max-w-[50px] sm:max-w-[100px] md:max-w-[160px]" />
    <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#A88B38] shrink-0" />
  </div>
);

export function getPartnerShortName(partner: any): string {
  if (partner?.shortName && partner.shortName.trim()) {
    return partner.shortName.trim();
  }
  const name = (partner?.name || "").toLowerCase();
  
  if (name.includes("aiasa") || name.includes("agricultural students")) return "AIASA";
  if (name.includes("raichur")) return "UAS Raichur";
  if (name.includes("ipb") || name.includes("pertanian bogor")) return "IPB University";
  if (name.includes("ministry of agriculture") || name.includes("farmers welfare")) return "MoA&FW, GoI";
  if (name.includes("irri") || name.includes("international rice research")) return "IRRI";
  if (name.includes("icar") || name.includes("iari") || name.includes("indian agricultural research")) return "ICAR-IARI";
  if (name.includes("sri sri") || name.includes("ssiast") || name.includes("art of living")) return "SSIAST";
  if (name.includes("centurion")) return "Centurion University";
  if (name.includes("saferock")) return "SafeRock®";
  if (name.includes("plant science today")) return "Plant Science Today";
  
  if (partner?.name && partner.name.length <= 30) return partner.name;
  return partner?.name ? partner.name.split('(')[0].trim() : "";
}

export const OrganizersHierarchy: React.FC<OrganizersHierarchyProps> = ({ partnersByCategory }) => {
  const jointlyOrganised = partnersByCategory["Jointly organised by"] || [];
  const supportedBy = partnersByCategory["Supported by"] || [];
  const knowledgePartner = partnersByCategory["Knowledge partner"] || [];
  const technicalPartners = partnersByCategory["Technical collaborating partners"] || partnersByCategory["In collaboration with"] || [];

  const hasAnyPartners = jointlyOrganised.length > 0 || supportedBy.length > 0 || knowledgePartner.length > 0 || technicalPartners.length > 0;
  if (!hasAnyPartners) return null;

  return (
    <section className="bg-[#FAF9F5] border-y border-[#E9E5D9] py-8 sm:py-12 md:py-14">
      <div className="container mx-auto max-w-4xl px-3 sm:px-6">
        
        {/* Tier 1: Jointly Organised by */}
        {jointlyOrganised.length > 0 && (
          <div className="mb-7 sm:mb-10">
            <TierDivider title="Jointly organised by" className="my-2.5 sm:my-4" />
            <div className="grid grid-cols-3 gap-2.5 sm:gap-6 md:gap-8 max-w-2xl mx-auto mt-3.5 sm:mt-6 items-start justify-items-center">
              {jointlyOrganised.map((partner: any) => {
                const shortName = getPartnerShortName(partner);
                return (
                  <a
                    key={partner.id}
                    href={partner.website || partner.url || '#'}
                    target={partner.website || partner.url ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    title={partner.name}
                    className="group flex flex-col items-center justify-start transition-all duration-300 transform hover:scale-105 text-center w-full"
                  >
                    {partner.logoUrl ? (
                      <div className="w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-white p-2 sm:p-3 md:p-3.5 shadow-xs border border-gray-200/80 flex items-center justify-center transition-all duration-300 group-hover:shadow-md group-hover:border-[#A88B38]/50 shrink-0">
                        <img
                          src={partner.logoUrl}
                          alt={partner.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    ) : (
                      <span className="text-[10px] sm:text-xs font-bold text-gray-700 text-center">{partner.name}</span>
                    )}
                    {shortName && (
                      <span className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs md:text-sm font-bold text-[#133826] text-center tracking-wide group-hover:text-[#A88B38] transition-colors duration-200 line-clamp-2">
                        {shortName}
                      </span>
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Tier 2: Supported by */}
        {supportedBy.length > 0 && (
          <div className="mb-7 sm:mb-10">
            <TierDivider title="Supported by" className="my-2.5 sm:my-4" />
            <div className="flex justify-center mt-3.5 sm:mt-6">
              {supportedBy.map((partner: any) => {
                const shortName = getPartnerShortName(partner);
                return (
                  <a
                    key={partner.id}
                    href={partner.website || partner.url || '#'}
                    target={partner.website || partner.url ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    title={partner.name}
                    className="group flex flex-col items-center justify-center w-full max-w-[190px] sm:max-w-[240px] md:max-w-[270px] transition-all duration-300 transform hover:scale-105 text-center"
                  >
                    {partner.logoUrl ? (
                      <div className="h-16 sm:h-20 md:h-24 w-full bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 shadow-xs border border-gray-200/80 flex items-center justify-center group-hover:shadow-md group-hover:border-[#A88B38]/50 transition-all duration-300">
                        <img
                          src={partner.logoUrl}
                          alt={partner.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    ) : (
                      <span className="text-[10px] sm:text-xs font-bold text-gray-700 text-center block">{partner.name}</span>
                    )}
                    {shortName && (
                      <span className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs md:text-sm font-bold text-[#133826] text-center tracking-wide group-hover:text-[#A88B38] transition-colors duration-200">
                        {shortName}
                      </span>
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Tier 3: Knowledge partner */}
        {knowledgePartner.length > 0 && (
          <div className="mb-7 sm:mb-10">
            <TierDivider title="Knowledge partner" className="my-2.5 sm:my-4" />
            <div className="grid grid-cols-3 gap-2 sm:gap-5 md:gap-7 max-w-3xl mx-auto mt-3.5 sm:mt-6 items-start">
              {knowledgePartner.map((partner: any) => {
                const shortName = getPartnerShortName(partner);
                return (
                  <a
                    key={partner.id}
                    href={partner.website || partner.url || '#'}
                    target={partner.website || partner.url ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    title={partner.name}
                    className="group flex flex-col items-center justify-start transition-all duration-300 transform hover:scale-105 text-center w-full"
                  >
                    {partner.logoUrl ? (
                      <div className="h-14 sm:h-20 md:h-24 w-full bg-white rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-3.5 shadow-xs border border-gray-200/80 flex items-center justify-center group-hover:shadow-md group-hover:border-[#A88B38]/50 transition-all duration-300 overflow-hidden shrink-0">
                        <img
                          src={partner.logoUrl}
                          alt={partner.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    ) : (
                      <span className="text-[10px] sm:text-xs font-bold text-gray-700 text-center block">{partner.name}</span>
                    )}
                    {shortName && (
                      <span className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs md:text-sm font-bold text-[#133826] text-center tracking-wide group-hover:text-[#A88B38] transition-colors duration-200 line-clamp-2 leading-tight">
                        {shortName}
                      </span>
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Tier 4: Technical collaborating partners */}
        {technicalPartners.length > 0 && (
          <div>
            <TierDivider title="Technical collaborating partners" className="my-2.5 sm:my-4" />
            <div className="grid grid-cols-3 gap-2 sm:gap-5 md:gap-7 max-w-3xl mx-auto mt-3.5 sm:mt-6 items-start">
              {technicalPartners.map((partner: any) => {
                const shortName = getPartnerShortName(partner);
                const isCenturion = partner.name?.toLowerCase().includes('centurion');
                return (
                  <a
                    key={partner.id}
                    href={partner.website || partner.url || '#'}
                    target={partner.website || partner.url ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    title={partner.name}
                    className="group flex flex-col items-center justify-start transition-all duration-300 transform hover:scale-105 text-center w-full"
                  >
                    {partner.logoUrl ? (
                      <div className="h-14 sm:h-20 md:h-24 w-full bg-white rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-3.5 shadow-xs border border-gray-200/80 flex items-center justify-center group-hover:shadow-md group-hover:border-[#A88B38]/50 transition-all duration-300 overflow-hidden shrink-0">
                        <img
                          src={partner.logoUrl}
                          alt={partner.name}
                          className={`max-h-full max-w-full object-contain ${isCenturion ? 'scale-110 sm:scale-120 transition-transform duration-300' : ''}`}
                        />
                      </div>
                    ) : (
                      <span className="text-[10px] sm:text-xs font-bold text-gray-700 text-center">{partner.name}</span>
                    )}
                    {shortName && (
                      <span className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs md:text-sm font-bold text-[#133826] text-center tracking-wide group-hover:text-[#A88B38] transition-colors duration-200 line-clamp-2 leading-tight">
                        {shortName}
                      </span>
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

