import { useState, useMemo } from "react";
import { useLocation, useSearch } from "wouter";
import {
  useDocuments, useDocumentStats, useDeleteDocument,
  type Document, type DocumentCategory, type DocumentFilters
} from "@/lib/useDocuments";
import {
  FileText, FileBadge, FileCheck, FileSpreadsheet, Image, File,
  Search, Filter, Download, Eye, Trash2, Shield, AlertTriangle,
  ChevronRight, X, Calendar, User, Tag, Package, Loader2,
  FolderOpen, Clock, TrendingUp, Lock, CheckCircle, RefreshCw
} from "lucide-react";
import { clsx } from "clsx";

// ── Category config ────────────────────────────────────────
const CATEGORIES: { key: DocumentCategory | "all"; label: string; icon: React.ElementType; color: string }[] = [
  { key: "all",                label: "All Documents",       icon: FolderOpen,     color: "text-white" },
  { key: "licences",           label: "Licences",            icon: Shield,         color: "text-blue-400" },
  { key: "contracts",          label: "Contracts",           icon: FileCheck,      color: "text-primary" },
  { key: "agreements",         label: "Agreements",          icon: FileBadge,      color: "text-secondary" },
  { key: "sales_requirements", label: "Sales Requirements",  icon: TrendingUp,     color: "text-purple-400" },
  { key: "reports",            label: "Reports",             icon: FileSpreadsheet,color: "text-cyan-400" },
  { key: "certificates",       label: "Certificates",        icon: CheckCircle,    color: "text-primary" },
  { key: "exhibits",           label: "Exhibits",            icon: Package,        color: "text-orange-400" },
  { key: "notifications",      label: "Notifications",       icon: AlertTriangle,  color: "text-yellow-400" },
  { key: "messages",           label: "Messages",            icon: FileText,       color: "text-pink-400" },
  { key: "user_documents",     label: "User Documents",      icon: User,           color: "text-indigo-400" },
  { key: "system_generated",   label: "System Generated",    icon: RefreshCw,      color: "text-teal-400" },
  { key: "marketing",          label: "Marketing",           icon: TrendingUp,     color: "text-rose-400" },
  { key: "financial",          label: "Financial",           icon: FileSpreadsheet,color: "text-amber-400" },
  { key: "legal",              label: "Legal",               icon: Shield,         color: "text-slate-400" },
];

const DOC_TYPE_ICON: Record<string, React.ElementType> = {
  pdf: FileText, docx: FileText, xlsx: FileSpreadsheet, csv: FileSpreadsheet,
  image: Image, txt: File, other: File,
};

const DOC_TYPE_COLOR: Record<string, string> = {
  pdf: "text-red-400 bg-red-500/10 border-red-500/20",
  docx: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  xlsx: "text-green-400 bg-green-500/10 border-green-500/20",
  csv: "text-teal-400 bg-teal-500/10 border-teal-500/20",
  image: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  txt: "text-muted-foreground bg-muted/50 border-border",
  other: "text-muted-foreground bg-muted/50 border-border",
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  active:         { label: "Active",          color: "bg-primary/10 text-primary border-primary/20" },
  archived:       { label: "Archived",        color: "bg-muted/50 text-muted-foreground border-border" },
  draft:          { label: "Draft",           color: "bg-secondary/10 text-secondary border-secondary/20" },
  pending_review: { label: "Pending Review",  color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
};

function formatSize(kb: number): string {
  if (kb >= 1024) return `${(kb / 1024).toFixed(1)} MB`;
  return `${kb} KB`;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

// ── Preview modal ──────────────────────────────────────────
function DocumentPreview({ doc, onClose }: { doc: Document; onClose: () => void }) {
  const catDef = CATEGORIES.find(c => c.key === doc.category);
  const TypeIcon = DOC_TYPE_ICON[doc.documentType] ?? File;
  const CatIcon = catDef?.icon ?? File;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-border flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={clsx("p-3 rounded-2xl border", DOC_TYPE_COLOR[doc.documentType])}>
              <TypeIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground leading-tight">{doc.title}</h2>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className={clsx("text-xs font-bold px-2 py-0.5 rounded-md border", STATUS_CONFIG[doc.status]?.color)}>
                  {STATUS_CONFIG[doc.status]?.label}
                </span>
                {doc.isConfidential && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-destructive/10 text-destructive border border-destructive/20 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Confidential
                  </span>
                )}
                {doc.isSystemGenerated && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-400 border border-teal-500/20">
                    System Generated
                  </span>
                )}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto no-scrollbar">
          {doc.description && (
            <p className="text-foreground/70 leading-relaxed">{doc.description}</p>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel p-4 rounded-xl space-y-3">
              <div className="text-xs font-bold text-muted-foreground uppercase">Document Info</div>
              <div className="flex items-center gap-2 text-sm text-foreground/70">
                <CatIcon className={clsx("w-4 h-4 flex-shrink-0", catDef?.color)} />
                {catDef?.label ?? doc.category}
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground/70">
                <TypeIcon className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
                {doc.documentType.toUpperCase()} · {formatSize(doc.fileSizeKb)}
              </div>
              {doc.module && (
                <div className="flex items-center gap-2 text-sm text-foreground/70">
                  <Package className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
                  {doc.module.replace(/_/g, " ")}
                </div>
              )}
            </div>

            <div className="glass-panel p-4 rounded-xl space-y-3">
              <div className="text-xs font-bold text-muted-foreground uppercase">Ownership</div>
              {doc.ownerName && (
                <div className="flex items-center gap-2 text-sm text-foreground/70">
                  <User className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
                  {doc.ownerName}
                </div>
              )}
              {doc.ownerRole && (
                <div className="text-xs text-muted-foreground pl-6">{doc.ownerRole}</div>
              )}
              <div className="flex items-center gap-2 text-sm text-foreground/70">
                <Clock className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
                {new Date(doc.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground/70">
                <Download className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
                {doc.downloadCount} downloads
              </div>
            </div>
          </div>

          {doc.tags && doc.tags.length > 0 && (
            <div>
              <div className="text-xs font-bold text-muted-foreground uppercase mb-2">Tags</div>
              <div className="flex flex-wrap gap-2">
                {doc.tags.map((tag, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-muted/50 border border-border text-xs text-foreground/65">
                    <Tag className="w-3 h-3 inline mr-1" />{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Simulated preview area */}
          <div className="rounded-2xl bg-background/50 border border-border p-8 text-center">
            <TypeIcon className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <div className="text-sm text-muted-foreground">
              Document preview not available in this environment.
            </div>
            <div className="text-xs text-muted-foreground/60 mt-1">Download to view the full document.</div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-border flex gap-3">
          <button
            onClick={() => {
              // Simulate download
              const a = document.createElement("a");
              a.href = `data:text/plain,${encodeURIComponent(`EAAPA Document\n\nTitle: ${doc.title}\nCategory: ${doc.category}\nCreated: ${doc.createdAt}\n\nThis is a simulated document export from the EAAPA platform.`)}`;
              a.download = `${doc.title.replace(/[^a-z0-9]/gi, "_")}.txt`;
              a.click();
            }}
            className="flex-1 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
          >
            <Download className="w-4 h-4" /> Download
          </button>
          <button onClick={onClose} className="px-6 py-3 rounded-xl bg-muted/50 border border-border text-white font-medium hover:bg-muted transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Document card ─────────────────────────────────────────
function DocumentCard({ doc, onPreview, onDelete }: {
  doc: Document;
  onPreview: (doc: Document) => void;
  onDelete: (id: number) => void;
}) {
  const TypeIcon = DOC_TYPE_ICON[doc.documentType] ?? File;
  const catDef = CATEGORIES.find(c => c.key === doc.category);

  return (
    <div className="glass-panel rounded-2xl p-5 border-border hover:border-white/20 transition-all group flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <div className={clsx("p-2.5 rounded-xl border flex-shrink-0", DOC_TYPE_COLOR[doc.documentType])}>
          <TypeIcon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-foreground text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {doc.title}
          </h3>
          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            {catDef && (
              <span className={clsx("text-[10px] font-bold uppercase", catDef.color)}>
                {catDef.label}
              </span>
            )}
            {doc.isConfidential && (
              <Lock className="w-3 h-3 text-destructive" title="Confidential" />
            )}
            {doc.isSystemGenerated && (
              <RefreshCw className="w-3 h-3 text-teal-400" title="System Generated" />
            )}
          </div>
        </div>
      </div>

      {doc.description && (
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {doc.description}
        </p>
      )}

      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />{timeAgo(doc.createdAt)}
          </span>
          <span>{formatSize(doc.fileSizeKb)}</span>
        </div>
        <span className={clsx("px-2 py-0.5 rounded border text-[10px] font-bold", STATUS_CONFIG[doc.status]?.color)}>
          {STATUS_CONFIG[doc.status]?.label}
        </span>
      </div>

      {doc.ownerName && (
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <User className="w-3 h-3" />
          <span className="truncate">{doc.ownerName}</span>
          {doc.ownerRole && <span className="text-muted-foreground/50">· {doc.ownerRole}</span>}
        </div>
      )}

      {doc.tags && doc.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {doc.tags.slice(0, 3).map((tag, i) => (
            <span key={i} className="px-2 py-0.5 rounded-md bg-muted/50 border border-border text-[10px] text-muted-foreground">
              {tag}
            </span>
          ))}
          {doc.tags.length > 3 && (
            <span className="px-2 py-0.5 rounded-md bg-muted/50 text-[10px] text-muted-foreground/40">
              +{doc.tags.length - 3}
            </span>
          )}
        </div>
      )}

      <div className="flex gap-2 pt-1 border-t border-border">
        <button
          onClick={() => onPreview(doc)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-muted/50 hover:bg-muted text-xs font-medium text-white transition-colors"
        >
          <Eye className="w-3.5 h-3.5" /> Preview
        </button>
        <button
          onClick={() => {
            const a = document.createElement("a");
            a.href = `data:text/plain,${encodeURIComponent(`EAAPA Document\n\nTitle: ${doc.title}\nCategory: ${doc.category}\nCreated: ${doc.createdAt}`)}`;
            a.download = `${doc.title.replace(/[^a-z0-9]/gi, "_")}.txt`;
            a.click();
          }}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-xs font-medium text-primary border border-primary/20 transition-colors"
        >
          <Download className="w-3.5 h-3.5" /> Download
        </button>
        <button
          onClick={() => onDelete(doc.id)}
          className="p-2 rounded-lg bg-muted/50 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────
export default function Documents() {
  const [, setLocation] = useLocation();
  const rawSearch = useSearch();

  // Derive active category from URL ?category= param — keeps nav links, sidebar, and state in sync
  const urlParams = new URLSearchParams(rawSearch);
  const activeCategory = (urlParams.get("category") as DocumentCategory) || "all";

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const filters: DocumentFilters = {
    category: activeCategory,
    search: search || undefined,
    status: statusFilter !== "all" ? statusFilter as any : undefined,
    page,
    limit: 20,
  };

  const { data, isLoading, error, refetch } = useDocuments(filters);
  const { data: stats } = useDocumentStats();
  const { mutate: deleteDoc, isPending: isDeleting } = useDeleteDocument();

  const totalCount = (stats && activeCategory === "all")
    ? Object.values(stats).reduce((a, b) => a + b, 0)
    : (stats?.[activeCategory] ?? data?.total ?? 0);

  const filteredDocs = useMemo(() => {
    if (!data?.documents) return [];
    if (typeFilter === "all") return data.documents;
    return data.documents.filter(d => d.documentType === typeFilter);
  }, [data?.documents, typeFilter]);

  const handleCategoryChange = (cat: DocumentCategory | "all") => {
    setPage(1);
    setSidebarOpen(false);
    setLocation(cat === "all" ? "/documents" : `/documents?category=${cat}`);
  };

  const handleDelete = (id: number) => {
    if (deleteConfirm === id) {
      deleteDoc(id, { onSuccess: () => { setDeleteConfirm(null); refetch(); } });
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const activeCatDef = CATEGORIES.find(c => c.key === activeCategory);

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-background">

      {/* ── Mobile sidebar backdrop ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside className={clsx(
        "fixed lg:relative inset-y-0 left-0 z-40 lg:z-auto w-72 border-r border-border bg-card/40 flex flex-col flex-shrink-0 transition-transform duration-300 lg:transform-none",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="font-display font-bold text-foreground">Documents</div>
              <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
                {stats ? Object.values(stats).reduce((a, b) => a + b, 0) : "–"} total records
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5 no-scrollbar">
          {CATEGORIES.map(cat => {
            const catCount = cat.key === "all"
              ? (stats ? Object.values(stats).reduce((a, b) => a + b, 0) : 0)
              : (stats?.[cat.key as DocumentCategory] ?? 0);
            const isActive = activeCategory === cat.key;
            const CatIcon = cat.icon;

            return (
              <button
                key={cat.key}
                onClick={() => handleCategoryChange(cat.key)}
                className={clsx(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <span className="flex items-center gap-2.5">
                  <CatIcon className={clsx("w-4 h-4 flex-shrink-0", isActive ? "text-primary" : cat.color)} />
                  <span className="truncate">{cat.label}</span>
                </span>
                {catCount > 0 && (
                  <span className={clsx(
                    "text-[11px] font-bold px-1.5 py-0.5 rounded-md min-w-[20px] text-center",
                    isActive ? "bg-primary/20 text-primary" : "bg-muted/50 text-muted-foreground"
                  )}>
                    {catCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground/60 text-center">
            EAAPA Document Management System
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Header bar */}
        <div className="px-6 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3 mb-4">
            {/* Mobile sidebar toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-muted/50 hover:bg-muted text-foreground transition-colors"
            >
              <Filter className="w-4 h-4" />
            </button>

            {activeCatDef && (
              <div className="flex items-center gap-2">
                <activeCatDef.icon className={clsx("w-5 h-5", activeCatDef.color)} />
                <h1 className="text-xl font-display font-bold text-foreground">{activeCatDef.label}</h1>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground text-sm">{data?.total ?? totalCount} documents</span>
              </div>
            )}
          </div>

          {/* Search and filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search documents..."
                className="w-full bg-background border border-border rounded-xl pl-9 pr-4 py-2 text-sm text-foreground outline-none focus:border-primary placeholder:text-muted-foreground/50"
              />
              {search && (
                <button onClick={() => { setSearch(""); setPage(1); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <select
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
              className="bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="pending_review">Pending Review</option>
              <option value="archived">Archived</option>
            </select>

            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="all">All Types</option>
              <option value="pdf">PDF</option>
              <option value="docx">DOCX</option>
              <option value="xlsx">XLSX</option>
              <option value="csv">CSV</option>
              <option value="image">Image</option>
              <option value="txt">Text</option>
            </select>

            {(search || statusFilter !== "all" || typeFilter !== "all") && (
              <button
                onClick={() => { setSearch(""); setStatusFilter("all"); setTypeFilter("all"); setPage(1); }}
                className="px-3 py-2 rounded-xl text-sm text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/20 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-6 no-scrollbar">

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <div className="text-sm text-muted-foreground">Loading documents...</div>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-3 text-center">
                <AlertTriangle className="w-10 h-10 text-destructive/60" />
                <div className="text-white font-medium">Failed to load documents</div>
                <div className="text-sm text-muted-foreground">Check your connection and try again.</div>
                <button onClick={() => refetch()} className="mt-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all">
                  Retry
                </button>
              </div>
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-3 text-center">
                <FolderOpen className="w-12 h-12 text-muted-foreground/20" />
                <div className="text-white font-medium">No documents found</div>
                <div className="text-sm text-muted-foreground">
                  {search ? `No results for "${search}"` : "No documents in this category yet."}
                </div>
                {(search || statusFilter !== "all") && (
                  <button
                    onClick={() => { setSearch(""); setStatusFilter("all"); setTypeFilter("all"); }}
                    className="mt-2 text-primary text-sm hover:underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Total", value: data?.total ?? 0, icon: FileText, color: "text-white" },
                  { label: "Active", value: filteredDocs.filter(d => d.status === "active").length, icon: CheckCircle, color: "text-primary" },
                  { label: "System Generated", value: filteredDocs.filter(d => d.isSystemGenerated).length, icon: RefreshCw, color: "text-teal-400" },
                  { label: "Confidential", value: filteredDocs.filter(d => d.isConfidential).length, icon: Lock, color: "text-destructive" },
                ].map(stat => (
                  <div key={stat.label} className="glass-panel rounded-xl p-4 border-border flex items-center gap-3">
                    <stat.icon className={clsx("w-5 h-5 flex-shrink-0", stat.color)} />
                    <div>
                      <div className="text-xl font-bold font-mono text-white">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Document grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                {filteredDocs.map(doc => (
                  <div key={doc.id} className="relative">
                    {deleteConfirm === doc.id && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-destructive/20 border border-destructive/40 backdrop-blur-sm">
                        <div className="text-center p-4">
                          <div className="text-sm font-bold text-foreground mb-2">Delete document?</div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDelete(doc.id)}
                              disabled={isDeleting}
                              className="px-3 py-1.5 rounded-lg bg-destructive text-white text-xs font-bold hover:bg-destructive/90"
                            >
                              {isDeleting ? "..." : "Confirm"}
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-3 py-1.5 rounded-lg bg-muted text-foreground text-xs font-medium"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    <DocumentCard
                      doc={doc}
                      onPreview={setPreviewDoc}
                      onDelete={handleDelete}
                    />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {data && data.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-xl bg-muted/50 border border-border text-sm text-foreground font-medium disabled:opacity-40 hover:bg-muted transition-colors"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(7, data.totalPages) }, (_, i) => {
                      const p = i + 1;
                      return (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={clsx(
                            "w-9 h-9 rounded-xl text-sm font-medium transition-colors",
                            p === page ? "bg-primary text-white" : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
                    disabled={page === data.totalPages}
                    className="px-4 py-2 rounded-xl bg-muted/50 border border-border text-sm text-foreground font-medium disabled:opacity-40 hover:bg-muted transition-colors"
                  >
                    Next
                  </button>
                  <span className="text-xs text-muted-foreground ml-2">
                    Page {page} of {data.totalPages} · {data.total} total
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Preview modal ── */}
      {previewDoc && (
        <DocumentPreview doc={previewDoc} onClose={() => setPreviewDoc(null)} />
      )}
    </div>
  );
}
