import React from 'react';

interface OrganizersHierarchyProps {
  partnersByCategory: Record<string, any[]>;
}

export const OrganizersHierarchy: React.FC<OrganizersHierarchyProps> = ({ partnersByCategory }) => {
  const hierarchyTiers: { key: string; label: string; size: 'lg' | 'md' | 'sm' }[] = [
    { key: "Jointly organised by", label: "Jointly organised by", size: 'lg' },
    { key: "Supported by", label: "Supported by", size: 'md' },
    { key: "In collaboration with", label: "In collaboration with", size: 'sm' },
  ];

  const hasPartners = hierarchyTiers.some(t => partnersByCategory[t.key] && partnersByCategory[t.key].length > 0);
  if (!hasPartners) return null;

  // Size config: Standard international conference sizing. Subtle differences between tiers.
  const sizeMap = {
    lg: 'h-16 md:h-24 max-w-[110px] md:max-w-[180px]',
    md: 'h-14 md:h-20 max-w-[100px] md:max-w-[160px]',
    sm: 'h-12 md:h-16 max-w-[85px] md:max-w-[140px]',
  };

  return (
    <section className="bg-white border-b border-gray-100 py-4 md:py-6">
      <div className="container mx-auto max-w-6xl">
        {hierarchyTiers.map((tier, tierIdx) => {
          const partners = partnersByCategory[tier.key];
          if (!partners || partners.length === 0) return null;

          const isFirst = tierIdx === 0;
          const isLowerTier = tierIdx > 0;

          return (
            <div
              key={tier.key}
              className={`flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 px-6 py-6 md:py-8 ${
                !isFirst ? 'border-t border-gray-50' : ''
              }`}
            >
              {/* Label */}
              <div className="flex items-center w-full md:w-auto gap-4 shrink-0">
                <div className="flex-1 md:w-16 md:flex-none h-px bg-gray-200" />
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-gray-500 whitespace-nowrap">
                  {tier.label}
                </span>
                <div className="flex-1 md:w-16 md:flex-none h-px bg-gray-200" />
                {/* Vertical separator (Desktop only) */}
                <div className="hidden md:block w-px h-12 bg-gray-200 ml-4" />
              </div>

              {/* Logos */}
              <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
                {partners.map((partner: any) => (
                  <a
                    key={partner.id}
                    href={partner.url || '#'}
                    target={partner.url ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    title={partner.name}
                    className="group flex items-center justify-center p-2 transition-all duration-300 transform hover:scale-105"
                  >
                    {partner.logoUrl ? (
                      <img
                        src={partner.logoUrl}
                        alt={partner.name}
                        className={`${sizeMap[tier.size]} w-auto object-contain mix-blend-multiply opacity-90 group-hover:opacity-100 transition-all duration-500`}
                      />
                    ) : (
                      <div className={`${sizeMap[tier.size]} flex items-center px-2`}>
                        <span className="text-xs font-semibold text-gray-400">{partner.name}</span>
                      </div>
                    )}
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
