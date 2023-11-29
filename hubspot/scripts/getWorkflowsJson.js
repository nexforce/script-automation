const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
};

const thisPortalId = document.querySelector(".navAccount-portalId").innerHTML;
const token = getCookie("csrf.app");

const getWfl = async ({ flowId, folderId }, folders) => {
  const response = await fetch(
    `https://app.hubspot.com/api/automationplatform/v1/hybrid/${flowId}?hs_static_app=automation-ui-canvas&hs_static_app_version=1.30656&portalId=${thisPortalId}&clienttimeout=14000`,
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

  return { ...body, folder: folders.find(({ id }) => id === folderId) };
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

const func = async () => {
  const response = await fetch(
    `https://app.hubspot.com/api/automationapps/v1/summaries/folders?platformSourceApps=WORKFLOWS_APP&platformSourceApps=WORKFLOWS_CLASSIC&platformSourceApps=DIRECT_API&platformSourceApps=PUBLIC_API&sortBy=name&sortOrder=ascending&excludePlatformSourceApps=FEEDBACK&excludePlatformSourceApps=LEAD_FLOW&excludePlatformSourceApps=FORM_FOLLOWUP_EMAIL&includeOptionalEnrollmentCounts=true&includeMigrationStatus=true&_ts=1684836833962&limit=500&portalId=${thisPortalId}&clienttimeout=14000&hs_static_app=automation-ui-index&hs_static_app_version=1.29703`,
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

  const [wfls, folders] = body.results.reduce(
    ([wflsAcc, foldersAcc], item) =>
      item.itemType === "FOLDER"
        ? [wflsAcc, [...foldersAcc, item.folder]]
        : [[...wflsAcc, item.sharedFlowSummary], foldersAcc],
    [[], []]
  );

  const wflsData = await Promise.all(wfls.map((wfl) => getWfl(wfl, folders)));

  // const wflsByFolder = wflsData.reduce((acc, wfl) => {
  //   acc[wfl.folder.name] = [...(acc[wfl.folder.name] ?? []), wfl];
  //   return acc;
  // }, {});

  // const selectedNames = [
  //   "[02. PV Cadência de Qualificação - Empresa] Origem = Indicação de Negócio→ Inicia Cadência de Qualificação de Empresa",
  //   "[03. PV Cadência Qualificação] Status = Conectado→ Inicia Cadência após Conexão",
  //   "[04.01 PV Cadência Qualificação - Marketing] Origem = Marketing → Inicia Cadência de Tarefas",
  //   '[04.02 PV Cadência Qualificação - Marketing] Qualificação Realizada = "Sim"→ Gera tarefas para checar vínculo com a Empresa',
  //   "[05.01 PV Cadência de Prospecção] Estágio do Lead = Prospecção→ Inicia Cadência de Prospecção",
  //   "[05.02 PV Cadência de Prospecção] Ligação = Conectada→ Checa se houve indicação de Outra pessoa",
  // ];

  const filteredWfls = wflsData
    .filter((w) => w.objectTypeId === '0-1');

  console.log(
    filteredWfls.length,
    wflsData.length,
    filteredWfls.map((w) => w.name)
  );

  downloadTextFile("workflows.json", JSON.stringify(filteredWfls, null, 2));
};

func();
