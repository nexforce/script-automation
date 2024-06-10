const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
};

const downloadTextFile = (filename, content) => {
  const element = document.createElement("a");
  element.href = `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`;
  element.download = filename;
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

const portalId = window.location.toString().split(/[/?]/)?.[4];
const token = getCookie("csrf.app");

let progress = 0;
let total;

const getRecordsCount = async ({ objectTypeId, propertyName, ...rest }) => {
  const filter = {
    portalId,
    objectTypeId,
    requestOptions: {
      includeAllValues: true,
      allPropertiesFetchMode: "latest_version",
    },
    filterGroups: [
      { filters: [{ operator: "HAS_PROPERTY", property: propertyName }] },
    ],
  };

  let count;

  try {
    const response = await fetch(
      `https://app.hubspot.com/api/crm-search/report?portalId=${portalId}&clienttimeout=14000&hs_static_app=property-edit-modal-ui&hs_static_app_version=1.23909`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          cookie: `hubspotapi-csrf=${token}`,
          "x-hubspot-csrf-hubspotapi": token,
        },
        body: JSON.stringify(filter),
      }
    );

    const body = JSON.parse(await response.text());

    count = body.count;
  } catch {
    count = 0;
  }

  console.log(`${++progress}/${total} properties obtained`);

  return { ...rest, objectTypeId, propertyName, count };
};

const getObjectProperties = async ({ id, singularForm }) => {
  const response = await fetch(
    `https://app.hubspot.com/api/crm-object-schemas/v3/schemas/${id}?portalId=${portalId}&clienttimeout=14000&hs_static_app=PropertySettingsUI&hs_static_app_version=1.29658`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        cookie: `hubspotapi-csrf=${token}`,
        "x-hubspot-csrf-hubspotapi": token,
      },
    }
  );

  const body = JSON.parse(await response.text());

  return body.properties.map((p) => ({
    objectTypeId: id,
    singularForm,
    propertyLabel: p.label,
    propertyName: p.name,
    type: p.hubspotDefined ? "HUBSPOT_DEFINED" : "USER_DEFINED",
  }));
};

const getAllCustomObjectTypes = async () => {
  const response = await fetch(
    `https://app.hubspot.com/api/graphql/crm?portalId=${portalId}&clienttimeout=180000&hs_static_app=crm-pipeline-settings&hs_static_app_version=1.7184`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: `hubspotapi-csrf=${token}`,
        "x-hubspot-csrf-hubspotapi": token,
      },
      body: JSON.stringify({
        operationName: "FetchAllObjectTypes",
        variables: {},
        query:
          "query FetchAllObjectTypes {\n  allObjectTypes(bypassTranslations: true) {\n    id\n    name\n    singularForm\n    pluralForm\n    metaTypeId\n  }\n}",
      }),
    }
  );

  const body = JSON.parse(await response.text());

  return body.data?.allObjectTypes.filter((o) => o.metaTypeId === 2);
};

const defaultObjectsList = [
  {
    singularForm: "Contact",
    id: "0-1",
  },
  {
    singularForm: "Company",
    id: "0-2",
  },
  {
    singularForm: "Deal",
    id: "0-3",
  },
  {
    singularForm: "Ticket",
    id: "0-5",
  },
  {
    singularForm: "Marketing Campign",
    id: "0-35",
  },
  {
    singularForm: "Marketing Event",
    id: "0-54",
  },
  {
    singularForm: "Feedback Submission",
    id: "0-19",
  },
  {
    singularForm: "Invoice",
    id: "0-53",
  },
  {
    singularForm: "Product",
    id: "0-7",
  },
];

const segmentArray = (array, batchLength) =>
  Array.from({ length: Math.ceil(array.length / batchLength) }, (_, i) =>
    array.slice(i * batchLength, (i + 1) * batchLength)
  );

const segmentPromises = async (asyncFuncs, batchSize) => {
  let resolvedPromises = [];
  for (const batch of segmentArray(asyncFuncs, batchSize)) {
    resolvedPromises = [
      ...resolvedPromises,
      ...(await Promise.all(batch.map((f) => f()))),
    ];
  }
  return resolvedPromises;
};

const func = async () => {
  const objectTypes = [
    ...defaultObjectsList,
    ...(await getAllCustomObjectTypes()),
  ];

  const properties = (
    await segmentPromises(
      objectTypes.map((o) => () => getObjectProperties(o)),
      1000
    )
  ).flat();

  total = properties.length;

  const data = (
    await segmentPromises(
      properties.map((p) => () => getRecordsCount(p)),
      50
    )
  ).flat();

  const csvContent = data.reduce(
    (acc, { singularForm, propertyLabel, propertyName, type, count }) => {
      return `${acc}${singularForm};${propertyLabel};${propertyName};${type};${count}\n`;
    },
    "Object;Label;Internal name;Type;Populated records count\n"
  );

  downloadTextFile("result.csv", csvContent);
};

func();
