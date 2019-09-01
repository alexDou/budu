import { AuthChecker } from 'type-graphql';
import { Role, UserContext } from './@types';


export const authChecker: AuthChecker<UserContext> = ({ context }, roles: Role[]) => {
  const { user } = context;

  // if `@Authorized()`, check only is user exist
  if (roles.length === 0) return user !== undefined;
  // there are some roles defined now

  // and if no user, restrict access
  if (!user) return false;

  if (!context.user.roles) {
    console.error('user has no roles');
    return false;
  }

  if (context.user.roles.some(r => roles.includes(r.value as Role))) {
    // grant access if the roles overlap
    return true;
  }

  // no roles matched, restrict access
  return false;
};
