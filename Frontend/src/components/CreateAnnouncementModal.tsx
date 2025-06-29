import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const CreateAnnouncementModal = ({ open, setOpen, onSubmit }) => {
  const [content, setContent] = useState('');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-gray-800 border-gray-700 text-gray-200">
        <DialogHeader>
          <DialogTitle className="text-gray-200">Create Announcement</DialogTitle>
        </DialogHeader>
        <Textarea
          placeholder="Write your announcement..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mb-4 bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
        />
        <Button
          onClick={() => {
            onSubmit(content);
            setContent('');
            setOpen(false);
          }}
          disabled={!content.trim()}
          className="bg-blue-700 hover:bg-blue-600 text-gray-200"
        >
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAnnouncementModal;
