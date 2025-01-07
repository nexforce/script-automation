const hubspot = require('@hubspot/api-client');
const axios = require('axios');
const fetch = require("node-fetch");

const crmURL = 'https://your-crm-url.my.salesforce.com';

const vertical = {
  Vertical__c: "Dummy-vertical",
  Owner: {
    attributes: { type: "Group" },
    Name: "COM-Dummy-vertical"
  }
};

const _authSalesForce = async () => {
  let connection = "";

  await axios.post(crmURL + '/services/oauth2/token?grant_type=password&client_id=your-client-id&client_secret=your-client-secret&username=your-username&password=your-password', {}).then(function (response) {
    connection = response.data.token_type + ' ' + response.data.access_token;
  }).catch(function (error) {
    console.error(error.code, error.response);
  });

  return connection;
}

const _mountOrderItems = (items) => {
  let orderItems = [];
  let keys = Object.keys(items);

  if ((keys.find(element => { return element === 'plan' }))) {
    orderItems.push({
      "url": "/services/data/v53.0/sobjects/OrderItem",
      "method": "POST",
      "referenceId": "refOrderItem1",
      "body": {
        "OrderId": "@{refOrder.id}",
        "PricebookEntry": {
          "ExternalId__c": "ST56027"
        },
        "Quantity": 1.0,
        "UnitPrice": items.value
      }
    });
  } else {
    let count = 1;
    keys.forEach(function (key) {
      orderItems.push({
        "url": "/services/data/v53.0/sobjects/OrderItem",
        "method": "POST",
        "referenceId": "refOrderItem" + count,
        "body": {
          "OrderId": "@{refOrder.id}",
          "PricebookEntry": {
            "ExternalId__c": "ST" + items[key].class
          },
          "Quantity": 1.0,
          "UnitPrice": items[key].value ? items[key].value : 0
        }
      });
      count++;
    });
  }

  return orderItems;
}

const hasContractToday = async (email, items = {}) => {
  let classes = Object.entries(items).map(([_, item]) => {
    return item.class;
  });

  try {
    let connectionToken = await _authSalesForce();

    const response = await axios.get(`${crmURL}/services/data/v57.0/query?q=SELECT Id, ContractId__c, Status, Class__c, FORMAT(CreatedDate) FROM Contract Where Account.PersonEmail = '${email}' ORDER BY CreatedDate DESC`, {
      headers: {
        'Authorization': connectionToken,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cookie': 'BrowserId=EooK4nWFEe22JNlbMdEjTQ; CookieConsentPolicy=0:1; LSKey-c$CookieConsentPolicy=0:1'
      }
    });

    if (
      (!response?.data?.totalSize)
      || (!response?.data?.records?.length)
    ) {
      return false;
    }

    const currentDate = new Date();
    const currentDateString = `${currentDate.getDate()}/${String(currentDate.getMonth() + 1).padStart(2, "0")}/${currentDate.getFullYear()}`;

    for (const record of response?.data?.records) {
      const { CreatedDate, Status, Class__c } = record;
      const formattedDate = CreatedDate.split(' ').shift();

      if ('Cancelled' === Status) {
        continue;
      }

      if (formattedDate === currentDateString && classes.includes(Class__c)) {
        return true;
      }
    }

    return false;
  } catch (error) {
    return false;
  }
};

const _insertSalesForce = async (cart_id, user, score, items) => {
  if (await hasContractToday(user.properties.email, items)) {
    return;
  }

  let orderItems = _mountOrderItems(items);

  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1;
  let dd = today.getDate();

  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;

  const formattedToday = yyyy + '-' + mm + '-' + dd;

  const getByEmail = {
    "method": "GET",
    "url": "/services/data/v53.0/query?q=SELECT+Id+FROM+Account+WHERE+PersonEmail+=+'"+user.properties.email+"'+LIMIT+1",
    "referenceId": "refAccounts"
  };

  const postOrder = {
    "url": "/services/data/v53.0/sobjects/Order",
    "method": "POST",
    "referenceId": "refOrder",
    "body": {}
  };

  const idConsultingCourseClass = 79188;

  Object.keys(items).forEach(key => {
    let classId = parseInt(items[key].class);
    if (isNaN(classId)) {
      return;
    }

    if (idConsultingCourseClass === classId) {
      vertical.Owner.Name = "COM-Coaching";
    }
  });

  const createOrderBody = (id, vertical) => {
    return {
      "AccountId": id,
      "Pricebook2": {
        "ExternalId__c": "ST"
      },
      "EffectiveDate": formattedToday,
      "Status": "Open",
      "OrderNumber__c": cart_id,
      "Score__c": score,
      "Origin__c": "Cart",
      ...vertical
    };
  }

  let connectionToken = await _authSalesForce();

  console.log('*** Searching email in Salesforce');

  const responseGetByEmail = await fetch(
    `${crmURL}/services/data/v53.0/query?q=SELECT+Id+FROM+Account+WHERE+PersonEmail+=+'${user.properties.email}'+LIMIT+1`,
    {
      method: "GET",
      headers: {
        'Authorization': connectionToken,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
  );

  const data = await responseGetByEmail.json();

  let compositeRequest = [];

  if (data.totalSize === 0) {
    console.log('*** Not found. Insert into Salesforce');
    const patchAccount = {
      "url": "/services/data/v53.0/composite/sobjects/Account/Id",
      "method": "PATCH",
      "referenceId": "refAccount",
      "body": {
        "records": [
          {
            "attributes": { "type": "Account" },
            "RecordType": { "Name": "Personal Account" },
            "FirstName": user.properties.firstname,
            "LastName": user.properties.lastname || '-',
            "PersonEmail": user.properties.email,
            "Phone": user.properties.phone,
            "PersonMobilePhone": user.properties.mobilephone,
            "CPF__c": user.properties.cpf,
          }
        ]
      }
    }

    postOrder.body = { ...createOrderBody("@{refAccount[0].id}", vertical) }
    compositeRequest = [patchAccount, postOrder];

  } else {
    console.log('*** Found. Ignore contact');
    postOrder.body = { ...createOrderBody(data.records[0].Id, vertical) }
    compositeRequest = [getByEmail, postOrder];
  }

  let body = {
    "allOrNone": true,
    "collateSubrequests": true,
    "compositeRequest": [...compositeRequest]
  };

  body.compositeRequest = body.compositeRequest.concat(orderItems);

  await axios.post(crmURL + '/services/data/v53.0/composite', body, {
    headers: {
      'Authorization': connectionToken,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Cookie': 'BrowserId=EooK4nWFEe22JNlbMdEjTQ; CookieConsentPolicy=0:1; LSKey-c$CookieConsentPolicy=0:1'
    }
  }).then(function (response) {
    console.log(console.log(JSON.stringify(response.data, null, 4)));
  }).catch(function (error) {
    console.log(console.log(JSON.stringify(error, null, 4)));
  });
}

exports.main = async (event, callback) => {

  const hubspotClient = new hubspot.Client({
    accessToken: process.env.access_token_cart_abandoned
  });

  try {
    const relationResponse = await hubspotClient.crm.objects.associationsApi.getAll(event.object.objectType, event.object.objectId, 'Contacts', 500);
    let student_id = null;

    relationResponse.body.results.every(function (value) {
      if (value.type == "cart_to_contact") {
        student_id = value.id;
        return false;
      }

      return true;
    });

    const userResponse = await hubspotClient.crm.contacts.basicApi.getById(
      student_id, ["firstname", "lastname", "email", "cpf", "phone", "mobilephone"]
    );

    _insertSalesForce(event.fields.cart_id, userResponse.body, event.fields.score, JSON.parse(event.fields.course_items));

  } catch (err) {
    console.error(err.body);
    throw err;
  }
}
