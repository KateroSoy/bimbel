import { useState, useEffect } from 'react';
import { X, Package, DollarSign, MapPin, Tag, FileText, Check } from 'lucide-react';
import { InventoryItem } from '../../store/useDataStore';

interface InventoryFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (itemData: Omit<InventoryItem, 'id' | 'totalValue'> & { totalValue?: number }) => void;
  initialData?: InventoryItem | null;
  isEditing?: boolean;
}

export function InventoryFormDialog({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing = false,
}: InventoryFormDialogProps) {
  const [itemCode, setItemCode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<
    'Modul & Buku' | 'Elektronik & Multimedia' | 'Fasilitas Studio Kelas' | 'Perlengkapan Belajar' | 'ATK & Operasional'
  >('Modul & Buku');
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState('Unit');
  const [location, setLocation] = useState('Studio Belajar 1 (Utama)');
  const [condition, setCondition] = useState<'Baik' | 'Perlu Perbaikan' | 'Rusak'>('Baik');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [pricePerUnit, setPricePerUnit] = useState<number>(100000);
  const [status, setStatus] = useState<'Tersedia' | 'Dipinjam' | 'Habis / Perlu Restock'>('Tersedia');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialData && isEditing) {
      setItemCode(initialData.itemCode);
      setName(initialData.name);
      setCategory(initialData.category);
      setQuantity(initialData.quantity);
      setUnit(initialData.unit);
      setLocation(initialData.location);
      setCondition(initialData.condition);
      setPurchaseDate(initialData.purchaseDate);
      setPricePerUnit(initialData.pricePerUnit);
      setStatus(initialData.status);
      setNotes(initialData.notes || '');
    } else {
      setItemCode(`INV-BMB-${Math.floor(100 + Math.random() * 900)}`);
      setName('');
      setCategory('Modul & Buku');
      setQuantity(10);
      setUnit('Buku');
      setLocation('Studio Belajar 1 (Utama)');
      setCondition('Baik');
      setPurchaseDate(new Date().toISOString().split('T')[0]);
      setPricePerUnit(125000);
      setStatus('Tersedia');
      setNotes('');
    }
  }, [initialData, isEditing, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const calculatedTotal = quantity * pricePerUnit;
    onSubmit({
      itemCode,
      name,
      category,
      quantity,
      unit,
      location,
      condition,
      purchaseDate,
      pricePerUnit,
      totalValue: calculatedTotal,
      status,
      notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5" /> Manajemen Aset Bimbel
          </span>
          <h3 className="font-bold text-xl text-slate-900 mt-1">
            {isEditing ? 'Perbarui Data Inventaris' : 'Tambah Aset & Inventaris Baru'}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Masukkan rincian barang, jumlah stok, lokasi studio, dan estimasi nilai aset lembaga.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Kode Barang *
              </label>
              <input
                type="text"
                required
                value={itemCode}
                onChange={(e) => setItemCode(e.target.value)}
                placeholder="INV-001"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 font-bold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Kategori Aset *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Modul & Buku">Modul & Buku Cetak</option>
                <option value="Elektronik & Multimedia">Elektronik & Multimedia</option>
                <option value="Fasilitas Studio Kelas">Fasilitas Studio Kelas</option>
                <option value="Perlengkapan Belajar">Perlengkapan Belajar & Merch</option>
                <option value="ATK & Operasional">ATK & Operasional</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Nama Barang / Modul *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Modul Cetak Intensif SNBT TPS 2024"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Jumlah / Stok *
              </label>
              <input
                type="number"
                min="0"
                required
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Satuan *
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Buku">Buku</option>
                <option value="Unit">Unit</option>
                <option value="Set">Set</option>
                <option value="Pcs">Pcs</option>
                <option value="Rim">Rim</option>
                <option value="Paket">Paket</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Harga per Unit (Rp) *
              </label>
              <input
                type="number"
                min="0"
                required
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Lokasi / Ruangan Studio *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Contoh: Studio Belajar 1 & 2"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Kondisi Barang *
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Baik">Baik (100% Siap Pakai)</option>
                <option value="Perlu Perbaikan">Perlu Perbaikan / Servis</option>
                <option value="Rusak">Rusak / Tidak Layak</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Status Ketersediaan
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Tersedia">Tersedia di Bimbel</option>
                <option value="Dipinjam">Dipinjam / Digunakan Sesi Luar</option>
                <option value="Habis / Perlu Restock">Habis / Perlu Restock</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Tanggal Pengadaan / Beli
              </label>
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Catatan Tambahan
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Catatan spesifikasi teknis, garansi, atau nomor seri..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Value Preview Banner */}
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 flex items-center justify-between text-xs">
            <span className="text-blue-700 font-medium">Estimasi Total Valuasi Aset:</span>
            <strong className="text-blue-900 font-mono font-bold text-sm">
              Rp {(quantity * pricePerUnit).toLocaleString('id-ID')}
            </strong>
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-blue-600/30 flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              {isEditing ? 'Simpan Perubahan' : 'Tambahkan ke Inventaris'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
