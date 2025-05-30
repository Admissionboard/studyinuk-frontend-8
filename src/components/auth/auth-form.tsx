import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Chrome, ArrowLeft, GraduationCap } from "@/lib/icons";
import { Link } from "wouter";

export default function AuthForm() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-3 text-slate-900 hover:text-blue-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <GraduationCap className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold">Study in UK</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="text-center pb-8 pt-10">
              <CardTitle className="text-2xl font-semibold text-slate-900 mb-2">
                Sign in to your account
              </CardTitle>
              <CardDescription className="text-slate-600 text-base">
                Access your Study in UK dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-10">
              <div className="space-y-6">
                {/* Google Sign-in */}
                <Button
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading}
                  variant="outline"
                  className="w-full h-12 border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700 font-medium"
                >
                  <Chrome className="w-5 h-5 mr-3 text-slate-600" />
                  {isGoogleLoading ? "Signing in..." : "Continue with Google"}
                </Button>

                <p className="text-xs text-center text-slate-500 leading-5">
                  By continuing, you agree to our{" "}
                  <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-500 underline">
                    Privacy Policy
                  </Link>{" "}
                  and Terms of Service
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}