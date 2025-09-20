import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/ui/stats-card";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/lib/api";
import { 
  Users, 
  BookOpen, 
  PlusCircle, 
  BarChart3, 
  Calendar, 
  Brain,
  Upload,
  Settings,
  ClipboardCheck,
  TrendingUp,
  Clock,
  Award,
  AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [students, setStudents] = useState([]);
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, filesData] = await Promise.all([
          apiService.getUsers(),
          apiService.getFiles()
        ]);
        setStudents(usersData.filter((user: any) => user.role === 'student'));
        setFiles(filesData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Make sure your Flask backend is running on localhost:5000",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      await apiService.uploadFile(formData);
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
      // Refresh files
      const filesData = await apiService.getFiles();
      setFiles(filesData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
    }
  };

  const stats = [
    {
      title: "Total Students",
      value: "142",
      icon: <Users className="w-5 h-5" />,
      trend: { value: "+8 this month", isPositive: true }
    },
    {
      title: "Active Quizzes",
      value: "18",
      icon: <ClipboardCheck className="w-5 h-5" />,
      trend: { value: "+3 this week", isPositive: true }
    },
    {
      title: "Average Score",
      value: "87%",
      icon: <TrendingUp className="w-5 h-5" />,
      trend: { value: "+5% improvement", isPositive: true }
    },
    {
      title: "AI Generated",
      value: "45",
      icon: <Brain className="w-5 h-5" />,
      trend: { value: "Quizzes this month", isPositive: true }
    }
  ];

  const recentClasses = [
    { name: "Advanced JavaScript", students: 28, nextClass: "Today 2:00 PM", progress: 75 },
    { name: "Data Structures", students: 35, nextClass: "Tomorrow 10:00 AM", progress: 60 },
    { name: "Web Development", students: 22, nextClass: "Friday 11:30 AM", progress: 85 }
  ];

  const pendingTasks = [
    { task: "Grade JavaScript Assignment #3", priority: "high", dueDate: "Today" },
    { task: "Review AI-generated quiz for Data Structures", priority: "medium", dueDate: "Tomorrow" },
    { task: "Prepare notes for Advanced React", priority: "low", dueDate: "Friday" }
  ];

  const studentAlerts = [
    { student: "Sarah Chen", issue: "Low attendance (65%)", type: "attendance" },
    { student: "Mike Johnson", issue: "Struggling with recursion", type: "performance" },
    { student: "Alex Kumar", issue: "Late submission streak", type: "submission" }
  ];

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header */}
      <div className="border-b border-border/30 bg-card/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
                ← Back to Home
              </Button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-secondary rounded-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">Teacher Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Welcome,</span>
                <span className="font-semibold text-foreground">Dr. Emily Watson</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={stat.title} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <StatsCard {...stat} />
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card className="shadow-card animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PlusCircle className="w-5 h-5 text-primary" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: Brain, title: "AI Quiz Gen", color: "text-edu-primary", bg: "bg-gradient-primary" },
                    { icon: Upload, title: "Upload Content", color: "text-edu-secondary", bg: "bg-gradient-secondary" },
                    { icon: BarChart3, title: "View Analytics", color: "text-edu-accent", bg: "bg-gradient-accent" },
                    { icon: Calendar, title: "Schedule Class", color: "text-edu-warning", bg: "bg-gradient-accent" }
                  ].map((action, index) => (
                    <Button 
                      key={action.title}
                      className={`h-24 flex-col space-y-2 ${action.bg} hover:opacity-90 text-white shadow-glow`}
                      onClick={() => {
                        if (action.title === "Upload Content") {
                          document.getElementById('file-upload')?.click();
                        }
                      }}
                    >
                      <action.icon className="w-6 h-6" />
                      <span className="text-xs font-medium">{action.title}</span>
                    </Button>
                  ))}
                </div>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.csv"
                />
              </CardContent>
            </Card>

            {/* Active Classes */}
            <Card className="shadow-card animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-edu-secondary" />
                  <span>Active Classes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentClasses.map((classItem, index) => (
                    <div key={index} className="p-4 bg-card/50 rounded-lg border border-border/50 hover:shadow-glow transition-all duration-300">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-foreground">{classItem.name}</h4>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm text-muted-foreground flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {classItem.students} students
                            </span>
                            <span className="text-sm text-primary flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {classItem.nextClass}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground mb-1">Progress</div>
                          <div className="text-lg font-bold text-edu-success">{classItem.progress}%</div>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-gradient-secondary h-2 rounded-full transition-all duration-500"
                          style={{ width: `${classItem.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Assistant */}
            <Card className="shadow-card animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-primary" />
                  <span>AI Teaching Assistant</span>
                  <div className="animate-pulse-glow w-2 h-2 bg-edu-success rounded-full ml-2" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gradient-primary/5 border border-primary/20 rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-3">AI Recommendations</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-edu-warning rounded-full" />
                      <span className="text-muted-foreground">Generate practice quiz for struggling students in recursion</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-edu-success rounded-full" />
                      <span className="text-muted-foreground">Create summary notes for JavaScript closures topic</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-edu-accent rounded-full" />
                      <span className="text-muted-foreground">Schedule group study session for low-attendance students</span>
                    </li>
                  </ul>
                </div>
                <div className="flex space-x-3">
                  <Button className="bg-gradient-primary hover:opacity-90">
                    Generate Quiz
                  </Button>
                  <Button variant="outline">
                    Create Notes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pending Tasks */}
            <Card className="shadow-card animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ClipboardCheck className="w-5 h-5 text-edu-warning" />
                  <span>Pending Tasks</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {pendingTasks.map((task, index) => (
                  <div key={index} className="p-3 bg-card/30 rounded-lg border border-border/30">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground text-sm">{task.task}</h4>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">{task.dueDate}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            task.priority === 'high' ? 'bg-destructive/20 text-destructive' :
                            task.priority === 'medium' ? 'bg-edu-warning/20 text-edu-warning' :
                            'bg-edu-accent/20 text-edu-accent'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Student Alerts */}
            <Card className="shadow-card animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-destructive" />
                  <span>Student Alerts</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {studentAlerts.map((alert, index) => (
                  <div key={index} className="p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                    <h4 className="font-medium text-foreground text-sm">{alert.student}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{alert.issue}</p>
                    <div className="mt-2">
                      <Button variant="outline" size="sm" className="text-xs h-6">
                        Take Action
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="shadow-card animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-edu-success" />
                  <span>Top Performers</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Emma Wilson", score: "98%", subject: "JavaScript" },
                  { name: "David Chen", score: "95%", subject: "Data Structures" },
                  { name: "Lisa Rodriguez", score: "92%", subject: "Web Dev" }
                ].map((student, index) => (
                  <div key={index} className="flex items-center justify-between p-2">
                    <div>
                      <h4 className="font-medium text-foreground text-sm">{student.name}</h4>
                      <p className="text-xs text-muted-foreground">{student.subject}</p>
                    </div>
                    <div className="text-edu-success font-bold text-sm">
                      {student.score}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}