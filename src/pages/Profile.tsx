
import React from 'react';
import Header from '../components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, User, FileText, Bell, Key } from "lucide-react";

const Profile = () => {
  return (
    <div className="min-h-screen bg-sphere-dark">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
              <Avatar className="h-24 w-24">
                <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              
              <div>
                <h1 className="text-3xl font-bold mb-2">John Doe</h1>
                <p className="text-slate-300 mb-4">Product Manager at Acme Inc.</p>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" className="border-sphere-cyan/50 hover:border-sphere-cyan hover:bg-sphere-cyan/10">
                    Edit Profile
                  </Button>
                  <Button size="sm" className="bg-gradient-to-r from-sphere-purple to-sphere-cyan hover:opacity-90">
                    Upgrade Plan
                  </Button>
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="account" className="w-full">
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="account" className="flex gap-2 items-center">
                  <User className="h-4 w-4" />
                  <span>Account</span>
                </TabsTrigger>
                <TabsTrigger value="visualizations" className="flex gap-2 items-center">
                  <FileText className="h-4 w-4" />
                  <span>Visualizations</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex gap-2 items-center">
                  <Bell className="h-4 w-4" />
                  <span>Notifications</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="flex gap-2 items-center">
                  <Key className="h-4 w-4" />
                  <span>Security</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="account" className="mt-0">
                <div className="glass p-6">
                  <h3 className="text-xl font-semibold mb-4">Account Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Full Name</label>
                      <input 
                        type="text" 
                        value="John Doe" 
                        className="w-full bg-slate-800 border border-white/10 rounded-md p-2"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Email</label>
                      <input 
                        type="email" 
                        value="john.doe@example.com" 
                        className="w-full bg-slate-800 border border-white/10 rounded-md p-2"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Company</label>
                      <input 
                        type="text" 
                        value="Acme Inc." 
                        className="w-full bg-slate-800 border border-white/10 rounded-md p-2"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Role</label>
                      <input 
                        type="text" 
                        value="Product Manager" 
                        className="w-full bg-slate-800 border border-white/10 rounded-md p-2"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button className="bg-gradient-to-r from-sphere-purple to-sphere-cyan hover:opacity-90">
                      Save Changes
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="visualizations" className="mt-0">
                <div className="glass p-6">
                  <h3 className="text-xl font-semibold mb-4">Saved Visualizations</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="bg-slate-800 border border-white/10 rounded-lg overflow-hidden">
                        <div className="h-40 bg-gradient-to-tr from-sphere-purple/20 to-sphere-cyan/20"></div>
                        <div className="p-4">
                          <h4 className="font-medium mb-1">Dashboard {item}</h4>
                          <p className="text-sm text-slate-400 mb-3">Last edited 3 days ago</p>
                          <div className="flex justify-between">
                            <Button variant="ghost" size="sm">View</Button>
                            <Button variant="outline" size="sm" className="border-sphere-cyan/50 hover:border-sphere-cyan hover:bg-sphere-cyan/10">
                              Share
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="notifications" className="mt-0">
                <div className="glass p-6">
                  <h3 className="text-xl font-semibold mb-4">Notification Settings</h3>
                  
                  <div className="space-y-4">
                    {["Email Notifications", "Push Notifications", "Dashboard Alerts", "Weekly Reports"].map((item) => (
                      <div key={item} className="flex items-center justify-between p-3 border border-white/10 rounded-md">
                        <span>{item}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" value="" className="sr-only peer" defaultChecked={true} />
                          <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-sphere-purple peer-checked:to-sphere-cyan"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="security" className="mt-0">
                <div className="glass p-6">
                  <h3 className="text-xl font-semibold mb-4">Security Settings</h3>
                  
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Change Password</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">Current Password</label>
                        <input 
                          type="password" 
                          placeholder="••••••••" 
                          className="w-full bg-slate-800 border border-white/10 rounded-md p-2"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">New Password</label>
                        <input 
                          type="password" 
                          placeholder="••••••••" 
                          className="w-full bg-slate-800 border border-white/10 rounded-md p-2"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">Confirm New Password</label>
                        <input 
                          type="password" 
                          placeholder="••••••••" 
                          className="w-full bg-slate-800 border border-white/10 rounded-md p-2"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Button className="bg-gradient-to-r from-sphere-purple to-sphere-cyan hover:opacity-90">
                        Update Password
                      </Button>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-white/10">
                    <h4 className="font-medium mb-3">Two-Factor Authentication</h4>
                    <p className="text-sm text-slate-400 mb-3">
                      Add an extra layer of security to your account by enabling two-factor authentication.
                    </p>
                    <Button variant="outline" className="border-sphere-cyan/50 hover:border-sphere-cyan hover:bg-sphere-cyan/10">
                      Enable 2FA
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <footer className="py-6 border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} Sphere AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Profile;
