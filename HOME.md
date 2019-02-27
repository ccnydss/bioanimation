This is the documentation for the bioanimation code.

## Set up instructions
Clone the repository, make sure you have the latest versions of NodeJS and NPM,
then run `npm install` inside the bioanimation directory.

You can run the application directly in the browser by opening `index.html`,
or as a desktop Electron application by running `npm run start` in the console.

## Scripts
`npm run dist-all` will build Electron applications for Windows, Mac OS, and
Linux.

`npm run publish` requires a GitHub authentication token defined in an
environment variable `GH_TOKEN` that has repo access. This will build the
Electron application for all platforms and automatically upload them to
GitHub Releases.

`npm run docs` will generate the JSDoc documention and output the result in the
`docs/` directory.
