const BASE64_URL_SAFE_MAP = [
  ["+", "-"],
  ["/", "_"],
];

const convertBase64ToUrlSafeBase64 = (b64) => {
  return BASE64_URL_SAFE_MAP.reduce(
    (t, v) => t.replace(new RegExp(`\\${v[0]}`, "g"), v[1]),
    b64
  );
};

const uuidToBytes = (uuid) => {
  // Assuming valid UUID
  const bytes = [];
  uuid.replace(/[a-fA-F0-9]{2}/g, (hex) => {
    bytes.push(parseInt(hex, 16));
  });
  return bytes;
};

const arrayBufferToBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer);
  return window.btoa(
    [...Array(bytes.byteLength)].reduce(
      (t, v, i) => t + String.fromCharCode(bytes[i]),
      ""
    )
  );
};

const convertUuidToBase64 = (uuid) => arrayBufferToBase64(uuidToBytes(uuid));

const VALID_UUID_CHECK =
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;

const isValidUuid = (token) => VALID_UUID_CHECK.test(token);

const LEGACY_UUID_IDENTIFIER = "-";

const getLegacyUuidIdentifier = () => LEGACY_UUID_IDENTIFIER;

const getVersionAsSymbol = (version) => {
  return version < 36
    ? version.toString(36)
    : (version - 26).toString(36).toUpperCase();
};

const VERSION = 1;

const encodeToken = (formGuid, portalId) => {
  const maybeLegacyIdentifier = isValidUuid(formGuid)
    ? ""
    : getLegacyUuidIdentifier();
  const currentVersionSymbol = getVersionAsSymbol(VERSION);
  const convertedFormGuid = convertBase64ToUrlSafeBase64(
    convertUuidToBase64(formGuid.replace(/[^a-fA-F0-9]/g, "")).substring(0, 22)
  );
  const convertedPortalId = portalId.toString(36);
  return `${maybeLegacyIdentifier}${currentVersionSymbol}${convertedFormGuid}${convertedPortalId}`;
};

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

const portalId = window.location.toString().split(/[/?]/)?.[4]
const token = getCookie("csrf.app");

const getFormsData = async () => {
  const filter = {
    count: 500,
    offset: 0,
    objectTypeId: "0-28",
    requestOptions: {
      allPropertiesFetchMode: "latest_version",
      includeAllProperties: true,
    },
    filterGroups: [
      {
        filters: [
          {
            operator: "IN",
            property: "hs_form_type",
            values: ["CAPTURED", "HUBSPOT", "FLOW", "BLOG_COMMENT"],
          },
          {
            operator: "HAS_PROPERTY",
            property: "hs_all_assigned_business_unit_ids",
          },
        ],
      },
    ],
    query: "",
    sorts: [
      {
        property: "hs_updated_at",
        order: "DESC",
      },
    ],
    associationPreviews: {},
  };

  const response = await fetch(
    `https://app.hubspot.com/api/crm-search/search?portalId=${portalId}&clienttimeout=14000&hs_static_app=FormsUI&hs_static_app_version=2.51389
    `,
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

  return body.results;
};

const func = async () => {
  const formList = await getFormsData();

  const formLinks = formList.map(({ properties: { hs_form_id: { value: formId }, hs_name: { value: name } } }) => ({
    name,
    formId,
    link: `https://share.hsforms.com/${encodeToken(
      formId,
      Number(portalId)
    )}`
  }));

  console.log(formLinks)

  const csvContent = formLinks.reduce((acc, { name, formId, link }) => {
    return `${acc}${name};${formId};${link}\n`;
  }, "Name;Form ID;Link\n");

  downloadTextFile("result.csv", csvContent);
};

func();
