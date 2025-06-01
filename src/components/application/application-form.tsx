import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

import { useLocation } from "wouter";

const applicationSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  selectedCourses: z.array(z.number()).min(1, "Please select at least one course"),
  additionalNotes: z.string().optional(),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

interface ApplicationFormProps {
  favorites: any[];
  onNavigateToCourses?: () => void;
}

export default function ApplicationForm({ favorites, onNavigateToCourses }: ApplicationFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      selectedCourses: [],
      additionalNotes: "",
    },
  });

  // Submit application mutation
const submitApplicationMutation = useMutation({
  mutationFn: (data: ApplicationFormData) =>
    apiRequest("/api/applications", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
    queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    queryClient.invalidateQueries({ queryKey: ["/api/notifications/unread-count"] });
    toast({
      title: "Application Submitted Successfully!",
      description: "A counsellor will contact you within 6 hours.",
    });
    form.reset();
  },
  onError: (error: any) => {
    toast({
      title: "Error",
      description: error.message || "Failed to submit application.",
      variant: "destructive",
    });
  },
});

  const onSubmit = (data: ApplicationFormData) => {
    submitApplicationMutation.mutate(data);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your.email@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number *</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="+880 1XXX-XXXXXX"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="selectedCourses"
                render={() => (
                  <FormItem>
                    <FormLabel>Desired Courses *</FormLabel>
                    <div className="space-y-2">
                      {favorites.length > 0 ? (
                        <>
                          {favorites.length > 10 && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                              <p className="text-sm text-blue-700">
                                <strong>Note:</strong> You have {favorites.length} favorite courses. 
                                Showing the first 10 for better readability. Consider selecting your top choices.
                              </p>
                            </div>
                          )}
                          {favorites.slice(0, 10).map((favorite) => (
                          <FormField
                            key={favorite.course.id}
                            control={form.control}
                            name="selectedCourses"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(favorite.course.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, favorite.course.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== favorite.course.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">
                                    {favorite.course.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {favorite.course.university.name}
                                  </div>
                                </div>
                              </FormItem>
                            )}
                          />
                        ))}
                        </>
                      ) : (
                        <div className="text-center py-8 border border-gray-200 rounded-lg">
                          <p className="text-gray-500 mb-2">No favorite courses yet</p>
                          <p className="text-sm text-gray-400 mb-4">
                            Add some courses to your favorites first to select them for application
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={onNavigateToCourses}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
                          >
                            Browse Courses
                          </Button>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      Select from your favorite courses
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="additionalNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any additional information you'd like to share..."
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-blue-700"
                disabled={submitApplicationMutation.isPending}
              >
                {submitApplicationMutation.isPending ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
