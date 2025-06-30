import React, { useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { HelpCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';

interface AskQuestionDialogProps {
  children: React.ReactNode;
  onQuestionPosted?: () => void; // optional refresh callback
}

const AskQuestionDialog: React.FC<AskQuestionDialogProps> = ({ children, onQuestionPosted }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { hubId } = useParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to ask a question.');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/questions/hub/${hubId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, hubId }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to post question');
      }

      // Clear form and close modal
      setTitle('');
      setContent('');
      setIsOpen(false);
      onQuestionPosted?.();
    } catch (err) {
      alert(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-gray-900 text-gray-200 border border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-200">
            <HelpCircle className="w-5 h-5" />
            Ask a Question
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="question-title" className="block text-sm font-medium text-gray-300 mb-2">
              Question Title
            </label>
            <Input
              id="question-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's your question about?"
              className="bg-gray-800 text-gray-200 border-gray-600 placeholder-gray-500 focus:ring-0 focus:border-gray-500"
              required
            />
          </div>
          <div>
            <label htmlFor="question-content" className="block text-sm font-medium text-gray-300 mb-2">
              Question Details
            </label>
            <Textarea
              id="question-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Provide more details about your question..."
              className="min-h-[120px] bg-gray-800 text-gray-200 border-gray-600 placeholder-gray-500 focus:ring-0 focus:border-gray-500"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              className="border border-gray-600 bg-gray-800 text-gray-200 hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-purple-700 text-gray-200 hover:bg-purple-600"
              disabled={loading}
            >
              {loading ? 'Posting...' : 'Post Question'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AskQuestionDialog;
