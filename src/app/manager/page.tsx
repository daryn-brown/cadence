"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  ChevronRight,
  User,
  Target,
  MessageSquare,
  Star,
  Send,
} from "lucide-react";

export default function ManagerPortal() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContract, setSelectedContract] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  // Fetch manager's contracts
  useEffect(() => {
    const fetchManagerContracts = async () => {
      try {
        const managerEmail = "darynnbrown@gmail.com";

        // Get manager user data
        const userResponse = await fetch(
          `/api/auth/[...nextauth]?email=${managerEmail}`
        );
        const userData = await userResponse.json();

        if (userData.user) {
          // Get manager's contracts
          const contractsResponse = await fetch(
            `/api/contracts?userId=${userData.user.id}&role=MANAGER`
          );
          const contractsData = await contractsResponse.json();
          setContracts(contractsData.contracts || []);
        }
      } catch (error) {
        console.error("Error fetching manager contracts:", error);
        // Fallback to mock data
        setContracts([
          {
            id: 1,
            contractor: {
              name: "darynbrownpro",
              email: "darynbrownpro@gmail.com",
            },
            manager: { name: "darynnbrown", email: "darynnbrown@gmail.com" },
            startDate: "2024-01-15",
            endDate: "2024-12-15",
            connectCycles: [],
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchManagerContracts();
  }, []);

  const handleAddComment = async (cycleId: number) => {
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      const response = await fetch(
        `/api/connect-cycle/${selectedContract.id}/${cycleId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: commentText,
            authorId: "darynnbrown@gmail.com", // Manager's email as ID
          }),
        }
      );

      const result = await response.json();
      if (result.success) {
        setCommentText("");
        // Refresh the contract data
        const contractsResponse = await fetch(
          `/api/contracts?userId=darynnbrown@gmail.com&role=MANAGER`
        );
        const contractsData = await contractsResponse.json();
        setContracts(contractsData.contracts || []);
        setSelectedContract(
          contractsData.contracts?.find((c) => c.id === selectedContract.id)
        );
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const getConnectCycle = (type: string) => {
    return selectedContract?.connectCycles?.find(
      (cycle: any) => cycle.type === type
    );
  };

  const getComments = (cycleId: number) => {
    const cycle = selectedContract?.connectCycles?.find(
      (c: any) => c.id === cycleId
    );
    return cycle?.comments || [];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading manager data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manager Portal</h1>
          <p className="mt-2 text-gray-600">
            Review contractor submissions and provide feedback
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Contract List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Your Contracts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {contracts.map((contract: any) => (
                    <div
                      key={contract.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedContract?.id === contract.id
                          ? "border-blue-500 bg-blue-50"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedContract(contract)}
                    >
                      <h4 className="font-medium text-gray-900">
                        {contract.contractor.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {new Date(contract.startDate).toLocaleDateString()} -{" "}
                        {new Date(contract.endDate).toLocaleDateString()}
                      </p>
                      <div className="flex gap-1 mt-2">
                        {contract.connectCycles?.map((cycle: any) => (
                          <Badge key={cycle.id} className="text-xs">
                            {cycle.type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Contract Details */}
          <div className="lg:col-span-2">
            {selectedContract ? (
              <div className="space-y-6">
                {/* Contractor Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {selectedContract.contractor.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Contract Period:{" "}
                      {new Date(
                        selectedContract.startDate
                      ).toLocaleDateString()}{" "}
                      -{" "}
                      {new Date(selectedContract.endDate).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>

                {/* Connect Cycles */}
                <div className="space-y-4">
                  {/* Initial Connect */}
                  <Card>
                    <Collapsible>
                      <CollapsibleTrigger asChild>
                        <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                          <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Target className="h-5 w-5 text-blue-600" />
                              Initial Connect
                              {getConnectCycle("INITIAL") && (
                                <Badge className="bg-green-100 text-green-800">
                                  Submitted
                                </Badge>
                              )}
                            </div>
                            <ChevronRight className="h-4 w-4" />
                          </CardTitle>
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="space-y-4">
                          {getConnectCycle("INITIAL") ? (
                            <div className="space-y-4">
                              <div className="p-4 bg-blue-50 rounded-lg">
                                <h4 className="font-semibold text-blue-900 mb-2">
                                  Contractor Submission
                                </h4>
                                <p className="text-blue-700">
                                  Initial Connect has been submitted and is
                                  ready for review.
                                </p>
                              </div>

                              {/* Add Comment */}
                              <div className="space-y-2">
                                <Label htmlFor="comment">
                                  Add Comment (Optional)
                                </Label>
                                <Textarea
                                  id="comment"
                                  value={commentText}
                                  onChange={(e) =>
                                    setCommentText(e.target.value)
                                  }
                                  placeholder="Provide feedback or ask questions..."
                                  className="min-h-[100px]"
                                />
                                <Button
                                  onClick={() =>
                                    handleAddComment(
                                      getConnectCycle("INITIAL").id
                                    )
                                  }
                                  disabled={
                                    submittingComment || !commentText.trim()
                                  }
                                  className="w-full md:w-auto"
                                >
                                  <Send className="h-4 w-4 mr-2" />
                                  {submittingComment
                                    ? "Sending..."
                                    : "Send Comment"}
                                </Button>
                              </div>

                              {/* Display Comments */}
                              {getComments(getConnectCycle("INITIAL").id)
                                .length > 0 && (
                                <div className="space-y-3">
                                  <h4 className="font-semibold">Comments</h4>
                                  {getComments(
                                    getConnectCycle("INITIAL").id
                                  ).map((comment: any) => (
                                    <div
                                      key={comment.id}
                                      className="p-3 bg-gray-50 rounded-lg"
                                    >
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="font-medium text-sm">
                                          {comment.author.name ||
                                            comment.author.email}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                          {new Date(
                                            comment.createdAt
                                          ).toLocaleDateString()}
                                        </span>
                                      </div>
                                      <p className="text-gray-700">
                                        {comment.content}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : (
                            <p className="text-gray-500 text-center py-4">
                              No Initial Connect submission yet.
                            </p>
                          )}
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>

                  {/* Midpoint Connect */}
                  <Card>
                    <Collapsible>
                      <CollapsibleTrigger asChild>
                        <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                          <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <MessageSquare className="h-5 w-5 text-orange-600" />
                              Midpoint Connect
                              {getConnectCycle("MIDPOINT") && (
                                <Badge className="bg-green-100 text-green-800">
                                  Submitted
                                </Badge>
                              )}
                            </div>
                            <ChevronRight className="h-4 w-4" />
                          </CardTitle>
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="space-y-4">
                          {getConnectCycle("MIDPOINT") ? (
                            <div className="space-y-4">
                              <div className="p-4 bg-orange-50 rounded-lg">
                                <h4 className="font-semibold text-orange-900 mb-2">
                                  Contractor Submission
                                </h4>
                                <p className="text-orange-700">
                                  Midpoint Connect has been submitted and is
                                  ready for review.
                                </p>
                              </div>

                              {/* Add Comment */}
                              <div className="space-y-2">
                                <Label htmlFor="comment-midpoint">
                                  Add Comment (Optional)
                                </Label>
                                <Textarea
                                  id="comment-midpoint"
                                  value={commentText}
                                  onChange={(e) =>
                                    setCommentText(e.target.value)
                                  }
                                  placeholder="Provide feedback or ask questions..."
                                  className="min-h-[100px]"
                                />
                                <Button
                                  onClick={() =>
                                    handleAddComment(
                                      getConnectCycle("MIDPOINT").id
                                    )
                                  }
                                  disabled={
                                    submittingComment || !commentText.trim()
                                  }
                                  className="w-full md:w-auto"
                                >
                                  <Send className="h-4 w-4 mr-2" />
                                  {submittingComment
                                    ? "Sending..."
                                    : "Send Comment"}
                                </Button>
                              </div>

                              {/* Display Comments */}
                              {getComments(getConnectCycle("MIDPOINT").id)
                                .length > 0 && (
                                <div className="space-y-3">
                                  <h4 className="font-semibold">Comments</h4>
                                  {getComments(
                                    getConnectCycle("MIDPOINT").id
                                  ).map((comment: any) => (
                                    <div
                                      key={comment.id}
                                      className="p-3 bg-gray-50 rounded-lg"
                                    >
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="font-medium text-sm">
                                          {comment.author.name ||
                                            comment.author.email}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                          {new Date(
                                            comment.createdAt
                                          ).toLocaleDateString()}
                                        </span>
                                      </div>
                                      <p className="text-gray-700">
                                        {comment.content}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : (
                            <p className="text-gray-500 text-center py-4">
                              No Midpoint Connect submission yet.
                            </p>
                          )}
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>

                  {/* Final Connect */}
                  <Card>
                    <Collapsible>
                      <CollapsibleTrigger asChild>
                        <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                          <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Star className="h-5 w-5 text-green-600" />
                              Final Connect
                              {getConnectCycle("FINAL") && (
                                <Badge className="bg-green-100 text-green-800">
                                  Submitted
                                </Badge>
                              )}
                            </div>
                            <ChevronRight className="h-4 w-4" />
                          </CardTitle>
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="space-y-4">
                          {getConnectCycle("FINAL") ? (
                            <div className="space-y-4">
                              <div className="p-4 bg-green-50 rounded-lg">
                                <h4 className="font-semibold text-green-900 mb-2">
                                  Contractor Submission
                                </h4>
                                <p className="text-green-700">
                                  Final Connect has been submitted and is ready
                                  for review.
                                </p>
                              </div>

                              {/* Add Comment */}
                              <div className="space-y-2">
                                <Label htmlFor="comment-final">
                                  Add Comment (Optional)
                                </Label>
                                <Textarea
                                  id="comment-final"
                                  value={commentText}
                                  onChange={(e) =>
                                    setCommentText(e.target.value)
                                  }
                                  placeholder="Provide feedback or ask questions..."
                                  className="min-h-[100px]"
                                />
                                <Button
                                  onClick={() =>
                                    handleAddComment(
                                      getConnectCycle("FINAL").id
                                    )
                                  }
                                  disabled={
                                    submittingComment || !commentText.trim()
                                  }
                                  className="w-full md:w-auto"
                                >
                                  <Send className="h-4 w-4 mr-2" />
                                  {submittingComment
                                    ? "Sending..."
                                    : "Send Comment"}
                                </Button>
                              </div>

                              {/* Display Comments */}
                              {getComments(getConnectCycle("FINAL").id).length >
                                0 && (
                                <div className="space-y-3">
                                  <h4 className="font-semibold">Comments</h4>
                                  {getComments(getConnectCycle("FINAL").id).map(
                                    (comment: any) => (
                                      <div
                                        key={comment.id}
                                        className="p-3 bg-gray-50 rounded-lg"
                                      >
                                        <div className="flex items-center gap-2 mb-2">
                                          <span className="font-medium text-sm">
                                            {comment.author.name ||
                                              comment.author.email}
                                          </span>
                                          <span className="text-xs text-gray-500">
                                            {new Date(
                                              comment.createdAt
                                            ).toLocaleDateString()}
                                          </span>
                                        </div>
                                        <p className="text-gray-700">
                                          {comment.content}
                                        </p>
                                      </div>
                                    )
                                  )}
                                </div>
                              )}
                            </div>
                          ) : (
                            <p className="text-gray-500 text-center py-4">
                              No Final Connect submission yet.
                            </p>
                          )}
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500">
                    Select a contract to view details
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
