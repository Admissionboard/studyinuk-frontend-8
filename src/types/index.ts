// Frontend-only type definitions (no database dependencies)

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt?: string;
}

export interface University {
  id: number;
  name: string;
  location: string;
  city?: string;
  country?: string;
  description?: string;
  website?: string;
  ranking?: number;
  logoUrl?: string;
}

export interface Course {
  id: number;
  name: string;
  description?: string;
  duration: string;
  level: string;
  tuitionFee: number;
  faculty: string;
  requirements?: string;
  ieltsRequirement?: string;
  ieltsOverall?: number;
  universityId: number;
}

export interface CourseWithUniversity extends Course {
  university: University;
}

export interface Counselor {
  id: number;
  name: string;
  email: string;
  phone?: string;
  specialization?: string;
  experience?: number;
  bio?: string;
  photoUrl?: string;
}

export interface Application {
  id: number;
  userId: string;
  courseId: number;
  status: string;
  submittedAt: string;
  documents?: string[];
  notes?: string;
}

export interface Notification {
  id: number;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface Tutorial {
  id: number;
  title: string;
  description?: string;
  content: string;
  category: string;
  order: number;
  isPublished: boolean;
}

export interface Favorite {
  id: number;
  userId: string;
  courseId: number;
  createdAt: string;
}

export interface FavoriteWithCourse extends Favorite {
  course: CourseWithUniversity;
}

// Admin types
export interface Lead {
  id: number;
  name: string;
  email: string;
  phone?: string;
  source: string;
  status: string;
  interestedCourses?: string[];
  notes?: string;
  assignedTo?: string;
  convertedUserId?: string;
  createdAt: string;
}

export interface LeadActivity {
  id: number;
  leadId: number;
  type: string;
  description: string;
  performedBy: string;
  createdAt: string;
}

export interface LeadWithActivities extends Lead {
  activities: LeadActivity[];
  convertedUser?: User;
  assignedToUser?: User;
}

export interface AdminUser {
  id: number;
  userId: string;
  role: string;
  permissions: string[];
  createdAt: string;
}

export interface AdminUserWithUser extends AdminUser {
  user: User;
}

// Input types for creating new records
export interface InsertUniversity extends Omit<University, 'id'> {}
export interface InsertCourse extends Omit<Course, 'id'> {}
export interface InsertCounselor extends Omit<Counselor, 'id'> {}
export interface InsertApplication extends Omit<Application, 'id'> {}
export interface InsertNotification extends Omit<Notification, 'id'> {}
export interface InsertTutorial extends Omit<Tutorial, 'id'> {}
export interface InsertLead extends Omit<Lead, 'id'> {}
export interface InsertLeadActivity extends Omit<LeadActivity, 'id'> {}
export interface InsertAdminUser extends Omit<AdminUser, 'id'> {}
export interface UpsertUser extends Omit<User, 'createdAt'> {}