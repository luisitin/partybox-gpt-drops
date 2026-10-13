"""Independent standards-compliant development audit; no production dependency."""
import json,pathlib,sys
from jsonschema import Draft202012Validator
root=pathlib.Path(__file__).resolve().parent
schema=json.loads((root/'usa.schema.json').read_text());Draft202012Validator.check_schema(schema)
validator=Draft202012Validator(schema)
if len(sys.argv)>1:payload=json.loads(pathlib.Path(sys.argv[1]).read_text())
else:payload={'cases':[json.loads((root/'usa.json').read_text())]}
results=[]
for case in payload['cases']:results.append(not list(validator.iter_errors(case)))
print(json.dumps({'validator':'jsonschema Draft202012Validator','schemaValid':True,'cases':len(results),'valid':results,'passed':results[0]},separators=(',',':')))
