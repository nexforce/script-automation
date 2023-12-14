frappe.ui.form.on("X Lead", {
  refresh(frm) {
    if (frm.doc.company) {
      let selectedColumns = loadTableSettings(frm);

      loadCompanyDetails(frm, frm.doc.company, selectedColumns);
    } else {
      frm.fields_dict.company_table.$wrapper.html("");
    }
  },
});

function loadCompanyDetails(frm, companyName) {
  frappe.call({
    method: "frappe.client.get",
    args: {
      doctype: "X Company",
      name: companyName,
    },
    callback: function (r) {
      if (r.message) {
        renderTable(frm, r.message);
      }
    },
  });
}

function renderTable(frm, company) {
  let selectedColumns = getSelectedColumns(frm);
  let html_content = `<div style="position: relative;">
                            <table class='table table-bordered' style='border-collapse: collapse;'>
                                <tr style='background-color: #F7F7F7;'>
                                    <th>Company Name</th>
                                    ${selectedColumns
                                      .map(
                                        (field) =>
                                          `<th>${frappe.model.unscrub(
                                            field
                                          )}</th>`
                                      )
                                      .join("")}
                                    <th style="text-align:center;"><i class="fa fa-cog btn-settings" style="cursor: pointer;"></i></th>
                                </tr>
                                <tr>
                                    <td><a href='/app/company/${
                                      company ? company.name : ""
                                    }' target='_blank'>${
    company ? company.company_name : "N/A"
  }</a></td>
                                    ${selectedColumns
                                      .map((field) =>
                                        formatDataCell(company, field)
                                      )
                                      .join("")}
                                    <td style="text-align:center;"><i class="fa fa-pencil btn-edit" style="cursor: pointer;"></i></td>
                                </tr>
                            </table>
                        </div>`;
  frm.fields_dict.company_table.$wrapper.html(html_content);
  attachButtonEvents(frm, company);
}

function formatDataCell(company, field) {
  let value = company ? company[field] : "N/A";
  if (isValidURL(value)) {
    return `<td><a href='${value}' target='_blank'>${value}</a></td>`;
  }
  return `<td>${value}</td>`;
}

function isValidURL(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

function attachButtonEvents(frm, company) {
  frm.fields_dict.company_table.$wrapper
    .find(".btn-settings")
    .on("click", function () {
      openSettingsModal(frm);
    });
  frm.fields_dict.company_table.$wrapper
    .find(".btn-edit")
    .on("click", function () {
      openEditModal(frm, company);
    });
}

function getSelectedColumns(frm) {
  let user_settings = frappe.model.user_settings["X Lead"];
  return user_settings && user_settings.table_settings
    ? user_settings.table_settings.columns
    : [];
}

function updateTable(frm) {
  if (frm.doc.company) {
    frappe.call({
      method: "frappe.client.get",
      args: {
        doctype: "X Company",
        name: frm.doc.company,
      },
      callback: function (r) {
        if (r.message) {
          renderTable(frm, r.message);
        }
      },
    });
  } else {
    frm.fields_dict.company_table.$wrapper.html("");
  }
}

function openSettingsModal(frm) {
  frappe.model.with_doctype("X Company", function () {
    let fields = frappe
      .get_meta("X Company")
      .fields.filter(
        (field) => field.fieldtype !== "Read Only" && field.fieldname !== "name"
      )
      .map((field) => field.fieldname);
    let d = new frappe.ui.Dialog({
      title: "Configurações da Tabela",
      fields: [
        {
          fieldname: "col2",
          label: "Coluna 2",
          fieldtype: "Select",
          options: fields,
        },
        {
          fieldname: "col3",
          label: "Coluna 3",
          fieldtype: "Select",
          options: fields,
        },
        {
          fieldname: "col4",
          label: "Coluna 4",
          fieldtype: "Select",
          options: fields,
        },
        {
          fieldname: "col5",
          label: "Coluna 5",
          fieldtype: "Select",
          options: fields,
        },
      ],
      primary_action_label: "Aplicar",
      primary_action(values) {
        let selectedColumns = [
          values.col2,
          values.col3,
          values.col4,
          values.col5,
        ].filter(Boolean);
        saveTableSettings(frm, selectedColumns);
        d.hide();
        markFormAsDirty(frm);
      },
    });
    loadTableSettings(frm, d);
    d.show();
  });
}

function saveTableSettings(frm, columns) {
  frappe.model.user_settings.save("X Lead", "table_settings", {
    columns: columns,
  });
  updateTable(frm);
}

function loadTableSettings(frm) {
  let user_settings = frappe.model.user_settings.get("X Lead");
  return user_settings.table_settings
    ? user_settings.table_settings.columns
    : [];
}

function markFormAsDirty(frm) {
  frm.dirty();
  frm.save();
}

function openEditModal(frm, company) {
  let selectedColumns = getSelectedColumns(frm);
  // Verifica se há colunas selecionadas
  if (!selectedColumns || selectedColumns.length === 0) {
    frappe.msgprint("Por favor, configure a tabela antes de editar.");
    return;
  }
  let editFields = [
    {
      label: "Company",
      fieldname: "company",
      fieldtype: "Link",
      options: "X Company",
      default: company ? company.name : "",
    },
    ...selectedColumns.map((field) => ({
      label: frappe.model.unscrub(field),
      fieldname: field,
      fieldtype: "Data",
      default: company ? company[field] : "",
    })),
  ];
  let d = new frappe.ui.Dialog({
    title: "Editar Lead",
    fields: editFields,
    primary_action_label: "Salvar",
    primary_action(values) {
      frappe.call({
        method: "frappe.client.set_value",
        args: {
          doctype: "X Lead",
          name: frm.doc.name,
          fieldname: "company",
          value: values.company,
        },
        callback: function (r) {
          if (!r.exc) {
            // Atualiza a tabela com a nova empresa selecionada
            loadCompanyDetails(frm, values.company);
            d.hide();
            frm.reload_doc();
          } else {
            frappe.msgprint("Erro ao salvar os dados do Lead.");
          }
        },
      });
    },
  });
  d.show();
}
