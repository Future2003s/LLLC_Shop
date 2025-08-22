"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, UserPlus } from "lucide-react";

type User = {
  id: string;
  fullName: string;
  email: string;
  role: "ADMIN" | "STAFF" | "CUSTOMER";
  status: "ACTIVE" | "DISABLED";
};

export default function AccountsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/users`, { cache: "no-store" });
        let data: any = null;
        if (res.ok) {
          const text = await res.text();
          data = text ? JSON.parse(text) : null;
        }
        const list = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
          ? data
          : [];
        setUsers(
          list.map((u: any) => ({
            id: u.id,
            fullName: u.fullName || u.name,
            email: u.email,
            role: u.role || "CUSTOMER",
            status: u.status || "ACTIVE",
          }))
        );
      } catch {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(q.toLowerCase()) ||
      u.email.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tài khoản</h1>
          <p className="text-gray-600 mt-1">Quản lý người dùng và phân quyền</p>
        </div>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Thêm tài khoản
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Tìm kiếm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Tìm theo tên hoặc email"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách người dùng ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Tên</th>
                  <th className="text-left py-3 px-4 font-medium">Email</th>
                  <th className="text-left py-3 px-4 font-medium">Vai trò</th>
                  <th className="text-left py-3 px-4 font-medium">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{u.fullName}</td>
                    <td className="py-3 px-4">{u.email}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{u.role}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          u.status === "ACTIVE" ? "default" : "secondary"
                        }
                      >
                        {u.status === "ACTIVE" ? "Hoạt động" : "Tạm khóa"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500">
                Không có người dùng
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
