"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Users } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Intellibus Connect Cycle
          </h1>
          <p className="text-xl text-gray-600">
            Streamlined contractor performance management and feedback system
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Contractor Portal */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-6 w-6 text-blue-600" />
                Contractor Portal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Submit your Connect Cycle forms and view manager feedback.
              </p>
              <Link href="/contract/contractor-cadence">
                <Button className="w-full">Access Contractor Portal</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Manager Portal */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6 text-green-600" />
                Manager Portal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Review contractor submissions and provide feedback.
              </p>
              <Link href="/manager">
                <Button className="w-full">Access Manager Portal</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Test accounts: darynbrownpro@gmail.com (Contractor) |
            darynnbrown@gmail.com (Manager)
          </p>
        </div>
      </div>
    </div>
  );
}
