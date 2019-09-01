import { UserMeeting } from "../modules/users";
import { Context, Role, UserContext } from "../modules/users/@types";


// export function helperMethodCallInterceptor<T extends object>(obj: T, func: Function): ProxyHandler<T> {
//     const handler = {
//         get(target: object, propKey: PropertyKey, receiver: any) {
//             const targetValue = Reflect.get(target, propKey, receiver);
//             if (typeof targetValue === 'function') {
//                 return function (...args: any[]) {
//                     return targetValue.apply(this, func(...args));
//                 }
//             } else {
//                 return targetValue;
//             }
//         }
//     };
//
//     return new Proxy(obj, handler);
// }

export const helperCheckRole = (userRecord: UserMeeting, ctx: UserContext, validRoles: Role[]) => {
    // allow owning user to pass through
    if (userRecord.user.id !== ctx.user.id) {
        // role status flag
        let roleCheck: boolean = false;
        ctx.user.roles.forEach(role => {
            if (validRoles.includes(role.value as Role)) {
                roleCheck = true;
                return true;
            }
        });

        if (!roleCheck) {
            throw new Error(`Only ${validRoles.join(', ')} have access to this feature.`);
        }
    }

    return true;
};
