import { useMutation } from "@tanstack/react-query";
import { authApiRequest } from "@/apiRequests/auth";
import { LoginBodyType } from "@/shemaValidation/auth.schema";

const useLoginMutation = () => {
  return useMutation({
    mutationFn: (data: LoginBodyType) => authApiRequest.login(data),
  });
};

export { useLoginMutation };
