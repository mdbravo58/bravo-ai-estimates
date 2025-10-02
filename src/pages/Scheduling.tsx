import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, User, MapPin, Plus } from "lucide-react";
import { useState } from "react";

const SchedulingPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const todayAppointments = [
    {
      id: "1",
      time: "9:00 AM",
      customer: "Sarah Johnson",
      service: "Kitchen Plumbing",
      technician: "Mike Chen",
      status: "confirmed",
      address: "123 Main St, Anytown"
    },
    {
      id: "2",
      time: "11:30 AM", 
      customer: "Bob Smith",
      service: "HVAC Maintenance",
      technician: "John Doe",
      status: "in-progress",
      address: "456 Oak Ave, Anytown"
    },
    {
      id: "3",
      time: "2:00 PM",
      customer: "Emily Davis",
      service: "Electrical Repair",
      technician: "Mike Chen",
      status: "pending",
      address: "789 Pine Rd, Anytown"
    }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold">Scheduling & Appointments</h1>
            <p className="text-muted-foreground mt-1">Manage appointments and technician schedules</p>
          </div>
          <Button variant="hero" size="lg">
            <Plus className="h-4 w-4 mr-2" />
            New Appointment
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Today's Appointments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {todayAppointments.map((apt) => (
                  <div key={apt.id} className="border rounded-lg p-4 hover:shadow-card transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg bg-primary-light flex items-center justify-center">
                          <Clock className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{apt.customer}</h3>
                          <p className="text-sm text-muted-foreground">{apt.service}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(apt.status)}>
                        {apt.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{apt.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{apt.technician}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate">{apt.address}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Technician Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["Mike Chen", "John Doe", "Sarah Williams"].map((tech) => (
                    <div key={tech} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary-light flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{tech}</p>
                          <p className="text-sm text-muted-foreground">2 appointments today</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">View Schedule</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Calendar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Today's Appointments</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">This Week</span>
                  <span className="font-semibold">47</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Completion Rate</span>
                  <span className="font-semibold text-accent">94%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SchedulingPage;
