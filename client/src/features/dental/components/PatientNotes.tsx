import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/dentalSlice';
import { ExamNote } from '@/types/dental';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Clipboard, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';

const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), 'MMM d, yyyy h:mm a');
  } catch (e) {
    return dateString;
  }
};

const NoteTypeIcon = ({ type }: { type: ExamNote['type'] }) => {
  switch (type) {
    case 'exam':
      return <FileText className="h-5 w-5 text-indigo-600" />;
    case 'procedure':
      return <Clipboard className="h-5 w-5 text-green-600" />;
    default:
      return <FileText className="h-5 w-5 text-gray-600" />;
  }
};

const NoteTypeBadge = ({ type }: { type: ExamNote['type'] }) => {
  switch (type) {
    case 'exam':
      return <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100">Exam</Badge>;
    case 'procedure':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Procedure</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Note</Badge>;
  }
};

const PatientNotes = () => {
  const { patient } = useSelector((state: RootState) => state.dental);
  const notes = patient.notes || [];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold tracking-tight">Patient Notes</h2>
      </div>
      
      {notes.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No notes available for this patient.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <Card key={note.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50 pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <NoteTypeIcon type={note.type} />
                    <CardTitle className="text-base">{note.type === 'exam' ? 'Examination Summary' : 'Clinical Note'}</CardTitle>
                    <NoteTypeBadge type={note.type} />
                  </div>
                </div>
                <CardDescription className="flex items-center mt-2 text-xs">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  {formatDate(note.createdAt)}
                  <span className="mx-2">•</span>
                  <User className="h-3.5 w-3.5 mr-1" />
                  {note.createdBy}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="whitespace-pre-wrap text-sm">{note.content}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientNotes;