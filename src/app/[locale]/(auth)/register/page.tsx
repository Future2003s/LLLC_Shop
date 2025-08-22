"use client";
import {
  RegisterRequestBackend,
  RegisterRequestBackendType,
} from "@/shemaValidation/auth.schema";
import { envConfig } from "@/config";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  User,
  Mail,
  Phone,
  Lock,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { GoogleOAuthButton, FormField } from "@/components/auth";
import SuccessModal from "@/components/ui/success-modal";
import ErrorModal from "@/components/ui/error-modal";

// Type for form data that matches backend expectations
type FormData = RegisterRequestBackendType & {
  acceptTerms: boolean;
};

const SignUpPage = (): React.JSX.Element => {
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorInfo, setErrorInfo] = useState<{
    title: string;
    message: string;
    details?: string;
  }>({
    title: "",
    message: "",
    details: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterRequestBackendType>({
    resolver: zodResolver(RegisterRequestBackend),
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterRequestBackendType) => {
      const res = await fetch("http://localhost:8081/api/v1/auth/register", {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        method: "POST",
        body: JSON.stringify(data),
      });

      let result;
      try {
        const text = await res.text();
        result = text ? JSON.parse(text) : null;
      } catch (error) {
        console.error("JSON parse error:", error);
        result = null;
      }

      if (!res.ok) {
        console.log("LỖI GỌI API:", res.status, res.statusText);
        console.log("Response body:", result);

        // Handle specific error cases based on actual backend response structure
        if (result && result.error) {
          if (
            result.error.includes("already exists") ||
            result.error.includes("User already exists")
          ) {
            throw new Error("EMAIL_EXISTS");
          } else if (result.error.includes("validation")) {
            throw new Error("VALIDATION_ERROR");
          } else {
            throw new Error(result.error);
          }
        } else if (result && result.message) {
          // Fallback for message field if exists
          if (
            result.message.includes("already exists") ||
            result.message.includes("User already exists")
          ) {
            throw new Error("EMAIL_EXISTS");
          } else if (result.message.includes("validation")) {
            throw new Error("VALIDATION_ERROR");
          } else {
            throw new Error(result.message);
          }
        } else {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
      }

      return result;
    },
  });

  const handleDataRegister = async (data: RegisterRequestBackendType) => {
    if (!acceptTerms) {
      setErrorInfo({
        title: "Thiếu thông tin",
        message: "Vui lòng chấp nhận điều khoản sử dụng trước khi đăng ký.",
        details: "Bạn cần tích vào ô 'Tôi đồng ý với điều khoản sử dụng'",
      });
      setShowErrorModal(true);
      return;
    }

    console.log("Sending data to backend:", data);

    try {
      const result = await registerMutation.mutateAsync(data);
      console.log("Registration successful:", result);

      // Reset form
      reset();
      setAcceptTerms(false);

      // Show success modal
      setShowSuccessModal(true);
    } catch (error: any) {
      console.error("Registration failed:", error);

      // Handle specific error types
      if (error.message === "EMAIL_EXISTS") {
        setErrorInfo({
          title: "Email đã tồn tại",
          message: "Email này đã được sử dụng để đăng ký tài khoản trước đó.",
          details:
            "Vui lòng sử dụng email khác hoặc đăng nhập nếu bạn đã có tài khoản. Bạn có thể click vào nút 'Đăng nhập ngay' bên dưới.",
        });
      } else if (error.message === "VALIDATION_ERROR") {
        setErrorInfo({
          title: "Dữ liệu không hợp lệ",
          message: "Thông tin bạn nhập không đúng định dạng yêu cầu.",
          details:
            "Vui lòng kiểm tra lại email, mật khẩu và các trường bắt buộc khác. Mật khẩu phải có ít nhất 8 ký tự.",
        });
      } else if (error.message.includes("password")) {
        setErrorInfo({
          title: "Mật khẩu không hợp lệ",
          message: "Mật khẩu bạn nhập không đáp ứng yêu cầu bảo mật.",
          details:
            "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.",
        });
      } else if (error.message.includes("email")) {
        setErrorInfo({
          title: "Email không hợp lệ",
          message: "Định dạng email bạn nhập không đúng.",
          details: "Vui lòng nhập email theo định dạng: example@domain.com",
        });
      } else {
        setErrorInfo({
          title: "Đăng ký thất bại",
          message: "Không thể tạo tài khoản. Vui lòng thử lại sau.",
          details:
            error.message ||
            "Lỗi không xác định. Vui lòng kiểm tra kết nối mạng và thử lại.",
        });
      }

      setShowErrorModal(true);
    }
  };

  const handleGoogleSignUp = () => {
    // Implement Google OAuth here
    console.log("Google Sign Up clicked");
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-6">
              <img
                src={envConfig.NEXT_PUBLIC_URL_LOGO}
                alt="Logo"
                className="w-12 h-12 rounded-full"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Tạo tài khoản mới
            </h1>
            <p className="text-gray-600 text-lg">
              Bắt đầu hành trình ngọt ngào của bạn
            </p>
          </div>

          {/* Main Card */}
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-xl font-semibold text-center text-gray-900">
                Đăng ký
              </CardTitle>
              <CardDescription className="text-center text-gray-600">
                Nhập thông tin để tạo tài khoản
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 px-8 pb-8">
              {/* Google Sign Up Button */}
              <GoogleOAuthButton onClick={handleGoogleSignUp} />

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-gray-500 font-medium">
                    Hoặc đăng ký với email
                  </span>
                </div>
              </div>

              {/* Registration Form */}
              <form
                onSubmit={handleSubmit(handleDataRegister)}
                className="space-y-5"
              >
                {/* First Name */}
                <FormField
                  id="firstName"
                  label="Tên"
                  type="text"
                  placeholder="Văn"
                  icon={User}
                  error={errors.firstName?.message}
                  required
                  inputProps={register("firstName")}
                />

                {/* Last Name */}
                <FormField
                  id="lastName"
                  label="Họ"
                  type="text"
                  placeholder="Nguyễn"
                  icon={User}
                  error={errors.lastName?.message}
                  required
                  inputProps={register("lastName")}
                />

                {/* Email */}
                <FormField
                  id="email"
                  label="Email"
                  type="email"
                  placeholder="ban@email.com"
                  icon={Mail}
                  error={errors.email?.message}
                  required
                  inputProps={register("email")}
                />

                {/* Phone Number */}
                <FormField
                  id="phone"
                  label="Số điện thoại"
                  type="tel"
                  placeholder="0123456789"
                  icon={Phone}
                  optional
                  inputProps={register("phone")}
                />

                {/* Password */}
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Mật khẩu <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Tạo mật khẩu mạnh"
                      className="w-full pl-10 pr-10 h-12 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 transition-colors"
                      {...register("password")}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <svg
                        className="w-3 h-3"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start space-x-3 pt-2">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) =>
                      setAcceptTerms(checked as boolean)
                    }
                    className="mt-1"
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-gray-600 leading-relaxed"
                  >
                    Tôi đồng ý với{" "}
                    <Link
                      href="/terms"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      điều khoản sử dụng
                    </Link>{" "}
                    và{" "}
                    <Link
                      href="/privacy"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      chính sách bảo mật
                    </Link>
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                  disabled={isSubmitting || !acceptTerms}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang tạo tài khoản...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Tạo tài khoản
                    </>
                  )}
                </Button>
              </form>

              {/* Login Link */}
              <div className="text-center pt-4">
                <p className="text-sm text-gray-600">
                  Đã có tài khoản?{" "}
                  <Link
                    href="/login"
                    className="text-blue-600 hover:underline font-semibold transition-colors"
                  >
                    Đăng nhập ngay
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="text-center mt-8">
            <p className="text-xs text-gray-500 leading-relaxed">
              Bằng việc đăng ký, bạn đồng ý với các điều khoản và chính sách của
              chúng tôi. Thông tin của bạn sẽ được bảo mật tuyệt đối.
            </p>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        title="🎉 Đăng ký thành công!"
        message="Tài khoản của bạn đã được tạo thành công. Bây giờ bạn có thể đăng nhập để bắt đầu sử dụng dịch vụ."
        loginUrl="/login"
      />

      {/* Error Modal */}
      <ErrorModal
        isOpen={showErrorModal}
        onClose={handleCloseErrorModal}
        title={errorInfo.title}
        message={errorInfo.message}
        errorDetails={errorInfo.details}
        showLoginButton={errorInfo.title === "Email đã tồn tại"}
        loginUrl="/login"
      />
    </>
  );
};

export default SignUpPage;
