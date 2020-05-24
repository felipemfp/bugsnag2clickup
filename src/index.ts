import fetch from 'node-fetch';

const CLICKUP_URL = `https://api.clickup.com`;
const CLICKUP_TOKEN = `${process.env.CLICKUP_TOKEN}`;
const CLICKUP_LIST_ID = `${process.env.CLICKUP_LIST_ID}`;

const headers = {
  Authorization: CLICKUP_TOKEN,
  'Content-Type': 'application/json',
};

type Event = {
  account: {
    id: string;
    name: string;
    url: string;
  };
  project: {
    id: string;
    name: string;
    url: string;
  };
  trigger: {
    type:
      | 'firstException'
      | 'powerTen' // TODO
      | 'projectSpiking' // TODO
      | 'comment'; // TODO
    message: string;
  };
  error: {
    id: string;
    errorId: string;
    exceptionClass: string;
    message: string;
    context: string;
    firstReceived: string;
    receivedAt: string;
    url: string;
    app: {
      version: string;
    };
    stackTrace?: {
      inProject: boolean;
      lineNumber?: string;
      columnNumber?: string;
      file?: string;
      method?: string;
      code?: Record<string, string>;
    }[];
  };
};

export const handler = async (event: Event) => {
  if (event.trigger.type === 'firstException') {
    return await handleFirstException(event);
  }

  return { ok: true };
};

async function handleFirstException(event: Event) {
  const name = `${event.error.exceptionClass}: ${event.error.context}`;
  const content: { ops: any[] } = {
    ops: [
      {
        insert: `${event.error.exceptionClass}: ${event.error.context}\n`,
        attributes: { size: 'large' },
      },
      { insert: `${event.error.message}\n` },
      { insert: '\n' },
      { insert: 'View on Bugsnag\n', attributes: { link: event.error.url } },
    ],
  };

  if (event.error.stackTrace) {
    content.ops.push({
      insert: `\nStacktrace\n`,
      attributes: { size: 'large' },
    });
    content.ops.push({
      insert: `${event.error.stackTrace
        .map(
          stackTrace =>
            `from ${stackTrace.file}:${stackTrace.lineNumber} in "${stackTrace.method}"`
        )
        .join('\n')}\n`,
      attributes: {
        'code-block': true,
      },
    });
    content.ops.push({
      insert: '\nView full stacktrace\n',
      attributes: { link: event.error.url },
    });
  }

  const custom_fields = [];
  const availableCustomFields = await getCustomFields();
  const bugsnagIdField = availableCustomFields.find(
    field => field.name === 'Bugsnag ID'
  );
  if (bugsnagIdField) {
    custom_fields.push({
      id: bugsnagIdField.id,
      value: event.error.errorId,
    });
  }

  return await createTask({
    name,
    content,
    custom_fields,
  });
}

type CustomFieldsData = {
  fields: {
    id: string;
    name: string;
  }[];
};

type Task = {
  name: string;
  content: { ops: any[] };
  custom_fields: { id: string; value: string }[];
};

async function createTask(task: Task) {
  const response = await fetch(
    `${CLICKUP_URL}/api/v2/list/${CLICKUP_LIST_ID}/task`,
    {
      method: 'POST',
      body: JSON.stringify(task),
      headers,
    }
  );
  return response.json();
}

async function getCustomFields() {
  const response = await fetch(
    `${CLICKUP_URL}/api/v2/list/${CLICKUP_LIST_ID}/field`,
    { headers }
  );
  const data: CustomFieldsData = await response.json();
  return data.fields;
}
