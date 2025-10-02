import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Plus, Mail, Phone, MoreVertical } from "lucide-react";

const TeamPage = () => {
  const team = [
    {
      id: "1",
      name: "Mike Chen",
      role: "owner",
      email: "mike@company.com",
      phone: "(555) 123-4567",
      status: "active",
      jobsCompleted: 45,
      rating: 4.9
    },
    {
      id: "2",
      name: "John Doe",
      role: "manager",
      email: "john@company.com",
      phone: "(555) 234-5678",
      status: "active",
      jobsCompleted: 38,
      rating: 4.8
    },
    {
      id: "3",
      name: "Sarah Williams",
      role: "technician",
      email: "sarah@company.com",
      phone: "(555) 345-6789",
      status: "active",
      jobsCompleted: 52,
      rating: 4.9
    },
    {
      id: "4",
      name: "Tom Brown",
      role: "technician",
      email: "tom@company.com",
      phone: "(555) 456-7890",
      status: "active",
      jobsCompleted: 41,
      rating: 4.7
    }
  ];

  const getRoleBadge = (role: string) => {
    const variants: Record<string, string> = {
      owner: "bg-purple-100 text-purple-800",
      manager: "bg-blue-100 text-blue-800",
      technician: "bg-green-100 text-green-800",
      sales: "bg-orange-100 text-orange-800"
    };
    return variants[role] || "bg-gray-100 text-gray-800";
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold">Team Management</h1>
            <p className="text-muted-foreground mt-1">Manage your team members and permissions</p>
          </div>
          <Button variant="hero" size="lg">
            <Plus className="h-4 w-4 mr-2" />
            Add Team Member
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Members</p>
                  <p className="text-3xl font-bold mt-1">12</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Technicians</p>
                  <p className="text-3xl font-bold mt-1">8</p>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Managers</p>
                  <p className="text-3xl font-bold mt-1">3</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Today</p>
                  <p className="text-3xl font-bold mt-1">9</p>
                </div>
                <Users className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {team.map((member) => (
                <div key={member.id} className="border rounded-lg p-4 hover:shadow-card transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary-light text-primary font-semibold">
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{member.name}</h3>
                          <Badge className={getRoleBadge(member.role)}>
                            {member.role}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {member.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {member.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm font-medium">{member.jobsCompleted} jobs</p>
                        <p className="text-sm text-muted-foreground">Rating: {member.rating}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Performance This Month</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Sarah Williams</span>
                <span className="font-semibold">52 jobs</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Mike Chen</span>
                <span className="font-semibold">45 jobs</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Tom Brown</span>
                <span className="font-semibold">41 jobs</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Manage Permissions
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Send Team Message
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Create Training
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default TeamPage;
