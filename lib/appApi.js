"use client";
// The Thirty Forty app's backend, called from the browser exactly like the
// app does (helper/*.dart). The API allows any origin (CORS: *).
import { API } from "./site";

async function call(path, { method = "GET", body, form } = {}) {
  let res;
  try {
    res = await fetch(`${API.base}${path}`, {
      method,
      headers: form ? undefined : { "Content-Type": "application/json" },
      body: form || (body !== undefined ? JSON.stringify(body) : undefined),
    });
  } catch {
    throw new Error("Couldn't reach Thirty Forty. Check your internet connection and try again.");
  }
  let data = null;
  try {
    data = await res.json();
  } catch {}
  return { ok: res.ok, status: res.status, data };
}

const message = (r, fallback) => (r.data && typeof r.data.message === "string" && r.data.message) || fallback;

/* ---------- Auth (auth_helper.dart) ---------- */

// → { status, message, otpLength }
export async function sendOtp(phone) {
  const r = await call("/send-otp", { method: "POST", body: { phonenumber: phone } });
  return r.data || { status: false, message: "Failed to send OTP. Please try again." };
}

// → { status, isNewUser, data: user }
export async function verifyOtp(phone, otp) {
  const r = await call("/verify-otp", { method: "POST", body: { phonenumber: phone, otp } });
  return r.data || { status: false, message: "Could not verify OTP. Please try again." };
}

export const otpLengthFrom = (res) => {
  const n = parseInt(res?.otpLength, 10);
  return n >= 4 && n <= 8 ? n : 6;
};

/* ---------- Profile (user_profile_helper.dart) ---------- */

export async function getUser(id) {
  const r = await call(`/userbyid/${id}`);
  if (!r.ok) throw new Error(message(r, "Failed to load your profile"));
  return r.data?.data || r.data;
}

// Body keys as the app sends them for PUT /updateusers/:id
export async function updateUser(id, { userName, email, phonenumber, gender, professional, socialmedialink }) {
  const body = { userName };
  if (email !== undefined) body.email = email;
  if (phonenumber !== undefined) body.phonenumber = phonenumber;
  if (gender !== undefined) body.gender = gender;
  if (professional !== undefined) body.professional = professional;
  if (socialmedialink !== undefined) body.socialmedialink = socialmedialink;
  const r = await call(`/updateusers/${id}`, { method: "PUT", body });
  if (!r.ok) throw new Error(message(r, "Failed to save your details. Please try again."));
  return r.data?.data || r.data;
}

/* ---------- Favorites (fav_helper.dart) ---------- */

export async function toggleFavorite({ customerId, customerName, propertyId }) {
  const r = await call("/favorites/toggle", { method: "POST", body: { customerId, customerName, propertyId } });
  if (!r.ok) throw new Error("Failed to update favorite");
  return r.data; // { message, favorited }
}

// → list of property ids
export async function fetchFavoriteIds(customerId) {
  const r = await call(`/favorites/${customerId}`);
  if (!r.ok || !r.data?.success) return [];
  return (r.data.data || []).map((f) => f.property?._id || f.propertyId?._id || f.propertyId).filter(Boolean);
}

/* ---------- Enquiries (enquiry_helper.dart) ---------- */

export async function sendEnquiry({ userName, phoneNumber, userId, propertyId, message: note = "" }) {
  const r = await call("/enquiry/enquiries", { method: "POST", body: { userName, phoneNumber, userId, propertyId, message: note } });
  if (!r.ok) throw new Error(message(r, "Failed to send enquiry"));
  return r.data;
}

// Properties this user enquired about → [{ id, status, message, property(raw) }]
export async function myEnquiries(userId) {
  const r = await call(`/enquiry/enquiries/${userId}`);
  if (r.status === 404) return [];
  if (!r.ok) throw new Error("Failed to load enquiries");
  return (r.data?.data?.enquiry || []).map((e) => ({
    id: e._id,
    status: e.status || "pending",
    message: e.message || "",
    property: e.propertyId && typeof e.propertyId === "object" ? e.propertyId : null,
  }));
}

// The owner's properties and who enquired → [{ property(raw), users: [...] }]
// The backend answers 404 when there are no enquiries but still sends the properties.
export async function ownerDashboard(customerId) {
  const r = await call(`/enquiry/enquiries/customer/${customerId}`);
  if (!r.ok && r.status !== 404) throw new Error("Failed to load your properties");
  return (r.data?.data || []).map((x) => ({ property: x.property || {}, users: x.users || [] }));
}

/* ---------- Properties (add_property_helper.dart) ---------- */

export async function fetchRawProperties() {
  const r = await call("/sell/properties");
  if (!r.ok) throw new Error("Failed to load properties");
  return Array.isArray(r.data) ? r.data : r.data?.data || [];
}

// Multipart, fields as the app's SellModel.toJson(); lists/maps JSON-encoded
function toForm(fields, images = [], existing) {
  const form = new FormData();
  Object.entries(fields).forEach(([k, v]) => {
    if (v === null || v === undefined || v === "") return;
    form.append(k, typeof v === "object" ? JSON.stringify(v) : String(v));
  });
  images.forEach((file) => form.append("propertyimage", file));
  if (existing) form.append("existingImages", JSON.stringify(existing));
  return form;
}

export async function createProperty(fields, images) {
  const r = await call("/sell/properties", { method: "POST", form: toForm(fields, images) });
  if (!r.ok) throw new Error(message(r, `Couldn't publish your property (error ${r.status}). Please try again.`));
  return r.data;
}

export async function updateProperty(id, fields, newImages, keptImages) {
  const r = await call(`/sell/properties/${id}`, { method: "PUT", form: toForm(fields, newImages, keptImages) });
  if (!r.ok) throw new Error(message(r, `Couldn't save your changes (error ${r.status}). Please try again.`));
  return r.data;
}

export async function deleteProperty(id, customerId) {
  const r = await call(`/sell/properties/${id}?customerId=${encodeURIComponent(customerId)}`, { method: "DELETE", body: { customerId } });
  if (!r.ok) throw new Error(message(r, `Failed to delete property (error ${r.status}).`));
}

/* ---------- Notifications (notification_helper.dart) ---------- */

export async function fetchNotifications(userId) {
  const r = await call(`/notifications/${userId}`);
  if (!r.ok) throw new Error("Failed to load notifications");
  return (r.data?.data || []).map((n) => ({
    id: n._id || n.id,
    title: n.title || "",
    body: n.body || "",
    createdAt: n.createdAt || null,
    propertyId: n.data?.propertyId || null,
  }));
}

export async function deleteNotifications(userId, ids) {
  const r = await call("/notifications/delete-many", { method: "POST", body: { userId, ids } });
  if (!r.ok) throw new Error("Couldn't delete notifications. Please try again.");
}

/* ---------- Website cache ---------- */

// Ask the website to reload listings now instead of waiting for its 2-minute refresh
export const refreshListings = () => fetch("/api/refresh", { method: "POST" }).catch(() => {});
