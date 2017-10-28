# Contributing

Please note we have a code of conduct, please follow it in all your interactions with the project.

## General

1. Write clean code.
2. Follow SOLID and KISS principles in your code.
3. Ensure your feature is fully covered with tests.
4. If you're developing new feature, create a pull request to `develop` branch.
5. In case you have a hotfix to create, start making your changes from `master` and create a pull request to this branch.

## Pull Request Process

1. **Start developing your changes from `develop` branch`. This is a branch with awaiting features to be released.
2. Ensure that project still runs the build and passes all tests successfully.
2. Verify that the built application is starting without errors or other problems making it unusable. 
3. If needed, update README.md with installation instructions, necessary environment variables, paths, etc. 
4. Once Pull Request is made, automatic build is being fired on Travis and Codacy. Make sure it still passes.
5. The Pull Request will be merged once it's reviewed by repository owner and/or contributors 
and gets approvals from all people involved in a code review.

## Internationalization

### Application messages

1. In `app/lang`, please find a directory with language code you're going to translation from (e.g. `app/lang/en`) 
and make its copy, calling it with the desired translations' language code, e.g. `app/lang/de`.
2. Edit copied JSON files with correct translations. You can create separate JSON files and import them later.
3. Customize `meta.json` file in new directory with your translation's metadata. Please find detailed description of 
translation metadata files below. 
4. Create a pull request following [Pull Request Process](#pull-request-process) chapter

> *Note:* You can use [ngTranslateEditor](http://mrhieu.github.io/ngTranslateEditor) to create new translations 
from existing file.


### Translation metadata files

Every translation directory has to contain metadata file. It contains basic language info and files that should be imported. 
It **must be** called `meta.json`. Here's an example of metadata file for polish translations:

```json
{
    "name": "Polish",
    "code": "pl",
    "isDefault": false,
    "files": [
        "pl.json",
        "messages_pl.json",
        "subdir/other_messages.json"
    ],
    "availableKeys": [
        "pl_*",
        "PL-*"
    ]
}
```

Each metadata file **must** contain several obligatory fields:

* **name** - The name of the language. This name will be displayed in application settings
* **code** - This is the language code, which must be unique among all the languages. It will be used as key for translation
module configuration. You don't have to follow ISO codes here.
* **files** - The array of paths to translation paths, relative to `meta.json` file. You can load files from subdirectories here.
You must provide **at least one** path to translation.

Moreover, there are some properties which are not required: 
* **availableKeys** - This is the array of language codes provided by browsers to determine user's language. Since there's
no single standard for such language, you can provide multiple languages and wildcards in languages codes.
The codes in the example above will match `pl_pl`, `pl_PL`, `PL-PL`, `pl-pl` codes. This property is not obligatory, but if you
pass nothing there, the application won't switch to the browser's language if it find translation for it.
* **isDefault** which tells the translation module that this language should be application's default language if none of languages
provided so far won't be able to resolve to browser's language. If not provided, will be resolved to `false` by default.

## Contributor Covenant Code of Conduct

### Our Pledge

In the interest of fostering an open and welcoming environment, we as
contributors and maintainers pledge to making participation in our project and
our community a harassment-free experience for everyone, regardless of age, body
size, disability, ethnicity, gender identity and expression, level of experience,
nationality, personal appearance, race, religion, or sexual identity and
orientation.

### Our Standards

Examples of behavior that contributes to creating a positive environment
include:

* Using welcoming and inclusive language
* Being respectful of differing viewpoints and experiences
* Gracefully accepting constructive criticism
* Focusing on what is best for the community
* Showing empathy towards other community members

Examples of unacceptable behavior by participants include:

* The use of sexualized language or imagery and unwelcome sexual attention or
  advances
* Trolling, insulting/derogatory comments, and personal or political attacks
* Public or private harassment
* Publishing others' private information, such as a physical or electronic
  address, without explicit permission
* Other conduct which could reasonably be considered inappropriate in a
  professional setting

### Our Responsibilities

Project maintainers are responsible for clarifying the standards of acceptable
behavior and are expected to take appropriate and fair corrective action in
response to any instances of unacceptable behavior.

Project maintainers have the right and responsibility to remove, edit, or
reject comments, commits, code, wiki edits, issues, and other contributions
that are not aligned to this Code of Conduct, or to ban temporarily or
permanently any contributor for other behaviors that they deem inappropriate,
threatening, offensive, or harmful.

### Scope

This Code of Conduct applies both within project spaces and in public spaces
when an individual is representing the project or its community. Examples of
representing a project or community include using an official project e-mail
address, posting via an official social media account, or acting as an appointed
representative at an online or offline event. Representation of a project may be
further defined and clarified by project maintainers.

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be
reported by contacting the project team at [INSERT EMAIL ADDRESS]. All
complaints will be reviewed and investigated and will result in a response that
is deemed necessary and appropriate to the circumstances. The project team is
obligated to maintain confidentiality with regard to the reporter of an incident.
Further details of specific enforcement policies may be posted separately.

Project maintainers who do not follow or enforce the Code of Conduct in good
faith may face temporary or permanent repercussions as determined by other
members of the project's leadership.

### Attribution

This Code of Conduct is adapted from the [Contributor Covenant][homepage], version 1.4,
available at https://www.contributor-covenant.org/version/1/4/code-of-conduct.html

[homepage]: https://www.contributor-covenant.org
