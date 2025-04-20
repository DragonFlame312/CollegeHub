"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  BookOpen,
  AlertCircle,
  PlusCircle,
  Settings,
  FileEdit,
  UploadCloud
} from "lucide-react";

// Schedule-related interfaces (used by database-interface.ts)
export interface Class {
  id: string;
  name: string;
  courseCode: string;
  instructor: string;
  location: string;
  startTime: string;
  endTime: string;
  daysOfWeek: string;
  startDate: string;
  endDate: string;
  color: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Exam {
  id: string;
  courseId: string | null;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  format: string;
  notes: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string | null;
  location: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  organizer: string;
  contactEmail: string | null;
  isPublic: boolean;
  category: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export default function SchedulePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            <span className="flex items-center">
              <Calendar className="mr-2 h-8 w-8 text-primary" />
              Schedule
            </span>
          </h1>
          <p className="text-muted-foreground">
            View your class timetable, upcoming exams, and college events.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </Button>
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Add Event</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="timetable" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="timetable">Class Timetable</TabsTrigger>
          <TabsTrigger value="exams">Exams</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="timetable" className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground">
              Your weekly class schedule
            </p>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <FileEdit className="h-4 w-4" />
              <span>Edit Schedule</span>
            </Button>
          </div>

          <EmptyScheduleState
            icon={<Calendar className="h-12 w-12 text-muted-foreground mb-4" />}
            title="No classes added yet"
            description="Add your classes to see your weekly schedule. You can add class details including time, location, and instructor."
            actionText="Add Classes"
            actionIcon={<PlusCircle className="mr-2 h-4 w-4" />}
          />
        </TabsContent>

        <TabsContent value="exams" className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground">
              Your upcoming exams
            </p>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              <span>Add Exam</span>
            </Button>
          </div>

          <EmptyScheduleState
            icon={<BookOpen className="h-12 w-12 text-muted-foreground mb-4" />}
            title="No exams scheduled"
            description="Add your upcoming exams to keep track of important dates, times, and locations."
            actionText="Add Exam"
            actionIcon={<PlusCircle className="mr-2 h-4 w-4" />}
          />
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground">
              Upcoming campus events
            </p>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <UploadCloud className="h-4 w-4" />
              <span>Upload Event</span>
            </Button>
          </div>

          <EmptyScheduleState
            icon={<AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />}
            title="No upcoming events"
            description="Add campus events like parties, club meetings, or workshops to your schedule."
            actionText="Add Event"
            actionIcon={<PlusCircle className="mr-2 h-4 w-4" />}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmptyScheduleState({
  icon,
  title,
  description,
  actionText,
  actionIcon
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionText: string;
  actionIcon: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg">
      {icon}
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground text-center max-w-md mt-2 mb-6">
        {description}
      </p>
      <Button>
        {actionIcon}
        {actionText}
      </Button>
    </div>
  );
}
