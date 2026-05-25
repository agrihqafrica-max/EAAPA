import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const API = `${BASE}/api`;

export type DocumentCategory =
  | "licences" | "contracts" | "agreements" | "sales_requirements" | "reports"
  | "certificates" | "exhibits" | "notifications" | "messages" | "user_documents"
  | "system_generated" | "marketing" | "financial" | "legal";

export type DocumentStatus = "active" | "archived" | "draft" | "pending_review";
export type DocumentType = "pdf" | "docx" | "xlsx" | "csv" | "image" | "txt" | "other";

export interface Document {
  id: number;
  title: string;
  description?: string;
  category: DocumentCategory;
  documentType: DocumentType;
  status: DocumentStatus;
  fileUrl?: string;
  fileSizeKb: number;
  mimeType?: string;
  module?: string;
  referenceId?: number;
  referenceType?: string;
  ownerName?: string;
  ownerRole?: string;
  tags: string[];
  isSystemGenerated: boolean;
  isConfidential: boolean;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentsResponse {
  documents: Document[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DocumentFilters {
  category?: DocumentCategory | "all";
  status?: DocumentStatus;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

async function fetchDocuments(filters: DocumentFilters): Promise<DocumentsResponse> {
  const params = new URLSearchParams();
  if (filters.category && filters.category !== "all") params.set("category", filters.category);
  if (filters.status) params.set("status", filters.status);
  if (filters.search) params.set("search", filters.search);
  if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
  if (filters.dateTo) params.set("dateTo", filters.dateTo);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));

  const res = await fetch(`${API}/documents?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch documents");
  return res.json();
}

async function fetchDocumentStats(): Promise<Record<string, number>> {
  const res = await fetch(`${API}/documents/stats`);
  if (!res.ok) throw new Error("Failed to fetch document stats");
  return res.json();
}

async function fetchDocument(id: number): Promise<Document> {
  const res = await fetch(`${API}/documents/${id}`);
  if (!res.ok) throw new Error("Document not found");
  return res.json();
}

export function useDocuments(filters: DocumentFilters = {}) {
  return useQuery({
    queryKey: ["documents", filters],
    queryFn: () => fetchDocuments(filters),
    staleTime: 30_000,
  });
}

export function useDocumentStats() {
  return useQuery({
    queryKey: ["documentStats"],
    queryFn: fetchDocumentStats,
    staleTime: 60_000,
  });
}

export function useDocument(id: number) {
  return useQuery({
    queryKey: ["document", id],
    queryFn: () => fetchDocument(id),
    enabled: id > 0,
  });
}

export function useCreateDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Document> & { title: string; category: DocumentCategory }) => {
      const res = await fetch(`${API}/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create document");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["documents"] });
      qc.invalidateQueries({ queryKey: ["documentStats"] });
    },
  });
}

export function useDeleteDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${API}/documents/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete document");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["documents"] });
      qc.invalidateQueries({ queryKey: ["documentStats"] });
    },
  });
}
