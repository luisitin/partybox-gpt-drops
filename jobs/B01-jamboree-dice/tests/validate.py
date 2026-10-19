"""Real standards validator, not a hand-written schema approximation."""
import json,sys
from jsonschema import Draft202012Validator, FormatChecker
schema=json.load(open('schema.json',encoding='utf-8'))
Draft202012Validator.check_schema(schema)
v=Draft202012Validator(schema,format_checker=FormatChecker())
failed=0
for name in ('dice.json','odds.json'):
    errors=sorted(v.iter_errors(json.load(open(name,encoding='utf-8'))),key=lambda e:str(e.path))
    print(f'{name}: VALID' if not errors else f'{name}: INVALID ({len(errors)} errors)')
    for e in errors:print(str(list(e.path)),e.message)
    failed+=len(errors)
print(f'Draft 2020-12: schema valid; documents=2; errors={failed}; seed={sys.argv[1]}')
sys.exit(bool(failed))
