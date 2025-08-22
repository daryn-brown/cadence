"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TestDebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>({});

  const testAPIs = async () => {
    const results: any = {};

    try {
      // Test user API
      console.log("Testing user API...");
      const userResponse = await fetch(
        "/api/auth/[...nextauth]?email=darynbrownpro@gmail.com"
      );
      results.userAPI = {
        status: userResponse.status,
        data: await userResponse.json(),
      };
    } catch (error) {
      results.userAPI = { error: error.message };
    }

    try {
      // Test contracts API
      console.log("Testing contracts API...");
      const contractsResponse = await fetch(
        "/api/contracts?userId=darynbrownpro@gmail.com&role=CONTRACTOR"
      );
      results.contractsAPI = {
        status: contractsResponse.status,
        data: await contractsResponse.json(),
      };
    } catch (error) {
      results.contractsAPI = { error: error.message };
    }

    try {
      // Test connect cycle API
      console.log("Testing connect cycle API...");
      const cycleResponse = await fetch("/api/connect-cycle/1");
      results.connectCycleAPI = {
        status: cycleResponse.status,
        data: await cycleResponse.json(),
      };
    } catch (error) {
      results.connectCycleAPI = { error: error.message };
    }

    setDebugInfo(results);
  };

  useEffect(() => {
    testAPIs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>API Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={testAPIs} className="mb-4">
              Refresh Debug Info
            </Button>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
