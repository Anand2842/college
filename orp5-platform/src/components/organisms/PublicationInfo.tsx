import { BookOpen, CheckCircle2 } from 'lucide-react';

export function PublicationInfo() {
  return (
    <section className="py-20 bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          
          {/* Left Column */}
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-charcoal mb-6">
              Publication Opportunity
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Share your findings with a global audience. All accepted abstracts will be published in the official <span className="font-semibold text-charcoal">Souvenir & Abstract Book</span>.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Furthermore, full-length papers will be considered for publication in a Special Issue of <span className="font-semibold text-earth-green">Plant Science Today</span> after a rigorous peer-review process.
            </p>
            
            <ul className="space-y-3 mt-8">
              <li className="flex items-center gap-3 text-gray-700 font-medium">
                <CheckCircle2 size={20} className="text-rice-gold" />
                Scopus Indexed Journal
              </li>
              <li className="flex items-center gap-3 text-gray-700 font-medium">
                <CheckCircle2 size={20} className="text-rice-gold" />
                UGC-CARE Listed
              </li>
              <li className="flex items-center gap-3 text-gray-700 font-medium">
                <CheckCircle2 size={20} className="text-rice-gold" />
                DOI Assigned for all published papers
              </li>
            </ul>
          </div>

          {/* Right Column */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5">
              <BookOpen size={120} />
            </div>
            
            <div className="relative z-10">
              <div className="w-14 h-14 bg-earth-green/10 rounded-xl flex items-center justify-center mb-6">
                <BookOpen size={28} className="text-earth-green" />
              </div>
              
              <h3 className="text-sm uppercase tracking-widest text-gray-400 font-bold mb-2">Target Journal</h3>
              <p className="text-2xl font-serif font-bold text-charcoal mb-8">Plant Science Today</p>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <span className="text-gray-500">Publisher</span>
                  <span className="font-medium text-charcoal text-right">Horizon e-Publishing Group</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <span className="text-gray-500">Indexing</span>
                  <span className="font-medium text-charcoal text-right">Scopus, Web of Science, UGC-CARE</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <span className="text-gray-500">Article Processing Charge</span>
                  <span className="font-medium text-charcoal text-right">₹16,000 / paper</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
