import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RoleCard } from "@/components/ui/role-card";
import { LoginForm } from "@/components/LoginForm";
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Brain,
  Sparkles,
  Zap
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('');

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setShowLogin(true);
  };

  const handleLoginSuccess = (user: any) => {
    // Navigate based on user role or selected role
    const userRole = user.role;
    if (userRole === 'student') {
      navigate('/student-dashboard');
    } else if (userRole === 'teacher') {
      navigate('/teacher-dashboard');
    } else if (userRole === 'moderator') {
      navigate('/moderator-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header */}
      <div className="border-b border-border/30 bg-card/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">QuizHive</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">AI-Powered Learning</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-6">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Zap className="w-8 h-8 text-primary animate-pulse-glow" />
            <h2 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Smart Learning Platform
            </h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Experience the future of education with AI-powered quizzes, intelligent note-taking, 
            and collaborative learning tools designed for students and teachers.
          </p>
        </div>

        {/* Role Selection or Login */}
        {!showLogin ? (
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <RoleCard
              icon={<GraduationCap className="h-12 w-12" />}
              title="Student"
              description="Access quizzes, notes, AI tutoring, and collaborate with peers"
              features={["AI-Generated Quizzes", "Smart Notes", "Personalized Learning", "Peer Collaboration"]}
              onClick={() => handleRoleSelect('student')}
            />
            
            <RoleCard
              icon={<Users className="h-12 w-12" />}
              title="Teacher"
              description="Create content, manage classes, track progress, and utilize AI tools"
              features={["Content Creation", "Student Analytics", "AI Assistance", "Assignment Management"]}
              onClick={() => handleRoleSelect('teacher')}
            />
            
            <RoleCard
              icon={<BookOpen className="h-12 w-12" />}
              title="Moderator"
              description="Oversee platform, manage users, and ensure quality education"
              features={["User Management", "Content Moderation", "System Analytics", "Event Coordination"]}
              onClick={() => handleRoleSelect('moderator')}
            />
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <LoginForm onLoginSuccess={handleLoginSuccess} />
            <Button 
              variant="outline" 
              onClick={() => setShowLogin(false)}
              className="w-full mt-4"
            >
              Back to Role Selection
            </Button>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <Card className="shadow-card animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-primary" />
                <span>AI-Powered</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Intelligent quiz generation, personalized learning paths, and automated grading 
                powered by advanced AI algorithms.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-edu-secondary" />
                <span>Collaborative</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Real-time chat, group study sessions, peer learning, and seamless 
                teacher-student collaboration.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-edu-accent" />
                <span>Comprehensive</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Complete learning management with attendance tracking, assignment submission, 
                and detailed analytics.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
