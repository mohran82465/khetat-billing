import React from 'react';
import {
  X,
  ShieldCheck,
  Building,
  Key,
  Calendar,
  CheckCircle2,
  Mail,
  Phone,
  FileText,
  Lock,
  ExternalLink,
} from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  isArabic: boolean;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  isArabic,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Banner with gradient */}
        <div className="relative h-28 bg-linear-to-r from-[#004a60] to-[#09637f] p-4 flex items-end justify-between">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Profile Info Overlay */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 mb-4 gap-4">
            <div className="flex items-end gap-3.5">
              <div className="h-20 w-20 rounded-2xl bg-[#004a60] ring-4 ring-white flex items-center justify-center text-white text-2xl font-bold shadow-md">
                TM
              </div>
              <div className="pt-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-[#161c27]">Eng. Tariq Al-Mansoor</h2>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    Active CSID
                  </span>
                </div>
                <div className="text-xs text-[#70787d]">
                  Lead Billing Architect & Authorized Signatory
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => alert('Certificate renewed with ZATCA Portal')}
                className="rounded-lg bg-[#004a60] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#074e64]"
              >
                Renew CSID Key
              </button>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mt-6">
            {/* Entity Information */}
            <div className="rounded-xl border border-[#e3e8f9] p-3.5 space-y-2 bg-[#f9f9ff]">
              <div className="flex items-center gap-1.5 font-bold text-[#161c27]">
                <Building className="h-4 w-4 text-[#004a60]" />
                <span>Enterprise Tenant Details</span>
              </div>
              <div className="space-y-1 text-[#40484d] text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[#70787d]">Organization:</span>
                  <span className="font-semibold text-[#161c27]">Acme Corp Ltd (KSA)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#70787d]">Commercial Registration:</span>
                  <span className="font-mono text-[#161c27]">1010144928</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#70787d]">ZATCA TRN:</span>
                  <span className="font-mono font-bold text-[#004a60]">310144928100003</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#70787d]">Region:</span>
                  <span className="text-[#161c27]">Riyadh Head Office, Kingdom of Saudi Arabia</span>
                </div>
              </div>
            </div>

            {/* Cryptographic & Compliance Setup */}
            <div className="rounded-xl border border-[#e3e8f9] p-3.5 space-y-2 bg-[#f9f9ff]">
              <div className="flex items-center gap-1.5 font-bold text-[#161c27]">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>ZATCA Phase 2 Cryptographic CSID</span>
              </div>
              <div className="space-y-1 text-[#40484d] text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[#70787d]">Production CSID:</span>
                  <span className="font-mono text-emerald-700 font-bold">#8829-ZTC-PROD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#70787d]">Key Hardware HSM:</span>
                  <span className="text-[#161c27]">AWS CloudHSM (Bahrain Cluster)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#70787d]">Signatory Authority:</span>
                  <span className="text-[#161c27]">Saudi Chamber of Commerce</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#70787d]">Certificate Expiry:</span>
                  <span className="font-mono text-[#161c27]">14 December 2026</span>
                </div>
              </div>
            </div>
          </div>

          {/* Audit Logs */}
          <div className="mt-5">
            <div className="text-xs font-bold text-[#161c27] mb-2">Recent Security & Clearance Audits</div>
            <div className="rounded-xl border border-[#e3e8f9] divide-y divide-[#f1f3ff] text-[11px]">
              <div className="p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>ZATCA cleared invoice INV-2024-3382 (SAR 212,750)</span>
                </div>
                <span className="text-[#70787d] font-mono">Today 14:10</span>
              </div>
              <div className="p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Matched bank receipt RCT-2024-0519 via SARIE link</span>
                </div>
                <span className="text-[#70787d] font-mono">Yesterday 16:45</span>
              </div>
              <div className="p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5 text-[#004a60]" />
                  <span>2FA Authentication verified through Nafath e-ID</span>
                </div>
                <span className="text-[#70787d] font-mono">2 days ago</span>
              </div>
            </div>
          </div>

          {/* Close button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="rounded-lg bg-[#004a60] px-5 py-2 text-xs font-semibold text-white hover:bg-[#074e64]"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
