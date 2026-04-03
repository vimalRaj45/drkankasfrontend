export const API_URL = window.location.origin.includes('localhost') 
  ? "http://localhost:3000" 
  : "https://drkanaksbackend.onrender.com";
/* ---------------- HELPER ---------------- */

const headers = {
  "Content-Type": "application/json",
};

export const checkUser = async (phone) => {
  try {
    const response = await fetch(`${API_URL}/check-user`, {
      method: "POST",
      headers,
      body: JSON.stringify({ phone })
    });
    const data = await response.json();
    return {
      success: data.status === "success",
      user: data.data || null,
      isNew: data.message === "new_user"
    };
  } catch (error) {
    console.error("Error checking user:", error);
    return { success: false, error: error.message };
  }
};

export const createUser = async (name, phone) => {
  try {
    const response = await fetch(`${API_URL}/create-user`, {
      method: "POST",
      headers,
      body: JSON.stringify({ name, phone })
    });
    const data = await response.json();
    return {
      success: data.status === "success",
      user: data.data || null,
      message: data.message
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false, error: error.message };
  }
};

export const bookAppointment = async (appointmentData) => {
  try {
    // The backend expects specific fields, not the 'action' field from before
    const { name, phone, date, time, service, message } = appointmentData;
    const response = await fetch(`${API_URL}/book`, {
      method: "POST",
      headers,
      body: JSON.stringify({ name, phone, date, time, service, message })
    });
    const data = await response.json();
    return {
      ...data,
      success: data.status === "success"
    };
  } catch (error) {
    console.error("Error booking appointment:", error);
    return { success: false, error: error.message };
  }
};

export const getAppointments = async (page = 1, limit = 10) => {
  try {
    const adminToken = "CHANGE_THIS_SECRET";
    const response = await fetch(`${API_URL}/appointments?page=${page}&limit=${limit}&admin_token=${adminToken}`);
    const data = await response.json();
    return {
      success: data.status === "success",
      ...data
    };
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return { success: false, error: error.message };
  }
};

export const updateStatus = async (appointmentId, status, adminToken = "CHANGE_THIS_SECRET", reason = "", suggestedDate = "") => {
  try {
    const response = await fetch(`${API_URL}/update-status`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        appointment_id: appointmentId,
        status: status,
        admin_token: adminToken,
        cancel_reason: reason,
        suggestion: suggestedDate
      })
    });
    const data = await response.json();
    return {
      success: data.status === "success",
      message: data.message
    };
  } catch (error) {
    console.error("Error updating status:", error);
    return { success: false, error: error.message };
  }
};

export const getUserAppointments = async (phone) => {
  try {
    // SECURITY IMPROVEMENT: Use the public /my-appointments route instead of searching with an admin token
    const response = await fetch(`${API_URL}/my-appointments/${phone}`);
    const data = await response.json();

    if (data.status === "success" && data.data) {
      return { success: true, data: data.data };
    }
    return { success: false, data: [] };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

/**
 * WEB PUSH API UTILITIES
 */
export const VAPID_PUBLIC_KEY = "BBa2SEf1E3XMUsI-rLfJb2nMc5Eaexl_1kbwGCucAiWPaXW06EuZanI1vd2T9K8C9UCWNUB4eyKCpOIicFn54Lw";

export const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export const subscribeUser = async (userId, subscription) => {
  try {
    const payload = {
      userId,
      subscription
    };
    const response = await fetch(`${API_URL}/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return await response.json();
  } catch (error) {
    console.error("Subscription failed:", error);
    return { success: false, error: error.message };
  }
};
export const submitGoogleFeedback = async (rating, feedback, name = "") => {
  try {
    const response = await fetch(`${API_URL}/feedback`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ rating, feedback, name, source: 'Google Review System' })
    });
    return await response.json();
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return { success: false, error: error.message };
  }
};

export const broadcastPush = async (title, body, url, adminToken = "CHANGE_THIS_SECRET") => {
  try {
    const response = await fetch(`${API_URL}/broadcast-push`, {
      method: "POST",
      headers,
      body: JSON.stringify({ title, body, url, admin_token: adminToken })
    });
    const data = await response.json();
    return {
      success: data.status === "success",
      message: data.message
    };
  } catch (error) {
    console.error("Error broadcasting push:", error);
    return { success: false, error: error.message };
  }
};

/**
 * RAZORPAY PAYMENT INTEGRATION
 * Step 1: Book appointment and get Razorpay order details
 */
export const bookAppointmentWithPayment = async ({ name, phone, appointment_date, appointment_time, service, message }) => {
  try {
    const response = await fetch(`${API_URL}/api/book`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ name, phone, appointment_date, appointment_time, service, message })
    });
    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.message || 'Booking failed', status: response.status };
    }

    return {
      success: data.status === 'success',
      data: data.data,
      message: data.message
    };
  } catch (error) {
    console.error('Error creating payment order:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Step 3: Verify Razorpay payment signature with backend
 */
export const verifyPayment = async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature, appointment_id }) => {
  try {
    const response = await fetch(`${API_URL}/api/verify`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ razorpay_order_id, razorpay_payment_id, razorpay_signature, appointment_id })
    });
    const data = await response.json();
    return {
      success: data.status === 'success',
      message: data.message
    };
  } catch (error) {
    console.error('Error verifying payment:', error);
    return { success: false, error: error.message };
  }
};

export const getPublicStats = async () => {
  try {
    const response = await fetch(`${API_URL}/public-stats`);
    const data = await response.json();
    return {
      success: data.status === "success",
      data: data.data || { total_patients: 10000, success_rate: 98 }
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return { success: false, data: { total_patients: 10000, success_rate: 98 } };
  }
};
