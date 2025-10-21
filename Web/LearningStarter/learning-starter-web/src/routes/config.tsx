import { Route, Routes as Switch, Navigate } from "react-router-dom";
import { LandingPage } from "../pages/landing-page/landing-page";
import { NotFoundPage } from "../pages/not-found";
import { useUser } from "../authentication/use-auth";
import { UserPage } from "../pages/user-page/user-page";
import { PageWrapper } from "../components/page-wrapper/page-wrapper";
import { routes } from ".";
import { PracticePage } from "../pages/practice-page/practice-page";
import { LearningResourcesPage } from "../pages/learning-resources-page/learning-resources-page";
import { DailyChallengePage } from "../pages/daily-challenge-page/daily-challenge-page";
import { UserUpdate }  from "../pages/user-page/user-update";
import { UserHistory }  from "../pages/user-page/user-history";
//This is where you will tell React Router what to render when the path matches the route specified.
export const Routes = () => {
  //Calling the useUser() from the use-auth.tsx in order to get user information
  const user = useUser();
  return (
    <>
      {/* The page wrapper is what shows the NavBar at the top, it is around all pages inside of here. */}
      <PageWrapper user={user}>
        <Switch>
          <Route path={routes.home} element={<LandingPage />} />
          <Route path={routes.practice} element={<PracticePage />} />
          <Route path={routes.user} element={<UserPage />} />
          <Route path={routes.learningResources} element={<LearningResourcesPage />} />
          <Route path={routes.dailyChallenge} element={<DailyChallengePage />} />
          <Route path={routes.userUpdate} element={<UserUpdate />} />
          <Route path={routes.userHistory} element={<UserHistory />} />
          <Route path={routes.root} element={<Navigate to={routes.home} replace />} />
          <Route path="*" element={<LandingPage />} />
        </Switch>
      </PageWrapper>
    </>
  );
};
