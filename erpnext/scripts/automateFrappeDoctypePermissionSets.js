const defaultDocPermissions = [
  {
    docstatus: 0,
    doctype: "DocPerm",
    owner: "Administrator",
    if_owner: 0,
    permlevel: 0,
    select: 0,
    read: 1,
    write: 1,
    create: 1,
    delete: 1,
    submit: 0,
    cancel: 0,
    amend: 0,
    report: 1,
    export: 1,
    import: 0,
    share: 1,
    print: 1,
    email: 1,
    parentfield: "permissions",
    parenttype: "DocType",
    idx: 1,
    __unedited: false,
    role: "Administrator",
  },
  {
    docstatus: 0,
    doctype: "DocPerm",
    owner: "Administrator",
    if_owner: 0,
    permlevel: 0,
    select: 0,
    read: 1,
    write: 1,
    create: 1,
    delete: 1,
    submit: 0,
    cancel: 0,
    amend: 0,
    report: 1,
    export: 1,
    import: 0,
    share: 1,
    print: 1,
    email: 1,
    parentfield: "permissions",
    parenttype: "DocType",
    idx: 2,
    __unedited: false,
    role: "System Manager",
  },
];

const doctypes = [
  "Process Subscription",
  "Subcontracting BOM",
  "Unreconcile Payments",
  "Audit Trail",
  "Recorder",
  "Asset Activity",
  "BOM Creator",
  "Repost Accounting Ledger",
  "Stock Reservation Entry",
  "Warehouse",
  "Custom HTML Block",
  "Closing Stock Balance",
  "Process Payment Reconciliation",
  "Marketing Campaign",
  "Process Payment Reconciliation Log",
  "Reminder",
  "Account Closing Balance",
  "Incoterm",
  "Workstation Type",
  "Asset Depreciation Schedule",
  "Repost Payment Ledger",
  "Submission Queue",
  "Serial and Batch Bundle",
  "RQ Job",
  "RQ Worker",
  "Inventory Dimension",
  "Document Naming Settings",
  "Payment Ledger Entry",
  "Subcontracting Receipt",
  "Subcontracting Order",
  "Integration Request",
  "BOM Update Log",
  "Telephony Call Type",
  "Call Log",
  "Employee",
  "Lead",
  "Journal Entry",
  "Sales Invoice",
  "Company",
  "Tax Category",
  "Item Tax Template",
  "Asset",
  "Document Share Key",
  "Cost Center Allocation",
  "Repost Item Valuation",
  "User",
  "Currency Exchange Settings",
  "System Settings",
  "Data Import Log",
  "Ledger Merge",
  "Bulk Transaction Log",
  "Competitor",
  "Print Format Field Template",
  "Stock Reposting Settings",
  "Network Printer Settings",
  "CRM Settings",
  "Package Import",
  "Package Release",
  "Asset Capitalization",
  "Package",
  "Party Specific Item",
  "Prospect",
  "Party Link",
  "Discussion Reply",
  "Discussion Topic",
  "South Africa VAT Settings",
  "Webhook Request Log",
  "Form Tour",
  "User Group",
  "Transaction Deletion Record",
  "Quality Inspection Parameter Group",
  "User Type",
  "Quality Inspection Parameter",
  "Module Profile",
  "Voice Call Settings",
  "Bank Reconciliation Tool",
  "Incoming Call Settings",
  "DocType Layout",
  "Putaway Rule",
  "Accounting Dimension Filter",
  "Non Conformance",
  "Log Settings",
  "UAE VAT Settings",
  "Document Naming Rule",
  "Console Log",
  "System Console",
  "Video Settings",
  "Navbar Settings",
  "Shipment Parcel Template",
  "Shipment",
  "Process Statement Of Accounts",
  "Installed Applications",
  "Module Onboarding",
  "Color",
  "Downtime Entry",
  "Web Template",
  "Web Page View",
  "Number Card",
  "Onboarding Step",
  "Journal Entry Template",
  "Dashboard Settings",
  "Lower Deduction Certificate",
  "POS Opening Entry",
  "POS Invoice Merge Log",
  "POS Invoice",
  "Workspace",
  "Dunning Type",
  "Process Deferred Accounting",
  "List View Settings",
  "Import Supplier Invoice",
  "Server Script",
  "Tag Link",
  "Scheduled Job Log",
  "Scheduled Job Type",
  "Notification Settings",
  "Quick Stock Balance",
  "Global Search Settings",
  "Appointment Booking Settings",
  "Appointment",
  "Notification Log",
  "Google Drive",
  "Data Import",
  "Bank Statement Import",
  "Access Log",
  "Session Default Settings",
  "Pick List",
  "Google Calendar",
  "Dunning",
  "Email Campaign",
  "Google Contacts",
  "Google Settings",
  "Communication Medium",
  "Item Manufacturer",
  "Quality Feedback",
  "Quality Feedback Template",
  "Warehouse Type",
  "Issue Priority",
  "Accounting Dimension",
  "Task Type",
  "Milestone",
  "Milestone Tracker",
  "Energy Point Settings",
  "Stock Entry Type",
  "Invoice Discounting",
  "Assignment Rule",
  "Project Template",
  "Website Route Meta",
  "Personal Data Deletion Request",
  "Homepage Section",
  "Promotional Scheme",
  "Comment",
  "Dashboard Chart Source",
  "Tally Migration",
  "Chart of Accounts Importer",
  "Token Cache",
  "Personal Data Download Request",
  "Connected App",
  "Dashboard",
  "Dashboard Chart",
  "Document Follow",
  "Opportunity Lost Reason",
  "Service Level Agreement",
  "Employee Group",
  "Bank Account Subtype",
  "Bank Account Type",
  "Plaid Settings",
  "Bank Transaction",
  "Video",
  "Quality Meeting",
  "Quality Procedure",
  "Route History",
  "Quality Goal",
  "Quality Review",
  "Quality Action",
  "Market Segment",
  "Sales Stage",
  "Email Digest",
  "Delivery Settings",
  "Payment Order",
  "Routing",
  "QuickBooks Migrator",
  "Job Card",
  "Prepared Report",
  "Energy Point Log",
  "Energy Point Rule",
  "Cashier Closing",
  "Sales Partner Type",
  "POS Closing Entry",
  "View Log",
  "Blanket Order",
  "Slack Webhook URL",
  "Workflow Action",
  "Asset Value Adjustment",
  "Location",
  "UOM Conversion Factor",
  "UOM Category",
  "Contract Template",
  "Success Action",
  "Accounting Period",
  "Tax Withholding Category",
  "Exchange Rate Revaluation",
  "Finance Book",
  "Contract",
  "Bank",
  "Auto Repeat",
  "Data Export",
  "Item Alternative",
  "Subscription Settings",
  "Subscription Plan",
  "List Filter",
  "Projects Settings",
  "Transaction Log",
  "Quality Inspection Template",
  "Loyalty Program",
  "Loyalty Point Entry",
  "Coupon Code",
  "Project Update",
  "Share Type",
  "Share Transfer",
  "Shareholder",
  "Social Login Key",
  "Production Plan",
  "Asset Maintenance Log",
  "Calendar View",
  "Asset Repair",
  "Asset Maintenance Team",
  "Asset Maintenance",
  "Driver",
  "Delivery Trip",
  "Opportunity Type",
  "Issue Type",
  "Activity Log",
  "Webhook",
  "S3 Backup Settings",
  "Role Profile",
  "Item Variant Settings",
  "Opening Invoice Creation Tool",
  "POS Settings",
  "Print Style",
  "Payment Terms Template",
  "Payment Term",
  "Subscription",
  "Project Type",
  "User Permission",
  "Supplier Scorecard Period",
  "Bank Account",
  "Supplier Scorecard",
  "Supplier Scorecard Standing",
  "Supplier Scorecard Criteria",
  "Supplier Scorecard Variable",
  "Domain Settings",
  "Domain",
  "Salutation",
  "Gender",
  "Customs Tariff Number",
  "Email Rule",
  "Support Settings",
  "Role Permission for Page and Report",
  "Custom Role",
  "Custom DocPerm",
  "Deleted Document",
  "Website Sidebar",
  "Party Type",
  "Bank Guarantee",
  "Kanban Board",
  "LDAP Settings",
  "Dropbox Settings",
  "Lead Source",
  "OAuth Provider Settings",
  "Vehicle",
  "Auto Email Report",
  "OAuth Authorization Code",
  "OAuth Bearer Token",
  "OAuth Client",
  "Bulk Update",
  "Payment Entry",
  "Tag",
  "Budget",
  "Cheque Print Template",
  "Asset Movement",
  "Homepage",
  "Email Flag Queue",
  "Unhandled Email",
  "Portal Settings",
  "Email Domain",
  "Asset Category",
  "Request for Quotation",
  "Desktop Icon",
  "Translation",
  "Manufacturer",
  "Payment Gateway Account",
  "Payment Request",
  "Tax Rule",
  "Activity Cost",
  "Email Unsubscribe",
  "Email Group Member",
  "Email Group",
  "Website Theme",
  "DocShare",
  "Manufacturing Settings",
  "Operation",
  "Help Article",
  "Help Category",
  "Item Attribute",
  "Email Account",
  "Web Form",
  "Language",
  "Print Settings",
  "Notification",
  "Landed Cost Voucher",
  "Payment Reconciliation",
  "Email Template",
  "Address Template",
  "Pricing Rule",
  "Version",
  "Shipping Rule",
  "Buying Settings",
  "Selling Settings",
  "Stock Settings",
  "Accounts Settings",
  "Currency Exchange",
  "Product Bundle",
  "Sales Order",
  "Customer",
  "Event",
  "Delivery Note",
  "Quotation",
  "Note",
  "POS Profile",
  "Supplier Quotation",
  "Purchase Order",
  "Purchase Invoice",
  "Purchase Receipt",
  "Serial No",
  "Item",
  "Global Defaults",
  "Item Price",
  "Installation Note",
  "Quality Inspection",
  "Website Settings",
  "Sales Partner",
  "Packing Slip",
  "Stock Entry",
  "Stock Reconciliation",
  "Web Page",
  "Blog Post",
  "Item Group",
  "Blogger",
  "About Us Settings",
  "Blog Settings",
  "Report",
  "Blog Category",
  "Opportunity",
  "Website Slideshow",
  "Material Request",
  "Project",
  "Batch",
  "Activity Type",
  "Timesheet",
  "Brand",
  "Contact Us Settings",
  "DocType",
  "Department",
  "Issue",
  "Account",
  "Task",
  "Stock Ledger Entry",
  "Customize Form",
  "Communication",
  "Currency",
  "Price List",
  "Cost Center",
  "Print Format",
  "Fiscal Year",
  "BOM",
  "Country",
  "Patch Log",
  "Error Log",
  "Address",
  "Contact",
  "Newsletter",
  "Maintenance Visit",
  "Warranty Claim",
  "Maintenance Schedule",
  "Bin",
  "UOM",
  "Territory",
  "SMS Settings",
  "Sales Person",
  "Print Heading",
  "Supplier Group",
  "Terms and Conditions",
  "Quotation Lost Reason",
  "Customer Group",
  "SMS Center",
  "Authorization Rule",
  "Campaign",
  "Workstation",
  "Work Order",
  "Holiday List",
  "Branch",
  "Designation",
  "Supplier",
  "Sales Taxes and Charges Template",
  "Purchase Taxes and Charges Template",
  "Period Closing Voucher",
  "GL Entry",
  "Bank Clearance",
  "Monthly Distribution",
  "Property Setter",
  "Module Def",
  "Custom Field",
  "Client Script",
  "Role",
  "Workflow State",
  "Workflow Action Master",
  "Workflow",
  "Website Script",
  "Page",
  "File",
  "BOM Update Tool",
  "Mode of Payment",
  "Rename Tool",
  "Letter Head",
  "Email Queue",
  "ToDo",
  "SMS Log",
  "Authorization Control",
  "Industry Type",
];

const segmentArray = (array, batchLength) =>
  Array.from({ length: Math.ceil(array.length / batchLength) }, (_, i) =>
    array.slice(i * batchLength, (i + 1) * batchLength)
  );

const func = async () => {
  let i = 0;

  for (const batch of segmentArray(doctypes, 25))
    await Promise.all(
      batch.map(async (doctype) => {
        const getResponse = await fetch(
          `https://app.nexforce.co/api/method/frappe.desk.form.load.getdoc?doctype=DocType&name=${doctype}&_=${new Date().getTime()}`,
          {
            method: "GET",
            headers: {
              // frappe.csrf_token is a global variable
              "X-Frappe-Csrf-Token": frappe.csrf_token,
            },
          }
        );

        const getBody = JSON.parse(await getResponse.text());

        const { docs } = getBody;

        if (!docs.length) {
          console.log(getBody);
          console.error(`${++i}/${doctypes.length}: Not found: ${doctype}`);
          return;
        }

        const [doc] = docs;

        const newDoc = {
          ...doc,
          permissions: defaultDocPermissions.map((p) => ({
            ...p,
            parent: doctype,
          })),
          __unsaved: 1,
        };

        const saveFormData = new FormData();

        saveFormData.set("doc", JSON.stringify(newDoc));
        saveFormData.set("action", "Save");

        const saveResponse = await fetch(
          `https://app.nexforce.co/api/method/frappe.desk.form.save.savedocs`,
          {
            method: "POST",
            headers: {
              // frappe.csrf_token is a global variable
              "X-Frappe-Csrf-Token": frappe.csrf_token,
            },
            body: saveFormData,
          }
        );

        const saveBody = await saveResponse.text();

        if (!saveBody.includes("Saved")) {
          console.log(saveBody);
          console.log(`${++i}/${doctypes.length}: Error creating: ${doctype}`);
          return;
        }

        console.log(`${++i}/${doctypes.length}: Altered: ${doctype}`);
      })
    );

  console.log("Finished");
};

func();
