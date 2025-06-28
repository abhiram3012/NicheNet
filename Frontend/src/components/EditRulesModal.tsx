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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Hub Rules</DialogTitle>
        </DialogHeader>
        <Textarea value={rules} onChange={(e) => setRules(e.target.value)} placeholder="Write your rules here..." />
        <Button
          onClick={() => {
            onSubmit({ rules });
            setOpen(false);
          }}
        >
          Save Rules
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default EditRulesModal;
