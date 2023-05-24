const wflPayloads = [
  {
    isEnabled: false,
    uuid: "[02.01. Lead status] Contact Lead status = Other → Lead status = Other-260890533",
    name: "[LEGACY] [02.01. Lead Status] Contact = Other → Lead Status = Other",
    firstActionId: 1,
    timeWindow: null,
    enrollmentSchedule: null,
    shouldReenroll: true,
    flowObjectType: "COMPANY",
    objectTypeId: "0-2",
    portalId: 9360603,
    flowId: 260890533,
    createMetadata: {
      updatedBy: {
        userId: 44593095,
        hubspotterId: null,
      },
      updatedAt: 1664488895693,
      referrer:
        "https://app.hubspot.com/workflows/9360603/platform/create/new?flowTypeId=0-1&scrollToElementId=scroll-to-flow-type-0-1&folderId=1191664",
      originRequestId: null,
      integrationId: null,
      jobName: null,
      internalJobUpdateTime: null,
      sourceApp: "WORKFLOWS_APP",
      cloneMetadata: null,
      templateMetadata: null,
    },
    updateMetadata: {
      updatedBy: {
        userId: 9534005,
        hubspotterId: null,
      },
      updatedAt: 1683143776829,
      referrer:
        "https://app.hubspot.com/workflows/9360603/platform/flow/260890533/edit",
      originRequestId: null,
      integrationId: null,
      jobName: null,
      internalJobUpdateTime: null,
      sourceApp: "WORKFLOWS_APP",
      cloneMetadata: null,
      templateMetadata: null,
    },
    isClassicWorkflow: false,
    nextAvailableActionId: 2,
    version: 25,
    actions: {
      1: {
        actionId: 1,
        metadata: {
          targetProperty: {
            propertyName: "hs_lead_status",
            source: "OBJECT",
          },
          value: {
            type: "STATIC_VALUE",
            value: "Other",
          },
          actionType: "SET_PROPERTY",
        },
        connection: null,
        actionType: "SET_PROPERTY",
        portalId: 9360603,
        flowId: 260890533,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
    },
    classicEnrollmentSettings: null,
    associatedLists: [
      // {
      //   portalId: 9360603,
      //   listId: 3690,
      //   flowId: 260890533,
      //   filterBranch: {
      //     filterBranchOperator: "OR",
      //     filters: [],
      //     filterBranches: [
      //       {
      //         filterBranchOperator: "AND",
      //         filters: [],
      //         filterBranches: [
      //           {
      //             filterBranchOperator: "AND",
      //             filters: [
      //               {
      //                 filterType: "PROPERTY",
      //                 property: "hs_lead_status",
      //                 operation: {
      //                   propertyType: "enumeration",
      //                   operator: "IS_ANY_OF",
      //                   values: ["Other"],
      //                   defaultValue: null,
      //                   includeObjectsWithNoValueSet: false,
      //                   operationType: "enumeration",
      //                   operatorName: "IS_ANY_OF",
      //                 },
      //                 frameworkFilterId: null,
      //               },
      //             ],
      //             filterBranches: [],
      //             associationCategory: "HUBSPOT_DEFINED",
      //             associationTypeId: 280,
      //             objectType: "CONTACT",
      //             objectTypeId: "0-1",
      //             operator: "IN_LIST",
      //             coalescingRefineBy: {
      //               setType: "ANY",
      //               type: "SetOccurrencesRefineBy",
      //             },
      //             associationListId: 4338,
      //             filterBranchType: "ASSOCIATION",
      //           },
      //         ],
      //         filterBranchType: "AND",
      //       },
      //       {
      //         filterBranchOperator: "AND",
      //         filters: [
      //           {
      //             filterType: "PROPERTY",
      //             property: "lifecyclestage",
      //             operation: {
      //               propertyType: "enumeration",
      //               operator: "IS_ANY_OF",
      //               values: ["30776145"],
      //               defaultValue: null,
      //               includeObjectsWithNoValueSet: false,
      //               operationType: "enumeration",
      //               operatorName: "IS_ANY_OF",
      //             },
      //             frameworkFilterId: null,
      //           },
      //         ],
      //         filterBranches: [],
      //         filterBranchType: "AND",
      //       },
      //     ],
      //     filterBranchType: "OR",
      //   },
      //   listTypes: ["ENROLLMENT_LIST"],
      // },
      // {
      //   portalId: 9360603,
      //   listId: 3692,
      //   flowId: 260890533,
      //   filterBranch: {
      //     filterBranchOperator: "OR",
      //     filters: [],
      //     filterBranches: [
      //       {
      //         filterBranchOperator: "AND",
      //         filters: [
      //           {
      //             filterType: "PROPERTY",
      //             property: "hs_lead_status",
      //             operation: {
      //               propertyType: "enumeration",
      //               operator: "IS_ANY_OF",
      //               values: [
      //                 "New",
      //                 "Connected",
      //                 "Attempted to connect",
      //                 "Unqualified",
      //                 "Open deal",
      //               ],
      //               defaultValue: null,
      //               includeObjectsWithNoValueSet: false,
      //               operationType: "enumeration",
      //               operatorName: "IS_ANY_OF",
      //             },
      //             frameworkFilterId: null,
      //           },
      //         ],
      //         filterBranches: [],
      //         filterBranchType: "AND",
      //       },
      //       {
      //         filterBranchOperator: "AND",
      //         filters: [],
      //         filterBranches: [
      //           {
      //             filterBranchOperator: "AND",
      //             filters: [
      //               {
      //                 filterType: "PROPERTY",
      //                 property: "createdate",
      //                 operation: {
      //                   propertyType: "alltypes",
      //                   operator: "IS_KNOWN",
      //                   pruningRefineBy: null,
      //                   coalescingRefineBy: {
      //                     setType: "ANY",
      //                     type: "SetOccurrencesRefineBy",
      //                   },
      //                   defaultValue: null,
      //                   includeObjectsWithNoValueSet: false,
      //                   operationType: "alltypes",
      //                   operatorName: "IS_KNOWN",
      //                 },
      //                 frameworkFilterId: null,
      //               },
      //             ],
      //             filterBranches: [],
      //             associationCategory: "HUBSPOT_DEFINED",
      //             associationTypeId: 342,
      //             objectType: "DEAL",
      //             objectTypeId: "0-3",
      //             operator: "IN_LIST",
      //             coalescingRefineBy: {
      //               setType: "ANY",
      //               type: "SetOccurrencesRefineBy",
      //             },
      //             associationListId: 4339,
      //             filterBranchType: "ASSOCIATION",
      //           },
      //         ],
      //         filterBranchType: "AND",
      //       },
      //       {
      //         filterBranchOperator: "AND",
      //         filters: [
      //           {
      //             filterType: "PROPERTY",
      //             property: "lifecyclestage",
      //             operation: {
      //               propertyType: "enumeration",
      //               operator: "IS_ANY_OF",
      //               values: [
      //                 "evangelist",
      //                 "opportunity",
      //                 "marketingqualifiedlead",
      //                 "salesqualifiedlead",
      //                 "33086390",
      //                 "33089671",
      //                 "lead",
      //                 "customer",
      //               ],
      //               defaultValue: null,
      //               includeObjectsWithNoValueSet: false,
      //               operationType: "enumeration",
      //               operatorName: "IS_ANY_OF",
      //             },
      //             frameworkFilterId: null,
      //           },
      //         ],
      //         filterBranches: [],
      //         filterBranchType: "AND",
      //       },
      //       {
      //         filterBranchOperator: "AND",
      //         filters: [
      //           {
      //             filterType: "PROPERTY",
      //             property: "unqualified_reason",
      //             operation: {
      //               propertyType: "alltypes",
      //               operator: "IS_KNOWN",
      //               pruningRefineBy: null,
      //               coalescingRefineBy: {
      //                 setType: "ANY",
      //                 type: "SetOccurrencesRefineBy",
      //               },
      //               defaultValue: null,
      //               includeObjectsWithNoValueSet: false,
      //               operationType: "alltypes",
      //               operatorName: "IS_KNOWN",
      //             },
      //             frameworkFilterId: null,
      //           },
      //         ],
      //         filterBranches: [],
      //         filterBranchType: "AND",
      //       },
      //       {
      //         filterBranchOperator: "AND",
      //         filters: [],
      //         filterBranches: [
      //           {
      //             filterBranchOperator: "AND",
      //             filters: [
      //               {
      //                 filterType: "PROPERTY",
      //                 property: "hs_lead_status",
      //                 operation: {
      //                   propertyType: "enumeration",
      //                   operator: "IS_ANY_OF",
      //                   values: ["Open deal"],
      //                   defaultValue: null,
      //                   includeObjectsWithNoValueSet: false,
      //                   operationType: "enumeration",
      //                   operatorName: "IS_ANY_OF",
      //                 },
      //                 frameworkFilterId: null,
      //               },
      //             ],
      //             filterBranches: [],
      //             associationCategory: "HUBSPOT_DEFINED",
      //             associationTypeId: 280,
      //             objectType: "CONTACT",
      //             objectTypeId: "0-1",
      //             operator: "IN_LIST",
      //             coalescingRefineBy: {
      //               setType: "ANY",
      //               type: "SetOccurrencesRefineBy",
      //             },
      //             associationListId: 4340,
      //             filterBranchType: "ASSOCIATION",
      //           },
      //         ],
      //         filterBranchType: "AND",
      //       },
      //     ],
      //     filterBranchType: "OR",
      //   },
      //   listTypes: ["SUPPRESSION_LIST"],
      // },
    ],
    flowEventFilters: [],
    enrollmentCriteria: {
      triggerType: "LIST",
      filterBranch: {
        filterBranchOperator: "OR",
        filters: [],
        filterBranches: [
          {
            filterBranchOperator: "AND",
            filters: [],
            filterBranches: [
              {
                filterBranchOperator: "AND",
                filters: [
                  {
                    filterType: "PROPERTY",
                    property: "hs_lead_status",
                    operation: {
                      propertyType: "enumeration",
                      operator: "IS_ANY_OF",
                      values: ["Other"],
                      defaultValue: null,
                      includeObjectsWithNoValueSet: false,
                      operationType: "enumeration",
                      operatorName: "IS_ANY_OF",
                    },
                    frameworkFilterId: null,
                  },
                ],
                filterBranches: [],
                associationCategory: "HUBSPOT_DEFINED",
                associationTypeId: 280,
                objectType: "CONTACT",
                objectTypeId: "0-1",
                operator: "IN_LIST",
                coalescingRefineBy: {
                  setType: "ANY",
                  type: "SetOccurrencesRefineBy",
                },
                associationListId: 4338,
                filterBranchType: "ASSOCIATION",
              },
            ],
            filterBranchType: "AND",
          },
          {
            filterBranchOperator: "AND",
            filters: [
              {
                filterType: "PROPERTY",
                property: "lifecyclestage",
                operation: {
                  propertyType: "enumeration",
                  operator: "IS_ANY_OF",
                  values: ["30776145"],
                  defaultValue: null,
                  includeObjectsWithNoValueSet: false,
                  operationType: "enumeration",
                  operatorName: "IS_ANY_OF",
                },
                frameworkFilterId: null,
              },
            ],
            filterBranches: [],
            filterBranchType: "AND",
          },
        ],
        filterBranchType: "OR",
      },
    },
    enrollmentTrigger: "LIST",
    folder: {
      name: "NX 03 - Metrics - 02 Company",
      createdUserId: 44738973,
      updatedUserId: 9534005,
      createdAt: 1662562730653,
      updatedAt: 1684186510197,
      frameworkFolderId: 184675362469,
      id: 1191664,
      portalId: 9360603,
      flowCount: 22,
    },
  },
  {
    isEnabled: false,
    uuid: "[02.02. Lead status] Contact Lead status = New → Lead status = New-260890628",
    name: "[LEGACY] [02.02. Lead Status] Contact = New → Lead Status = New",
    firstActionId: 1,
    timeWindow: null,
    enrollmentSchedule: null,
    shouldReenroll: true,
    flowObjectType: "COMPANY",
    objectTypeId: "0-2",
    portalId: 9360603,
    flowId: 260890628,
    createMetadata: {
      updatedBy: {
        userId: 44593095,
        hubspotterId: null,
      },
      updatedAt: 1664489636498,
      referrer:
        "https://app.hubspot.com/workflows/9360603/view/default?sortBy=name&sortOrder=ascending&folderId=1191664",
      originRequestId: null,
      integrationId: null,
      jobName: null,
      internalJobUpdateTime: null,
      sourceApp: "WORKFLOWS_APP",
      cloneMetadata: {
        flowId: 260890533,
        version: 6,
      },
      templateMetadata: null,
    },
    updateMetadata: {
      updatedBy: {
        userId: 9534005,
        hubspotterId: null,
      },
      updatedAt: 1683143794637,
      referrer:
        "https://app.hubspot.com/workflows/9360603/platform/flow/260890628/edit",
      originRequestId: null,
      integrationId: null,
      jobName: null,
      internalJobUpdateTime: null,
      sourceApp: "WORKFLOWS_APP",
      cloneMetadata: null,
      templateMetadata: null,
    },
    isClassicWorkflow: false,
    nextAvailableActionId: 2,
    version: 22,
    actions: {
      1: {
        actionId: 1,
        metadata: {
          targetProperty: {
            propertyName: "hs_lead_status",
            source: "OBJECT",
          },
          value: {
            type: "STATIC_VALUE",
            value: "New",
          },
          actionType: "SET_PROPERTY",
        },
        connection: null,
        actionType: "SET_PROPERTY",
        portalId: 9360603,
        flowId: 260890628,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
    },
    classicEnrollmentSettings: null,
    associatedLists: [
      // {
      //   portalId: 9360603,
      //   listId: 3695,
      //   flowId: 260890628,
      //   filterBranch: {
      //     filterBranchOperator: "OR",
      //     filters: [],
      //     filterBranches: [
      //       {
      //         filterBranchOperator: "AND",
      //         filters: [
      //           {
      //             filterType: "PROPERTY",
      //             property: "lifecyclestage",
      //             operation: {
      //               propertyType: "enumeration",
      //               operator: "IS_ANY_OF",
      //               values: ["marketingqualifiedlead", "lead"],
      //               defaultValue: null,
      //               includeObjectsWithNoValueSet: false,
      //               operationType: "enumeration",
      //               operatorName: "IS_ANY_OF",
      //             },
      //             frameworkFilterId: null,
      //           },
      //         ],
      //         filterBranches: [],
      //         filterBranchType: "AND",
      //       },
      //       {
      //         filterBranchOperator: "AND",
      //         filters: [],
      //         filterBranches: [
      //           {
      //             filterBranchOperator: "AND",
      //             filters: [
      //               {
      //                 filterType: "PROPERTY",
      //                 property: "hs_lead_status",
      //                 operation: {
      //                   propertyType: "enumeration",
      //                   operator: "IS_ANY_OF",
      //                   values: ["New"],
      //                   defaultValue: null,
      //                   includeObjectsWithNoValueSet: false,
      //                   operationType: "enumeration",
      //                   operatorName: "IS_ANY_OF",
      //                 },
      //                 frameworkFilterId: null,
      //               },
      //             ],
      //             filterBranches: [],
      //             associationCategory: "HUBSPOT_DEFINED",
      //             associationTypeId: 280,
      //             objectType: "CONTACT",
      //             objectTypeId: "0-1",
      //             operator: "IN_LIST",
      //             coalescingRefineBy: {
      //               setType: "ANY",
      //               type: "SetOccurrencesRefineBy",
      //             },
      //             associationListId: 4747,
      //             filterBranchType: "ASSOCIATION",
      //           },
      //         ],
      //         filterBranchType: "AND",
      //       },
      //     ],
      //     filterBranchType: "OR",
      //   },
      //   listTypes: ["ENROLLMENT_LIST"],
      // },
      // {
      //   portalId: 9360603,
      //   listId: 3697,
      //   flowId: 260890628,
      //   filterBranch: {
      //     filterBranchOperator: "OR",
      //     filters: [],
      //     filterBranches: [
      //       {
      //         filterBranchOperator: "AND",
      //         filters: [
      //           {
      //             filterType: "PROPERTY",
      //             property: "hs_lead_status",
      //             operation: {
      //               propertyType: "enumeration",
      //               operator: "IS_ANY_OF",
      //               values: [
      //                 "Connected",
      //                 "Attempted to connect",
      //                 "Unqualified",
      //                 "Open deal",
      //               ],
      //               defaultValue: null,
      //               includeObjectsWithNoValueSet: false,
      //               operationType: "enumeration",
      //               operatorName: "IS_ANY_OF",
      //             },
      //             frameworkFilterId: null,
      //           },
      //         ],
      //         filterBranches: [],
      //         filterBranchType: "AND",
      //       },
      //       {
      //         filterBranchOperator: "AND",
      //         filters: [],
      //         filterBranches: [
      //           {
      //             filterBranchOperator: "AND",
      //             filters: [
      //               {
      //                 filterType: "PROPERTY",
      //                 property: "createdate",
      //                 operation: {
      //                   propertyType: "alltypes",
      //                   operator: "IS_KNOWN",
      //                   pruningRefineBy: null,
      //                   coalescingRefineBy: {
      //                     setType: "ANY",
      //                     type: "SetOccurrencesRefineBy",
      //                   },
      //                   defaultValue: null,
      //                   includeObjectsWithNoValueSet: false,
      //                   operationType: "alltypes",
      //                   operatorName: "IS_KNOWN",
      //                 },
      //                 frameworkFilterId: null,
      //               },
      //             ],
      //             filterBranches: [],
      //             associationCategory: "HUBSPOT_DEFINED",
      //             associationTypeId: 342,
      //             objectType: "DEAL",
      //             objectTypeId: "0-3",
      //             operator: "IN_LIST",
      //             coalescingRefineBy: {
      //               setType: "ANY",
      //               type: "SetOccurrencesRefineBy",
      //             },
      //             associationListId: 4748,
      //             filterBranchType: "ASSOCIATION",
      //           },
      //         ],
      //         filterBranchType: "AND",
      //       },
      //       {
      //         filterBranchOperator: "AND",
      //         filters: [
      //           {
      //             filterType: "PROPERTY",
      //             property: "lifecyclestage",
      //             operation: {
      //               propertyType: "enumeration",
      //               operator: "IS_ANY_OF",
      //               values: [
      //                 "evangelist",
      //                 "opportunity",
      //                 "salesqualifiedlead",
      //                 "33086390",
      //                 "33089671",
      //                 "customer",
      //               ],
      //               defaultValue: null,
      //               includeObjectsWithNoValueSet: false,
      //               operationType: "enumeration",
      //               operatorName: "IS_ANY_OF",
      //             },
      //             frameworkFilterId: null,
      //           },
      //         ],
      //         filterBranches: [],
      //         filterBranchType: "AND",
      //       },
      //       {
      //         filterBranchOperator: "AND",
      //         filters: [
      //           {
      //             filterType: "PROPERTY",
      //             property: "unqualified_reason",
      //             operation: {
      //               propertyType: "alltypes",
      //               operator: "IS_KNOWN",
      //               pruningRefineBy: null,
      //               coalescingRefineBy: {
      //                 setType: "ANY",
      //                 type: "SetOccurrencesRefineBy",
      //               },
      //               defaultValue: null,
      //               includeObjectsWithNoValueSet: false,
      //               operationType: "alltypes",
      //               operatorName: "IS_KNOWN",
      //             },
      //             frameworkFilterId: null,
      //           },
      //         ],
      //         filterBranches: [],
      //         filterBranchType: "AND",
      //       },
      //       {
      //         filterBranchOperator: "AND",
      //         filters: [],
      //         filterBranches: [
      //           {
      //             filterBranchOperator: "AND",
      //             filters: [
      //               {
      //                 filterType: "PROPERTY",
      //                 property: "hs_lead_status",
      //                 operation: {
      //                   propertyType: "enumeration",
      //                   operator: "IS_ANY_OF",
      //                   values: ["Open deal"],
      //                   defaultValue: null,
      //                   includeObjectsWithNoValueSet: false,
      //                   operationType: "enumeration",
      //                   operatorName: "IS_ANY_OF",
      //                 },
      //                 frameworkFilterId: null,
      //               },
      //             ],
      //             filterBranches: [],
      //             associationCategory: "HUBSPOT_DEFINED",
      //             associationTypeId: 280,
      //             objectType: "CONTACT",
      //             objectTypeId: "0-1",
      //             operator: "IN_LIST",
      //             coalescingRefineBy: {
      //               setType: "ANY",
      //               type: "SetOccurrencesRefineBy",
      //             },
      //             associationListId: 4749,
      //             filterBranchType: "ASSOCIATION",
      //           },
      //         ],
      //         filterBranchType: "AND",
      //       },
      //     ],
      //     filterBranchType: "OR",
      //   },
      //   listTypes: ["SUPPRESSION_LIST"],
      // },
    ],
    flowEventFilters: [],
    enrollmentCriteria: {
      triggerType: "LIST",
      filterBranch: {
        filterBranchOperator: "OR",
        filters: [],
        filterBranches: [
          {
            filterBranchOperator: "AND",
            filters: [
              {
                filterType: "PROPERTY",
                property: "lifecyclestage",
                operation: {
                  propertyType: "enumeration",
                  operator: "IS_ANY_OF",
                  values: ["marketingqualifiedlead", "lead"],
                  defaultValue: null,
                  includeObjectsWithNoValueSet: false,
                  operationType: "enumeration",
                  operatorName: "IS_ANY_OF",
                },
                frameworkFilterId: null,
              },
            ],
            filterBranches: [],
            filterBranchType: "AND",
          },
          {
            filterBranchOperator: "AND",
            filters: [],
            filterBranches: [
              {
                filterBranchOperator: "AND",
                filters: [
                  {
                    filterType: "PROPERTY",
                    property: "hs_lead_status",
                    operation: {
                      propertyType: "enumeration",
                      operator: "IS_ANY_OF",
                      values: ["New"],
                      defaultValue: null,
                      includeObjectsWithNoValueSet: false,
                      operationType: "enumeration",
                      operatorName: "IS_ANY_OF",
                    },
                    frameworkFilterId: null,
                  },
                ],
                filterBranches: [],
                associationCategory: "HUBSPOT_DEFINED",
                associationTypeId: 280,
                objectType: "CONTACT",
                objectTypeId: "0-1",
                operator: "IN_LIST",
                coalescingRefineBy: {
                  setType: "ANY",
                  type: "SetOccurrencesRefineBy",
                },
                associationListId: 4747,
                filterBranchType: "ASSOCIATION",
              },
            ],
            filterBranchType: "AND",
          },
        ],
        filterBranchType: "OR",
      },
    },
    enrollmentTrigger: "LIST",
    folder: {
      name: "NX 03 - Metrics - 02 Company",
      createdUserId: 44738973,
      updatedUserId: 9534005,
      createdAt: 1662562730653,
      updatedAt: 1684186510197,
      frameworkFolderId: 184675362469,
      id: 1191664,
      portalId: 9360603,
      flowCount: 22,
    },
  },
  {
    isEnabled: false,
    uuid: "[02.03. Lead status] Contact Lead status = Attempt to connect → Lead status = Attempt to -260890656",
    name: "[LEGACY] [02.03. Lead Status] Contact = Attempt to Connect → Lead Status = Attempt to Connect",
    firstActionId: 2,
    timeWindow: null,
    enrollmentSchedule: null,
    shouldReenroll: true,
    flowObjectType: "COMPANY",
    objectTypeId: "0-2",
    portalId: 9360603,
    flowId: 260890656,
    createMetadata: {
      updatedBy: {
        userId: 44593095,
        hubspotterId: null,
      },
      updatedAt: 1664490262240,
      referrer:
        "https://app.hubspot.com/workflows/9360603/view/default?sortBy=name&sortOrder=ascending&folderId=1191664",
      originRequestId: null,
      integrationId: null,
      jobName: null,
      internalJobUpdateTime: null,
      sourceApp: "WORKFLOWS_APP",
      cloneMetadata: {
        flowId: 260890628,
        version: 4,
      },
      templateMetadata: null,
    },
    updateMetadata: {
      updatedBy: {
        userId: 9534005,
        hubspotterId: null,
      },
      updatedAt: 1683143825562,
      referrer:
        "https://app.hubspot.com/workflows/9360603/platform/flow/260890656/edit",
      originRequestId: null,
      integrationId: null,
      jobName: null,
      internalJobUpdateTime: null,
      sourceApp: "WORKFLOWS_APP",
      cloneMetadata: null,
      templateMetadata: null,
    },
    isClassicWorkflow: false,
    nextAvailableActionId: 9,
    version: 30,
    actions: {
      1: {
        actionId: 1,
        metadata: {
          targetProperty: {
            propertyName: "hs_lead_status",
            source: "OBJECT",
          },
          value: {
            type: "STATIC_VALUE",
            value: "New",
          },
          actionType: "SET_PROPERTY",
        },
        connection: {
          nextActionId: 3,
          edgeType: "STANDARD",
          connectionType: "SINGLE",
        },
        actionType: "SET_PROPERTY",
        portalId: 9360603,
        flowId: 260890656,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
      2: {
        actionId: 2,
        metadata: {
          actionType: "LIST_BRANCH",
        },
        connection: {
          listBranches: [
            {
              listId: 3914,
              filterBranch: {
                filterBranchOperator: "OR",
                filters: [],
                filterBranches: [
                  {
                    filterBranchOperator: "AND",
                    filters: [
                      {
                        filterType: "PROPERTY",
                        property: "hs_lead_status",
                        operation: {
                          propertyType: "enumeration",
                          operator: "HAS_NEVER_BEEN_ANY_OF",
                          values: [
                            "New",
                            "Connected",
                            "Attempted to connect",
                            "Unqualified",
                            "Open deal",
                          ],
                          defaultValue: null,
                          includeObjectsWithNoValueSet: true,
                          operatorName: "HAS_NEVER_BEEN_ANY_OF",
                          operationType: "enumeration",
                        },
                        frameworkFilterId: null,
                      },
                    ],
                    filterBranches: [
                      {
                        filterBranchOperator: "AND",
                        filters: [
                          {
                            filterType: "PROPERTY",
                            property: "hs_lead_status",
                            operation: {
                              propertyType: "enumeration",
                              operator: "HAS_EVER_BEEN_ANY_OF",
                              values: ["New"],
                              defaultValue: null,
                              includeObjectsWithNoValueSet: false,
                              operatorName: "HAS_EVER_BEEN_ANY_OF",
                              operationType: "enumeration",
                            },
                            frameworkFilterId: null,
                          },
                        ],
                        filterBranches: [],
                        associationCategory: "HUBSPOT_DEFINED",
                        associationTypeId: 280,
                        objectType: "CONTACT",
                        objectTypeId: "0-1",
                        operator: "IN_LIST",
                        coalescingRefineBy: {
                          setType: "ANY",
                          type: "SetOccurrencesRefineBy",
                        },
                        associationListId: 3915,
                        filterBranchType: "ASSOCIATION",
                      },
                    ],
                    filterBranchType: "AND",
                  },
                ],
                filterBranchType: "OR",
              },
              connection: {
                nextActionId: 1,
                edgeType: "STANDARD",
                connectionType: "SINGLE",
              },
              branchName: "Reset New",
              nextActionId: 1,
            },
          ],
          defaultConnection: {
            nextActionId: 7,
            edgeType: "STANDARD",
            connectionType: "SINGLE",
          },
          defaultBranchName: "Set Attempt",
          defaultNextActionId: 7,
          connectionType: "LIST_BRANCH",
        },
        actionType: "LIST_BRANCH",
        portalId: 9360603,
        flowId: 260890656,
        flowVersion: 0,
        actionTypeId: "0-7",
      },
      3: {
        actionId: 3,
        metadata: {
          delay: {
            delta: 1,
            timeUnit: "MINUTES",
            timeOfDay: null,
            daysOfWeek: [],
            optionalTimeZoneStrategy: null,
          },
          actionType: "DELAY",
        },
        connection: {
          nextActionId: 7,
          edgeType: "GOTO",
          connectionType: "SINGLE",
        },
        actionType: "DELAY",
        portalId: 9360603,
        flowId: 260890656,
        flowVersion: 0,
        actionTypeId: "0-1",
      },
      4: {
        actionId: 4,
        metadata: {
          targetProperty: {
            propertyName: "hs_lead_status",
            source: "OBJECT",
          },
          value: {
            type: "STATIC_VALUE",
            value: "Attempted to connect",
          },
          actionType: "SET_PROPERTY",
        },
        connection: null,
        actionType: "SET_PROPERTY",
        portalId: 9360603,
        flowId: 260890656,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
      7: {
        actionId: 7,
        metadata: {
          targetProperty: {
            propertyName: "worked_date",
            source: "OBJECT",
          },
          value: {
            type: "TIMESTAMP",
          },
          actionType: "SET_PROPERTY",
        },
        connection: {
          nextActionId: 8,
          edgeType: "STANDARD",
          connectionType: "SINGLE",
        },
        actionType: "SET_PROPERTY",
        portalId: 9360603,
        flowId: 260890656,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
      8: {
        actionId: 8,
        metadata: {
          targetProperty: {
            propertyName: "work_rate",
            source: "OBJECT",
          },
          value: {
            type: "STATIC_VALUE",
            value: "Yes",
          },
          actionType: "SET_PROPERTY",
        },
        connection: {
          nextActionId: 4,
          edgeType: "STANDARD",
          connectionType: "SINGLE",
        },
        actionType: "SET_PROPERTY",
        portalId: 9360603,
        flowId: 260890656,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
    },
    classicEnrollmentSettings: null,
    associatedLists: [
      // {
      //   portalId: 9360603,
      //   listId: 3708,
      //   flowId: 260890656,
      //   filterBranch: {
      //     filterBranchOperator: "OR",
      //     filters: [],
      //     filterBranches: [
      //       {
      //         filterBranchOperator: "AND",
      //         filters: [],
      //         filterBranches: [
      //           {
      //             filterBranchOperator: "AND",
      //             filters: [
      //               {
      //                 filterType: "PROPERTY",
      //                 property: "hs_lead_status",
      //                 operation: {
      //                   propertyType: "enumeration",
      //                   operator: "IS_ANY_OF",
      //                   values: ["Attempt to connect"],
      //                   defaultValue: null,
      //                   includeObjectsWithNoValueSet: false,
      //                   operatorName: "IS_ANY_OF",
      //                   operationType: "enumeration",
      //                 },
      //                 frameworkFilterId: null,
      //               },
      //             ],
      //             filterBranches: [],
      //             associationCategory: "HUBSPOT_DEFINED",
      //             associationTypeId: 280,
      //             objectType: "CONTACT",
      //             objectTypeId: "0-1",
      //             operator: "IN_LIST",
      //             coalescingRefineBy: {
      //               setType: "ANY",
      //               type: "SetOccurrencesRefineBy",
      //             },
      //             associationListId: 4332,
      //             filterBranchType: "ASSOCIATION",
      //           },
      //         ],
      //         filterBranchType: "AND",
      //       },
      //     ],
      //     filterBranchType: "OR",
      //   },
      //   listTypes: ["ENROLLMENT_LIST"],
      // },
      // {
      //   portalId: 9360603,
      //   listId: 3706,
      //   flowId: 260890656,
      //   filterBranch: {
      //     filterBranchOperator: "OR",
      //     filters: [],
      //     filterBranches: [
      //       {
      //         filterBranchOperator: "AND",
      //         filters: [
      //           {
      //             filterType: "PROPERTY",
      //             property: "hs_lead_status",
      //             operation: {
      //               propertyType: "enumeration",
      //               operator: "IS_ANY_OF",
      //               values: ["Connected", "Unqualified", "Open deal"],
      //               defaultValue: null,
      //               includeObjectsWithNoValueSet: false,
      //               operatorName: "IS_ANY_OF",
      //               operationType: "enumeration",
      //             },
      //             frameworkFilterId: null,
      //           },
      //         ],
      //         filterBranches: [],
      //         filterBranchType: "AND",
      //       },
      //       {
      //         filterBranchOperator: "AND",
      //         filters: [],
      //         filterBranches: [
      //           {
      //             filterBranchOperator: "AND",
      //             filters: [
      //               {
      //                 filterType: "PROPERTY",
      //                 property: "createdate",
      //                 operation: {
      //                   propertyType: "alltypes",
      //                   operator: "IS_KNOWN",
      //                   pruningRefineBy: null,
      //                   coalescingRefineBy: {
      //                     setType: "ANY",
      //                     type: "SetOccurrencesRefineBy",
      //                   },
      //                   defaultValue: null,
      //                   includeObjectsWithNoValueSet: false,
      //                   operatorName: "IS_KNOWN",
      //                   operationType: "alltypes",
      //                 },
      //                 frameworkFilterId: null,
      //               },
      //             ],
      //             filterBranches: [],
      //             associationCategory: "HUBSPOT_DEFINED",
      //             associationTypeId: 342,
      //             objectType: "DEAL",
      //             objectTypeId: "0-3",
      //             operator: "IN_LIST",
      //             coalescingRefineBy: {
      //               setType: "ANY",
      //               type: "SetOccurrencesRefineBy",
      //             },
      //             associationListId: 4333,
      //             filterBranchType: "ASSOCIATION",
      //           },
      //         ],
      //         filterBranchType: "AND",
      //       },
      //       {
      //         filterBranchOperator: "AND",
      //         filters: [
      //           {
      //             filterType: "PROPERTY",
      //             property: "lifecyclestage",
      //             operation: {
      //               propertyType: "enumeration",
      //               operator: "IS_ANY_OF",
      //               values: [
      //                 "evangelist",
      //                 "opportunity",
      //                 "salesqualifiedlead",
      //                 "33086390",
      //                 "33089671",
      //                 "customer",
      //               ],
      //               defaultValue: null,
      //               includeObjectsWithNoValueSet: false,
      //               operatorName: "IS_ANY_OF",
      //               operationType: "enumeration",
      //             },
      //             frameworkFilterId: null,
      //           },
      //         ],
      //         filterBranches: [],
      //         filterBranchType: "AND",
      //       },
      //       {
      //         filterBranchOperator: "AND",
      //         filters: [
      //           {
      //             filterType: "PROPERTY",
      //             property: "unqualified_reason",
      //             operation: {
      //               propertyType: "alltypes",
      //               operator: "IS_KNOWN",
      //               pruningRefineBy: null,
      //               coalescingRefineBy: {
      //                 setType: "ANY",
      //                 type: "SetOccurrencesRefineBy",
      //               },
      //               defaultValue: null,
      //               includeObjectsWithNoValueSet: false,
      //               operatorName: "IS_KNOWN",
      //               operationType: "alltypes",
      //             },
      //             frameworkFilterId: null,
      //           },
      //         ],
      //         filterBranches: [],
      //         filterBranchType: "AND",
      //       },
      //       {
      //         filterBranchOperator: "AND",
      //         filters: [],
      //         filterBranches: [
      //           {
      //             filterBranchOperator: "AND",
      //             filters: [
      //               {
      //                 filterType: "PROPERTY",
      //                 property: "hs_lead_status",
      //                 operation: {
      //                   propertyType: "enumeration",
      //                   operator: "IS_ANY_OF",
      //                   values: ["Open deal"],
      //                   defaultValue: null,
      //                   includeObjectsWithNoValueSet: false,
      //                   operatorName: "IS_ANY_OF",
      //                   operationType: "enumeration",
      //                 },
      //                 frameworkFilterId: null,
      //               },
      //             ],
      //             filterBranches: [],
      //             associationCategory: "HUBSPOT_DEFINED",
      //             associationTypeId: 280,
      //             objectType: "CONTACT",
      //             objectTypeId: "0-1",
      //             operator: "IN_LIST",
      //             coalescingRefineBy: {
      //               setType: "ANY",
      //               type: "SetOccurrencesRefineBy",
      //             },
      //             associationListId: 4334,
      //             filterBranchType: "ASSOCIATION",
      //           },
      //         ],
      //         filterBranchType: "AND",
      //       },
      //     ],
      //     filterBranchType: "OR",
      //   },
      //   listTypes: ["SUPPRESSION_LIST"],
      // },
    ],
    flowEventFilters: [],
    enrollmentCriteria: {
      triggerType: "LIST",
      filterBranch: {
        filterBranchOperator: "OR",
        filters: [],
        filterBranches: [
          {
            filterBranchOperator: "AND",
            filters: [],
            filterBranches: [
              {
                filterBranchOperator: "AND",
                filters: [
                  {
                    filterType: "PROPERTY",
                    property: "hs_lead_status",
                    operation: {
                      propertyType: "enumeration",
                      operator: "IS_ANY_OF",
                      values: ["Attempt to connect"],
                      defaultValue: null,
                      includeObjectsWithNoValueSet: false,
                      operatorName: "IS_ANY_OF",
                      operationType: "enumeration",
                    },
                    frameworkFilterId: null,
                  },
                ],
                filterBranches: [],
                associationCategory: "HUBSPOT_DEFINED",
                associationTypeId: 280,
                objectType: "CONTACT",
                objectTypeId: "0-1",
                operator: "IN_LIST",
                coalescingRefineBy: {
                  setType: "ANY",
                  type: "SetOccurrencesRefineBy",
                },
                associationListId: 4332,
                filterBranchType: "ASSOCIATION",
              },
            ],
            filterBranchType: "AND",
          },
        ],
        filterBranchType: "OR",
      },
    },
    enrollmentTrigger: "LIST",
    folder: {
      name: "NX 03 - Metrics - 02 Company",
      createdUserId: 44738973,
      updatedUserId: 9534005,
      createdAt: 1662562730653,
      updatedAt: 1684186510197,
      frameworkFolderId: 184675362469,
      id: 1191664,
      portalId: 9360603,
      flowCount: 22,
    },
  },
  {
    isEnabled: false,
    uuid: "[02.04. Lead status] Contact Lead status = Connected → Lead status = Connected-260890906",
    name: "[LEGACY] [02.04. Lead Status] Contact = Connected → Lead Status = Connected",
    firstActionId: 2,
    timeWindow: null,
    enrollmentSchedule: null,
    shouldReenroll: true,
    flowObjectType: "COMPANY",
    objectTypeId: "0-2",
    portalId: 9360603,
    flowId: 260890906,
    createMetadata: {
      updatedBy: {
        userId: 44593095,
        hubspotterId: null,
      },
      updatedAt: 1664490778797,
      referrer:
        "https://app.hubspot.com/workflows/9360603/view/default?sortBy=name&sortOrder=ascending&folderId=1191664",
      originRequestId: null,
      integrationId: null,
      jobName: null,
      internalJobUpdateTime: null,
      sourceApp: "WORKFLOWS_APP",
      cloneMetadata: {
        flowId: 260890656,
        version: 12,
      },
      templateMetadata: null,
    },
    updateMetadata: {
      updatedBy: {
        userId: 9534005,
        hubspotterId: null,
      },
      updatedAt: 1683143848385,
      referrer:
        "https://app.hubspot.com/workflows/9360603/platform/flow/260890906/edit",
      originRequestId: null,
      integrationId: null,
      jobName: null,
      internalJobUpdateTime: null,
      sourceApp: "WORKFLOWS_APP",
      cloneMetadata: null,
      templateMetadata: null,
    },
    isClassicWorkflow: false,
    nextAvailableActionId: 23,
    version: 53,
    actions: {
      1: {
        actionId: 1,
        metadata: {
          targetProperty: {
            propertyName: "hs_lead_status",
            source: "OBJECT",
          },
          value: {
            type: "STATIC_VALUE",
            value: "New",
          },
          actionType: "SET_PROPERTY",
        },
        connection: {
          nextActionId: 3,
          edgeType: "STANDARD",
          connectionType: "SINGLE",
        },
        actionType: "SET_PROPERTY",
        portalId: 9360603,
        flowId: 260890906,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
      2: {
        actionId: 2,
        metadata: {
          actionType: "LIST_BRANCH",
        },
        connection: {
          listBranches: [
            {
              listId: 3916,
              filterBranch: {
                filterBranchOperator: "OR",
                filters: [],
                filterBranches: [
                  {
                    filterBranchOperator: "AND",
                    filters: [
                      {
                        filterType: "PROPERTY",
                        property: "hs_lead_status",
                        operation: {
                          propertyType: "enumeration",
                          operator: "HAS_NEVER_BEEN_ANY_OF",
                          values: [
                            "New",
                            "Connected",
                            "Attempted to connect",
                            "Unqualified",
                            "Open deal",
                          ],
                          defaultValue: null,
                          includeObjectsWithNoValueSet: true,
                          operatorName: "HAS_NEVER_BEEN_ANY_OF",
                          operationType: "enumeration",
                        },
                        frameworkFilterId: null,
                      },
                    ],
                    filterBranches: [
                      {
                        filterBranchOperator: "AND",
                        filters: [
                          {
                            filterType: "PROPERTY",
                            property: "hs_lead_status",
                            operation: {
                              propertyType: "enumeration",
                              operator: "HAS_EVER_BEEN_ANY_OF",
                              values: ["New"],
                              defaultValue: null,
                              includeObjectsWithNoValueSet: false,
                              operatorName: "HAS_EVER_BEEN_ANY_OF",
                              operationType: "enumeration",
                            },
                            frameworkFilterId: null,
                          },
                        ],
                        filterBranches: [],
                        associationCategory: "HUBSPOT_DEFINED",
                        associationTypeId: 280,
                        objectType: "CONTACT",
                        objectTypeId: "0-1",
                        operator: "IN_LIST",
                        coalescingRefineBy: {
                          setType: "ANY",
                          type: "SetOccurrencesRefineBy",
                        },
                        associationListId: 3917,
                        filterBranchType: "ASSOCIATION",
                      },
                    ],
                    filterBranchType: "AND",
                  },
                ],
                filterBranchType: "OR",
              },
              connection: {
                nextActionId: 1,
                edgeType: "STANDARD",
                connectionType: "SINGLE",
              },
              branchName: "Reset New",
              nextActionId: 1,
            },
          ],
          defaultConnection: {
            nextActionId: 7,
            edgeType: "STANDARD",
            connectionType: "SINGLE",
          },
          defaultBranchName: "Check Attempt",
          defaultNextActionId: 7,
          connectionType: "LIST_BRANCH",
        },
        actionType: "LIST_BRANCH",
        portalId: 9360603,
        flowId: 260890906,
        flowVersion: 0,
        actionTypeId: "0-7",
      },
      3: {
        actionId: 3,
        metadata: {
          delay: {
            delta: 1,
            timeUnit: "MINUTES",
            timeOfDay: null,
            daysOfWeek: [],
            optionalTimeZoneStrategy: null,
          },
          actionType: "DELAY",
        },
        connection: {
          nextActionId: 7,
          edgeType: "GOTO",
          connectionType: "SINGLE",
        },
        actionType: "DELAY",
        portalId: 9360603,
        flowId: 260890906,
        flowVersion: 0,
        actionTypeId: "0-1",
      },
      7: {
        actionId: 7,
        metadata: {
          actionType: "LIST_BRANCH",
        },
        connection: {
          listBranches: [
            {
              listId: 3922,
              filterBranch: {
                filterBranchOperator: "OR",
                filters: [],
                filterBranches: [
                  {
                    filterBranchOperator: "AND",
                    filters: [
                      {
                        filterType: "PROPERTY",
                        property: "hs_lead_status",
                        operation: {
                          propertyType: "enumeration",
                          operator: "HAS_NEVER_BEEN_ANY_OF",
                          values: [
                            "Connected",
                            "Attempted to connect",
                            "Unqualified",
                            "Open deal",
                          ],
                          defaultValue: null,
                          includeObjectsWithNoValueSet: true,
                          operatorName: "HAS_NEVER_BEEN_ANY_OF",
                          operationType: "enumeration",
                        },
                        frameworkFilterId: null,
                      },
                    ],
                    filterBranches: [
                      {
                        filterBranchOperator: "AND",
                        filters: [
                          {
                            filterType: "PROPERTY",
                            property: "hs_lead_status",
                            operation: {
                              propertyType: "enumeration",
                              operator: "HAS_EVER_BEEN_ANY_OF",
                              values: ["Attempt to connect"],
                              defaultValue: null,
                              includeObjectsWithNoValueSet: false,
                              operatorName: "HAS_EVER_BEEN_ANY_OF",
                              operationType: "enumeration",
                            },
                            frameworkFilterId: null,
                          },
                        ],
                        filterBranches: [],
                        associationCategory: "HUBSPOT_DEFINED",
                        associationTypeId: 280,
                        objectType: "CONTACT",
                        objectTypeId: "0-1",
                        operator: "IN_LIST",
                        coalescingRefineBy: {
                          setType: "ANY",
                          type: "SetOccurrencesRefineBy",
                        },
                        associationListId: 3923,
                        filterBranchType: "ASSOCIATION",
                      },
                    ],
                    filterBranchType: "AND",
                  },
                ],
                filterBranchType: "OR",
              },
              connection: {
                nextActionId: 19,
                edgeType: "STANDARD",
                connectionType: "SINGLE",
              },
              branchName: "Reset Attempt",
              nextActionId: 19,
            },
          ],
          defaultConnection: {
            nextActionId: 21,
            edgeType: "STANDARD",
            connectionType: "SINGLE",
          },
          defaultBranchName: "Check Connected",
          defaultNextActionId: 21,
          connectionType: "LIST_BRANCH",
        },
        actionType: "LIST_BRANCH",
        portalId: 9360603,
        flowId: 260890906,
        flowVersion: 0,
        actionTypeId: "0-7",
      },
      8: {
        actionId: 8,
        metadata: {
          delay: {
            delta: 1,
            timeUnit: "MINUTES",
            timeOfDay: null,
            daysOfWeek: [],
            optionalTimeZoneStrategy: null,
          },
          actionType: "DELAY",
        },
        connection: {
          nextActionId: 21,
          edgeType: "GOTO",
          connectionType: "SINGLE",
        },
        actionType: "DELAY",
        portalId: 9360603,
        flowId: 260890906,
        flowVersion: 0,
        actionTypeId: "0-1",
      },
      9: {
        actionId: 9,
        metadata: {
          targetProperty: {
            propertyName: "hs_lead_status",
            source: "OBJECT",
          },
          value: {
            type: "STATIC_VALUE",
            value: "Attempted to connect",
          },
          actionType: "SET_PROPERTY",
        },
        connection: {
          nextActionId: 8,
          edgeType: "STANDARD",
          connectionType: "SINGLE",
        },
        actionType: "SET_PROPERTY",
        portalId: 9360603,
        flowId: 260890906,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
      16: {
        actionId: 16,
        metadata: {
          targetProperty: {
            propertyName: "hs_lead_status",
            source: "OBJECT",
          },
          value: {
            type: "STATIC_VALUE",
            value: "Connected",
          },
          actionType: "SET_PROPERTY",
        },
        connection: null,
        actionType: "SET_PROPERTY",
        portalId: 9360603,
        flowId: 260890906,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
      19: {
        actionId: 19,
        metadata: {
          targetProperty: {
            propertyName: "worked_date",
            source: "OBJECT",
          },
          value: {
            type: "TIMESTAMP",
          },
          actionType: "SET_PROPERTY",
        },
        connection: {
          nextActionId: 20,
          edgeType: "STANDARD",
          connectionType: "SINGLE",
        },
        actionType: "SET_PROPERTY",
        portalId: 9360603,
        flowId: 260890906,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
      20: {
        actionId: 20,
        metadata: {
          targetProperty: {
            propertyName: "work_rate",
            source: "OBJECT",
          },
          value: {
            type: "STATIC_VALUE",
            value: "Yes",
          },
          actionType: "SET_PROPERTY",
        },
        connection: {
          nextActionId: 9,
          edgeType: "STANDARD",
          connectionType: "SINGLE",
        },
        actionType: "SET_PROPERTY",
        portalId: 9360603,
        flowId: 260890906,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
      21: {
        actionId: 21,
        metadata: {
          targetProperty: {
            propertyName: "connected_date",
            source: "OBJECT",
          },
          value: {
            type: "TIMESTAMP",
          },
          actionType: "SET_PROPERTY",
        },
        connection: {
          nextActionId: 22,
          edgeType: "STANDARD",
          connectionType: "SINGLE",
        },
        actionType: "SET_PROPERTY",
        portalId: 9360603,
        flowId: 260890906,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
      22: {
        actionId: 22,
        metadata: {
          targetProperty: {
            propertyName: "connect_rate",
            source: "OBJECT",
          },
          value: {
            type: "STATIC_VALUE",
            value: "Yes",
          },
          actionType: "SET_PROPERTY",
        },
        connection: {
          nextActionId: 16,
          edgeType: "STANDARD",
          connectionType: "SINGLE",
        },
        actionType: "SET_PROPERTY",
        portalId: 9360603,
        flowId: 260890906,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
    },
    classicEnrollmentSettings: null,
    associatedLists: [
      // {
      //   portalId: 9360603,
      //   listId: 3723,
      //   flowId: 260890906,
      //   filterBranch: {
      //     filterBranchOperator: "OR",
      //     filters: [],
      //     filterBranches: [
      //       {
      //         filterBranchOperator: "AND",
      //         filters: [],
      //         filterBranches: [
      //           {
      //             filterBranchOperator: "AND",
      //             filters: [
      //               {
      //                 filterType: "PROPERTY",
      //                 property: "hs_lead_status",
      //                 operation: {
      //                   propertyType: "enumeration",
      //                   operator: "IS_ANY_OF",
      //                   values: ["Connected"],
      //                   defaultValue: null,
      //                   includeObjectsWithNoValueSet: false,
      //                   operatorName: "IS_ANY_OF",
      //                   operationType: "enumeration",
      //                 },
      //                 frameworkFilterId: null,
      //               },
      //             ],
      //             filterBranches: [],
      //             associationCategory: "HUBSPOT_DEFINED",
      //             associationTypeId: 280,
      //             objectType: "CONTACT",
      //             objectTypeId: "0-1",
      //             operator: "IN_LIST",
      //             coalescingRefineBy: {
      //               setType: "ANY",
      //               type: "SetOccurrencesRefineBy",
      //             },
      //             associationListId: 4329,
      //             filterBranchType: "ASSOCIATION",
      //           },
      //         ],
      //         filterBranchType: "AND",
      //       },
      //     ],
      //     filterBranchType: "OR",
      //   },
      //   listTypes: ["ENROLLMENT_LIST"],
      // },
      // {
      //   portalId: 9360603,
      //   listId: 3725,
      //   flowId: 260890906,
      //   filterBranch: {
      //     filterBranchOperator: "OR",
      //     filters: [],
      //     filterBranches: [
      //       {
      //         filterBranchOperator: "AND",
      //         filters: [
      //           {
      //             filterType: "PROPERTY",
      //             property: "hs_lead_status",
      //             operation: {
      //               propertyType: "enumeration",
      //               operator: "IS_ANY_OF",
      //               values: ["Unqualified", "Open deal"],
      //               defaultValue: null,
      //               includeObjectsWithNoValueSet: false,
      //               operatorName: "IS_ANY_OF",
      //               operationType: "enumeration",
      //             },
      //             frameworkFilterId: null,
      //           },
      //         ],
      //         filterBranches: [],
      //         filterBranchType: "AND",
      //       },
      //       {
      //         filterBranchOperator: "AND",
      //         filters: [],
      //         filterBranches: [
      //           {
      //             filterBranchOperator: "AND",
      //             filters: [
      //               {
      //                 filterType: "PROPERTY",
      //                 property: "createdate",
      //                 operation: {
      //                   propertyType: "alltypes",
      //                   operator: "IS_KNOWN",
      //                   pruningRefineBy: null,
      //                   coalescingRefineBy: {
      //                     setType: "ANY",
      //                     type: "SetOccurrencesRefineBy",
      //                   },
      //                   defaultValue: null,
      //                   includeObjectsWithNoValueSet: false,
      //                   operatorName: "IS_KNOWN",
      //                   operationType: "alltypes",
      //                 },
      //                 frameworkFilterId: null,
      //               },
      //             ],
      //             filterBranches: [],
      //             associationCategory: "HUBSPOT_DEFINED",
      //             associationTypeId: 342,
      //             objectType: "DEAL",
      //             objectTypeId: "0-3",
      //             operator: "IN_LIST",
      //             coalescingRefineBy: {
      //               setType: "ANY",
      //               type: "SetOccurrencesRefineBy",
      //             },
      //             associationListId: 4330,
      //             filterBranchType: "ASSOCIATION",
      //           },
      //         ],
      //         filterBranchType: "AND",
      //       },
      //       {
      //         filterBranchOperator: "AND",
      //         filters: [
      //           {
      //             filterType: "PROPERTY",
      //             property: "lifecyclestage",
      //             operation: {
      //               propertyType: "enumeration",
      //               operator: "IS_ANY_OF",
      //               values: [
      //                 "evangelist",
      //                 "opportunity",
      //                 "salesqualifiedlead",
      //                 "33086390",
      //                 "33089671",
      //                 "customer",
      //               ],
      //               defaultValue: null,
      //               includeObjectsWithNoValueSet: false,
      //               operatorName: "IS_ANY_OF",
      //               operationType: "enumeration",
      //             },
      //             frameworkFilterId: null,
      //           },
      //         ],
      //         filterBranches: [],
      //         filterBranchType: "AND",
      //       },
      //       {
      //         filterBranchOperator: "AND",
      //         filters: [
      //           {
      //             filterType: "PROPERTY",
      //             property: "unqualified_reason",
      //             operation: {
      //               propertyType: "alltypes",
      //               operator: "IS_KNOWN",
      //               pruningRefineBy: null,
      //               coalescingRefineBy: {
      //                 setType: "ANY",
      //                 type: "SetOccurrencesRefineBy",
      //               },
      //               defaultValue: null,
      //               includeObjectsWithNoValueSet: false,
      //               operatorName: "IS_KNOWN",
      //               operationType: "alltypes",
      //             },
      //             frameworkFilterId: null,
      //           },
      //         ],
      //         filterBranches: [],
      //         filterBranchType: "AND",
      //       },
      //       {
      //         filterBranchOperator: "AND",
      //         filters: [],
      //         filterBranches: [
      //           {
      //             filterBranchOperator: "AND",
      //             filters: [
      //               {
      //                 filterType: "PROPERTY",
      //                 property: "hs_lead_status",
      //                 operation: {
      //                   propertyType: "enumeration",
      //                   operator: "IS_ANY_OF",
      //                   values: ["Open deal"],
      //                   defaultValue: null,
      //                   includeObjectsWithNoValueSet: false,
      //                   operatorName: "IS_ANY_OF",
      //                   operationType: "enumeration",
      //                 },
      //                 frameworkFilterId: null,
      //               },
      //             ],
      //             filterBranches: [],
      //             associationCategory: "HUBSPOT_DEFINED",
      //             associationTypeId: 280,
      //             objectType: "CONTACT",
      //             objectTypeId: "0-1",
      //             operator: "IN_LIST",
      //             coalescingRefineBy: {
      //               setType: "ANY",
      //               type: "SetOccurrencesRefineBy",
      //             },
      //             associationListId: 4331,
      //             filterBranchType: "ASSOCIATION",
      //           },
      //         ],
      //         filterBranchType: "AND",
      //       },
      //     ],
      //     filterBranchType: "OR",
      //   },
      //   listTypes: ["SUPPRESSION_LIST"],
      // },
    ],
    flowEventFilters: [],
    enrollmentCriteria: {
      triggerType: "LIST",
      filterBranch: {
        filterBranchOperator: "OR",
        filters: [],
        filterBranches: [
          {
            filterBranchOperator: "AND",
            filters: [],
            filterBranches: [
              {
                filterBranchOperator: "AND",
                filters: [
                  {
                    filterType: "PROPERTY",
                    property: "hs_lead_status",
                    operation: {
                      propertyType: "enumeration",
                      operator: "IS_ANY_OF",
                      values: ["Connected"],
                      defaultValue: null,
                      includeObjectsWithNoValueSet: false,
                      operatorName: "IS_ANY_OF",
                      operationType: "enumeration",
                    },
                    frameworkFilterId: null,
                  },
                ],
                filterBranches: [],
                associationCategory: "HUBSPOT_DEFINED",
                associationTypeId: 280,
                objectType: "CONTACT",
                objectTypeId: "0-1",
                operator: "IN_LIST",
                coalescingRefineBy: {
                  setType: "ANY",
                  type: "SetOccurrencesRefineBy",
                },
                associationListId: 4329,
                filterBranchType: "ASSOCIATION",
              },
            ],
            filterBranchType: "AND",
          },
        ],
        filterBranchType: "OR",
      },
    },
    enrollmentTrigger: "LIST",
    folder: {
      name: "NX 03 - Metrics - 02 Company",
      createdUserId: 44738973,
      updatedUserId: 9534005,
      createdAt: 1662562730653,
      updatedAt: 1684186510197,
      frameworkFolderId: 184675362469,
      id: 1191664,
      portalId: 9360603,
      flowCount: 22,
    },
  },
  {
    isEnabled: false,
    uuid: "[02.05. Lead status]  Lifecycle  stage >= Opportunity → Lead status = Open Deal-260913784",
    name: "[LEGACY] [02.05. Lead Status] Contact = Open Deal → Lead Status = Open Deal",
    firstActionId: 2,
    timeWindow: null,
    enrollmentSchedule: null,
    shouldReenroll: true,
    flowObjectType: "COMPANY",
    objectTypeId: "0-2",
    portalId: 9360603,
    flowId: 260913784,
    createMetadata: {
      updatedBy: {
        userId: 44593095,
        hubspotterId: null,
      },
      updatedAt: 1664491937726,
      referrer:
        "https://app.hubspot.com/workflows/9360603/view/default?sortBy=name&sortOrder=ascending&folderId=1191664",
      originRequestId: null,
      integrationId: null,
      jobName: null,
      internalJobUpdateTime: null,
      sourceApp: "WORKFLOWS_APP",
      cloneMetadata: {
        flowId: 260890906,
        version: 18,
      },
      templateMetadata: null,
    },
    updateMetadata: {
      updatedBy: {
        userId: 9534005,
        hubspotterId: null,
      },
      updatedAt: 1683143868236,
      referrer:
        "https://app.hubspot.com/workflows/9360603/platform/flow/260913784/edit",
      originRequestId: null,
      integrationId: null,
      jobName: null,
      internalJobUpdateTime: null,
      sourceApp: "WORKFLOWS_APP",
      cloneMetadata: null,
      templateMetadata: null,
    },
    isClassicWorkflow: false,
    nextAvailableActionId: 24,
    version: 42,
    actions: {
      1: {
        actionId: 1,
        metadata: {
          targetProperty: {
            propertyName: "hs_lead_status",
            source: "OBJECT",
          },
          value: {
            type: "STATIC_VALUE",
            value: "New",
          },
          actionType: "SET_PROPERTY",
        },
        connection: {
          nextActionId: 3,
          edgeType: "STANDARD",
          connectionType: "SINGLE",
        },
        actionType: "SET_PROPERTY",
        portalId: 9360603,
        flowId: 260913784,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
      2: {
        actionId: 2,
        metadata: {
          actionType: "LIST_BRANCH",
        },
        connection: {
          listBranches: [
            {
              listId: 3918,
              filterBranch: {
                filterBranchOperator: "OR",
                filters: [],
                filterBranches: [
                  {
                    filterBranchOperator: "AND",
                    filters: [
                      {
                        filterType: "PROPERTY",
                        property: "hs_lead_status",
                        operation: {
                          propertyType: "enumeration",
                          operator: "HAS_NEVER_BEEN_ANY_OF",
                          values: [
                            "New",
                            "Connected",
                            "Attempted to connect",
                            "Unqualified",
                            "Open deal",
                          ],
                          defaultValue: null,
                          includeObjectsWithNoValueSet: true,
                          operationType: "enumeration",
                          operatorName: "HAS_NEVER_BEEN_ANY_OF",
                        },
                        frameworkFilterId: null,
                      },
                    ],
                    filterBranches: [
                      {
                        filterBranchOperator: "AND",
                        filters: [
                          {
                            filterType: "PROPERTY",
                            property: "hs_lead_status",
                            operation: {
                              propertyType: "enumeration",
                              operator: "HAS_EVER_BEEN_ANY_OF",
                              values: ["New"],
                              defaultValue: null,
                              includeObjectsWithNoValueSet: false,
                              operationType: "enumeration",
                              operatorName: "HAS_EVER_BEEN_ANY_OF",
                            },
                            frameworkFilterId: null,
                          },
                        ],
                        filterBranches: [],
                        associationCategory: "HUBSPOT_DEFINED",
                        associationTypeId: 280,
                        objectType: "CONTACT",
                        objectTypeId: "0-1",
                        operator: "IN_LIST",
                        coalescingRefineBy: {
                          setType: "ANY",
                          type: "SetOccurrencesRefineBy",
                        },
                        associationListId: 3919,
                        filterBranchType: "ASSOCIATION",
                      },
                    ],
                    filterBranchType: "AND",
                  },
                ],
                filterBranchType: "OR",
              },
              connection: {
                nextActionId: 1,
                edgeType: "STANDARD",
                connectionType: "SINGLE",
              },
              branchName: "Reset New",
              nextActionId: 1,
            },
          ],
          defaultConnection: {
            nextActionId: 7,
            edgeType: "STANDARD",
            connectionType: "SINGLE",
          },
          defaultBranchName: "Check Attempt",
          defaultNextActionId: 7,
          connectionType: "LIST_BRANCH",
        },
        actionType: "LIST_BRANCH",
        portalId: 9360603,
        flowId: 260913784,
        flowVersion: 0,
        actionTypeId: "0-7",
      },
      3: {
        actionId: 3,
        metadata: {
          delay: {
            delta: 1,
            timeUnit: "MINUTES",
            timeOfDay: null,
            daysOfWeek: [],
            optionalTimeZoneStrategy: null,
          },
          actionType: "DELAY",
        },
        connection: {
          nextActionId: 7,
          edgeType: "GOTO",
          connectionType: "SINGLE",
        },
        actionType: "DELAY",
        portalId: 9360603,
        flowId: 260913784,
        flowVersion: 0,
        actionTypeId: "0-1",
      },
      7: {
        actionId: 7,
        metadata: {
          actionType: "LIST_BRANCH",
        },
        connection: {
          listBranches: [
            {
              listId: 3924,
              filterBranch: {
                filterBranchOperator: "OR",
                filters: [],
                filterBranches: [
                  {
                    filterBranchOperator: "AND",
                    filters: [
                      {
                        filterType: "PROPERTY",
                        property: "hs_lead_status",
                        operation: {
                          propertyType: "enumeration",
                          operator: "HAS_NEVER_BEEN_ANY_OF",
                          values: [
                            "Connected",
                            "Attempted to connect",
                            "Unqualified",
                            "Open deal",
                          ],
                          defaultValue: null,
                          includeObjectsWithNoValueSet: true,
                          operationType: "enumeration",
                          operatorName: "HAS_NEVER_BEEN_ANY_OF",
                        },
                        frameworkFilterId: null,
                      },
                    ],
                    filterBranches: [
                      {
                        filterBranchOperator: "AND",
                        filters: [
                          {
                            filterType: "PROPERTY",
                            property: "hs_lead_status",
                            operation: {
                              propertyType: "enumeration",
                              operator: "HAS_EVER_BEEN_ANY_OF",
                              values: ["Attempt to connect"],
                              defaultValue: null,
                              includeObjectsWithNoValueSet: false,
                              operationType: "enumeration",
                              operatorName: "HAS_EVER_BEEN_ANY_OF",
                            },
                            frameworkFilterId: null,
                          },
                        ],
                        filterBranches: [],
                        associationCategory: "HUBSPOT_DEFINED",
                        associationTypeId: 280,
                        objectType: "CONTACT",
                        objectTypeId: "0-1",
                        operator: "IN_LIST",
                        coalescingRefineBy: {
                          setType: "ANY",
                          type: "SetOccurrencesRefineBy",
                        },
                        associationListId: 3925,
                        filterBranchType: "ASSOCIATION",
                      },
                    ],
                    filterBranchType: "AND",
                  },
                ],
                filterBranchType: "OR",
              },
              connection: {
                nextActionId: 20,
                edgeType: "STANDARD",
                connectionType: "SINGLE",
              },
              branchName: "Reset Attempt",
              nextActionId: 20,
            },
          ],
          defaultConnection: {
            nextActionId: 13,
            edgeType: "STANDARD",
            connectionType: "SINGLE",
          },
          defaultBranchName: "Check Connected",
          defaultNextActionId: 13,
          connectionType: "LIST_BRANCH",
        },
        actionType: "LIST_BRANCH",
        portalId: 9360603,
        flowId: 260913784,
        flowVersion: 0,
        actionTypeId: "0-7",
      },
      8: {
        actionId: 8,
        metadata: {
          delay: {
            delta: 1,
            timeUnit: "MINUTES",
            timeOfDay: null,
            daysOfWeek: [],
            optionalTimeZoneStrategy: null,
          },
          actionType: "DELAY",
        },
        connection: {
          nextActionId: 13,
          edgeType: "GOTO",
          connectionType: "SINGLE",
        },
        actionType: "DELAY",
        portalId: 9360603,
        flowId: 260913784,
        flowVersion: 0,
        actionTypeId: "0-1",
      },
      9: {
        actionId: 9,
        metadata: {
          targetProperty: {
            propertyName: "hs_lead_status",
            source: "OBJECT",
          },
          value: {
            type: "STATIC_VALUE",
            value: "Attempted to connect",
          },
          actionType: "SET_PROPERTY",
        },
        connection: {
          nextActionId: 8,
          edgeType: "STANDARD",
          connectionType: "SINGLE",
        },
        actionType: "SET_PROPERTY",
        portalId: 9360603,
        flowId: 260913784,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
      13: {
        actionId: 13,
        metadata: {
          actionType: "LIST_BRANCH",
        },
        connection: {
          listBranches: [
            {
              listId: 3933,
              filterBranch: {
                filterBranchOperator: "OR",
                filters: [],
                filterBranches: [
                  {
                    filterBranchOperator: "AND",
                    filters: [
                      {
                        filterType: "PROPERTY",
                        property: "hs_lead_status",
                        operation: {
                          propertyType: "enumeration",
                          operator: "HAS_NEVER_BEEN_ANY_OF",
                          values: ["Connected", "Unqualified", "Open deal"],
                          defaultValue: null,
                          includeObjectsWithNoValueSet: true,
                          operationType: "enumeration",
                          operatorName: "HAS_NEVER_BEEN_ANY_OF",
                        },
                        frameworkFilterId: null,
                      },
                    ],
                    filterBranches: [
                      {
                        filterBranchOperator: "AND",
                        filters: [
                          {
                            filterType: "PROPERTY",
                            property: "hs_lead_status",
                            operation: {
                              propertyType: "enumeration",
                              operator: "HAS_EVER_BEEN_ANY_OF",
                              values: ["Connected"],
                              defaultValue: null,
                              includeObjectsWithNoValueSet: false,
                              operationType: "enumeration",
                              operatorName: "HAS_EVER_BEEN_ANY_OF",
                            },
                            frameworkFilterId: null,
                          },
                        ],
                        filterBranches: [],
                        associationCategory: "HUBSPOT_DEFINED",
                        associationTypeId: 280,
                        objectType: "CONTACT",
                        objectTypeId: "0-1",
                        operator: "IN_LIST",
                        coalescingRefineBy: {
                          setType: "ANY",
                          type: "SetOccurrencesRefineBy",
                        },
                        associationListId: 3934,
                        filterBranchType: "ASSOCIATION",
                      },
                    ],
                    filterBranchType: "AND",
                  },
                ],
                filterBranchType: "OR",
              },
              connection: {
                nextActionId: 22,
                edgeType: "STANDARD",
                connectionType: "SINGLE",
              },
              branchName: "Reset Connected",
              nextActionId: 22,
            },
          ],
          defaultConnection: {
            nextActionId: 16,
            edgeType: "STANDARD",
            connectionType: "SINGLE",
          },
          defaultBranchName: "Set Open Deal",
          defaultNextActionId: 16,
          connectionType: "LIST_BRANCH",
        },
        actionType: "LIST_BRANCH",
        portalId: 9360603,
        flowId: 260913784,
        flowVersion: 0,
        actionTypeId: "0-7",
      },
      15: {
        actionId: 15,
        metadata: {
          targetProperty: {
            propertyName: "hs_lead_status",
            source: "OBJECT",
          },
          value: {
            type: "STATIC_VALUE",
            value: "Connected",
          },
          actionType: "SET_PROPERTY",
        },
        connection: {
          nextActionId: 19,
          edgeType: "STANDARD",
          connectionType: "SINGLE",
        },
        actionType: "SET_PROPERTY",
        portalId: 9360603,
        flowId: 260913784,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
      16: {
        actionId: 16,
        metadata: {
          targetProperty: {
            propertyName: "hs_lead_status",
            source: "OBJECT",
          },
          value: {
            type: "STATIC_VALUE",
            value: "Open deal",
          },
          actionType: "SET_PROPERTY",
        },
        connection: null,
        actionType: "SET_PROPERTY",
        portalId: 9360603,
        flowId: 260913784,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
      19: {
        actionId: 19,
        metadata: {
          delay: {
            delta: 1,
            timeUnit: "MINUTES",
            timeOfDay: null,
            daysOfWeek: [],
            optionalTimeZoneStrategy: null,
          },
          actionType: "DELAY",
        },
        connection: {
          nextActionId: 16,
          edgeType: "GOTO",
          connectionType: "SINGLE",
        },
        actionType: "DELAY",
        portalId: 9360603,
        flowId: 260913784,
        flowVersion: 0,
        actionTypeId: "0-1",
      },
      20: {
        actionId: 20,
        metadata: {
          targetProperty: {
            propertyName: "worked_date",
            source: "OBJECT",
          },
          value: {
            type: "TIMESTAMP",
          },
          actionType: "SET_PROPERTY",
        },
        connection: {
          nextActionId: 21,
          edgeType: "STANDARD",
          connectionType: "SINGLE",
        },
        actionType: "SET_PROPERTY",
        portalId: 9360603,
        flowId: 260913784,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
      21: {
        actionId: 21,
        metadata: {
          targetProperty: {
            propertyName: "work_rate",
            source: "OBJECT",
          },
          value: {
            type: "STATIC_VALUE",
            value: "Yes",
          },
          actionType: "SET_PROPERTY",
        },
        connection: {
          nextActionId: 9,
          edgeType: "STANDARD",
          connectionType: "SINGLE",
        },
        actionType: "SET_PROPERTY",
        portalId: 9360603,
        flowId: 260913784,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
      22: {
        actionId: 22,
        metadata: {
          targetProperty: {
            propertyName: "connected_date",
            source: "OBJECT",
          },
          value: {
            type: "TIMESTAMP",
          },
          actionType: "SET_PROPERTY",
        },
        connection: {
          nextActionId: 23,
          edgeType: "STANDARD",
          connectionType: "SINGLE",
        },
        actionType: "SET_PROPERTY",
        portalId: 9360603,
        flowId: 260913784,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
      23: {
        actionId: 23,
        metadata: {
          targetProperty: {
            propertyName: "connect_rate",
            source: "OBJECT",
          },
          value: {
            type: "STATIC_VALUE",
            value: "Yes",
          },
          actionType: "SET_PROPERTY",
        },
        connection: {
          nextActionId: 15,
          edgeType: "STANDARD",
          connectionType: "SINGLE",
        },
        actionType: "SET_PROPERTY",
        portalId: 9360603,
        flowId: 260913784,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
    },
    classicEnrollmentSettings: null,
    associatedLists: [
      // {
      //   portalId: 9360603,
      //   listId: 3735,
      //   flowId: 260913784,
      //   filterBranch: {
      //     filterBranchOperator: "OR",
      //     filters: [],
      //     filterBranches: [
      //       {
      //         filterBranchOperator: "AND",
      //         filters: [
      //           {
      //             filterType: "PROPERTY",
      //             property: "lifecyclestage",
      //             operation: {
      //               propertyType: "enumeration",
      //               operator: "IS_ANY_OF",
      //               values: [
      //                 "opportunity",
      //                 "salesqualifiedlead",
      //                 "33086390",
      //                 "33089671",
      //                 "customer",
      //               ],
      //               defaultValue: null,
      //               includeObjectsWithNoValueSet: false,
      //               operationType: "enumeration",
      //               operatorName: "IS_ANY_OF",
      //             },
      //             frameworkFilterId: null,
      //           },
      //         ],
      //         filterBranches: [],
      //         filterBranchType: "AND",
      //       },
      //       {
      //         filterBranchOperator: "AND",
      //         filters: [],
      //         filterBranches: [
      //           {
      //             filterBranchOperator: "AND",
      //             filters: [
      //               {
      //                 filterType: "PROPERTY",
      //                 property: "hs_lead_status",
      //                 operation: {
      //                   propertyType: "enumeration",
      //                   operator: "IS_ANY_OF",
      //                   values: ["Open deal"],
      //                   defaultValue: null,
      //                   includeObjectsWithNoValueSet: false,
      //                   operationType: "enumeration",
      //                   operatorName: "IS_ANY_OF",
      //                 },
      //                 frameworkFilterId: null,
      //               },
      //             ],
      //             filterBranches: [],
      //             associationCategory: "HUBSPOT_DEFINED",
      //             associationTypeId: 280,
      //             objectType: "CONTACT",
      //             objectTypeId: "0-1",
      //             operator: "IN_LIST",
      //             coalescingRefineBy: {
      //               setType: "ANY",
      //               type: "SetOccurrencesRefineBy",
      //             },
      //             associationListId: 4327,
      //             filterBranchType: "ASSOCIATION",
      //           },
      //         ],
      //         filterBranchType: "AND",
      //       },
      //       {
      //         filterBranchOperator: "AND",
      //         filters: [
      //           {
      //             filterType: "PROPERTY",
      //             property: "num_associated_deals",
      //             operation: {
      //               propertyType: "alltypes",
      //               operator: "IS_KNOWN",
      //               pruningRefineBy: null,
      //               coalescingRefineBy: {
      //                 setType: "ANY",
      //                 type: "SetOccurrencesRefineBy",
      //               },
      //               defaultValue: null,
      //               includeObjectsWithNoValueSet: false,
      //               operationType: "alltypes",
      //               operatorName: "IS_KNOWN",
      //             },
      //             frameworkFilterId: null,
      //           },
      //         ],
      //         filterBranches: [
      //           {
      //             filterBranchOperator: "AND",
      //             filters: [
      //               {
      //                 filterType: "PROPERTY",
      //                 property: "createdate",
      //                 operation: {
      //                   propertyType: "alltypes",
      //                   operator: "IS_KNOWN",
      //                   pruningRefineBy: null,
      //                   coalescingRefineBy: {
      //                     setType: "ANY",
      //                     type: "SetOccurrencesRefineBy",
      //                   },
      //                   defaultValue: null,
      //                   includeObjectsWithNoValueSet: false,
      //                   operationType: "alltypes",
      //                   operatorName: "IS_KNOWN",
      //                 },
      //                 frameworkFilterId: null,
      //               },
      //             ],
      //             filterBranches: [],
      //             associationCategory: "HUBSPOT_DEFINED",
      //             associationTypeId: 342,
      //             objectType: "DEAL",
      //             objectTypeId: "0-3",
      //             operator: "IN_LIST",
      //             coalescingRefineBy: {
      //               setType: "ANY",
      //               type: "SetOccurrencesRefineBy",
      //             },
      //             associationListId: 4328,
      //             filterBranchType: "ASSOCIATION",
      //           },
      //         ],
      //         filterBranchType: "AND",
      //       },
      //     ],
      //     filterBranchType: "OR",
      //   },
      //   listTypes: ["ENROLLMENT_LIST"],
      // },
    ],
    flowEventFilters: [
      {
        updateType: null,
        eventFilterId: {
          id: 163309413,
          version: 0,
        },
        eventFilter: {
          eventTypeId: {
            metaType: "HUBSPOT_EVENT",
            innerId: 655002,
          },
          filter: {
            filterBranchOperator: "AND",
            filters: [
              {
                filterType: "PROPERTY",
                property: "hs_name",
                operation: {
                  propertyType: "string",
                  operator: "IS_EQUAL_TO",
                  value: "lifecyclestage",
                  defaultValue: null,
                  includeObjectsWithNoValueSet: false,
                  operationType: "string",
                  operatorName: "IS_EQUAL_TO",
                },
                frameworkFilterId: null,
              },
              {
                filterType: "PROPERTY",
                property: "hs_value",
                operation: {
                  propertyType: "enumeration",
                  operator: "IS_ANY_OF",
                  values: [
                    "opportunity",
                    "salesqualifiedlead",
                    "33086390",
                    "33089671",
                    "customer",
                  ],
                  defaultValue: null,
                  includeObjectsWithNoValueSet: false,
                  operationType: "enumeration",
                  operatorName: "IS_ANY_OF",
                },
                frameworkFilterId: null,
              },
            ],
            filterBranches: [],
            filterBranchType: "AND",
          },
          objectTypeId: null,
        },
        listId: 0,
        flowEventFilterType: "ANY_ENROLLMENT",
      },
      {
        updateType: null,
        eventFilterId: {
          id: 163309412,
          version: 0,
        },
        eventFilter: {
          eventTypeId: {
            metaType: "HUBSPOT_EVENT",
            innerId: 655002,
          },
          filter: {
            filterBranchOperator: "AND",
            filters: [
              {
                filterType: "PROPERTY",
                property: "hs_name",
                operation: {
                  propertyType: "string",
                  operator: "IS_EQUAL_TO",
                  value: "num_associated_deals",
                  defaultValue: null,
                  includeObjectsWithNoValueSet: false,
                  operationType: "string",
                  operatorName: "IS_EQUAL_TO",
                },
                frameworkFilterId: null,
              },
              {
                filterType: "PROPERTY",
                property: "hs_value",
                operation: {
                  propertyType: "alltypes",
                  operator: "IS_KNOWN",
                  pruningRefineBy: null,
                  coalescingRefineBy: {
                    setType: "ANY",
                    type: "SetOccurrencesRefineBy",
                  },
                  defaultValue: null,
                  includeObjectsWithNoValueSet: false,
                  operationType: "alltypes",
                  operatorName: "IS_KNOWN",
                },
                frameworkFilterId: null,
              },
            ],
            filterBranches: [],
            filterBranchType: "AND",
          },
          objectTypeId: null,
        },
        listId: 0,
        flowEventFilterType: "ANY_ENROLLMENT",
      },
    ],
    enrollmentCriteria: {
      triggerType: "LIST",
      filterBranch: {
        filterBranchOperator: "OR",
        filters: [],
        filterBranches: [
          {
            filterBranchOperator: "AND",
            filters: [
              {
                filterType: "PROPERTY",
                property: "lifecyclestage",
                operation: {
                  propertyType: "enumeration",
                  operator: "IS_ANY_OF",
                  values: [
                    "opportunity",
                    "salesqualifiedlead",
                    "33086390",
                    "33089671",
                    "customer",
                  ],
                  defaultValue: null,
                  includeObjectsWithNoValueSet: false,
                  operationType: "enumeration",
                  operatorName: "IS_ANY_OF",
                },
                frameworkFilterId: null,
              },
            ],
            filterBranches: [],
            filterBranchType: "AND",
          },
          {
            filterBranchOperator: "AND",
            filters: [],
            filterBranches: [
              {
                filterBranchOperator: "AND",
                filters: [
                  {
                    filterType: "PROPERTY",
                    property: "hs_lead_status",
                    operation: {
                      propertyType: "enumeration",
                      operator: "IS_ANY_OF",
                      values: ["Open deal"],
                      defaultValue: null,
                      includeObjectsWithNoValueSet: false,
                      operationType: "enumeration",
                      operatorName: "IS_ANY_OF",
                    },
                    frameworkFilterId: null,
                  },
                ],
                filterBranches: [],
                associationCategory: "HUBSPOT_DEFINED",
                associationTypeId: 280,
                objectType: "CONTACT",
                objectTypeId: "0-1",
                operator: "IN_LIST",
                coalescingRefineBy: {
                  setType: "ANY",
                  type: "SetOccurrencesRefineBy",
                },
                associationListId: 4327,
                filterBranchType: "ASSOCIATION",
              },
            ],
            filterBranchType: "AND",
          },
          {
            filterBranchOperator: "AND",
            filters: [
              {
                filterType: "PROPERTY",
                property: "num_associated_deals",
                operation: {
                  propertyType: "alltypes",
                  operator: "IS_KNOWN",
                  pruningRefineBy: null,
                  coalescingRefineBy: {
                    setType: "ANY",
                    type: "SetOccurrencesRefineBy",
                  },
                  defaultValue: null,
                  includeObjectsWithNoValueSet: false,
                  operationType: "alltypes",
                  operatorName: "IS_KNOWN",
                },
                frameworkFilterId: null,
              },
            ],
            filterBranches: [
              {
                filterBranchOperator: "AND",
                filters: [
                  {
                    filterType: "PROPERTY",
                    property: "createdate",
                    operation: {
                      propertyType: "alltypes",
                      operator: "IS_KNOWN",
                      pruningRefineBy: null,
                      coalescingRefineBy: {
                        setType: "ANY",
                        type: "SetOccurrencesRefineBy",
                      },
                      defaultValue: null,
                      includeObjectsWithNoValueSet: false,
                      operationType: "alltypes",
                      operatorName: "IS_KNOWN",
                    },
                    frameworkFilterId: null,
                  },
                ],
                filterBranches: [],
                associationCategory: "HUBSPOT_DEFINED",
                associationTypeId: 342,
                objectType: "DEAL",
                objectTypeId: "0-3",
                operator: "IN_LIST",
                coalescingRefineBy: {
                  setType: "ANY",
                  type: "SetOccurrencesRefineBy",
                },
                associationListId: 4328,
                filterBranchType: "ASSOCIATION",
              },
            ],
            filterBranchType: "AND",
          },
        ],
        filterBranchType: "OR",
      },
    },
    enrollmentTrigger: "LIST",
    folder: {
      name: "NX 03 - Metrics - 02 Company",
      createdUserId: 44738973,
      updatedUserId: 9534005,
      createdAt: 1662562730653,
      updatedAt: 1684186510197,
      frameworkFolderId: 184675362469,
      id: 1191664,
      portalId: 9360603,
      flowCount: 22,
    },
  },
  {
    isEnabled: false,
    uuid: "[02.06.  Lead status] Unqualified reason = known → Lead status = Unqualified-260914274",
    name: "[LEGACY] [02.06. Lead Status] Contact = Unqualified → Lead Status = Unqualified",
    firstActionId: 2,
    timeWindow: null,
    enrollmentSchedule: null,
    shouldReenroll: true,
    flowObjectType: "COMPANY",
    objectTypeId: "0-2",
    portalId: 9360603,
    flowId: 260914274,
    createMetadata: {
      updatedBy: {
        userId: 44593095,
        hubspotterId: null,
      },
      updatedAt: 1664492906235,
      referrer:
        "https://app.hubspot.com/workflows/9360603/view/default?sortBy=name&sortOrder=descending&name=02.05&pageSize=100",
      originRequestId: null,
      integrationId: null,
      jobName: null,
      internalJobUpdateTime: null,
      sourceApp: "WORKFLOWS_APP",
      cloneMetadata: {
        flowId: 260913784,
        version: 2,
      },
      templateMetadata: null,
    },
    updateMetadata: {
      updatedBy: {
        userId: 9534005,
        hubspotterId: null,
      },
      updatedAt: 1683143894679,
      referrer:
        "https://app.hubspot.com/workflows/9360603/platform/flow/260914274/edit",
      originRequestId: null,
      integrationId: null,
      jobName: null,
      internalJobUpdateTime: null,
      sourceApp: "WORKFLOWS_APP",
      cloneMetadata: null,
      templateMetadata: null,
    },
    isClassicWorkflow: false,
    nextAvailableActionId: 26,
    version: 43,
    actions: {
      1: {
        actionId: 1,
        metadata: {
          targetProperty: {
            propertyName: "hs_lead_status",
            source: "OBJECT",
          },
          value: {
            type: "STATIC_VALUE",
            value: "New",
          },
          actionType: "SET_PROPERTY",
        },
        connection: {
          nextActionId: 3,
          edgeType: "STANDARD",
          connectionType: "SINGLE",
        },
        actionType: "SET_PROPERTY",
        portalId: 9360603,
        flowId: 260914274,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
      2: {
        actionId: 2,
        metadata: {
          actionType: "LIST_BRANCH",
        },
        connection: {
          listBranches: [
            {
              listId: 3920,
              filterBranch: {
                filterBranchOperator: "OR",
                filters: [],
                filterBranches: [
                  {
                    filterBranchOperator: "AND",
                    filters: [
                      {
                        filterType: "PROPERTY",
                        property: "hs_lead_status",
                        operation: {
                          propertyType: "enumeration",
                          operator: "HAS_NEVER_BEEN_ANY_OF",
                          values: [
                            "New",
                            "Connected",
                            "Attempted to connect",
                            "Unqualified",
                            "Open deal",
                          ],
                          defaultValue: null,
                          includeObjectsWithNoValueSet: true,
                          operationType: "enumeration",
                          operatorName: "HAS_NEVER_BEEN_ANY_OF",
                        },
                        frameworkFilterId: null,
                      },
                    ],
                    filterBranches: [
                      {
                        filterBranchOperator: "AND",
                        filters: [
                          {
                            filterType: "PROPERTY",
                            property: "hs_lead_status",
                            operation: {
                              propertyType: "enumeration",
                              operator: "HAS_EVER_BEEN_ANY_OF",
                              values: ["New"],
                              defaultValue: null,
                              includeObjectsWithNoValueSet: false,
                              operationType: "enumeration",
                              operatorName: "HAS_EVER_BEEN_ANY_OF",
                            },
                            frameworkFilterId: null,
                          },
                        ],
                        filterBranches: [],
                        associationCategory: "HUBSPOT_DEFINED",
                        associationTypeId: 280,
                        objectType: "CONTACT",
                        objectTypeId: "0-1",
                        operator: "IN_LIST",
                        coalescingRefineBy: {
                          setType: "ANY",
                          type: "SetOccurrencesRefineBy",
                        },
                        associationListId: 3921,
                        filterBranchType: "ASSOCIATION",
                      },
                    ],
                    filterBranchType: "AND",
                  },
                ],
                filterBranchType: "OR",
              },
              connection: {
                nextActionId: 1,
                edgeType: "STANDARD",
                connectionType: "SINGLE",
              },
              branchName: "Reset New",
              nextActionId: 1,
            },
          ],
          defaultConnection: {
            nextActionId: 7,
            edgeType: "STANDARD",
            connectionType: "SINGLE",
          },
          defaultBranchName: "Check Attempt",
          defaultNextActionId: 7,
          connectionType: "LIST_BRANCH",
        },
        actionType: "LIST_BRANCH",
        portalId: 9360603,
        flowId: 260914274,
        flowVersion: 0,
        actionTypeId: "0-7",
      },
      3: {
        actionId: 3,
        metadata: {
          delay: {
            delta: 1,
            timeUnit: "MINUTES",
            timeOfDay: null,
            daysOfWeek: [],
            optionalTimeZoneStrategy: null,
          },
          actionType: "DELAY",
        },
        connection: {
          nextActionId: 7,
          edgeType: "GOTO",
          connectionType: "SINGLE",
        },
        actionType: "DELAY",
        portalId: 9360603,
        flowId: 260914274,
        flowVersion: 0,
        actionTypeId: "0-1",
      },
      7: {
        actionId: 7,
        metadata: {
          actionType: "LIST_BRANCH",
        },
        connection: {
          listBranches: [
            {
              listId: 3926,
              filterBranch: {
                filterBranchOperator: "OR",
                filters: [],
                filterBranches: [
                  {
                    filterBranchOperator: "AND",
                    filters: [
                      {
                        filterType: "PROPERTY",
                        property: "hs_lead_status",
                        operation: {
                          propertyType: "enumeration",
                          operator: "HAS_NEVER_BEEN_ANY_OF",
                          values: [
                            "Connected",
                            "Attempted to connect",
                            "Unqualified",
                            "Open deal",
                          ],
                          defaultValue: null,
                          includeObjectsWithNoValueSet: true,
                          operationType: "enumeration",
                          operatorName: "HAS_NEVER_BEEN_ANY_OF",
                        },
                        frameworkFilterId: null,
                      },
                    ],
                    filterBranches: [
                      {
                        filterBranchOperator: "AND",
                        filters: [
                          {
                            filterType: "PROPERTY",
                            property: "hs_lead_status",
                            operation: {
                              propertyType: "enumeration",
                              operator: "HAS_EVER_BEEN_ANY_OF",
                              values: ["Attempt to connect"],
                              defaultValue: null,
                              includeObjectsWithNoValueSet: false,
                              operationType: "enumeration",
                              operatorName: "HAS_EVER_BEEN_ANY_OF",
                            },
                            frameworkFilterId: null,
                          },
                        ],
                        filterBranches: [],
                        associationCategory: "HUBSPOT_DEFINED",
                        associationTypeId: 280,
                        objectType: "CONTACT",
                        objectTypeId: "0-1",
                        operator: "IN_LIST",
                        coalescingRefineBy: {
                          setType: "ANY",
                          type: "SetOccurrencesRefineBy",
                        },
                        associationListId: 3927,
                        filterBranchType: "ASSOCIATION",
                      },
                    ],
                    filterBranchType: "AND",
                  },
                ],
                filterBranchType: "OR",
              },
              connection: {
                nextActionId: 20,
                edgeType: "STANDARD",
                connectionType: "SINGLE",
              },
              branchName: "Reset Attempt",
              nextActionId: 20,
            },
          ],
          defaultConnection: {
            nextActionId: 13,
            edgeType: "STANDARD",
            connectionType: "SINGLE",
          },
          defaultBranchName: "Check Connected",
          defaultNextActionId: 13,
          connectionType: "LIST_BRANCH",
        },
        actionType: "LIST_BRANCH",
        portalId: 9360603,
        flowId: 260914274,
        flowVersion: 0,
        actionTypeId: "0-7",
      },
      8: {
        actionId: 8,
        metadata: {
          delay: {
            delta: 1,
            timeUnit: "MINUTES",
            timeOfDay: null,
            daysOfWeek: [],
            optionalTimeZoneStrategy: null,
          },
          actionType: "DELAY",
        },
        connection: {
          nextActionId: 13,
          edgeType: "GOTO",
          connectionType: "SINGLE",
        },
        actionType: "DELAY",
        portalId: 9360603,
        flowId: 260914274,
        flowVersion: 0,
        actionTypeId: "0-1",
      },
      9: {
        actionId: 9,
        metadata: {
          targetProperty: {
            propertyName: "hs_lead_status",
            source: "OBJECT",
          },
          value: {
            type: "STATIC_VALUE",
            value: "Attempted to connect",
          },
          actionType: "SET_PROPERTY",
        },
        connection: {
          nextActionId: 8,
          edgeType: "STANDARD",
          connectionType: "SINGLE",
        },
        actionType: "SET_PROPERTY",
        portalId: 9360603,
        flowId: 260914274,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
      13: {
        actionId: 13,
        metadata: {
          actionType: "LIST_BRANCH",
        },
        connection: {
          listBranches: [
            {
              listId: 3937,
              filterBranch: {
                filterBranchOperator: "OR",
                filters: [],
                filterBranches: [
                  {
                    filterBranchOperator: "AND",
                    filters: [
                      {
                        filterType: "PROPERTY",
                        property: "hs_lead_status",
                        operation: {
                          propertyType: "enumeration",
                          operator: "HAS_NEVER_BEEN_ANY_OF",
                          values: ["Connected", "Unqualified", "Open deal"],
                          defaultValue: null,
                          includeObjectsWithNoValueSet: true,
                          operationType: "enumeration",
                          operatorName: "HAS_NEVER_BEEN_ANY_OF",
                        },
                        frameworkFilterId: null,
                      },
                    ],
                    filterBranches: [
                      {
                        filterBranchOperator: "AND",
                        filters: [
                          {
                            filterType: "PROPERTY",
                            property: "hs_lead_status",
                            operation: {
                              propertyType: "enumeration",
                              operator: "HAS_EVER_BEEN_ANY_OF",
                              values: ["Connected"],
                              defaultValue: null,
                              includeObjectsWithNoValueSet: false,
                              operationType: "enumeration",
                              operatorName: "HAS_EVER_BEEN_ANY_OF",
                            },
                            frameworkFilterId: null,
                          },
                        ],
                        filterBranches: [],
                        associationCategory: "HUBSPOT_DEFINED",
                        associationTypeId: 280,
                        objectType: "CONTACT",
                        objectTypeId: "0-1",
                        operator: "IN_LIST",
                        coalescingRefineBy: {
                          setType: "ANY",
                          type: "SetOccurrencesRefineBy",
                        },
                        associationListId: 3938,
                        filterBranchType: "ASSOCIATION",
                      },
                    ],
                    filterBranchType: "AND",
                  },
                ],
                filterBranchType: "OR",
              },
              connection: {
                nextActionId: 22,
                edgeType: "STANDARD",
                connectionType: "SINGLE",
              },
              branchName: "Reset Connect",
              nextActionId: 22,
            },
          ],
          defaultConnection: {
            nextActionId: 24,
            edgeType: "STANDARD",
            connectionType: "SINGLE",
          },
          defaultBranchName: "Unqualified",
          defaultNextActionId: 24,
          connectionType: "LIST_BRANCH",
        },
        actionType: "LIST_BRANCH",
        portalId: 9360603,
        flowId: 260914274,
        flowVersion: 39,
        actionTypeId: "0-7",
      },
      15: {
        actionId: 15,
        metadata: {
          targetProperty: {
            propertyName: "hs_lead_status",
            source: "OBJECT",
          },
          value: {
            type: "STATIC_VALUE",
            value: "Connected",
          },
          actionType: "SET_PROPERTY",
        },
        connection: {
          nextActionId: 19,
          edgeType: "STANDARD",
          connectionType: "SINGLE",
        },
        actionType: "SET_PROPERTY",
        portalId: 9360603,
        flowId: 260914274,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
      16: {
        actionId: 16,
        metadata: {
          targetProperty: {
            propertyName: "hs_lead_status",
            source: "OBJECT",
          },
          value: {
            type: "STATIC_VALUE",
            value: "Unqualified",
          },
          actionType: "SET_PROPERTY",
        },
        connection: null,
        actionType: "SET_PROPERTY",
        portalId: 9360603,
        flowId: 260914274,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
      19: {
        actionId: 19,
        metadata: {
          delay: {
            delta: 1,
            timeUnit: "MINUTES",
            timeOfDay: null,
            daysOfWeek: [],
            optionalTimeZoneStrategy: null,
          },
          actionType: "DELAY",
        },
        connection: {
          nextActionId: 24,
          edgeType: "GOTO",
          connectionType: "SINGLE",
        },
        actionType: "DELAY",
        portalId: 9360603,
        flowId: 260914274,
        flowVersion: 0,
        actionTypeId: "0-1",
      },
      20: {
        actionId: 20,
        metadata: {
          targetProperty: {
            propertyName: "worked_date",
            source: "OBJECT",
          },
          value: {
            type: "TIMESTAMP",
          },
          actionType: "SET_PROPERTY",
        },
        connection: {
          nextActionId: 21,
          edgeType: "STANDARD",
          connectionType: "SINGLE",
        },
        actionType: "SET_PROPERTY",
        portalId: 9360603,
        flowId: 260914274,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
      21: {
        actionId: 21,
        metadata: {
          targetProperty: {
            propertyName: "work_rate",
            source: "OBJECT",
          },
          value: {
            type: "STATIC_VALUE",
            value: "Yes",
          },
          actionType: "SET_PROPERTY",
        },
        connection: {
          nextActionId: 9,
          edgeType: "STANDARD",
          connectionType: "SINGLE",
        },
        actionType: "SET_PROPERTY",
        portalId: 9360603,
        flowId: 260914274,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
      22: {
        actionId: 22,
        metadata: {
          targetProperty: {
            propertyName: "connected_date",
            source: "OBJECT",
          },
          value: {
            type: "TIMESTAMP",
          },
          actionType: "SET_PROPERTY",
        },
        connection: {
          nextActionId: 23,
          edgeType: "STANDARD",
          connectionType: "SINGLE",
        },
        actionType: "SET_PROPERTY",
        portalId: 9360603,
        flowId: 260914274,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
      23: {
        actionId: 23,
        metadata: {
          targetProperty: {
            propertyName: "connect_rate",
            source: "OBJECT",
          },
          value: {
            type: "STATIC_VALUE",
            value: "Yes",
          },
          actionType: "SET_PROPERTY",
        },
        connection: {
          nextActionId: 15,
          edgeType: "STANDARD",
          connectionType: "SINGLE",
        },
        actionType: "SET_PROPERTY",
        portalId: 9360603,
        flowId: 260914274,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
      24: {
        actionId: 24,
        metadata: {
          targetProperty: {
            propertyName: "unqualified_date",
            source: "OBJECT",
          },
          value: {
            type: "TIMESTAMP",
          },
          actionType: "SET_PROPERTY",
        },
        connection: {
          nextActionId: 25,
          edgeType: "STANDARD",
          connectionType: "SINGLE",
        },
        actionType: "SET_PROPERTY",
        portalId: 9360603,
        flowId: 260914274,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
      25: {
        actionId: 25,
        metadata: {
          targetProperty: {
            propertyName: "unqualified_rate",
            source: "OBJECT",
          },
          value: {
            type: "STATIC_VALUE",
            value: "Yes",
          },
          actionType: "SET_PROPERTY",
        },
        connection: {
          nextActionId: 16,
          edgeType: "STANDARD",
          connectionType: "SINGLE",
        },
        actionType: "SET_PROPERTY",
        portalId: 9360603,
        flowId: 260914274,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
    },
    classicEnrollmentSettings: null,
    associatedLists: [
      // {
      //   portalId: 9360603,
      //   listId: 3759,
      //   flowId: 260914274,
      //   filterBranch: {
      //     filterBranchOperator: "OR",
      //     filters: [],
      //     filterBranches: [
      //       {
      //         filterBranchOperator: "AND",
      //         filters: [
      //           {
      //             filterType: "PROPERTY",
      //             property: "lifecyclestage",
      //             operation: {
      //               propertyType: "enumeration",
      //               operator: "IS_NONE_OF",
      //               values: ["33086390", "33089671", "customer"],
      //               defaultValue: null,
      //               includeObjectsWithNoValueSet: false,
      //               operationType: "enumeration",
      //               operatorName: "IS_NONE_OF",
      //             },
      //             frameworkFilterId: null,
      //           },
      //         ],
      //         filterBranches: [
      //           {
      //             filterBranchOperator: "AND",
      //             filters: [
      //               {
      //                 filterType: "PROPERTY",
      //                 property: "dealstage",
      //                 operation: {
      //                   propertyType: "enumeration",
      //                   operator: "IS_ANY_OF",
      //                   values: ["30560594"],
      //                   defaultValue: null,
      //                   includeObjectsWithNoValueSet: false,
      //                   operationType: "enumeration",
      //                   operatorName: "IS_ANY_OF",
      //                 },
      //                 frameworkFilterId: null,
      //               },
      //             ],
      //             filterBranches: [],
      //             associationCategory: "HUBSPOT_DEFINED",
      //             associationTypeId: 342,
      //             objectType: "DEAL",
      //             objectTypeId: "0-3",
      //             operator: "IN_LIST",
      //             coalescingRefineBy: {
      //               setType: "ANY",
      //               type: "SetOccurrencesRefineBy",
      //             },
      //             associationListId: 4742,
      //             filterBranchType: "ASSOCIATION",
      //           },
      //         ],
      //         filterBranchType: "AND",
      //       },
      //       {
      //         filterBranchOperator: "AND",
      //         filters: [
      //           {
      //             filterType: "PROPERTY",
      //             property: "unqualified_reason",
      //             operation: {
      //               propertyType: "alltypes",
      //               operator: "IS_KNOWN",
      //               pruningRefineBy: null,
      //               coalescingRefineBy: {
      //                 setType: "ANY",
      //                 type: "SetOccurrencesRefineBy",
      //               },
      //               defaultValue: null,
      //               includeObjectsWithNoValueSet: false,
      //               operationType: "alltypes",
      //               operatorName: "IS_KNOWN",
      //             },
      //             frameworkFilterId: null,
      //           },
      //         ],
      //         filterBranches: [],
      //         filterBranchType: "AND",
      //       },
      //       {
      //         filterBranchOperator: "AND",
      //         filters: [
      //           {
      //             filterType: "PROPERTY",
      //             property: "lifecyclestage",
      //             operation: {
      //               propertyType: "enumeration",
      //               operator: "IS_ANY_OF",
      //               values: ["evangelist"],
      //               defaultValue: null,
      //               includeObjectsWithNoValueSet: false,
      //               operationType: "enumeration",
      //               operatorName: "IS_ANY_OF",
      //             },
      //             frameworkFilterId: null,
      //           },
      //         ],
      //         filterBranches: [],
      //         filterBranchType: "AND",
      //       },
      //     ],
      //     filterBranchType: "OR",
      //   },
      //   listTypes: ["ENROLLMENT_LIST"],
      // },
      // {
      //   portalId: 9360603,
      //   listId: 4809,
      //   flowId: 260914274,
      //   filterBranch: {
      //     filterBranchOperator: "AND",
      //     filters: [
      //       {
      //         filterType: "PROPERTY",
      //         property: "lifecyclestage",
      //         operation: {
      //           propertyType: "enumeration",
      //           operator: "IS_ANY_OF",
      //           values: ["evangelist"],
      //           defaultValue: null,
      //           includeObjectsWithNoValueSet: false,
      //           operationType: "enumeration",
      //           operatorName: "IS_ANY_OF",
      //         },
      //         frameworkFilterId: null,
      //       },
      //     ],
      //     filterBranches: [],
      //     filterBranchType: "AND",
      //   },
      //   listTypes: ["RE_ENROLLMENT_LIST"],
      // },
    ],
    flowEventFilters: [
      {
        updateType: null,
        eventFilterId: {
          id: 103016119,
          version: 0,
        },
        eventFilter: {
          eventTypeId: {
            metaType: "HUBSPOT_EVENT",
            innerId: 655002,
          },
          filter: {
            filterBranchOperator: "AND",
            filters: [
              {
                filterType: "PROPERTY",
                property: "hs_name",
                operation: {
                  propertyType: "string",
                  operator: "IS_EQUAL_TO",
                  value: "lifecyclestage",
                  defaultValue: null,
                  includeObjectsWithNoValueSet: false,
                  operationType: "string",
                  operatorName: "IS_EQUAL_TO",
                },
                frameworkFilterId: null,
              },
              {
                filterType: "PROPERTY",
                property: "hs_value",
                operation: {
                  propertyType: "enumeration",
                  operator: "IS_ANY_OF",
                  values: ["evangelist"],
                  defaultValue: null,
                  includeObjectsWithNoValueSet: false,
                  operationType: "enumeration",
                  operatorName: "IS_ANY_OF",
                },
                frameworkFilterId: null,
              },
            ],
            filterBranches: [],
            filterBranchType: "AND",
          },
          objectTypeId: null,
        },
        listId: 4809,
        flowEventFilterType: "ANY_ENROLLMENT",
      },
    ],
    enrollmentCriteria: {
      triggerType: "LIST",
      filterBranch: {
        filterBranchOperator: "OR",
        filters: [],
        filterBranches: [
          {
            filterBranchOperator: "AND",
            filters: [
              {
                filterType: "PROPERTY",
                property: "lifecyclestage",
                operation: {
                  propertyType: "enumeration",
                  operator: "IS_NONE_OF",
                  values: ["33086390", "33089671", "customer"],
                  defaultValue: null,
                  includeObjectsWithNoValueSet: false,
                  operationType: "enumeration",
                  operatorName: "IS_NONE_OF",
                },
                frameworkFilterId: null,
              },
            ],
            filterBranches: [
              {
                filterBranchOperator: "AND",
                filters: [
                  {
                    filterType: "PROPERTY",
                    property: "dealstage",
                    operation: {
                      propertyType: "enumeration",
                      operator: "IS_ANY_OF",
                      values: ["30560594"],
                      defaultValue: null,
                      includeObjectsWithNoValueSet: false,
                      operationType: "enumeration",
                      operatorName: "IS_ANY_OF",
                    },
                    frameworkFilterId: null,
                  },
                ],
                filterBranches: [],
                associationCategory: "HUBSPOT_DEFINED",
                associationTypeId: 342,
                objectType: "DEAL",
                objectTypeId: "0-3",
                operator: "IN_LIST",
                coalescingRefineBy: {
                  setType: "ANY",
                  type: "SetOccurrencesRefineBy",
                },
                associationListId: 4742,
                filterBranchType: "ASSOCIATION",
              },
            ],
            filterBranchType: "AND",
          },
          {
            filterBranchOperator: "AND",
            filters: [
              {
                filterType: "PROPERTY",
                property: "unqualified_reason",
                operation: {
                  propertyType: "alltypes",
                  operator: "IS_KNOWN",
                  pruningRefineBy: null,
                  coalescingRefineBy: {
                    setType: "ANY",
                    type: "SetOccurrencesRefineBy",
                  },
                  defaultValue: null,
                  includeObjectsWithNoValueSet: false,
                  operationType: "alltypes",
                  operatorName: "IS_KNOWN",
                },
                frameworkFilterId: null,
              },
            ],
            filterBranches: [],
            filterBranchType: "AND",
          },
          {
            filterBranchOperator: "AND",
            filters: [
              {
                filterType: "PROPERTY",
                property: "lifecyclestage",
                operation: {
                  propertyType: "enumeration",
                  operator: "IS_ANY_OF",
                  values: ["evangelist"],
                  defaultValue: null,
                  includeObjectsWithNoValueSet: false,
                  operationType: "enumeration",
                  operatorName: "IS_ANY_OF",
                },
                frameworkFilterId: null,
              },
            ],
            filterBranches: [],
            filterBranchType: "AND",
          },
        ],
        filterBranchType: "OR",
      },
    },
    enrollmentTrigger: "LIST",
    folder: {
      name: "NX 03 - Metrics - 02 Company",
      createdUserId: 44738973,
      updatedUserId: 9534005,
      createdAt: 1662562730653,
      updatedAt: 1684186510197,
      frameworkFolderId: 184675362469,
      id: 1191664,
      portalId: 9360603,
      flowCount: 22,
    },
  },
];

// Obs.: comentei as partes dos requests acima que davam erro por conta das dependências circulares e outros erros

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
};

const portalId = document.querySelector(".navAccount-portalId").innerHTML;
const token = getCookie("csrf.app");

const createWorkflow = async (payload) => {
  const response = await fetch(
    `https://app.hubspot.com/api/automationplatform/v1/hybrid/create?sourceapp=WORKFLOWS_APP&portalId=${portalId}&clienttimeout=14000&hs_static_app=automation-ui-creation&hs_static_app_version=1.22797`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: `hubspotapi-csrf=${token}`,
        "x-hubspot-csrf-hubspotapi": token,
      },
      body: JSON.stringify(payload),
    }
  );

  const body = JSON.parse(await response.text());

  if (body?.message?.startsWith("Failed to create or updateMetadata flow."))
    return `👻 ${payload.name}: Workflow já existe`;

  const { flowId } = body;

  if (!flowId) {
    const error = body?.message?.startsWith("Couldn't find a Property")
      ? body.message
      : body?.errors?.[0] === "GENERIC_EXCEPTION" &&
        body?.errors?.[1].startsWith("Unable to find some properties")
      ? body.errors[1]
      : JSON.stringify(body, null, 2);

    return `❗️ ${payload.name}: Erro ao criar workflow. Mensagem de erro abaixo\n\n${error}`;
  }

  return `✅ ${payload.name}: Workflow criado com sucesso`;
};

const func = async () => {
  const messages = await Promise.all(wflPayloads.map(createWorkflow));

  for (const message of messages) console.log(message);
};

func();
