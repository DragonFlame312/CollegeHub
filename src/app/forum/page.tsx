"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MessageSquare,
  Users,
  Search,
  BookOpen,
  Lightbulb,
  Coffee,
  ThumbsUp,
  MessageCircle,
  Eye,
  Calendar,
  PlusCircle,
  Tag,
  Filter,
} from "lucide-react";

// This interface is used by auth-context.tsx and other files
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: 'user' | 'moderator' | 'admin' | 'owner';
  sessionToken?: string;
}

// Forum-related interfaces
export interface Forum {
  id: string;
  name: string;
  description: string;
  category: string;
  creatorId: string;
  isPublic: boolean;
  memberCount: number;
  postCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName?: string;
  forumId: string;
  isAnonymous: boolean;
  likes: number;
  replies: number;
  views: number;
  isHot: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ForumPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          <span className="flex items-center">
            <MessageSquare className="mr-2 h-8 w-8 text-primary" />
            Forum
          </span>
        </h1>
        <p className="text-muted-foreground">
          Join discussions, ask questions, and connect with fellow students.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Main Content */}
        <div className="w-full md:w-3/4">
          {/* Search and Create Post */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search discussions..."
                className="pl-10"
              />
            </div>
            <Button className="flex items-center">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Discussion
            </Button>
          </div>

          {/* Forum Tabs */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-2 sm:grid-cols-4 mb-6">
              <TabsTrigger value="all">All Discussions</TabsTrigger>
              <TabsTrigger value="academic">Academic</TabsTrigger>
              <TabsTrigger value="campus">Campus Life</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <p className="text-muted-foreground">
                  Browse all forum discussions.
                </p>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filter</span>
                </Button>
              </div>

              <EmptyForumState />
            </TabsContent>

            <TabsContent value="academic" className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <p className="text-muted-foreground">
                  Academic discussions and study groups.
                </p>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filter</span>
                </Button>
              </div>

              <EmptyForumState />
            </TabsContent>

            <TabsContent value="campus" className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <p className="text-muted-foreground">
                  Campus life, housing, and student services.
                </p>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filter</span>
                </Button>
              </div>

              <EmptyForumState />
            </TabsContent>

            <TabsContent value="events" className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <p className="text-muted-foreground">
                  Events, parties, and gatherings.
                </p>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filter</span>
                </Button>
              </div>

              <EmptyForumState />
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-1/4 space-y-6">
          {/* Create Forum */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <MessageCircle className="mr-2 h-5 w-5 text-primary" />
                Create a Forum
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Create your own forum for a specific topic, class, or interest group.
              </p>
              <Button className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Sub-Forum
              </Button>
            </CardContent>
          </Card>

          {/* Popular Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Tag className="mr-2 h-5 w-5 text-primary" />
                Popular Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="rounded-full">
                  #study
                </Button>
                <Button variant="outline" size="sm" className="rounded-full">
                  #exams
                </Button>
                <Button variant="outline" size="sm" className="rounded-full">
                  #housing
                </Button>
                <Button variant="outline" size="sm" className="rounded-full">
                  #events
                </Button>
                <Button variant="outline" size="sm" className="rounded-full">
                  #help
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-primary" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Stay up to date with events around campus.
              </p>
              <Link
                href="/schedule"
                className="text-primary text-sm hover:underline inline-flex items-center"
              >
                View schedule
                <Calendar className="ml-2 h-3 w-3" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function EmptyForumState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg">
      <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium">No discussions yet</h3>
      <p className="text-sm text-muted-foreground text-center max-w-md mt-2 mb-6">
        Be the first to start a discussion in this forum. Share your thoughts, questions, or experiences with the community.
      </p>
      <Button>
        <PlusCircle className="mr-2 h-4 w-4" />
        Create Discussion
      </Button>
    </div>
  );
}
