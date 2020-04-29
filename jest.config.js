// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  // automock: false,                                                                     /* All imported modules in your tests should be mocked automatically */
  // bail: 0,                                                                             /* Stop running tests after `n` failures */
  // browser: false,                                                                      /* Respect "browser" field in package.json when resolving modules */
  // cacheDirectory: "/private/var/folders/vd/jsvjz94n7_57c0n_94m8vjf80000gn/T/jest_dx",  /* The directory where Jest should store its cached dependency information */
  // clearMocks: false,                                                                   /* Automatically clear mock calls and instances between every test */
  // collectCoverage: false,                                                              /* Indicates whether the coverage information should be collected while executing the test */
  // collectCoverageFrom: undefined,                                                      /* An array of glob patterns indicating a set of files for which coverage information should be collected */
  collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!<rootDir>/src/main/**'],
  // coverageDirectory: 'coverage',                                                       /* The directory where Jest should output its coverage files */
  coverageDirectory: 'coverage',
  // coveragePathIgnorePatterns: ["/node_modules/"],                                      /* An array of regexp pattern strings used to skip coverage collection */
  // coverageReporters: ["json", "text", "lcov", "clover"],                               /* A list of reporter names that Jest uses when writing coverage reports */
  // coverageThreshold: undefined,                                                        /* An object that configures minimum threshold enforcement for coverage results */
  // dependencyExtractor: undefined,                                                      /* A path to a custom dependency extractor */
  // errorOnDeprecated: false,                                                            /* Make calling deprecated APIs throw helpful error messages */
  // forceCoverageMatch: [],                                                              /* Force coverage collection from ignored files using an array of glob patterns */
  // globalSetup: undefined,                                                              /* A path to a module which exports an async function that is triggered once before all test suites */
  // globalTeardown: undefined,                                                           /* A path to a module which exports an async function that is triggered once after all test suites */
  // globals: {},                                                                         /* A set of global variables that need to be available in all test environments */
  // maxWorkers: "50%",                                                                   /* The maximum amount of workers used to run your tests. Can be specified as % or a number. E.g. maxWorkers: 10% will use 10% of your CPU amount + 1 as the maximum worker number. maxWorkers: 2 will use a maximum of 2 workers. */
  // moduleDirectories: ["node_modules"],                                                 /* An array of directory names to be searched recursively up from the requiring module's location */
  // moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "node"],                    /* An array of file extensions your modules use */
  // moduleNameMapper: {},                                                                /* A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module */
  // modulePathIgnorePatterns: [],                                                        /* An array of regexp pattern strings, matched against all module paths before considered 'visible' to the module loader */
  // notify: false,                                                                       /* Activates notifications for test results */
  // notifyMode: "failure-change",                                                        /* An enum that specifies notification mode. Requires { notify: true } */
  // preset: undefined,                                                                   /* A preset that is used as a base for Jest's configuration */
  preset: '@shelf/jest-mongodb',
  // projects: undefined,                                                                 /* Run tests from one or more projects */
  // reporters: undefined,                                                                /* Use this configuration option to add custom reporters to Jest */
  // resetMocks: false,                                                                   /* Automatically reset mock state between every test */
  // resetModules: false,                                                                 /* Reset the module registry before running each individual test */
  // resolver: undefined,                                                                 /* A path to a custom resolver */
  // restoreMocks: false,                                                                 /* Automatically restore mock state between every test */
  // rootDir: undefined,                                                                  /* The root directory that Jest should scan for tests and modules within */
  // roots: undefined,                                                                    /* A list of paths to directories that Jest should use to search for files in */
  roots: ['<rootDir>/src'],
  // runner: "jest-runner",                                                               /* Allows you to use a custom runner instead of Jest's default test runner */
  // setupFiles: [],                                                                      /* The paths to modules that run some code to configure or set up the testing environment before each test */
  // setupFilesAfterEnv: [],                                                              /* A list of paths to modules that run some code to configure or set up the testing framework before each test */
  // snapshotSerializers: [],                                                             /* A list of paths to snapshot serializer modules Jest should use for snapshot testing */
  // testEnvironment: 'node',                                                             /* The test environment that will be used for testing */
  testEnvironment: 'node',
  // testEnvironmentOptions: {},                                                          /* Options that will be passed to the testEnvironment */
  // testLocationInResults: false,                                                        /* Adds a location field to test results */
  // testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],        /* The glob patterns Jest uses to detect test files */
  // testPathIgnorePatterns: ["/node_modules/"],                                          /* An array of regexp pattern strings that are matched against all test paths, matched tests are skipped */
  // testRegex: [],                                                                       /* The regexp pattern or array of patterns that Jest uses to detect test files */
  // testResultsProcessor: undefined,                                                     /* This option allows the use of a custom results processor */
  // testRunner: "jasmine2",                                                              /* This option allows use of a custom test runner */
  // testURL: "http://localhost",                                                         /* This option sets the URL for the jsdom environment. It is reflected in properties such as location.href */
  // timers: "real",                                                                      /* Setting this value to "fake" allows the use of fake timers for functions such as "setTimeout" */
  // transform: none,                                                                     /* A map from regular expressions to paths to transformers */
  transform: { '.+\\.ts$': 'ts-jest' }
  // transformIgnorePatterns: ["/node_modules/"],                                         /* An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation */
  // unmockedModulePathPatterns: undefined,                                               /* An array of regexp pattern strings that are matched against all modules before the module loader will automatically return a mock for them */
  // verbose: undefined,                                                                  /* Indicates whether each individual test should be reported during the run */
  // watchPathIgnorePatterns: [],                                                         /* An array of regexp patterns that are matched against all source file paths before re-running tests in watch mode */
  // watchman: true,                                                                      /* Whether to use watchman for file crawling */
}
