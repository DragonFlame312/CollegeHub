"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  FileText,
  Search,
  Download,
  Link as LinkIcon,
  Star,
  Clock,
  Filter,
  BookMarked,
  UploadCloud,
  PlusCircle,
} from "lucide-react";

// Resource-related interfaces (used by database-interface.ts)
export interface Resource {
  id: string;
  title: string;
  description: string | null;
  type: 'note' | 'cheatsheet' | 'link';
  subjectId: string | null;
  fileUrl: string | null;
  externalUrl: string | null;
  authorId: string;
  isPublic: boolean;
  downloads: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string | null;
  department: string | null;
  createdAt: string;
}

export interface Tag {
  id: string;
  name: string;
  resourceCount: number;
  createdAt: string;
}

export default function ResourcesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          <span className="flex items-center">
            <BookOpen className="mr-2 h-8 w-8 text-primary" />
            Resources
          </span>
        </h1>
        <p className="text-muted-foreground">
          Access study materials, cheat sheets, and useful links.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search resources..." className="pl-10" />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button className="flex items-center gap-2">
            <UploadCloud className="h-4 w-4" />
            Upload Resource
          </Button>
        </div>
      </div>

      {/* Resource Tabs */}
      <Tabs defaultValue="notes" className="w-full">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 mb-8">
          <TabsTrigger value="notes">Notes & Materials</TabsTrigger>
          <TabsTrigger value="cheatsheets">Cheat Sheets</TabsTrigger>
          <TabsTrigger value="links">Useful Links</TabsTrigger>
          <TabsTrigger value="bookmarks">My Bookmarks</TabsTrigger>
        </TabsList>

        {/* Notes & Materials Tab */}
        <TabsContent value="notes" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Study Notes & Materials</h2>
            <Button size="sm" variant="outline" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Add Notes
            </Button>
          </div>
          <EmptyResourceState
            type="notes"
            title="No study notes yet"
            description="Be the first to share your notes with the community. Upload lecture notes, study guides, or summaries."
            actionText="Upload Notes"
          />
        </TabsContent>

        {/* Cheat Sheets Tab */}
        <TabsContent value="cheatsheets" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Quick Reference Sheets</h2>
            <Button size="sm" variant="outline" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Add Cheat Sheet
            </Button>
          </div>
          <EmptyResourceState
            type="cheatsheet"
            title="No cheat sheets available"
            description="Quick reference sheets with formulas, syntax, equations, and other helpful study aids will appear here."
            actionText="Upload Cheat Sheet"
          />
        </TabsContent>

        {/* Useful Links Tab */}
        <TabsContent value="links" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">External Resources</h2>
            <Button size="sm" variant="outline" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Add Link
            </Button>
          </div>
          <EmptyResourceState
            type="link"
            title="No external resources yet"
            description="Share helpful websites, online courses, tutorials, or tools with your fellow students."
            actionText="Add Resource Link"
          />
        </TabsContent>

        {/* My Bookmarks Tab */}
        <TabsContent value="bookmarks" className="space-y-6">
          <div className="flex items-center justify-center p-12 border-2 border-dashed rounded-lg">
            <div className="text-center">
              <BookMarked className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No bookmarks yet</h3>
              <p className="text-muted-foreground mt-2 max-w-md">
                Sign in to save resources to your bookmarks for quick access
                later.
              </p>
              <Button asChild className="mt-4">
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmptyResourceState({
  type,
  title,
  description,
  actionText,
}: {
  type: "notes" | "cheatsheet" | "link";
  title: string;
  description: string;
  actionText: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg">
      {type === "notes" && (
        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
      )}
      {type === "cheatsheet" && (
        <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
      )}
      {type === "link" && (
        <LinkIcon className="h-12 w-12 text-muted-foreground mb-4" />
      )}
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground text-center max-w-md mt-2 mb-6">
        {description}
      </p>
      <Button>
        {type === "notes" && <UploadCloud className="mr-2 h-4 w-4" />}
        {type === "cheatsheet" && <UploadCloud className="mr-2 h-4 w-4" />}
        {type === "link" && <LinkIcon className="mr-2 h-4 w-4" />}
        {actionText}
      </Button>
    </div>
  );
}
