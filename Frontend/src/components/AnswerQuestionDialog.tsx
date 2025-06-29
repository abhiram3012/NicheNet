import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare } from 'lucide-react';

interface AnswerQuestionDialogProps {
  children: React.ReactNode;
  questionId: string;
  questionTitle: string;
  onAnswerPosted?: () => void; // optional callback to refresh answers
}

const AnswerQuestionDialog: React.FC<AnswerQuestionDialogProps> = ({
  children,
  questionId,
  questionTitle,
  onAnswerPosted,
}) => {
  const [answer, setAnswer] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to post an answer.');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/questions/${questionId}/answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: answer }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to post answer');
      }

      setAnswer('');
      setIsOpen(false);
      onAnswerPosted?.();
    } catch (err) {
      alert(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-gray-900 text-gray-200 border border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-200">
            <MessageSquare className="w-5 h-5" />
            Answer Question
          </DialogTitle>
          <p className="text-sm text-gray-400 mt-2">
            Answering: <span className="font-medium text-gray-200">{questionTitle}</span>
          </p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="answer-content"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Your Answer
            </label>
            <Textarea
              id="answer-content"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Share your knowledge and help others..."
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
              className="bg-green-700 text-gray-200 hover:bg-green-600"
              disabled={loading}
            >
              {loading ? 'Posting...' : 'Post Answer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AnswerQuestionDialog;
