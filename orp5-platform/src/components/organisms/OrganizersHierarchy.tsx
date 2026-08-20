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

export const OrganizersHierarchy: React.FC<OrganizersHierarchyProps> = ({ partnersByCategory }) => {
  const jointlyOrganised = partnersByCategory["Jointly organised by"] || [];
  const supportedBy = partnersByCategory["Supported by"] || [];
  const knowledgePartner = partnersByCategory["Knowledge partner"] || [];
  const technicalPartners = partnersByCategory["Technical collaborating partners"] || partnersByCategory["In collaboration with"] || [];

  const hasAnyPartners = jointlyOrganised.length > 0 || supportedBy.length > 0 || knowledgePartner.length > 0 || technicalPartners.length > 0;
  if (!hasAnyPartners) return null;

  return (
    <section className="bg-[#FAF9F5] border-y border-[#E9E5D9] py-10 sm:py-14 md:py-16">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6">
        
        {/* Tier 1: Jointly Organised by */}
        {jointlyOrganised.length > 0 && (
          <div className="mb-12 sm:mb-16">
            <TierDivider title="Jointly organised by" />
            <div className="grid grid-cols-3 gap-4 sm:gap-8 md:gap-12 max-w-3xl mx-auto mt-6 sm:mt-8 items-center justify-items-center">
              {jointlyOrganised.map((partner: any) => (
                <a
                  key={partner.id}
                  href={partner.website || partner.url || '#'}
                  target={partner.website || partner.url ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  title={partner.name}
                  className="group flex flex-col items-center justify-center transition-all duration-300 transform hover:scale-105"
                >
                  {partner.logoUrl ? (
                    <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full bg-white p-3 sm:p-4 shadow-sm border border-gray-200/80 flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:border-[#A88B38]/50">
                      <img
                        src={partner.logoUrl}
                        alt={partner.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  ) : (
                    <span className="text-xs sm:text-sm font-bold text-gray-700 text-center">{partner.name}</span>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Tier 2: Supported by & Knowledge partner (Side-by-side) */}
        {(supportedBy.length > 0 || knowledgePartner.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 mb-12 sm:mb-16 max-w-4xl mx-auto">
            
            {/* Left: Supported by */}
            {supportedBy.length > 0 && (
              <div className="flex flex-col items-center">
                <TierDivider title="Supported by" className="w-full" />
                <div className="w-full flex justify-center mt-4 sm:mt-6">
                  {supportedBy.map((partner: any) => (
                    <a
                      key={partner.id}
                      href={partner.website || partner.url || '#'}
                      target={partner.website || partner.url ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                      title={partner.name}
                      className="group w-full max-w-[320px] transition-all duration-300 transform hover:scale-105"
                    >
                      {partner.logoUrl ? (
                        <div className="h-28 sm:h-32 md:h-36 w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-200/80 flex items-center justify-center group-hover:shadow-lg group-hover:border-[#A88B38]/50 transition-all duration-300">
                          <img
                            src={partner.logoUrl}
                            alt={partner.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      ) : (
                        <span className="text-xs sm:text-sm font-bold text-gray-700 text-center block">{partner.name}</span>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Right: Knowledge partner */}
            {knowledgePartner.length > 0 && (
              <div className="flex flex-col items-center">
                <TierDivider title="Knowledge partner" className="w-full" />
                <div className="w-full flex justify-center mt-4 sm:mt-6">
                  {knowledgePartner.map((partner: any) => (
                    <a
                      key={partner.id}
                      href={partner.website || partner.url || '#'}
                      target={partner.website || partner.url ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                      title={partner.name}
                      className="group w-full max-w-[320px] transition-all duration-300 transform hover:scale-105"
                    >
                      {partner.logoUrl ? (
                        <div className="h-28 sm:h-32 md:h-36 w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-200/80 flex items-center justify-center group-hover:shadow-lg group-hover:border-[#A88B38]/50 transition-all duration-300">
                          <img
                            src={partner.logoUrl}
                            alt={partner.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      ) : (
                        <span className="text-xs sm:text-sm font-bold text-gray-700 text-center block">{partner.name}</span>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* Tier 3: Technical collaborating partners */}
        {technicalPartners.length > 0 && (
          <div>
            <TierDivider title="Technical collaborating partners" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto mt-6 sm:mt-8 items-stretch">
              {technicalPartners.map((partner: any) => {
                const isCenturion = partner.name?.toLowerCase().includes('centurion');
                return (
                  <a
                    key={partner.id}
                    href={partner.website || partner.url || '#'}
                    target={partner.website || partner.url ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    title={partner.name}
                    className="group flex flex-col items-center justify-center transition-all duration-300 transform hover:scale-105"
                  >
                    {partner.logoUrl ? (
                      <div className="h-28 sm:h-32 md:h-36 w-full bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-gray-200/80 flex items-center justify-center group-hover:shadow-lg group-hover:border-[#A88B38]/50 transition-all duration-300 overflow-hidden">
                        <img
                          src={partner.logoUrl}
                          alt={partner.name}
                          className={`max-h-full max-w-full object-contain ${isCenturion ? 'scale-115 sm:scale-125 transition-transform duration-300' : ''}`}
                        />
                      </div>
                    ) : (
                      <span className="text-xs sm:text-sm font-bold text-gray-700 text-center">{partner.name}</span>
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
