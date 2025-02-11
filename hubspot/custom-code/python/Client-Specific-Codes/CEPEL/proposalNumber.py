import requests
import os


HUBSPOT_API_KEY =  os.getenv("Hubspot_ProposalNumber")
HUBDB_TABLE_ID = "108441785" 
LAST_PROPOSAL_COLUMN = "last_proposal_number"
NEXT_PROPOSAL_COLUMN = "next_proposal_number"

BASE_URL = f"https://api.hubapi.com/cms/v3/hubdb/tables/{HUBDB_TABLE_ID}/rows"

headers = {
    "Authorization": f"Bearer {HUBSPOT_API_KEY}",
    "Content-Type": "application/json"
}


def get_proposal_numbers():
    try:
        response = requests.get(BASE_URL, headers=headers)
        response.raise_for_status()
        
        data = response.json()

        for row in data.get("results", []):
            if LAST_PROPOSAL_COLUMN in row["values"] and NEXT_PROPOSAL_COLUMN in row["values"]:
                return row["id"], row["values"][LAST_PROPOSAL_COLUMN], row["values"][NEXT_PROPOSAL_COLUMN]
        return None, None, None
    except Exception as e:
        print(f"Error getting proposal numbers: {e}")
        return None, None, None

def update_proposal_numbers(row_id, last_proposal, next_proposal):
    try:
        update_url = f"{BASE_URL}/{row_id}/draft"
        payload = {
            "values": {
                LAST_PROPOSAL_COLUMN: last_proposal,
                NEXT_PROPOSAL_COLUMN: next_proposal
            }
        }

        response = requests.patch(update_url, json=payload, headers=headers)
        response.raise_for_status()

        publish_url = f"https://api.hubapi.com/cms/v3/hubdb/tables/{HUBDB_TABLE_ID}/draft/publish"
        publish_response = requests.post(publish_url, headers=headers)
        publish_response.raise_for_status()
        return True
    except Exception as e:
        print(f"Error updating proposal numbers: {e}")
        return False

def main(event):
    try:
        row_id, last_proposal, next_proposal = get_proposal_numbers()
        
        if row_id is None:
            return {
                "outputFields": {
                    "last_proposal": 0,
                    "next_proposal": 0,
                    "error": "No data found in HubDB"
                }
            }

        current_last = int(next_proposal)
        current_next = current_last + 1

        if update_proposal_numbers(row_id, current_last, current_next):
            return {
                "outputFields": {
                    "last_proposal": current_last,
                    "next_proposal": current_next,
                    "error": ""
                }
            }
        else:
            return {
                "outputFields": {
                    "last_proposal": 0,
                    "next_proposal": 0,
                    "error": "Failed to update HubDB"
                }
            }

    except Exception as e:
        return {
            "outputFields": {
                "last_proposal": 0,
                "next_proposal": 0,
                "error": str(e)
            }
        }