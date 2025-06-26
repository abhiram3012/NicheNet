
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronUp, ChevronDown, ArrowLeft, Crown } from 'lucide-react';
import AnswerQuestionDialog from '@/components/AnswerQuestionDialog';

const QuestionDetails = () => {
  const { hubId, questionId } = useParams();

  // Mock question data (in real app, this would come from API)
  const question = {
    id: questionId,
    title: 'How do I achieve better focus in low light conditions?',
    content: 'I\'ve been struggling with getting sharp focus when shooting in low light. Any tips on settings or techniques?',
    author: '@beginnerphoto',
    isCreator: false,
    upvotes: 15,
    answersCount: 2,
    timePosted: '3h ago',
    answers: [
      {
        id: '1',
        content: 'Try using single point autofocus and increase your ISO. Also consider using a tripod for stability.',
        author: '@proshoter',
        upvotes: 12,
        timePosted: '2h ago'
      },
      {
        id: '2',
        content: 'Focus peaking on your camera can help a lot. Also, manual focus with live view zoom is very effective.',
        author: '@techphoto',
        upvotes: 8,
        timePosted: '1h ago'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <Link to={`/hub/${hubId}`}>
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Hub
            </Button>
          </Link>
        </div>

        {/* Question Card */}
        <Card className={`bg-white mb-6 ${question.isCreator ? 'ring-2 ring-yellow-200 border-yellow-300' : ''}`}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${question.isCreator ? 'text-yellow-700' : ''}`}>
                      {question.author}
                    </span>
                    {question.isCreator && (
                      <Badge className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        Creator
                      </Badge>
                    )}
                  </div>
                  <span>•</span>
                  <span>{question.timePosted}</span>
                </div>
                <CardTitle className="text-xl text-purple-600 mb-4">
                  {question.title}
                </CardTitle>
                <p className="text-gray-700 mb-4">{question.content}</p>
                
                <AnswerQuestionDialog questionId={question.id!} questionTitle={question.title}>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Answer Question
                  </Button>
                </AnswerQuestionDialog>
              </div>
              
              <div className="flex flex-col items-center space-y-1 ml-4">
                <Button variant="ghost" size="sm" className="p-1 h-8 w-8 hover:bg-orange-100">
                  <ChevronUp className="w-4 h-4 text-orange-600" />
                </Button>
                <span className="text-sm font-medium text-gray-700">{question.upvotes}</span>
                <Button variant="ghost" size="sm" className="p-1 h-8 w-8 hover:bg-blue-100">
                  <ChevronDown className="w-4 h-4 text-blue-600" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Answers Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {question.answers.length} {question.answers.length === 1 ? 'Answer' : 'Answers'}
          </h2>
          
          {question.answers.map((answer) => (
            <Card key={answer.id} className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center space-y-1">
                    <Button variant="ghost" size="sm" className="p-1 h-8 w-8 hover:bg-orange-100">
                      <ChevronUp className="w-4 h-4 text-orange-600" />
                    </Button>
                    <span className="text-sm font-medium text-gray-700">{answer.upvotes}</span>
                    <Button variant="ghost" size="sm" className="p-1 h-8 w-8 hover:bg-blue-100">
                      <ChevronDown className="w-4 h-4 text-blue-600" />
                    </Button>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <span className="font-medium">{answer.author}</span>
                      <span>•</span>
                      <span>{answer.timePosted}</span>
                    </div>
                    <p className="text-gray-700">{answer.content}</p>
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
