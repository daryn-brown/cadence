"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestAuthPage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("CONTRACTOR");
  const [result, setResult] = useState<any>(null);

  const createUser = async () => {
    try {
      const response = await fetch("/api/auth/[...nextauth]", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, role }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error creating user:", error);
      setResult({ error: "Failed to create user" });
    }
  };

  const getUser = async () => {
    try {
      const response = await fetch(`/api/auth/[...nextauth]?email=${email}`);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error fetching user:", error);
      setResult({ error: "Failed to fetch user" });
    }
  };

  const createManager = () => {
    setEmail("darynnbrown@gmail.com");
    setRole("MANAGER");
  };

  const createContractor = () => {
    setEmail("darynbrownpro@gmail.com");
    setRole("CONTRACTOR");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Test Authentication</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
              />
            </div>

            <div>
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="CONTRACTOR">Contractor</option>
                <option value="MANAGER">Manager</option>
              </select>
            </div>

            <div className="flex gap-2">
              <Button onClick={createUser}>Create User</Button>
              <Button onClick={getUser} variant="outline">
                Get User
              </Button>
            </div>

            <div className="border-t pt-4">
              <Label className="text-sm font-medium">Quick Setup</Label>
              <div className="flex gap-2 mt-2">
                <Button onClick={createManager} variant="outline" size="sm">
                  Set Manager (darynnbrown@gmail.com)
                </Button>
                <Button onClick={createContractor} variant="outline" size="sm">
                  Set Contractor (darynbrownpro@gmail.com)
                </Button>
              </div>
            </div>

            {result && (
              <div className="mt-4 p-4 bg-gray-100 rounded">
                <pre>{JSON.stringify(result, null, 2)}</pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
