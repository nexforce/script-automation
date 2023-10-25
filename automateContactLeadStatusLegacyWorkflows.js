const wflPayloads = [
  {
    isEnabled: false,
    uuid: "[02.01. Contact Lead Status] Lifecycle stage = Other → Lead status = Other -255370159",
    name: "[LEGACY] [02.01. Lead Status] Lifecycle = Other → Lead Status = Other ",
    firstActionId: 6,
    timeWindow: null,
    enrollmentSchedule: null,
    shouldReenroll: true,
    flowObjectType: "CONTACT",
    objectTypeId: "0-1",
    portalId: 9360603,
    flowId: 255370159,
    createMetadata: {
      updatedBy: {
        userId: 44593095,
        hubspotterId: null,
      },
      updatedAt: 1663361887013,
      referrer:
        "https://app.hubspot.com/workflows/9360603/view/deleted?name=lead%20status&sortBy=name&sortOrder=ascending",
      originRequestId: null,
      integrationId: null,
      jobName: null,
      internalJobUpdateTime: null,
      sourceApp: "WORKFLOWS_APP",
      cloneMetadata: {
        flowId: 251953479,
        version: 23,
      },
      templateMetadata: null,
    },
    updateMetadata: {
      updatedBy: {
        userId: 9534005,
        hubspotterId: null,
      },
      updatedAt: 1683140588482,
      referrer:
        "https://app.hubspot.com/workflows/9360603/platform/flow/255370159/edit",
      originRequestId: null,
      integrationId: null,
      jobName: null,
      internalJobUpdateTime: null,
      sourceApp: "WORKFLOWS_APP",
      cloneMetadata: null,
      templateMetadata: null,
    },
    isClassicWorkflow: true,
    nextAvailableActionId: 23,
    version: 98,
    actions: {
      6: {
        actionId: 6,
        metadata: {
          actionType: "LIST_BRANCH",
        },
        connection: {
          listBranches: [
            {
              listId: 7389,
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
                          values: ["30776145"],
                          defaultValue: null,
                          includeObjectsWithNoValueSet: false,
                          operatorName: "IS_ANY_OF",
                          operationType: "enumeration",
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
              connection: {
                nextActionId: 14,
                edgeType: "GOTO",
                connectionType: "SINGLE",
              },
              branchName: "Already set",
              nextActionId: 14,
            },
          ],
          defaultConnection: {
            nextActionId: 7,
            edgeType: "STANDARD",
            connectionType: "SINGLE",
          },
          defaultBranchName: "Wait until set",
          defaultNextActionId: 7,
          connectionType: "LIST_BRANCH",
        },
        actionType: "LIST_BRANCH",
        portalId: 9360603,
        flowId: 255370159,
        flowVersion: 0,
        actionTypeId: "0-7",
      },
      7: {
        actionId: 7,
        metadata: {
          targetObjectOverride: null,
          eventFilters: [
            {
              updateType: "CREATE",
              eventFilterId: {
                id: 97871362,
                version: 6,
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
                        operatorName: "IS_EQUAL_TO",
                        operationType: "string",
                      },
                      frameworkFilterId: null,
                    },
                    {
                      filterType: "PROPERTY",
                      property: "hs_value",
                      operation: {
                        propertyType: "enumeration",
                        operator: "IS_ANY_OF",
                        values: ["30776145"],
                        defaultValue: null,
                        includeObjectsWithNoValueSet: false,
                        operatorName: "IS_ANY_OF",
                        operationType: "enumeration",
                      },
                      frameworkFilterId: null,
                    },
                  ],
                  filterBranches: [],
                  filterBranchType: "AND",
                },
                objectTypeId: null,
              },
              listId: null,
            },
          ],
          expiration: {
            delta: 60,
            timeUnit: "MINUTES",
            timeOfDay: null,
            daysOfWeek: [],
            optionalTimeZoneStrategy: null,
          },
          actionType: "WAIT_UNTIL",
        },
        connection: {
          nextActionId: 14,
          edgeType: "STANDARD",
          connectionType: "SINGLE",
        },
        actionType: "WAIT_UNTIL",
        portalId: 9360603,
        flowId: 255370159,
        flowVersion: 0,
        actionTypeId: "0-29",
      },
      14: {
        actionId: 14,
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
        flowId: 255370159,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
    },
    classicEnrollmentSettings: {
      eventAnchor: null,
      recurAnnually: false,
      reEnrollmentTriggerSets: [],
      enrollOnCriteriaUpdate: false,
      listening: false,
      suppressionListIds: [],
      unenrollmentSetting: {
        excludedWorkflows: [],
      },
      internalStartingListId: 1755,
      internalGoalListId: 1756,
      allowContactToTriggerMultipleTimes: true,
      segmentCriteria: [
        [
          {
            property: "createdate",
            type: "datetime",
            filterFamily: "PropertyValue",
            withinTimeMode: "PAST",
            operator: "IS_NOT_EMPTY",
          },
        ],
      ],
      goalCriteria: [
        [
          {
            property: "hs_lead_status",
            value: "Attempt to connect;Open deal;Connected;Unqualified;New",
            type: "enumeration",
            filterFamily: "PropertyValue",
            withinTimeMode: "PAST",
            operator: "SET_ANY",
          },
        ],
        // [
        //   {
        //     list: 1736,
        //     filterFamily: "Workflow",
        //     dynamicList: false,
        //     withinTimeMode: "PAST",
        //     workflowId: 36959872,
        //     operator: "ACTIVE_IN_WORKFLOW",
        //   },
        // ],
        // [
        //   {
        //     list: 1722,
        //     filterFamily: "Workflow",
        //     dynamicList: false,
        //     withinTimeMode: "PAST",
        //     workflowId: 36959864,
        //     operator: "ACTIVE_IN_WORKFLOW",
        //   },
        // ],
        // [
        //   {
        //     list: 1729,
        //     filterFamily: "Workflow",
        //     dynamicList: false,
        //     withinTimeMode: "PAST",
        //     workflowId: 36959870,
        //     operator: "ACTIVE_IN_WORKFLOW",
        //   },
        // ],
        // [
        //   {
        //     list: 2334,
        //     filterFamily: "Workflow",
        //     dynamicList: false,
        //     withinTimeMode: "PAST",
        //     workflowId: 37299714,
        //     operator: "ACTIVE_IN_WORKFLOW",
        //   },
        // ],
      ],
      enrollmentFilters: [
        {
          ands: [
            {
              property: "createdate",
              operator: "IS_NOT_EMPTY",
              type: "datetime",
              withinLastTimeMode: "PAST",
              filterFamily: "PropertyValue",
            },
          ],
        },
      ],
      goalFilters: [
        {
          ands: [
            {
              property: "hs_lead_status",
              operator: "SET_ANY",
              type: "enumeration",
              strValue:
                "Attempt to connect;Open deal;Connected;Unqualified;New",
              withinLastTimeMode: "PAST",
              filterFamily: "PropertyValue",
            },
          ],
        },
        // {
        //   ands: [
        //     {
        //       operator: "ACTIVE_IN_WORKFLOW",
        //       listId: 1736,
        //       withinLastTimeMode: "PAST",
        //       dynamicList: false,
        //       workflowId: 36959872,
        //       filterFamily: "Workflow",
        //     },
        //   ],
        // },
        // {
        //   ands: [
        //     {
        //       operator: "ACTIVE_IN_WORKFLOW",
        //       listId: 1722,
        //       withinLastTimeMode: "PAST",
        //       dynamicList: false,
        //       workflowId: 36959864,
        //       filterFamily: "Workflow",
        //     },
        //   ],
        // },
        // {
        //   ands: [
        //     {
        //       operator: "ACTIVE_IN_WORKFLOW",
        //       listId: 1729,
        //       withinLastTimeMode: "PAST",
        //       dynamicList: false,
        //       workflowId: 36959870,
        //       filterFamily: "Workflow",
        //     },
        //   ],
        // },
        // {
        //   ands: [
        //     {
        //       operator: "ACTIVE_IN_WORKFLOW",
        //       listId: 2334,
        //       withinLastTimeMode: "PAST",
        //       dynamicList: false,
        //       workflowId: 37299714,
        //       filterFamily: "Workflow",
        //     },
        //   ],
        // },
      ],
      allowEnrollmentFromMerge: false,
      canEnrollFromSalesforce: false,
      workflowId: 36959897,
    },
    associatedLists: [
      // {
      //   portalId: 9360603,
      //   listId: 2247,
      //   flowId: 255370159,
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
      //                 "Attempt to connect",
      //                 "Unqualified",
      //                 "Open deal",
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
      //             listId: 2221,
      //             operator: "IN_LIST",
      //             metadata: {
      //               inListType: "WORKFLOWS_ACTIVE",
      //               id: "36959872",
      //             },
      //             frameworkFilterId: null,
      //             filterType: "IN_LIST",
      //           },
      //         ],
      //         filterBranches: [],
      //         filterBranchType: "AND",
      //       },
      //       {
      //         filterBranchOperator: "AND",
      //         filters: [
      //           {
      //             listId: 2205,
      //             operator: "IN_LIST",
      //             metadata: {
      //               inListType: "WORKFLOWS_ACTIVE",
      //               id: "36959864",
      //             },
      //             frameworkFilterId: null,
      //             filterType: "IN_LIST",
      //           },
      //         ],
      //         filterBranches: [],
      //         filterBranchType: "AND",
      //       },
      //       {
      //         filterBranchOperator: "AND",
      //         filters: [
      //           {
      //             listId: 2214,
      //             operator: "IN_LIST",
      //             metadata: {
      //               inListType: "WORKFLOWS_ACTIVE",
      //               id: "36959870",
      //             },
      //             frameworkFilterId: null,
      //             filterType: "IN_LIST",
      //           },
      //         ],
      //         filterBranches: [],
      //         filterBranchType: "AND",
      //       },
      //       {
      //         filterBranchOperator: "AND",
      //         filters: [
      //           {
      //             listId: 3949,
      //             operator: "IN_LIST",
      //             metadata: {
      //               inListType: "WORKFLOWS_ACTIVE",
      //               id: "37299714",
      //             },
      //             frameworkFilterId: null,
      //             filterType: "IN_LIST",
      //           },
      //         ],
      //         filterBranches: [],
      //         filterBranchType: "AND",
      //       },
      //     ],
      //     filterBranchType: "OR",
      //   },
      //   listTypes: ["CLASSIC_GOAL_LIST"],
      // },
      // {
      //   portalId: 9360603,
      //   listId: 2246,
      //   flowId: 255370159,
      //   filterBranch: {
      //     filterBranchOperator: "OR",
      //     filters: [],
      //     filterBranches: [
      //       {
      //         filterBranchOperator: "AND",
      //         filters: [
      //           {
      //             filterType: "PROPERTY",
      //             property: "createdate",
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
      //     ],
      //     filterBranchType: "OR",
      //   },
      //   listTypes: ["ENROLLMENT_LIST"],
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
                  operatorName: "IS_KNOWN",
                  operationType: "alltypes",
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
  },
  {
    isEnabled: false,
    uuid: "[02.02. Contact Lead Status] Lifecycle stage = Lead OR MQL → Lead status = New-264450485",
    name: "[LEGACY] [02.02. Lead Status] Lifecycle = Lead OR MQL → Lead Status = New",
    firstActionId: 16,
    timeWindow: null,
    enrollmentSchedule: null,
    shouldReenroll: true,
    flowObjectType: "CONTACT",
    objectTypeId: "0-1",
    portalId: 9360603,
    flowId: 264450485,
    createMetadata: {
      updatedBy: {
        userId: 44593095,
        hubspotterId: null,
      },
      updatedAt: 1665148956332,
      referrer:
        "https://app.hubspot.com/workflows/9360603/view/default?pageSize=100&sortBy=name&sortOrder=descending&folderId=1191659",
      originRequestId: null,
      integrationId: null,
      jobName: null,
      internalJobUpdateTime: null,
      sourceApp: "WORKFLOWS_APP",
      cloneMetadata: {
        flowId: 255370159,
        version: 59,
      },
      templateMetadata: null,
    },
    updateMetadata: {
      updatedBy: {
        userId: 9534005,
        hubspotterId: null,
      },
      updatedAt: 1683140602458,
      referrer:
        "https://app.hubspot.com/workflows/9360603/platform/flow/264450485/edit",
      originRequestId: null,
      integrationId: null,
      jobName: null,
      internalJobUpdateTime: null,
      sourceApp: "WORKFLOWS_APP",
      cloneMetadata: null,
      templateMetadata: null,
    },
    isClassicWorkflow: true,
    nextAvailableActionId: 20,
    version: 33,
    actions: {
      15: {
        actionId: 15,
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
        flowId: 264450485,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
      16: {
        actionId: 16,
        metadata: {
          actionType: "LIST_BRANCH",
        },
        connection: {
          listBranches: [
            {
              listId: 6669,
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
                ],
                filterBranchType: "OR",
              },
              connection: {
                nextActionId: 15,
                edgeType: "GOTO",
                connectionType: "SINGLE",
              },
              branchName: "Already set",
              nextActionId: 15,
            },
          ],
          defaultConnection: {
            nextActionId: 17,
            edgeType: "STANDARD",
            connectionType: "SINGLE",
          },
          defaultBranchName: "Delay until is set",
          defaultNextActionId: 17,
          connectionType: "LIST_BRANCH",
        },
        actionType: "LIST_BRANCH",
        portalId: 9360603,
        flowId: 264450485,
        flowVersion: 0,
        actionTypeId: "0-7",
      },
      17: {
        actionId: 17,
        metadata: {
          targetObjectOverride: null,
          eventFilters: [
            {
              updateType: "CREATE",
              eventFilterId: {
                id: 100186342,
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
                objectTypeId: null,
              },
              listId: null,
            },
          ],
          expiration: {
            delta: 30,
            timeUnit: "MINUTES",
            timeOfDay: null,
            daysOfWeek: [],
            optionalTimeZoneStrategy: null,
          },
          actionType: "WAIT_UNTIL",
        },
        connection: {
          nextActionId: 19,
          edgeType: "STANDARD",
          connectionType: "SINGLE",
        },
        actionType: "WAIT_UNTIL",
        portalId: 9360603,
        flowId: 264450485,
        flowVersion: 28,
        actionTypeId: "0-29",
      },
      19: {
        actionId: 19,
        metadata: {
          actionType: "LIST_BRANCH",
        },
        connection: {
          listBranches: [
            {
              listId: 8534,
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
                ],
                filterBranchType: "OR",
              },
              connection: {
                nextActionId: 15,
                edgeType: "STANDARD",
                connectionType: "SINGLE",
              },
              branchName: "Set as New",
              nextActionId: 15,
            },
          ],
          defaultConnection: null,
          defaultBranchName: null,
          defaultNextActionId: null,
          connectionType: "LIST_BRANCH",
        },
        actionType: "LIST_BRANCH",
        portalId: 9360603,
        flowId: 264450485,
        flowVersion: 26,
        actionTypeId: "0-7",
      },
    },
    classicEnrollmentSettings: {
      eventAnchor: null,
      recurAnnually: false,
      reEnrollmentTriggerSets: [
        [
          {
            id: "lifecyclestage",
            type: "CONTACT_PROPERTY_NAME",
          },
        ],
      ],
      enrollOnCriteriaUpdate: false,
      listening: false,
      suppressionListIds: [],
      unenrollmentSetting: {
        type: "NONE",
        excludedWorkflows: [],
      },
      internalStartingListId: 2694,
      internalGoalListId: 2695,
      allowContactToTriggerMultipleTimes: true,
      segmentCriteria: [
        [
          {
            property: "createdate",
            type: "datetime",
            filterFamily: "PropertyValue",
            withinTimeMode: "PAST",
            operator: "IS_NOT_EMPTY",
          },
        ],
        [
          {
            property: "lifecyclestage",
            value: "lead;marketingqualifiedlead",
            type: "enumeration",
            filterFamily: "PropertyValue",
            withinTimeMode: "PAST",
            operator: "SET_ANY",
          },
          {
            property: "lifecyclestage",
            type: "enumeration",
            filterFamily: "PropertyValue",
            withinTimeMode: "PAST",
            operator: "IS_NOT_EMPTY",
          },
        ],
      ],
      goalCriteria: [
        [
          {
            property: "hs_lead_status",
            value: "Attempt to connect;Open deal;Connected;Unqualified",
            type: "enumeration",
            filterFamily: "PropertyValue",
            withinTimeMode: "PAST",
            operator: "SET_ANY",
          },
        ],
        // [
        //   {
        //     dynamicList: false,
        //     filterFamily: "Workflow",
        //     withinTimeMode: "PAST",
        //     list: 1736,
        //     operator: "ACTIVE_IN_WORKFLOW",
        //     workflowId: 36959872,
        //   },
        // ],
        // [
        //   {
        //     dynamicList: false,
        //     filterFamily: "Workflow",
        //     withinTimeMode: "PAST",
        //     list: 1722,
        //     operator: "ACTIVE_IN_WORKFLOW",
        //     workflowId: 36959864,
        //   },
        // ],
        // [
        //   {
        //     dynamicList: false,
        //     filterFamily: "Workflow",
        //     withinTimeMode: "PAST",
        //     list: 1729,
        //     operator: "ACTIVE_IN_WORKFLOW",
        //     workflowId: 36959870,
        //   },
        // ],
        // [
        //   {
        //     dynamicList: false,
        //     filterFamily: "Workflow",
        //     withinTimeMode: "PAST",
        //     list: 2334,
        //     operator: "ACTIVE_IN_WORKFLOW",
        //     workflowId: 37299714,
        //   },
        // ],
      ],
      enrollmentFilters: [
        {
          ands: [
            {
              property: "createdate",
              operator: "IS_NOT_EMPTY",
              type: "datetime",
              withinLastTimeMode: "PAST",
              filterFamily: "PropertyValue",
            },
          ],
        },
        {
          ands: [
            {
              property: "lifecyclestage",
              operator: "SET_ANY",
              type: "enumeration",
              strValue: "lead;marketingqualifiedlead",
              withinLastTimeMode: "PAST",
              filterFamily: "PropertyValue",
            },
            {
              property: "lifecyclestage",
              operator: "IS_NOT_EMPTY",
              type: "enumeration",
              withinLastTimeMode: "PAST",
              filterFamily: "PropertyValue",
            },
          ],
        },
      ],
      goalFilters: [
        {
          ands: [
            {
              property: "hs_lead_status",
              operator: "SET_ANY",
              type: "enumeration",
              strValue: "Attempt to connect;Open deal;Connected;Unqualified",
              withinLastTimeMode: "PAST",
              filterFamily: "PropertyValue",
            },
          ],
        },
        // {
        //   ands: [
        //     {
        //       operator: "ACTIVE_IN_WORKFLOW",
        //       listId: 1736,
        //       withinLastTimeMode: "PAST",
        //       dynamicList: false,
        //       workflowId: 36959872,
        //       filterFamily: "Workflow",
        //     },
        //   ],
        // },
        // {
        //   ands: [
        //     {
        //       operator: "ACTIVE_IN_WORKFLOW",
        //       listId: 1722,
        //       withinLastTimeMode: "PAST",
        //       dynamicList: false,
        //       workflowId: 36959864,
        //       filterFamily: "Workflow",
        //     },
        //   ],
        // },
        // {
        //   ands: [
        //     {
        //       operator: "ACTIVE_IN_WORKFLOW",
        //       listId: 1729,
        //       withinLastTimeMode: "PAST",
        //       dynamicList: false,
        //       workflowId: 36959870,
        //       filterFamily: "Workflow",
        //     },
        //   ],
        // },
        // {
        //   ands: [
        //     {
        //       operator: "ACTIVE_IN_WORKFLOW",
        //       listId: 2334,
        //       withinLastTimeMode: "PAST",
        //       dynamicList: false,
        //       workflowId: 37299714,
        //       filterFamily: "Workflow",
        //     },
        //   ],
        // },
      ],
      allowEnrollmentFromMerge: false,
      canEnrollFromSalesforce: false,
      workflowId: 37471201,
    },
    associatedLists: [
      // {
      //   portalId: 9360603,
      //   listId: 4654,
      //   flowId: 264450485,
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
      //                 "Attempt to connect",
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
      //         filters: [
      //           {
      //             listId: 2221,
      //             operator: "IN_LIST",
      //             metadata: {
      //               inListType: "WORKFLOWS_ACTIVE",
      //               id: "36959872",
      //             },
      //             frameworkFilterId: null,
      //             filterType: "IN_LIST",
      //           },
      //         ],
      //         filterBranches: [],
      //         filterBranchType: "AND",
      //       },
      //       {
      //         filterBranchOperator: "AND",
      //         filters: [
      //           {
      //             listId: 2205,
      //             operator: "IN_LIST",
      //             metadata: {
      //               inListType: "WORKFLOWS_ACTIVE",
      //               id: "36959864",
      //             },
      //             frameworkFilterId: null,
      //             filterType: "IN_LIST",
      //           },
      //         ],
      //         filterBranches: [],
      //         filterBranchType: "AND",
      //       },
      //       {
      //         filterBranchOperator: "AND",
      //         filters: [
      //           {
      //             listId: 2214,
      //             operator: "IN_LIST",
      //             metadata: {
      //               inListType: "WORKFLOWS_ACTIVE",
      //               id: "36959870",
      //             },
      //             frameworkFilterId: null,
      //             filterType: "IN_LIST",
      //           },
      //         ],
      //         filterBranches: [],
      //         filterBranchType: "AND",
      //       },
      //       {
      //         filterBranchOperator: "AND",
      //         filters: [
      //           {
      //             listId: 3949,
      //             operator: "IN_LIST",
      //             metadata: {
      //               inListType: "WORKFLOWS_ACTIVE",
      //               id: "37299714",
      //             },
      //             frameworkFilterId: null,
      //             filterType: "IN_LIST",
      //           },
      //         ],
      //         filterBranches: [],
      //         filterBranchType: "AND",
      //       },
      //     ],
      //     filterBranchType: "OR",
      //   },
      //   listTypes: ["CLASSIC_GOAL_LIST"],
      // },
      // {
      //   portalId: 9360603,
      //   listId: 4653,
      //   flowId: 264450485,
      //   filterBranch: {
      //     filterBranchOperator: "OR",
      //     filters: [],
      //     filterBranches: [
      //       {
      //         filterBranchOperator: "AND",
      //         filters: [
      //           {
      //             filterType: "PROPERTY",
      //             property: "createdate",
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
      //               values: ["marketingqualifiedlead", "lead"],
      //               defaultValue: null,
      //               includeObjectsWithNoValueSet: false,
      //               operationType: "enumeration",
      //               operatorName: "IS_ANY_OF",
      //             },
      //             frameworkFilterId: null,
      //           },
      //           {
      //             filterType: "PROPERTY",
      //             property: "lifecyclestage",
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
      //     ],
      //     filterBranchType: "OR",
      //   },
      //   listTypes: ["ENROLLMENT_LIST"],
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
                  values: ["marketingqualifiedlead", "lead"],
                  defaultValue: null,
                  includeObjectsWithNoValueSet: false,
                  operationType: "enumeration",
                  operatorName: "IS_ANY_OF",
                },
                frameworkFilterId: null,
              },
              {
                filterType: "PROPERTY",
                property: "lifecyclestage",
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
        ],
        filterBranchType: "OR",
      },
    },
    enrollmentTrigger: "LIST",
  },
  {
    isEnabled: false,
    uuid: "[02.03. Contact Lead status] Connected = False → Lead status = Attempted to connect-255370006",
    name: "[LEGACY] [02.03. Lead Status] Connected = False → Lead Status = Attempted to Connect",
    firstActionId: 6,
    timeWindow: null,
    enrollmentSchedule: null,
    shouldReenroll: true,
    flowObjectType: "CONTACT",
    objectTypeId: "0-1",
    portalId: 9360603,
    flowId: 255370006,
    createMetadata: {
      updatedBy: {
        userId: 44593095,
        hubspotterId: null,
      },
      updatedAt: 1663361786725,
      referrer:
        "https://app.hubspot.com/workflows/9360603/view/deleted?name=lead%20status",
      originRequestId: null,
      integrationId: null,
      jobName: null,
      internalJobUpdateTime: null,
      sourceApp: "WORKFLOWS_APP",
      cloneMetadata: {
        flowId: 251988564,
        version: 14,
      },
      templateMetadata: null,
    },
    updateMetadata: {
      updatedBy: {
        userId: 9534005,
        hubspotterId: null,
      },
      updatedAt: 1683140622504,
      referrer:
        "https://app.hubspot.com/workflows/9360603/platform/flow/255370006/edit",
      originRequestId: null,
      integrationId: null,
      jobName: null,
      internalJobUpdateTime: null,
      sourceApp: "WORKFLOWS_APP",
      cloneMetadata: null,
      templateMetadata: null,
    },
    isClassicWorkflow: true,
    nextAvailableActionId: 14,
    version: 46,
    actions: {
      6: {
        actionId: 6,
        metadata: {
          actionType: "LIST_BRANCH",
        },
        connection: {
          listBranches: [
            {
              listId: 7388,
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
                          values: ["New"],
                          defaultValue: "",
                          includeObjectsWithNoValueSet: false,
                          operationType: "enumeration",
                          operatorName: "HAS_NEVER_BEEN_ANY_OF",
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
              connection: {
                nextActionId: 7,
                edgeType: "STANDARD",
                connectionType: "SINGLE",
              },
              branchName: "Reset New",
              nextActionId: 7,
            },
          ],
          defaultConnection: {
            nextActionId: 12,
            edgeType: "STANDARD",
            connectionType: "SINGLE",
          },
          defaultBranchName: "Set Attempted",
          defaultNextActionId: 12,
          connectionType: "LIST_BRANCH",
        },
        actionType: "LIST_BRANCH",
        portalId: 9360603,
        flowId: 255370006,
        flowVersion: 0,
        actionTypeId: "0-7",
      },
      7: {
        actionId: 7,
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
          nextActionId: 8,
          edgeType: "STANDARD",
          connectionType: "SINGLE",
        },
        actionType: "SET_PROPERTY",
        portalId: 9360603,
        flowId: 255370006,
        flowVersion: 0,
        actionTypeId: "0-5",
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
          nextActionId: 12,
          edgeType: "GOTO",
          connectionType: "SINGLE",
        },
        actionType: "DELAY",
        portalId: 9360603,
        flowId: 255370006,
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
            value: "Attempt to connect",
          },
          actionType: "SET_PROPERTY",
        },
        connection: null,
        actionType: "SET_PROPERTY",
        portalId: 9360603,
        flowId: 255370006,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
      12: {
        actionId: 12,
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
          nextActionId: 13,
          edgeType: "STANDARD",
          connectionType: "SINGLE",
        },
        actionType: "SET_PROPERTY",
        portalId: 9360603,
        flowId: 255370006,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
      13: {
        actionId: 13,
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
        flowId: 255370006,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
    },
    classicEnrollmentSettings: {
      eventAnchor: null,
      recurAnnually: false,
      reEnrollmentTriggerSets: [],
      enrollOnCriteriaUpdate: false,
      listening: false,
      suppressionListIds: [],
      unenrollmentSetting: {
        type: "SELECTIVE",
        excludedWorkflows: [36959897, 37471201],
      },
      internalStartingListId: 1719,
      internalGoalListId: 1720,
      allowContactToTriggerMultipleTimes: true,
      segmentCriteria: [
        [
          {
            property: "hs_sequences_is_enrolled",
            value: true,
            type: "bool",
            filterFamily: "PropertyValue",
            withinTimeMode: "PAST",
            operator: "EQ",
          },
          {
            property: "lifecyclestage",
            value: "30776145",
            type: "enumeration",
            filterFamily: "PropertyValue",
            withinTimeMode: "PAST",
            operator: "SET_NOT_ANY",
          },
        ],
        [
          {
            engagementsFilter: {
              filters: [
                {
                  property: "hs_email_status",
                  operator: "IS_NOT_EMPTY",
                  type: "enumeration",
                  propertyObjectType: "ENGAGEMENT",
                  filterFamily: "Engagement",
                },
              ],
            },
            filterFamily: "Engagement",
            withinTimeMode: "PAST",
            propertyObjectType: "ENGAGEMENT",
          },
          {
            property: "lifecyclestage",
            value: "30776145",
            type: "enumeration",
            filterFamily: "PropertyValue",
            withinTimeMode: "PAST",
            operator: "SET_NOT_ANY",
          },
        ],
        [
          {
            engagementsFilter: {
              filters: [
                {
                  property: "hs_call_status",
                  operator: "IS_NOT_EMPTY",
                  type: "enumeration",
                  propertyObjectType: "ENGAGEMENT",
                  filterFamily: "Engagement",
                },
              ],
            },
            filterFamily: "Engagement",
            withinTimeMode: "PAST",
            propertyObjectType: "ENGAGEMENT",
          },
          {
            property: "lifecyclestage",
            value: "30776145",
            type: "enumeration",
            filterFamily: "PropertyValue",
            withinTimeMode: "PAST",
            operator: "SET_NOT_ANY",
          },
        ],
        [
          {
            engagementsFilter: {
              filters: [
                {
                  property: "hs_call_disposition",
                  operator: "SET_NOT_ANY",
                  type: "enumeration",
                  strValue: "f240bbac-87c9-4f6e-bf70-924b57d47db7",
                  propertyObjectType: "ENGAGEMENT",
                  filterFamily: "Engagement",
                },
                {
                  property: "hs_call_disposition",
                  operator: "IS_NOT_EMPTY",
                  type: "enumeration",
                  propertyObjectType: "ENGAGEMENT",
                  filterFamily: "Engagement",
                },
              ],
            },
            filterFamily: "Engagement",
            withinTimeMode: "PAST",
            propertyObjectType: "ENGAGEMENT",
          },
          {
            property: "lifecyclestage",
            value: "30776145",
            type: "enumeration",
            filterFamily: "PropertyValue",
            withinTimeMode: "PAST",
            operator: "SET_NOT_ANY",
          },
        ],
        [
          {
            engagementsFilter: {
              filters: [
                {
                  property: "hs_meeting_outcome",
                  operator: "IS_NOT_EMPTY",
                  type: "enumeration",
                  propertyObjectType: "ENGAGEMENT",
                  filterFamily: "Engagement",
                },
                {
                  property: "hs_meeting_outcome",
                  operator: "SET_NOT_ANY",
                  type: "enumeration",
                  strValue: "COMPLETED",
                  propertyObjectType: "ENGAGEMENT",
                  filterFamily: "Engagement",
                },
              ],
            },
            filterFamily: "Engagement",
            withinTimeMode: "PAST",
            propertyObjectType: "ENGAGEMENT",
          },
          {
            property: "lifecyclestage",
            value: "30776145",
            type: "enumeration",
            filterFamily: "PropertyValue",
            withinTimeMode: "PAST",
            operator: "SET_NOT_ANY",
          },
        ],
        [
          {
            property: "num_contacted_notes",
            value: 1,
            type: "number",
            filterFamily: "PropertyValue",
            withinTimeMode: "PAST",
            operator: "GTE",
          },
          {
            property: "lifecyclestage",
            value: "30776145",
            type: "enumeration",
            filterFamily: "PropertyValue",
            withinTimeMode: "PAST",
            operator: "SET_NOT_ANY",
          },
        ],
        [
          {
            engagementsFilter: {
              filters: [
                {
                  property: "hs_communication_channel_type",
                  operator: "IS_NOT_EMPTY",
                  type: "enumeration",
                  propertyObjectType: "ENGAGEMENT",
                  filterFamily: "Engagement",
                },
              ],
            },
            filterFamily: "Engagement",
            withinTimeMode: "PAST",
            propertyObjectType: "ENGAGEMENT",
          },
          {
            property: "lifecyclestage",
            value: "30776145",
            type: "enumeration",
            filterFamily: "PropertyValue",
            withinTimeMode: "PAST",
            operator: "SET_NOT_ANY",
          },
        ],
      ],
      goalCriteria: [
        [
          {
            property: "hs_lead_status",
            value: "Open deal;Connected;Unqualified",
            type: "enumeration",
            filterFamily: "PropertyValue",
            withinTimeMode: "PAST",
            operator: "SET_ANY",
          },
        ],
        // [
        //   {
        //     dynamicList: false,
        //     filterFamily: "Workflow",
        //     withinTimeMode: "PAST",
        //     list: 1729,
        //     operator: "ACTIVE_IN_WORKFLOW",
        //     workflowId: 36959870,
        //   },
        // ],
        // [
        //   {
        //     dynamicList: false,
        //     filterFamily: "Workflow",
        //     withinTimeMode: "PAST",
        //     list: 1736,
        //     operator: "ACTIVE_IN_WORKFLOW",
        //     workflowId: 36959872,
        //   },
        // ],
        // [
        //   {
        //     dynamicList: false,
        //     filterFamily: "Workflow",
        //     withinTimeMode: "PAST",
        //     list: 2334,
        //     operator: "ACTIVE_IN_WORKFLOW",
        //     workflowId: 37299714,
        //   },
        // ],
      ],
      enrollmentFilters: [
        {
          ands: [
            {
              property: "hs_sequences_is_enrolled",
              operator: "EQ",
              type: "bool",
              boolValue: true,
              withinLastTimeMode: "PAST",
              filterFamily: "PropertyValue",
            },
            {
              property: "lifecyclestage",
              operator: "SET_NOT_ANY",
              type: "enumeration",
              strValue: "30776145",
              withinLastTimeMode: "PAST",
              filterFamily: "PropertyValue",
            },
          ],
        },
        {
          ands: [
            {
              propertyObjectType: "ENGAGEMENT",
              withinLastTimeMode: "PAST",
              filterFamily: "Engagement",
              engagementsFilter: {
                filters: [
                  {
                    property: "hs_email_status",
                    operator: "IS_NOT_EMPTY",
                    type: "enumeration",
                    propertyObjectType: "ENGAGEMENT",
                    filterFamily: "Engagement",
                  },
                ],
              },
            },
            {
              property: "lifecyclestage",
              operator: "SET_NOT_ANY",
              type: "enumeration",
              strValue: "30776145",
              withinLastTimeMode: "PAST",
              filterFamily: "PropertyValue",
            },
          ],
        },
        {
          ands: [
            {
              propertyObjectType: "ENGAGEMENT",
              withinLastTimeMode: "PAST",
              filterFamily: "Engagement",
              engagementsFilter: {
                filters: [
                  {
                    property: "hs_call_status",
                    operator: "IS_NOT_EMPTY",
                    type: "enumeration",
                    propertyObjectType: "ENGAGEMENT",
                    filterFamily: "Engagement",
                  },
                ],
              },
            },
            {
              property: "lifecyclestage",
              operator: "SET_NOT_ANY",
              type: "enumeration",
              strValue: "30776145",
              withinLastTimeMode: "PAST",
              filterFamily: "PropertyValue",
            },
          ],
        },
        {
          ands: [
            {
              propertyObjectType: "ENGAGEMENT",
              withinLastTimeMode: "PAST",
              filterFamily: "Engagement",
              engagementsFilter: {
                filters: [
                  {
                    property: "hs_call_disposition",
                    operator: "SET_NOT_ANY",
                    type: "enumeration",
                    strValue: "f240bbac-87c9-4f6e-bf70-924b57d47db7",
                    propertyObjectType: "ENGAGEMENT",
                    filterFamily: "Engagement",
                  },
                  {
                    property: "hs_call_disposition",
                    operator: "IS_NOT_EMPTY",
                    type: "enumeration",
                    propertyObjectType: "ENGAGEMENT",
                    filterFamily: "Engagement",
                  },
                ],
              },
            },
            {
              property: "lifecyclestage",
              operator: "SET_NOT_ANY",
              type: "enumeration",
              strValue: "30776145",
              withinLastTimeMode: "PAST",
              filterFamily: "PropertyValue",
            },
          ],
        },
        {
          ands: [
            {
              propertyObjectType: "ENGAGEMENT",
              withinLastTimeMode: "PAST",
              filterFamily: "Engagement",
              engagementsFilter: {
                filters: [
                  {
                    property: "hs_meeting_outcome",
                    operator: "IS_NOT_EMPTY",
                    type: "enumeration",
                    propertyObjectType: "ENGAGEMENT",
                    filterFamily: "Engagement",
                  },
                  {
                    property: "hs_meeting_outcome",
                    operator: "SET_NOT_ANY",
                    type: "enumeration",
                    strValue: "COMPLETED",
                    propertyObjectType: "ENGAGEMENT",
                    filterFamily: "Engagement",
                  },
                ],
              },
            },
            {
              property: "lifecyclestage",
              operator: "SET_NOT_ANY",
              type: "enumeration",
              strValue: "30776145",
              withinLastTimeMode: "PAST",
              filterFamily: "PropertyValue",
            },
          ],
        },
        {
          ands: [
            {
              property: "num_contacted_notes",
              operator: "GTE",
              type: "number",
              strValue: "1",
              longValue: 1,
              withinLastTimeMode: "PAST",
              filterFamily: "PropertyValue",
            },
            {
              property: "lifecyclestage",
              operator: "SET_NOT_ANY",
              type: "enumeration",
              strValue: "30776145",
              withinLastTimeMode: "PAST",
              filterFamily: "PropertyValue",
            },
          ],
        },
        {
          ands: [
            {
              propertyObjectType: "ENGAGEMENT",
              withinLastTimeMode: "PAST",
              filterFamily: "Engagement",
              engagementsFilter: {
                filters: [
                  {
                    property: "hs_communication_channel_type",
                    operator: "IS_NOT_EMPTY",
                    type: "enumeration",
                    propertyObjectType: "ENGAGEMENT",
                    filterFamily: "Engagement",
                  },
                ],
              },
            },
            {
              property: "lifecyclestage",
              operator: "SET_NOT_ANY",
              type: "enumeration",
              strValue: "30776145",
              withinLastTimeMode: "PAST",
              filterFamily: "PropertyValue",
            },
          ],
        },
      ],
      goalFilters: [
        {
          ands: [
            {
              property: "hs_lead_status",
              operator: "SET_ANY",
              type: "enumeration",
              strValue: "Open deal;Connected;Unqualified",
              withinLastTimeMode: "PAST",
              filterFamily: "PropertyValue",
            },
          ],
        },
        // {
        //   ands: [
        //     {
        //       operator: "ACTIVE_IN_WORKFLOW",
        //       listId: 1729,
        //       withinLastTimeMode: "PAST",
        //       dynamicList: false,
        //       workflowId: 36959870,
        //       filterFamily: "Workflow",
        //     },
        //   ],
        // },
        // {
        //   ands: [
        //     {
        //       operator: "ACTIVE_IN_WORKFLOW",
        //       listId: 1736,
        //       withinLastTimeMode: "PAST",
        //       dynamicList: false,
        //       workflowId: 36959872,
        //       filterFamily: "Workflow",
        //     },
        //   ],
        // },
        // {
        //   ands: [
        //     {
        //       operator: "ACTIVE_IN_WORKFLOW",
        //       listId: 2334,
        //       withinLastTimeMode: "PAST",
        //       dynamicList: false,
        //       workflowId: 37299714,
        //       filterFamily: "Workflow",
        //     },
        //   ],
        // },
      ],
      allowEnrollmentFromMerge: false,
      canEnrollFromSalesforce: false,
      workflowId: 36959864,
    },
    associatedLists: [
      // {
      //   portalId: 9360603,
      //   listId: 2203,
      //   flowId: 255370006,
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
      //             listId: 2214,
      //             operator: "IN_LIST",
      //             metadata: {
      //               inListType: "WORKFLOWS_ACTIVE",
      //               id: "36959870",
      //             },
      //             frameworkFilterId: null,
      //             filterType: "IN_LIST",
      //           },
      //         ],
      //         filterBranches: [],
      //         filterBranchType: "AND",
      //       },
      //       {
      //         filterBranchOperator: "AND",
      //         filters: [
      //           {
      //             listId: 2221,
      //             operator: "IN_LIST",
      //             metadata: {
      //               inListType: "WORKFLOWS_ACTIVE",
      //               id: "36959872",
      //             },
      //             frameworkFilterId: null,
      //             filterType: "IN_LIST",
      //           },
      //         ],
      //         filterBranches: [],
      //         filterBranchType: "AND",
      //       },
      //       {
      //         filterBranchOperator: "AND",
      //         filters: [
      //           {
      //             listId: 3949,
      //             operator: "IN_LIST",
      //             metadata: {
      //               inListType: "WORKFLOWS_ACTIVE",
      //               id: "37299714",
      //             },
      //             frameworkFilterId: null,
      //             filterType: "IN_LIST",
      //           },
      //         ],
      //         filterBranches: [],
      //         filterBranchType: "AND",
      //       },
      //     ],
      //     filterBranchType: "OR",
      //   },
      //   listTypes: ["CLASSIC_GOAL_LIST"],
      // },
      // {
      //   portalId: 9360603,
      //   listId: 2198,
      //   flowId: 255370006,
      //   filterBranch: {
      //     filterBranchOperator: "OR",
      //     filters: [],
      //     filterBranches: [
      //       {
      //         filterBranchOperator: "AND",
      //         filters: [
      //           {
      //             filterType: "PROPERTY",
      //             property: "hs_sequences_is_enrolled",
      //             operation: {
      //               propertyType: "bool",
      //               operator: "IS_EQUAL_TO",
      //               value: true,
      //               defaultValue: null,
      //               includeObjectsWithNoValueSet: false,
      //               operationType: "bool",
      //               operatorName: "IS_EQUAL_TO",
      //             },
      //             frameworkFilterId: null,
      //           },
      //           {
      //             filterType: "PROPERTY",
      //             property: "lifecyclestage",
      //             operation: {
      //               propertyType: "enumeration",
      //               operator: "IS_NONE_OF",
      //               values: ["30776145"],
      //               defaultValue: "",
      //               includeObjectsWithNoValueSet: false,
      //               operationType: "enumeration",
      //               operatorName: "IS_NONE_OF",
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
      //             property: "num_contacted_notes",
      //             operation: {
      //               propertyType: "number",
      //               operator: "IS_GREATER_THAN_OR_EQUAL_TO",
      //               value: 1,
      //               defaultValue: "0",
      //               includeObjectsWithNoValueSet: false,
      //               operationType: "number",
      //               operatorName: "IS_GREATER_THAN_OR_EQUAL_TO",
      //             },
      //             frameworkFilterId: null,
      //           },
      //           {
      //             filterType: "PROPERTY",
      //             property: "lifecyclestage",
      //             operation: {
      //               propertyType: "enumeration",
      //               operator: "IS_NONE_OF",
      //               values: ["30776145"],
      //               defaultValue: "",
      //               includeObjectsWithNoValueSet: false,
      //               operationType: "enumeration",
      //               operatorName: "IS_NONE_OF",
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
      //               operator: "IS_NONE_OF",
      //               values: ["30776145"],
      //               defaultValue: "",
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
      //                 property: "hs_call_disposition",
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
      //               {
      //                 filterType: "PROPERTY",
      //                 property: "hs_call_disposition",
      //                 operation: {
      //                   propertyType: "enumeration",
      //                   operator: "IS_NONE_OF",
      //                   values: ["f240bbac-87c9-4f6e-bf70-924b57d47db7"],
      //                   defaultValue: "",
      //                   includeObjectsWithNoValueSet: false,
      //                   operationType: "enumeration",
      //                   operatorName: "IS_NONE_OF",
      //                 },
      //                 frameworkFilterId: null,
      //               },
      //             ],
      //             filterBranches: [],
      //             associationCategory: "HUBSPOT_DEFINED",
      //             associationTypeId: 9,
      //             objectType: "ENGAGEMENT",
      //             objectTypeId: "0-4",
      //             operator: "IN_LIST",
      //             coalescingRefineBy: {
      //               setType: "ANY",
      //               type: "SetOccurrencesRefineBy",
      //             },
      //             associationListId: 4351,
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
      //               operator: "IS_NONE_OF",
      //               values: ["30776145"],
      //               defaultValue: "",
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
      //                 property: "hs_communication_channel_type",
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
      //             associationTypeId: 9,
      //             objectType: "ENGAGEMENT",
      //             objectTypeId: "0-4",
      //             operator: "IN_LIST",
      //             coalescingRefineBy: {
      //               setType: "ANY",
      //               type: "SetOccurrencesRefineBy",
      //             },
      //             associationListId: 4353,
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
      //               operator: "IS_NONE_OF",
      //               values: ["30776145"],
      //               defaultValue: "",
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
      //                 property: "hs_meeting_outcome",
      //                 operation: {
      //                   propertyType: "enumeration",
      //                   operator: "IS_NONE_OF",
      //                   values: ["COMPLETED"],
      //                   defaultValue: "",
      //                   includeObjectsWithNoValueSet: false,
      //                   operationType: "enumeration",
      //                   operatorName: "IS_NONE_OF",
      //                 },
      //                 frameworkFilterId: null,
      //               },
      //               {
      //                 filterType: "PROPERTY",
      //                 property: "hs_meeting_outcome",
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
      //             associationTypeId: 9,
      //             objectType: "ENGAGEMENT",
      //             objectTypeId: "0-4",
      //             operator: "IN_LIST",
      //             coalescingRefineBy: {
      //               setType: "ANY",
      //               type: "SetOccurrencesRefineBy",
      //             },
      //             associationListId: 4352,
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
      //               operator: "IS_NONE_OF",
      //               values: ["30776145"],
      //               defaultValue: "",
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
      //                 property: "hs_email_status",
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
      //             associationTypeId: 9,
      //             objectType: "ENGAGEMENT",
      //             objectTypeId: "0-4",
      //             operator: "IN_LIST",
      //             coalescingRefineBy: {
      //               setType: "ANY",
      //               type: "SetOccurrencesRefineBy",
      //             },
      //             associationListId: 4349,
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
      //               operator: "IS_NONE_OF",
      //               values: ["30776145"],
      //               defaultValue: "",
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
      //                 property: "hs_call_status",
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
      //             associationTypeId: 9,
      //             objectType: "ENGAGEMENT",
      //             objectTypeId: "0-4",
      //             operator: "IN_LIST",
      //             coalescingRefineBy: {
      //               setType: "ANY",
      //               type: "SetOccurrencesRefineBy",
      //             },
      //             associationListId: 4350,
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
                property: "hs_sequences_is_enrolled",
                operation: {
                  propertyType: "bool",
                  operator: "IS_EQUAL_TO",
                  value: true,
                  defaultValue: null,
                  includeObjectsWithNoValueSet: false,
                  operationType: "bool",
                  operatorName: "IS_EQUAL_TO",
                },
                frameworkFilterId: null,
              },
              {
                filterType: "PROPERTY",
                property: "lifecyclestage",
                operation: {
                  propertyType: "enumeration",
                  operator: "IS_NONE_OF",
                  values: ["30776145"],
                  defaultValue: "",
                  includeObjectsWithNoValueSet: false,
                  operationType: "enumeration",
                  operatorName: "IS_NONE_OF",
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
                property: "num_contacted_notes",
                operation: {
                  propertyType: "number",
                  operator: "IS_GREATER_THAN_OR_EQUAL_TO",
                  value: 1,
                  defaultValue: "0",
                  includeObjectsWithNoValueSet: false,
                  operationType: "number",
                  operatorName: "IS_GREATER_THAN_OR_EQUAL_TO",
                },
                frameworkFilterId: null,
              },
              {
                filterType: "PROPERTY",
                property: "lifecyclestage",
                operation: {
                  propertyType: "enumeration",
                  operator: "IS_NONE_OF",
                  values: ["30776145"],
                  defaultValue: "",
                  includeObjectsWithNoValueSet: false,
                  operationType: "enumeration",
                  operatorName: "IS_NONE_OF",
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
                  operator: "IS_NONE_OF",
                  values: ["30776145"],
                  defaultValue: "",
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
                    property: "hs_call_disposition",
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
                  {
                    filterType: "PROPERTY",
                    property: "hs_call_disposition",
                    operation: {
                      propertyType: "enumeration",
                      operator: "IS_NONE_OF",
                      values: ["f240bbac-87c9-4f6e-bf70-924b57d47db7"],
                      defaultValue: "",
                      includeObjectsWithNoValueSet: false,
                      operationType: "enumeration",
                      operatorName: "IS_NONE_OF",
                    },
                    frameworkFilterId: null,
                  },
                ],
                filterBranches: [],
                associationCategory: "HUBSPOT_DEFINED",
                associationTypeId: 9,
                objectType: "ENGAGEMENT",
                objectTypeId: "0-4",
                operator: "IN_LIST",
                coalescingRefineBy: {
                  setType: "ANY",
                  type: "SetOccurrencesRefineBy",
                },
                associationListId: 4351,
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
                  operator: "IS_NONE_OF",
                  values: ["30776145"],
                  defaultValue: "",
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
                    property: "hs_communication_channel_type",
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
                associationTypeId: 9,
                objectType: "ENGAGEMENT",
                objectTypeId: "0-4",
                operator: "IN_LIST",
                coalescingRefineBy: {
                  setType: "ANY",
                  type: "SetOccurrencesRefineBy",
                },
                associationListId: 4353,
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
                  operator: "IS_NONE_OF",
                  values: ["30776145"],
                  defaultValue: "",
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
                    property: "hs_meeting_outcome",
                    operation: {
                      propertyType: "enumeration",
                      operator: "IS_NONE_OF",
                      values: ["COMPLETED"],
                      defaultValue: "",
                      includeObjectsWithNoValueSet: false,
                      operationType: "enumeration",
                      operatorName: "IS_NONE_OF",
                    },
                    frameworkFilterId: null,
                  },
                  {
                    filterType: "PROPERTY",
                    property: "hs_meeting_outcome",
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
                associationTypeId: 9,
                objectType: "ENGAGEMENT",
                objectTypeId: "0-4",
                operator: "IN_LIST",
                coalescingRefineBy: {
                  setType: "ANY",
                  type: "SetOccurrencesRefineBy",
                },
                associationListId: 4352,
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
                  operator: "IS_NONE_OF",
                  values: ["30776145"],
                  defaultValue: "",
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
                    property: "hs_email_status",
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
                associationTypeId: 9,
                objectType: "ENGAGEMENT",
                objectTypeId: "0-4",
                operator: "IN_LIST",
                coalescingRefineBy: {
                  setType: "ANY",
                  type: "SetOccurrencesRefineBy",
                },
                associationListId: 4349,
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
                  operator: "IS_NONE_OF",
                  values: ["30776145"],
                  defaultValue: "",
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
                    property: "hs_call_status",
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
                associationTypeId: 9,
                objectType: "ENGAGEMENT",
                objectTypeId: "0-4",
                operator: "IN_LIST",
                coalescingRefineBy: {
                  setType: "ANY",
                  type: "SetOccurrencesRefineBy",
                },
                associationListId: 4350,
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
  },
  {
    isEnabled: false,
    uuid: "[02.04. Contact Lead status] Connected = True → Lead status = Connected-255369739",
    name: "[LEGACY] [02.04. Lead Status] Connected = True → Lead Status = Connected",
    firstActionId: 6,
    timeWindow: null,
    enrollmentSchedule: null,
    shouldReenroll: true,
    flowObjectType: "CONTACT",
    objectTypeId: "0-1",
    portalId: 9360603,
    flowId: 255369739,
    createMetadata: {
      updatedBy: {
        userId: 44593095,
        hubspotterId: null,
      },
      updatedAt: 1663361802375,
      referrer:
        "https://app.hubspot.com/workflows/9360603/view/deleted?name=lead%20status",
      originRequestId: null,
      integrationId: null,
      jobName: null,
      internalJobUpdateTime: null,
      sourceApp: "WORKFLOWS_APP",
      cloneMetadata: {
        flowId: 252015270,
        version: 13,
      },
      templateMetadata: null,
    },
    updateMetadata: {
      updatedBy: {
        userId: 9534005,
        hubspotterId: null,
      },
      updatedAt: 1683140638754,
      referrer:
        "https://app.hubspot.com/workflows/9360603/platform/flow/255369739/edit",
      originRequestId: null,
      integrationId: null,
      jobName: null,
      internalJobUpdateTime: null,
      sourceApp: "WORKFLOWS_APP",
      cloneMetadata: null,
      templateMetadata: null,
    },
    isClassicWorkflow: true,
    nextAvailableActionId: 19,
    version: 54,
    actions: {
      4: {
        actionId: 4,
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
          nextActionId: 7,
          edgeType: "STANDARD",
          connectionType: "SINGLE",
        },
        actionType: "SET_PROPERTY",
        portalId: 9360603,
        flowId: 255369739,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
      6: {
        actionId: 6,
        metadata: {
          actionType: "LIST_BRANCH",
        },
        connection: {
          listBranches: [
            {
              listId: 7385,
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
                          values: ["New"],
                          defaultValue: "",
                          includeObjectsWithNoValueSet: false,
                          operationType: "enumeration",
                          operatorName: "HAS_NEVER_BEEN_ANY_OF",
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
              connection: {
                nextActionId: 4,
                edgeType: "STANDARD",
                connectionType: "SINGLE",
              },
              branchName: "Reset New",
              nextActionId: 4,
            },
          ],
          defaultConnection: {
            nextActionId: 8,
            edgeType: "STANDARD",
            connectionType: "SINGLE",
          },
          defaultBranchName: "Check Attempted to Connect",
          defaultNextActionId: 8,
          connectionType: "LIST_BRANCH",
        },
        actionType: "LIST_BRANCH",
        portalId: 9360603,
        flowId: 255369739,
        flowVersion: 50,
        actionTypeId: "0-7",
      },
      7: {
        actionId: 7,
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
          nextActionId: 8,
          edgeType: "GOTO",
          connectionType: "SINGLE",
        },
        actionType: "DELAY",
        portalId: 9360603,
        flowId: 255369739,
        flowVersion: 0,
        actionTypeId: "0-1",
      },
      8: {
        actionId: 8,
        metadata: {
          actionType: "LIST_BRANCH",
        },
        connection: {
          listBranches: [
            {
              listId: 7386,
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
                          values: ["Attempt to connect"],
                          defaultValue: "",
                          includeObjectsWithNoValueSet: false,
                          operationType: "enumeration",
                          operatorName: "HAS_NEVER_BEEN_ANY_OF",
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
              connection: {
                nextActionId: 15,
                edgeType: "STANDARD",
                connectionType: "SINGLE",
              },
              branchName: "Reset Attempted",
              nextActionId: 15,
            },
          ],
          defaultConnection: {
            nextActionId: 17,
            edgeType: "STANDARD",
            connectionType: "SINGLE",
          },
          defaultBranchName: "Set Connected",
          defaultNextActionId: 17,
          connectionType: "LIST_BRANCH",
        },
        actionType: "LIST_BRANCH",
        portalId: 9360603,
        flowId: 255369739,
        flowVersion: 0,
        actionTypeId: "0-7",
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
            value: "Attempt to connect",
          },
          actionType: "SET_PROPERTY",
        },
        connection: {
          nextActionId: 11,
          edgeType: "STANDARD",
          connectionType: "SINGLE",
        },
        actionType: "SET_PROPERTY",
        portalId: 9360603,
        flowId: 255369739,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
      11: {
        actionId: 11,
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
          nextActionId: 17,
          edgeType: "GOTO",
          connectionType: "SINGLE",
        },
        actionType: "DELAY",
        portalId: 9360603,
        flowId: 255369739,
        flowVersion: 0,
        actionTypeId: "0-1",
      },
      12: {
        actionId: 12,
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
        flowId: 255369739,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
      15: {
        actionId: 15,
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
          nextActionId: 16,
          edgeType: "STANDARD",
          connectionType: "SINGLE",
        },
        actionType: "SET_PROPERTY",
        portalId: 9360603,
        flowId: 255369739,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
      16: {
        actionId: 16,
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
        flowId: 255369739,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
      17: {
        actionId: 17,
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
          nextActionId: 18,
          edgeType: "STANDARD",
          connectionType: "SINGLE",
        },
        actionType: "SET_PROPERTY",
        portalId: 9360603,
        flowId: 255369739,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
      18: {
        actionId: 18,
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
          nextActionId: 12,
          edgeType: "STANDARD",
          connectionType: "SINGLE",
        },
        actionType: "SET_PROPERTY",
        portalId: 9360603,
        flowId: 255369739,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
    },
    classicEnrollmentSettings: {
      eventAnchor: null,
      recurAnnually: false,
      reEnrollmentTriggerSets: [],
      enrollOnCriteriaUpdate: false,
      listening: false,
      suppressionListIds: [],
      unenrollmentSetting: {
        type: "SELECTIVE",
        excludedWorkflows: [36959897, 37471201, 36959864],
      },
      internalStartingListId: 1726,
      internalGoalListId: 1727,
      allowContactToTriggerMultipleTimes: true,
      segmentCriteria: [
        [
          {
            property: "hs_sales_email_last_replied",
            type: "datetime",
            filterFamily: "PropertyValue",
            withinTimeMode: "PAST",
            operator: "IS_NOT_EMPTY",
          },
          {
            property: "lifecyclestage",
            value: "30776145",
            type: "enumeration",
            filterFamily: "PropertyValue",
            withinTimeMode: "PAST",
            operator: "SET_NOT_ANY",
          },
        ],
        [
          {
            engagementsFilter: {
              filters: [
                {
                  property: "hs_call_duration",
                  operator: "GT",
                  type: "number",
                  strValue: "60000",
                  propertyObjectType: "ENGAGEMENT",
                  filterFamily: "Engagement",
                },
              ],
            },
            filterFamily: "Engagement",
            withinTimeMode: "PAST",
            propertyObjectType: "ENGAGEMENT",
          },
          {
            property: "lifecyclestage",
            value: "30776145",
            type: "enumeration",
            filterFamily: "PropertyValue",
            withinTimeMode: "PAST",
            operator: "SET_NOT_ANY",
          },
        ],
        [
          {
            engagementsFilter: {
              filters: [
                {
                  property: "hs_call_disposition",
                  operator: "SET_ANY",
                  type: "enumeration",
                  strValue: "f240bbac-87c9-4f6e-bf70-924b57d47db7",
                  propertyObjectType: "ENGAGEMENT",
                  filterFamily: "Engagement",
                },
              ],
            },
            filterFamily: "Engagement",
            withinTimeMode: "PAST",
            propertyObjectType: "ENGAGEMENT",
          },
          {
            property: "lifecyclestage",
            value: "30776145",
            type: "enumeration",
            filterFamily: "PropertyValue",
            withinTimeMode: "PAST",
            operator: "SET_NOT_ANY",
          },
        ],
        [
          {
            engagementsFilter: {
              filters: [
                {
                  property: "hs_meeting_outcome",
                  operator: "SET_ANY",
                  type: "enumeration",
                  strValue: "COMPLETED",
                  propertyObjectType: "ENGAGEMENT",
                  filterFamily: "Engagement",
                },
              ],
            },
            filterFamily: "Engagement",
            withinTimeMode: "PAST",
            propertyObjectType: "ENGAGEMENT",
          },
          {
            property: "lifecyclestage",
            value: "30776145",
            type: "enumeration",
            filterFamily: "PropertyValue",
            withinTimeMode: "PAST",
            operator: "SET_NOT_ANY",
          },
        ],
        [
          {
            engagementsFilter: {
              filters: [
                {
                  property: "hs_communication_channel_type",
                  operator: "IS_NOT_EMPTY",
                  type: "enumeration",
                  propertyObjectType: "ENGAGEMENT",
                  filterFamily: "Engagement",
                },
              ],
            },
            filterFamily: "Engagement",
            withinTimeMode: "PAST",
            propertyObjectType: "ENGAGEMENT",
          },
          {
            property: "lifecyclestage",
            value: "30776145",
            type: "enumeration",
            filterFamily: "PropertyValue",
            withinTimeMode: "PAST",
            operator: "SET_NOT_ANY",
          },
        ],
        [
          {
            engagementsFilter: {
              filters: [
                {
                  property: "hs_conversation_session_visitor_start_time",
                  operator: "IS_NOT_EMPTY",
                  type: "datetime",
                  longValue: 1666893116262,
                  propertyObjectType: "ENGAGEMENT",
                  filterFamily: "Engagement",
                },
              ],
            },
            filterFamily: "Engagement",
            withinTimeMode: "PAST",
            propertyObjectType: "ENGAGEMENT",
          },
          {
            property: "lifecyclestage",
            value: "30776145",
            type: "enumeration",
            filterFamily: "PropertyValue",
            withinTimeMode: "PAST",
            operator: "SET_NOT_ANY",
          },
        ],
      ],
      goalCriteria: [
        [
          {
            property: "hs_lead_status",
            value: "Open deal;Unqualified",
            type: "enumeration",
            filterFamily: "PropertyValue",
            withinTimeMode: "PAST",
            operator: "SET_ANY",
          },
        ],
        // [
        //   {
        //     dynamicList: false,
        //     filterFamily: "Workflow",
        //     withinTimeMode: "PAST",
        //     list: 1736,
        //     operator: "ACTIVE_IN_WORKFLOW",
        //     workflowId: 36959872,
        //   },
        // ],
        // [
        //   {
        //     dynamicList: false,
        //     filterFamily: "Workflow",
        //     withinTimeMode: "PAST",
        //     list: 2334,
        //     operator: "ACTIVE_IN_WORKFLOW",
        //     workflowId: 37299714,
        //   },
        // ],
      ],
      enrollmentFilters: [
        {
          ands: [
            {
              property: "hs_sales_email_last_replied",
              operator: "IS_NOT_EMPTY",
              type: "datetime",
              withinLastTimeMode: "PAST",
              filterFamily: "PropertyValue",
            },
            {
              property: "lifecyclestage",
              operator: "SET_NOT_ANY",
              type: "enumeration",
              strValue: "30776145",
              withinLastTimeMode: "PAST",
              filterFamily: "PropertyValue",
            },
          ],
        },
        {
          ands: [
            {
              propertyObjectType: "ENGAGEMENT",
              withinLastTimeMode: "PAST",
              filterFamily: "Engagement",
              engagementsFilter: {
                filters: [
                  {
                    property: "hs_call_duration",
                    operator: "GT",
                    type: "number",
                    strValue: "60000",
                    propertyObjectType: "ENGAGEMENT",
                    filterFamily: "Engagement",
                  },
                ],
              },
            },
            {
              property: "lifecyclestage",
              operator: "SET_NOT_ANY",
              type: "enumeration",
              strValue: "30776145",
              withinLastTimeMode: "PAST",
              filterFamily: "PropertyValue",
            },
          ],
        },
        {
          ands: [
            {
              propertyObjectType: "ENGAGEMENT",
              withinLastTimeMode: "PAST",
              filterFamily: "Engagement",
              engagementsFilter: {
                filters: [
                  {
                    property: "hs_call_disposition",
                    operator: "SET_ANY",
                    type: "enumeration",
                    strValue: "f240bbac-87c9-4f6e-bf70-924b57d47db7",
                    propertyObjectType: "ENGAGEMENT",
                    filterFamily: "Engagement",
                  },
                ],
              },
            },
            {
              property: "lifecyclestage",
              operator: "SET_NOT_ANY",
              type: "enumeration",
              strValue: "30776145",
              withinLastTimeMode: "PAST",
              filterFamily: "PropertyValue",
            },
          ],
        },
        {
          ands: [
            {
              propertyObjectType: "ENGAGEMENT",
              withinLastTimeMode: "PAST",
              filterFamily: "Engagement",
              engagementsFilter: {
                filters: [
                  {
                    property: "hs_meeting_outcome",
                    operator: "SET_ANY",
                    type: "enumeration",
                    strValue: "COMPLETED",
                    propertyObjectType: "ENGAGEMENT",
                    filterFamily: "Engagement",
                  },
                ],
              },
            },
            {
              property: "lifecyclestage",
              operator: "SET_NOT_ANY",
              type: "enumeration",
              strValue: "30776145",
              withinLastTimeMode: "PAST",
              filterFamily: "PropertyValue",
            },
          ],
        },
        {
          ands: [
            {
              propertyObjectType: "ENGAGEMENT",
              withinLastTimeMode: "PAST",
              filterFamily: "Engagement",
              engagementsFilter: {
                filters: [
                  {
                    property: "hs_communication_channel_type",
                    operator: "IS_NOT_EMPTY",
                    type: "enumeration",
                    propertyObjectType: "ENGAGEMENT",
                    filterFamily: "Engagement",
                  },
                ],
              },
            },
            {
              property: "lifecyclestage",
              operator: "SET_NOT_ANY",
              type: "enumeration",
              strValue: "30776145",
              withinLastTimeMode: "PAST",
              filterFamily: "PropertyValue",
            },
          ],
        },
        {
          ands: [
            {
              propertyObjectType: "ENGAGEMENT",
              withinLastTimeMode: "PAST",
              filterFamily: "Engagement",
              engagementsFilter: {
                filters: [
                  {
                    property: "hs_conversation_session_visitor_start_time",
                    operator: "IS_NOT_EMPTY",
                    type: "datetime",
                    longValue: 1666893116262,
                    propertyObjectType: "ENGAGEMENT",
                    filterFamily: "Engagement",
                  },
                ],
              },
            },
            {
              property: "lifecyclestage",
              operator: "SET_NOT_ANY",
              type: "enumeration",
              strValue: "30776145",
              withinLastTimeMode: "PAST",
              filterFamily: "PropertyValue",
            },
          ],
        },
      ],
      goalFilters: [
        {
          ands: [
            {
              property: "hs_lead_status",
              operator: "SET_ANY",
              type: "enumeration",
              strValue: "Open deal;Unqualified",
              withinLastTimeMode: "PAST",
              filterFamily: "PropertyValue",
            },
          ],
        },
        // {
        //   ands: [
        //     {
        //       operator: "ACTIVE_IN_WORKFLOW",
        //       listId: 1736,
        //       withinLastTimeMode: "PAST",
        //       dynamicList: false,
        //       workflowId: 36959872,
        //       filterFamily: "Workflow",
        //     },
        //   ],
        // },
        // {
        //   ands: [
        //     {
        //       operator: "ACTIVE_IN_WORKFLOW",
        //       listId: 2334,
        //       withinLastTimeMode: "PAST",
        //       dynamicList: false,
        //       workflowId: 37299714,
        //       filterFamily: "Workflow",
        //     },
        //   ],
        // },
      ],
      allowEnrollmentFromMerge: false,
      canEnrollFromSalesforce: false,
      workflowId: 36959870,
    },
    associatedLists: [
      // {
      //   portalId: 9360603,
      //   listId: 2212,
      //   flowId: 255369739,
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
      //             listId: 2221,
      //             operator: "IN_LIST",
      //             metadata: {
      //               inListType: "WORKFLOWS_ACTIVE",
      //               id: "36959872",
      //             },
      //             frameworkFilterId: null,
      //             filterType: "IN_LIST",
      //           },
      //         ],
      //         filterBranches: [],
      //         filterBranchType: "AND",
      //       },
      //       {
      //         filterBranchOperator: "AND",
      //         filters: [
      //           {
      //             listId: 3949,
      //             operator: "IN_LIST",
      //             metadata: {
      //               inListType: "WORKFLOWS_ACTIVE",
      //               id: "37299714",
      //             },
      //             frameworkFilterId: null,
      //             filterType: "IN_LIST",
      //           },
      //         ],
      //         filterBranches: [],
      //         filterBranchType: "AND",
      //       },
      //     ],
      //     filterBranchType: "OR",
      //   },
      //   listTypes: ["CLASSIC_GOAL_LIST"],
      // },
      // {
      //   portalId: 9360603,
      //   listId: 2208,
      //   flowId: 255369739,
      //   filterBranch: {
      //     filterBranchOperator: "OR",
      //     filters: [],
      //     filterBranches: [
      //       {
      //         filterBranchOperator: "AND",
      //         filters: [
      //           {
      //             filterType: "PROPERTY",
      //             property: "hs_sales_email_last_replied",
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
      //           {
      //             filterType: "PROPERTY",
      //             property: "lifecyclestage",
      //             operation: {
      //               propertyType: "enumeration",
      //               operator: "IS_NONE_OF",
      //               values: ["30776145"],
      //               defaultValue: "",
      //               includeObjectsWithNoValueSet: false,
      //               operationType: "enumeration",
      //               operatorName: "IS_NONE_OF",
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
      //               operator: "IS_NONE_OF",
      //               values: ["30776145"],
      //               defaultValue: "",
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
      //                 property: "hs_meeting_outcome",
      //                 operation: {
      //                   propertyType: "enumeration",
      //                   operator: "IS_ANY_OF",
      //                   values: ["COMPLETED"],
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
      //             associationTypeId: 9,
      //             objectType: "ENGAGEMENT",
      //             objectTypeId: "0-4",
      //             operator: "IN_LIST",
      //             coalescingRefineBy: {
      //               setType: "ANY",
      //               type: "SetOccurrencesRefineBy",
      //             },
      //             associationListId: 4347,
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
      //               operator: "IS_NONE_OF",
      //               values: ["30776145"],
      //               defaultValue: "",
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
      //                 property: "hs_communication_channel_type",
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
      //             associationTypeId: 9,
      //             objectType: "ENGAGEMENT",
      //             objectTypeId: "0-4",
      //             operator: "IN_LIST",
      //             coalescingRefineBy: {
      //               setType: "ANY",
      //               type: "SetOccurrencesRefineBy",
      //             },
      //             associationListId: 4348,
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
      //               operator: "IS_NONE_OF",
      //               values: ["30776145"],
      //               defaultValue: "",
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
      //                 property: "hs_conversation_session_visitor_start_time",
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
      //             associationTypeId: 9,
      //             objectType: "ENGAGEMENT",
      //             objectTypeId: "0-4",
      //             operator: "IN_LIST",
      //             coalescingRefineBy: {
      //               setType: "ANY",
      //               type: "SetOccurrencesRefineBy",
      //             },
      //             associationListId: 4760,
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
      //               operator: "IS_NONE_OF",
      //               values: ["30776145"],
      //               defaultValue: "",
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
      //                 property: "hs_call_disposition",
      //                 operation: {
      //                   propertyType: "enumeration",
      //                   operator: "IS_ANY_OF",
      //                   values: ["f240bbac-87c9-4f6e-bf70-924b57d47db7"],
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
      //             associationTypeId: 9,
      //             objectType: "ENGAGEMENT",
      //             objectTypeId: "0-4",
      //             operator: "IN_LIST",
      //             coalescingRefineBy: {
      //               setType: "ANY",
      //               type: "SetOccurrencesRefineBy",
      //             },
      //             associationListId: 4346,
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
      //               operator: "IS_NONE_OF",
      //               values: ["30776145"],
      //               defaultValue: "",
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
      //                 property: "hs_call_duration",
      //                 operation: {
      //                   propertyType: "number",
      //                   operator: "IS_GREATER_THAN",
      //                   value: 60000,
      //                   defaultValue: "0",
      //                   includeObjectsWithNoValueSet: false,
      //                   operationType: "number",
      //                   operatorName: "IS_GREATER_THAN",
      //                 },
      //                 frameworkFilterId: null,
      //               },
      //             ],
      //             filterBranches: [],
      //             associationCategory: "HUBSPOT_DEFINED",
      //             associationTypeId: 9,
      //             objectType: "ENGAGEMENT",
      //             objectTypeId: "0-4",
      //             operator: "IN_LIST",
      //             coalescingRefineBy: {
      //               setType: "ANY",
      //               type: "SetOccurrencesRefineBy",
      //             },
      //             associationListId: 4345,
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
                property: "hs_sales_email_last_replied",
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
              {
                filterType: "PROPERTY",
                property: "lifecyclestage",
                operation: {
                  propertyType: "enumeration",
                  operator: "IS_NONE_OF",
                  values: ["30776145"],
                  defaultValue: "",
                  includeObjectsWithNoValueSet: false,
                  operationType: "enumeration",
                  operatorName: "IS_NONE_OF",
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
                  operator: "IS_NONE_OF",
                  values: ["30776145"],
                  defaultValue: "",
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
                    property: "hs_meeting_outcome",
                    operation: {
                      propertyType: "enumeration",
                      operator: "IS_ANY_OF",
                      values: ["COMPLETED"],
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
                associationTypeId: 9,
                objectType: "ENGAGEMENT",
                objectTypeId: "0-4",
                operator: "IN_LIST",
                coalescingRefineBy: {
                  setType: "ANY",
                  type: "SetOccurrencesRefineBy",
                },
                associationListId: 4347,
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
                  operator: "IS_NONE_OF",
                  values: ["30776145"],
                  defaultValue: "",
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
                    property: "hs_communication_channel_type",
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
                associationTypeId: 9,
                objectType: "ENGAGEMENT",
                objectTypeId: "0-4",
                operator: "IN_LIST",
                coalescingRefineBy: {
                  setType: "ANY",
                  type: "SetOccurrencesRefineBy",
                },
                associationListId: 4348,
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
                  operator: "IS_NONE_OF",
                  values: ["30776145"],
                  defaultValue: "",
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
                    property: "hs_conversation_session_visitor_start_time",
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
                associationTypeId: 9,
                objectType: "ENGAGEMENT",
                objectTypeId: "0-4",
                operator: "IN_LIST",
                coalescingRefineBy: {
                  setType: "ANY",
                  type: "SetOccurrencesRefineBy",
                },
                associationListId: 4760,
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
                  operator: "IS_NONE_OF",
                  values: ["30776145"],
                  defaultValue: "",
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
                    property: "hs_call_disposition",
                    operation: {
                      propertyType: "enumeration",
                      operator: "IS_ANY_OF",
                      values: ["f240bbac-87c9-4f6e-bf70-924b57d47db7"],
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
                associationTypeId: 9,
                objectType: "ENGAGEMENT",
                objectTypeId: "0-4",
                operator: "IN_LIST",
                coalescingRefineBy: {
                  setType: "ANY",
                  type: "SetOccurrencesRefineBy",
                },
                associationListId: 4346,
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
                  operator: "IS_NONE_OF",
                  values: ["30776145"],
                  defaultValue: "",
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
                    property: "hs_call_duration",
                    operation: {
                      propertyType: "number",
                      operator: "IS_GREATER_THAN",
                      value: 60000,
                      defaultValue: "0",
                      includeObjectsWithNoValueSet: false,
                      operationType: "number",
                      operatorName: "IS_GREATER_THAN",
                    },
                    frameworkFilterId: null,
                  },
                ],
                filterBranches: [],
                associationCategory: "HUBSPOT_DEFINED",
                associationTypeId: 9,
                objectType: "ENGAGEMENT",
                objectTypeId: "0-4",
                operator: "IN_LIST",
                coalescingRefineBy: {
                  setType: "ANY",
                  type: "SetOccurrencesRefineBy",
                },
                associationListId: 4345,
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
  },
  {
    isEnabled: false,
    uuid: "[02.05. Contact Lead status] Lifecycle stage >= SQL → Lead status = Open deal-255370371",
    name: "[LEGACY] [02.05. Lead Status] Lifecycle Stage ≥ SQL → Lead Status = Open Deal",
    firstActionId: 11,
    timeWindow: null,
    enrollmentSchedule: null,
    shouldReenroll: true,
    flowObjectType: "CONTACT",
    objectTypeId: "0-1",
    portalId: 9360603,
    flowId: 255370371,
    createMetadata: {
      updatedBy: {
        userId: 44593095,
        hubspotterId: null,
      },
      updatedAt: 1663361812631,
      referrer:
        "https://app.hubspot.com/workflows/9360603/view/deleted?name=lead%20status",
      originRequestId: null,
      integrationId: null,
      jobName: null,
      internalJobUpdateTime: null,
      sourceApp: "WORKFLOWS_APP",
      cloneMetadata: {
        flowId: 252000847,
        version: 11,
      },
      templateMetadata: null,
    },
    updateMetadata: {
      updatedBy: {
        userId: 9534005,
        hubspotterId: null,
      },
      updatedAt: 1683140796362,
      referrer:
        "https://app.hubspot.com/workflows/9360603/platform/flow/255370371/edit",
      originRequestId: null,
      integrationId: null,
      jobName: null,
      internalJobUpdateTime: null,
      sourceApp: "WORKFLOWS_APP",
      cloneMetadata: null,
      templateMetadata: null,
    },
    isClassicWorkflow: true,
    nextAvailableActionId: 33,
    version: 101,
    actions: {
      11: {
        actionId: 11,
        metadata: {
          actionType: "LIST_BRANCH",
        },
        connection: {
          listBranches: [
            {
              listId: 7390,
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
                          values: ["New"],
                          defaultValue: "",
                          includeObjectsWithNoValueSet: false,
                          operationType: "enumeration",
                          operatorName: "HAS_NEVER_BEEN_ANY_OF",
                        },
                        frameworkFilterId: null,
                      },
                      {
                        filterType: "PROPERTY",
                        property: "lifecyclestage",
                        operation: {
                          propertyType: "enumeration",
                          operator: "HAS_EVER_BEEN_ANY_OF",
                          values: ["marketingqualifiedlead", "lead"],
                          defaultValue: null,
                          includeObjectsWithNoValueSet: false,
                          operationType: "enumeration",
                          operatorName: "HAS_EVER_BEEN_ANY_OF",
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
                        property: "hs_lead_status",
                        operation: {
                          propertyType: "enumeration",
                          operator: "HAS_NEVER_BEEN_ANY_OF",
                          values: ["New"],
                          defaultValue: "",
                          includeObjectsWithNoValueSet: false,
                          operationType: "enumeration",
                          operatorName: "HAS_NEVER_BEEN_ANY_OF",
                        },
                        frameworkFilterId: null,
                      },
                      // {
                      //   listId: 2204,
                      //   operator: "IN_LIST",
                      //   metadata: {
                      //     inListType: "WORKFLOWS_ENROLLMENT",
                      //     id: "36959864",
                      //   },
                      //   frameworkFilterId: null,
                      //   filterType: "IN_LIST",
                      // },
                    ],
                    filterBranches: [],
                    filterBranchType: "AND",
                  },
                  {
                    filterBranchOperator: "AND",
                    filters: [
                      {
                        filterType: "PROPERTY",
                        property: "hs_lead_status",
                        operation: {
                          propertyType: "enumeration",
                          operator: "HAS_NEVER_BEEN_ANY_OF",
                          values: ["New"],
                          defaultValue: "",
                          includeObjectsWithNoValueSet: false,
                          operationType: "enumeration",
                          operatorName: "HAS_NEVER_BEEN_ANY_OF",
                        },
                        frameworkFilterId: null,
                      },
                      // {
                      //   listId: 2213,
                      //   operator: "IN_LIST",
                      //   metadata: {
                      //     inListType: "WORKFLOWS_ENROLLMENT",
                      //     id: "36959870",
                      //   },
                      //   frameworkFilterId: null,
                      //   filterType: "IN_LIST",
                      // },
                    ],
                    filterBranches: [],
                    filterBranchType: "AND",
                  },
                ],
                filterBranchType: "OR",
              },
              connection: {
                nextActionId: 18,
                edgeType: "STANDARD",
                connectionType: "SINGLE",
              },
              branchName: "Reset New",
              nextActionId: 18,
            },
          ],
          defaultConnection: {
            nextActionId: 12,
            edgeType: "STANDARD",
            connectionType: "SINGLE",
          },
          defaultBranchName: "Check Attempt to Connect",
          defaultNextActionId: 12,
          connectionType: "LIST_BRANCH",
        },
        actionType: "LIST_BRANCH",
        portalId: 9360603,
        flowId: 255370371,
        flowVersion: 0,
        actionTypeId: "0-7",
      },
      12: {
        actionId: 12,
        metadata: {
          actionType: "LIST_BRANCH",
        },
        connection: {
          listBranches: [
            {
              listId: 7391,
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
                          values: ["Attempt to connect"],
                          defaultValue: "",
                          includeObjectsWithNoValueSet: false,
                          operationType: "enumeration",
                          operatorName: "HAS_NEVER_BEEN_ANY_OF",
                        },
                        frameworkFilterId: null,
                      },
                      // {
                      //   listId: 2204,
                      //   operator: "IN_LIST",
                      //   metadata: {
                      //     inListType: "WORKFLOWS_ENROLLMENT",
                      //     id: "36959864",
                      //   },
                      //   frameworkFilterId: null,
                      //   filterType: "IN_LIST",
                      // },
                    ],
                    filterBranches: [],
                    filterBranchType: "AND",
                  },
                  {
                    filterBranchOperator: "AND",
                    filters: [
                      {
                        filterType: "PROPERTY",
                        property: "hs_lead_status",
                        operation: {
                          propertyType: "enumeration",
                          operator: "HAS_NEVER_BEEN_ANY_OF",
                          values: ["Attempt to connect"],
                          defaultValue: "",
                          includeObjectsWithNoValueSet: false,
                          operationType: "enumeration",
                          operatorName: "HAS_NEVER_BEEN_ANY_OF",
                        },
                        frameworkFilterId: null,
                      },
                      // {
                      //   listId: 2213,
                      //   operator: "IN_LIST",
                      //   metadata: {
                      //     inListType: "WORKFLOWS_ENROLLMENT",
                      //     id: "36959870",
                      //   },
                      //   frameworkFilterId: null,
                      //   filterType: "IN_LIST",
                      // },
                    ],
                    filterBranches: [],
                    filterBranchType: "AND",
                  },
                ],
                filterBranchType: "OR",
              },
              connection: {
                nextActionId: 29,
                edgeType: "STANDARD",
                connectionType: "SINGLE",
              },
              branchName: "Reset Attempt",
              nextActionId: 29,
            },
          ],
          defaultConnection: {
            nextActionId: 22,
            edgeType: "STANDARD",
            connectionType: "SINGLE",
          },
          defaultBranchName: "Check Connected",
          defaultNextActionId: 22,
          connectionType: "LIST_BRANCH",
        },
        actionType: "LIST_BRANCH",
        portalId: 9360603,
        flowId: 255370371,
        flowVersion: 0,
        actionTypeId: "0-7",
      },
      18: {
        actionId: 18,
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
          nextActionId: 20,
          edgeType: "STANDARD",
          connectionType: "SINGLE",
        },
        actionType: "SET_PROPERTY",
        portalId: 9360603,
        flowId: 255370371,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
      19: {
        actionId: 19,
        metadata: {
          targetProperty: {
            propertyName: "hs_lead_status",
            source: "OBJECT",
          },
          value: {
            type: "STATIC_VALUE",
            value: "Attempt to connect",
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
        flowId: 255370371,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
      20: {
        actionId: 20,
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
          nextActionId: 12,
          edgeType: "GOTO",
          connectionType: "SINGLE",
        },
        actionType: "DELAY",
        portalId: 9360603,
        flowId: 255370371,
        flowVersion: 0,
        actionTypeId: "0-1",
      },
      21: {
        actionId: 21,
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
          nextActionId: 22,
          edgeType: "GOTO",
          connectionType: "SINGLE",
        },
        actionType: "DELAY",
        portalId: 9360603,
        flowId: 255370371,
        flowVersion: 0,
        actionTypeId: "0-1",
      },
      22: {
        actionId: 22,
        metadata: {
          actionType: "LIST_BRANCH",
        },
        connection: {
          listBranches: [
            {
              listId: 6663,
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
                          values: ["Connected"],
                          defaultValue: "",
                          includeObjectsWithNoValueSet: false,
                          operationType: "enumeration",
                          operatorName: "HAS_NEVER_BEEN_ANY_OF",
                        },
                        frameworkFilterId: null,
                      },
                      // {
                      //   listId: 2213,
                      //   operator: "IN_LIST",
                      //   metadata: {
                      //     inListType: "WORKFLOWS_ENROLLMENT",
                      //     id: "36959870",
                      //   },
                      //   frameworkFilterId: null,
                      //   filterType: "IN_LIST",
                      // },
                    ],
                    filterBranches: [],
                    filterBranchType: "AND",
                  },
                ],
                filterBranchType: "OR",
              },
              connection: {
                nextActionId: 31,
                edgeType: "STANDARD",
                connectionType: "SINGLE",
              },
              branchName: "Reset Connect",
              nextActionId: 31,
            },
          ],
          defaultConnection: {
            nextActionId: 25,
            edgeType: "STANDARD",
            connectionType: "SINGLE",
          },
          defaultBranchName: "Set Open Deal ",
          defaultNextActionId: 25,
          connectionType: "LIST_BRANCH",
        },
        actionType: "LIST_BRANCH",
        portalId: 9360603,
        flowId: 255370371,
        flowVersion: 0,
        actionTypeId: "0-7",
      },
      24: {
        actionId: 24,
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
          nextActionId: 27,
          edgeType: "STANDARD",
          connectionType: "SINGLE",
        },
        actionType: "SET_PROPERTY",
        portalId: 9360603,
        flowId: 255370371,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
      25: {
        actionId: 25,
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
        flowId: 255370371,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
      27: {
        actionId: 27,
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
          nextActionId: 25,
          edgeType: "GOTO",
          connectionType: "SINGLE",
        },
        actionType: "DELAY",
        portalId: 9360603,
        flowId: 255370371,
        flowVersion: 0,
        actionTypeId: "0-1",
      },
      29: {
        actionId: 29,
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
          nextActionId: 30,
          edgeType: "STANDARD",
          connectionType: "SINGLE",
        },
        actionType: "SET_PROPERTY",
        portalId: 9360603,
        flowId: 255370371,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
      30: {
        actionId: 30,
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
          nextActionId: 19,
          edgeType: "STANDARD",
          connectionType: "SINGLE",
        },
        actionType: "SET_PROPERTY",
        portalId: 9360603,
        flowId: 255370371,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
      31: {
        actionId: 31,
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
          nextActionId: 32,
          edgeType: "STANDARD",
          connectionType: "SINGLE",
        },
        actionType: "SET_PROPERTY",
        portalId: 9360603,
        flowId: 255370371,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
      32: {
        actionId: 32,
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
          nextActionId: 24,
          edgeType: "STANDARD",
          connectionType: "SINGLE",
        },
        actionType: "SET_PROPERTY",
        portalId: 9360603,
        flowId: 255370371,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
    },
    classicEnrollmentSettings: {
      eventAnchor: null,
      recurAnnually: false,
      reEnrollmentTriggerSets: [
        [
          {
            id: "lifecyclestage",
            type: "CONTACT_PROPERTY_NAME",
          },
        ],
        [
          {
            id: "num_associated_deals",
            type: "CONTACT_PROPERTY_NAME",
          },
        ],
      ],
      enrollOnCriteriaUpdate: false,
      listening: false,
      suppressionListIds: [],
      unenrollmentSetting: {
        type: "SELECTIVE",
        excludedWorkflows: [36959897, 36959864, 36959870, 37299714, 37471201],
      },
      internalStartingListId: 2107,
      internalGoalListId: null,
      allowContactToTriggerMultipleTimes: true,
      segmentCriteria: [
        [
          {
            filterFamily: "DealProperty",
            dealsFilter: {
              filterLines: [
                {
                  dealSelector: "ALL",
                  filter: {
                    property: "createdate",
                    type: "datetime",
                    operator: "IS_NOT_EMPTY",
                    filterFamily: "DealProperty",
                    propertyObjectType: "DEAL",
                    withinTimeMode: "PAST",
                  },
                },
              ],
            },
            withinTimeMode: "PAST",
          },
          {
            property: "num_associated_deals",
            type: "number",
            operator: "IS_NOT_EMPTY",
            filterFamily: "PropertyValue",
            withinTimeMode: "PAST",
          },
        ],
        [
          {
            property: "lifecyclestage",
            value: "salesqualifiedlead;opportunity;customer;33086390;33089671",
            type: "enumeration",
            operator: "SET_ANY",
            filterFamily: "PropertyValue",
            withinTimeMode: "PAST",
          },
          {
            property: "lifecyclestage",
            type: "enumeration",
            operator: "IS_NOT_EMPTY",
            filterFamily: "PropertyValue",
            withinTimeMode: "PAST",
          },
        ],
      ],
      goalCriteria: [],
      enrollmentFilters: [
        {
          ands: [
            {
              withinLastTimeMode: "PAST",
              dealsFilter: {
                filterLines: [
                  {
                    dealSelector: "ALL",
                    filter: {
                      property: "createdate",
                      operator: "IS_NOT_EMPTY",
                      type: "datetime",
                      propertyObjectType: "DEAL",
                      withinLastTimeMode: "PAST",
                      filterFamily: "DealProperty",
                    },
                  },
                ],
              },
              filterFamily: "DealProperty",
            },
            {
              property: "num_associated_deals",
              operator: "IS_NOT_EMPTY",
              type: "number",
              withinLastTimeMode: "PAST",
              filterFamily: "PropertyValue",
            },
          ],
        },
        {
          ands: [
            {
              property: "lifecyclestage",
              operator: "SET_ANY",
              type: "enumeration",
              strValue:
                "salesqualifiedlead;opportunity;customer;33086390;33089671",
              withinLastTimeMode: "PAST",
              filterFamily: "PropertyValue",
            },
            {
              property: "lifecyclestage",
              operator: "IS_NOT_EMPTY",
              type: "enumeration",
              withinLastTimeMode: "PAST",
              filterFamily: "PropertyValue",
            },
          ],
        },
      ],
      goalFilters: [],
      allowEnrollmentFromMerge: false,
      canEnrollFromSalesforce: false,
      workflowId: 36959872,
    },
    associatedLists: [
      // {
      //   portalId: 9360603,
      //   listId: 3311,
      //   flowId: 255370371,
      //   filterBranch: {
      //     filterBranchOperator: "OR",
      //     filters: [],
      //     filterBranches: [
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
      //             associationTypeId: 4,
      //             objectType: "DEAL",
      //             objectTypeId: "0-3",
      //             operator: "IN_LIST",
      //             coalescingRefineBy: {
      //               setType: "ANY",
      //               type: "SetOccurrencesRefineBy",
      //             },
      //             associationListId: 6677,
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
      //           {
      //             filterType: "PROPERTY",
      //             property: "lifecyclestage",
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
      //     ],
      //     filterBranchType: "OR",
      //   },
      //   listTypes: ["ENROLLMENT_LIST"],
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
                associationTypeId: 4,
                objectType: "DEAL",
                objectTypeId: "0-3",
                operator: "IN_LIST",
                coalescingRefineBy: {
                  setType: "ANY",
                  type: "SetOccurrencesRefineBy",
                },
                associationListId: 6677,
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
              {
                filterType: "PROPERTY",
                property: "lifecyclestage",
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
        ],
        filterBranchType: "OR",
      },
    },
    enrollmentTrigger: "LIST",
  },
  {
    isEnabled: false,
    uuid: "[02.07. Contact Lead status] Sequence ended date = Know  AND Create date = Know → Connect-255370005",
    name: "[LEGACY] [02.07. Lead Status] Sequence Finished → Unqualified Reason = Unable to Connect",
    firstActionId: 22,
    timeWindow: null,
    enrollmentSchedule: null,
    shouldReenroll: true,
    flowObjectType: "CONTACT",
    objectTypeId: "0-1",
    portalId: 9360603,
    flowId: 255370005,
    createMetadata: {
      updatedBy: {
        userId: 44593095,
        hubspotterId: null,
      },
      updatedAt: 1663361773480,
      referrer:
        "https://app.hubspot.com/workflows/9360603/view/deleted?name=lead%20status",
      originRequestId: null,
      integrationId: null,
      jobName: null,
      internalJobUpdateTime: null,
      sourceApp: "WORKFLOWS_APP",
      cloneMetadata: {
        flowId: 252015629,
        version: 15,
      },
      templateMetadata: null,
    },
    updateMetadata: {
      updatedBy: {
        userId: 9534005,
        hubspotterId: null,
      },
      updatedAt: 1683140811882,
      referrer:
        "https://app.hubspot.com/workflows/9360603/platform/flow/255370005/edit",
      originRequestId: null,
      integrationId: null,
      jobName: null,
      internalJobUpdateTime: null,
      sourceApp: "WORKFLOWS_APP",
      cloneMetadata: null,
      templateMetadata: null,
    },
    isClassicWorkflow: true,
    nextAvailableActionId: 27,
    version: 86,
    actions: {
      12: {
        actionId: 12,
        metadata: {
          targetProperty: {
            propertyName: "unqualified_reason",
            source: "OBJECT",
          },
          value: {
            type: "STATIC_VALUE",
            value: "Unable to connect (auto)",
          },
          actionType: "SET_PROPERTY",
        },
        connection: null,
        actionType: "SET_PROPERTY",
        portalId: 9360603,
        flowId: 255370005,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
      14: {
        actionId: 14,
        metadata: {
          targetObjectOverride: null,
          eventFilters: [
            {
              updateType: "CREATE",
              eventFilterId: {
                id: 101510504,
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
                        value: "hs_latest_sequence_ended_date",
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
              listId: null,
            },
          ],
          expiration: {
            delta: 20160,
            timeUnit: "MINUTES",
            timeOfDay: null,
            daysOfWeek: [],
            optionalTimeZoneStrategy: null,
          },
          actionType: "WAIT_UNTIL",
        },
        connection: {
          nextActionId: 15,
          edgeType: "STANDARD",
          connectionType: "SINGLE",
        },
        actionType: "WAIT_UNTIL",
        portalId: 9360603,
        flowId: 255370005,
        flowVersion: 75,
        actionTypeId: "0-29",
      },
      15: {
        actionId: 15,
        metadata: {
          inputValue: {
            type: "FIELD_DATA",
            identifier: {
              actionId: 14,
              dataKey: "hs_event_criteria_met",
              type: "ACTION",
            },
          },
          actionType: "STATIC_BRANCH",
        },
        connection: {
          connections: [
            {
              value: "true",
              connection: {
                nextActionId: 25,
                edgeType: "STANDARD",
                connectionType: "SINGLE",
              },
            },
          ],
          defaultConnection: {
            nextActionId: 17,
            edgeType: "STANDARD",
            connectionType: "SINGLE",
          },
          defaultBranchName: "Logic exception",
          connectionType: "STATIC_BRANCH",
        },
        actionType: "STATIC_BRANCH",
        portalId: 9360603,
        flowId: 255370005,
        flowVersion: 70,
        actionTypeId: "0-6",
      },
      17: {
        actionId: 17,
        metadata: {
          text: "A contact is in a sequence for more than two weeks, something is wrong with it's execution.\n\nRecord ID: {{ _0_1.hs_object_id }}\nEmail: {{ _0_1.email }}\nOwner: {{ _0_1.hubspot_owner_id }}",
          channelIds: [],
          slackChannelIds: [],
          slackUserIds: [],
          recipientOwnerProperties: ["hubspot_owner_id"],
          objectProperties: [],
          actionType: "SLACK_NOTIFICATION",
        },
        connection: {
          nextActionId: 25,
          edgeType: "GOTO",
          connectionType: "SINGLE",
        },
        actionType: "SLACK_NOTIFICATION",
        portalId: 9360603,
        flowId: 255370005,
        flowVersion: 76,
        actionTypeId: "0-10",
      },
      22: {
        actionId: 22,
        metadata: {
          actionType: "LIST_BRANCH",
        },
        connection: {
          listBranches: [
            {
              listId: 7387,
              filterBranch: {
                filterBranchOperator: "OR",
                filters: [],
                filterBranches: [
                  {
                    filterBranchOperator: "AND",
                    filters: [
                      {
                        filterType: "PROPERTY",
                        property: "hs_sequences_is_enrolled",
                        operation: {
                          propertyType: "bool",
                          operator: "IS_EQUAL_TO",
                          value: true,
                          defaultValue: null,
                          includeObjectsWithNoValueSet: false,
                          operationType: "bool",
                          operatorName: "IS_EQUAL_TO",
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
              connection: {
                nextActionId: 23,
                edgeType: "STANDARD",
                connectionType: "SINGLE",
              },
              branchName: "Remained in sequence",
              nextActionId: 23,
            },
          ],
          defaultConnection: null,
          defaultBranchName: "Was removed",
          defaultNextActionId: null,
          connectionType: "LIST_BRANCH",
        },
        actionType: "LIST_BRANCH",
        portalId: 9360603,
        flowId: 255370005,
        flowVersion: 79,
        actionTypeId: "0-7",
      },
      23: {
        actionId: 23,
        metadata: {
          targetObjectOverride: null,
          eventFilters: [
            {
              updateType: "CREATE",
              eventFilterId: {
                id: 102990659,
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
                        value: "hs_latest_sequence_ended_date",
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
              listId: null,
            },
          ],
          expiration: {
            delta: 180,
            timeUnit: "MINUTES",
            timeOfDay: null,
            daysOfWeek: [],
            optionalTimeZoneStrategy: null,
          },
          actionType: "WAIT_UNTIL",
        },
        connection: {
          nextActionId: 24,
          edgeType: "STANDARD",
          connectionType: "SINGLE",
        },
        actionType: "WAIT_UNTIL",
        portalId: 9360603,
        flowId: 255370005,
        flowVersion: 64,
        actionTypeId: "0-29",
      },
      24: {
        actionId: 24,
        metadata: {
          inputValue: {
            type: "FIELD_DATA",
            identifier: {
              actionId: 23,
              dataKey: "hs_event_criteria_met",
              type: "ACTION",
            },
          },
          actionType: "STATIC_BRANCH",
        },
        connection: {
          connections: [
            {
              value: "true",
              connection: null,
            },
          ],
          defaultConnection: {
            nextActionId: 14,
            edgeType: "STANDARD",
            connectionType: "SINGLE",
          },
          defaultBranchName: "Still in sequence",
          connectionType: "STATIC_BRANCH",
        },
        actionType: "STATIC_BRANCH",
        portalId: 9360603,
        flowId: 255370005,
        flowVersion: 66,
        actionTypeId: "0-6",
      },
      25: {
        actionId: 25,
        metadata: {
          targetObjectOverride: null,
          eventFilters: [
            {
              updateType: "CREATE",
              eventFilterId: {
                id: 102991226,
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
                        value: "unqualified_reason",
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
              listId: null,
            },
          ],
          expiration: {
            delta: 4320,
            timeUnit: "MINUTES",
            timeOfDay: null,
            daysOfWeek: [],
            optionalTimeZoneStrategy: null,
          },
          actionType: "WAIT_UNTIL",
        },
        connection: {
          nextActionId: 26,
          edgeType: "STANDARD",
          connectionType: "SINGLE",
        },
        actionType: "WAIT_UNTIL",
        portalId: 9360603,
        flowId: 255370005,
        flowVersion: 74,
        actionTypeId: "0-29",
      },
      26: {
        actionId: 26,
        metadata: {
          inputValue: {
            type: "FIELD_DATA",
            identifier: {
              actionId: 25,
              dataKey: "hs_event_criteria_met",
              type: "ACTION",
            },
          },
          actionType: "STATIC_BRANCH",
        },
        connection: {
          connections: [
            {
              value: "true",
              connection: null,
            },
          ],
          defaultConnection: {
            nextActionId: 12,
            edgeType: "STANDARD",
            connectionType: "SINGLE",
          },
          defaultBranchName: "Unqualified",
          connectionType: "STATIC_BRANCH",
        },
        actionType: "STATIC_BRANCH",
        portalId: 9360603,
        flowId: 255370005,
        flowVersion: 82,
        actionTypeId: "0-6",
      },
    },
    classicEnrollmentSettings: {
      eventAnchor: null,
      recurAnnually: false,
      reEnrollmentTriggerSets: [
        [
          {
            id: "hs_latest_sequence_enrolled_date",
            type: "CONTACT_PROPERTY_NAME",
          },
        ],
      ],
      enrollOnCriteriaUpdate: false,
      listening: false,
      suppressionListIds: [],
      unenrollmentSetting: {
        type: "NONE",
        excludedWorkflows: [],
      },
      internalStartingListId: 1711,
      internalGoalListId: 1712,
      allowContactToTriggerMultipleTimes: true,
      segmentCriteria: [
        [
          {
            property: "hs_latest_sequence_enrolled_date",
            type: "datetime",
            operator: "IS_NOT_EMPTY",
            filterFamily: "PropertyValue",
            withinTimeMode: "PAST",
          },
        ],
      ],
      goalCriteria: [
        [
          {
            property: "hs_lead_status",
            value: "Open deal;Connected;Unqualified;Recycle",
            type: "enumeration",
            operator: "SET_ANY",
            filterFamily: "PropertyValue",
            withinTimeMode: "PAST",
          },
        ],
      ],
      enrollmentFilters: [
        {
          ands: [
            {
              property: "hs_latest_sequence_enrolled_date",
              operator: "IS_NOT_EMPTY",
              type: "datetime",
              withinLastTimeMode: "PAST",
              filterFamily: "PropertyValue",
            },
          ],
        },
      ],
      goalFilters: [
        {
          ands: [
            {
              property: "hs_lead_status",
              operator: "SET_ANY",
              type: "enumeration",
              strValue: "Open deal;Connected;Unqualified;Recycle",
              withinLastTimeMode: "PAST",
              filterFamily: "PropertyValue",
            },
          ],
        },
      ],
      allowEnrollmentFromMerge: false,
      canEnrollFromSalesforce: false,
      workflowId: 36959853,
    },
    associatedLists: [
      // {
      //   portalId: 9360603,
      //   listId: 2193,
      //   flowId: 255370005,
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
      //                 "Recycle",
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
      //     ],
      //     filterBranchType: "OR",
      //   },
      //   listTypes: ["CLASSIC_GOAL_LIST"],
      // },
      // {
      //   portalId: 9360603,
      //   listId: 2192,
      //   flowId: 255370005,
      //   filterBranch: {
      //     filterBranchOperator: "OR",
      //     filters: [],
      //     filterBranches: [
      //       {
      //         filterBranchOperator: "AND",
      //         filters: [
      //           {
      //             filterType: "PROPERTY",
      //             property: "hs_latest_sequence_enrolled_date",
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
      //     ],
      //     filterBranchType: "OR",
      //   },
      //   listTypes: ["ENROLLMENT_LIST"],
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
                property: "hs_latest_sequence_enrolled_date",
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
        ],
        filterBranchType: "OR",
      },
    },
    enrollmentTrigger: "LIST",
  },
  {
    isEnabled: false,
    uuid: "[02.06. Contact Lead status] Unqualified reason → Lead status = Unqualified-261268309",
    name: "[LEGACY] [02.08. Lead Status] Unqualified Reason = Known → Lead Status = Unqualified",
    firstActionId: 11,
    timeWindow: null,
    enrollmentSchedule: null,
    shouldReenroll: true,
    flowObjectType: "CONTACT",
    objectTypeId: "0-1",
    portalId: 9360603,
    flowId: 261268309,
    createMetadata: {
      updatedBy: {
        userId: 44593095,
        hubspotterId: null,
      },
      updatedAt: 1664552520090,
      referrer:
        "https://app.hubspot.com/workflows/9360603/view/default?sortBy=name&sortOrder=descending&name=02.04&pageSize=100",
      originRequestId: null,
      integrationId: null,
      jobName: null,
      internalJobUpdateTime: null,
      sourceApp: "WORKFLOWS_APP",
      cloneMetadata: {
        flowId: 255370371,
        version: 58,
      },
      templateMetadata: null,
    },
    updateMetadata: {
      updatedBy: {
        userId: 9534005,
        hubspotterId: null,
      },
      updatedAt: 1683140824682,
      referrer:
        "https://app.hubspot.com/workflows/9360603/platform/flow/261268309/edit",
      originRequestId: null,
      integrationId: null,
      jobName: null,
      internalJobUpdateTime: null,
      sourceApp: "WORKFLOWS_APP",
      cloneMetadata: null,
      templateMetadata: null,
    },
    isClassicWorkflow: true,
    nextAvailableActionId: 34,
    version: 50,
    actions: {
      11: {
        actionId: 11,
        metadata: {
          actionType: "LIST_BRANCH",
        },
        connection: {
          listBranches: [
            {
              listId: 7400,
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
                          values: ["New"],
                          defaultValue: "",
                          includeObjectsWithNoValueSet: false,
                          operatorName: "HAS_NEVER_BEEN_ANY_OF",
                          operationType: "enumeration",
                        },
                        frameworkFilterId: null,
                      },
                      {
                        filterType: "PROPERTY",
                        property: "lifecyclestage",
                        operation: {
                          propertyType: "enumeration",
                          operator: "HAS_EVER_BEEN_ANY_OF",
                          values: ["marketingqualifiedlead", "lead"],
                          defaultValue: null,
                          includeObjectsWithNoValueSet: false,
                          operatorName: "HAS_EVER_BEEN_ANY_OF",
                          operationType: "enumeration",
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
                        property: "hs_lead_status",
                        operation: {
                          propertyType: "enumeration",
                          operator: "HAS_NEVER_BEEN_ANY_OF",
                          values: ["New"],
                          defaultValue: "",
                          includeObjectsWithNoValueSet: false,
                          operatorName: "HAS_NEVER_BEEN_ANY_OF",
                          operationType: "enumeration",
                        },
                        frameworkFilterId: null,
                      },
                      // {
                      //   listId: 2204,
                      //   operator: "IN_LIST",
                      //   metadata: {
                      //     inListType: "WORKFLOWS_ENROLLMENT",
                      //     id: "36959864",
                      //   },
                      //   frameworkFilterId: null,
                      //   filterType: "IN_LIST",
                      // },
                    ],
                    filterBranches: [],
                    filterBranchType: "AND",
                  },
                  {
                    filterBranchOperator: "AND",
                    filters: [
                      {
                        filterType: "PROPERTY",
                        property: "hs_lead_status",
                        operation: {
                          propertyType: "enumeration",
                          operator: "HAS_NEVER_BEEN_ANY_OF",
                          values: ["New"],
                          defaultValue: "",
                          includeObjectsWithNoValueSet: false,
                          operatorName: "HAS_NEVER_BEEN_ANY_OF",
                          operationType: "enumeration",
                        },
                        frameworkFilterId: null,
                      },
                      // {
                      //   listId: 2213,
                      //   operator: "IN_LIST",
                      //   metadata: {
                      //     inListType: "WORKFLOWS_ENROLLMENT",
                      //     id: "36959870",
                      //   },
                      //   frameworkFilterId: null,
                      //   filterType: "IN_LIST",
                      // },
                    ],
                    filterBranches: [],
                    filterBranchType: "AND",
                  },
                ],
                filterBranchType: "OR",
              },
              connection: {
                nextActionId: 18,
                edgeType: "STANDARD",
                connectionType: "SINGLE",
              },
              branchName: "Reset New",
              nextActionId: 18,
            },
          ],
          defaultConnection: {
            nextActionId: 12,
            edgeType: "STANDARD",
            connectionType: "SINGLE",
          },
          defaultBranchName: "Check Attempt to Connect",
          defaultNextActionId: 12,
          connectionType: "LIST_BRANCH",
        },
        actionType: "LIST_BRANCH",
        portalId: 9360603,
        flowId: 261268309,
        flowVersion: 0,
        actionTypeId: "0-7",
      },
      12: {
        actionId: 12,
        metadata: {
          actionType: "LIST_BRANCH",
        },
        connection: {
          listBranches: [
            {
              listId: 7401,
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
                          values: ["Attempt to connect"],
                          defaultValue: "",
                          includeObjectsWithNoValueSet: false,
                          operatorName: "HAS_NEVER_BEEN_ANY_OF",
                          operationType: "enumeration",
                        },
                        frameworkFilterId: null,
                      },
                      // {
                      //   listId: 2204,
                      //   operator: "IN_LIST",
                      //   metadata: {
                      //     inListType: "WORKFLOWS_ENROLLMENT",
                      //     id: "36959864",
                      //   },
                      //   frameworkFilterId: null,
                      //   filterType: "IN_LIST",
                      // },
                    ],
                    filterBranches: [],
                    filterBranchType: "AND",
                  },
                  {
                    filterBranchOperator: "AND",
                    filters: [
                      {
                        filterType: "PROPERTY",
                        property: "hs_lead_status",
                        operation: {
                          propertyType: "enumeration",
                          operator: "HAS_NEVER_BEEN_ANY_OF",
                          values: ["Attempt to connect"],
                          defaultValue: "",
                          includeObjectsWithNoValueSet: false,
                          operatorName: "HAS_NEVER_BEEN_ANY_OF",
                          operationType: "enumeration",
                        },
                        frameworkFilterId: null,
                      },
                      // {
                      //   listId: 2213,
                      //   operator: "IN_LIST",
                      //   metadata: {
                      //     inListType: "WORKFLOWS_ENROLLMENT",
                      //     id: "36959870",
                      //   },
                      //   frameworkFilterId: null,
                      //   filterType: "IN_LIST",
                      // },
                    ],
                    filterBranches: [],
                    filterBranchType: "AND",
                  },
                ],
                filterBranchType: "OR",
              },
              connection: {
                nextActionId: 28,
                edgeType: "STANDARD",
                connectionType: "SINGLE",
              },
              branchName: "Reset Attempted to Connect",
              nextActionId: 28,
            },
          ],
          defaultConnection: {
            nextActionId: 22,
            edgeType: "STANDARD",
            connectionType: "SINGLE",
          },
          defaultBranchName: "Set Unqualified",
          defaultNextActionId: 22,
          connectionType: "LIST_BRANCH",
        },
        actionType: "LIST_BRANCH",
        portalId: 9360603,
        flowId: 261268309,
        flowVersion: 40,
        actionTypeId: "0-7",
      },
      18: {
        actionId: 18,
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
          nextActionId: 20,
          edgeType: "STANDARD",
          connectionType: "SINGLE",
        },
        actionType: "SET_PROPERTY",
        portalId: 9360603,
        flowId: 261268309,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
      19: {
        actionId: 19,
        metadata: {
          targetProperty: {
            propertyName: "hs_lead_status",
            source: "OBJECT",
          },
          value: {
            type: "STATIC_VALUE",
            value: "Attempt to connect",
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
        flowId: 261268309,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
      20: {
        actionId: 20,
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
          nextActionId: 12,
          edgeType: "GOTO",
          connectionType: "SINGLE",
        },
        actionType: "DELAY",
        portalId: 9360603,
        flowId: 261268309,
        flowVersion: 0,
        actionTypeId: "0-1",
      },
      21: {
        actionId: 21,
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
          nextActionId: 22,
          edgeType: "GOTO",
          connectionType: "SINGLE",
        },
        actionType: "DELAY",
        portalId: 9360603,
        flowId: 261268309,
        flowVersion: 0,
        actionTypeId: "0-1",
      },
      22: {
        actionId: 22,
        metadata: {
          actionType: "LIST_BRANCH",
        },
        connection: {
          listBranches: [
            {
              listId: 6668,
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
                          values: ["Connected"],
                          defaultValue: "",
                          includeObjectsWithNoValueSet: false,
                          operatorName: "HAS_NEVER_BEEN_ANY_OF",
                          operationType: "enumeration",
                        },
                        frameworkFilterId: null,
                      },
                      // {
                      //   listId: 2213,
                      //   operator: "IN_LIST",
                      //   metadata: {
                      //     inListType: "WORKFLOWS_ENROLLMENT",
                      //     id: "36959870",
                      //   },
                      //   frameworkFilterId: null,
                      //   filterType: "IN_LIST",
                      // },
                    ],
                    filterBranches: [],
                    filterBranchType: "AND",
                  },
                ],
                filterBranchType: "OR",
              },
              connection: {
                nextActionId: 30,
                edgeType: "STANDARD",
                connectionType: "SINGLE",
              },
              branchName: "Reset Connected",
              nextActionId: 30,
            },
          ],
          defaultConnection: {
            nextActionId: 32,
            edgeType: "STANDARD",
            connectionType: "SINGLE",
          },
          defaultBranchName: "Set Unqualified",
          defaultNextActionId: 32,
          connectionType: "LIST_BRANCH",
        },
        actionType: "LIST_BRANCH",
        portalId: 9360603,
        flowId: 261268309,
        flowVersion: 0,
        actionTypeId: "0-7",
      },
      24: {
        actionId: 24,
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
          nextActionId: 27,
          edgeType: "STANDARD",
          connectionType: "SINGLE",
        },
        actionType: "SET_PROPERTY",
        portalId: 9360603,
        flowId: 261268309,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
      25: {
        actionId: 25,
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
        flowId: 261268309,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
      27: {
        actionId: 27,
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
          nextActionId: 32,
          edgeType: "GOTO",
          connectionType: "SINGLE",
        },
        actionType: "DELAY",
        portalId: 9360603,
        flowId: 261268309,
        flowVersion: 0,
        actionTypeId: "0-1",
      },
      28: {
        actionId: 28,
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
          nextActionId: 29,
          edgeType: "STANDARD",
          connectionType: "SINGLE",
        },
        actionType: "SET_PROPERTY",
        portalId: 9360603,
        flowId: 261268309,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
      29: {
        actionId: 29,
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
          nextActionId: 19,
          edgeType: "STANDARD",
          connectionType: "SINGLE",
        },
        actionType: "SET_PROPERTY",
        portalId: 9360603,
        flowId: 261268309,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
      30: {
        actionId: 30,
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
          nextActionId: 31,
          edgeType: "STANDARD",
          connectionType: "SINGLE",
        },
        actionType: "SET_PROPERTY",
        portalId: 9360603,
        flowId: 261268309,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
      31: {
        actionId: 31,
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
          nextActionId: 24,
          edgeType: "STANDARD",
          connectionType: "SINGLE",
        },
        actionType: "SET_PROPERTY",
        portalId: 9360603,
        flowId: 261268309,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
      32: {
        actionId: 32,
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
          nextActionId: 33,
          edgeType: "STANDARD",
          connectionType: "SINGLE",
        },
        actionType: "SET_PROPERTY",
        portalId: 9360603,
        flowId: 261268309,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
      33: {
        actionId: 33,
        metadata: {
          targetProperty: {
            propertyName: "unqulified_rate",
            source: "OBJECT",
          },
          value: {
            type: "STATIC_VALUE",
            value: "Yes",
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
        flowId: 261268309,
        flowVersion: 0,
        actionTypeId: "0-5",
      },
    },
    classicEnrollmentSettings: {
      eventAnchor: null,
      recurAnnually: false,
      reEnrollmentTriggerSets: [
        [
          {
            id: "qualified_meeting_trigger",
            type: "CONTACT_PROPERTY_NAME",
          },
          {
            id: "No",
            type: "CONTACT_PROPERTY_VALUE",
          },
        ],
        [
          {
            id: "unqualified_reason",
            type: "CONTACT_PROPERTY_NAME",
          },
        ],
      ],
      enrollOnCriteriaUpdate: false,
      listening: false,
      suppressionListIds: [],
      unenrollmentSetting: {
        type: "SELECTIVE",
        excludedWorkflows: [36959897, 36959864, 36959870, 36959872, 37471201],
      },
      internalStartingListId: 2331,
      internalGoalListId: null,
      allowContactToTriggerMultipleTimes: true,
      segmentCriteria: [
        [
          {
            property: "unqualified_reason",
            type: "enumeration",
            filterFamily: "PropertyValue",
            withinTimeMode: "PAST",
            operator: "IS_NOT_EMPTY",
          },
        ],
        [
          {
            property: "qualified_meeting_trigger",
            value: "No",
            type: "enumeration",
            filterFamily: "PropertyValue",
            withinTimeMode: "PAST",
            operator: "SET_ANY",
          },
        ],
        [
          {
            property: "hs_lead_status",
            value: "Unqualified",
            type: "enumeration",
            propertyObjectType: "COMPANY",
            filterFamily: "CompanyPropertyValue",
            withinTimeMode: "PAST",
            operator: "SET_ANY",
          },
        ],
      ],
      goalCriteria: [],
      enrollmentFilters: [
        {
          ands: [
            {
              property: "unqualified_reason",
              operator: "IS_NOT_EMPTY",
              type: "enumeration",
              withinLastTimeMode: "PAST",
              filterFamily: "PropertyValue",
            },
          ],
        },
        {
          ands: [
            {
              property: "qualified_meeting_trigger",
              operator: "SET_ANY",
              type: "enumeration",
              strValue: "No",
              withinLastTimeMode: "PAST",
              filterFamily: "PropertyValue",
            },
          ],
        },
        {
          ands: [
            {
              property: "hs_lead_status",
              operator: "SET_ANY",
              type: "enumeration",
              strValue: "Unqualified",
              propertyObjectType: "COMPANY",
              withinLastTimeMode: "PAST",
              filterFamily: "CompanyPropertyValue",
            },
          ],
        },
      ],
      goalFilters: [],
      allowEnrollmentFromMerge: false,
      canEnrollFromSalesforce: false,
      workflowId: 37299714,
    },
    associatedLists: [
      // {
      //   portalId: 9360603,
      //   listId: 3944,
      //   flowId: 261268309,
      //   filterBranch: {
      //     filterBranchOperator: "OR",
      //     filters: [],
      //     filterBranches: [
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
      //                   values: ["Unqualified"],
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
      //             associationTypeId: 1,
      //             objectType: "COMPANY",
      //             objectTypeId: "0-2",
      //             operator: "IN_LIST",
      //             coalescingRefineBy: {
      //               setType: "ANY",
      //               type: "SetOccurrencesRefineBy",
      //             },
      //             associationListId: 4342,
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
      //             property: "qualified_meeting_trigger",
      //             operation: {
      //               propertyType: "enumeration",
      //               operator: "IS_ANY_OF",
      //               values: ["No"],
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
      //     ],
      //     filterBranchType: "OR",
      //   },
      //   listTypes: ["ENROLLMENT_LIST"],
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
                  operatorName: "IS_KNOWN",
                  operationType: "alltypes",
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
                      values: ["Unqualified"],
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
                associationTypeId: 1,
                objectType: "COMPANY",
                objectTypeId: "0-2",
                operator: "IN_LIST",
                coalescingRefineBy: {
                  setType: "ANY",
                  type: "SetOccurrencesRefineBy",
                },
                associationListId: 4342,
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
                property: "qualified_meeting_trigger",
                operation: {
                  propertyType: "enumeration",
                  operator: "IS_ANY_OF",
                  values: ["No"],
                  defaultValue: null,
                  includeObjectsWithNoValueSet: false,
                  operatorName: "IS_ANY_OF",
                  operationType: "enumeration",
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
  },
];

// Obs.: comentei as partes dos requests acima que davam erro por conta das dependências circulares e outros erros

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
};

const portalId = window.location.toString().split(/[/?]/)?.[4]
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
