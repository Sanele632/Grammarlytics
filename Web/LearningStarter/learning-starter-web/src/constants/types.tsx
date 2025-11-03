//This type uses a generic (<T>).  For more information on generics see: https://www.typescriptlang.org/docs/handbook/2/generics.html
//You probably wont need this for the scope of this class :)
export type ApiError = {
  property: string;
  message: string;
};

export type ApiResponse<T = any> = {
  data: T;
  hasErrors: boolean;
  errors: ApiError[];
};

export interface UserDto {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  streakCount: number;
  profilePicture: string;
}

export type UserGetDto = {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  streakCount: number;
  profilePicture: string;
};

export type UserFormValues = {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  profilePicture: string;
}

export type UserUpdateDto = {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  profilePicture: string;
};

export interface DailyChallengeGetDto {
  id: number;
  date: string;
  incorrectSentence: string;
  correctSentence: string;
}

export interface LearningResourceDto {
  id: number;
  topic: string;
  content: string;
}

