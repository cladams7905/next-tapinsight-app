"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/shared/tabs";
import SignInForm from "./SignInForm";
import RegisterForm from "./RegisterForm";

export interface AuthFormProps {
  closeSignInModal: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ closeSignInModal }) => {
  return (
    <div className="w-full space-y-5">
      <Tabs defaultValue="signin" className="w-full items-start">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        <TabsContent value="signin">
          <SignInForm />
        </TabsContent>
        <TabsContent value="register">
          <RegisterForm />
        </TabsContent>
      </Tabs>
      {/* <OAuthForm /> */}
    </div>
  );
};
