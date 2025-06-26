
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ArrowLeft, Plus, X } from 'lucide-react';

interface PollFormData {
  title: string;
  description?: string;
  options: string[];
}

const CreatePoll = () => {
  const { hubId } = useParams();
  const navigate = useNavigate();
  const [options, setOptions] = useState(['', '']);

  const form = useForm<PollFormData>({
    defaultValues: {
      title: '',
      description: '',
      options: ['', '']
    }
  });

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const onSubmit = async (data: PollFormData) => {
    const pollData = {
        title: data.title,
        description: data.description,
        options: options.filter(option => option.trim() !== '')
    };

    try {
        const res = await fetch(`http://localhost:5000/api/polls/${hubId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(pollData),
        });

        if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create poll');
        }

        const result = await res.json();
        console.log('Poll created:', result);

        // Navigate to Polls tab
        navigate(`/hub/${hubId}?tab=polls`);
    } catch (error) {
        console.error('Error creating poll:', error);
        alert('Failed to create poll. Please try again.');
    }
    };

  const handleCancel = () => {
    navigate(`/hub/${hubId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <Link to={`/hub/${hubId}`} className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Hub
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Create New Poll</h1>
          <p className="text-gray-600 mt-2">Ask your community a question and get their opinions</p>
        </div>

        {/* Form */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Poll Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Poll Title */}
                <FormField
                  control={form.control}
                  name="title"
                  rules={{ required: "Poll title is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Poll Question</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="What would you like to ask your community?"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Poll Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Add more context to your poll question..."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Poll Options */}
                <div className="space-y-4">
                  <FormLabel>Poll Options</FormLabel>
                  {options.map((option, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Input
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        className="flex-1"
                      />
                      {options.length > 2 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeOption(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  
                  {options.length < 6 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addOption}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Option
                    </Button>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex items-center gap-3 pt-6 border-t">
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Create Poll
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CreatePoll;
