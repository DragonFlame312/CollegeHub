import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Calendar, BookOpen, Users, Search, Laugh, Clock } from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Welcome to <span className="text-primary">CollegeHub</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-muted-foreground">
            Your one-stop platform for schedules, resources, discussions, and entertainment.
          </p>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-12">
        <h2 className="text-2xl font-bold mb-6">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary" />
                Schedule
              </CardTitle>
              <CardDescription>Manage your classes and events</CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/schedule"
                className="text-primary hover:underline inline-flex items-center"
              >
                View your timetable
                <Clock className="ml-1 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-primary" />
                Resources
              </CardTitle>
              <CardDescription>Access study materials and cheat sheets</CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/resources"
                className="text-primary hover:underline inline-flex items-center"
              >
                Browse resources
                <Search className="ml-1 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary" />
                Forum
              </CardTitle>
              <CardDescription>Engage in discussions with your peers</CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/forum"
                className="text-primary hover:underline inline-flex items-center"
              >
                Join conversations
                <Users className="ml-1 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Laugh className="h-5 w-5 mr-2 text-primary" />
                Memes & Chill
              </CardTitle>
              <CardDescription>Relax and enjoy some humor</CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/memes"
                className="text-primary hover:underline inline-flex items-center"
              >
                Check out memes
                <Laugh className="ml-1 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* College News Section */}
      <section className="py-12">
        <h2 className="text-2xl font-bold mb-6">College News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {collegeNews.map((news) => (
            <Card key={news.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{news.title}</CardTitle>
                <CardDescription>{news.date}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{news.content}</p>
                {news.link && (
                  <Link
                    href={news.link}
                    className="mt-4 text-primary hover:underline inline-block"
                  >
                    Read more
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

const collegeNews = [
  {
    id: "news-1",
    title: "Final Exam Schedule Released",
    date: "April 5, 2025",
    content: "The final examination schedule for the spring semester has been released. Check your schedule section for all exam dates and times.",
    link: "/schedule"
  },
  {
    id: "news-2",
    title: "Library Extended Hours",
    date: "April 3, 2025",
    content: "The main library will extend its hours for the final exam period, starting next week. It will be open until 2:00 AM daily.",
    link: ""
  },
  {
    id: "news-3",
    title: "New Resources Added",
    date: "April 1, 2025",
    content: "New study materials have been added to the resources section for Computer Science, Engineering, and Business courses.",
    link: "/resources"
  },
  {
    id: "news-4",
    title: "Campus Spring Festival",
    date: "March 28, 2025",
    content: "Join us for the annual Spring Festival next Saturday. There will be food, music, and various activities across campus.",
    link: ""
  }
];
