import { awsHandler, gcpHandler } from '../src';

const firstException = {
  account: {
    id: '',
    name: '',
    url: '',
  },
  project: {
    id: '',
    name: '',
    url: '',
  },
  trigger: {
    type: 'firstException',
    message: 'New unhandled exception',
  },
  error: {
    app: {
      version: '0.1.0',
    },
    context: '/users',
    errorId: '13509175311938571',
    exceptionClass: 'NotFoundError',
    firstReceived: '',
    id: 'at351513513',
    message: 'User "abc" was not found in the database.',
    receivedAt: '',
    url: 'https://google.com',
    stackTrace: [
      {
        inProject: true,
        file: 'something.js',
        lineNumber: '13251',
        method: 'find',
      },
      {
        inProject: true,
        file: 'another.js',
        lineNumber: '1251',
        method: 'findInternal',
      },
      {
        inProject: true,
        file: 'other.js',
        lineNumber: '11251',
        method: 'internals',
      },
    ],
  },
};

describe('bugsnag2clickup', () => {
  it('works with firstException on aws', async () => {
    const output = await awsHandler({
      body: JSON.stringify(firstException),
    });
    expect(output).toBeTruthy();
  });
  it('works with firstException on gcp', async () => {
    return new Promise(resolve => {
      const res = {
        json(data: any) {
          expect(data).toBeTruthy();
          resolve();
        },
      };

      gcpHandler(
        {
          body: firstException,
        },
        res
      );
    });
  });
});
