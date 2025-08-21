"use client"

import { FeedbackMarquee } from "@/components/feedback/feedback-card";
import FeedbackForm from "@/components/feedback/feedback-form";
import FeedbackMap from "@/components/feedback/feedback-map";
import { Navbar } from "@/components/navigation/navbar";

export default function FeedbackPage() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 my-4">Leave us a feedback</h2>
        <div className="flex justify-center">
          <FeedbackForm />
          <FeedbackMap/>
        </div>
        <FeedbackMarquee/>
        

      </div>
    </>
  );
}

