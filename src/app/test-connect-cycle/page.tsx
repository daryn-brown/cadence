"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestConnectCyclePage() {
  const [contractorEmail, setContractorEmail] = useState(
    "darynbrownpro@gmail.com"
  );
  const [managerEmail, setManagerEmail] = useState("darynnbrown@gmail.com");
  const [contractId, setContractId] = useState("");
  const [contracts, setContracts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [result, setResult] = useState(null);

  // Simulate logging in as contractor
  const loginAsContractor = async () => {
    try {
      const response = await fetch(
        `/api/auth/[...nextauth]?email=${contractorEmail}`
      );
      const data = await response.json();
      setCurrentUser(data.user);
      setResult({ message: "Logged in as contractor", user: data.user });
    } catch (error) {
      setResult({ error: "Failed to login as contractor" });
    }
  };

  // Create a test contract
  const createContract = async () => {
    try {
      const response = await fetch("/api/contracts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contractorId: contractorEmail,
          managerId: managerEmail,
          startDate: "2024-01-01",
          endDate: "2024-12-31",
        }),
      });

      const data = await response.json();
      setContractId(data.contract.id);
      setResult({ message: "Contract created", contract: data.contract });
    } catch (error) {
      setResult({ error: "Failed to create contract" });
    }
  };

  // Get contracts for current user
  const getContracts = async () => {
    if (!currentUser) return;

    try {
      const response = await fetch(
        `/api/contracts?userId=${currentUser.id}&role=${currentUser.role}`
      );
      const data = await response.json();
      setContracts(data.contracts);
      setResult({ message: "Contracts fetched", contracts: data.contracts });
    } catch (error) {
      setResult({ error: "Failed to fetch contracts" });
    }
  };

  // Get connect cycles for a contract
  const getConnectCycles = async (contractId: string) => {
    try {
      const response = await fetch(`/api/cadence-cycle/${contractId}`);
      const data = await response.json();
      setResult({
        message: "Connect cycles fetched",
        cycles: data.cycles,
        goals: data.goals,
      });
    } catch (error) {
      setResult({ error: "Failed to fetch connect cycles" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Test Connect Cycle - Contractor View</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Contractor Email</Label>
                <Input
                  value={contractorEmail}
                  onChange={(e) => setContractorEmail(e.target.value)}
                />
              </div>
              <div>
                <Label>Manager Email</Label>
                <Input
                  value={managerEmail}
                  onChange={(e) => setManagerEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={loginAsContractor}>Login as Contractor</Button>
              <Button onClick={createContract} variant="outline">
                Create Test Contract
              </Button>
              <Button onClick={getContracts} variant="outline">
                Get My Contracts
              </Button>
            </div>

            {currentUser && (
              <div className="p-4 bg-blue-50 rounded">
                <strong>Logged in as:</strong> {currentUser.email} (
                {currentUser.role})
              </div>
            )}

            {contracts.length > 0 && (
              <div className="space-y-2">
                <Label>My Contracts:</Label>
                {contracts.map((contract: any) => (
                  <div key={contract.id} className="p-3 border rounded">
                    <div>Contract ID: {contract.id}</div>
                    <div>Manager: {contract.manager?.email}</div>
                    <div>Status: {contract.status}</div>
                    <Button
                      onClick={() => getConnectCycles(contract.id)}
                      size="sm"
                      variant="outline"
                    >
                      View Connect Cycles
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>API Response</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
