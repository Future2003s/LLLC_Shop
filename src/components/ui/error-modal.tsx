import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, X, LogIn } from "lucide-react";
import Link from "next/link";

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  errorDetails?: string;
  showLoginButton?: boolean;
  loginUrl?: string;
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  isOpen,
  onClose,
  title = "Đã xảy ra lỗi",
  message = "Có vấn đề xảy ra. Vui lòng thử lại.",
  errorDetails,
  showLoginButton = false,
  loginUrl = "/login",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-xl font-semibold text-gray-900">
              {title}
            </CardTitle>
            <CardDescription className="text-gray-600 leading-relaxed">
              {message}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {errorDetails && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-700 font-medium">
                  Chi tiết lỗi:
                </p>
                <p className="text-sm text-gray-600 mt-1">{errorDetails}</p>
              </div>
            )}

            <div className="flex flex-col space-y-3">
              {showLoginButton && (
                <Link href={loginUrl}>
                  <Button className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium">
                    <LogIn className="w-4 h-4 mr-2" />
                    Đăng nhập ngay
                  </Button>
                </Link>
              )}

              <Button
                variant="outline"
                className="w-full h-11 border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={onClose}
              >
                <X className="w-4 h-4 mr-2" />
                Đóng
              </Button>
            </div>

            <div className="text-center pt-2">
              <p className="text-xs text-gray-500">
                {showLoginButton
                  ? "Hoặc bạn có thể đóng modal này và thử lại với email khác"
                  : "Vui lòng kiểm tra lại thông tin và thử lại"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ErrorModal;
