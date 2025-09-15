import { BookCover } from "@/components/cover/BookCover";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CoverPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Welcome to Bravo Service Suite
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Your comprehensive business management platform designed specifically for home service professionals
          </p>
        </div>

        {/* Book Cover Display */}
        <div className="flex justify-center mb-12">
          <BookCover />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 flex-wrap">
          <Button 
            onClick={() => navigate("/dashboard")}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Enter Application
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
          <Button 
            onClick={() => navigate("/founders-guide")}
            variant="outline"
            size="lg"
          >
            <Download className="w-5 h-5 mr-2" />
            View Founder's Guide
          </Button>
        </div>

        {/* Feature Highlights */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">AI-Powered</h3>
            <p className="text-slate-600">Intelligent automation for estimates, scheduling, and customer support</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Mobile Ready</h3>
            <p className="text-slate-600">Full mobile access for technicians in the field</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Complete Solution</h3>
            <p className="text-slate-600">From lead generation to payment processing - all in one platform</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverPage;