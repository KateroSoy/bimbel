import { useState, useMemo } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { motion, AnimatePresence } from 'motion/react';
import {
  Package,
  Plus,
  Search,
  Filter,
  Download,
  Printer,
  Edit,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Building2,
  DollarSign,
  Layers,
  Sparkles,
  Eye,
  X,
  BookOpen,
  Tv,
  Armchair,
  FileSpreadsheet
} from 'lucide-react';
import { useDataStore, InventoryItem } from '../../store/useDataStore';
import { InventoryFormDialog } from '../../components/common/InventoryFormDialog';
import { toast } from 'sonner';

export default function InventarisBimbel() {
  const { inventoryItems, addInventoryItem, updateInventoryItem, deleteInventoryItem, schoolSettings } = useDataStore();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  // Print Report Modal
  const [printModalOpen, setPrintModalOpen] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [conditionFilter, setConditionFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');

  // Metrics Calculation
  const metrics = useMemo(() => {
    const totalItemsCount = inventoryItems.length;
    const totalPhysicalUnits = inventoryItems.reduce((acc, i) => acc + i.quantity, 0);
    const totalValuation = inventoryItems.reduce((acc, i) => acc + (i.totalValue || i.quantity * i.pricePerUnit), 0);
    const goodCount = inventoryItems.filter((i) => i.condition === 'Baik').length;
    const repairCount = inventoryItems.filter((i) => i.condition === 'Perlu Perbaikan').length;
    const damagedCount = inventoryItems.filter((i) => i.condition === 'Rusak').length;
    const goodRate = totalItemsCount > 0 ? Math.round((goodCount / totalItemsCount) * 100) : 100;

    return { totalItemsCount, totalPhysicalUnits, totalValuation, goodCount, repairCount, damagedCount, goodRate };
  }, [inventoryItems]);

  // Unique locations for filter
  const locations = useMemo(() => {
    const set = new Set<string>();
    inventoryItems.forEach((i) => {
      if (i.location) set.add(i.location);
    });
    return Array.from(set);
  }, [inventoryItems]);

  // Filtered List
  const filteredItems = useMemo(() => {
    return inventoryItems.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.itemCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = categoryFilter === 'all' || item.category === categoryFilter;
      const matchCond = conditionFilter === 'all' || item.condition === conditionFilter;
      const matchLoc = locationFilter === 'all' || item.location === locationFilter;

      return matchSearch && matchCat && matchCond && matchLoc;
    });
  }, [inventoryItems, searchQuery, categoryFilter, conditionFilter, locationFilter]);

  const handleOpenAdd = () => {
    setSelectedItem(null);
    setIsEditing(false);
    setDialogOpen(true);
  };

  const handleOpenEdit = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Hapus data aset "${name}" dari sistem inventaris?`)) {
      deleteInventoryItem(id);
      toast.success(`Aset "${name}" berhasil dihapus dari inventaris.`);
    }
  };

  const handleFormSubmit = (data: any) => {
    if (isEditing && selectedItem) {
      updateInventoryItem(selectedItem.id, data);
      toast.success(`Aset "${data.name}" berhasil diperbarui.`);
    } else {
      addInventoryItem(data);
      toast.success(`Aset baru "${data.name}" berhasil ditambahkan.`);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-lg bg-blue-100 text-blue-800 font-bold text-xs flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5" /> Manajemen Sarana & Prasarana Bimbel
              </span>
              <span className="text-xs text-slate-500 font-medium">Pelacakan Aset & Modul Belajar</span>
            </div>
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-1">
              Inventaris & Aset Fasilitas Bimbel
            </h2>
            <p className="text-slate-500 text-sm">
              Kelola stok modul cetak, proyektor studio, fasilitas kelas, dan sarana multimedia penunjang bimbingan belajar.
            </p>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setPrintModalOpen(true)}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors flex items-center gap-2"
            >
              <Printer className="w-4 h-4 text-blue-600" />
              Cetak Rekap Aset
            </button>

            <button
              onClick={handleOpenAdd}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-blue-600/30 active:scale-95 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Tambah Aset Baru
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Total Jenis Aset</span>
              <Package className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-3xl font-bold font-display text-slate-900">{metrics.totalItemsCount}</p>
            <span className="text-xs text-slate-500 font-medium">
              Total <strong>{metrics.totalPhysicalUnits}</strong> unit/buku fisik
            </span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Total Nilai Valuasi</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-display text-emerald-600">
              Rp {metrics.totalValuation.toLocaleString('id-ID')}
            </p>
            <span className="text-xs text-emerald-700 font-medium">Estimasi aset modal bimbel</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Kondisi Baik</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-3xl font-bold font-display text-slate-900">{metrics.goodRate}%</p>
            <span className="text-xs text-emerald-600 font-medium">
              {metrics.goodCount} dari {metrics.totalItemsCount} barang siap pakai
            </span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Perlu Servis / Rusak</span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-3xl font-bold font-display text-amber-600">
              {metrics.repairCount + metrics.damagedCount}
            </p>
            <span className="text-xs text-amber-700 font-medium">
              {metrics.repairCount} perlu servis • {metrics.damagedCount} rusak
            </span>
          </div>
        </div>

        {/* Main Table Card */}
        <div className="glass rounded-3xl border border-white/40 shadow-sm bg-white overflow-hidden space-y-0">
          
          {/* Filters & Search Toolbar */}
          <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama, kode, lokasi aset..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none"
              >
                <option value="all">Semua Kategori</option>
                <option value="Modul & Buku">Modul & Buku Cetak</option>
                <option value="Elektronik & Multimedia">Elektronik & Multimedia</option>
                <option value="Fasilitas Studio Kelas">Fasilitas Studio Kelas</option>
                <option value="Perlengkapan Belajar">Perlengkapan Belajar & Merch</option>
                <option value="ATK & Operasional">ATK & Operasional</option>
              </select>

              {/* Condition Filter */}
              <select
                value={conditionFilter}
                onChange={(e) => setConditionFilter(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none"
              >
                <option value="all">Semua Kondisi</option>
                <option value="Baik">Kondisi Baik</option>
                <option value="Perlu Perbaikan">Perlu Perbaikan</option>
                <option value="Rusak">Rusak</option>
              </select>
            </div>

            <span className="text-xs font-bold text-slate-500 shrink-0">
              Menampilkan {filteredItems.length} dari {inventoryItems.length} Aset
            </span>
          </div>

          {/* Table View */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-5">Kode & Nama Aset</th>
                  <th className="py-3.5 px-4">Kategori</th>
                  <th className="py-3.5 px-4">Lokasi Studio</th>
                  <th className="py-3.5 px-4 text-center">Stok</th>
                  <th className="py-3.5 px-4">Kondisi</th>
                  <th className="py-3.5 px-4 text-right">Nilai Total (Rp)</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    
                    {/* Item Code & Name */}
                    <td className="py-4 px-5">
                      <p className="font-bold text-slate-900 text-xs">{item.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                          {item.itemCode}
                        </span>
                        {item.notes && (
                          <span className="text-[10px] text-slate-400 line-clamp-1 max-w-[200px]">
                            {item.notes}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-800 font-semibold rounded-lg text-[11px] whitespace-nowrap">
                        {item.category}
                      </span>
                    </td>

                    {/* Location */}
                    <td className="py-4 px-4 text-slate-600 whitespace-nowrap">
                      <span className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {item.location}
                      </span>
                    </td>

                    {/* Quantity */}
                    <td className="py-4 px-4 text-center">
                      <span className="font-bold text-slate-900 text-sm">{item.quantity}</span>
                      <span className="text-[10px] text-slate-400 ml-1">{item.unit}</span>
                    </td>

                    {/* Condition Badge */}
                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] inline-flex items-center gap-1 ${
                          item.condition === 'Baik'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.condition === 'Perlu Perbaikan'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {item.condition === 'Baik' && <CheckCircle2 className="w-3 h-3" />}
                        {item.condition === 'Perlu Perbaikan' && <AlertTriangle className="w-3 h-3" />}
                        {item.condition === 'Rusak' && <XCircle className="w-3 h-3" />}
                        {item.condition}
                      </span>
                    </td>

                    {/* Valuation */}
                    <td className="py-4 px-4 text-right font-mono font-bold text-slate-900">
                      Rp {(item.totalValue || item.quantity * item.pricePerUnit).toLocaleString('id-ID')}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-lg font-bold text-[10px] ${
                          item.status === 'Tersedia'
                            ? 'bg-slate-100 text-slate-700'
                            : item.status === 'Dipinjam'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Aset"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Hapus Aset"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}

                {filteredItems.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400 text-sm">
                      Tidak ditemukan aset inventaris yang cocok dengan filter atau pencarian Anda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Bottom Summary Bar */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-2">
            <span>Total <strong>{inventoryItems.length}</strong> jenis aset terdaftar di sistem lembaga</span>
            <span className="font-semibold text-slate-800">
              Total Valuasi: Rp {metrics.totalValuation.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

      </div>

      {/* Form Dialog for Add / Edit */}
      <InventoryFormDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedItem}
        isEditing={isEditing}
      />

      {/* Official Print Report Modal */}
      {printModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl relative">
            <button
              onClick={() => setPrintModalOpen(false)}
              className="absolute right-5 top-5 p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Official Report Preview */}
            <div className="border border-slate-200 p-6 rounded-2xl space-y-5 bg-white text-slate-900" id="print-area">
              
              {/* Kop Lembaga Bimbel */}
              <div className="flex items-center gap-4 border-b-2 border-slate-900 pb-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-2xl shrink-0">
                  BV
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg uppercase tracking-tight">{schoolSettings.schoolName}</h3>
                  <p className="text-xs text-slate-600">{schoolSettings.address}</p>
                  <p className="text-[11px] text-slate-500">
                    Telp: {schoolSettings.phone} • Email: {schoolSettings.email} • Web: {schoolSettings.website}
                  </p>
                </div>
              </div>

              {/* Document Title */}
              <div className="text-center pt-2">
                <h4 className="font-bold text-base underline uppercase tracking-wide">
                  BERITA ACARA REKAPITULASI ASET & INVENTARIS LEMBAGA
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Nomor Dokumen: INV-BA/{new Date().getFullYear()}/{(new Date().getMonth() + 1).toString().padStart(2, '0')}/088
                </p>
              </div>

              {/* Summary Text */}
              <div className="text-xs text-slate-700 leading-relaxed">
                Telah dilakukan audit dan inventarisasi berkala atas seluruh sarana, prasarana, modul pembelajaran, dan aset multimedia milik lembaga bimbingan belajar dengan rincian sebagai berikut:
              </div>

              {/* Table */}
              <table className="w-full text-left text-[11px] border border-slate-300">
                <thead className="bg-slate-100 text-slate-900 font-bold border-b border-slate-300">
                  <tr>
                    <th className="p-2 border-r border-slate-300">No</th>
                    <th className="p-2 border-r border-slate-300">Kode</th>
                    <th className="p-2 border-r border-slate-300">Nama Barang / Aset</th>
                    <th className="p-2 border-r border-slate-300">Lokasi</th>
                    <th className="p-2 border-r border-slate-300 text-center">Jml</th>
                    <th className="p-2 border-r border-slate-300">Kondisi</th>
                    <th className="p-2 text-right">Valuasi (Rp)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {inventoryItems.map((it, idx) => (
                    <tr key={it.id}>
                      <td className="p-2 border-r border-slate-200 font-mono text-center">{idx + 1}</td>
                      <td className="p-2 border-r border-slate-200 font-mono">{it.itemCode}</td>
                      <td className="p-2 border-r border-slate-200 font-semibold">{it.name}</td>
                      <td className="p-2 border-r border-slate-200">{it.location}</td>
                      <td className="p-2 border-r border-slate-200 text-center font-bold">
                        {it.quantity} {it.unit}
                      </td>
                      <td className="p-2 border-r border-slate-200">{it.condition}</td>
                      <td className="p-2 text-right font-mono">
                        {(it.totalValue || it.quantity * it.pricePerUnit).toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-100 font-bold">
                    <td colSpan={6} className="p-2 text-right border-r border-slate-300">
                      TOTAL VALUASI ASET KESELURUHAN:
                    </td>
                    <td className="p-2 text-right font-mono">
                      Rp {metrics.totalValuation.toLocaleString('id-ID')}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Signatures */}
              <div className="pt-6 grid grid-cols-2 text-center text-xs text-slate-800">
                <div className="space-y-16">
                  <p>Penanggung Jawab Inventaris,</p>
                  <p className="font-bold underline">Hendra Pratama, S.Kom</p>
                </div>
                <div className="space-y-16">
                  <p>Direktur Lembaga Bimbel,</p>
                  <p className="font-bold underline">{schoolSettings.principalName}</p>
                </div>
              </div>

            </div>

            {/* Actions */}
            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={() => setPrintModalOpen(false)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  toast.success('Mencetak rekapitulasi inventaris bimbel...');
                  window.print();
                }}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-blue-600/30"
              >
                <Printer className="w-4 h-4" />
                Cetak / Simpan PDF
              </button>
            </div>

          </div>
        </div>
      )}

    </DashboardLayout>
  );
}
