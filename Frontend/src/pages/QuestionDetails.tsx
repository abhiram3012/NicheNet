import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronUp, ChevronDown, ArrowLeft, Crown } from 'lucide-react';
import AnswerQuestionDialog from '@/components/AnswerQuestionDialog';
import { timeAgo } from '@/utils/timeAgo';

interface Answer {
  id: string;
  content: string;
  author: string;
  upvotes: number;
  timePosted: string;
}

interface Question {
  id: string;
  title: string;
  content: string;
  author: string;
  upvotes: number;
  timePosted: string;
  answers: Answer[];
  isCreator?: boolean;
}

const QuestionDetails = () => {
  const { hubId, questionId } = useParams();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/questions/${questionId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const data = await res.json();
        setQuestion(data);
      } catch (err) {
        console.error('Failed to fetch question', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [questionId]);

  if (loading) return <p className="text-center mt-10 text-gray-600 dark:text-gray-400">Loading...</p>;
  if (!question) return <p className="text-center mt-10 text-red-500 dark:text-red-400">Question not found.</p>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <Link to={`/hub/${hubId}`}>
            <Button variant="outline" className="mb-4 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Hub
            </Button>
          </Link>
        </div>

        {/* Question Card */}
        <Card className={`bg-white dark:bg-gray-800 mb-6 border dark:border-gray-700 ${
          question.isCreator ? 'ring-2 ring-yellow-200 dark:ring-yellow-500/60 border-yellow-300 dark:border-yellow-500/50' : ''
        }`}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${
                      question.isCreator 
                        ? 'text-yellow-700 dark:text-yellow-400' 
                        : 'dark:text-gray-200'
                    }`}>
                      {question.author}
                    </span>
                    {question.isCreator && (
                      <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 text-xs px-2 py-1 flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        Creator
                      </Badge>
                    )}
                  </div>
                  <span>•</span>
                  <span>{timeAgo(question.timePosted)}</span>
                </div>
                <CardTitle className="text-xl text-purple-600 dark:text-purple-400 mb-4">
                  {question.title}
                </CardTitle>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{question.content}</p>
                
                <AnswerQuestionDialog questionId={question.id!} questionTitle={question.title}>
                  <Button className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600">
                    Answer Question
                  </Button>
                </AnswerQuestionDialog>
              </div>
              
              <div className="flex flex-col items-center space-y-1 ml-4">
                <Button variant="ghost" size="sm" className="p-1 h-8 w-8 hover:bg-orange-100 dark:hover:bg-orange-900/30">
                  <ChevronUp className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </Button>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{question.upvotes}</span>
                <Button variant="ghost" size="sm" className="p-1 h-8 w-8 hover:bg-blue-100 dark:hover:bg-blue-900/30">
                  <ChevronDown className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Answers Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {question.answers.length} {question.answers.length === 1 ? 'Answer' : 'Answers'}
          </h2>
          
          {question.answers.map((answer) => (
            <Card key={answer.id} className="bg-white dark:bg-gray-800 border dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center space-y-1">
                    <Button variant="ghost" size="sm" className="p-1 h-8 w-8 hover:bg-orange-100 dark:hover:bg-orange-900/30">
                      <ChevronUp className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    </Button>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{answer.upvotes}</span>
                    <Button variant="ghost" size="sm" className="p-1 h-8 w-8 hover:bg-blue-100 dark:hover:bg-blue-900/30">
                      <ChevronDown className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </Button>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <span className="font-medium dark:text-gray-200">{answer.author}</span>
                      <span>•</span>
                      <span>{timeAgo(answer.timePosted)}</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{answer.content}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default QuestionDetails;