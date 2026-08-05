import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface DetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  data: Record<string, any> | null;
}

export function DetailsDialog({ isOpen, onClose, title, description, data }: DetailsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden bg-white border-none rounded-3xl shadow-2xl">
        <DialogHeader className="p-6 pb-2 border-b border-slate-100">
          <DialogTitle className="text-xl font-bold text-slate-900">{title}</DialogTitle>
          {description && <DialogDescription className="text-slate-500">{description}</DialogDescription>}
        </DialogHeader>
        
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {data ? (
            <div className="space-y-4">
              {Object.entries(data).map(([key, value]) => (
                <div key={key} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-3 border-b border-slate-50 last:border-0">
                  <span className="text-sm font-medium text-slate-500 sm:w-1/3 shrink-0 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="text-sm font-semibold text-slate-900 sm:w-2/3 break-words">
                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-slate-500 py-8">Tidak ada data untuk ditampilkan</div>
          )}
        </div>
        
        <div className="p-6 pt-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
          >
            Tutup
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
