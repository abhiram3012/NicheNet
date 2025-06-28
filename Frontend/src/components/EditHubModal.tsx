import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogTitle } from '@radix-ui/react-dialog';
import { useEffect, useState } from 'react';
import { DialogHeader, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';

const EditHubModal = ({ open, setOpen, hubData, onSubmit }) => {
  const [name, setName] = useState(hubData?.name || '');
  const [isPrivate, setIsPrivate] = useState(hubData?.isPrivate || false);
  const [discordLink, setDiscordLink] = useState(hubData?.discordLink || '');

  useEffect(() => {
    setName(hubData?.name || '');
    setIsPrivate(hubData?.isPrivate || false);
    setDiscordLink(hubData?.discordLink || '');
  }, [hubData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, isPrivate, discordLink });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Edit Hub Information</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Update your hub details
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="mt-4 space-y-6">
          <div className="space-y-3">
            <div>
              <Label htmlFor="hubName" className="block mb-2 font-medium">
                Hub Name
              </Label>
              <Input
                id="hubName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter hub name"
                className="py-2 px-3"
              />
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
              <div className="space-y-1">
                <Label htmlFor="privacyToggle" className="font-medium">
                  Private Hub
                </Label>
                <p className="text-sm text-muted-foreground">
                  {isPrivate 
                    ? "Visible only to invited members" 
                    : "Visible to all community members"}
                </p>
              </div>
              <Switch 
                id="privacyToggle"
                checked={isPrivate} 
                onCheckedChange={setIsPrivate} 
                className="scale-90"
              />
            </div>
            
            <div>
              <Label htmlFor="discordLink" className="block mb-2 font-medium">
                Discord Link <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <Input
                id="discordLink"
                value={discordLink}
                onChange={(e) => setDiscordLink(e.target.value)}
                placeholder="https://discord.gg/..."
                className="py-2 px-3"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
              type="button"
            >
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditHubModal;