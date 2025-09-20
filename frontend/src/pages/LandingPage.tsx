import { useNavigate } from "react-router-dom";
import { RoleCard } from "@/components/ui/role-card";
import { GraduationCap, Users, Shield, Brain, Sparkles, BookOpen } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  const roles = [
    {
      title: "Student",
      description: "Access AI-powered learning tools, take quizzes, collaborate with peers, and track your academic progress",
      icon: <GraduationCap className="w-8 h-8 text-edu-primary" />,
      gradient: "bg-gradient-primary",
      onClick: () => navigate("/student-dashboard")
    },
    {
      title: "Teacher",
      description: "Create content, manage assignments, generate AI quizzes, and monitor student performance",
      icon: <Users className="w-8 h-8 text-edu-secondary" />,
      gradient: "bg-gradient-secondary",
      onClick: () => navigate("/teacher-dashboard")
    },
    {
      title: "Moderator",
      description: "Oversee system operations, manage users, schedule events, and generate analytics reports",
      icon: <Shield className="w-8 h-8 text-edu-accent" />,
      gradient: "bg-gradient-accent",
      onClick: () => navigate("/moderator-dashboard")
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary/5" />
        <div className="relative container mx-auto px-6 py-20">
          <div className="text-center space-y-8 animate-fade-in">
            {/* Logo & Brand */}
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="p-3 bg-gradient-primary rounded-xl shadow-glow">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-foreground">
                Quiz<span className="text-transparent bg-clip-text bg-gradient-primary">Hive</span>
              </h1>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h2 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
                AI-Powered Learning
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-primary">
                  Made Simple
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Experience the future of education with our intelligent platform that adapts to your learning style, 
                generates personalized content, and connects learners worldwide.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="flex flex-wrap justify-center gap-6 mt-12">
              {[
                { icon: Sparkles, text: "AI Quiz Generation" },
                { icon: BookOpen, text: "Smart Notes" },
                { icon: Brain, text: "Adaptive Learning" }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-center space-x-2 bg-card/50 backdrop-blur-sm border border-border/50 rounded-full px-4 py-2 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <feature.icon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Role Selection */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16 animate-fade-in">
          <h3 className="text-3xl font-bold text-foreground mb-4">Choose Your Role</h3>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Select your role to access personalized features and dashboards
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {roles.map((role, index) => (
            <div 
              key={role.title}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <RoleCard {...role} />
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border/30 bg-card/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-muted-foreground">
            <p className="text-sm">
              © 2024 QuizHive. Empowering education through AI innovation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}