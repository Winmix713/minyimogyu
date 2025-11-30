import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon, User, Bell, Shield, Palette } from "lucide-react";

const Settings = () => {
  const settingsSections = [
    {
      icon: User,
      title: "Profile",
      description: "Manage your account settings and preferences",
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Configure how you receive alerts and updates",
    },
    {
      icon: Shield,
      title: "Security",
      description: "Manage your password and security settings",
    },
    {
      icon: Palette,
      title: "Appearance",
      description: "Customize the look and feel of the application",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {settingsSections.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.title} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{section.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {section.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Settings;