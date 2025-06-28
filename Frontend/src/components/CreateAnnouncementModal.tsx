import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const CreateAnnouncementModal = ({ open, setOpen, onSubmit }) => {
  const [content, setContent] = useState('');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Announcement</DialogTitle>
        </DialogHeader>
        <Textarea 
          placeholder="Write your announcement..." 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mb-4"
        />
        <Button
          onClick={() => {
            onSubmit(content);
            setContent('');
            setOpen(false);
          }}
          disabled={!content.trim()}
        >
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAnnouncementModal;
