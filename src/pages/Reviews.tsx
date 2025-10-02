import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, TrendingUp, Send } from "lucide-react";

const ReviewsPage = () => {
  const reviews = [
    {
      id: "1",
      customer: "Sarah Johnson",
      rating: 5,
      comment: "Excellent service! Mike was professional and fixed our plumbing issue quickly.",
      date: "2024-01-15",
      service: "Kitchen Plumbing",
      platform: "Google"
    },
    {
      id: "2",
      customer: "Bob Smith",
      rating: 5,
      comment: "Very satisfied with the HVAC maintenance. Will definitely use again!",
      date: "2024-01-14",
      service: "HVAC Maintenance",
      platform: "Facebook"
    },
    {
      id: "3",
      customer: "Emily Davis",
      rating: 4,
      comment: "Good work overall. Would have preferred earlier appointment time.",
      date: "2024-01-13",
      service: "Electrical Repair",
      platform: "Google"
    }
  ];

  const stats = [
    { label: "Average Rating", value: "4.8", icon: Star, color: "text-yellow-500" },
    { label: "Total Reviews", value: "156", icon: MessageSquare, color: "text-blue-500" },
    { label: "Response Rate", value: "98%", icon: TrendingUp, color: "text-green-500" }
  ];

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold">Reviews & Reputation</h1>
            <p className="text-muted-foreground mt-1">Manage customer feedback and online reputation</p>
          </div>
          <Button variant="hero" size="lg">
            <Send className="h-4 w-4 mr-2" />
            Request Review
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Reviews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{review.customer}</h3>
                          <Badge variant="outline">{review.platform}</Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">{review.date}</span>
                    </div>
                    <p className="text-sm">{review.comment}</p>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-sm text-muted-foreground">{review.service}</span>
                      <Button variant="outline" size="sm">Respond</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Review Collection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Automate review requests after job completion to build your online reputation.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Requests Sent</span>
                    <span className="font-semibold">45</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Response Rate</span>
                    <span className="font-semibold text-accent">72%</span>
                  </div>
                </div>
                <Button className="w-full">Configure Automation</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Platform Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Star className="h-4 w-4 mr-2" />
                  Google My Business
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Facebook Reviews
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Star className="h-4 w-4 mr-2" />
                  Yelp
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReviewsPage;
