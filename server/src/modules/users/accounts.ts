import {AccountsTypeorm} from '@accounts/typeorm';
import {AccountsModule} from '@accounts/graphql-api';
import {AccountsServer} from '@accounts/server';
import {AccountsPassword} from '@accounts/password';
import {AccountsPasswordOptions} from "@accounts/password/lib/accounts-password";


const accountPasswordOptions: AccountsPasswordOptions = {
  validateNewUser: (user: any) => {
    console.log('validateNewUser', user);

    return user;
  },
};

export const setUpAccounts = (connection: any) => {
  try {
    const accountsDb = new AccountsTypeorm({connection, cache: 1000});
    const accountsPassword = new AccountsPassword(accountPasswordOptions);


    const accountsServer = new AccountsServer(
      {
        db: accountsDb,
        tokenSecret: process.env.ACCOUNTS_SECRET,
        // siteUrl: 'http://localhost:8000',
      },
      // @ts-ignore
      {password: accountsPassword}
    );

    const accountsGraphQL = AccountsModule.forRoot({
      accountsServer,
    });

    return {accountsGraphQL, accountsServer}
  } catch (e) {
    throw e;
  }
};
