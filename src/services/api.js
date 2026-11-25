import axios from "axios";

// Physical phone: use your PC IPv4 address
// Android emulator: use http://10.0.2.2:3000/api
export const API_BASE_URL = "http://10.139.200.52:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Register customer - send all 16 fields and optional PDF
export async function registerCustomer(form, selectedDocument = null) {
  const formData = new FormData();

  const payload = {
    ...form,
    documentNumber: Number(form.documentNumber),
    tenure: Number(form.tenure),
    emiAmount: Number(form.emiAmount),
    currentMonthInstallment: Number(form.currentMonthInstallment),
    overdueInstallment: Number(form.overdueInstallment),
    openingOverdueAmount: Number(form.openingOverdueAmount),
    currentMonthEmi: Number(form.currentMonthEmi),
    totalPendingAmount: Number(form.totalPendingAmount),
  };

  // Append all customer fields
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });

  // Append PDF if selected
  if (selectedDocument?.uri) {
    formData.append("document", {
      uri: selectedDocument.uri,
      name: selectedDocument.name || "customer-document.pdf",
      type: "application/pdf",
    });
  }

  // Do not delete documentNumber.
  // It is entered manually by the user.

  const { data } = await api.post("/customers", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data.data;
}

export async function searchCustomers(q = "", page = 1, limit = 20) {
  const { data } = await api.get("/customers", {
    params: { q, page, limit },
  });
  return data;
}

export async function getCustomer(customerId) {
  const { data } = await api.get(`/customers/${customerId}`);
  return data.data;
}

export async function collectPayment(payment) {
  const { data } = await api.post("/payments", payment);
  return data.data;
}

export async function getCustomerPayments(customerId) {
  const { data } = await api.get(`/payments/customer/${customerId}`);
  return data.data;
}

export default api;
