"use client";

import { useState } from "react";
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

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const contractorData = {
    name: "Sarah Johnson",
    startDate: "January 15, 2024",
    endDate: "December 15, 2024",
    position: "Senior Frontend Developer",
  };

  const goals = [
    {
      id: 1,
      title: "Complete React migration project",
      status: "completed",
      priority: "high",
    },
    {
      id: 2,
      title: "Mentor junior developers",
      status: "in-progress",
      priority: "medium",
    },
    {
      id: 3,
      title: "Implement new design system",
      status: "pending",
      priority: "high",
    },
    {
      id: 4,
      title: "Optimize application performance",
      status: "in-progress",
      priority: "medium",
    },
    {
      id: 5,
      title: "Document best practices",
      status: "completed",
      priority: "low",
    },
  ];

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
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="initial-goals">Primary Goals</Label>
                        <Textarea
                          id="initial-goals"
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
                        placeholder="Tools, access, training needed..."
                        className="mt-1"
                      />
                    </div>
                    <Button className="w-full md:w-auto">
                      Save Initial Connect
                    </Button>
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
                        placeholder="Any changes needed to original goals or timeline..."
                        className="mt-1"
                      />
                    </div>
                    <Button className="w-full md:w-auto">
                      Save Midpoint Connect
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
                          placeholder="Summarize major accomplishments..."
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="final-feedback">Overall Feedback</Label>
                        <Textarea
                          id="final-feedback"
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
                          placeholder="Suggestions for future contracts or improvements..."
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <Button className="w-full md:w-auto">
                      Save Final Connect
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
                  {goals.map((goal) => (
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
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
