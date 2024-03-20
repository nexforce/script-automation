import requests
import os
from hubspot import HubSpot

hs_app = os.environ.get('hs_app')

# FUNCTIONS
# request associations
def REQUEST_ASSOCIATIONS(object_type, object_id, to_object_type):
  url = f'https://api.hubapi.com/crm/v4/objects/{object_type}/{object_id}/associations/{to_object_type}?limit=500'
  headers = {'authorization': f'Bearer {hs_app}'}

  req_association = requests.get(url, headers=headers)
  return req_association

# request a task
def REQUEST_A_TASK(task_id, hs_app):
  url = f'https://api.hubapi.com/crm/v3/objects/tasks/{task_id}?properties=hs_object_source&properties=hs_task_status&archived=false'
  headers = {'authorization': f'Bearer {hs_app}'}

  req_task = requests.get(url, headers=headers)
  return req_task

# delete a task
def DELETE_A_TASK(task_to_delete, hs_app):
  url = f'https://api.hubapi.com/crm/v3/objects/tasks/{task_to_delete}'
  headers = {'authorization': f'Bearer {hs_app}'}

  requests.delete(url, headers=headers)

# EXECUTION

# Hubspot default function
def main(event):
  object_id = str(event["inputFields"]["object_id"])

  object_type, to_object_type = 'leads', 'task'
  req_association = REQUEST_ASSOCIATIONS(object_type, object_id, to_object_type)

  for i in req_association.json()['results']:
    task_id = str(i['toObjectId'])
    req_task = REQUEST_A_TASK(task_id, hs_app)

    # select tasks with below parameters
    hs_object_source = req_task.json()['properties']['hs_object_source'] == 'AUTOMATION_PLATFORM'
    hs_task_status = req_task.json()['properties']['hs_task_status'] == 'NOT_STARTED'

    if hs_object_source and hs_task_status:
      task_to_delete = task_id
      DELETE_A_TASK(task_to_delete, hs_app)

  return {
  "outputFields": {
    "object_id": object_id
    }
  }