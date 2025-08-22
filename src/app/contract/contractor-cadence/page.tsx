"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  ChevronRight,
  Calendar,
  User,
  Target,
  MessageSquare,
  Star,
} from "lucide-react";

export default function ContractorCadence() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    initial: false,
    midpoint: false,
    final: false,
  });

  const [contractorData, setContractorData] = useState({
    name: "Loading...",
    startDate: "Loading...",
    endDate: "Loading...",
    position: "Loading...",
  });

  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contractId, setContractId] = useState("");
  const [connectCycles, setConnectCycles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Form data
  const [initialConnectData, setInitialConnectData] = useState({
    goals: "",
    expectations: "",
    resources: "",
  });

  const [midpointConnectData, setMidpointConnectData] = useState({
    progress: "",
    challenges: "",
    adjustments: "",
  });

  const [finalConnectData, setFinalConnectData] = useState({
    achievements: "",
    feedback: "",
    lessons: "",
    recommendations: "",
  });

  // Fetch contractor data from the database
  useEffect(() => {
    const fetchContractorData = async () => {
      try {
        // For testing, we'll use the contractor email directly
        const contractorEmail = "darynbrownpro@gmail.com";

        // Get contractor user data
        const userResponse = await fetch(
          `/api/auth/[...nextauth]?email=${contractorEmail}`
        );
        const userData = await userResponse.json();

        if (userData.user) {
          // Get contractor's contracts
          const contractsResponse = await fetch(
            `/api/contracts?userId=${userData.user.id}&role=CONTRACTOR`
          );
          const contractsData = await contractsResponse.json();

          if (contractsData.contracts && contractsData.contracts.length > 0) {
            const contract = contractsData.contracts[0]; // Get the first contract
            setContractId(contract.id.toString());

            setContractorData({
              name: userData.user.name || contractorEmail.split("@")[0],
              startDate: new Date(contract.startDate).toLocaleDateString(),
              endDate: new Date(contract.endDate).toLocaleDateString(),
              position: "Contractor", // You can update this based on your needs
            });

            // Set goals from the contract
            if (contract.goals) {
              setGoals(
                contract.goals.map((goal: any, index: number) => ({
                  id: goal.id,
                  title: goal.description,
                  status: goal.status.toLowerCase().replace("_", "-"),
                  priority: "medium", // You can add priority to your goals model if needed
                }))
              );
            }

            // Fetch connect cycles
            const cyclesResponse = await fetch(
              `/api/connect-cycle/${contract.id}`
            );
            const cyclesData = await cyclesResponse.json();
            setConnectCycles(cyclesData.cycles || []);
          }
        }
      } catch (error) {
        console.error("Error fetching contractor data:", error);
        // Fallback to mock data for testing
        setContractorData({
          name: "darynbrownpro",
          startDate: "January 15, 2024",
          endDate: "December 15, 2024",
          position: "Senior Frontend Developer",
        });

        // Mock goals
        setGoals([
          {
            id: 1,
            title: "Complete React migration project",
            status: "in-progress",
            priority: "high",
          },
          {
            id: 2,
            title: "Mentor junior developers",
            status: "pending",
            priority: "medium",
          },
          {
            id: 3,
            title: "Implement new design system",
            status: "completed",
            priority: "high",
          },
        ]);

        setConnectCycles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContractorData();
  }, []);

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleInitialConnectSubmit = async () => {
    if (!contractId) {
      // For testing without database, just show success
      alert(
        "Initial Connect submitted successfully! (Mock mode - no database connection)"
      );
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/connect-cycle/${contractId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "INITIAL",
          reflections: [
            {
              question: "What are your expectations for this contract?",
              response: initialConnectData.expectations,
            },
            {
              question: "What challenges do you anticipate?",
              response: initialConnectData.goals,
            },
            {
              question: "What support do you need?",
              response: initialConnectData.resources,
            },
          ],
          goals: [
            {
              description: initialConnectData.goals,
              metric: "Success criteria to be defined",
            },
          ],
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert(
          "Initial Connect submitted successfully! Check your email for confirmation and details."
        );
        // Refresh the page to show updated data
        window.location.reload();
      } else {
        alert("Failed to submit Initial Connect");
      }
    } catch (error) {
      console.error("Error submitting Initial Connect:", error);
      alert("Failed to submit Initial Connect");
    } finally {
      setSubmitting(false);
    }
  };

  const handleMidpointConnectSubmit = async () => {
    if (!contractId) {
      alert(
        "Midpoint Connect submitted successfully! (Mock mode - no database connection)"
      );
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/connect-cycle/${contractId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "MIDPOINT",
          reflections: [
            {
              question: "What progress have you made on your goals?",
              response: midpointConnectData.progress,
            },
            {
              question:
                "What challenges have you encountered and how did you address them?",
              response: midpointConnectData.challenges,
            },
            {
              question: "What goal adjustments are needed?",
              response: midpointConnectData.adjustments,
            },
          ],
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert(
          "Midpoint Connect submitted successfully! Check your email for confirmation."
        );
        window.location.reload();
      } else {
        alert("Failed to submit Midpoint Connect");
      }
    } catch (error) {
      console.error("Error submitting Midpoint Connect:", error);
      alert("Failed to submit Midpoint Connect");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinalConnectSubmit = async () => {
    if (!contractId) {
      alert(
        "Final Connect submitted successfully! (Mock mode - no database connection)"
      );
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/connect-cycle/${contractId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "FINAL",
          reflections: [
            {
              question: "What are your key achievements?",
              response: finalConnectData.achievements,
            },
            {
              question: "What is your overall feedback?",
              response: finalConnectData.feedback,
            },
            {
              question: "What lessons have you learned?",
              response: finalConnectData.lessons,
            },
            {
              question: "What are your future recommendations?",
              response: finalConnectData.recommendations,
            },
          ],
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert(
          "Final Connect submitted successfully! Check your email for confirmation."
        );
        window.location.reload();
      } else {
        alert("Failed to submit Final Connect");
      }
    } catch (error) {
      console.error("Error submitting Final Connect:", error);
      alert("Failed to submit Final Connect");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "low":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getConnectCycle = (type: string) => {
    return connectCycles.find((cycle: any) => cycle.type === type);
  };

  const getComments = (cycleId: number) => {
    const cycle = connectCycles.find((c: any) => c.id === cycleId);
    return cycle?.comments || [];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading contractor data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Contractor Cadence
          </h1>
          <p className="mt-2 text-gray-600">
            Track progress and maintain regular touchpoints throughout the
            contract period
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Contractor Information */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Contractor Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Name
                  </Label>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {contractorData.name}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Position
                  </Label>
                  <p className="mt-1 text-gray-900">
                    {contractorData.position}
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Contract Period
                    </Label>
                    <p className="text-sm text-gray-900">
                      {contractorData.startDate} - {contractorData.endDate}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Connect Cycle Sections */}
          <div className="lg:col-span-2 space-y-6">
            {/* Initial Connect */}
            <Card>
              <Collapsible
                open={openSections.initial}
                onOpenChange={() => toggleSection("initial")}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-blue-600" />
                        Initial Connect
                        {getConnectCycle("INITIAL") && (
                          <Badge className="bg-green-100 text-green-800">
                            Completed
                          </Badge>
                        )}
                      </div>
                      {openSections.initial ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4">
                    {!getConnectCycle("INITIAL") ? (
                      // Form for submitting Initial Connect
                      <>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <Label htmlFor="initial-goals">Primary Goals</Label>
                            <Textarea
                              id="initial-goals"
                              value={initialConnectData.goals}
                              onChange={(e) =>
                                setInitialConnectData((prev) => ({
                                  ...prev,
                                  goals: e.target.value,
                                }))
                              }
                              placeholder="Define key objectives for the contract period..."
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="initial-expectations">
                              Expectations
                            </Label>
                            <Textarea
                              id="initial-expectations"
                              value={initialConnectData.expectations}
                              onChange={(e) =>
                                setInitialConnectData((prev) => ({
                                  ...prev,
                                  expectations: e.target.value,
                                }))
                              }
                              placeholder="Outline expectations and success criteria..."
                              className="mt-1"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="initial-resources">
                            Required Resources
                          </Label>
                          <Input
                            id="initial-resources"
                            value={initialConnectData.resources}
                            onChange={(e) =>
                              setInitialConnectData((prev) => ({
                                ...prev,
                                resources: e.target.value,
                              }))
                            }
                            placeholder="Tools, access, training needed..."
                            className="mt-1"
                          />
                        </div>
                        <Button
                          onClick={handleInitialConnectSubmit}
                          disabled={submitting}
                          className="w-full md:w-auto"
                        >
                          {submitting
                            ? "Submitting..."
                            : "Save Initial Connect"}
                        </Button>
                      </>
                    ) : (
                      // Display submitted Initial Connect and comments
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-semibold text-blue-900 mb-2">
                            Initial Connect Submitted
                          </h4>
                          <p className="text-blue-700">
                            Your Initial Connect has been submitted and is under
                            review by your manager.
                          </p>
                        </div>

                        {/* Display comments */}
                        {getComments(getConnectCycle("INITIAL").id).length >
                          0 && (
                          <div className="space-y-3">
                            <h4 className="font-semibold">Manager Feedback</h4>
                            {getComments(getConnectCycle("INITIAL").id).map(
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
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Midpoint Connect */}
            <Card>
              <Collapsible
                open={openSections.midpoint}
                onOpenChange={() => toggleSection("midpoint")}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-orange-600" />
                        Midpoint Connect
                        {getConnectCycle("MIDPOINT") && (
                          <Badge className="bg-green-100 text-green-800">
                            Completed
                          </Badge>
                        )}
                      </div>
                      {openSections.midpoint ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="midpoint-progress">
                          Progress Update
                        </Label>
                        <Textarea
                          id="midpoint-progress"
                          value={midpointConnectData.progress}
                          onChange={(e) =>
                            setMidpointConnectData((prev) => ({
                              ...prev,
                              progress: e.target.value,
                            }))
                          }
                          placeholder="Describe progress made on goals..."
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="midpoint-challenges">
                          Challenges & Solutions
                        </Label>
                        <Textarea
                          id="midpoint-challenges"
                          value={midpointConnectData.challenges}
                          onChange={(e) =>
                            setMidpointConnectData((prev) => ({
                              ...prev,
                              challenges: e.target.value,
                            }))
                          }
                          placeholder="Any obstacles encountered and how they were addressed..."
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="midpoint-adjustments">
                        Goal Adjustments
                      </Label>
                      <Textarea
                        id="midpoint-adjustments"
                        value={midpointConnectData.adjustments}
                        onChange={(e) =>
                          setMidpointConnectData((prev) => ({
                            ...prev,
                            adjustments: e.target.value,
                          }))
                        }
                        placeholder="Any changes needed to original goals or timeline..."
                        className="mt-1"
                      />
                    </div>
                    <Button
                      onClick={handleMidpointConnectSubmit}
                      disabled={submitting}
                      className="w-full md:w-auto"
                    >
                      {submitting ? "Submitting..." : "Save Midpoint Connect"}
                    </Button>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Final Connect */}
            <Card>
              <Collapsible
                open={openSections.final}
                onOpenChange={() => toggleSection("final")}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-green-600" />
                        Final Connect
                        {getConnectCycle("FINAL") && (
                          <Badge className="bg-green-100 text-green-800">
                            Completed
                          </Badge>
                        )}
                      </div>
                      {openSections.final ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="final-achievements">
                          Key Achievements
                        </Label>
                        <Textarea
                          id="final-achievements"
                          value={finalConnectData.achievements}
                          onChange={(e) =>
                            setFinalConnectData((prev) => ({
                              ...prev,
                              achievements: e.target.value,
                            }))
                          }
                          placeholder="Summarize major accomplishments..."
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="final-feedback">Overall Feedback</Label>
                        <Textarea
                          id="final-feedback"
                          value={finalConnectData.feedback}
                          onChange={(e) =>
                            setFinalConnectData((prev) => ({
                              ...prev,
                              feedback: e.target.value,
                            }))
                          }
                          placeholder="Performance feedback and observations..."
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="final-lessons">Lessons Learned</Label>
                        <Textarea
                          id="final-lessons"
                          value={finalConnectData.lessons}
                          onChange={(e) =>
                            setFinalConnectData((prev) => ({
                              ...prev,
                              lessons: e.target.value,
                            }))
                          }
                          placeholder="Key takeaways from the contract period..."
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="final-recommendations">
                          Future Recommendations
                        </Label>
                        <Textarea
                          id="final-recommendations"
                          value={finalConnectData.recommendations}
                          onChange={(e) =>
                            setFinalConnectData((prev) => ({
                              ...prev,
                              recommendations: e.target.value,
                            }))
                          }
                          placeholder="Suggestions for future contracts or improvements..."
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={handleFinalConnectSubmit}
                      disabled={submitting}
                      className="w-full md:w-auto"
                    >
                      {submitting ? "Submitting..." : "Save Final Connect"}
                    </Button>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Goals List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Goals Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {goals.length > 0 ? (
                    goals.map((goal: any) => (
                      <div
                        key={goal.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {goal.title}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(goal.priority)}>
                            {goal.priority}
                          </Badge>
                          <Badge className={getStatusColor(goal.status)}>
                            {goal.status.replace("-", " ")}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No goals found. Create goals in the Initial Connect
                      section.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
