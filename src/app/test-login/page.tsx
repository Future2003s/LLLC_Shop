import { SimpleLoginTest } from "@/components/test/SimpleLoginTest";
import { RoutingDebug } from "@/components/test/RoutingDebug";

export default function TestLoginPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold text-center mb-8">
        Test Login Functionality
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SimpleLoginTest />
        <RoutingDebug />
      </div>
    </div>
  );
}
