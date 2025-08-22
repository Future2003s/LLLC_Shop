import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, LogIn } from "lucide-react";
import Link from "next/link";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  loginUrl?: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  title = "Đăng ký thành công!",
  message = "Tài khoản của bạn đã được tạo thành công. Bây giờ bạn có thể đăng nhập để sử dụng dịch vụ.",
  loginUrl = "/login",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-xl font-semibold text-gray-900">
              {title}
            </CardTitle>
            <CardDescription className="text-gray-600 leading-relaxed">
              {message}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-3">
              <Link href={loginUrl}>
                <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]">
                  <LogIn className="w-4 h-4 mr-2" />
                  Đăng nhập ngay
                </Button>
              </Link>

              <Button
                variant="outline"
                className="w-full h-11 border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={onClose}
              >
                Đóng
              </Button>
            </div>

            <div className="text-center pt-2">
              <p className="text-xs text-gray-500">
                Hoặc bạn có thể đóng modal này và tiếp tục sử dụng trang
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuccessModal;
