"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function ManagerReviewPage({
  params,
}: {
  params: { contractId: string; cycleId: string };
}) {
  const [connectCycle, setConnectCycle] = useState<any>(null);
  const [contract, setContract] = useState<any>(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch connect cycle data
        const response = await fetch(`/api/connect-cycle/${params.contractId}`);
        const data = await response.json();

        const cycle = data.cycles.find(
          (c: any) => c.id.toString() === params.cycleId
        );
        setConnectCycle(cycle);

        // Fetch contract data
        const contractResponse = await fetch(
          `/api/contracts?userId=${params.contractId}&role=MANAGER`
        );
        const contractData = await contractResponse.json();
        if (contractData.contracts && contractData.contracts.length > 0) {
          setContract(contractData.contracts[0]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.contractId, params.cycleId]);

  const handleSubmitComment = async () => {
    if (!comment.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch(
        `/api/connect-cycle/${params.contractId}/${params.cycleId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            authorId: "darynnbrown@gmail.com", // Manager's email as ID
            content: comment,
          }),
        }
      );

      const result = await response.json();
      if (result.success) {
        alert("Comment submitted successfully!");
        setComment("");
        // Refresh the page to show the new comment
        window.location.reload();
      } else {
        alert("Failed to submit comment");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Failed to submit comment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading review data...</p>
        </div>
      </div>
    );
  }

  if (!connectCycle) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-4xl">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-gray-500">
                Connect cycle not found.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Review Initial Connect
          </h1>
          <p className="mt-2 text-gray-600">
            Review and provide feedback on the contractor's Initial Connect
            submission
          </p>
        </div>

        <div className="grid gap-6">
          {/* Contractor Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contractor Information</CardTitle>
            </CardHeader>
            <CardContent>
              {contract && (
                <div className="space-y-2">
                  <p>
                    <strong>Contractor:</strong>{" "}
                    {contract.contractor?.name || contract.contractor?.email}
                  </p>
                  <p>
                    <strong>Contract ID:</strong> {params.contractId}
                  </p>
                  <p>
                    <strong>Connect Cycle:</strong> {connectCycle.type}
                  </p>
                  <p>
                    <strong>Submitted:</strong>{" "}
                    {new Date(connectCycle.meetingDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reflections */}
          <Card>
            <CardHeader>
              <CardTitle>Contractor Reflections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {connectCycle.reflections?.map(
                  (reflection: any, index: number) => (
                    <div key={reflection.id} className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">
                        {reflection.question}
                      </h4>
                      <p className="text-gray-700">
                        {reflection.response || "No response provided"}
                      </p>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>

          {/* Goals */}
          <Card>
            <CardHeader>
              <CardTitle>Goals & Objectives</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {contract?.goals?.map((goal: any) => (
                  <div key={goal.id} className="p-3 border rounded-lg">
                    <h4 className="font-semibold">{goal.description}</h4>
                    {goal.metric && (
                      <p className="text-sm text-gray-600 mt-1">
                        Metric: {goal.metric}
                      </p>
                    )}
                    <Badge className="mt-2">{goal.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Add Comment */}
          <Card>
            <CardHeader>
              <CardTitle>Add Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="comment">Your Feedback</Label>
                  <Textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Provide constructive feedback on the contractor's Initial Connect..."
                    className="mt-1"
                    rows={4}
                  />
                </div>
                <Button
                  onClick={handleSubmitComment}
                  disabled={submitting || !comment.trim()}
                >
                  {submitting ? "Submitting..." : "Submit Feedback"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Existing Comments */}
          {connectCycle.comments && connectCycle.comments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Previous Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {connectCycle.comments.map((comment: any) => (
                    <div key={comment.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-sm">
                          {comment.author.name || comment.author.email}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
