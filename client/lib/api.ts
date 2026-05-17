const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5900";
const SERVER_BASE = API_BASE || process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || process.env.NEXTAUTH_URL?.replace(/\/$/, "") || "http://localhost:5900";

function getToken(): string {
  if (typeof window === "undefined") return "";
  return (
    window.localStorage.getItem("token") ||
    window.localStorage.getItem("supplierToken") ||
    ""
  );
}

function buildHeaders(body?: BodyInit, auth = true): HeadersInit {
  const headers: HeadersInit = {};

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  if (body instanceof FormData) {
    return headers;
  }

  headers["Content-Type"] = "application/json";
  return headers;
}

async function request<T>(path: string, options: RequestInit = {}, auth = true): Promise<T> {
  const url = path.startsWith("http")
    ? path
    : typeof window !== "undefined"
      ? `${API_BASE || ""}${path}`
      : new URL(path, SERVER_BASE).toString();
  const init: RequestInit = {
    ...options,
    headers: {
      ...buildHeaders(options.body, auth),
      ...(options.headers ?? {}),
    },
  };

  const res = await fetch(url, init);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API request failed: ${res.status} ${res.statusText} ${text}`);
  }

  if (res.status === 204) {
    return {} as T;
  }

  return res.json();
}

// Shared Types
export interface ActivityEntry {
  text: string;
  time: string;
  type: string;
}

export interface CustomerInvoice {
  id: string;
  orderRef: string;
  date: string;
  amount: string;
  status: string;
  dueDate?: string;
}

export interface CustomerQuotation {
  id: string;
  reqRef: string;
  supplier?: string;
  date: string;
  expiryDate?: string;
  items: number | string;
  amount: string;
  status: string;
}

export interface CustomerOrder {
  id: string;
  quoteRef: string;
  date: string;
  items: string;
  amount: string;
  status: string;
  tracking?: string;
  estDelivery?: string;
  address?: string;
}

export interface RequirementPayload {
  requirements: Array<{
    itemName: string;
    quantity: string;
    unit: string;
    deliveryDate: string;
    notes: string;
  }>;
  customerId?: string;
  attachedDocument?: File[];
}

export interface SupplierRequirement {
  id: string;
  requirementId?: string;
  createdAt?: string;
  customer: string;
  items: number | Array<any>;
  itemsDetail: string;
  qty: string;
  delivery: string;
  docs: number;
  status: string;
}

export interface SupplierOrder {
  id: string;
  customer: string;
  items: string;
  amount: string;
  date: string;
  status: string;
}

export interface SupplierQuotation {
  id: string;
  requirementId: string;
  customer: string;
  date: string;
  totalAmount: string;
  status: string;
}

export interface SupplierPayment {
  id: string;
  orderId?: string;
  amount: string;
  method?: string;
  status: string;
}

export interface DispatchProgress {
  product: string;
  ordered: string;
  issued: string;
  received: string;
}

export interface CreateQuotationPayload {
  requirementId: string;
  items: Array<{ itemName: string; quantity: number; unit: string; unitPrice: number; totalPrice: number }>;
  subtotal: number;
  tax: number;
  grandTotal: number;
  deliveryTimeline: string;
  paymentTerms: string;
  validUntil: string;
  notes: string;
}

export interface CreateInvoicePayload {
  purchaseOrderRef: string;
  items: Array<{ productID?: string; name: string; quantity: number; unitPrice: number; totalPrice: number }>;
  subtotal: number;
  tax: number;
  grandTotal: number;
  notes: string;
  dueDate: string;
}

export interface SubmitPaymentPayload {
  paymentMethod: string;
  transactionID: string;
  notes?: string;
  paymentProof?: File;
}

export interface DispatchOrderPayload {
  vehicleNumber: string;
  driverName: string;
  deliveryNotes: string;
  items?: Array<{ productID?: string; issuedQuantity: number }>;
}

// Customer Endpoints
export interface CustomerDashboardStats {
  activeOrders: number;
  pendingQuotationsCount: number;
  deliveredOrders: number;
  duePayment: string;
  pendingPayments: CustomerInvoice[];
  recentQuotations: CustomerQuotation[];
  recentActivity: ActivityEntry[];
}

export async function getCustomerDashboardStats(): Promise<CustomerDashboardStats> {
  const response = await request<{ success: boolean; stats: any }>("/api/dashboard/customer-stats");
  if (!response.success) {
    throw new Error("Failed to fetch dashboard stats");
  }

  const { stats } = response;
  
  // Map backend fields to frontend interface if they differ
  return {
    activeOrders: stats.activeOrders,
    pendingQuotationsCount: stats.pendingQuotationsCount,
    deliveredOrders: stats.deliveredOrders,
    duePayment: stats.duePayment,
    pendingPayments: stats.pendingInvoices || stats.pendingPayments || [],
    recentQuotations: stats.pendingQuotations || stats.recentQuotations || [],
    recentActivity: stats.recentActivity || [],
  };
}

export async function getCustomerOrders(customerId: string): Promise<CustomerOrder[]> {
  return request<CustomerOrder[]>(`/api/orders/customer/${customerId}`);
}

export async function confirmDelivery(orderId: string, payload: { receivedItems: Array<{ productID: string; receivedQuantity: number }> }): Promise<void> {
  return request(`/api/orders/confirm-delivery/${orderId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function getCustomerRequirements(customerId: string): Promise<{ requirements: SupplierRequirement[] }> {
  return request(`/api/requirements?customerId=${encodeURIComponent(customerId)}`);
}

export async function getCustomerRequirementsStats(customerId: string): Promise<{ stats: Record<string, number> }> {
  return request(`/api/requirements/stats?customerId=${encodeURIComponent(customerId)}`);
}

export async function getAvailableStocks(): Promise<Array<{ id: string; itemName: string; quantity: number; price: number }>> {
  return request(`/api/stocks/getItems`);
}

export async function createRequirement(payload: RequirementPayload): Promise<{ success: boolean }> {
  if (payload.attachedDocument && payload.attachedDocument.length > 0) {
    const formData = new FormData();
    formData.append("requirements", JSON.stringify(payload.requirements));
    if (payload.customerId) formData.append("customerId", payload.customerId);
    payload.attachedDocument.forEach(f => formData.append("attachedDocument", f));
    return request(`/api/requirements`, {
      method: "POST",
      body: formData,
    });
  }

  return request(`/api/requirements`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getCustomerQuotations(customerId: string): Promise<{ quotations: CustomerQuotation[] }> {
  return request(`/api/quotations/customer/${customerId}`);
}

export async function createOrderFromQuotation(payload: { name: string; customerId: string; address: string; phonenumber: string; notes: string; items: Array<{ productID: string; name: string; price: number; quantity: number; image?: string }>; quotationId: string; }): Promise<{ success: boolean }> {
  return request(`/api/orders`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function acceptQuotation(quotationId: string): Promise<{ success: boolean }> {
  return request(`/api/quotations/accept/${quotationId}`, {
    method: "PUT",
  });
}

export async function rejectQuotation(quotationId: string): Promise<{ success: boolean }> {
  return request(`/api/quotations/reject/${quotationId}`, {
    method: "PUT",
  });
}

export async function getCustomerInvoices(email: string): Promise<{ invoices: CustomerInvoice[] }> {
  return request(`/api/invoices/customer/${encodeURIComponent(email)}`);
}

export async function getAllInvoices(): Promise<{ invoices: CustomerInvoice[] }> {
  return request(`/api/invoices`);
}

export async function createInvoiceFromOrder(orderId: string): Promise<{ success: boolean }> {
  return request(`/api/invoices/create-from-order/${orderId}`, { method: "POST" });
}

export async function submitPayment(invoiceID: string, payload: SubmitPaymentPayload): Promise<{ success: boolean }> {
  const formData = new FormData();
  formData.append("paymentMethod", payload.paymentMethod);
  formData.append("transactionID", payload.transactionID);
  if (payload.notes) formData.append("notes", payload.notes);
  if (payload.paymentProof) formData.append("paymentProof", payload.paymentProof);
  return request(`/api/invoices/${invoiceID}/payment`, {
    method: "POST",
    body: formData,
  });
}

// Supplier Endpoints
export async function getSupplierDashboardStats(): Promise<{ stats: { newRequirements: number; pendingQuotations: number; activeOrders: number; totalRevenue: string } }> {
  return request(`/api/suppliers/dashboard/stats`);
}

export async function getRecentRequirements(): Promise<{ recentRequirements: Array<{ id: string; requirementId: string; customerName: string; items: string }> }> {
  return request(`/api/suppliers/dashboard/recent-requirements`);
}

export async function getRecentOrders(): Promise<{ recentOrders: Array<{ _id: string; po_id: string; status: string; total: string }> }> {
  return request(`/api/suppliers/dashboard/recent-orders`);
}

export async function getPendingPayments(): Promise<{ pendingPayments: Array<{ id: string; amount: string; dueDate: string }> }> {
  return request(`/api/suppliers/dashboard/pending-payments`);
}

export async function getSupplierOrders(params: { status?: string; search?: string } = {}): Promise<{ orders: SupplierOrder[] }> {
  const query = new URLSearchParams();
  if (params.status) query.append("status", params.status);
  if (params.search) query.append("search", params.search);
  return request(`/api/supplier-orders/my-orders?${query.toString()}`);
}

export async function getSupplierOrderStats(): Promise<{ stats: Record<string, number> }> {
  return request(`/api/supplier-orders/my-stats`);
}

export async function acknowledgeOrder(id: string): Promise<{ success: boolean }> {
  return request(`/api/supplier-orders/${id}/acknowledge`, { method: "PATCH" });
}

export async function getSupplierQuotationsTable(params: { status?: string; search?: string } = {}): Promise<{ quotations: SupplierQuotation[] }> {
  const query = new URLSearchParams();
  if (params.status) query.append("status", params.status);
  if (params.search) query.append("search", params.search);
  return request(`/api/suppliers/quotations/table?${query.toString()}`);
}

export async function getSupplierQuotationsStats(): Promise<{ stats: Record<string, number> }> {
  return request(`/api/suppliers/quotations/stats`);
}

export async function getQuotationDetails(id: string): Promise<{ quotation: SupplierQuotation }> {
  return request(`/api/suppliers/quotations/${id}/detail`);
}

export async function getSupplierRequirements(params: { status?: string; search?: string } = {}): Promise<{ requirements: SupplierRequirement[] }> {
  const query = new URLSearchParams();
  if (params.status) query.append("status", params.status);
  if (params.search) query.append("search", params.search);
  return request(`/api/suppliers/supplier-requirements/my?${query.toString()}`);
}

export async function createSupplierQuotation(payload: CreateQuotationPayload): Promise<{ success: boolean }> {
  return request(`/api/suppliers/quotations`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getMyRequirements(params: { status?: string; search?: string } = {}): Promise<{ requirements: SupplierRequirement[] }> {
  const query = new URLSearchParams();
  if (params.status) query.append("status", params.status);
  if (params.search) query.append("search", params.search);
  return request(`/api/suppliers/supplier-requirements/my?${query.toString()}`);
}

export async function getRequirementsStats(): Promise<{ stats: Record<string, number> }> {
  return request(`/api/suppliers/requirements/stats`);
}

export async function getRequirementDetails(id: string): Promise<{ requirement: SupplierRequirement }> {
  return request(`/api/suppliers/requirements/${id}`);
}

export async function getDispatchList(): Promise<{ orders: Array<{ _id: string; po_id: string; status: string; items: string; total: string }> }> {
  return request(`/api/supplier-orders/dispatch-list`);
}

export async function getDeliveryProgress(id: string): Promise<{ progress: { items: DispatchProgress[] } }> {
  return request(`/api/supplier-orders/${id}/delivery-progress`);
}

export async function dispatchOrder(id: string, payload: DispatchOrderPayload): Promise<{ success: boolean }> {
  return request(`/api/supplier-orders/${id}/dispatch`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function getInvoiceableOrders(): Promise<{ orders: Array<{ id: string; po_id: string; status: string; items: string; total: string }> }> {
  return request(`/api/supplier-orders/invoiceable-orders`);
}

export async function getMyInvoices(): Promise<{ invoices: CustomerInvoice[] }> {
  return request(`/api/supplier-invoices/my`);
}

export async function getOrderDetails(id: string): Promise<{ order: { _id: string; po_id: string; items: Array<{ productID: string; name: string; quantity: number; price: number }>; total: string } }> {
  return request(`/api/supplier-orders/${id}`);
}

export async function createInvoice(payload: CreateInvoicePayload): Promise<{ success: boolean }> {
  return request(`/api/supplier-invoices`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getMyPayments(params: { status?: string; search?: string } = {}): Promise<{ payments: SupplierPayment[] }> {
  const query = new URLSearchParams();
  if (params.status) query.append("status", params.status);
  if (params.search) query.append("search", params.search);
  return request(`/api/supplier-payments/all?${query.toString()}`);
}

export async function getPaymentStats(): Promise<{ stats: Record<string, number> }> {
  return request(`/api/supplier-payments/stats`);
}
