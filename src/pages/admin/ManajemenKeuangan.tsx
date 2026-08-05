import { useState, useEffect } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { motion } from "motion/react";
import {
  Landmark,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Download,
  Plus,
  CreditCard,
  Receipt,
  TrendingUp,
  Edit,
  Trash2,
} from "lucide-react";
import { SkeletonMetric, SkeletonTable } from "../../components/ui/Skeleton";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { useDataStore, Transaction } from "../../store/useDataStore";
import { TransactionFormDialog } from "../../components/common/TransactionFormDialog";
import { toast } from "sonner";

const financialData = [
  { month: "Jan", income: 45000000, expense: 32000000 },
  { month: "Feb", income: 52000000, expense: 28000000 },
  { month: "Mar", income: 85000000, expense: 32500000 },
  { month: "Apr", income: 65000000, expense: 41000000 },
  { month: "Mei", income: 58000000, expense: 36000000 },
  { month: "Jun", income: 72000000, expense: 29000000 },
];

export default function ManajemenKeuangan() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useDataStore();
  const [formOpen, setFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const totalIncome = transactions
    .filter((t) => t.type === "income" && t.status === "Success")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense" && t.status === "Success")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netBalance = totalIncome - totalExpense;

  const handleAdd = () => {
    setIsEditing(false);
    setSelectedTransaction(null);
    setFormOpen(true);
  };

  const handleEdit = (trx: Transaction) => {
    setIsEditing(true);
    setSelectedTransaction(trx);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
      deleteTransaction(id);
      toast.success("Transaksi berhasil dihapus");
    }
  };

  const handleSubmit = (data: Omit<Transaction, "id">) => {
    if (isEditing && selectedTransaction) {
      updateTransaction(selectedTransaction.id, data);
      toast.success("Transaksi berhasil diperbarui");
    } else {
      addTransaction(data);
      toast.success("Transaksi baru berhasil dicatat");
    }
  };

  const handleExport = () => {
    toast.success("Laporan Keuangan berhasil diekspor (Excel/PDF)");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const filteredTransactions = transactions.filter((trx) => {
    const matchQuery =
      trx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trx.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = typeFilter === "all" || trx.type === typeFilter;
    return matchQuery && matchType;
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-100">
          <p className="font-bold text-slate-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 mb-1">
              <span className="text-sm font-medium" style={{ color: entry.color }}>
                {entry.name === "income" ? "Pemasukan" : "Pengeluaran"}
              </span>
              <span className="font-bold text-slate-900">
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">
              Manajemen Keuangan
            </h2>
            <p className="text-slate-500">
              Kelola arus kas, pembayaran SPP, dan pengeluaran sekolah dengan transparan.
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleExport}
              className="bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4" />
              Unduh Rekap
            </button>
            <button
              onClick={handleAdd}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md shadow-blue-600/20"
            >
              <Plus className="w-5 h-5" />
              Transaksi Baru
            </button>
          </div>
        </div>

        {/* Dynamic Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading ? (
            <>
              <SkeletonMetric />
              <SkeletonMetric />
              <SkeletonMetric />
            </>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-6 rounded-3xl border border-white/40 shadow-sm relative overflow-hidden group hover:shadow-md transition-all"
              >
                <div className="absolute -right-4 -top-4 text-emerald-500/10 group-hover:scale-110 transition-transform duration-500">
                  <Landmark className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <Landmark className="w-6 h-6 text-emerald-600" />
                    </div>
                    <span className="text-slate-500 font-bold">Total Saldo Kas</span>
                  </div>
                  <div className="text-3xl lg:text-4xl font-display font-bold text-slate-900 mb-3 tracking-tight">
                    {formatCurrency(netBalance)}
                  </div>
                  <div className="text-sm font-bold text-emerald-600 flex items-center gap-1.5 bg-emerald-50 w-fit px-3 py-1 rounded-lg">
                    <TrendingUp className="w-4 h-4" /> Arus Kas Surplus
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass p-6 rounded-3xl border border-white/40 shadow-sm relative overflow-hidden group hover:shadow-md transition-all"
              >
                <div className="absolute -right-4 -top-4 text-blue-500/10 group-hover:scale-110 transition-transform duration-500">
                  <CreditCard className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                      <ArrowUpRight className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-slate-500 font-bold">Total Pemasukan</span>
                  </div>
                  <div className="text-3xl lg:text-4xl font-display font-bold text-slate-900 mb-3 tracking-tight">
                    {formatCurrency(totalIncome)}
                  </div>
                  <div className="text-sm font-bold text-blue-600 flex items-center gap-1.5 bg-blue-50 w-fit px-3 py-1 rounded-lg">
                    <TrendingUp className="w-4 h-4" /> SPP & Dana BOS
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass p-6 rounded-3xl border border-white/40 shadow-sm relative overflow-hidden group hover:shadow-md transition-all"
              >
                <div className="absolute -right-4 -top-4 text-rose-500/10 group-hover:scale-110 transition-transform duration-500">
                  <Receipt className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center">
                      <ArrowDownRight className="w-6 h-6 text-rose-600" />
                    </div>
                    <span className="text-slate-500 font-bold">Total Pengeluaran</span>
                  </div>
                  <div className="text-3xl lg:text-4xl font-display font-bold text-slate-900 mb-3 tracking-tight">
                    {formatCurrency(totalExpense)}
                  </div>
                  <div className="text-sm font-bold text-rose-600 flex items-center gap-1.5 bg-rose-50 w-fit px-3 py-1 rounded-lg">
                    <TrendingUp className="w-4 h-4" /> Operasional & Honor
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </div>

        {/* Financial Chart */}
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass p-8 rounded-3xl border border-white/40 shadow-sm"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-display font-bold text-xl text-slate-900">
                  Arus Kas Keuangan
                </h3>
                <p className="text-sm text-slate-500">
                  Perbandingan pemasukan dan pengeluaran 6 bulan terakhir
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm font-medium text-slate-600">Pemasukan</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <span className="text-sm font-medium text-slate-600">Pengeluaran</span>
                </div>
              </div>
            </div>

            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={financialData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 13, fontWeight: 500 }} dy={10} />
                  <YAxis hide domain={["auto", "auto"]} />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="income" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                  <Area type="monotone" dataKey="expense" stroke="#F43F5E" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* Transactions Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="font-display font-bold text-xl text-slate-900">
              Riwayat Transaksi Terkini ({filteredTransactions.length})
            </h3>

            {/* Filters */}
            <div className="flex gap-3">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari transaksi..."
                  className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-white/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium placeholder:font-normal"
                />
              </div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2.5 bg-white/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 font-medium text-sm"
              >
                <option value="all">Semua Tipe</option>
                <option value="income">Pemasukan (+)</option>
                <option value="expense">Pengeluaran (-)</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <SkeletonTable rows={5} />
          ) : (
            <div className="glass rounded-3xl border border-white/40 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50/80 border-b border-slate-100 backdrop-blur-md">
                    <tr>
                      <th className="px-6 py-5 font-bold text-slate-500 text-sm">ID REF</th>
                      <th className="px-6 py-5 font-bold text-slate-500 text-sm">TANGGAL</th>
                      <th className="px-6 py-5 font-bold text-slate-500 text-sm">DESKRIPSI</th>
                      <th className="px-6 py-5 font-bold text-slate-500 text-sm">KATEGORI</th>
                      <th className="px-6 py-5 font-bold text-slate-500 text-sm">NOMINAL</th>
                      <th className="px-6 py-5 font-bold text-slate-500 text-sm">STATUS</th>
                      <th className="px-6 py-5 font-bold text-slate-500 text-sm text-right">AKSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((trx, index) => (
                      <motion.tr
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.03 }}
                        key={trx.id}
                        className="border-b border-slate-50 last:border-0 hover:bg-white/60 transition-colors group"
                      >
                        <td className="px-6 py-4 text-slate-500 font-mono text-sm group-hover:text-blue-600 transition-colors">
                          {trx.id}
                        </td>
                        <td className="px-6 py-4 text-slate-600 whitespace-nowrap font-medium text-sm">
                          {trx.date}
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-900 text-sm">
                          {trx.description}
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-xs font-semibold">
                          {trx.category || (trx.type === 'income' ? 'Pemasukan' : 'Pengeluaran')}
                        </td>
                        <td
                          className={`px-6 py-4 font-bold whitespace-nowrap text-sm ${
                            trx.type === "income" ? "text-emerald-600" : "text-rose-600"
                          }`}
                        >
                          {trx.type === "income" ? "+" : "-"}
                          {formatCurrency(trx.amount)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold tracking-wide ${
                              trx.status === "Success"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {trx.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(trx)}
                              className="p-2 text-slate-400 hover:text-blue-600 transition-colors rounded-xl hover:bg-slate-100"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(trx.id)}
                              className="p-2 text-slate-400 hover:text-red-600 transition-colors rounded-xl hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                    {filteredTransactions.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-500">
                          Tidak ada transaksi yang cocok dengan pencarian.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <TransactionFormDialog
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedTransaction}
      />
    </DashboardLayout>
  );
}
