# bugsnag2clickup

A Bugsnag-ClickUp integration.

## Deployment

You'll need a [ClickUp API](https://clickup.com/api) Token (`CLICKUP_TOKEN`) and a specific list (`CLICKUP_LIST_ID`) where you want to create the tasks configured in your AWS Lambda environment variables.

You can use the `npm build` or `yarn build` to generate the `bugsnag2clickup.zip` and then upload it to the AWS Lambda.

As last step, you should configure your AWS Lambda function as [Data Forwarding Webhook integration](https://docs.bugsnag.com/product/integrations/data-forwarding/webhook/) in Bugsnag.

## Local Development

Below is a list of commands you will probably find useful.

### `npm start` or `yarn start`

Runs the project in development/watch mode. Your project will be rebuilt upon changes. TSDX has a special logger for you convenience. Error messages are pretty printed and formatted for compatibility VS Code's Problems tab.

<img src="https://user-images.githubusercontent.com/4060187/52168303-574d3a00-26f6-11e9-9f3b-71dbec9ebfcb.gif" width="600" />

Your library will be rebuilt if you make edits.

### `npm run build` or `yarn build`

Bundles the package to the `dist` folder.
The package is optimized and bundled with Rollup into multiple formats (CommonJS, UMD, and ES Module).

<img src="https://user-images.githubusercontent.com/4060187/52168322-a98e5b00-26f6-11e9-8cf6-222d716b75ef.gif" width="600" />

### `npm test` or `yarn test`

Runs the test watcher (Jest) in an interactive mode.
By default, runs tests related to files changed since the last commit.
