"use client";
import { useMemo } from "react";
import useTranslations from "@/i18n/useTranslations";
import { useMe } from "./useMe";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { ButtonLoader } from "@/components/ui/loader";

// Backend user profile type
type BackendUserProfile = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  avatar?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  addresses: any[];
  preferences: {
    language: string;
    currency: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
  createdAt: string;
  updatedAt: string;
};

const getInitials = (firstName?: string, lastName?: string, email?: string) => {
  if (firstName && lastName) {
    return (firstName[0] + lastName[0]).toUpperCase();
  }
  if (firstName) {
    return firstName.slice(0, 2).toUpperCase();
  }
  if (email) {
    return email.slice(0, 2).toUpperCase();
  }
  return "??";
};

export default function ProfilePage() {
  const t = useTranslations();
  const router = useRouter();
  const { data, isLoading, error } = useMe();

  // Extract user data from backend response
  const me = useMemo(() => {
    console.log("useMe data:", data);
    if (data?.success && data.user) {
      console.log("User data found:", data.user);
      return data.user as BackendUserProfile;
    }
    console.log("No user data found in:", data);
    return null;
  }, [data]);

  // Handle authentication errors
  useEffect(() => {
    if (error) {
      console.error("Profile error:", error);
      if (error.message === "No authentication token found") {
        toast.error("Vui lòng đăng nhập để xem trang cá nhân");
        router.push("/login");
      } else {
        toast.error("Có lỗi xảy ra khi tải thông tin cá nhân");
      }
    }
  }, [error, router]);

  // Debug logging
  useEffect(() => {
    console.log("Profile page state:", { data, me, isLoading, error });
  }, [data, me, isLoading, error]);

  // Redirect to login if no user data and not loading
  useEffect(() => {
    if (!isLoading && !me && !error) {
      console.log("No user data, redirecting to login", {
        data,
        me,
        error,
        isLoading,
      });
      // Don't redirect immediately, wait a bit to see if data loads
      const timer = setTimeout(() => {
        if (!me) {
          toast.error("Vui lòng đăng nhập để xem trang cá nhân");
          router.push("/login");
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isLoading, me, error, router, data]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ButtonLoader size="lg" />
          <p className="mt-4 text-gray-600">Đang tải thông tin cá nhân...</p>
        </div>
      </div>
    );
  }

  if (!me && !isLoading) {
    console.log("No me data and not loading, waiting for redirect...");
    return (
      <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ButtonLoader size="lg" />
          <p className="mt-4 text-gray-600">Đang kiểm tra đăng nhập...</p>
        </div>
      </div>
    );
  }

  // At this point, me should be defined
  if (!me) {
    return null;
  }

  const fullName = `${me.firstName} ${me.lastName}`.trim();

  return (
    <div className="min-h-[70vh] bg-gray-50">
      {/* App bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-tight">
            {t("nav.profile") || "Trang cá nhân"}
          </h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="hidden sm:inline-flex">
              {t("common.cancel") || "Hủy"}
            </Button>
            <Button disabled={isLoading}>{t("common.save") || "Lưu"}</Button>
          </div>
        </div>
      </div>

      {/* Header info */}
      <div className="container mx-auto px-4 py-6">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              {me.avatar ? (
                <img
                  src={me.avatar}
                  alt="Avatar"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover bg-gray-100"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-xl font-semibold">
                  {getInitials(me.firstName, me.lastName, me.email)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {fullName || "Chưa có tên"}
                </h2>
                <p className="text-sm text-gray-500 mb-1">
                  {t("auth.email") || "Email"}
                </p>
                <p className="truncate font-medium text-gray-900 mb-2">
                  {me.email}
                </p>
                <div className="flex items-center gap-2">
                  <span className="inline-block bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full text-xs font-medium">
                    {me.role.toUpperCase()}
                  </span>
                  {me.isEmailVerified && (
                    <span className="inline-block bg-green-50 text-green-600 px-2 py-0.5 rounded-full text-xs font-medium">
                      Đã xác thực email
                    </span>
                  )}
                  {!me.isEmailVerified && (
                    <span className="inline-block bg-yellow-50 text-yellow-600 px-2 py-0.5 rounded-full text-xs font-medium">
                      Chưa xác thực email
                    </span>
                  )}
                </div>
                {me.phone && (
                  <p className="text-sm text-gray-600 mt-2">📱 {me.phone}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: quick actions / stats */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="shadow-sm">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-sm font-semibold text-gray-700">
                  {t("common.quick_actions") || "Tác vụ nhanh"}
                </h2>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline">
                    {t("common.edit_profile") || "Sửa hồ sơ"}
                  </Button>
                  <Button size="sm" variant="outline">
                    {t("common.change_password") || "Đổi mật khẩu"}
                  </Button>
                  <Button size="sm" variant="outline">
                    {t("common.addresses") || "Quản lý địa chỉ"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-sm font-semibold text-gray-700">
                  {t("common.preferences") || "Tùy chọn"}
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Ngôn ngữ</p>
                    <p className="text-sm font-medium">
                      {me.preferences.language.toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Tiền tệ</p>
                    <p className="text-sm font-medium">
                      {me.preferences.currency}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: main profile content */}
          <div className="lg:col-span-8">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Hồ sơ</TabsTrigger>
                <TabsTrigger value="addresses">Địa chỉ</TabsTrigger>
                <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                <Card className="shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Thông tin cá nhân
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Họ
                        </label>
                        <Input value={me.firstName} readOnly className="mt-1" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Tên
                        </label>
                        <Input value={me.lastName} readOnly className="mt-1" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <Input value={me.email} readOnly className="mt-1" />
                      </div>
                      {me.phone && (
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-700">
                            Số điện thoại
                          </label>
                          <Input value={me.phone} readOnly className="mt-1" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="addresses" className="space-y-6">
                <Card className="shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Địa chỉ</h3>
                    {me.addresses && me.addresses.length > 0 ? (
                      <div className="space-y-4">
                        {me.addresses.map((address, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{address.type}</p>
                                <p className="text-sm text-gray-600">
                                  {address.street}, {address.city},{" "}
                                  {address.state} {address.zipCode}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {address.country}
                                </p>
                              </div>
                              {address.isDefault && (
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                  Mặc định
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">
                        Chưa có địa chỉ nào. Hãy thêm địa chỉ để dễ dàng mua
                        sắm.
                      </p>
                    )}
                    <Button className="mt-4" variant="outline">
                      Thêm địa chỉ mới
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="orders" className="space-y-6">
                <Card className="shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Lịch sử đơn hàng
                    </h3>
                    <p className="text-gray-500 text-center py-8">
                      Tính năng này sẽ được cập nhật sớm.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
