import { RoleValues } from "@/constants/type";
import { z } from "zod";

export const authSchema = z
  .object({
    email: z
      .string()
      .email("Email không đúng định dạng")
      .min(4, "Email yêu cầu tối thiểu 4 ký tự"),
    password: z.string().min(6, "Mật khẩu yêu cầu tối thiểu 6 ký tự"),
  })
  .strict();

// Schema mở rộng cho login với optional fields
export const loginSchema = z.object({
  email: z
    .string()
    .email("Email không đúng định dạng")
    .min(4, "Email yêu cầu tối thiểu 4 ký tự"),
  password: z.string().min(6, "Mật khẩu yêu cầu tối thiểu 6 ký tự"),
  rememberMe: z.boolean().optional().default(false),
  deviceInfo: z
    .object({
      userAgent: z.string().optional(),
      platform: z.enum(["web", "mobile", "desktop"]).optional().default("web"),
    })
    .optional(),
});

export const LoginRes = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    user: z.object({
      _id: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      email: z.string(),
      role: z.enum(RoleValues),
      avatar: z.string().optional(),
      isActive: z.boolean(),
      isEmailVerified: z.boolean(),
      lastLogin: z.string().optional(),
      preferences: z
        .object({
          language: z.string().default("vi"),
          currency: z.string().default("VND"),
          notifications: z.object({
            email: z.boolean().default(true),
            push: z.boolean().default(true),
          }),
        })
        .optional(),
    }),
    token: z.string(),
    refreshToken: z.string(),
    expiresIn: z.number().optional(),
    permissions: z.array(z.string()).optional(),
  }),
});

export const RegisterRequest = z.object({
  fullName: z.string().min(3, "Họ Và Tên Tối Thiểu Từ 3 Ký Tự Trở Lên"),
  email: z.string().email("Chưa Đúng Định Dạng Email"),
  password: z.string().min(6, "Mật Khẩu Yêu Cầu Tối Thiểu 6 Ký Tự"),
});

// New schema for backend compatibility
export const RegisterRequestBackend = z.object({
  firstName: z
    .string()
    .min(2, "Tên phải có ít nhất 2 ký tự")
    .max(50, "Tên không được quá 50 ký tự"),
  lastName: z
    .string()
    .min(2, "Họ phải có ít nhất 2 ký tự")
    .max(50, "Họ không được quá 50 ký tự"),
  email: z.string().email("Email không đúng định dạng"),
  password: z
    .string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .max(128, "Mật khẩu không được quá 128 ký tự"),
  phone: z.string().optional(),
});

export type RegisterRequestType = z.infer<typeof RegisterRequest>;
export type RegisterRequestBackendType = z.infer<typeof RegisterRequestBackend>;
export type LoginResType = z.infer<typeof LoginRes>;
export type LoginBodyType = z.infer<typeof authSchema>;
export type ExtendedLoginBodyType = z.infer<typeof loginSchema>;
