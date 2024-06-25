const hubspot = require('@hubspot/api-client');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const stringifyOrExtractError = (error) =>
  error.message === 'HTTP request failed'
    ? JSON.stringify(error.response, undefined, 2)
    : error.message;

const throwMessage = (message) => {
  throw {
    message,
  };
};

const throwError = (error, message) => {
  throw {
    message: `${message}: ${stringifyOrExtractError(error)}`,
  };
};

const propertyEquals = (propertyName, value) => ({
  filterGroups: [
    {
      filters: [
        {
          propertyName,
          operator: 'EQ',
          value,
        },
      ],
    },
  ],
});

exports.main = async (event) => {
  const { API_TOKEN: accessToken } = process.env;
  const companyName = event.inputFields.nomeEmpresa;
  const sdc = event.inputFields.solucoes_do_cliente;
  const client = new hubspot.Client({
    accessToken,
  });

  try {
    const searchCompaniesResponse =
      await client.crm.companies.searchApi.doSearch({
        ...propertyEquals('name', companyName),
        properties: ['hs_object_id'],
      });

    if (searchCompaniesResponse.results.length === 0) {
      throwMessage(`empresa com nome "${companyName}" não encontrada`);
    } else if (searchCompaniesResponse.results.length > 1) {
      console.warn(
        `encontrada mais de uma empresa com o nome "${companyName}"; a primeira ocorrência será utilizada`
      );
    }

    const companyId =
      searchCompaniesResponse.results[0].properties.hs_object_id;

    if (!sdc) {
      throwMessage('propriedade "Soluções do Cliente" está vazia');
    }

    const getAllSchemasResponse = await client.crm.schemas.coreApi.getAll(
      false
    );

    if (getAllSchemasResponse.results.length === 0) {
      throwMessage('nenhum schema encontrado');
    }

    const sdcSchema = getAllSchemasResponse.results.find(
      (schema) => schema.name === 'solu__es_do_cliente'
    );

    if (!sdcSchema) {
      throwMessage(
        'schema do objeto personalizado "Soluções do Cliente" não encontrado'
      );
    }

    const sdcToCompanyAssocResponse =
      await client.crm.associations.v4.schema.definitionsApi.getAll(
        sdcSchema.objectTypeId,
        '0-2'
      );

    if (sdcToCompanyAssocResponse.results.length === 0) {
      throwMessage(
        'nenhuma associação entre o objeto personalizado "Soluções do Cliente" e o objeto "Empresa" foi encontrada, favor criar uma'
      );
    }

    const sdcToCompanyAssoc = sdcToCompanyAssocResponse.results.find(
      (a) => a.label === 'Produto'
    );

    if (!sdcToCompanyAssoc) {
      throwMessage(
        'não foi encontrado um rótulo de associação entre o objeto personalizado "Soluções do Cliente" e o objeto "Empresa", favor criar um rótulo nomeado "Produto"'
      );
    }

    const productSkus = sdc.split(';');
    console.log(
      `rodando workflow para os seguintes SKUs de produtos: ${productSkus}`
    );
    const existingSolutions = [];
    let solutionsToCreate = [];

    for (const sku of productSkus) {
      solutionsToCreate.push(sku);

      let existingSolutionResponse;
      try {
        existingSolutionResponse = await client.crm.objects.searchApi.doSearch(
          sdcSchema.objectTypeId,
          {
            ...propertyEquals('c_digo_do_produto', sku),
            properties: [
              'hs_object_id',
              'c_digo_do_produto',
              'status_da_solucao_do_cliente',
            ],
          }
        );
      } catch (error) {
        throwError(
          error,
          'ocorreu um erro ao buscar a solução do cliente existente'
        );
      }

      await sleep(200);

      if (existingSolutionResponse.total > 0) {
        for (const existingSolution of existingSolutionResponse.results) {
          const sdcAssocResponse =
            await client.crm.associations.v4.basicApi.getPage(
              sdcSchema.objectTypeId,
              existingSolution.id,
              '0-2'
            );

          await sleep(200);

          const solutionBelongsToCurrentCompany =
            !!sdcAssocResponse.results.find(
              ({ toObjectId }) => String(toObjectId) === companyId
            );

          if (
            solutionBelongsToCurrentCompany &&
            String(existingSolution.properties.status_da_solucao_do_cliente)
              .trim()
              .toLowerCase() !== 'inativa'
          ) {
            existingSolutions.push(sku);
          }
        }
      }
    }

    solutionsToCreate = solutionsToCreate.filter(
      (sku) => !existingSolutions.find((es) => es === sku)
    );

    if (solutionsToCreate.length === 0) {
      console.log(
        'detectei que nenhuma solução precisa ser criada. encerrando por aqui'
      );
      return;
    }

    console.log(`as seguintes soluções serão criadas: ${solutionsToCreate}`);
    console.log(
      `as seguintes soluções NÃO serão criadas: ${existingSolutions}`
    );

    let searchProductsResponse;
    try {
      searchProductsResponse = await client.crm.products.searchApi.doSearch({
        filterGroups: [
          {
            filters: [
              {
                propertyName: 'hs_sku',
                operator: 'IN',
                values: solutionsToCreate.map((sku) =>
                  String(sku).toLowerCase()
                ),
              },
            ],
          },
        ],
        properties: ['name', 'hs_folder_name', 'hs_sku', 'id_metadados'],
      });
    } catch (error) {
      throwError(error, 'ocorreu um erro ao buscar os produtos por SKU');
    }

    if (searchProductsResponse.total === 0) {
      throwMessage(
        `nenhum produto encontrado com os códigos de SKU: ${solutionsToCreate}`
      );
    }

    console.log(
      `encontrados ${
        searchProductsResponse.total
      } produtos na biblioteca: ${searchProductsResponse.results.map(
        (p) => p.properties.hs_sku
      )}`
    );

    const createdSolutions = await client.crm.objects.batchApi.create(
      sdcSchema.objectTypeId,
      {
        inputs: searchProductsResponse.results.map((product) => ({
          associations: [
            {
              to: {
                id: companyId,
              },
              types: [
                {
                  associationCategory: 'USER_DEFINED',
                  associationTypeId: sdcToCompanyAssoc.typeId,
                },
              ],
            },
          ],
          properties: {
            nome_do_produto: product.properties.name,
            c_digo_do_produto: product.properties.id_metadados,
            shs_sku: product.properties.hs_sku,
            nome_da_pasta: product.properties.hs_folder_name,
            status_da_solucao_do_cliente: 'Ativa',
          },
        })),
      }
    );

    console.log('operação de criação terminou');
    console.log(`status: ${createdSolutions.status}`);
    console.log(`${createdSolutions.results.length} soluções criadas`);
    console.log(`${createdSolutions.errors} erros`);
  } catch (error) {
    stringifyOrExtractError(error);
  }
};
