# Pull Request Notifier - Chrome Extension

[![Build Status](https://travis-ci.org/eps90/pull-request-notifier.svg?branch=pull-request-notifier-9)](https://travis-ci.org/eps90/pull-request-notifier)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/1721a07572614288b17dbd034213ad32)](https://www.codacy.com/app/eps90/pull-request-notifier?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=eps90/pull-request-notifier&amp;utm_campaign=Badge_Grade)
[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/1721a07572614288b17dbd034213ad32)](https://www.codacy.com/app/eps90/pull-request-notifier?utm_source=github.com&utm_medium=referral&utm_content=eps90/pull-request-notifier&utm_campaign=Badge_Coverage)
[![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.png?v=101)](https://github.com/ellerbrock/typescript-badges/)

The Google Chrome extension that allows you to be notified of changes in Pull Requests.
Currently only Bitbucket is supported. GitHub support is on the way (see milestones).

![assigned_prs](docs/pr_notifier_assigned.png)

## Why?

The motivation of creating this project is simple. 

Developers who work in team on the same project
want to have immediate feedback on code they create. They create pull requests and assign people
asking for a code review. Assigned people receive email notifications but sometimes they 
are getting lost in a mass of messages they receive everyday.

I wanted to provide simple and immediate notifications for developers using Bitbucket for repository 
hosting to make their work easier and more responsive.

Currently project is being used by a small bunch of developers. 
Instant feedback and feature requests pushed me to release several versions
and the `0.6.0` version was the last one published before it's been published
on Github.

## Features

* Extension popup with a list of assigned and authored pull requests
* Code review progress:
	* proportions (3/10 - three people accepted per 10 assigned)
	* percentage (25%)
	* progress bar
* Pull request preview with detailed info
	* target branch
	* markdown-formatted description
	* list of assignees
* Showing notifications:
	* Assigned new pull request
	* Accepted pull request
	* Updated pull requests
	* Comments and replies on a pull request
* Notification sounds
* Sending a reminder to all assignees who haven't approved a PR yet
* Easier PR opening by clicking on a notification or an item on the list
* Google Analytics tracking
* Error and logs tracking with [Loggly](https://www.loggly.com/)

## Built with

* [Typescript](https://www.typescriptlang.org/)
* [AngularJS](https://angularjs.org/)
* [Webpack](https://webpack.js.org/)
* [Gulp](https://gulpjs.com/)
* [Karma runner](http://karma-runner.github.io/)
* [Jasmine](https://jasmine.github.io/)
* and many more!

## Requirements

Due to API changes, **at least version 33.x.x of Google Chrome is required**. 
However, the current version is highly recommended. 

### Development

To run project on your machine, ensure you have following packages installed:

* **node.js** >= 6.x
* **yarn** >= 1.0.0
* **gulp** - tested with 3.9.1

## Installation

To install project dependencies, simply run the following command from root directory of the project:
 
```bash
yarn install
```

## Testing
To run tests, execute standard npm command:

```bash
yarn test
```

### Coverage

If you want to generate code coverage, you can set `GENERATE_COVERAGE=1` environment variable.
Coverage report will be dumped into `build/coverage` directory.

```bash
GENERATE_COVERAGE=1 yarn test
```

## Building a project

The extension is built with **Webpack**. There are two ways to build a project: `dev` and `prod`. 
Running tests also executes build with its own context, so there's also a `test` environment.
Details of build process are shown in the table below.

### Dev-version

Development version of the build results in creating a `dist` directory 
with compiled sources and re-generated extension manifest. You can point your browser
here to run it locally.

To build development version of the project, run the following in your terminal: 

```bash
yarn run build:dev
``` 

### Production version

Production version is almost the same as development but it takes much more time to build
because of more aggressive code uglification. The result of the `prod` build is a zipped extension,
ready to publish in the store. You can find it in `build` directory.

To build production version of the project, run the following in your terminal:

```bash
yarn run build:prod
``` 
 
If you'd like to create an extension file, ready to use in your browser without publishing it in the store, you can run
alternative prod build by calling


```bash
yarn run build:crx
```
 
You can find the result file with `*.crx` extension in `build` directory. To install it, simply  drag-and-drop it onto the
[extensions page](chrome://extensions). 


> **Note:** To build the CRX file properly, it needs a key for package signature.
> To point where is your key, use `CRX_PEM_PATH` environment variable.  

### Build steps on environments

| Build step | DEV | TEST | PROD |
| --- | --- | --- | --- |
| `*.ts` files compilation | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| tslint checks | :white_check_mark: | :white_check_mark: | :x: |
| stylelint checks | :white_check_mark: | :white_check_mark: | :x: |
| merging common code | :white_check_mark: | :x: | :white_check_mark: |
| generating html views | :white_check_mark: | :x: | :white_check_mark: |
| generating html views | :white_check_mark: | :x: | :white_check_mark: |
| sources uglifying | :x: | :x: | :white_check_mark: |

### Environment variables with DotEnv

For some cases, e.g. Google Analytics or Loggly integration, you must provide a token to communicate with the service.
This can be made by a **DotEnv** webpack plugin. To set up your secrets, create a copy of `.env.example` in the project root
and rename it to `.env`. Then update desired values.  

> The `.env` file is ignored by git.

## Google Analytics tracking

Extension is integrated with Google Analytics. It sends page views, events and custom timings.

### Enable tracking

To enable tracking, simply insert a tracking code into `.env` file for `GOOGLE_ANALYTICS_KEY` variable.

### Tracking details

Currently, following events are sending hits to Google Analytics:

1. Page views:
* Pop-up
* Background page (when extension starts)
* Options page

2. Events:
* Pop-up opened
* Pull request opened and which way it's been opened
* Reminder sent
* Successful connection to server established
* Switch tabs (and which tab)
* Notification shown (and which notification)

3. Custom timings:
* How long is pop-up opened?
* How long is notification shown (and closed by user interaction)? 

## Contributing
 
Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on the code of conduct, and the process for submitting pull requests.
 
## Versioning

The project uses [SemVer](http://semver.org/) for versioning. For the versions available, [see the tags on this repository](https://github.com/eps90/pull-request-notifier/tags). 

## License

 > todo
