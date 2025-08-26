"use client";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock, Globe } from "lucide-react";
import {
  authSchema,
  LoginBodyType,
  ExtendedLoginBodyType,
  loginSchema,
} from "@/shemaValidation/auth.schema";
import { envConfig } from "@/config";
import { authApiRequest } from "@/apiRequests/auth";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { defaultLocale } from "@/i18n/config";
import { useAuth } from "@/hooks/useAuth";

// shadcn/ui components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import useTranslations from "@/i18n/useTranslations";
import { ButtonLoader, Loader } from "@/components/ui/loader";

function LoginForm() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [showSuccessLoader, setShowSuccessLoader] = useState<boolean>(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = (params as any)?.locale || defaultLocale;
  const { login, loginExtended } = useAuth();
  const t = useTranslations();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginBodyType>({ resolver: zodResolver(authSchema) });

  // Khi login thành công, token sẽ được lưu vào localStorage và cookie nhờ useAuth đã refactor

  const onSubmit = async (data: LoginBodyType) => {
    setIsSubmitting(true);
    try {
      // Nếu có rememberMe hoặc muốn gửi deviceInfo, sử dụng loginExtended
      if (rememberMe) {
        const extendedLoginData: ExtendedLoginBodyType = {
          email: data.email,
          password: data.password,
          rememberMe,
          deviceInfo: {
            userAgent: navigator.userAgent,
            platform: "web" as const,
          },
        };

        const result = await loginExtended(extendedLoginData);
        if (result?.success) {
          // Hiển thị Loader thành công trong 0.5 giây
          setShowSuccessLoader(true);
          setTimeout(() => {
            router.replace(`/${locale}/me`);
          }, 500);
          return;
        }
        setIsSubmitting(false);
      } else {
        // Sử dụng basic login
        const result = await login(data.email, data.password);
        if (result?.success) {
          // Hiển thị Loader thành công trong 0.5 giây
          setShowSuccessLoader(true);
          setTimeout(() => {
            router.replace(`/${locale}/me`);
          }, 500);
          return;
        }
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(t("auth.login_failed"), {
        position: "top-center",
        richColors: true,
      });
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-6 px-4 sm:py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm sm:max-w-md space-y-6 sm:space-y-8">
          {/* Google-style Logo */}
          <div className="text-center">
            <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 relative mb-4 sm:mb-6">
              <img
                src={envConfig.NEXT_PUBLIC_URL_LOGO}
                className="w-full h-full object-contain"
                alt="Logo"
              />
            </div>
            <h1 className="text-xl sm:text-2xl font-normal text-gray-900 mb-2">
              {t("auth.login_title")}
            </h1>
            <p className="text-sm text-gray-600">{t("auth.login_subtitle")}</p>
          </div>

          {/* Main Card */}
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-6 sm:p-8">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5 sm:space-y-6"
              >
                {/* Email Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    {t("auth.email")}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      {...register("email")}
                      id="email"
                      type="email"
                      placeholder={t("auth.email")}
                      disabled={isSubmitting}
                      className="pl-10 h-11 sm:h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-base"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    {t("auth.password")}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      {...register("password")}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={t("auth.password")}
                      disabled={isSubmitting}
                      className="pl-10 pr-10 h-11 sm:h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-base"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors p-1"
                      disabled={isSubmitting}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) =>
                        setRememberMe(checked === true)
                      }
                      className="border-gray-300"
                    />
                    <Label htmlFor="remember" className="text-sm text-gray-600">
                      {t("auth.remember_me")}
                    </Label>
                  </div>
                  <Link
                    href="/forget-password"
                    className="text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors"
                  >
                    {t("auth.forgot_password")}
                  </Link>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 sm:h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-200 text-base"
                >
                  {isSubmitting ? (
                    <ButtonLoader size="sm" />
                  ) : (
                    t("auth.login_button")
                  )}
                </Button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">
                      {t("auth.or_continue_with") || "Hoặc tiếp tục với"}
                    </span>
                  </div>
                </div>

                {/* Google Sign In */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 sm:h-12 border-gray-300 hover:bg-gray-50 transition-all duration-200 text-base"
                  disabled={isSubmitting}
                >
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  <span className="hidden sm:inline">
                    {t("auth.login_with_google")}
                  </span>
                  <span className="sm:hidden">Google</span>
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Sign Up Link */}
          <div className="text-center px-4">
            <p className="text-sm text-gray-600">
              {t("auth.no_account")}{" "}
              <Link
                href="/register"
                className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
              >
                {t("auth.register_now")}
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Success Loader */}
      <Loader
        isLoading={showSuccessLoader}
        message=""
        size="md"
        overlay={true}
      />
    </>
  );
}

export default LoginForm;
