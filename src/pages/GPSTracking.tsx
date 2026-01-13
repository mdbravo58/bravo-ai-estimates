import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MapPin, 
  Navigation, 
  Truck, 
  Clock, 
  Phone, 
  MessageSquare,
  Battery,
  Wifi,
  Route,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Search,
  RefreshCcw,
  Briefcase
} from "lucide-react";
import { useState } from "react";

interface TechnicianLocation {
  id: string;
  name: string;
  avatar: string;
  vehicle: string;
  status: "on-job" | "en-route" | "available" | "offline";
  currentJob?: string;
  currentAddress?: string;
  lastUpdate: string;
  battery: number;
  speed: number;
  lat: number;
  lng: number;
  eta?: string;
}

const technicians: TechnicianLocation[] = [
  {
    id: "1",
    name: "Mike Rodriguez",
    avatar: "MR",
    vehicle: "Van #101 - Ford Transit",
    status: "on-job",
    currentJob: "HVAC Repair - Johnson Residence",
    currentAddress: "123 Oak Street, Suite 4",
    lastUpdate: "2 min ago",
    battery: 85,
    speed: 0,
    lat: 33.4484,
    lng: -112.0740,
  },
  {
    id: "2",
    name: "Sarah Chen",
    avatar: "SC",
    vehicle: "Van #102 - Sprinter",
    status: "en-route",
    currentJob: "AC Installation - Smith Home",
    currentAddress: "456 Pine Avenue",
    lastUpdate: "1 min ago",
    battery: 92,
    speed: 35,
    lat: 33.4584,
    lng: -112.0640,
    eta: "12 min",
  },
  {
    id: "3",
    name: "James Wilson",
    avatar: "JW",
    vehicle: "Van #103 - ProMaster",
    status: "available",
    currentAddress: "789 Main Street (Office)",
    lastUpdate: "5 min ago",
    battery: 78,
    speed: 0,
    lat: 33.4384,
    lng: -112.0840,
  },
  {
    id: "4",
    name: "Emily Davis",
    avatar: "ED",
    vehicle: "Van #104 - Transit Connect",
    status: "en-route",
    currentJob: "Furnace Maintenance - Brown Family",
    currentAddress: "321 Elm Boulevard",
    lastUpdate: "30 sec ago",
    battery: 65,
    speed: 42,
    lat: 33.4684,
    lng: -112.0540,
    eta: "8 min",
  },
  {
    id: "5",
    name: "David Park",
    avatar: "DP",
    vehicle: "Van #105 - NV2500",
    status: "offline",
    lastUpdate: "2 hours ago",
    battery: 12,
    speed: 0,
    lat: 33.4284,
    lng: -112.0940,
  },
];

const getStatusColor = (status: TechnicianLocation["status"]) => {
  switch (status) {
    case "on-job":
      return "bg-blue-500 text-white";
    case "en-route":
      return "bg-amber-500 text-white";
    case "available":
      return "bg-green-500 text-white";
    case "offline":
      return "bg-gray-400 text-white";
  }
};

const getStatusIcon = (status: TechnicianLocation["status"]) => {
  switch (status) {
    case "on-job":
      return <CheckCircle2 className="h-3 w-3" />;
    case "en-route":
      return <Navigation className="h-3 w-3" />;
    case "available":
      return <Circle className="h-3 w-3" />;
    case "offline":
      return <AlertTriangle className="h-3 w-3" />;
  }
};

const getStatusLabel = (status: TechnicianLocation["status"]) => {
  switch (status) {
    case "on-job":
      return "On Job";
    case "en-route":
      return "En Route";
    case "available":
      return "Available";
    case "offline":
      return "Offline";
  }
};

export default function GPSTracking() {
  const [selectedTech, setSelectedTech] = useState<TechnicianLocation | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTechs = technicians.filter(
    (tech) =>
      tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.vehicle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    onJob: technicians.filter((t) => t.status === "on-job").length,
    enRoute: technicians.filter((t) => t.status === "en-route").length,
    available: technicians.filter((t) => t.status === "available").length,
    offline: technicians.filter((t) => t.status === "offline").length,
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <MapPin className="h-8 w-8 text-primary" />
              GPS Fleet Tracking
            </h1>
            <p className="text-muted-foreground">
              Real-time location tracking for your technicians and vehicles
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <RefreshCcw className="h-4 w-4" />
            Refresh All
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-full bg-blue-100 p-3">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.onJob}</p>
                <p className="text-sm text-muted-foreground">On Job</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-full bg-amber-100 p-3">
                <Navigation className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.enRoute}</p>
                <p className="text-sm text-muted-foreground">En Route</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-full bg-green-100 p-3">
                <Circle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.available}</p>
                <p className="text-sm text-muted-foreground">Available</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-full bg-gray-100 p-3">
                <AlertTriangle className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.offline}</p>
                <p className="text-sm text-muted-foreground">Offline</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Technician List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Technicians
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search technicians..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardHeader>
            <CardContent className="max-h-[500px] space-y-3 overflow-y-auto">
              {filteredTechs.map((tech) => (
                <div
                  key={tech.id}
                  onClick={() => setSelectedTech(tech)}
                  className={`cursor-pointer rounded-lg border p-3 transition-colors hover:bg-accent ${
                    selectedTech?.id === tech.id ? "border-primary bg-accent" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                        {tech.avatar}
                      </div>
                      <div>
                        <p className="font-medium">{tech.name}</p>
                        <p className="text-xs text-muted-foreground">{tech.vehicle}</p>
                      </div>
                    </div>
                    <Badge className={`gap-1 ${getStatusColor(tech.status)}`}>
                      {getStatusIcon(tech.status)}
                      {getStatusLabel(tech.status)}
                    </Badge>
                  </div>
                  {tech.currentJob && (
                    <div className="mt-2 rounded bg-muted p-2 text-xs">
                      <p className="font-medium">{tech.currentJob}</p>
                      {tech.eta && (
                        <p className="text-muted-foreground">ETA: {tech.eta}</p>
                      )}
                    </div>
                  )}
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {tech.lastUpdate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Battery className="h-3 w-3" />
                      {tech.battery}%
                    </span>
                    {tech.speed > 0 && (
                      <span className="flex items-center gap-1">
                        <Navigation className="h-3 w-3" />
                        {tech.speed} mph
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Map Area */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Live Map View
              </CardTitle>
              <CardDescription>
                Click on a technician to see their details and route
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative h-[400px] rounded-lg bg-muted/50 border-2 border-dashed border-muted-foreground/20">
                {/* Map placeholder - would integrate with Google Maps/Mapbox */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="mx-auto h-16 w-16 text-muted-foreground/40" />
                    <p className="mt-4 text-lg font-medium text-muted-foreground">
                      Interactive Map
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Live GPS tracking with Google Maps integration
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      (Connect Google Maps API for full functionality)
                    </p>
                  </div>
                </div>
                
                {/* Simulated pins */}
                {technicians.filter(t => t.status !== "offline").map((tech, index) => (
                  <div
                    key={tech.id}
                    className={`absolute cursor-pointer transition-transform hover:scale-110 ${
                      selectedTech?.id === tech.id ? "z-10 scale-125" : ""
                    }`}
                    style={{
                      left: `${20 + index * 15}%`,
                      top: `${30 + (index % 3) * 20}%`,
                    }}
                    onClick={() => setSelectedTech(tech)}
                  >
                    <div className={`relative flex h-8 w-8 items-center justify-center rounded-full ${
                      tech.status === "on-job" ? "bg-blue-500" :
                      tech.status === "en-route" ? "bg-amber-500" : "bg-green-500"
                    } text-white shadow-lg`}>
                      <span className="text-xs font-bold">{tech.avatar.charAt(0)}</span>
                      {tech.status === "en-route" && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Selected Technician Details */}
        {selectedTech && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-medium text-primary-foreground">
                    {selectedTech.avatar}
                  </div>
                  <div>
                    <p>{selectedTech.name}</p>
                    <p className="text-sm font-normal text-muted-foreground">
                      {selectedTech.vehicle}
                    </p>
                  </div>
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Phone className="h-4 w-4" />
                    Call
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Message
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Route className="h-4 w-4" />
                    Route History
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-4">
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={`mt-1 gap-1 ${getStatusColor(selectedTech.status)}`}>
                    {getStatusIcon(selectedTech.status)}
                    {getStatusLabel(selectedTech.status)}
                  </Badge>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Current Location</p>
                  <p className="mt-1 font-medium text-sm">
                    {selectedTech.currentAddress || "Unknown"}
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Speed</p>
                  <p className="mt-1 text-2xl font-bold">
                    {selectedTech.speed} <span className="text-sm font-normal">mph</span>
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Device Battery</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Battery className={`h-5 w-5 ${
                      selectedTech.battery < 20 ? "text-red-500" :
                      selectedTech.battery < 50 ? "text-amber-500" : "text-green-500"
                    }`} />
                    <span className="text-2xl font-bold">{selectedTech.battery}%</span>
                  </div>
                </div>
              </div>
              
              {selectedTech.currentJob && (
                <div className="mt-4 rounded-lg bg-muted p-4">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    <p className="font-medium">Current Job</p>
                  </div>
                  <p className="mt-2">{selectedTech.currentJob}</p>
                  {selectedTech.eta && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      Estimated arrival: {selectedTech.eta}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
