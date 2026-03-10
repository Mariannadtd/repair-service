const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.message || "Ошибка запроса");
  }

  return data;
}

export const api = {
  getUsers() {
    return request("/users");
  },

  createRequest(payload) {
    return request("/requests", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getRequests(status = "all") {
    const query = status !== "all" ? `?status=${status}` : "";
    return request(`/requests${query}`);
  },

  assignRequest(id, masterId, dispatcherId) {
    return request(`/requests/${id}/assign`, {
      method: "PATCH",
      headers: {
        "x-user-id": String(dispatcherId),
      },
      body: JSON.stringify({ masterId }),
    });
  },

  cancelRequest(id, dispatcherId) {
    return request(`/requests/${id}/cancel`, {
      method: "PATCH",
      headers: {
        "x-user-id": String(dispatcherId),
      },
    });
  },

  getMyRequests(userId) {
    return request("/me/requests", {
      headers: {
        "x-user-id": String(userId),
      },
    });
  },

  takeRequest(id, userId) {
    return request(`/requests/${id}/take`, {
      method: "PATCH",
      headers: {
        "x-user-id": String(userId),
      },
    });
  },

  completeRequest(id, userId) {
    return request(`/requests/${id}/complete`, {
      method: "PATCH",
      headers: {
        "x-user-id": String(userId),
      },
    });
  },
};
