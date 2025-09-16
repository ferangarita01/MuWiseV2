

interface LegalTermsProps {
  agreement?: any; // Consider creating a specific type for this
}

export function LegalTerms({ agreement }: LegalTermsProps) {
    return (
      <div className="max-w-none text-slate-700 mt-8 text-sm leading-relaxed">
        <h2 className="text-base font-semibold uppercase text-slate-900 tracking-wider mb-3">
            TERMS AND CONDITIONS
        </h2>
        <ol className="list-decimal list-inside space-y-3">
            <li>
                <strong>OWNERSHIP:</strong> The percentage splits indicated above represent each writer's 
                ownership interest in both the musical composition and lyrics.
            </li>
            <li>
                <strong>PUBLISHING:</strong> Each writer retains the right to designate their own music 
                publisher for their respective share.
            </li>
            <li>
                <strong>MECHANICAL RIGHTS:</strong> All mechanical royalties shall be distributed according 
                to the percentages specified above.
            </li>
            <li>
                <strong>PERFORMANCE RIGHTS:</strong> Each writer shall register their share with their 
                respective Performing Rights Organization (PRO).
            </li>
             <li>
                <strong>MODIFICATIONS:</strong> This agreement can only be modified in writing with 
                signatures from all parties.
            </li>
        </ol>
      </div>
    );
  }
