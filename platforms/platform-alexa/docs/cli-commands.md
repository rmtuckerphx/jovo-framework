---
title: 'Alexa CLI Commands'
excerpt: 'Learn how to build and deploy Alexa projects using the Jovo CLI.'
url: 'https://www.jovo.tech/marketplace/platform-alexa/cli-commands'
---

# Alexa CLI Commands

Learn how to build and deploy Alexa projects using the Jovo CLI.

## Introduction

The Alexa CLI plugin allows you to interact with the [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask#/) using the Jovo CLI.

To use the Alexa CLI, add it as plugin to your `jovo.project.js` file. [Learn more about Alexa project configuration here](./project-config.md).

```js
const { ProjectConfig } = require('@jovotech/cli-core');
const { AlexaCli } = require('@jovotech/platform-alexa');
// ...

const project = new ProjectConfig({
  // ...
  plugins: [
    new AlexaCli(),
    // ...
  ],
});
```

The Alexa CLI plugin uses the official ASK (Alexa Skills Kit) CLI provided by Amazon for deployment. For the deployment to work, you need to at least set up a `default` ASK profile using the ASK CLI. [Follow the official Alexa docs to install and configure ASK CLI](https://developer.amazon.com/en-US/docs/alexa/smapi/quick-start-alexa-skills-kit-command-line-interface.html).

The Alexa CLI plugin hooks into the following commands:

- [`build`](#build): Create Alexa project files based on the project config and `models` folder
- [`deploy`](#deploy): Deploy project files to the Alexa Developer Console
- [`get`](#get): Synchronize your local project files with the Alexa Developer Console

Also it provides the following platform specific commands:

- [`validate:alexa`](#validate): Trigger the Alexa Skill Validation
- [`certify:alexa`](#certify): Trigger the Alexa Skill Certification

## build

The Alexa CLI plugin hooks into the `build` command and creates a `platform.alexa` folder inside the `build` directory in the root of your Jovo project. [Learn more about the `build` command here](https://www.jovo.tech/docs/build-command).

```sh
$ jovo build:platform alexa
```

It uses the [Alexa `jovo.project.js` configuration](./project-config.md) and files in the [`models` folder](https://www.jovo.tech/docs/models) to create Alexa-specific project files that are ready for deployment.

The folder then contains an `ask-resources.json` file and a `skill-package` folder as explained in the [official Alexa docs](https://developer.amazon.com/en-US/docs/alexa/smapi/ask-cli-intro.html#skill-project-structure).

The Alexa CLI plugin adds the following flags to the [`build` command](https://www.jovo.tech/docs/build-command):

| Flag            | Description                                                                                                                                     | Examples                |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| `--ask-profile` | Add the specified ASK profile to the `ask-states.json` file. [Learn more about ASK profile configuration here](./project-config.md#askprofile). | `--ask-profile default` |
| `--async`       | Deploys the skill asynchronously. You can check the status of the upload using the ASK CLI.                                                     | `--async`               |


You can also add the `--reverse` flag to turn the Alexa Interaction Model files in your `build` folder into [Jovo Model](https://www.jovo.tech/docs/models) files in your `models` folder. This is especially helpful if you maintain your Interaction Model in the Alexa Developer Console and then use the [`get` command](#get) to synchronize your console project with your local files. [Learn more about reverse builds here](https://www.jovo.tech/docs/build-command#reverse-build).

```sh
# Import files from Alexa Developer Console
$ jovo get:platform alexa

# Turn Alexa Interaction Model into Jovo Model
$ jovo build:platform alexa --reverse
```

## deploy

You can use the following CLI commands for deployment:

- [`deploy:platform`](#deploy-platform): Deploy your project to the Alexa Developer Console.
- [`deploy:code`](#deploy-code): Bundle and deploy your source code to a server or cloud hosting platform like AWS.
### deploy:platform

The Alexa CLI plugin hooks into the [`deploy:platform` command](https://www.jovo.tech/docs/deploy-command#deploy-platform) to deploy the Alexa project files (which were previously generated using the [`build` command](#build)) to the Alexa Developer Console.

```sh
$ jovo deploy:platform alexa
```

After successful deployment, you can open the [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask#/) and see the changes there. If it was the first deployment, a new Alexa Skill is created. The Skill ID is stored in `build/platform.alexa/.ask/ask-states.json`. We recommend copying the Alexa Skill ID and adding it to your [project config](project-config.md#skillid). This ensures that the project is always deployed to the right Skill in the Alexa Developer Console.

The Alexa CLI plugin adds the following flags to the [`deploy:platform` command](https://www.jovo.tech/docs/deploy-command#deploy-platform):

| Flag            | Description                                                                                                                   | Examples                |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| `--ask-profile` | Deploy to using the specified ASK profile. [Learn more about ASK profile configuration here](./project-config.md#askprofile). | `--ask-profile default` |
| `--async` | Don't wait for the model building process to be finished. Recommended for [Alexa Conversations](./alexa-conversations.md#manage-files). |  |
| `--skip-validation` | Skip the validation step of the [Alexa Conversations](./alexa-conversations.md#manage-files) ACDL compiler. |  |

### deploy:code 

If you want to deploy the code of your Jovo app to a server or cloud service, you can use the [`deploy:code` command](https://www.jovo.tech/docs/deploy-command#deploy-code).

If you run into problems while bundling the code, make sure that the `bundle` script in your `package.json` file includes the following:

```json
{
  "scripts": {
    "bundle": "[...] --external:@alexa/*"
  }
}
```

The reason for this is that `esbuild` can't resolve `vscode`, a dependency used in `@alexa/acdl`, which is used for the [Alexa Conversations integration](./alexa-conversations.md).


## get

The Alexa CLI plugin hooks into the [`get:platform` command](https://www.jovo.tech/docs/get-command#get:platform) to synchronize the files in your `build` directory with the project data from the [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask#/).

```sh
$ jovo get:platform alexa
```

This is helpful if you've made any updates to the Skill's configuration (for example updating interfaces) that you now want to add to the `jovo.project.js` file using the [`files` configuration](/.project-config.md#files).

The Alexa CLI plugin adds the following flags to the [`get:platform` command](https://www.jovo.tech/docs/get-command#get-platform):

| Flag            | Description                                                                                                                       | Examples                |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| `--ask-profile` | Retrieve data using the specified ASK profile. [Learn more about ASK profile configuration here](./project-config.md#askprofile). | `--ask-profile default` |


After running `get`, you can turn your Alexa Interaction Model into [Jovo Model](https://www.jovo.tech/docs/models) files using [`build --reverse`](#build):

```sh
# Import files from Alexa Developer Console
$ jovo get:platform alexa

# Turn Alexa Interaction Model into Jovo Model
$ jovo build:platform alexa --reverse
```

## validate

The Alexa CLI plugin provides a command to easily trigger a Skill Validation.

```sh
$ jovo verify:alexa
```

After successfully triggering the validation, you can check the status in the [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask#/).

| Flag            | Description                                                                                                                                                                                          | Examples                                                             |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | 
| `--skill-stage` | Either `development`, `live` or `certification` depending on what skill stage is to be validated. Default is `development`                                                                           | `jovo validate:alexa --skill-stage development`             |     |     |
| `--skill-id`    | The skillId of the to be validated skill. If not provided, will be taken from the stage in the project configuration. [Learn more about ASK skillId configuration here](./project-config.md#skillid) | `jovo validate:alexa --skill-id amzn1.ask.skill.123example` |          
| `--ask-profile` | Deploy to using the specified ASK profile. If not provided as flag, will be taken from project configuration. [Learn more about ASK profile configuration here](./project-config.md#askprofile)      | `jovo validate:alexa --ask-profile default`                 |          
| `--locales`     | List of locales in which to validate the skill. If not provided, will do for all locales in project configuration. [Learn more about locales configuration here](./project-config.md#locales)        | `jovo validate:alexa --locales en-US de-DE`                 |          

## certify

The Alexa CLI plugin provides a command to easily trigger a Skill Certification.

```sh
$ jovo certify:alexa
```

After successfully triggering the certification, you can check the status of the certification in the [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask#/).

| Flag            | Description                                                                                                                                                                                          | Examples                                                             |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | 
| `--skill-id`    | The skillId of the to be validated skill. If not provided, will be taken from the stage in the project configuration. [Learn more about ASK skillId configuration here](./project-config.md#skillid) | `jovo certify:alexa --skill-id amzn1.ask.skill.123example` |          
| `--ask-profile` | Deploy to using the specified ASK profile. If not provided as flag, will be taken from project configuration. [Learn more about ASK profile configuration here](./project-config.md#askprofile)      | `jovo certify:alexa --ask-profile default`                 |          
| `--publication-method`     | Either `MANUAL_PUBLISHING` or `AUTO_PUBLISHING`. Default is `MANUAL_PUBLISHING`. [Learn more about publication methods](https://developer.amazon.com/en-US/docs/alexa/smapi/ask-cli-command-reference.html#submit-skill-for-certification-subcommand) | `jovo validate:alexa --publication-method AUTO_PUBLISHING`                 |          
