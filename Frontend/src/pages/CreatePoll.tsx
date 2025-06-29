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
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <Link 
            to={`/hub/${hubId}`} 
            className="inline-flex items-center text-gray-400 hover:text-gray-200 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Hub
          </Link>
          <h1 className="text-3xl font-bold text-white">Create New Poll</h1>
          <p className="text-gray-400 mt-2">Ask your community a question and get their opinions</p>
        </div>

        {/* Form */}
        <Card className="bg-gray-800 border border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Poll Details</CardTitle>
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
                      <FormLabel className="text-gray-300">Poll Question</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="What would you like to ask your community?"
                          {...field}
                          className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500 focus:ring-purple-500"
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
                      <FormLabel className="text-gray-300">Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Add more context to your poll question..."
                          rows={3}
                          {...field}
                          className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500 focus:ring-purple-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Poll Options */}
                <div className="space-y-4">
                  <FormLabel className="text-gray-300">Poll Options</FormLabel>
                  {options.map((option, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Input
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        className="flex-1 bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500 focus:ring-purple-500"
                      />
                      {options.length > 2 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeOption(index)}
                          className="text-red-400 hover:text-red-300 border-gray-600 hover:bg-red-900/20"
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
                      className="w-full border-gray-600 text-gray-200 hover:bg-gray-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Option
                    </Button>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex items-center gap-3 pt-6 border-t border-gray-700">
                  <Button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-500"
                  >
                    Create Poll
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="border-gray-600 text-gray-200 hover:bg-gray-700"
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
