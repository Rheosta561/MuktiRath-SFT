export interface promoCardProps{
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    buttonText: string;
    buttonLink: string;
    isActive?: boolean; // Optional property to indicate if the promo card is active
}
export interface courseCardProps {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    tags: string[];
    isActive?: boolean; // Optional property to indicate if the course card is active
    enroll?: ()=> void;
}

export type RootStackParamList = {
  Main: undefined;
  Login: undefined;
  Signup: undefined;
  Onboarding: undefined;
  CourseScreen: undefined;
  CoursePlayer: { userCourse: UserCourseResponse }; 
};


export interface JwtPayloadWithUser {
  exp: number;
  iat: number;
  user: User;
}
export interface User {
  _id: string;
  phone: number;
  password: string;
  __v: number;
}


export interface content{
    id : string ;
    title : string ;
    description : string ;
    videoUrl : string ;
    duration : string ;
    watchedTill : Number ;
    isCompleted : boolean ;
    thumbnailUrl : string ;

}


export interface courseContent{
    id : string ; 
    title : string ; 
    content : content[] ;
    isActive?: boolean; 
    organisation : string ;
    price: number ;
    rating: number ;
    tags: string[] ;
    imageUrl : string ;
    enrolledStudents : number ;
    isEnrolled : boolean ;


    // in future add teacher details 

}

// profile metadata
export interface UserProfile {
  bloodGroup: string;
  healthCondition: string;
  otherHealthCondition?: string;
  interests: string[];
  aspiration: string;
  shortStory: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export type Progress= {
  completed: number;
  percentage : number ;
  total : number ;

}
// Represents a single lesson/module
export interface CourseContentItem {
  _id: string; // comes from MongoDB
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  thumbnailUrl: string;
  progress : Progress ;
}

// Represents a course from backend
export interface CourseFromBackend {
  _id: string;
  title: string;
  content: CourseContentItem[];
  isActive: boolean;
  organisation: string;
  price: number;
  rating: number;
  tags: string[];
  imageUrl: string;
  enrolledStudents: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  isEnrolled?: boolean;
}

// User progress metadata
export interface UserCourseProgress {
  completed: number;
  total: number;
  percentage: number;
}

// The actual object returned from backend
export interface UserCourseResponse {
  _id: string; // UserCourse document id
  course: CourseFromBackend;
  progress: UserCourseProgress;
  completedModules: string[]; // IDs of completed lessons
  watchedTill: Record<string, number>; // { [lessonId]: secondsWatched }
}
type JobCard = {
  id: string
  type: 'job'
  image: string
  title: string
  org: string
  paycheck: string
  tags: string[]
}

type OrderCard = {
  id: string
  type: 'order'
  image: string
  title: string
  quantity: string
}





export type CardType = JobCard | OrderCard



