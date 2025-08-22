"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TranslationStats as TranslationStatsInterface } from "@/apiRequests/translations";
import {
  Globe,
  FileText,
  CheckCircle,
  XCircle,
  TrendingUp,
} from "lucide-react";

interface TranslationStatsProps {
  stats: TranslationStatsInterface;
}

export function TranslationStats({ stats }: TranslationStatsProps) {
  const { byCategory, total, supportedLanguages, categories } = stats;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Translations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng bản dịch</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total.total}</div>
            <p className="text-xs text-muted-foreground">
              Tất cả bản dịch trong hệ thống
            </p>
          </CardContent>
        </Card>

        {/* Active Translations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Đang hoạt động
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {total.active}
            </div>
            <p className="text-xs text-muted-foreground">
              Bản dịch đang được sử dụng
            </p>
          </CardContent>
        </Card>

        {/* Inactive Translations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Không hoạt động
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {total.inactive}
            </div>
            <p className="text-xs text-muted-foreground">
              Bản dịch đã bị vô hiệu hóa
            </p>
          </CardContent>
        </Card>

        {/* Supported Languages */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ngôn ngữ hỗ trợ
            </CardTitle>
            <Globe className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {supportedLanguages.length}
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {supportedLanguages.map((lang: string) => (
                <Badge key={lang} variant="secondary" className="text-xs">
                  {lang.toUpperCase()}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Phân tích theo danh mục
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {byCategory.map((category: any) => (
                <div
                  key={category._id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <h4 className="font-medium capitalize">{category._id}</h4>
                    <p className="text-sm text-muted-foreground">
                      Tổng: {category.count}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="text-xs">
                        {category.active} hoạt động
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {category.inactive} không hoạt động
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
