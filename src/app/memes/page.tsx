"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Laugh,
  Heart,
  MessageCircle,
  Share2,
  Music,
  Coffee,
  Youtube,
  Film,
  ThumbsUp,
  PlusCircle,
  Upload,
  UploadCloud,
} from "lucide-react";

// Memes and Entertainment interfaces (used by database-interface.ts)
export interface Meme {
  id: string;
  title: string;
  imageUrl: string;
  authorId: string;
  isAnonymous: boolean;
  likes: number;
  comments: number;
  views: number;
  createdAt: string;
}

export interface RelaxationTechnique {
  id: string;
  title: string;
  description: string | null;
  content: string;
  authorId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number; // in minutes
  createdAt: string;
}

export interface MusicPlaylist {
  id: string;
  title: string;
  description: string | null;
  externalUrl: string;
  platform: 'spotify' | 'youtube' | 'apple_music' | 'other';
  authorId: string;
  likes: number;
  createdAt: string;
}

export interface VideoResource {
  id: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  externalUrl: string;
  platform: 'youtube' | 'tiktok' | 'vimeo' | 'other';
  authorId: string;
  duration: number | null; // in seconds
  likes: number;
  views: number;
  createdAt: string;
}

export default function MemesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          <span className="flex items-center">
            <Laugh className="mr-2 h-8 w-8 text-primary" />
            Memes & Chill
          </span>
        </h1>
        <p className="text-muted-foreground">
          Take a break, relax, and enjoy some humor to destress from your studies.
        </p>
      </div>

      <Tabs defaultValue="memes" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
          <TabsTrigger value="memes">College Memes</TabsTrigger>
          <TabsTrigger value="relaxation">Relaxation</TabsTrigger>
          <TabsTrigger value="music">Study Music</TabsTrigger>
          <TabsTrigger value="videos">Fun Videos</TabsTrigger>
        </TabsList>

        {/* College Memes Tab */}
        <TabsContent value="memes" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">College Humor</h2>
            <Button className="flex items-center gap-2">
              <UploadCloud className="h-4 w-4" />
              Upload Meme
            </Button>
          </div>

          <EmptyContentState
            icon={<Laugh className="h-12 w-12 text-muted-foreground mb-4" />}
            title="No memes yet"
            description="Be the first to share some college humor with the community. Upload memes related to student life, exams, professors, or campus events."
            actionText="Upload a Meme"
            icon2={<UploadCloud className="mr-2 h-4 w-4" />}
          />
        </TabsContent>

        {/* Relaxation Tab */}
        <TabsContent value="relaxation" className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Relaxation Techniques</h2>
            <Button variant="outline" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Add Technique
            </Button>
          </div>

          <EmptyContentState
            icon={<Coffee className="h-12 w-12 text-muted-foreground mb-4" />}
            title="No relaxation techniques yet"
            description="Share your favorite ways to de-stress and relax during busy college periods. Add breathing exercises, meditation guides, or simple stretching routines."
            actionText="Add Relaxation Technique"
            icon2={<PlusCircle className="mr-2 h-4 w-4" />}
          />
        </TabsContent>

        {/* Study Music Tab */}
        <TabsContent value="music" className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Study Playlists</h2>
            <Button variant="outline" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Add Playlist
            </Button>
          </div>

          <EmptyContentState
            icon={<Music className="h-12 w-12 text-muted-foreground mb-4" />}
            title="No study playlists yet"
            description="Share your favorite music for studying, focusing, or relaxing. Add links to Spotify, YouTube, or other streaming platforms."
            actionText="Add Study Playlist"
            icon2={<PlusCircle className="mr-2 h-4 w-4" />}
          />
        </TabsContent>

        {/* Fun Videos Tab */}
        <TabsContent value="videos" className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Entertaining Videos</h2>
            <Button variant="outline" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Add Video
            </Button>
          </div>

          <EmptyContentState
            icon={<Youtube className="h-12 w-12 text-muted-foreground mb-4" />}
            title="No videos yet"
            description="Share entertaining or educational videos related to college life. Add links to YouTube, TikTok, or other video platforms."
            actionText="Add Video Link"
            icon2={<PlusCircle className="mr-2 h-4 w-4" />}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmptyContentState({
  icon,
  title,
  description,
  actionText,
  icon2
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionText: string;
  icon2: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg">
      {icon}
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground text-center max-w-md mt-2 mb-6">
        {description}
      </p>
      <Button>
        {icon2}
        {actionText}
      </Button>
    </div>
  );
}
