"use client";
import { usePathname, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function RoutingDebug() {
  const pathname = usePathname();
  const router = useRouter();

  const testRedirects = () => {
    console.log("=== Testing Redirects ===");

    // Test redirect to /me
    console.log("Testing redirect to /me...");
    router.push("/me");

    setTimeout(() => {
      console.log("Current pathname after /me:", window.location.pathname);

      // Test redirect to /vi/me
      console.log("Testing redirect to /vi/me...");
      router.push("/vi/me");

      setTimeout(() => {
        console.log("Current pathname after /vi/me:", window.location.pathname);
      }, 1000);
    }, 1000);
  };

  const testLocaleExtraction = () => {
    const locale = pathname.split("/")[1] || "vi";
    console.log("Current pathname:", pathname);
    console.log("Extracted locale:", locale);
    console.log("Redirect path would be:", `/${locale}/me`);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Routing Debug</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-gray-100 rounded">
          <h3 className="font-medium mb-2">Current Route Info:</h3>
          <p>
            <strong>Pathname:</strong> {pathname}
          </p>
          <p>
            <strong>Locale:</strong> {pathname.split("/")[1] || "vi"}
          </p>
          <p>
            <strong>Target Path:</strong> /{pathname.split("/")[1] || "vi"}/me
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={testRedirects} variant="outline">
            Test Redirects
          </Button>
          <Button onClick={testLocaleExtraction} variant="outline">
            Test Locale
          </Button>
        </div>

        <div className="text-sm text-gray-600">
          <p>Check console for debug information</p>
        </div>
      </CardContent>
    </Card>
  );
}
