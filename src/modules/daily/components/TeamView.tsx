import React, { useState } from 'react';
import { Plus, Trash2, UserPlus } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useDailyStore } from '../store/useDailyStore';

export const TeamView = () => {
  const { members, addMember, removeMember } = useDailyStore();
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');

  const handleAdd = () => {
    if (!newName.trim()) return;
    addMember({
      name: newName,
      role: newRole || 'Team Member',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newName)}&background=random`
    });
    setNewName('');
    setNewRole('');
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Add Team Member
          </CardTitle>
          <CardDescription>Grow your squad.</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4 items-end">
          <div className="grid w-full gap-1.5">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Name</label>
            <Input
              placeholder="John Doe"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
          </div>
          <div className="grid w-full gap-1.5">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Role</label>
            <Input
              placeholder="Developer"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
          </div>
          <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" /> Add
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => (
          <Card key={member.id} className="group hover:border-primary/50 transition-colors">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border-2 border-border group-hover:border-primary transition-colors">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">{member.name}</h4>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                </div>
              </div>
              <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => removeMember(member.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
