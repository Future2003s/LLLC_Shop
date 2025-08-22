import { http } from "@/lib/http";

const accountApiRequest = {
  me: (sessionToken: string) => {
    return http.get("/auth/me", {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });
  },
  updateMe: (sessionToken: string, body: any) => {
    return http.put("/users/profile", body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });
  },
  addresses: (sessionToken: string) =>
    http.get("/users/addresses", {
      headers: { Authorization: `Bearer ${sessionToken}` },
    }),
  addAddress: (sessionToken: string, body: any) =>
    http.post("/users/addresses", body, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    }),
  updateAddress: (sessionToken: string, addressId: string, body: any) =>
    http.put(`/users/addresses/${addressId}`, body, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    }),
  deleteAddress: (sessionToken: string, addressId: string) =>
    http.delete(`/users/addresses/${addressId}`, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    }),
  setDefaultAddress: (sessionToken: string, addressId: string) =>
    http.put(
      `/users/addresses/${addressId}/default`,
      {},
      {
        headers: { Authorization: `Bearer ${sessionToken}` },
      }
    ),
};

export default accountApiRequest;
