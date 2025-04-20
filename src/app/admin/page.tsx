"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { getDatabase } from "@/lib/database-interface";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Shield, MoreVertical, UserCog, Trash } from "lucide-react";

// Mock user data - in a real application, this would come from the database
interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  role: string;
  collegeId?: string | null;
  createdAt?: string;
}

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const db = getDatabase();

  // Redirect if not an admin or owner
  useEffect(() => {
    if (!isLoading && (!user || (user.role !== "admin" && user.role !== "owner"))) {
      toast.error("You don't have permission to access this page");
      router.push("/");
    }
  }, [user, isLoading, router]);

  // Fetch users - in a real implementation, this would come from the database
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoadingUsers(true);
        // Mock data for demo purposes
        // In a real implementation, this would be:
        // const fetchedUsers = await db.getAllUsers();
        const mockUsers: AdminUser[] = [
          {
            id: "1",
            name: "Admin",
            email: "admin@collegehub.com",
            role: "owner",
            createdAt: "2025-04-05",
          },
          {
            id: "2",
            name: "John Doe",
            email: "john@example.com",
            avatar: "https://api.dicebear.com/7.x/initials/svg?seed=JD",
            role: "user",
            collegeId: "CS12345",
            createdAt: "2025-04-01",
          },
          {
            id: "3",
            name: "Jane Smith",
            email: "jane@example.com",
            avatar: "https://api.dicebear.com/7.x/initials/svg?seed=JS",
            role: "moderator",
            collegeId: "ENG67890",
            createdAt: "2025-03-28",
          },
        ];
        setUsers(mockUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users");
      } finally {
        setIsLoadingUsers(false);
      }
    };

    if (user && (user.role === "admin" || user.role === "owner")) {
      fetchUsers();
    }
  }, [user]);

  // Change user role
  const changeUserRole = async (userId: string, newRole: string) => {
    try {
      // In a real implementation, this would be:
      // await db.setUserRole(userId, newRole as 'user' | 'moderator' | 'admin' | 'owner');

      // Update local state
      setUsers(users.map(u =>
        u.id === userId ? { ...u, role: newRole } : u
      ));

      toast.success(`User role updated to ${newRole}`);
    } catch (error) {
      console.error("Error changing user role:", error);
      toast.error("Failed to update user role");
    }
  };

  if (isLoading || !user) {
    return (
      <div className="container flex items-center justify-center min-h-[60vh]">
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Users</CardTitle>
            <CardDescription>Registered users on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{users.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Moderators</CardTitle>
            <CardDescription>Users with moderation privileges</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {users.filter(u => u.role === "moderator").length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Administrators</CardTitle>
            <CardDescription>Users with admin privileges</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {users.filter(u => u.role === "admin" || u.role === "owner").length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Regular Users</CardTitle>
            <CardDescription>Standard account users</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {users.filter(u => u.role === "user").length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            Manage user roles and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingUsers ? (
            <p>Loading users...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>College ID</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={user.avatar || undefined}
                            alt={user.name}
                          />
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span>{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.collegeId || "—"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="capitalize flex items-center gap-1">
                          {user.role === "admin" || user.role === "owner" ? (
                            <Shield className="h-4 w-4 text-primary" />
                          ) : user.role === "moderator" ? (
                            <UserCog className="h-4 w-4 text-primary" />
                          ) : (
                            <User className="h-4 w-4 text-muted-foreground" />
                          )}
                          {user.role}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => changeUserRole(user.id, "user")}
                            disabled={user.role === "user" || user.role === "owner"}
                          >
                            Set as User
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => changeUserRole(user.id, "moderator")}
                            disabled={user.role === "moderator" || user.role === "owner"}
                          >
                            Set as Moderator
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => changeUserRole(user.id, "admin")}
                            disabled={user.role === "admin" || user.role === "owner"}
                          >
                            Set as Admin
                          </DropdownMenuItem>
                          {user.role !== "owner" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => toast.error("Delete functionality not implemented")}
                              >
                                <Trash className="h-4 w-4 mr-2" />
                                Delete User
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
