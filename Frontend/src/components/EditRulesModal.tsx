import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogTitle } from '@radix-ui/react-dialog';
import { useEffect, useState } from 'react';
import { DialogHeader } from './ui/dialog';
import { Button } from './ui/button';

const EditRulesModal = ({ open, setOpen, hubData, onSubmit }) => {
  const [rules, setRules] = useState(hubData?.rules || '');

  useEffect(() => {
    setRules(hubData?.rules || '');
  }, [hubData]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-gray-900 text-gray-200 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-gray-100">Edit Hub Rules</DialogTitle>
        </DialogHeader>
        <Textarea
          value={rules}
          onChange={(e) => setRules(e.target.value)}
          placeholder="Write your rules here..."
          className="bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-600"
        />
        <Button
          onClick={() => {
            onSubmit({ rules });
            setOpen(false);
          }}
          className="mt-4 bg-blue-700 hover:bg-blue-600 text-white"
        >
          Save Rules
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default EditRulesModal;
