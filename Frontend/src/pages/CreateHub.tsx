import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Users, Globe, Lock, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const createHubSchema = z.object({
  name: z.string().min(2, 'Hub name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Please select a category'),
  privacy: z.enum(['public', 'private']),
});

type CreateHubForm = z.infer<typeof createHubSchema>;

const CreateHub = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateHubForm>({
    resolver: zodResolver(createHubSchema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
      privacy: 'public',
    },
  });

  const categories = [
    'Creative',
    'Technology',
    'Outdoor',
    'Food',
    'Writing',
    'Music',
    'Sports',
    'Gaming',
    'Art',
    'Photography',
    'Other'
  ];

  const onSubmit = async (values: CreateHubForm) => {
    setIsLoading(true);

    try {
        const token = localStorage.getItem('token');

        const response = await fetch(`http://localhost:5000/api/hubs/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            name: values.name,
            description: values.description,
            isPrivate: values.privacy === 'private',
        }),
        });

        const data = await response.json();

        if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
        }

        toast({
        title: 'Hub Created Successfully!',
        description: `"${data.name}" has been created and is ready for members.`,
        });

        navigate('/dashboard');
    } catch (error) {
        toast({
        title: 'Error',
        description: error.message || 'Failed to create hub',
        variant: 'destructive',
        });
    } finally {
        setIsLoading(false);
    }
    };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mb-4 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Create New Hub</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Build a community around your passion and connect with like-minded people.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Hub Details</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Provide the basic information about your new community hub.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-gray-300">Hub Name *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., Digital Photography Masters" 
                              {...field} 
                              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-gray-300">Description *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe what your hub is about, what members can expect, and what makes it special..."
                              className="min-h-[120px] dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-gray-300">Category *</FormLabel>
                          <FormControl>
                            <select 
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              {...field}
                            >
                              <option value="" className="dark:bg-gray-800">Select a category</option>
                              {categories.map((category) => (
                                <option 
                                  key={category} 
                                  value={category}
                                  className="dark:bg-gray-800"
                                >
                                  {category}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="privacy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-gray-300">Privacy Setting</FormLabel>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <input
                                type="radio"
                                id="public"
                                value="public"
                                checked={field.value === 'public'}
                                onChange={() => field.onChange('public')}
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                              />
                              <label htmlFor="public" className="flex items-center cursor-pointer">
                                <Globe className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                                <div>
                                  <div className="font-medium dark:text-gray-200">Public</div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">Anyone can find and join this hub</div>
                                </div>
                              </label>
                            </div>
                            <div className="flex items-center space-x-3">
                              <input
                                type="radio"
                                id="private"
                                value="private"
                                checked={field.value === 'private'}
                                onChange={() => field.onChange('private')}
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                              />
                              <label htmlFor="private" className="flex items-center cursor-pointer">
                                <Lock className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-400" />
                                <div>
                                  <div className="font-medium dark:text-gray-200">Private</div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">Only invited members can join</div>
                                </div>
                              </label>
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-4 pt-4">
                      <Button 
                        type="submit" 
                        className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Creating Hub...' : 'Create Hub'}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => navigate('/dashboard')}
                        disabled={isLoading}
                        className="dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Tips Sidebar */}
          <div className="space-y-6">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center dark:text-white">
                  <Users className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Tips for Success
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium mb-1 dark:text-gray-200">Choose a clear name</h4>
                  <p className="text-gray-600 dark:text-gray-400">Make it easy for people to understand what your hub is about</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1 dark:text-gray-200">Write a compelling description</h4>
                  <p className="text-gray-600 dark:text-gray-400">Explain the value members will get from joining</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1 dark:text-gray-200">Select the right category</h4>
                  <p className="text-gray-600 dark:text-gray-400">This helps people discover your hub</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1 dark:text-gray-200">Start with public</h4>
                  <p className="text-gray-600 dark:text-gray-400">Public hubs grow faster and reach more people</p>
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center dark:text-white">
                  <Image className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                  Coming Soon
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="text-gray-600 dark:text-gray-400 mb-3">We're working on these features:</p>
                <ul className="space-y-1 text-gray-500 dark:text-gray-400">
                  <li>• Custom hub images</li>
                  <li>• Hub rules and guidelines</li>
                  <li>• Member roles and permissions</li>
                  <li>• Integration settings</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateHub;