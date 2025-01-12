import { PropsWithChildren, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RouteNamesEnum } from 'localConstants';
import { useGetIsLoggedIn } from '../../hooks';

interface AuthRedirectWrapperPropsType extends PropsWithChildren {
  requireAuth?: boolean;
  params?: string;
}

export const AuthRedirectWrapper = ({
  children,
  requireAuth = true,
  params,
}: {
  children: React.ReactNode;
  requireAuth?: boolean;
  params?: string;
}) => {
  const isLoggedIn = useGetIsLoggedIn();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn && !requireAuth) {
      navigate(`${RouteNamesEnum.dashboard}?${params}`);

      return;
    }

    if (!isLoggedIn && requireAuth) {
      navigate(`${RouteNamesEnum.unlock}?${params}`);
    }
  }, [isLoggedIn]);

  return <>{children}</>;
};
