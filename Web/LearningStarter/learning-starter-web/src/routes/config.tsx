// src/routes/index.tsx
import { Route, Routes as Switch, Navigate } from "react-router-dom";
import { LandingPage } from "../pages/landing-page/landing-page";
import { NotFoundPage } from "../pages/not-found";
import { useUser } from "../authentication/use-auth";
import { UserPage } from "../pages/user-page/user-page";
import { PageWrapper } from "../components/page-wrapper/page-wrapper";
import { PracticePage } from "../pages/practice-page/practice-page";
import { LearningResources } from "../pages/learning-resources-page/learning-resources-page";
import { DailyChallenge } from "../pages/daily-challenge-page/daily-challenge-page";
import { UserUpdate } from "../pages/user-page/user-update";
import { UserHistory } from "../pages/user-page/user-history";
import GrammarChat from "../pages/learning-resources-page/grammar-chat-page";
import { routes } from ".";


export const Routes = () => {
  const user = useUser();

  return (
    <PageWrapper user={user}>
      <Switch>
        <Route path={routes.home} element={<LandingPage />} />
        <Route path={routes.practice} element={<PracticePage />} />
        <Route path={routes.user} element={<UserPage />} />
        <Route path={routes.learningResources} element={<LearningResources />} />
        <Route path={routes.dailyChallenge} element={<DailyChallenge />} />
        <Route path={routes.userUpdate} element={<UserUpdate />} />
        <Route path={routes.userHistory} element={<UserHistory />} />
        <Route path={routes.grammarChat} element={<GrammarChat />} />
        <Route path={routes.root} element={<Navigate to={routes.home} replace />} />
        <Route path="*" element={<LandingPage />} />
      </Switch>
    </PageWrapper>
  );
};
