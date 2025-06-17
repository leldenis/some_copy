## Software stack

- [Nginx](https://nginx.org/en/docs)
- [Angular](https://angular.io/docs)
- [NestJs](https://docs.nestjs.com)
- [NgRx](https://ngrx.io/docs)
- [Angular Material](https://material.angular.io/)

### How to start locally

1. Create .env file and add `GITLAB_AUTH_TOKEN` variable with [token](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html).
2. Create .npmrc file based on .npmrc.sample
3. Run `npm install`
4. Run `npm run start:ui`
5. Run `npm run start:api`

**Starting with Nx 11, you can migrate workspaces only using nx migrate.** To reiterate: nx migrate runs the migrations
written by the Angular CLI team the same way ng update runs them. So everything should still work. You just get more
control over how it works.

If you ran ng update and saw the error telling you to use nx migrate, do the following:

- git checkout .
- git clean -f .
- rm -rf node_modules
- npm install (or yarn install)
- nx migrate latest
- npm install (or yarn install)
- nx migrate --run-migrations=migrations.json

## How to Migrate

Migration happens in two steps:

- Updating package.json (and node_modules)
- Updating the source code of the repo to match the new versions of packages in package.json

### Step 1: Updating package.json and generating migrations.json

Run the following:

`nx migrate latest # same as nx migrate @nx/workspace@latest`

You can also specify the name of the package and the version:

`nx migrate @nx/workspace@version # you can also specify version`

This will fetch the specified version of @nx/workspace, analyze the dependencies and fetch all the dependent packages.
The process will keep going until the whole tree of dependencies is resolved. This will result in:

- package.json being updated
- migrations.json being generated

At this point, no packages have been installed, and no other files have been touched.

Now, you can inspect package.json to see if the changes make sense. Sometimes the migration can update some package to
the version that is either not allowed or conflicts with with another package. After you are satisfied, run npm install,
yarn, or pnpm install.

### Step 2: Running migrations

Next, we need to update the repo to match the updated package.json and node_modules. Every Nx plugin comes with a set of
migrations that describe how to update the workspace to make it work with the new version of the plugin. During Step 1
Nx looked at all of the packages being updated and collected their migrations into migrations.json. It's important to
note that because Nx knows the from and to versions of every package, the migrations.json file only contains the
relevant migrations.

Each migration in migrations.json updates the source code in the repository. To run all the migrations in order, invoke:

`nx migrate --run-migrations=migrations.json`

For small projects, running all the migrations at once often succeeds without any issues. For large projects, more
flexibility is sometimes needed:

- You may have to skip a migration.
- You may want to run one migration at a time to address minor issues.
- You may want to reorder migrations.
- You may want to run the same migration multiple time if the process takes a long time and you had to rebase.

Since you can run nx migrate --run-migrations=migrations.json as many times as you want, you can achieve all of that by
commenting out and reordering items in migrations.json. The migrate process can take a long time, sometimes a day, so it
can be useful to commit the migrations file with the partially-updated repo.

### Step 3: Cleaning up

After you run all the migrations, you can remove migration.json and commit the changes.
