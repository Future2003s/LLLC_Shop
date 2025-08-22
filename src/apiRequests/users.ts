import { http } from "@/lib/http";
import { API_CONFIG } from "@/lib/api-config";

// User types based on backend model
export interface UserAddress {
  _id?: string;
  type: "home" | "work" | "other";
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface UserPreferences {
  language: "vi" | "en" | "ja";
  currency: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

export interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: "customer" | "admin" | "seller";
  isActive: boolean;
  isEmailVerified: boolean;
  lastLogin?: string;
  addresses: UserAddress[];
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfileResponse {
  success: boolean;
  message?: string;
  data: UserProfile;
}

export interface AddressesResponse {
  success: boolean;
  message?: string;
  data: UserAddress[];
}

export interface AddressResponse {
  success: boolean;
  message?: string;
  data: UserAddress;
}

// User API requests
export const userApiRequest = {
  // Get user profile
  getProfile: (token: string): Promise<UserProfileResponse> => {
    return http.get(API_CONFIG.USERS.PROFILE, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Update user profile
  updateProfile: (
    token: string,
    profileData: Partial<UserProfile>
  ): Promise<UserProfileResponse> => {
    return http.put(API_CONFIG.USERS.PROFILE, profileData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Get user addresses
  getAddresses: (token: string): Promise<AddressesResponse> => {
    return http.get(API_CONFIG.USERS.ADDRESSES, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Add new address
  addAddress: (
    token: string,
    address: UserAddress
  ): Promise<AddressResponse> => {
    return http.post(API_CONFIG.USERS.ADDRESSES, address, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Update address
  updateAddress: (
    token: string,
    addressId: string,
    address: Partial<UserAddress>
  ): Promise<AddressResponse> => {
    return http.put(`/users/addresses/${addressId}`, address, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Delete address
  deleteAddress: (
    token: string,
    addressId: string
  ): Promise<{ success: boolean; message: string }> => {
    return http.delete(`/users/addresses/${addressId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Set default address
  setDefaultAddress: (
    token: string,
    addressId: string
  ): Promise<AddressResponse> => {
    return http.put(
      `/users/addresses/${addressId}/default`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  },

  // Update user preferences
  updatePreferences: (
    token: string,
    preferences: Partial<UserPreferences>
  ): Promise<UserProfileResponse> => {
    return http.put(API_CONFIG.USERS.PREFERENCES, preferences, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Upload avatar
  uploadAvatar: (token: string, file: File): Promise<UserProfileResponse> => {
    const formData = new FormData();
    formData.append("avatar", file);

    return fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}${API_CONFIG.USERS.AVATAR}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    ).then((res) => res.json());
  },

  // Delete account
  deleteAccount: (
    token: string
  ): Promise<{ success: boolean; message: string }> => {
    return http.delete("/users/account", {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

// Helper function to get full name
export function getUserFullName(user: UserProfile): string {
  return `${user.firstName} ${user.lastName}`.trim();
}

// Helper function to get avatar URL
export function getUserAvatarUrl(avatar?: string): string {
  if (!avatar) {
    return "/images/default-avatar.png";
  }
  if (avatar.startsWith("http")) {
    return avatar;
  }
  return `${process.env.NEXT_PUBLIC_BACKEND_URL}${avatar}`;
}

// Helper function to format address
export function formatAddress(address: UserAddress): string {
  return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`;
}

// Helper function to get address label
export function getAddressLabel(type: UserAddress["type"]): string {
  const labels = {
    home: "Nhà riêng",
    work: "Văn phòng",
    other: "Khác",
  };
  return labels[type] || type;
}
