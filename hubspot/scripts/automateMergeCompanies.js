const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
};

const portalId = window.location.toString().split(/[/?]/)?.[4];
const token = getCookie("csrf.app");

const SIMILARITY_TOLERANCE = 0.9;
const PAGE_SIZE = 1000000000;

const func = async () => {
  const response = await fetch(
    `https://api.hubspot.com/doppelganger/v1/similar/company/resultPage?pageSize=${PAGE_SIZE}&offset=0&properties=name&properties=domain&properties=hs_num_child_companies&properties=hs_parent_company_id&properties=hs_last_sales_activity_timestamp&properties=createdate&properties=hs_lastmodifieddate&hs_static_app=doppelganger-ui&hs_static_app_version=2.15855&portalId=${portalId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        cookie: `hubspotapi-csrf=${token}`,
        "x-hubspot-csrf-hubspotapi": token,
      },
      credentials: "include",
    }
  );

  const body = JSON.parse(await response.text());

  const filteredMatches = body.results.filter(
    (r) => r.similarityScore >= SIMILARITY_TOLERANCE
  );

  if (!filteredMatches.length) {
    console.log(
      `No matches with similarityScore >= ${SIMILARITY_TOLERANCE} found`
    );
    return;
  }

  const lowestScore = Math.min(
    ...filteredMatches.map((m) => m.similarityScore)
  );

  console.log(
    `Found ${filteredMatches.length} matches with similarityScore >= ${SIMILARITY_TOLERANCE} (lowest score ${lowestScore})`
  );

  let i = 0;

  for (const recordMatch of filteredMatches) {
    const response = await fetch(
      `https://app.hubspot.com/api/companies/v2/companies/${recordMatch.id1}/merge?portalId=${portalId}&clienttimeout=14000&hs_static_app=doppelganger-ui&hs_static_app_version=2.15855`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          cookie: `hubspotapi-csrf=${token}`,
          "x-hubspot-csrf-hubspotapi": token,
        },
        body: JSON.stringify({ companyIdToMerge: recordMatch.id2 }),
      }
    );

    console.log(
      `Processing ${++i}/${filteredMatches.length} matches (${response.status})`
    );

    if (![204, 400].includes(response.status)) {
      console.log(`Ocorreu um erro não esperado. Encerrando execução.`);
      return;
    }
  }

  console.log(`Done`);
};

func();
